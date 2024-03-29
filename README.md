# MINTS-contracts

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

1) Lock ve vote() option in voter for 7 days after each vote in ve.abstain() method. REDO MOVED lock logic from ve.abstain() to voter.vote() method. ve NFT original now, only changed name and symbol !

2) Fetch mint % bonuses of platform token by fetch formula

3) User can convert and lock ETH or deposit and lock Platform Token in fetch and get % bonuses of Platform Token

4) Add GaugesRewardDistributor for destribute rewards by shares to special platform pools with platform token inside

5) Add VotersRewardsLock for lock users rewards and destribute rewards to users gauges by VotersRewardsFormula

5.1) VotersRewardsFormula works like this
Example
(
  Voters in total need to vote with 10x more ve than the weekly emissions to get full 100%
  Example:
  if 100 tokens are emitted, 1000 ve is need to emit full 100% to voter pools.
  If only 200 ve then only 20% can be send for users voted pools
)

6) Minter desrtribution now

Example
(
  34% to team wallet
  33% platform pools (only mints based)
  33% locker for users pool (unlock by formula)
)

7) Add percentReduce for reduce weekly rewards in minter

8) Add migration for minter for case if issue will be found in minter

9) Burn team rewards in minter

Example
(
  if now < unlock time

  send to 0x address

  else

  send to team
)

10) Add lock time in fetch

Mint fetch bonuses by this formula

1d 1
1w 5
2w 10
1m 20
3m 50

6m 100
1y 100
2y 100
3y 100
4y 100

11) Add GaugeWhiteList for now BaseV1Voter.createGauge require token in pool pair from GaugeWhiteList or pool it self should be white listed, or admin disable GaugeWhiteList verification

```

# Links

```
OperWallet unit tests

https://github.com/MintyDAO/MintyDAO-wallet/blob/main/test/wallet-test.js

DAO treasury unit tests

https://github.com/MintyDAO/MintyDAO-DAO-treasury/tree/main/test
```


# Addresses ETH Mainnet

```
Admin  0x5cF7699636895dC71ae37d9733cBf7100Ef3DC50

MintyDAO  0xEfCa0d0dDfF6a7B70302d8cC58c7162F3581bC43

gauges  0x9A06181ff6Cd034303636B0E45eD0D8019f9cE83

bribes  0x15129c8AB7e4D5502d8B350Ba801Aa248442b65d

factory  0x6435F8ebe37B5d3C5E2f6f0bCA27264CBA6B8eD2

weth  0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

router  0x9aB8E17bFdE144F0Ca46D81ED1144616d6433DA3

library  0x5001991a4F325D1C90e8a13287441f1097A43F5D

ve  0x5242562a82DD13CcaB1fbFF9C89821cf2fB35aD5

ve_dist  0x1818E5CdB48addc868cb201C450A738eC41f1957

gaugeWL  0x8d81d0047Be06Ad408131dB2b4F6f242f1A016fc

voter  0x6aDfE9527Fc6a06cb6F71f17087238F32b8CFAF6

minter  0x7480f09D1Db2afB28CbbD969dEDd431b0503D7C2

treasury  0x5ecb6C4E12D5248e9d9b42F8F3ef53FD2f06547B

oper wallet 0xA1A9F0d533dcfD94aE5D222cd4A36F69AbC89F03

oldest fetch formula 0x5656a53b8fa8355858f4e63d0d7087cA436FCf5f

old fetch formula 0x516949CBE797640562F8010E5B15f6c5Cd61ABb9

fetch formula 0x99332B6685F52C2a0A838E8E413542A565D226B1

old fetch1 0x1CAd851eD1640C78131016346b5E10A145b8FB4D

old fetch2 0xed0835bdf6851b67EEf7aFB9cb89C59725968cE5

new fetch 0x125FE5a3907293FDa4AFd7b8703fd9E4e2b14a5D

rewards locker 0x053531DC829f8110c32295D8F6454e784C07eC01

rewards locker formula 0x2975c2FDf1B077407DB7f77f63E03e95e235DB8E

weth/mints pair 0x6BCbEf39C8A0ce72EE4a6f4B3A1D8Eb1CE127a26

