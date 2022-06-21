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

1. Total possible emissions is 1% per day

2. 50% (0.5%) is set by team to important
 pools

3. Other 50% (0.5%) is set by vote

A. Voters in total need to vote with 10x more ve than the weekly emissions to get full 50% of platform emissions

Example:
if 100 tokens are emitted on week 50, 1000 ve is need to emit full 0.5% to voter pools.

If only 200 ve votes then only 0.1% will be emitted for those voted pools


7) Add migration for minter for case if issue will be found

```


# Addresses

```
Admin  0x5cF7699636895dC71ae37d9733cBf7100Ef3DC50

yMeta  0xaa72d42e0eB92665ceba49edE5A444C7dE5FaC41

gauges  0x4A8f4cAdccf06dF816d9117E5889B9F2380416C1

bribes  0x35Cd1A9f6fD7089261d11E0B30E21fCAD8B3DC06

factory  0x77905bae66AF11d7179DE3F7dDBFE4b820BA6FB0

weth  0x035C93C8679Db5d3d4b31089Da90aE1de2F1AdfD

router  0x5683437907fbc49A56163F0253890f8D7aB1F4AE

library  0xFD05843Ec9efa6EA0d4587C527970f26717FC19d

ve  0x92134Bf21456546942f02bfFcd0a0B70f226A92B

ve_dist  0x5D8C8BDbF62dfD86107C317c60eB2FF377f00769

voter  0xc9fbF428EAC1382DA527fb8ADC4e1200D786f561

minter  0x807B507146B154aa033CbD0F6d513109bb35b0d9

treasury  0x6f0755F95E330a0d7e0e6Bb6543B718607A399DE

fetch_formula  0xb3D6F15ae56c56432aDD0DDC175A58932F96Eab5

fetch  0x9aaE65b4bCA93120704bd67Cc7992fe0142DB8d8

rewardsLocker  0x277bFC6Acd51dd6d904C9DdE95867cDf43B33981

rewardsFormula  0x936f0a3866D070758498a181323efA2Bab1970Bc

pair  0xEE4A66F3c76788Ce1C59A57E025f2530ad07F6c9

yMeta/WETH gauge 0x9EF137C23d7b75Fcef1A206AD067135C4bfe8f9B

gauge destributor 0x2FFe50693f28e0B17A964C85a9Fdb60880034d76

teamWallet 0x51E9B78bC35E7bE56F3691387d3b389EDAd91Df4
```


# NOTE

```
Voter did not initialized

More details in Fetch test.js under SKIPPED comments
```
