pragma solidity 0.8.11;

interface IERC20 {
    function balanceOf(address) external view returns (uint);
}

interface IVoter {
    function totalWeight() external view returns(uint);
}

/*
  Helper contract for rescue if some isue with formula
*/

contract VotersRewardsRescue {
  address public rewardsLocker;
  address public rewardToken;

  constructor(
    address _rewardsLocker,
    address _rewardToken
    )
    public
  {
    rewardsLocker = _rewardsLocker;
    rewardToken = _rewardToken;
  }

  // return 100 rewards
  function computeRewards() public view returns(uint) {
    return IERC20(rewardToken).balanceOf(rewardsLocker);
  }
}
