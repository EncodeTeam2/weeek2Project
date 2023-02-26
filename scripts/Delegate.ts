import { ethers } from "ethers"
import { attachToBallot, configureWallet, getArguments } from "./Utils"
import * as dotenv from 'dotenv';
dotenv.config()


async function delegateScript() {
    // Clean and get arguments from call
    const args = getArguments(process.argv)

    // Configure and get signerWallet of voter delegates.
    const signerWallet = configureWallet(process.env.VOTER_DELEGATES_PRIVATE_KEY)

    // Obtain instance of the contract with msg.sender = voter delegates.
    const contractInstance = await attachToBallot(signerWallet)



    // Grab address from arguments
    const addressToDelegate:string = args[0]
    if (!ethers.utils.isAddress(addressToDelegate)) throw new Error("Provided address is not valid.")


    const action:string = "Delegating votes"
    console.log(`Executing ${action} transaction...`)

    // Interact with contract and call delegate with provided address.
    const delegateVotesTx = await contractInstance.delegate(addressToDelegate)
    
    console.log("Waiting for confirmations...")

    // Wait transaction to be mined.
    const txReceipt = await delegateVotesTx.wait()


    console.log(`
        Action: ${action}
        Voter Delegates: ${txReceipt.from}
        Receives delegation: ${addressToDelegate}
        Tx hash: ${txReceipt.transactionHash}
        Block: ${txReceipt.blockNumber}
        Contract Address: ${process.env.CONTRACT_ADDRESS}
        Cost in ETH: ${ethers.utils.formatEther(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice))}
        Confirmations: ${txReceipt.confirmations}
    `)
} 

delegateScript().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
