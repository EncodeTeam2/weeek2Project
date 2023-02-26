import * as dotenv from "dotenv";
import { attachToBallot, configureWallet, getArguments } from "./Utils";
import { ethers } from "ethers";
import { util } from "chai";
import { Ballot } from "../typechain-types";

dotenv.config();

async function voteScript(): Promise<void> {
  let action: string = "Voting";

  // Grab the proposal from the user
  // If a user tries to send more than 1 proposal number throw an error
  // otherwise grab the value of the argument
  let arg: any = getArguments(process.argv);
  let voteNumber : number 
  if (arg.length > 2) {
    throw new Error("Please only vote for one proposal");
  } else {
    voteNumber = Number(arg[0]) - 1
    if  (isNaN(voteNumber)) {
      throw new Error("Please only vote with a numerical character");  
  }
  }

  console.log(`You are voting for proposal #${voteNumber + 1}`);

  // Create a signer for the voter
  const signerWallet: ethers.Wallet = configureWallet(
    process.env.VOTER_PRIVATE_KEY
  );

  // Attach signer/voter to the contract
  const voterWithContract: Ballot = await attachToBallot(signerWallet);

  // Cast a vote as the voter and the argument passed into the script
  const voteCasted = await voterWithContract.vote(voteNumber);
  console.log("Vote Sent. Waiting for vote transaction to finish");
  const voteTx = await voteCasted.wait();

  console.log(`
        Action: ${action}
        Voter: ${voteTx.from}
        Voter Proposal #: ${voteNumber + 1}
        Tx hash: ${voteTx.transactionHash}
        Block: ${voteTx.blockNumber}
        Contract Address: ${process.env.CONTRACT_ADDRESS}
        Cost in ETH: ${ethers.utils.formatEther(
          voteTx.gasUsed.mul(voteTx.effectiveGasPrice)
        )}
        Confirmations: ${voteTx.confirmations}
    `);
}

voteScript().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
