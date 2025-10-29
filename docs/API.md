# API Documentation

## Universal FHEVM SDK API Reference

### Core API

#### `createFHEVM(config: FHEVMConfig): Promise<FHEVM>`

Creates and initializes a new FHEVM instance.

**Parameters:**
- `config.chainId` (number): The blockchain network chain ID
- `config.provider` (optional): Ethers provider instance
- `config.gatewayUrl` (optional): Custom gateway URL
- `config.publicKey` (optional): Pre-fetched public key
- `config.aclAddress` (optional): ACL contract address

**Returns:** Promise resolving to an initialized FHEVM instance

**Example:**
```typescript
import { createFHEVM } from '@astral/fhevm-sdk';

const fhevm = await createFHEVM({
  chainId: 11155111
});
```

---

### Encryption Module

#### `fhevm.encrypt.uint8(value: number): Promise<Uint8Array>`

Encrypts an 8-bit unsigned integer.

**Parameters:**
- `value`: Number between 0 and 255

**Returns:** Encrypted data as Uint8Array

#### `fhevm.encrypt.uint16(value: number): Promise<Uint8Array>`

Encrypts a 16-bit unsigned integer.

#### `fhevm.encrypt.uint32(value: number): Promise<Uint8Array>`

Encrypts a 32-bit unsigned integer.

#### `fhevm.encrypt.uint64(value: bigint): Promise<Uint8Array>`

Encrypts a 64-bit unsigned integer.

#### `fhevm.encrypt.uint128(value: bigint): Promise<Uint8Array>`

Encrypts a 128-bit unsigned integer.

#### `fhevm.encrypt.uint256(value: bigint): Promise<Uint8Array>`

Encrypts a 256-bit unsigned integer.

#### `fhevm.encrypt.bool(value: boolean): Promise<Uint8Array>`

Encrypts a boolean value.

#### `fhevm.encrypt.address(address: string): Promise<Uint8Array>`

Encrypts an Ethereum address.

---

### Contract Module

#### `fhevm.contract.createInput(contractAddress: string, userAddress: string): EncryptedInput`

Creates an encrypted input builder for smart contract calls.

**Returns:** EncryptedInput instance with methods:
- `add8(value: number)`: Add 8-bit value
- `add16(value: number)`: Add 16-bit value
- `add32(value: number)`: Add 32-bit value
- `add64(value: bigint)`: Add 64-bit value
- `add128(value: bigint)`: Add 128-bit value
- `add256(value: bigint)`: Add 256-bit value
- `addBool(value: boolean)`: Add boolean value
- `addAddress(address: string)`: Add address
- `encrypt()`: Finalize and encrypt all values

**Example:**
```typescript
const input = fhevm.contract.createInput(contractAddress, userAddress);
input.add32(42);
input.add64(BigInt(1000));
const { handles, inputProof } = await input.encrypt();
```

#### `fhevm.contract.generatePermission(contractAddress: string, userAddress: string): Promise<string>`

Generates an EIP-712 signature for decryption permission.

---

### Decryption Module

#### `fhevm.decrypt.request(params: DecryptionRequest): Promise<bigint>`

Requests decryption of an encrypted value.

**Parameters:**
- `params.contractAddress`: Smart contract address
- `params.handle`: Encrypted value handle
- `params.userAddress`: User's address

#### `fhevm.decrypt.reencrypt(handle: bigint, contractAddress: string, userAddress: string): Promise<bigint>`

Re-encrypts a value for user decryption.

---

## React Hooks API

### `FHEVMProvider`

Context provider for FHEVM instance.

**Props:**
- `config`: FHEVMConfig object
- `children`: React nodes
- `onInit`: (optional) Callback when initialized
- `onError`: (optional) Error handler
- `loadingComponent`: (optional) Loading UI

**Example:**
```tsx
import { FHEVMProvider } from '@astral/fhevm-sdk/react';

function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <YourApp />
    </FHEVMProvider>
  );
}
```

### `useFHEVM()`

Access the FHEVM instance.

**Returns:** FHEVM instance

**Example:**
```tsx
import { useFHEVM } from '@astral/fhevm-sdk/react';

function Component() {
  const fhevm = useFHEVM();
  // Use fhevm.encrypt, fhevm.decrypt, etc.
}
```

### `useEncrypt()`

Hook for encryption operations.

**Returns:** Object with:
- `encrypt(value: any, type: string)`: Encryption function
- `encrypting`: Boolean loading state
- `error`: Error object or null

**Example:**
```tsx
import { useEncrypt } from '@astral/fhevm-sdk/react';

function EncryptComponent() {
  const { encrypt, encrypting, error } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint32');
  };
}
```

### `useDecrypt()`

Hook for decryption operations.

**Returns:** Object with:
- `requestDecryption(params)`: Decryption function
- `decrypting`: Boolean loading state
- `error`: Error object or null

### `useContract()`

Hook for contract operations.

**Returns:** Object with:
- `createInput(contractAddress, userAddress)`: Create encrypted input
- `generatePermission(contractAddress, userAddress)`: Generate permission
- `loading`: Boolean loading state
- `error`: Error object or null

---

## Vue Integration API

### `createFHEVMPlugin(config: FHEVMConfig)`

Creates a Vue plugin for FHEVM.

**Example:**
```typescript
import { createFHEVMPlugin } from '@astral/fhevm-sdk/vue';
import { createApp } from 'vue';

const app = createApp(App);
app.use(createFHEVMPlugin({ chainId: 11155111 }));
```

### `useFHEVM()` (Vue Composition API)

Access FHEVM instance in Vue components.

**Example:**
```vue
<script setup>
import { useFHEVM } from '@astral/fhevm-sdk/vue';

const { fhevm, loading, error } = useFHEVM();
</script>
```

---

## Error Handling

The SDK throws typed errors:

- `InitializationError`: Failed to initialize FHEVM
- `EncryptionError`: Encryption operation failed
- `DecryptionError`: Decryption operation failed

**Example:**
```typescript
import { createFHEVM, InitializationError } from '@astral/fhevm-sdk';

try {
  const fhevm = await createFHEVM({ chainId: 11155111 });
} catch (error) {
  if (error instanceof InitializationError) {
    console.error('Failed to initialize:', error.message);
  }
}
```

---

## TypeScript Support

The SDK is fully typed with TypeScript. All types are exported:

```typescript
import type {
  FHEVM,
  FHEVMConfig,
  EncryptionModule,
  DecryptionModule,
  ContractModule,
  EncryptedInput
} from '@astral/fhevm-sdk';
```
