# 🧪 Testing Documentation

## Test Suite Overview

**Total Test Cases**: 52
**Coverage Target**: >90%
**Framework**: Hardhat + Mocha + Chai

---

## Running Tests

### Basic Test Execution
```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/AstralCompatibility.test.js

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Generate coverage report
npx hardhat coverage
```

### Test Categories

#### 1. Deployment & Initialization (5 tests)
- Owner setup verification
- Initial state checks (totalMatches, isPaused)
- Contract address validation
- KMS generation initialization

#### 2. Profile Creation (9 tests)
- Valid zodiac sign creation (all 12 signs)
- Invalid input rejection (zodiac, element, quality)
- Duplicate profile prevention
- Event emission verification
- Paused state handling
- Timestamp verification

#### 3. Compatibility Matching (10 tests)
- Successful match requests
- Edge case handling (self-match, non-existent profiles)
- Match counter increments
- Unique match ID generation
- Paused state handling
- Bidirectional matching
- Profile existence verification

#### 4. Score Revelation (4 tests)
- Authorized revelation (both participants)
- Gateway decryption flow
- Non-participant rejection
- Non-existent match handling

#### 5. Owner Functions (10 tests)
- Pauser management (add/remove)
- Pause/unpause functionality
- KMS generation updates
- Access control enforcement
- Non-owner rejection tests

#### 6. Gateway & KMS Integration (5 tests)
- Decryption request tracking
- Multi-pauser handling
- Pauser removal
- Zero address rejection
- KMS generation management

#### 7. Compatibility Algorithm (5 tests)
- Element-based scoring (Fire, Earth, Water, Air)
- Quality-based scoring
- All zodiac combinations
- Cross-element compatibility

#### 8. Gas Optimization (3 tests)
- Profile creation gas costs
- Match request gas costs
- Pauser addition gas costs

#### 9. Edge Cases & Security (4 tests)
- Zero address handling
- State consistency
- Rapid successive matches
- Profile verification

---

## Test Coverage Report

Expected coverage:
```
File                          | % Stmts | % Branch | % Funcs | % Lines |
------------------------------|---------|----------|---------|---------|
contracts/                    |         |          |         |         |
  AstralCompatibility.sol     |   94.12 |    88.24 |   95.45 |   93.75 |
  AstralCompatibilityMock.sol |   92.31 |    85.71 |   92.86 |   91.67 |
------------------------------|---------|----------|---------|---------|
All files                     |   93.22 |    87.00 |   94.16 |   92.71 |
```

---

## Gas Usage Benchmarks

| Operation | Gas Used | Acceptable Range |
|-----------|----------|------------------|
| Profile Creation | ~350,000 | < 500,000 |
| Match Request | ~750,000 | < 1,000,000 |
| Score Revelation | ~250,000 | < 400,000 |
| Add Pauser | ~50,000 | < 100,000 |

---

## CI/CD Integration

Tests run automatically on:
- Every push to main/develop
- All pull requests
- Multiple Node.js versions (18.x, 20.x)

---

## Local Development Testing

1. **Setup Environment**
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your keys
   ```

2. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Check Coverage**
   ```bash
   npm run test:coverage
   ```

---

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Contract not found"
**Solution**: Run `npx hardhat clean && npx hardhat compile`

**Issue**: Gas estimation errors
**Solution**: Increase gas limit in hardhat.config.js

**Issue**: Network timeout
**Solution**: Check RPC URL in .env file

**Issue**: "Invalid zodiac sign" even with valid input
**Solution**: Ensure zodiac value is 0-11 (not 1-12)

---

## Adding New Tests

Template for new test cases:

```javascript
describe("Feature Name", function () {
  beforeEach(async function () {
    // Setup code
  });

  it("Should do something specific", async function () {
    // Test code
    expect(result).to.equal(expected);
  });
});
```

---

## Test Maintenance

- Update tests when contracts change
- Maintain >90% coverage
- Keep gas benchmarks updated
- Document new test categories

---

## Test Results Format

When running tests, you should see output like:

```
  AstralCompatibility - Comprehensive Test Suite
    🚀 Deployment & Initialization
      ✓ Should set the correct owner
      ✓ Should initialize with zero matches
      ✓ Should start unpaused
      ✓ Should have correct contract address
      ✓ Should initialize with KMS generation 1

    👤 Profile Creation
      ✓ Should create profile with valid zodiac sign (Aries)
      ✓ Should create profile for all 12 zodiac signs
      ✓ Should reject invalid zodiac sign (>11)
      ...

  52 passing (3s)
```

---

## Coverage Analysis

To generate and view detailed coverage reports:

```bash
npx hardhat coverage
```

This will generate a `coverage/` directory with HTML reports. Open `coverage/index.html` in your browser to view detailed coverage metrics.

---

## Performance Testing

Monitor gas usage for all operations:

```bash
REPORT_GAS=true npx hardhat test
```

Example output:
```
·-----------------------|---------------|----------------·
|  Contract             ·  Method       ·  Avg Gas Used  |
·-----------------------|---------------|----------------·
|  AstralCompatibility  ·  createProfile          ·  ~350,000 |
|  AstralCompatibility  ·  requestMatch           ·  ~750,000 |
|  AstralCompatibility  ·  addPauser              ·   ~50,000 |
·-----------------------|---------------|----------------·
```

---

## Integration with Hardhat

The test suite is fully integrated with Hardhat and uses:

- **@nomicfoundation/hardhat-toolbox**: Comprehensive testing tools
- **Hardhat Network**: Local blockchain for testing
- **Chai matchers**: Assertion library
- **ethers.js**: Ethereum interaction library

---

## Best Practices

1. **Isolation**: Each test should be independent
2. **Setup**: Use `beforeEach` for common setup
3. **Cleanup**: Tests auto-cleanup via Hardhat
4. **Assertions**: Use specific, meaningful assertions
5. **Gas**: Monitor gas usage in optimization tests
6. **Coverage**: Aim for >90% coverage
7. **Events**: Test event emissions
8. **Reverts**: Test error conditions

---

## Continuous Improvement

- Run tests before every commit
- Review gas usage trends
- Update tests for new features
- Maintain high coverage
- Document complex test scenarios

---

**Last Updated**: 2024-10-15
**Test Suite Version**: 1.0
**Total Tests**: 52
