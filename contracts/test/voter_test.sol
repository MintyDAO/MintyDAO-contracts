// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.11;

contract voter_test {

      uint public totalWeight;

      function setTotalWeight(uint _totalWeight) external {
        totalWeight = _totalWeight;
      }

      function notifyRewardAmount(uint amount) external {
        
      }

      function attachTokenToGauge(uint tokenId, address account) external {

      }

      function detachTokenFromGauge(uint tokenId, address account) external {

      }

      function emitDeposit(uint tokenId, address account, uint amount) external {

      }

      function emitWithdraw(uint tokenId, address account, uint amount) external {

      }

      function distribute(address _gauge) external {

      }
}
