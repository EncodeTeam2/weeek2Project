import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { Ballot__factory} from "../typechain-types";
import { Ballot} from "../typechain-types";
import { TransactionReceipt } from "@ethersproject/providers";
import { configureWallet, getArguments } from './Utils';
dotenv.config();


async function deployment(signerWallet: ethers.Wallet, proposals:Array<string>): Promise<TransactionReceipt> {
    // Loads the bytecode from contract.
    // Picks contract factory from typechain.
    // Need to pass signer.
    const ballotContractFactory = new Ballot__factory(signerWallet);
    
    console.log(`Deploying Ballot contract...`);

    // Uses the default signer to deploy the contract with arguments passed.
    // Returns a contract which is attached to an address
    // The contract will be deployed on that address when the transaction is mined.
    const ballotContract = await ballotContractFactory.deploy(
        // The map() method creates a new array populated with the results of 
        // calling a provided function on every element in the calling array.
        proposals.map(p => ethers.utils.formatBytes32String(p))
    ) as Ballot;

    console.log("Waiting for confirmations...")
    
    // Waits that the contract finishes deploying and returns transaction receipt.
    return await ballotContract.deployTransaction.wait();
}

async function deploymentScript() {
    // Clean args passed as parameters and get proposals.
    const proposals = getArguments(process.argv)
    
    // Configure and get signerWallet with msg.sender = chairperson.
    const signerWallet =  configureWallet(process.env.CHAIRPERSON_PRIVATE_KEY)

    // Call deployment function with signer and pass proposals.
    const txReceipt = await deployment(signerWallet, proposals)

    console.log(`
        Action: Deployment
        Deployer: ${txReceipt.from}
        Tx hash: ${txReceipt.transactionHash}
        Block: ${txReceipt.blockNumber}
        Contract Name: Ballot
        Contract Address: ${txReceipt.contractAddress}
        Cost in ETH: ${ethers.utils.formatEther(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice))}
        Confirmations: ${txReceipt.confirmations}
    `)
}

deploymentScript().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  
