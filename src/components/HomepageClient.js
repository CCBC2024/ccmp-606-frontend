'use client'

import {useEffect, useState} from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import ContractArtifact from "./../contracts/CharityDonationCampaign.json";
import CreateCampaign from "./../components/CreateCampaign";
import {
    APP_TITLE,
    CONNECT_TO_METAMASK_BUTTON,
    DEFAULT_GAS,
    ORACLE_USDC_WEI_UNIT,
    PLEASE_INSTALL_METAMASK_DESCRIPTION,
    SMART_CONTRACT_EVENT_NAME_BY_FUNCTION,
    SUCCESS_MESSAGE,
} from "../constants";
import {fromSolidityAmount, toEthereumHexStr, toSolidityAmount} from "../utils";
import ListCampaigns from "../components/ListCampaigns";
import stableCoinAbi from "../contracts/StableCoinABI.json";
import oracleDataFeedAbi from "../contracts/OracleDataFeedABI.json";

// Check if the user is on a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function HomepageClient() {
    const [forceUpdate, setForceUpdate] = useState(0);
    const [myAccount, setMyAccount] = useState("");
    const [charityContract, setCharityContract] = useState({});
    const [charityContractAddress, setCharityContractAddress] = useState("");
    const [usdcContract, setUsdcContract] = useState({});
    const [usdcContractAddress, setUsdcContractAddress] = useState("");
    const [usdcPrice, setUsdcPrice] = useState(0);
    const [web3, setWeb3] = useState({});
    const [loading, setLoading] = useState(false); // Loading state

    // Check for account change in MetaMask
    const checkAccount = async () => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                setMyAccount(accounts[0]);
            });
        }
    };

    // Load the smart contract
    const readSmartContract = async () => {
        const chainId = process.env.NEXT_PUBLIC_ETHEREUM_METAMASK_CHAIN_ID;
        const providerRpcUrl = process.env.NEXT_PUBLIC_ETHEREUM_NODE_PROVIDER_URL;
        if (window.ethereum) {
            // Initialize the web3 instance
            const web3 = new Web3(providerRpcUrl);
            setWeb3(web3);

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: toEthereumHexStr(chainId) }],
            });

            // Set the smart contract
            await setupSmartContract(accounts[0], web3);
        } else if (isMobile) {
            // this is for mobile devices
            // this version is not working yet, we will improve it in the next version
            const provider = new WalletConnectProvider({
                rpc: {
                    chainId: providerRpcUrl,
                },
                qrcodeModalOptions: {
                    mobileLinks: [
                        "metamask"
                    ]
                },
            });

            await provider.enable();

            const web3 = new Web3(provider);
            // Get connected accounts
            const accounts = await web3.eth.getAccounts();

            // Set the smart contract
            await setupSmartContract(accounts[0], web3);
        } else {
            alert(PLEASE_INSTALL_METAMASK_DESCRIPTION);
        }
    };

    const setupSmartContract = async (account, web3) => {
        setMyAccount(account);

        const contractABI = ContractArtifact.abi;
        // Get the contract address from the environment variable or the contract artifact
        let contractAddress = ContractArtifact.networks[process.env.NEXT_PUBLIC_ETHEREUM_NETWORK_ID].address;
        if (process.env.NEXT_PUBLIC_CHARITY_CONTRACT_ADDRESS) {
            contractAddress = process.env.NEXT_PUBLIC_CHARITY_CONTRACT_ADDRESS;
        }

        // Initialize the charity contract and set the contract address
        const charityDonationContract = new web3.eth.Contract(contractABI, contractAddress);
        setCharityContract(charityDonationContract);
        setCharityContractAddress(contractAddress);

        // Initialize the USDC contract and set the contract address
        const usdcContract = new web3.eth.Contract(
            stableCoinAbi,
            process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS,
            );
        setUsdcContract(usdcContract);
        setUsdcContractAddress(process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS);

        // Initialize the Oracle Data Feed contract and set the contract address
        const oracleDataFeedContract = new web3.eth.Contract(
            oracleDataFeedAbi,
            process.env.NEXT_PUBLIC_ORACLE_DATA_FEED_CONTRACT_ADDRESS,
            );
        await getUsdcPrice(oracleDataFeedContract)
    }

    // Helper function to send a transaction to the smart contract
    const sendTransaction = async ({contractMethodCallData, fromAddress, toAddress, gas = undefined}) => {
        const transactionParameters = {
            from: fromAddress,
            to: toAddress,
            data: contractMethodCallData,
        };

        if (gas) {
            transactionParameters.gas = Web3.utils.toHex(gas);
        }

        try {
            // Preliminary eth_call to check if transaction will succeed
            await window.ethereum.request({
                method: "eth_call",
                params: [transactionParameters, "latest"],
            });

            // If eth_call succeeds, proceed with eth_sendTransaction
            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [transactionParameters],
            });

            // Wait for the transaction to be mined
            const receipt = await waitForTransactionReceipt(txHash);
            if (!receipt.status) {
                throw new Error("Transaction failed");
            }

            // Return the receipt or log status if desired
            console.log("Transaction mined. Receipt:", receipt);
            return txHash;
        } catch (error) {
            console.log("Transaction failed:", error);
            throw error;
        }
    };

    // Helper function to get return values from a transaction
    const getReturnValues = async (transactionHash, eventName) => {
        const eventResult = await getEventByTransaction(transactionHash, eventName);
        return eventResult.returnValues;
    };

    // Helper function to wait for the transaction receipt
    const waitForTransactionReceipt = async (txHash, interval = 3000, maxRetries = 60) => {
        let retries = 0;
        while (retries < maxRetries) {
            try {
                const receipt = await web3.eth.getTransactionReceipt(txHash);
                if (receipt) {
                    return receipt; // Transaction is mined and receipt is available
                }
            } catch (error) {
                console.error("Error getting transaction receipt: ", error.message);
            } finally {
                // Wait for the interval before trying again
                await new Promise(resolve => setTimeout(resolve, interval));
                retries += 1;
            }
        }
    };

    // Helper function to get events by transaction hash
    const getEventByTransaction = async (transactionHash, eventName) => {
        const events = await charityContract.getPastEvents(eventName, {
            fromBlock: 0,
            toBlock: 'latest',
        });

        const eventsByTransaction = events.filter(event => event.transactionHash === transactionHash);
        if (eventsByTransaction.length > 0) {
            return eventsByTransaction[0];
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        return getEventByTransaction(transactionHash, eventName);
    };

    const forceUpdateListCampaigns = () => {
        setForceUpdate(forceUpdate + 1);
    };

    // Approve USDC transfer to the contract
    const approveUSDC = async (amountInTokens) => {
        const amount = toSolidityAmount(amountInTokens);
        const contractMethodCallData = usdcContract.methods.approve(charityContractAddress, amount).encodeABI();
        return await sendTransaction({
            fromAddress: myAccount,
            toAddress: usdcContractAddress,
            contractMethodCallData,
            gas: DEFAULT_GAS,
        });
    };

    // Donate to the campaign after approval
    const donateToCampaign = async (id, amountInTokens) => {
        const amount = toSolidityAmount(amountInTokens);
        const contractMethodCallData = charityContract.methods.donate(id, amount).encodeABI();
        const transactionHash = await sendTransaction({
            fromAddress: myAccount,
            toAddress: charityContractAddress,
            contractMethodCallData,
            gas: DEFAULT_GAS,
        });

        return await getReturnValues(transactionHash, SMART_CONTRACT_EVENT_NAME_BY_FUNCTION.donationReceived);
    };

    // Handle the donation process in the smart contract
    const handleDonate = async (campaign, amountInTokens) => {
        setLoading(true); // Start loading
        try {
            await approveUSDC(amountInTokens);
            const response = await donateToCampaign(campaign.id, amountInTokens);
            console.log("Donation successful. Response: ", response);

            forceUpdateListCampaigns();
            alert(SUCCESS_MESSAGE.donationReceived);
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed: " + error.message);
        } finally {
            setLoading(false); // End loading regardless of success/failure
        }
    };

    // Create a campaign in the smart contract
    const handleCreateCampaign = async (campaign) => {
        setLoading(true); // Start loading
        try {
            const contractMethodCallData = charityContract.methods.createCampaign(
                campaign.name,
                toSolidityAmount(campaign.goal),
                campaign.beneficiary,
                campaign.organizationBeneficiary,
            ).encodeABI();

            const transactionHash = await sendTransaction({
                contractMethodCallData,
                fromAddress: myAccount,
                toAddress: charityContractAddress,
                gas: DEFAULT_GAS,
            });

            const returnValues = await getReturnValues(transactionHash, SMART_CONTRACT_EVENT_NAME_BY_FUNCTION.campaignCreated);
            const isValid = campaign.validateCreateReturnValues(returnValues);
            if (!isValid) {
                throw new Error("Campaign creation failed: Invalid return values");
            }
            forceUpdateListCampaigns();
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // End loading
        }
    };

    const getCampaignContributions = async (campaignId) => {
        try {
            return await charityContract.methods.getCampaignContributions(campaignId).call();
        } catch (error) {
            console.error("List Contributions failed: ", error);
            return [];
        }
    }

    // Get the list of campaigns from the smart contract
    const getCampaigns = async () => {
        try {
            return await charityContract.methods.getAllCampaigns().call();
        } catch (error) {
            console.error("List Campaigns failed: ", error);
            return [];
        }
    }

    const withdrawFunds = async (index, beneficiary) => {
        setLoading(true); // Start loading
        try {
            const contractMethodCallData = charityContract.methods.withdrawFunds(index).encodeABI();

            const transactionHash = await sendTransaction({
                contractMethodCallData,
                fromAddress: myAccount,
                toAddress: charityContractAddress,
                gas: DEFAULT_GAS,
            });

            const returnValues = await getReturnValues(transactionHash, SMART_CONTRACT_EVENT_NAME_BY_FUNCTION.fundsWithdrawn);
            if (returnValues.beneficiary.toLowerCase() !== beneficiary.toLowerCase()) {
                throw new Error("Withdrawal failed: Beneficiary mismatch");
            }
            alert(SUCCESS_MESSAGE.fundsWithdrawn);
            forceUpdateListCampaigns();
        } catch (error) {
            alert("Withdrawal failed: " + error.message);
        } finally {
            setLoading(false); // End loading
        }
    };

    const getUsdcPrice = async (oracleDataFeedContract) => {
        try {
            const price = await oracleDataFeedContract.methods.latestRoundData().call();
            setUsdcPrice(fromSolidityAmount(price.answer, ORACLE_USDC_WEI_UNIT));
        } catch (error) {
            console.error("Get USDC Price failed: ", error);
            return [];
        }
    }

    useEffect(() => {
        checkAccount();
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
                    {APP_TITLE}
                </h1>
                {myAccount ? (
                    <div className="space-y-8">
                        <CreateCampaign
                            handleCreateCampaign={handleCreateCampaign}
                            currentAccount={myAccount}
                            usdcPrice={usdcPrice}
                        />
                        <ListCampaigns
                            getCampaignsFromSmartContract={getCampaigns}
                            getContributionsFromSmartContract={getCampaignContributions}
                            handleDonate={handleDonate}
                            withdrawFunds={withdrawFunds}
                            currentAccount={myAccount}
                            forceUpdate={forceUpdate}
                        />
                        {loading && (
                            <div
                                className="fixed top-[-32px] left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                                <div className="w-16 h-16 border-4 border-t-4 border-t-transparent border-gray-200 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-all duration-200"
                            onClick={readSmartContract}
                        >
                            {CONNECT_TO_METAMASK_BUTTON}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomepageClient;