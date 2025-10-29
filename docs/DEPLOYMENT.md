# Deployment Guide

## Deploying Applications with Universal FHEVM SDK

This guide covers deployment strategies for applications built with the Universal FHEVM SDK.

---

## Prerequisites

- Node.js 18+ installed
- SDK integrated into your application
- Access to a FHEVM-compatible network
- Deployment platform account (Vercel, Netlify, etc.)

---

## Next.js Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Configure Environment Variables**

Create a `.env.local` file:
```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_GATEWAY_URL=https://gateway.zama.ai
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables in Vercel Dashboard**
- Go to project settings
- Add all environment variables
- Redeploy

### Self-Hosted Deployment

```bash
npm run build
npm start
```

Or with Docker:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

---

## Vue Deployment

### Netlify Deployment

1. **Build Configuration**

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Environment Variables**

In Netlify dashboard, add:
- `VITE_CHAIN_ID`
- `VITE_GATEWAY_URL`
- `VITE_CONTRACT_ADDRESS`

3. **Deploy**
```bash
netlify deploy --prod
```

---

## Static Site Deployment

### GitHub Pages

1. **Build Static Site**
```bash
npm run build
```

2. **Deploy Script**
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Deploy**
```bash
npm run deploy
```

---

## Environment Configuration

### Development

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_GATEWAY_URL=https://gateway.zama.ai/sepolia
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourTestContract
```

### Production

```env
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_GATEWAY_URL=https://gateway.zama.ai/mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourProductionContract
```

---

## Smart Contract Deployment

### Deploy with Hardhat

1. **Configure Network**

```javascript
// hardhat.config.js
module.exports = {
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

2. **Deploy Script**

```javascript
// scripts/deploy.js
async function main() {
  const Contract = await ethers.getContractFactory("YourContract");
  const contract = await Contract.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main();
```

3. **Run Deployment**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## Performance Optimization

### Bundle Size Optimization

```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        fhevm: {
          test: /[\\/]node_modules[\\/](@astral|fhevmjs)[\\/]/,
          name: 'fhevm-sdk',
          priority: 10
        }
      }
    };
    return config;
  }
};
```

### Lazy Loading

```typescript
import dynamic from 'next/dynamic';

const FHEComponent = dynamic(
  () => import('./FHEComponent'),
  { ssr: false }
);
```

---

## Security Considerations

### Environment Variables

- Never commit `.env` files
- Use platform-specific secret management
- Rotate API keys regularly

### Public Key Management

```typescript
// Fetch public key from gateway
const fhevm = await createFHEVM({
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL
});
```

### CORS Configuration

```javascript
// For API routes
export async function GET(request) {
  return new Response(data, {
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
```

---

## Monitoring and Debugging

### Error Tracking

```typescript
import { createFHEVM } from '@astral/fhevm-sdk';

try {
  const fhevm = await createFHEVM({ chainId: 11155111 });
} catch (error) {
  // Send to error tracking service
  errorTracker.captureException(error);
}
```

### Performance Monitoring

```typescript
const start = performance.now();
const encrypted = await fhevm.encrypt.uint32(value);
const duration = performance.now() - start;

console.log(`Encryption took ${duration}ms`);
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run build

      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Troubleshooting

### Common Issues

**Issue: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Build fails with memory error**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

**Issue: FHEVM initialization fails**
- Check network connectivity
- Verify chainId matches network
- Ensure gateway URL is correct

---

## Platform-Specific Guides

### Vercel
- Supports Next.js out of the box
- Automatic HTTPS
- Environment variables in dashboard

### Netlify
- Great for static sites and Vue
- Form handling built-in
- Serverless functions support

### AWS Amplify
- Full-stack deployment
- Auto-scaling
- Custom domain support

### Railway
- Simple deployment
- Database hosting
- Auto-deploy from GitHub

---

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team notified

---

## Support

For deployment issues:
- Check the [GitHub Issues](https://github.com/yourusername/fhevm-universal-sdk/issues)
- Review example deployments
- Contact support
