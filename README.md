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

MintyDAO  0xd14409e73635c9aF8704C9e7423A208e97c6dea1

gauges  0x694E347D0fD146AF2C27A761cF62fb77EDA20d15

bribes  0x86671dE3e817D0fdE4CB349e81523Bfb2de195DE

factory  0x0F56A7530F9389A8293B19a5F92CDa1A702CbD0c

weth  0xD8875b275cC28f3Cc7a9E99F910d5b229ADf256C

router  0x3452Da1bd792b78153ebdB30c6C84789Ca1Fe6ed

library  0xF8BF446266DacdA76588a551c4766482B4F0084e

ve  0x92f765DA0209e17b9CAB60dCEF2671DF6c75c3a6

ve_dist  0xeFe9b240399Ad72802a672798eb7676479576A30

voter  0x3742fB4261224DCCE9EAd842915246b14f670de3

minter  0xAF8536a4e4229C40e502F4CbF1603B6e901dA973

treasury 0x1f83Bae7f7d79C16f58Ab669a1E1Ccbe26307b53

team wallet 0x22dB1cc52D51cC69575729452c16196f46dD35d4

fetch formula 0x4A7C67aF68ede1ef396467be67112cE645fa9ef4

fetch 0x260050020439bE263184DE7bC823001c33b0834F

rewards locker 0xE8055f9eDb89208e7dCa47ADa1553682D1960d7c

rewards formula 0xdf46e034e693aD3fbe119921d23b284Bd41C13EC

pair 0x31D3B71e433408D2d961BADab857adAB60A046c8

gauge_address 0xE5e06E3F905091cDe188A4e7cB1659da0323D686

gauge rewards destributor 0x1d15bFD075543504FA52E1393795C7eDAf875F15

```


# NOTE

```
Voter did not initialized

More details in Fetch test.js under SKIPPED comments
```
