import {useEffect, useState,} from "react";
import {FaDonate, FaHandHoldingUsd} from 'react-icons/fa';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import {
    LIST_CAMPAIGNS_TITLE,
    USDC_SYMBOL,
} from "../constants";
import {beautyAddress} from "../utils";
import Campaign from "../models/campaigns";
import CampaignContributions from "./CampaignContributions";

// ListCampaigns component
function ListCampaigns(
    {
        getCampaignsFromSmartContract,
        getContributionsFromSmartContract,
        handleDonate,
        withdrawFunds,
        currentAccount,
        forceUpdate // forceUpdate is a state variable that triggers a re-render when updated
    }
) {
    // campaigns is a state variable that stores the list of campaigns
    const [campaigns, setCampaigns] = useState([]);
    const defaultDonationAmount = 1 // means 1 USDC

    useEffect(() => {
        // call the getCampaigns function
        getCampaigns();
    }, [forceUpdate]);

    // getProducts is a function that execute the getProducts function in the smart contract
    const getCampaigns = async () => {
        // get the list of campaigns from the smart contract
        const campaignsFromContract = await getCampaignsFromSmartContract();

        // loop through the list of campaigns and create a new Campaign object for each campaign
        const campaigns = campaignsFromContract.map((campaign, index) => {
            // create a new Campaign object
            return new Campaign({
                id: index, // The index is used as the ID
                name: campaign.name,
                goal: campaign.goal,
                beneficiary: campaign.beneficiary,
                organizationBeneficiary: campaign.organizationBeneficiary,
                contributions: campaign.contributions,
                isActive: campaign.isActive,
                totalRaised: campaign.totalRaised
            })
        });

        // set the campaigns state variable
        setCampaigns(campaigns);
    }

    // canWithdrawFunds is a function that checks if the current account can withdraw funds from the campaign
    // It returns true if the current account is the organization beneficiary, the campaign is active, and the goal is reached
    const canWithdrawFunds = (campaign) => {
        const isOrganizationBeneficiary = campaign.organizationBeneficiary.toLowerCase() === currentAccount.toLowerCase();
        const goalReached = campaign.totalRaised >= campaign.goal;
        return isOrganizationBeneficiary && campaign.isActive && goalReached;
    }

    // getStatus is a function that returns the status of the campaign
    const getStatus = (campaign) => {
        if (campaign.isActive) {
            if (campaign.totalRaised >= campaign.goal) {
                return "Goal Reached";
            }

            return "Fundraising";
        }

        return "Completed";
    }

    if (!campaigns || campaigns.length === 0) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-gray-700">
                {LIST_CAMPAIGNS_TITLE}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="px-4 py-3 bg-blue-600">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-medium text-white">{campaign.name}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    getStatus(campaign) === "Goal Reached" ? "bg-green-200 text-green-800" :
                                    getStatus(campaign) === "Fundraising" ? "bg-blue-200 text-blue-800" :
                                    "bg-gray-200 text-gray-800"
                                }`}>
                                    {getStatus(campaign)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <div className="space-y-3 mb-4">
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-gray-600"><strong>Goal:</strong> {campaign.goal} <b>{USDC_SYMBOL}</b></p>
                                    <p className="text-gray-600"><strong>Raised:</strong> {campaign.totalRaised} <b>{USDC_SYMBOL}</b></p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div className="bg-blue-600 h-2 rounded-full" 
                                             style={{ width: `${Math.min((campaign.totalRaised / campaign.goal) * 100, 100)}%` }}>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-gray-500 text-sm">
                                    <strong>Beneficiary:</strong> {beautyAddress(campaign.beneficiary)}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    <strong>Organization:</strong> {beautyAddress(campaign.organizationBeneficiary)}
                                </p>
                            </div>

                            <CampaignContributions
                                campaignId={campaign.id}
                                getContributionsFromSmartContract={getContributionsFromSmartContract}
                                forceUpdate={forceUpdate}
                            />

                            <div className="space-y-2 mt-4">
                                {campaign.isActive && (
                                    <button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center"
                                        onClick={() => handleDonate(campaign, defaultDonationAmount)}
                                    >
                                        <FaDonate className="mr-2"/>
                                        Donate {defaultDonationAmount} {USDC_SYMBOL}
                                    </button>
                                )}
                                
                                {canWithdrawFunds(campaign) && (
                                    <button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center"
                                        onClick={() => withdrawFunds(campaign.id, campaign.beneficiary)}
                                    >
                                        <FaHandHoldingUsd className="mr-2"/>
                                        Withdraw Funds
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Export the ListCampaigns component
export default ListCampaigns;