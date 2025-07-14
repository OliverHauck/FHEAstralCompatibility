// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AstralCompatibility Mock
 * @notice Mock version for Sepolia deployment - simulates FHE without actual encryption
 * @dev This version uses regular uint8 instead of encrypted types for Sepolia testing
 */
contract AstralCompatibilityMock {

    address public owner;
    uint256 public totalMatches;

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
        uint8 zodiac;           // Zodiac sign (stored as plain for mock)
        uint8 element;          // Element (0-3: Fire, Earth, Air, Water)
        uint8 quality;          // Quality (0-2: Cardinal, Fixed, Mutable)
        bool hasProfile;
        uint256 timestamp;
    }

    struct CompatibilityMatch {
        address user1;
        address user2;
        uint8 compatibilityScore;   // Calculated score
        bool isRevealed;
        uint8 publicScore;          // Public score (after reveal)
        uint256 matchTime;
    }

    mapping(address => UserProfile) public userProfiles;
    mapping(bytes32 => CompatibilityMatch) public matches;
    mapping(address => uint256) public userMatchCount;

    event ProfileCreated(address indexed user);
    event MatchRequested(address indexed user1, address indexed user2, bytes32 matchId);
    event CompatibilityRevealed(bytes32 indexed matchId, uint8 score);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier hasProfile(address user) {
        require(userProfiles[user].hasProfile, "User has no profile");
        _;
    }

    constructor() {
        owner = msg.sender;
        totalMatches = 0;
    }

    /**
     * @notice Create user profile
     * @param _zodiac Zodiac sign (0-11)
     * @param _element Element type (0-3)
     * @param _quality Quality type (0-2)
     */
    function createProfile(
        uint8 _zodiac,
        uint8 _element,
        uint8 _quality
    ) external {
        require(_zodiac < 12, "Invalid zodiac");
        require(_element < 4, "Invalid element");
        require(_quality < 3, "Invalid quality");
        require(!userProfiles[msg.sender].hasProfile, "Profile already exists");

        userProfiles[msg.sender] = UserProfile({
            zodiac: _zodiac,
            element: _element,
            quality: _quality,
            hasProfile: true,
            timestamp: block.timestamp
        });

        emit ProfileCreated(msg.sender);
    }

    /**
     * @notice Request compatibility match with another user
     * @param _partner Address of the partner to match with
     */
    function requestCompatibilityMatch(address _partner) external
        hasProfile(msg.sender)
        hasProfile(_partner)
    {
        require(_partner != msg.sender, "Cannot match with yourself");

        bytes32 matchId = generateMatchId(msg.sender, _partner);
        require(matches[matchId].user1 == address(0), "Match already exists");

        // Calculate compatibility score (mock version)
        uint8 compatibilityScore = calculateCompatibility(msg.sender, _partner);

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

        emit MatchRequested(msg.sender, _partner, matchId);
    }

    /**
     * @notice Calculate compatibility score (mock version without encryption)
     * @dev This is a simplified version for Sepolia testing
     */
    function calculateCompatibility(address _user1, address _user2)
        private
        view
        returns (uint8)
    {
        UserProfile storage profile1 = userProfiles[_user1];
        UserProfile storage profile2 = userProfiles[_user2];

        // Base score: 50
        uint8 score = 50;

        // Element compatibility bonus: +20 if same
        if (profile1.element == profile2.element) {
            score += 20;
        }

        // Quality compatibility bonus: +15 if same
        if (profile1.quality == profile2.quality) {
            score += 15;
        }

        // Same zodiac penalty: -10 if same
        if (profile1.zodiac == profile2.zodiac) {
            score -= 10;
        }

        // Add pseudo-random factor: 0-15
        uint256 randomSeed = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            _user1,
            _user2
        )));
        uint8 randomBonus = uint8(randomSeed % 16);
        score += randomBonus;

        // Ensure score is in valid range (0-100)
        if (score > 100) score = 100;

        return score;
    }

    /**
     * @notice Request reveal of compatibility score
     * @param _matchId Match ID to reveal
     */
    function revealCompatibilityScore(bytes32 _matchId) external {
        CompatibilityMatch storage matchData = matches[_matchId];
        require(matchData.user1 != address(0), "Match does not exist");
        require(msg.sender == matchData.user1 || msg.sender == matchData.user2, "Not authorized");
        require(!matchData.isRevealed, "Score already revealed");

        // Mark as revealed and set public score
        matchData.isRevealed = true;
        matchData.publicScore = matchData.compatibilityScore;

        emit CompatibilityRevealed(_matchId, matchData.compatibilityScore);
    }

    /**
     * @notice Process score reveal (for compatibility with original interface)
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
        returns (bool hasProfile, uint256 timestamp)
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
    ) external hasProfile(msg.sender) {
        require(_zodiac < 12, "Invalid zodiac");
        require(_element < 4, "Invalid element");
        require(_quality < 3, "Invalid quality");

        UserProfile storage profile = userProfiles[msg.sender];

        // Update data
        profile.zodiac = _zodiac;
        profile.element = _element;
        profile.quality = _quality;
        profile.timestamp = block.timestamp;
    }
}
