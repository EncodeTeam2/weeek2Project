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
  if (arg.length > 2) {
    throw new Error("Please only vote for one proposal");
  } else {
    arg = arg[0];
  }

  console.log(`You are voting for proposal #${arg}`);

  // Create a signer for the voter
  const signerWallet: ethers.Wallet = configureWallet(
    process.env.VOTER_PRIVATE_KEY
  );

  // Attach signer/voter to the contract
  const voterWithContract: Ballot = await attachToBallot(signerWallet);

  // Cast a vote as the voter and the argument passed into the script
  const voteCasted = await voterWithContract.vote(arg);
  console.log("Vote Sent. Waiting for vote transaction to finish");
  const voteTx = await voteCasted.wait();

  console.log(`
        Action: ${action}
        Chairperson: ${voteTx.from}
        Receives rights: ${voteTx.to}
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
