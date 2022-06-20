# yMeta-contracts

# .env

```
PRIVATE_KEY=
ADMIN_ADDRESS=
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


# NOTE

```
Voter did not initialized

More details in Fetch test.js under SKIPPED comments
```
