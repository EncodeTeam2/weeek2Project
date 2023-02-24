# Week 2 Project

Form groups of 3 to 5 students
Develop and run scripts for “Ballot.sol” within your group to give voting rights, casting votes, delegating votes and querying results
Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
Submit your code in a github repository in the form.

## Setup

```
yarn install
yarn hardhat compile
```

## Test

```
yarn hardhat test
```

## Deploy

Put your .env file at root. It should contain:

```
PRIVATE_KEY=""
INFURA_API_KEY=""
INFURA_API_SECRET=""
ALCHEMY_API_KEY=""
ETHERSCAN_API_KEY=""
```

To run Deployment script:

```
yarn run ts-node --files ./scripts/Deployment.ts "Proposal 1" "Proposal 2" "Proposal 3"
```
