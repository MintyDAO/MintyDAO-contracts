pragma solidity ^0.8.11;

contract FetchFormulaMock {
  uint public bonus = 100;

  function bonusPercent() external view returns(uint){
    return bonus;
  }

  function updateBonusPercent(uint _bonus) external {
    bonus = _bonus;
  }
}
