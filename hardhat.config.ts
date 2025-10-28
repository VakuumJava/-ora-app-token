import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-verify';
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.20',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        hardhat: {
            chainId: 1337,
        },
        mainnet: {
            url: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1,
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY || '',
    },
    paths: {
        sources: './contracts/ethereum',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
};

export default config;
