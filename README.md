# Week 2 Project

Form groups of 3 to 5 students
Develop and run scripts for “Ballot.sol” within your group to give voting rights, casting votes, delegating votes and querying results
Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
Submit your code in a github repository in the form.

## Setup

```shell
yarn install
yarn hardhat compile
```

## Test

```shell
yarn hardhat test
```

## Interact

First, put your .env file at root. It should contain:

```shell
CONTRACT_ADDRESS=
CHAIRPERSON_PRIVATE_KEY=
VOTER_PRIVATE_KEY=
VOTER_DELEGATES_PRIVATE_KEY=
INFURA_API_KEY=
INFURA_API_SECRET=
ALCHEMY_API_KEY=
ETHERSCAN_API_KEY=
```

## Deploy setting Chairperson

To run script, pass desired proposals as arguments:

```shell
yarn run ts-node --files ./scripts/Deployment.ts "Proposal 1" "Proposal 2" "Proposal 3"
```

Now, grab returned contract address and add it to .env inside CONTRACT_ADDRESS=

## Give rights to vote to Voter and Voter Delegates as Chairperson

To run script, pass desired address as argument:

```shell
yarn run ts-node --files ./scripts/GiveRightToVote.ts "address voter"
```

```shell
yarn run ts-node --files ./scripts/GiveRightToVote.ts "address voter delegates"
```

## Delegate vote from Voter Delegates to Voter

To run script, pass desired address as argument:

```shell
yarn run ts-node --files ./scripts/Delegate.ts "address voter"
```

## Vote as Voter

To run script, pass desired proposal number as argument:

```shell
yarn run ts-node --files ./scripts/Vote.ts "number"
```

## Check winning proposal and winner name

To run script, run following command with no arguments:

```shell
yarn run ts-node --files ./scripts/WinningProposalAndWinnerName.ts
```
