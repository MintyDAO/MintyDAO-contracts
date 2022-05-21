pragma solidity ^0.8.11;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IPool.sol";

contract PoolFactory is Ownable, ReentrancyGuard {
    constructor() {}

    uint256 public poolCount;
    mapping(uint256 => address) public pools;
    address public earnedToken;

    function setEarnedToken(address _earnedToken) external onlyOwner {
        earnedToken = _earnedToken;
    }

    function create(
        address implementation,
        address stakingToken,
        uint256 _rewardPerBlock,
        uint256 _depositFee,
        uint256 _withdrawFee,
        address _uniRouter,
        address[] memory _earnedToStakedPath,
        address[] memory _reflectionToStakedPath,
        bool _hasDividend
    ) external {
        address pool = Clones.clone(implementation);
        IPool(pool).initialize(
            IERC20(stakingToken),
            IERC20(earnedToken),
            earnedToken,
            _rewardPerBlock,
            _depositFee,
            _withdrawFee,
            _uniRouter,
            _earnedToStakedPath,
            _reflectionToStakedPath,
            _hasDividend
        );
        pools[poolCount] = pool;
        poolCount++;
    }
}
