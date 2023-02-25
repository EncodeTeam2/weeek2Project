import { ethers } from "ethers"
import { attachToBallot, configureWallet, getArguments } from "./Utils"
import * as dotenv from 'dotenv';
dotenv.config()


async function GiveRightToVoteScript() {
    // Clean and get arguments from call
    const args = getArguments(process.argv)

    // Configure and get signerWallet of the chairperson.
    const signerWallet = configureWallet(process.env.CHAIRPERSON_PRIVATE_KEY)

    // Obtain instance of the contract with msg.sender = chairperson.
    const contractInstance = await attachToBallot(signerWallet)

    // Grab address from arguments
    const addressToGiveRights:string = args[0]
    if (!ethers.utils.isAddress(addressToGiveRights)) throw new Error("Provided address is not valid.")

    const action:string = "Give right to vote"
    console.log(`Executing ${action} transaction...`)

    // Interact with contract and call giveRightToVote with provided address.
    const giveRightToVoteTx = await contractInstance.giveRightToVote(addressToGiveRights)
    
    console.log("Waiting for confirmations...")

    // Wait transaction to be mined.
    const txReceipt = await giveRightToVoteTx.wait()


    console.log(`
        Action: ${action}
        Chairperson: ${txReceipt.from}
        Receives rights: ${addressToGiveRights}
        Tx hash: ${txReceipt.transactionHash}
        Block: ${txReceipt.blockNumber}
        Contract Address: ${process.env.CONTRACT_ADDRESS}
        Cost in ETH: ${ethers.utils.formatEther(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice))}
        Confirmations: ${txReceipt.confirmations}
    `)
} 

GiveRightToVoteScript().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
