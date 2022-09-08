pragma solidity 0.8.11;

interface IERC20 {
    function balanceOf(address) external view returns (uint);
}

interface IVoter {
    function totalWeight() external view returns(uint);
}

/*
Voters in total need to vote more ve than the weekly emissions to get full 100% of platform emissions
*/

contract VotersRewardsFormula {
  IVoter public voter;
  address public rewardsLocker;
  address public rewardToken;

  constructor(
    address _voter,
    address _rewardsLocker,
    address _rewardToken
    )
    public
  {
    voter = IVoter(_voter);
    rewardsLocker = _rewardsLocker;
    rewardToken = _rewardToken;
  }

  function computeRewards() public view returns(uint) {
    uint totalWeight = voter.totalWeight();
    uint currentRewards = IERC20(rewardToken).balanceOf(rewardsLocker);

    if(totalWeight >= currentRewards){
      return currentRewards;
    }
    else{
      return totalWeight;
    }
  }
}
