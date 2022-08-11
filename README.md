# yMeta-contracts

# .env

```
PRIVATE_KEY=
```

# Deploy

```
yarn hardhat run scripts/deploy.js --network ftm
```

# Run tests
```
1) npm i
2) npx hardhat test
```


# Updates
```
0) No team pre mint ve

1) Lock ve votes for 7 days after each vote in ve.abstain()

2) Fetch mint % bonuses by fetch formula

3) User can convert ETH or deposit Token in fetch and get % bonuses

4) Add GaugesRewardDestributor for send rewards to special pools like USDT/yMeta

5) Add VotersRewardsLock for lock vote rewards and destribute by VotersRewardsFormula

6) Minter desrtribution now (
  20% to team,
  40% to gauges reward destributor,
  40% Locker for voters pool
)


New logic for minter

1. Total possible emissions is 2% per day (14% per week)

2. 50% (0.5%) is set by team to important
 pools

3. Other 50% (0.5%) is set by vote

A. Voters in total need to vote with 10x more ve than the weekly emissions to get full 50% of platform emissions

Example:
if 100 tokens are emitted on week 50, 1000 ve is need to emit full 0.5% to voter pools.

If only 200 ve votes then only 0.1% will be emitted for those voted pools


7) Add percentReduce for reduce weekly mint percent


8) Add migration for minter for case if issue will be found

9) Burn team rewards

if now < unlock time

send to 0x address

else

send to team


10) Add lock time in fetch

Mint now bonuses by this formula

1m 5%
2m 15%
3m 50%
6m 125%
1y 200%
2y 350%
4y 800%

```


# Addresses

```
Admin  0x5cF7699636895dC71ae37d9733cBf7100Ef3DC50

yMeta  0xd5f3fACb47b5054159C686b9F3246A68DB5A3b82

gauges  0xd25e247d1eD11786771dDD341c250d65109AC665

bribes  0xEFa05839904E7D9aCC24e7F54077dDb252bcB2ae

factory  0xAe7272280FEAe3F32b6c4bA79662b737E69f81e6

weth  0xC0c5A650f3560135b36f7bC65d88f31Fd60427c2

router  0xF8d542ac6E3bBC0DE1feBEF99B3537e81AFbf076

library  0x193CC74502f4d70978295E063216c18A45DCe521

ve  0x4634c58a3FA95CbF08c9C4f12bC672219DB9E163

ve_dist  0x1e6a8dabAD5f31510FBe40C21d8d106235c353de

voter  0x030c43D9f2165B7D42404DB33CD9283e00D38194

minter  0x62827738C28A4dd08c6bdAC1dFda81cc7290Fc4E

treasury 0x4e1101b8d44c756cf8e0f0a7a570Ef71840C143D

team wallet 0x58A905C7a4040Aa0bD5204D43a001b1f5e83394c

fetch_formula  0xa1a0815927228eCEcA3eD2856B4f665f8dBCD814

fetch 0xa99D40be43284021B41B2A8409444FE6c0982eed

rewards locker 0x00726BF87016ec5878c39d90056147F38d1A265E

rewards locker formula 0x8EC4F3a6fa30DbCDA59e9AC6Bd3e4826c4991524

pair 0x99535fE670D8FC8F2139f1F643888eECEDd33B9B

gauge_address 0xC71eca67a8e8dC05D4f5A7a4F868E9b0B62163A7

destributor 0xE454145A3a218eccFec0CFc533d55fB2CB2e8b27

dao voter 0x4d989E38A0dd7F7088B02d015941e9E76a2a4ae0

dao treasury 0x9b3434150eFa474e2556c652039830fD0682b5a4

dao converter 0xbC35f41e3b38B6e5ece09cDa31C17C5C0DC79045
```


# NOTE

```
Voter did not initialized

More details in Fetch test.js under SKIPPED comments
```
