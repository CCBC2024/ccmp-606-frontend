import {useEffect, useState} from "react";
import {
    beautyAddress,
    fromSolidityAmount
} from "../utils";
import {USDC_SYMBOL} from "../constants";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

function CampaignContributions({
                                   campaignId,
                                   getContributionsFromSmartContract,
                                   forceUpdate // forceUpdate is a state variable that triggers a re-render when updated
                               }) {
    const [showContributions, setShowContributions] = useState(false);
    const [contributions, setContributions] = useState([]);

    useEffect(() => {
        getContributions();
    }, [campaignId, forceUpdate]);

    const getContributions = async () => {
        const contributions = await getContributionsFromSmartContract(campaignId);
        setContributions(contributions);
    }

    if (!contributions.length) {
        return null;
    }

    return (
        <div className="border-t border-gray-100 pt-3">
            <button
                className="flex items-center justify-between w-full text-left text-gray-600 font-medium"
                onClick={() => setShowContributions(!showContributions)}
            >
                <span>Contributions ({contributions.length})</span>
                {showContributions ? 
                    <ChevronUpIcon className="h-4 w-4 text-gray-400" /> : 
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                }
            </button>
            
            {showContributions && (
                <div className="mt-2 space-y-2">
                    {contributions.map((contribution, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md text-sm">
                            <span className="text-gray-500">{beautyAddress(contribution.contributor)}</span>
                            <span className="font-medium text-gray-600">
                                {fromSolidityAmount(contribution.amount)} {USDC_SYMBOL}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CampaignContributions;