weth/mints gauge 0x075DF69AE78687866bcd4522c9EEa44C1f82C240

platform gauges distributor 0xA20FAeafd5c0b66729BAfC2530398f3d1027C42E

multicall 0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696

DAO treasury voter 0x3A32d09dB549cE945630bc91179716AD7d7D5567

DAO treasury converter 0x76521d62Fc2c5cD2a65917EE26EB3ae352d2d4F4

DAO treasury 0x631EAc295C20aAFf6BAF6397cC4a807Cba904cF9

```

# Addresses Rinkeby

```
Admin  0x5cF7699636895dC71ae37d9733cBf7100Ef3DC50

MintyDAO  0x7107c32a35F52c87a4db95565B389832773CB743

gauges  0x0574C2c26c5FA3C5C277d270A826495BD65e4BA3

bribes  0x89138b17385c64563fce70522Bdf11D042d61d16

factory  0x706d338CFCDd1F0d2Dc70cF1aD7ED4E210b19407

weth  0x5fF28752917232e7e71a1437F93be2F5fa70DF43

router  0xEeA94DaAC838f8AF8C67DbBE212ca2E09aA4669e

library  0x52017E66052F6A42E865b5A2c124A870F0e598FE

ve  0xfeC2C90Fd4647bBF2B1075488FcEd8BE2C508FD4

ve_dist  0x75DF3625391c45BF81AE839b979138dccB3fBEA8

gaugeWL  0xCdF0B63a96EaA5491a725f0637a2867a694af660

voter  0xF7EDe585f6191335c9Eb81644D02F33Ca7bC8752

minter  0x988e561b5d0244317EEA41953c2fC1aEDf9326E4

treasury  0xF91eD0210e4188a0cC48622C5c1FF15cf0ac5617

OperWallet 0x196b3bE5327f086A80965f1De4D2641e6834ee79

fetch_formula  0x76b4A58fc8F8A14C6A91799dEabb5EC9cD0228e1

fetch  0xEc05EE330937aC2659389F0a7c13959f1823c130

rewardsLocker  0x115eaeF74E98d97c9dB820Bf2318fB06C8Def3e3

rewardsFormula  0x02B7573fd4633c09A421acAA1Af9767cAdd5934d

pair  0xBDa2E295c15A065f67fFc92D0B1c99d09db7A908

gauge WETH/MINTS 0xefE4608C164D0FA6f7809E83DEeA4097dF24b6a8

gauges distrebutor 0xbeCE2f4AC46Ba3526A0A124f5c5e2b93A0c11414

multicall 0x83A9b408166Fa09459f7C07a4f3de606D9C3bEe9
```

# Addresses FTM

```
Admin  0x5cF7699636895dC71ae37d9733cBf7100Ef3DC50

MintyDAO token 0xd14409e73635c9aF8704C9e7423A208e97c6dea1

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

new fetch formula 0xf7Ab17c085162c045C56736635d61360D14d8822

fetch 0x260050020439bE263184DE7bC823001c33b0834F

rewards locker 0xE8055f9eDb89208e7dCa47ADa1553682D1960d7c

rewards formula 0xdf46e034e693aD3fbe119921d23b284Bd41C13EC

pair 0x31D3B71e433408D2d961BADab857adAB60A046c8

gauge_address 0xE5e06E3F905091cDe188A4e7cB1659da0323D686

gauge rewards destributor 0x1d15bFD075543504FA52E1393795C7eDAf875F15

DAO converter 0xbF23b40D404fDC556Bdd65c6Fe04dBeC9c8ca9cf

DAO voter 0xAE25EADF2A478d2ef2Ad5F1830E4AcD0B305dBaC

DAO for treasury 0x5FAa42e0b0fDC1338eA01dEfEFb058Fe4682D7aa

New DAO for treasury 0x2cD119Da895bF24d517d425547ff56eDCb9569f8

LATEST DAO for treasury 0xdC6961850b434Faf9F2589e2BDCf8443D065229e

```


# NOTE

```
Voter did not initialized

More details in Fetch test.js under SKIPPED comments
```
