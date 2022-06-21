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
yMeta  0x0A6b678716129e93100733eF7152E1E8Fb03F313
gauges  0x0aFeE88Ccc628CF279369a9eeAe8Ce8fc3f310c8
bribes  0x31786c9E6F4941c01D04f819603DacE062d8A4A0
factory  0x622d785f2668240dA970b60befd82b161788D376
weth  0xeD12485DEEFeA2f56a3EE9d1AE8EF536B785BdF3

router  0xF27F77355C74A5d3BD223bf8e5D0B60E3235CF4e
library  0x49C1BEC52f61a20b69B4D5538EDC153AB01Dd482
ve  0x95F57958f97b2ff5CF6eCb3Ae2a2381aDe573De9
ve_dist  0x3a9EAB12041d0eE60db4fF8afF636F0bD024f402
voter  0xddBfdfA3535135e0517a84C627542Cc1751a3a55
minter  0x57C1B10147EFe193901CAE8726Ec3b918C4beb38
```


# NOTE

```
Voter did not initialized

More details in Fetch test.js under SKIPPED comments
```
