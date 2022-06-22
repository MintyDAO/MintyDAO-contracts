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

yMeta  0x17dF9f9Eb39D43889d9A71415F0aDb52AE14b3f0

gauges  0xD9BC517d9b59F369DFA4C6513D4F06a21885D475

bribes  0x69AAcA039f56Db920C2CDf27AF2a27037496AAcF

factory  0xF0d57A6B56bCed7BadebC15F384408F9353e0737

weth  0xc3a8cf8cc88523F621cE6C9cBDff869D5574be5D

router  0x08C300f753429eFA745789346b051b9911073980

library  0x7C7231258C81eE6648635fc353c4b5574cF3431C

ve  0x21d34C4Aa87f0662B282a4987F99eB366Ac28129

ve_dist  0x36Cd8F3250831FEd053a42bC819421124622652A

voter  0xa350d479E6Ef8B09f1793276f9E364aC6C3Ff668

minter  0x7f68A06aB13Ff11d6B050c45aA2BD628704e30B3

treasury  0x95a586F81b8e1b3f0fAb68be030DA305de058F06

fetch_formula  0x6C66eC869AB3A23FBf6B553BDF19002D0D5215AE

fetch  0x909F727f3cE18Bc0b317Aa9e8F942BD088c7b018

rewardsLocker  0xEC81aB521813b4Ca3bC2E4CA64842aE0ba98D075

rewardsFormula  0xb542f7B3907671482CB5B0CBc81c1D51eEeA593B

pair  0x972848939b70A7943FE248C2E6C7b8790afAfFe2
```


# NOTE

```
Voter did not initialized

More details in Fetch test.js under SKIPPED comments
```
