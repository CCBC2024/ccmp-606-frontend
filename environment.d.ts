declare namespace NodeJS {
    export interface ProcessEnv {
        readonly NEXT_PUBLIC_ETHEREUM_NODE_PROVIDER_URL: string;
        readonly NEXT_PUBLIC_ETHEREUM_NETWORK_ID: string;
        readonly NEXT_PUBLIC_ETHEREUM_METAMASK_CHAIN_ID: string;
        readonly NEXT_PUBLIC_USDC_CONTRACT_ADDRESS: string;
        readonly NEXT_PUBLIC_CHARITY_CONTRACT_ADDRESS: string;
        readonly NEXT_PUBLIC_ORACLE_DATA_FEED_CONTRACT_ADDRESS: string;
    }
}