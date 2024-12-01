/*
This constant file contains all the constant values that are used in the project.
These constant values are grouped in the following categories:
1. Constants for common values
2. Constants for titles
3. Constants for buttons
4. Constants for descriptions
5. Constants for messages
 */


// region 1. Constants for common values

// This constant is used to store the event name by the function in the smart contract
export const SMART_CONTRACT_EVENT_NAME_BY_FUNCTION = {
    campaignCreated: "CampaignCreated", // The event name for the createCampaign function
    donationReceived: "ContributionReceived", // The event name for the receiveDonation function
    fundsWithdrawn: "FundsTransferred" // The event name for the withdrawFunds function
};

// This constant is used to store the symbol for the USDC token
export const USDC_SYMBOL = "USDC";

// This constant is used to store the symbol for the USD fiat currency
export const USD_SYMBOL = "USD";

// This constant is used to store decimal places for the USDC data feed from the Chainlink Oracle
// USDC data feed has 8 decimal places (wei) => 1 USDC = 100000000 wei
export const ORACLE_USDC_WEI_UNIT = 8;

// This constant is used to store the wei unit for USDC token
// USDC token has 6 decimal places (mwei - million wei)
export const USDC_WEI_UNIT = "mwei";

export const HEXADECIMAL_BASE = 16;

export const DEFAULT_GAS = 10000000;

// endregion 1. Constants for common values


// region 2. Constants for titles

// This constant is used to store the app title
export const APP_TITLE = "Blockchain-based Charity Donation Tracking System";

// This constant is used to store the title for the list of campaigns component
export const LIST_CAMPAIGNS_TITLE = "List of Campaigns";

// endregion 2. Constants for titles


// region 3. Constants for buttons

// This constant is used to store the title for connect to MetaMask button
export const CONNECT_TO_METAMASK_BUTTON = "Connect to MetaMask";

// endregion 3. Constants for buttons


// region 4. Constants for descriptions

// This constant is used to store the description when the user have not installed the MetaMask
export const PLEASE_INSTALL_METAMASK_DESCRIPTION = "Please install MetaMask to use this application.";

// endregion 4. Constants for descriptions


// region 5. Constants for messages

// This constant is used to store the success message for the user
export const SUCCESS_MESSAGE = {
    createCampaign: "You successfully created a campaign", // The success message for the createCampaign function
    donationReceived: "You successfully donated to the campaign", // The success message for the receiveDonation function
    fundsWithdrawn: "You successfully withdrew the funds" // The success message for the withdrawFunds function
};

// This constant is used to store the default error message
export const DEFAULT_ERROR_MESSAGE = "An error occurred. Please try again.";

// endregion 5. Constants for messages
