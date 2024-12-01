import Web3 from "web3";
import {
    HEXADECIMAL_BASE,
    USDC_WEI_UNIT
} from "./constants";

// Helper function to convert a Solidity amount to token amount
export function fromSolidityAmount(
    solidityAmount,
    decimals = USDC_WEI_UNIT,
    type = "number",
) {
    const amountInNumber = Number(solidityAmount || 0);
    const erc20TokenAmount = Web3.utils.fromWei(amountInNumber, decimals);
    return type === "number" ? Number(erc20TokenAmount) : erc20TokenAmount;
}

// Helper function to convert a token amount to Solidity amount
export function toSolidityAmount(erc20TokenAmount) {
    return Web3.utils.toWei(erc20TokenAmount.toString(), USDC_WEI_UNIT);
}

// Helper function to convert string to Ethereum hex string
export function toEthereumHexStr(s) {
    return "0x" + Number(s).toString(HEXADECIMAL_BASE);
}

// beautyAddress is a function that beautify the address for display
export function beautyAddress(address) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}