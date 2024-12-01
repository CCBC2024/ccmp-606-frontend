// This component demonstrates how to donate to a charity campaign and withdraw funds from it.
// This is an example of how to interact with the CharityDonationCampaign contract.
"use client";

import Web3 from "web3";
import React, { useState } from "react";
import ContractArtifact from "./../contracts/CharityDonationCampaign.json";
import stablecoinAbi from "./../contracts/StableCoinABI.json";

const contractAddress = ContractArtifact.networks[11155111].address;
const stablecoinAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

const contractAbi = ContractArtifact.abi;

const web3 = new Web3("https://sepolia.infura.io/v3/9f28e411e0fd40fa99e5a669c3137d5a");
const charityContract = new web3.eth.Contract(contractAbi, contractAddress);

// Helper function to send transactions
const sendTransaction = async (contractMethodCallData, account, toAddress, gas = undefined) => {
    const transactionParameters = {
        from: account,
        to: toAddress,
        data: contractMethodCallData,
    };

    if (gas) {
        transactionParameters.gas = web3.utils.toHex(gas);
    }

    return await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
    });
};

const DonateComponentExample = () => {
    const [dataHash, setDataHash] = useState("0x67af2c01cef364281e2b70711f29c8f1fe09a707b3e09acb65c9dc9c4adaee96");
    const [amount, setAmount] = useState("");
    const [isBeneficiary, setIsBeneficiary] = useState(false);

    // Approve USDC transfer to the contract
    const approveUSDC = async (amountInTokens, userAccount) => {
        const stablecoinContract = new web3.eth.Contract(stablecoinAbi, stablecoinAddress);
        const amount = web3.utils.toWei(amountInTokens.toString(), "mwei");

        const contractMethodCallData = stablecoinContract.methods.approve(contractAddress, amount).encodeABI();
        return await sendTransaction(contractMethodCallData, userAccount, stablecoinAddress);
    };

    // Donate to the campaign after approval
    const donateToCampaign = async (userAccount) => {
        const amountInSmallestUnits = web3.utils.toWei(amount.toString(), "mwei");
        const contractMethodCallData = charityContract.methods.donate(dataHash, amountInSmallestUnits).encodeABI();
        return await sendTransaction(contractMethodCallData, userAccount, contractAddress, 100000);
    };

    // Withdraw funds from the campaign
    const withdrawFunds = async (userAccount) => {
        const contractMethodCallData = charityContract.methods.withdrawFunds(dataHash).encodeABI();
        const response = await sendTransaction(contractMethodCallData, userAccount, contractAddress, 100000);
        console.log("Withdraw response: ", response);
    };

    // Handle the donation process
    const handleDonate = async () => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const userAccount = accounts[0];
            await approveUSDC(amount, userAccount);
            await donateToCampaign(userAccount);
            alert("Donation successful!");
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed: " + error.message);
        }
    };

    // Check if the user is the beneficiary for the campaign
    const checkBeneficiary = async () => {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const userAccount = accounts[0];
        const beneficiaryAddress = "0xB8E2A516124c4F1D61B5aB3bFBbdb3a8B519C750";

        if (beneficiaryAddress.toLowerCase() === userAccount.toLowerCase()) {
            setIsBeneficiary(true);
        }
    };

    const campaignDetails = charityContract.methods.getCampaignDetails(dataHash).call();
    campaignDetails.then((result) => {
        console.log("Campaign Details: ", result);
    });

    // Handle the withdrawal process
    const handleWithdraw = async () => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const userAccount = accounts[0];
            await withdrawFunds(userAccount);
            alert("Withdrawal successful!");
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed: " + error.message);
        }
    };

    React.useEffect(() => {
        checkBeneficiary();
    }, [dataHash]);

    return (
        <div>
            <h2>Donate to Campaign</h2>
            <input
                type="text"
                placeholder="Campaign Data Hash"
                value={dataHash}
                onChange={(e) => setDataHash(e.target.value)}
            />
            <input
                type="text"
                placeholder="Amount in Tokens"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleDonate}>Donate</button>

            {isBeneficiary && (
                <button onClick={handleWithdraw}>Withdraw Funds</button>
            )}
        </div>
    );
};

export default DonateComponentExample;
