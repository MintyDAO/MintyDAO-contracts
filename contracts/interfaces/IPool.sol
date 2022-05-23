pragma solidity >=0.8.0;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IPool {
    function initialize(
        IERC20 _stakingToken,
        IERC20 _earnedToken,
        address _dividendToken,
        uint256 _rewardPerBlock,
        uint256 _depositFee,
        uint256 _withdrawFee,
        uint256 _duration,
        address _uniRouter,
        address _owner,
        address[] memory _earnedToStakedPath,
        address[] memory _reflectionToStakedPath,
        bool _hasDividend
    ) external;

    function transferOwnership(address newOwner) external;

    function depositRewards(uint256 _amount) external;

    function setDuration(uint256 _duration) external;
}
