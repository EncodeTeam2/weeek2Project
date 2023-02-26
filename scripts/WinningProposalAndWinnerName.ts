import * as dotenv from 'dotenv';
import { BigNumber, ethers } from "ethers";
import { attachToBallot, configureWallet } from './Utils';
import { Ballot } from "../typechain-types";
dotenv.config()

async function WinningProposalAndWinnerNameScript() {

    console.log("Grabbing the Winning Proposal Name and the count...");

    // Using a voter wallet to call the methods. Could be any wallet
    const signer: ethers.Wallet = configureWallet(process.env.VOTER_PRIVATE_KEY);

    // attach a instance of the contract 
    const contractInstance: Ballot = await attachToBallot(signer);

    // Grabbing the values from winning proposal and winner proposal name
    const winningProposalIndex: BigNumber = await contractInstance.winningProposal();
    const winningProposal: string = await contractInstance.winnerName();
    const winningVotes: BigNumber = await (await contractInstance.proposals(winningProposalIndex)).voteCount
    // conditional message based on how many votes may or may not have been casted
    if (Number(winningVotes) == 0) {
        console.log(`${ethers.utils.parseBytes32String(winningProposal)} has won since there are no votes`);
    } else {
        console.log(`${ethers.utils.parseBytes32String(winningProposal)} won with a vote count of ${winningVotes}`);
    }

}

WinningProposalAndWinnerNameScript().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
