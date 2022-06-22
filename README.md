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

1) Lock ve votes for 7 days after each vote

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

```


# Addresses

```
Admin  0x5cF7699636895dC71ae37d9733cBf7100Ef3DC50

yMeta  0x6aa3Ab3192E23B69915b6f146402fF3B123b63eF

gauges  0xE41355bCF099B1aE987cE3a1798db41F67CC08e7

bribes  0x4eABE00Cca39799Fe3BFd8BC0c3e77d814987217

factory  0xeC32e114cE4Da675d6644f72D0a30f8139279d9b

weth  0x1B78ba7B5f886DaB3755f4233dA73D4f196Ef6f3

router  0xd5102983A0Ab08EAA60a53427d91f058Aa1814EF

library  0xBb1f8f0C787B3328284Bd2830Be0e90E5d496915

ve  0x599bef829D74b8f503612de4863445519A98194B

ve_dist  0x0A08fb712af91a144e01639b9D347d6Ecd90a9cE

voter  0x5754D4Ee665F4fd7008d9dF16A000aEc75045220

minter  0x4fe4C0aBF5b606f6F8d06a79F74c4029F2872eE3

treasury  0x179144180ffA376176Ca453F9Fe8f19F642D9c57

fetch_formula  0xa1a0815927228eCEcA3eD2856B4f665f8dBCD814

fetch  0xC17E076947C8730Cb56c714Bfb73769A0Eb7801E

rewardsLocker  0xf8f1751AC781085449ce3c0dE2BE561f2920065d

rewardsFormula  0xfc7af9A1d4a4995537955447d7D32643a77E924A

pair  0x32c286185C505FC48Dbc433af8668b6f664078bD
```


# NOTE

```
Voter did not initialized

More details in Fetch test.js under SKIPPED comments
```
