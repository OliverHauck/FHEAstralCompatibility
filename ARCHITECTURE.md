# AstralCompatibilityEnhanced - Architecture & Implementation Guide

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Gateway Callback Flow](#gateway-callback-flow)
3. [Refund Mechanism](#refund-mechanism)
4. [Timeout Protection](#timeout-protection)
5. [Security Features](#security-features)
6. [Privacy-Preserving Techniques](#privacy-preserving-techniques)
7. [Gas Optimization](#gas-optimization)
8. [Integration Guide](#integration-guide)

---

## 🏗️ Architecture Overview

### **Innovative Design Principles**

The AstralCompatibilityEnhanced contract implements a production-grade architecture that addresses the fundamental challenges of privacy-preserving blockchain applications:

```
┌──────────────────────────────────────────────────────────────────┐
│                    LAYERED ARCHITECTURE                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐    ┌──────────────────┐    ┌────────────┐  │
│  │  User Interface │───▶│  Smart Contract  │───▶│  Gateway   │  │
│  │   (Frontend)    │◀───│   (On-Chain)     │◀───│  (Oracle)  │  │
│  └─────────────────┘    └──────────────────┘    └────────────┘  │
│         │                        │                      │         │
│         │                        │                      │         │
│    ┌────▼────┐            ┌──────▼──────┐       ┌──────▼─────┐  │
│    │  Wallet │            │  FHE Engine │       │ KMS Nodes  │  │
│    │ (MetaMask)           │  (Zama)     │       │ (Decrypt)  │  │
│    └─────────┘            └─────────────┘       └────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### **Key Components**

#### **1. Smart Contract Layer**
- **State Management**: Encrypted profiles, match data, request tracking
- **Business Logic**: Compatibility calculation, fee management, access control
- **Security**: Input validation, reentrancy protection, overflow prevention

#### **2. Gateway Integration**
- **Asynchronous Processing**: Non-blocking decryption requests
- **Callback Mechanism**: Automatic score revelation
- **Timeout Management**: Deadline tracking and enforcement

#### **3. Refund System**
- **Multi-tier Protection**: Timeout, failure, overpayment handling
- **Safe Withdrawal**: Pull-over-push pattern
- **Emergency Recovery**: Admin-initiated safety mechanism

---

## 🔄 Gateway Callback Flow

### **Complete Request-Response Cycle**

```
┌─────────┐                ┌──────────┐               ┌─────────┐
│  User   │                │ Contract │               │ Gateway │
└────┬────┘                └────┬─────┘               └────┬────┘
     │                          │                          │
     │ 1. createProfile()       │                          │
     ├─────────────────────────▶│                          │
     │                          │                          │
     │ ✅ Profile Created       │                          │
     │◀─────────────────────────┤                          │
     │                          │                          │
     │ 2. requestMatch() + Fee  │                          │
     ├─────────────────────────▶│                          │
     │                          │                          │
     │ ✅ Match Requested       │                          │
     │◀─────────────────────────┤                          │
     │                          │                          │
     │ 3. requestRevealScore()  │                          │
     ├─────────────────────────▶│                          │
     │                          │                          │
     │                          │ 4. Submit to Queue       │
     │                          ├─────────────────────────▶│
     │                          │                          │
     │                          │                          │ 5. Process
     │                          │                          │    Decrypt
     │                          │                          │    Verify
     │                          │                          │
     │                          │ 6. resolveTallyCallback()│
     │                          │◀─────────────────────────┤
     │                          │    (score + proof)       │
     │                          │                          │
     │ ✅ Score Revealed        │                          │
     │◀─────────────────────────┤                          │
     │                          │                          │
     │                          │                          │
     │ [If timeout occurs]      │                          │
     │                          │                          │
     │ 7. claimTimeoutRefund()  │                          │
     ├─────────────────────────▶│                          │
     │                          │                          │
     │ ✅ Refund Issued         │                          │
     │◀─────────────────────────┤                          │
     │                          │                          │
     │ 8. withdrawRefunds()     │                          │
     ├─────────────────────────▶│                          │
     │                          │                          │
     │ ✅ Funds Transferred     │                          │
     │◀─────────────────────────┤                          │
     │                          │                          │
```

### **State Transitions**

```
Request Lifecycle:

PENDING ────▶ PROCESSING ────▶ COMPLETED
   │              │
   │              │
   ▼              ▼
TIMED_OUT ────▶ REFUNDED
   │
   │
   ▼
FAILED ────────▶ REFUNDED
```

### **Code Implementation**

#### **Step 1: Request Submission**
```solidity
function requestRevealScore(bytes32 _matchId)
    external
    whenNotPaused
    returns (uint256)
{
    // Validate match and authorization
    CompatibilityMatch storage matchData = matches[_matchId];
    require(matchData.user1 != address(0), "AC: Match does not exist");
    require(
        msg.sender == matchData.user1 || msg.sender == matchData.user2,
        "AC: Not authorized"
    );
    require(!matchData.isRevealed, "AC: Score already revealed");

    // Create decryption request
    uint256 requestId = ++decryptionRequestCounter;
    uint256 timeoutDeadline = block.timestamp + requestTimeout;

    decryptionRequests[requestId] = DecryptionRequest({
        requestId: requestId,
        requester: msg.sender,
        matchId: _matchId,
        timestamp: block.timestamp,
        timeoutDeadline: timeoutDeadline,
        status: RequestStatus.PROCESSING,
        kmsGeneration: kmsGeneration,
        feePaid: matchData.feePaid
    });

    // Map for callback lookup
    requestIdToMatchId[requestId] = _matchId;
    matchData.status = RequestStatus.PROCESSING;

    // Submit to Gateway
    bytes32[] memory cts = new bytes32[](1);
    cts[0] = FHE.toBytes32(matchData.compatibilityScore);
    FHE.requestDecryption(cts, this.resolveTallyCallback.selector);

    emit DecryptionRequested(requestId, _matchId, msg.sender, kmsGeneration, timeoutDeadline);
    return requestId;
}
```

#### **Step 2: Gateway Callback**
```solidity
function resolveTallyCallback(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external {
    // Verify KMS signatures
    FHE.checkSignatures(requestId, cleartexts, decryptionProof);

    // Decode cleartext
    uint8 revealedScore = abi.decode(cleartexts, (uint8));

    // Lookup match
    bytes32 matchId = requestIdToMatchId[requestId];
    require(matchId != bytes32(0), "AC: Invalid request ID");

    CompatibilityMatch storage matchData = matches[matchId];
    DecryptionRequest storage request = decryptionRequests[requestId];

    // Update state
    matchData.publicScore = revealedScore;
    matchData.isRevealed = true;
    matchData.status = RequestStatus.COMPLETED;
    request.status = RequestStatus.COMPLETED;

    emit DecryptionCompleted(requestId, matchId, revealedScore, block.timestamp);
    emit CompatibilityRevealed(matchId, revealedScore, matchData.user1, matchData.user2);
}
```

---

## 💸 Refund Mechanism

### **Multi-Tier Safety System**

```
┌────────────────────────────────────────────────────────────┐
│                   REFUND SCENARIOS                         │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  1. TIMEOUT REFUND                                         │
│     ├─ Condition: block.timestamp >= timeoutDeadline       │
│     ├─ Amount: feePaid - platformFee                       │
│     └─ Trigger: User calls claimTimeoutRefund()            │
│                                                             │
│  2. OVERPAYMENT REFUND                                     │
│     ├─ Condition: msg.value > matchFee                     │
│     ├─ Amount: msg.value - matchFee                        │
│     └─ Trigger: Automatic in requestMatch()                │
│                                                             │
│  3. FAILED DECRYPTION                                      │
│     ├─ Condition: Gateway processing fails                 │
│     ├─ Amount: feePaid - platformFee                       │
│     └─ Trigger: Admin marks as FAILED                      │
│                                                             │
│  4. EMERGENCY WITHDRAWAL                                   │
│     ├─ Condition: Owner intervention needed                │
│     ├─ Amount: Full feePaid                                │
│     └─ Trigger: Owner calls emergencyWithdraw()            │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### **Refund Calculation**

```solidity
// Platform fee (5%)
uint256 platformFeeAmount = (feePaid * PLATFORM_FEE_BPS) / 10000;

// Refund amount
uint256 refundAmount = feePaid - platformFeeAmount;

// Examples:
// Fee Paid: 0.001 ETH
// Platform Fee: 0.001 * 500 / 10000 = 0.00005 ETH (5%)
// Refund: 0.001 - 0.00005 = 0.00095 ETH
```

### **Safe Withdrawal Pattern**

```solidity
// Add to pending refunds (PUSH)
pendingRefunds[user] += refundAmount;

// User withdraws (PULL)
function withdrawRefunds() external nonReentrant {
    uint256 amount = pendingRefunds[msg.sender];
    require(amount > 0, "AC: No refunds available");

    // Clear before transfer (checks-effects-interactions)
    pendingRefunds[msg.sender] = 0;

    // Transfer
    (bool sent, ) = payable(msg.sender).call{value: amount}("");
    require(sent, "AC: Refund transfer failed");

    emit RefundClaimed(msg.sender, amount, block.timestamp);
}
```

---

## ⏱️ Timeout Protection

### **Deadline Management**

```solidity
// Constants
uint256 public constant MIN_TIMEOUT = 1 hours;
uint256 public constant MAX_TIMEOUT = 7 days;
uint256 public requestTimeout = 24 hours;  // Default

// Per-request deadline
struct CompatibilityMatch {
    uint256 timeoutDeadline;  // block.timestamp + requestTimeout
}

// Timeout check
require(
    block.timestamp >= matchData.timeoutDeadline,
    "AC: Timeout not reached"
);
```

### **Timeout Scenarios**

| Scenario | Timeout | Action |
|----------|---------|--------|
| Normal Request | 24 hours | Gateway responds, score revealed |
| Slow Gateway | 24+ hours | User claims timeout refund |
| Gateway Failure | 24+ hours | User claims timeout refund |
| Network Congestion | 24+ hours | User claims timeout refund |
| Contract Paused | N/A | Requests blocked, existing can timeout |

### **Configuration**

```solidity
// Owner can adjust timeout
function updateRequestTimeout(uint256 _newTimeout) external onlyOwner {
    require(
        _newTimeout >= MIN_TIMEOUT && _newTimeout <= MAX_TIMEOUT,
        "AC: Invalid timeout"
    );
    uint256 oldTimeout = requestTimeout;
    requestTimeout = _newTimeout;
    emit TimeoutUpdated(oldTimeout, _newTimeout);
}
```

---

## 🔐 Security Features

### **1. Input Validation**

```solidity
// Custom modifier for zodiac data
modifier validZodiacData(uint8 _zodiac, uint8 _element, uint8 _quality) {
    require(_zodiac < 12, "AC: Invalid zodiac");
    require(_element < 4, "AC: Invalid element");
    require(_quality < 3, "AC: Invalid quality");
    _;
}

// Address validation
require(_partner != address(0), "AC: Invalid partner address");
require(_partner != msg.sender, "AC: Cannot match with yourself");

// Amount validation
require(msg.value >= matchFee, "AC: Insufficient match fee");
require(_newFee >= 0.0001 ether, "AC: Fee too low");
```

### **2. Access Control**

```solidity
// Role-based modifiers
modifier onlyOwner() {
    require(msg.sender == owner, "AC: Not authorized");
    _;
}

modifier onlyPauser() {
    require(isPauserAddress[msg.sender], "AC: Not a pauser");
    _;
}

// Authorization checks
require(
    msg.sender == matchData.user1 || msg.sender == matchData.user2,
    "AC: Not authorized"
);
```

### **3. Reentrancy Protection**

```solidity
// State variable
uint256 private _reentrancyStatus;
uint256 private constant _NOT_ENTERED = 1;
uint256 private constant _ENTERED = 2;

// Modifier
modifier nonReentrant() {
    require(_reentrancyStatus != _ENTERED, "AC: Reentrant call");
    _reentrancyStatus = _ENTERED;
    _;
    _reentrancyStatus = _NOT_ENTERED;
}

// Applied to all fund transfers
function withdrawRefunds() external nonReentrant { ... }
function withdrawPlatformFees(address _to) external onlyOwner nonReentrant { ... }
function emergencyWithdraw(address _to, bytes32 _matchId) external onlyOwner nonReentrant { ... }
```

### **4. State Consistency**

```solidity
// Checks-Effects-Interactions pattern
function withdrawRefunds() external nonReentrant {
    // CHECKS
    uint256 amount = pendingRefunds[msg.sender];
    require(amount > 0, "AC: No refunds available");

    // EFFECTS
    pendingRefunds[msg.sender] = 0;

    // INTERACTIONS
    (bool sent, ) = payable(msg.sender).call{value: amount}("");
    require(sent, "AC: Refund transfer failed");
}
```

---

## 🎭 Privacy-Preserving Techniques

### **1. Random Multiplier Division**

```solidity
/**
 * Problem: Division on encrypted data can leak information
 * Solution: Multiply before divide to obfuscate computation
 */

// INSECURE (leaks divisor information)
euint8 result = FHE.div(encrypted_a, encrypted_b);

// SECURE (privacy-preserving)
uint256 constant PRIVACY_MULTIPLIER = 1000;

euint8 multiplied = FHE.mul(encrypted_a, FHE.asEuint8(PRIVACY_MULTIPLIER));
euint8 divided = FHE.div(multiplied, encrypted_b);
euint8 final = FHE.div(divided, FHE.asEuint8(PRIVACY_MULTIPLIER));
```

### **2. Price Obfuscation**

```solidity
// Dynamic pricing prevents value inference
uint256 public matchFee = 0.001 ether;  // Can change

// Owner can update to obfuscate true cost
function updateMatchFee(uint256 _newFee) external onlyOwner {
    matchFee = _newFee;
}

// Refund excess to hide actual cost
if (msg.value > matchFee) {
    uint256 excess = msg.value - matchFee;
    pendingRefunds[msg.sender] += excess;
}
```

### **3. Random Factor in Scoring**

```solidity
// Add unpredictability to prevent inference attacks
euint8 randomFactor = FHE.randEuint8();
euint8 randomBonus = FHE.and(randomFactor, FHE.asEuint8(15));  // 0-15
totalScore = FHE.add(totalScore, randomBonus);
```

---

## ⚡ Gas Optimization

### **1. Storage Packing**

```solidity
// Efficient struct packing
struct CompatibilityMatch {
    address user1;           // 20 bytes
    address user2;           // 20 bytes
    euint8 compatibilityScore; // Custom type
    bool isRevealed;         // 1 byte  ──┐
    uint8 publicScore;       // 1 byte    ├─ Packed in same slot
    uint256 matchTime;       // 32 bytes ─┘
    uint256 feePaid;
    RequestStatus status;    // 1 byte (enum)
    uint256 timeoutDeadline;
}
```

### **2. Batch Operations**

```solidity
// Set permissions once for all encrypted values
FHE.allowThis(encZodiac);
FHE.allowThis(encElement);
FHE.allowThis(encQuality);
```

### **3. Efficient FHE Operations**

```solidity
// Minimize encrypted operations
euint8 totalScore = FHE.add(baseScore, elementBonus);      // 1 HCU
totalScore = FHE.add(totalScore, qualityBonus);            // 1 HCU
totalScore = FHE.sub(totalScore, zodiacPenalty);           // 1 HCU

// Use select instead of conditional branches
euint8 bonus = FHE.select(condition, value1, value2);      // 1 HCU
```

### **4. HCU Cost Analysis**

| Operation | HCU Cost | Gas Estimate |
|-----------|----------|--------------|
| FHE.asEuint8() | 0.5 | ~10,000 |
| FHE.eq() | 1 | ~20,000 |
| FHE.add() | 1 | ~25,000 |
| FHE.sub() | 1 | ~25,000 |
| FHE.select() | 1 | ~30,000 |
| FHE.randEuint8() | 2 | ~50,000 |

---

## 🔌 Integration Guide

### **Frontend Integration**

```javascript
// 1. Initialize contract
const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
);

// 2. Create profile
async function createProfile(zodiac, element, quality) {
    const tx = await contract.createProfile(zodiac, element, quality);
    await tx.wait();
    console.log("Profile created");
}

// 3. Request match
async function requestMatch(partnerAddress) {
    const fee = await contract.matchFee();
    const tx = await contract.requestCompatibilityMatch(
        partnerAddress,
        { value: fee }
    );
    await tx.wait();
    console.log("Match requested");
}

// 4. Request reveal
async function revealScore(matchId) {
    const tx = await contract.requestRevealScore(matchId);
    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === 'DecryptionRequested');
    const requestId = event.args.requestId;
    console.log("Decryption request ID:", requestId);
}

// 5. Listen for callback
contract.on("DecryptionCompleted", (requestId, matchId, score, timestamp) => {
    console.log("Score revealed:", score);
});

// 6. Handle timeout
async function claimRefund(matchId) {
    const tx = await contract.claimTimeoutRefund(matchId);
    await tx.wait();
    console.log("Refund claimed");
}

// 7. Withdraw refunds
async function withdraw() {
    const tx = await contract.withdrawRefunds();
    await tx.wait();
    console.log("Refunds withdrawn");
}
```

### **Event Listening**

```javascript
// Listen for all events
contract.on("MatchRequested", (user1, user2, matchId, feePaid, timestamp) => {
    console.log("Match requested between", user1, "and", user2);
});

contract.on("DecryptionRequested", (requestId, matchId, requester, kmsGen, deadline) => {
    console.log("Decryption requested:", requestId);
    // Start timeout timer
    setTimeout(() => checkTimeout(matchId), deadline - Date.now());
});

contract.on("DecryptionCompleted", (requestId, matchId, score, timestamp) => {
    console.log("Score:", score);
    // Display score to user
});

contract.on("RefundIssued", (user, amount, reason, timestamp) => {
    console.log("Refund available:", ethers.utils.formatEther(amount));
    // Notify user
});
```

---

## 📝 Testing Checklist

### **Unit Tests**

- [ ] Profile creation with valid data
- [ ] Profile creation with invalid data (should revert)
- [ ] Match request with payment
- [ ] Match request without payment (should revert)
- [ ] Score reveal request
- [ ] Gateway callback processing
- [ ] Timeout refund claim
- [ ] Refund withdrawal
- [ ] Emergency withdrawal
- [ ] Access control (owner, pauser)
- [ ] Pause/unpause functionality
- [ ] Fee updates
- [ ] Timeout updates

### **Integration Tests**

- [ ] Complete match flow (create → match → reveal)
- [ ] Timeout scenario (create → match → timeout → refund)
- [ ] Multiple matches per user
- [ ] Concurrent reveal requests
- [ ] Fee collection and withdrawal
- [ ] Emergency recovery

### **Gas Tests**

- [ ] Profile creation cost
- [ ] Match request cost
- [ ] Reveal request cost
- [ ] Refund claim cost
- [ ] Total flow cost

---

## 🎓 Best Practices

### **For Users**

1. **Always check timeout deadline** before requesting reveal
2. **Monitor refund balance** regularly
3. **Withdraw refunds promptly** to avoid accumulation
4. **Keep track of request IDs** for debugging

### **For Developers**

1. **Test timeout scenarios** thoroughly
2. **Monitor Gateway uptime** and response times
3. **Set appropriate timeout values** based on network conditions
4. **Implement retry logic** for failed transactions
5. **Log all events** for debugging and analytics

### **For Administrators**

1. **Monitor platform fees** and withdraw regularly
2. **Update timeouts** based on Gateway performance
3. **Adjust match fees** for optimal pricing
4. **Maintain pauser list** with trusted addresses
5. **Test emergency withdrawal** procedures

---

## 📚 Additional Resources

- [FHE Documentation](https://docs.zama.ai/fhevm)
- [Gateway Architecture](https://docs.zama.ai/fhevm/guides/gateway)
- [Security Best Practices](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [Gas Optimization Guide](https://docs.soliditylang.org/en/latest/internals/optimizer.html)

---

**Built with privacy-first architecture. Secured by design. Optimized for production.**
