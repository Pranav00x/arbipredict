# ArbiPredict

ArbiPredict is a decentralized prediction game on Arbitrum where users bet on the ETH price (HIGH/LOW) over 24-hour epochs.

## Project Structure

- `/contracts`: Hardhat project with the Solidity smart contracts.
- `/frontend`: Next.js DApp with Wagmi/viem for WalletConnect and Farcaster Frame integration.
- `/indexer`: Simple Node.js backend using PostgreSQL to index contract events and serve leaderboard/history APIs.

## Smart Contract Deployment

1. Go to the `contracts` directory.
2. Ensure you have Arbitrum Sepolia / Mainnet RPC URLs and Private Key.
3. Copy `.env.example` to `.env` and fill the variables:
   ```env
   PRIVATE_KEY=your_private_key
   ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
   ```
4. Install dependencies: `npm install`
5. Compile and deploy:
   ```bash
   npx hardhat compile
   # Deploy to Arbitrum Mainnet
   npm run deploy:arbitrum
   ```

## Frontend Development

1. Go to `/frontend`.
2. Install dependencies: `npm install`
3. Edit `.env.local` to add your deployed contract address and WalletConnect Project ID:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_INDEXER_URL=http://localhost:3001
   ```
4. Start the development server: `npm run dev`

## Backend Indexer

1. Go to `/indexer`.
2. Set up a PostgreSQL database.
3. Configure `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/arbipredict
   RPC_URL=https://arb1.arbitrum.io/rpc
   CONTRACT_ADDRESS=0x...
   PORT=3001
   ```
4. Start the indexer and API: `npm start`
