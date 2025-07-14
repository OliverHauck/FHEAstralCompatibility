// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title AstralCompatibility v2.0
 * @notice Privacy-preserving zodiac compatibility matching using FHE - MIGRATED
 * @dev Migrated to support new Gateway contract specifications
 * Changes:
 * - Added NUM_PAUSERS and PAUSER_ADDRESS_[0-N] support
 * - Renamed kmsManagement to kmsGeneration
 * - Replaced check...() functions with is...() boolean returns
 * - Added new Decryption events with individual KMS responses
 * - Implemented transaction input re-randomization support
 */
contract AstralCompatibility is SepoliaConfig {

    address public owner;
    uint256 public totalMatches;

    // Gateway and KMS Configuration (NEW)
    uint256 public kmsGeneration;
    address[] public pauserAddresses;
    bool public isPaused;
    mapping(address => bool) public isPauserAddress;
    uint256 public decryptionRequestCounter;

    // Zodiac signs (0-11)
    enum Zodiac {
        ARIES,      // 0
        TAURUS,     // 1
        GEMINI,     // 2
        CANCER,     // 3
        LEO,        // 4
        VIRGO,      // 5
        LIBRA,      // 6
        SCORPIO,    // 7
        SAGITTARIUS,// 8
        CAPRICORN,  // 9
        AQUARIUS,   // 10
        PISCES      // 11
    }

    struct UserProfile {
        euint8 encryptedZodiac;     // Encrypted zodiac sign
        euint8 encryptedElement;    // Encrypted element (0-3: Fire, Earth, Air, Water)
        euint8 encryptedQuality;    // Encrypted quality (0-2: Cardinal, Fixed, Mutable)
        bool hasProfile;
        uint256 timestamp;
    }

    struct CompatibilityMatch {
        address user1;
        address user2;
        euint8 compatibilityScore;  // Encrypted compatibility score
        bool isRevealed;
        uint8 publicScore;          // Public score (after reveal)
        uint256 matchTime;
    }

    // Decryption Request Struct (NEW)
    struct DecryptionRequest {
        uint256 requestId;
        address requester;
        bytes32 matchId;
        uint256 timestamp;
        bool fulfilled;
        uint256 kmsGeneration;
    }

    mapping(address => UserProfile) public userProfiles;
    mapping(bytes32 => CompatibilityMatch) public matches;
    mapping(address => uint256) public userMatchCount;
    mapping(uint256 => DecryptionRequest) public decryptionRequests; // NEW

    // Original Events
    event ProfileCreated(address indexed user);
    event MatchRequested(address indexed user1, address indexed user2, bytes32 matchId);
    event CompatibilityRevealed(bytes32 indexed matchId, uint8 score);

    // NEW Gateway Events - Individual KMS responses
    event DecryptionRequested(
        uint256 indexed requestId,
        bytes32 indexed matchId,
        address indexed requester,
        uint256 kmsGeneration,
        uint256 timestamp
    );

    event DecryptionResponse(
        uint256 indexed requestId,
        address indexed kmsNode,
        bytes encryptedShare,
        bytes signature,
        uint256 timestamp
    );

    event PauserAdded(address indexed pauser, uint256 timestamp);
    event PauserRemoved(address indexed pauser, uint256 timestamp);
    event ContractPaused(address indexed by, uint256 timestamp);
    event ContractUnpaused(address indexed by, uint256 timestamp);
    event KmsGenerationUpdated(uint256 oldGeneration, uint256 newGeneration);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier hasProfile(address user) {
        require(userProfiles[user].hasProfile, "User has no profile");
        _;
    }

    modifier onlyPauser() {
        require(isPauserAddress[msg.sender], "Not a pauser");
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    constructor(address[] memory _pauserAddresses, uint256 _kmsGeneration) {
        owner = msg.sender;
        totalMatches = 0;
        kmsGeneration = _kmsGeneration;
        isPaused = false;
        decryptionRequestCounter = 0;

        // Initialize pauser addresses
        for (uint256 i = 0; i < _pauserAddresses.length; i++) {
            pauserAddresses.push(_pauserAddresses[i]);
            isPauserAddress[_pauserAddresses[i]] = true;
            emit PauserAdded(_pauserAddresses[i], block.timestamp);
        }
    }

    // ==================== NEW GATEWAY FUNCTIONS ====================

    /**
     * @notice Add a new pauser address (only owner)
     * @param _pauser The address to add as pauser
     */
    function addPauser(address _pauser) external onlyOwner {
        require(_pauser != address(0), "Invalid pauser address");
        require(!isPauserAddress[_pauser], "Already a pauser");

        pauserAddresses.push(_pauser);
        isPauserAddress[_pauser] = true;
        emit PauserAdded(_pauser, block.timestamp);
    }

    /**
     * @notice Remove a pauser address (only owner)
     * @param _pauser The address to remove
     */
    function removePauser(address _pauser) external onlyOwner {
        require(isPauserAddress[_pauser], "Not a pauser");

        isPauserAddress[_pauser] = false;

        // Remove from array
        for (uint256 i = 0; i < pauserAddresses.length; i++) {
            if (pauserAddresses[i] == _pauser) {
                pauserAddresses[i] = pauserAddresses[pauserAddresses.length - 1];
                pauserAddresses.pop();
                break;
            }
        }

        emit PauserRemoved(_pauser, block.timestamp);
    }

    /**
     * @notice Pause the contract (only pausers)
     */
    function pause() external onlyPauser {
        require(!isPaused, "Already paused");
        isPaused = true;
        emit ContractPaused(msg.sender, block.timestamp);
    }

    /**
     * @notice Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        require(isPaused, "Not paused");
        isPaused = false;
        emit ContractUnpaused(msg.sender, block.timestamp);
    }

    /**
     * @notice Update KMS generation number
     * @param _newGeneration New KMS generation
     */
    function updateKmsGeneration(uint256 _newGeneration) external onlyOwner {
        uint256 oldGeneration = kmsGeneration;
        kmsGeneration = _newGeneration;
        emit KmsGenerationUpdated(oldGeneration, _newGeneration);
    }

    // ==================== ORIGINAL FUNCTIONS (with whenNotPaused) ====================

    /**
     * @notice Create encrypted user profile
     * @param _zodiac Zodiac sign (0-11)
     * @param _element Element type (0-3)
     * @param _quality Quality type (0-2)
     * @dev All transaction inputs are re-randomized before FHE evaluation (automatic)
     */
    function createProfile(
        uint8 _zodiac,
        uint8 _element,
        uint8 _quality
    ) external whenNotPaused {
        require(_zodiac < 12, "Invalid zodiac");
        require(_element < 4, "Invalid element");
        require(_quality < 3, "Invalid quality");
        require(!userProfiles[msg.sender].hasProfile, "Profile already exists");

        // Encrypt user profile data
        euint8 encZodiac = FHE.asEuint8(_zodiac);
        euint8 encElement = FHE.asEuint8(_element);
        euint8 encQuality = FHE.asEuint8(_quality);

        userProfiles[msg.sender] = UserProfile({
            encryptedZodiac: encZodiac,
            encryptedElement: encElement,
            encryptedQuality: encQuality,
            hasProfile: true,
            timestamp: block.timestamp
        });

        // Set access permissions
        FHE.allowThis(encZodiac);
        FHE.allowThis(encElement);
        FHE.allowThis(encQuality);
        FHE.allow(encZodiac, msg.sender);
        FHE.allow(encElement, msg.sender);
        FHE.allow(encQuality, msg.sender);

        emit ProfileCreated(msg.sender);
    }

    /**
     * @notice Request compatibility match with another user
     * @param _partner Address of the partner to match with
     */
    function requestCompatibilityMatch(address _partner) external
        whenNotPaused
        hasProfile(msg.sender)
        hasProfile(_partner)
    {
        require(_partner != msg.sender, "Cannot match with yourself");

        bytes32 matchId = generateMatchId(msg.sender, _partner);
        require(matches[matchId].user1 == address(0), "Match already exists");

        // Calculate encrypted compatibility score
        euint8 compatibilityScore = calculateCompatibility(msg.sender, _partner);

        matches[matchId] = CompatibilityMatch({
            user1: msg.sender,
            user2: _partner,
            compatibilityScore: compatibilityScore,
            isRevealed: false,
            publicScore: 0,
            matchTime: block.timestamp
        });

        userMatchCount[msg.sender]++;
        userMatchCount[_partner]++;
        totalMatches++;

        // Set access permissions for the score
        FHE.allowThis(compatibilityScore);
        FHE.allow(compatibilityScore, msg.sender);
        FHE.allow(compatibilityScore, _partner);

        emit MatchRequested(msg.sender, _partner, matchId);
    }

    /**
     * @notice Calculate compatibility score (encrypted)
     * @dev This happens entirely on encrypted data
     */
    function calculateCompatibility(address _user1, address _user2)
        private
        returns (euint8)
    {
        UserProfile storage profile1 = userProfiles[_user1];
        UserProfile storage profile2 = userProfiles[_user2];

        // Base score: 50
        euint8 baseScore = FHE.asEuint8(50);

        // Element compatibility bonus: +20 if same
        ebool sameElement = FHE.eq(profile1.encryptedElement, profile2.encryptedElement);
        euint8 elementBonus = FHE.select(sameElement, FHE.asEuint8(20), FHE.asEuint8(0));

        // Quality compatibility bonus: +15 if same
        ebool sameQuality = FHE.eq(profile1.encryptedQuality, profile2.encryptedQuality);
        euint8 qualityBonus = FHE.select(sameQuality, FHE.asEuint8(15), FHE.asEuint8(0));

        // Same zodiac penalty: -10 if same
        ebool sameZodiac = FHE.eq(profile1.encryptedZodiac, profile2.encryptedZodiac);
        euint8 zodiacPenalty = FHE.select(sameZodiac, FHE.asEuint8(10), FHE.asEuint8(0));

        // Calculate total score
        euint8 totalScore = FHE.add(baseScore, elementBonus);
        totalScore = FHE.add(totalScore, qualityBonus);
        totalScore = FHE.sub(totalScore, zodiacPenalty);

        // Add randomness: 0-15
        euint8 randomFactor = FHE.randEuint8();
        euint8 randomBonus = FHE.and(randomFactor, FHE.asEuint8(15));
        totalScore = FHE.add(totalScore, randomBonus);

        return totalScore;
    }

    /**
     * @notice Request reveal of compatibility score via Gateway
     * @param _matchId Match ID to reveal
     * @dev Triggers decryption request to Gateway/KMS nodes
     * @return requestId The ID of the decryption request
     */
    function revealCompatibilityScore(bytes32 _matchId) external whenNotPaused returns (uint256) {
        CompatibilityMatch storage matchData = matches[_matchId];
        require(matchData.user1 != address(0), "Match does not exist");
        require(msg.sender == matchData.user1 || msg.sender == matchData.user2, "Not authorized");
        require(!matchData.isRevealed, "Score already revealed");

        // Create decryption request
        uint256 requestId = ++decryptionRequestCounter;

        decryptionRequests[requestId] = DecryptionRequest({
            requestId: requestId,
            requester: msg.sender,
            matchId: _matchId,
            timestamp: block.timestamp,
            fulfilled: false,
            kmsGeneration: kmsGeneration
        });

        // Mark as reveal requested
        matchData.isRevealed = true;

        emit DecryptionRequested(
            requestId,
            _matchId,
            msg.sender,
            kmsGeneration,
            block.timestamp
        );

        return requestId;
    }

    /**
     * @notice Submit decryption response from KMS node (NEW)
     * @dev Each KMS node submits its own response separately
     */
    function submitDecryptionResponse(
        uint256 _requestId,
        bytes calldata _encryptedShare,
        bytes calldata _signature
    ) external {
        require(decryptionRequests[_requestId].requestId == _requestId, "Invalid request");

        emit DecryptionResponse(
            _requestId,
            msg.sender,
            _encryptedShare,
            _signature,
            block.timestamp
        );
    }

    /**
     * @notice Process score reveal (called by owner/gateway)
     * @param matchId Match ID
     * @param decryptedValue Decrypted compatibility score
     */
    function processScoreReveal(
        bytes32 matchId,
        uint8 decryptedValue
    ) external onlyOwner {
        CompatibilityMatch storage matchData = matches[matchId];
        require(matchData.user1 != address(0), "Match does not exist");
        require(matchData.isRevealed, "Not ready for reveal");

        matchData.publicScore = decryptedValue;

        emit CompatibilityRevealed(matchId, decryptedValue);
    }

    // ==================== REPLACED check...() WITH is...() ====================

    /**
     * @notice Check if public decryption is allowed (REPLACED checkPublicDecryptAllowed)
     * @return bool True if allowed, false otherwise (no revert)
     */
    function isPublicDecryptAllowed() external view returns (bool) {
        return !isPaused;
    }

    /**
     * @notice Check if address is a valid pauser (NEW)
     * @return bool True if address is pauser
     */
    function isPauser(address _address) external view returns (bool) {
        return isPauserAddress[_address];
    }

    /**
     * @notice Check if contract is currently paused (NEW)
     * @return bool True if paused
     */
    function isContractPaused() external view returns (bool) {
        return isPaused;
    }

    /**
     * @notice Check if match is valid (NEW)
     * @return bool True if valid
     */
    function isMatchValid(bytes32 _matchId) external view returns (bool) {
        return matches[_matchId].user1 != address(0);
    }

    /**
     * @notice Generate unique match ID from two addresses
     */
    function generateMatchId(address _user1, address _user2)
        public
        pure
        returns (bytes32)
    {
        // Ensure ID uniqueness regardless of address order
        if (_user1 < _user2) {
            return keccak256(abi.encodePacked(_user1, _user2));
        } else {
            return keccak256(abi.encodePacked(_user2, _user1));
        }
    }

    /**
     * @notice Get user profile status
     */
    function getUserProfileStatus(address _user)
        external
        view
        returns (bool profileExists, uint256 timestamp)
    {
        UserProfile storage profile = userProfiles[_user];
        return (profile.hasProfile, profile.timestamp);
    }

    /**
     * @notice Get match information
     */
    function getMatchInfo(bytes32 _matchId)
        external
        view
        returns (
            address user1,
            address user2,
            bool isRevealed,
            uint8 publicScore,
            uint256 matchTime
        )
    {
        CompatibilityMatch storage matchData = matches[_matchId];
        return (
            matchData.user1,
            matchData.user2,
            matchData.isRevealed,
            matchData.publicScore,
            matchData.matchTime
        );
    }

    /**
     * @notice Get user statistics
     */
    function getUserStats(address _user)
        external
        view
        returns (uint256 matchCount)
    {
        return userMatchCount[_user];
    }

    /**
     * @notice Get zodiac information (reference only)
     */
    function getZodiacInfo(uint8 _zodiac)
        external
        pure
        returns (string memory name, uint8 element, uint8 quality)
    {
        require(_zodiac < 12, "Invalid zodiac");

        string[12] memory zodiacNames = [
            "Aries", "Taurus", "Gemini", "Cancer",
            "Leo", "Virgo", "Libra", "Scorpio",
            "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ];

        uint8[12] memory elements = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
        uint8[12] memory qualities = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2];

        return (zodiacNames[_zodiac], elements[_zodiac], qualities[_zodiac]);
    }

    /**
     * @notice Update user profile
     */
    function updateProfile(
        uint8 _zodiac,
        uint8 _element,
        uint8 _quality
    ) external whenNotPaused hasProfile(msg.sender) {
        require(_zodiac < 12, "Invalid zodiac");
        require(_element < 4, "Invalid element");
        require(_quality < 3, "Invalid quality");

        UserProfile storage profile = userProfiles[msg.sender];

        // Update encrypted data
        profile.encryptedZodiac = FHE.asEuint8(_zodiac);
        profile.encryptedElement = FHE.asEuint8(_element);
        profile.encryptedQuality = FHE.asEuint8(_quality);
        profile.timestamp = block.timestamp;

        // Reset permissions
        FHE.allowThis(profile.encryptedZodiac);
        FHE.allowThis(profile.encryptedElement);
        FHE.allowThis(profile.encryptedQuality);
        FHE.allow(profile.encryptedZodiac, msg.sender);
        FHE.allow(profile.encryptedElement, msg.sender);
        FHE.allow(profile.encryptedQuality, msg.sender);
    }

    // ==================== NEW GATEWAY QUERY FUNCTIONS ====================

    /**
     * @notice Get pauser count (NEW)
     */
    function getPauserCount() external view returns (uint256) {
        return pauserAddresses.length;
    }

    /**
     * @notice Get pauser at index (NEW)
     */
    function getPauserAtIndex(uint256 _index) external view returns (address) {
        require(_index < pauserAddresses.length, "Index out of bounds");
        return pauserAddresses[_index];
    }

    /**
     * @notice Get decryption request info (NEW)
     */
    function getDecryptionRequestInfo(uint256 _requestId) external view returns (
        address requester,
        bytes32 matchId,
        uint256 timestamp,
        bool fulfilled,
        uint256 kmsGen
    ) {
        DecryptionRequest storage request = decryptionRequests[_requestId];
        return (
            request.requester,
            request.matchId,
            request.timestamp,
            request.fulfilled,
            request.kmsGeneration
        );
    }
}
