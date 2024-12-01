import React, { useState } from 'react';
import Campaign from '../models/campaigns';
import {
    SUCCESS_MESSAGE,
    USD_SYMBOL,
    USDC_SYMBOL,
} from "../constants";
import {toSolidityAmount} from "../utils";

function CreateCampaign(
    {
        handleCreateCampaign,
        currentAccount,
        usdcPrice,
    }
) {
    const [name, setName] = useState('');
    const [goal, setGoal] = useState(1);
    const [organizationBeneficiary, setOrganizationBeneficiary] = useState('');

    const showUsdcConversion = () => {
        if (goal && usdcPrice) {
            return `, ${goal} ${USDC_SYMBOL} = ${goal * usdcPrice} ${USD_SYMBOL}`;
        }
        return '';
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!name || !goal || !organizationBeneficiary) {
                alert('All fields are required');
                return;
            }

            if (isNaN(goal) || goal <= 0) {
                alert('Goal must be a positive number');
                return;
            }

            if (currentAccount.toLowerCase() === organizationBeneficiary.toLowerCase()) {
                alert('Beneficiary and Organization Beneficiary must be different');
                return;
            }

            // Convert the goal to Solidity amount because the contructor of the Campaign model expects a Solidity amount
            const solidityAmount = toSolidityAmount(goal);
            const campaign = new Campaign({
                name,
                goal: solidityAmount,
                beneficiary: currentAccount,
                organizationBeneficiary,
            });
            await handleCreateCampaign(campaign);
            alert(SUCCESS_MESSAGE.createCampaign)
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-blue-600">
                    <h3 className="text-xl font-semibold text-white">Create Campaign</h3>
                </div>
                <form className="p-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="name">
                                Campaign Name
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                id="name"
                                type="text"
                                placeholder="Enter campaign name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="organizationBeneficiary">
                                Organization Beneficiary Address
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="organizationBeneficiary"
                                type="text"
                                placeholder="Organization Beneficiary Address"
                                onChange={(e) => setOrganizationBeneficiary(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="goal">
                                Goal (in {USDC_SYMBOL}{showUsdcConversion()})
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="goal"
                                type="number"
                                placeholder="Goal"
                                onChange={(e) => setGoal(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
                            type="submit">
                            Create Campaign
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCampaign;