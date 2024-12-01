# Charity Donation Frontend

This is the frontend for the charity donation project. It is a React application that allows users to donate to charities.

## Project Structure
```
.
├── README.md
└── src
    ├── app
    ├── components
    ├── constants.js
    ├── contracts
    └── models
```

The project is structured as follows:
- [src](src): Contains the source code for the application.
  - [app](src/app): Contains the main App component that sets up the routes and global state.
  - [components](src/components): Contains the reusable UI components used throughout the application.
  - [constants.js](src/constants.js): Defines the constants values used throughout the application, such as success and error messages.
  - [contracts](src/contracts): Contains the Ethereum smart contracts artifacts are used for donations.
  - [models](src/models): Contains the data models used in the application.

## Setup
To run the backend in the local environment, we open the backend source code in the VSCode editor, the backend source code is located in the charity-donation-frontend folder.

The main file of the frontend is located in the [src/components/HomepageClient.js](src/components/HomepageClient.js) file.

### Update the Environment Variables
Copy the [.env.example](.env.example) file to a new file named `.env.local` and update the following environment variables then save the file:
- `NEXT_PUBLIC_ETHEREUM_NODE_PROVIDER_URL`: The URL of the Ethereum node provider (e.g., Infura, Alchemy).
- `NEXT_PUBLIC_ETHEREUM_NETWORK_ID`: The network ID of the Ethereum network (e.g., 1 for Ethereum Mainnet, 11155111 for Sepolia Testnet).
- `NEXT_PUBLIC_ETHEREUM_METAMASK_CHAIN_ID`: The chain ID of the Ethereum network on MetaMask (e.g., 1 for Ethereum Mainnet, 11155111 for Sepolia Testnet).
- `NEXT_PUBLIC_CHARITY_CONTRACT_ADDRESS`: The address of the deployed charity contract. We provide a default contract address in the `.env.example` file, you can use it or update it with the address of the deployed contract. You can access to this [repository](https://github.com/CCBC2024/ccmp-606-smart-contract) to set up and deploy your own charity contract.
- `NEXT_PUBLIC_USDC_CONTRACT_ADDRESS`: The address of the USDC token contract. We provide a default contract address in the `.env.example` file, you can use it or update it to other address.
- `NEXT_PUBLIC_ORACLE_DATA_FEED_CONTRACT_ADDRESS`: The address of the Oracle Data Feed contract. We provide a default contract address in the `.env.example` file, you can use it or update it to other address.

### Install Dependencies
On the terminal, navigate to the project directory and run the following command to install the dependencies:
```bash
npm install
```

### Running the Application
1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
Now the frontend is running on the local environment. You can click the `Connect to MetaMask` button to connect to your MetaMask wallet and start creating campaigns and donating.

### Build the Application
To build the application for production, run the following command:
```bash
npm run build
```

### Running the Application in Production Mode
To run the application in production mode, run the following command:
```bash
npm start
```

### Building docker image
- `-t`: tag the image with the name charity-donation-backend
- `.`: build the image from the current directory
```bash
docker build -t charity-donation-frontend .
```

### Running docker container
- `-d`: run the container in detached mode or in the background
- `-p 8080:8080`: map port 8080 on the host to port 3000 in the container
- `--name charity-donation-frontend`: name the container charity-donation-frontend
- `charity-donation-frontend`: the name of the image to run
```bash
docker run -d -p 8080:8080 --name charity-donation-frontend charity-donation-frontend
```

### Sepolia Testnet Faucet
- USDC: https://faucet.circle.com/
- ETH: https://cloud.google.com/application/web3/faucet/ethereum/sepolia, https://docs.metamask.io/developer-tools/faucet/, https://www.alchemy.com/faucets/ethereum-sepolia,  

### How to deploy to vercel
Click the button below to deploy the application to Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/CCBC2024/ccmp-606-frontend)

Or follow the steps below to deploy the application manually:
- Create an account on [Vercel](https://vercel.com/).
- Install Vercel CLI:
```bash
npm install -g vercel@latest
```

- Login to Vercel:
```bash
vercel login
```

- Deploy the application:
```bash
vercel --prod
```

After first deployment, you can update the environment variables in the Vercel dashboard.
Go to the project settings, then navigate to the Environment Variables section and add the environment variables.
After adding the environment variables, navigate to the Deployments section and click on the Redeploy button to redeploy the application with the updated environment variables.