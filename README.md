# yMeta-contracts

# run
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

library

0x81B0d2e2fFfA290470a063A05D19a604e9a374b7

yMeta Token

0xF002b0A0767F93b36289aD562a5eF85Fa453466c

ve

0x9dF9dEbcfeAFad72aBD51a45c67160a7EDfdaFcb

Factory

0x311d549A4460425593ce6caDc83174daa2fe1567

WETH (wftm)

0x94c2D8e846005F90D019E83B5b8295b4E1250058

ROUTER

0x70cf669Fe9DBB3f7F7db4bF6370A93b6e0B2A262

Gauge Factory

0xBD77f3739D46271841E7ea6657214C1b452Dbd65

Bribe Factory

0x41c9a5fdf2879070c9B3D45d4F080D6263316f60

Voter

0x16E0c11B31194AdA65cB2bc6766C177F9D0372b2

ve dist

0xDA4472B161e854489e3724fFa44918a04b4Af9Cc

Minter

0x779d80c5438Cf21B8D7c6dE41025456484595Ad1

LD Treasury

0x5e31632b3Ee5e45C119C99cBaA7f052b38c1910c

Fetch

0x66CE1dAc8bf568372b203AB18252189c724918B9

Reward Formula

0x5d29ea3D552Cb0E24a567C3E84D6A38B85C72c93

WTOKEN

0x8cCB881c4F37c4233eD57641f8ce0208C0796200

Stake

0xd9d728F5347c88AA7Cddd65D8baEA55609f08677

Reward Minter

0xc2b3C634273edfc91aDf5F45C944Ea8D1AD7e9E5

Farm (Wtoken vault)

0xc3281a0B53B82733acAF485f3cBa8401DAc17089

```


# NOTE

```
Voter did not initialized

More details in Fetch test.js under SKIPPED comments
```
