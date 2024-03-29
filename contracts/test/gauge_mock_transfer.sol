interface erc20 {
    function totalSupply() external view returns (uint256);
    function transfer(address recipient, uint amount) external returns (bool);
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
    function balanceOf(address) external view returns (uint);
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
    function approve(address spender, uint value) external returns (bool);
}

contract GaugeMockTransfer {
    function notifyRewardAmount(address token, uint amount) external{
      erc20(token).transferFrom(msg.sender, address(this), amount);
    }
}
