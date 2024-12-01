import {
    fromSolidityAmount
} from "../utils";

class Campaign {
    constructor({
                    id,
                    name,
                    goal,
                    beneficiary,
                    organizationBeneficiary,
                    contributions,
                    isActive,
                    totalRaised,
                }) {
        this.id = id;

        this.name = name;
        this.goal = fromSolidityAmount(goal);
        this.totalRaised = fromSolidityAmount(totalRaised);
        this.beneficiary = beneficiary;
        this.organizationBeneficiary = organizationBeneficiary;
        this.contributions = contributions || [];
        this.isActive = isActive || false;
        this.setRemaining();
    }

    // setRemaining is a function that sets the remaining field of the campaign
    setRemaining() {
        this.remaining = this.goal - this.totalRaised;
        if (this.remaining < 0) {
            this.remaining = 0;
        }
    }

    // setContributions is a function that sets the contributions field of the campaign
    setContributions(contributions) {
        this.contributions = contributions;
    }

    validateCreateReturnValues(returnedCampaignFromSmartContract) {
        if (!returnedCampaignFromSmartContract) {
            return false
        }

        return this.beneficiary.toLowerCase() === returnedCampaignFromSmartContract.beneficiary.toLowerCase() &&
            this.goal === fromSolidityAmount(returnedCampaignFromSmartContract.goal) &&
            this.organizationBeneficiary.toLowerCase() === returnedCampaignFromSmartContract.organizationBeneficiary.toLowerCase()
    }
}

export default Campaign;