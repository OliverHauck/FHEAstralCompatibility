# Quick Start Guide

## Universal FHEVM SDK - Get Started in 5 Minutes

### Installation

```bash
npm install @astral/fhevm-sdk
```

---

## Basic Usage (Vanilla JavaScript/TypeScript)

### Step 1: Initialize the SDK

```typescript
import { createFHEVM } from '@astral/fhevm-sdk';

const fhevm = await createFHEVM({
  chainId: 11155111 // Sepolia testnet
});
```

### Step 2: Encrypt Data

```typescript
// Encrypt a number
const encrypted = await fhevm.encrypt.uint32(42);

// Encrypt a boolean
const encryptedBool = await fhevm.encrypt.bool(true);

// Encrypt an address
const encryptedAddress = await fhevm.encrypt.address('0x...');
```

### Step 3: Create Contract Input

```typescript
const input = fhevm.contract.createInput(
  '0xContractAddress',
  '0xUserAddress'
);

input.add32(100);
input.add64(BigInt(5000));

const { handles, inputProof } = await input.encrypt();
```

---

## React Integration

### Step 1: Wrap Your App with Provider

```tsx
import { FHEVMProvider } from '@astral/fhevm-sdk/react';

function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <YourComponents />
    </FHEVMProvider>
  );
}
```

### Step 2: Use Hooks in Components

```tsx
import { useEncrypt, useFHEVM } from '@astral/fhevm-sdk/react';

function MyComponent() {
  const fhevm = useFHEVM();
  const { encrypt, encrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42, 'uint32');
    console.log('Encrypted:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={encrypting}>
      Encrypt Value
    </button>
  );
}
```

---

## Next.js Integration

### Step 1: Create FHE Provider (app/providers.tsx)

```tsx
'use client';

import { FHEVMProvider } from '@astral/fhevm-sdk/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      {children}
    </FHEVMProvider>
  );
}
```

### Step 2: Wrap Layout

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Step 3: Use in Pages

```tsx
'use client';

import { useEncrypt } from '@astral/fhevm-sdk/react';

export default function Page() {
  const { encrypt, encrypting } = useEncrypt();

  return <div>Your encrypted app</div>;
}
```

---

## Vue Integration

### Step 1: Install Plugin

```typescript
import { createApp } from 'vue';
import { createFHEVMPlugin } from '@astral/fhevm-sdk/vue';
import App from './App.vue';

const app = createApp(App);
app.use(createFHEVMPlugin({ chainId: 11155111 }));
app.mount('#app');
```

### Step 2: Use in Components

```vue
<script setup>
import { useFHEVM } from '@astral/fhevm-sdk/vue';

const { fhevm, loading, error } = useFHEVM();

const encryptValue = async () => {
  if (fhevm.value) {
    const encrypted = await fhevm.value.encrypt.uint32(42);
  }
};
</script>

<template>
  <div>
    <button @click="encryptValue" :disabled="loading">
      Encrypt
    </button>
  </div>
</template>
```

---

## Common Patterns

### Encrypting Form Data

```typescript
async function encryptFormData(fhevm, formData) {
  const input = fhevm.contract.createInput(
    contractAddress,
    userAddress
  );

  input.add32(formData.age);
  input.add64(BigInt(formData.salary));
  input.addBool(formData.isActive);

  return await input.encrypt();
}
```

### Handling Decryption

```typescript
import { useDecrypt } from '@astral/fhevm-sdk/react';

function DecryptComponent() {
  const { requestDecryption, decrypting } = useDecrypt();

  const decrypt = async (handle) => {
    const decrypted = await requestDecryption({
      contractAddress: '0x...',
      handle: BigInt(handle),
      userAddress: '0x...'
    });

    return decrypted;
  };
}
```

### Error Handling

```typescript
import { createFHEVM, EncryptionError } from '@astral/fhevm-sdk';

try {
  const encrypted = await fhevm.encrypt.uint32(value);
} catch (error) {
  if (error instanceof EncryptionError) {
    console.error('Encryption failed:', error.message);
  }
}
```

---

## Next Steps

- Check out the [complete examples](../examples/) in this repository
- Read the [API Documentation](./API.md)
- Learn about [deployment](./DEPLOYMENT.md)
- Explore [advanced usage patterns](./ADVANCED.md)

---

## Need Help?

- Open an issue on GitHub
- Check the examples folder for working code
- Review the API documentation
