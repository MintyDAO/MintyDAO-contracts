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

    event Create(address indexed pool);

    function create(
        address implementation,
        address stakingToken,
        address earnedToken,
        address dividendToken,
        uint256 _rewardPerBlock,
        uint256[2] memory _fees,
        uint256 _amount,
        uint256 _duration,
        address _uniRouter,
        address[] memory _earnedToStakedPath,
        address[] memory _reflectionToStakedPath,
        bool _hasDividend
    ) external {
        address pool = Clones.clone(implementation);
        IPool(pool).initialize(
            IERC20(stakingToken),
            IERC20(earnedToken),
            dividendToken,
            _rewardPerBlock,
            _fees[0],
            _fees[1],
            _duration,
            _uniRouter,
            msg.sender,
            _earnedToStakedPath,
            _reflectionToStakedPath,
            _hasDividend
        );
        uint256 beforeAmt = IERC20(earnedToken).balanceOf(address(this));
        IERC20(earnedToken).transferFrom(msg.sender, address(this), _amount);
        uint256 afterAmt = IERC20(earnedToken).balanceOf(address(this));
        IERC20(earnedToken).approve(pool, afterAmt - beforeAmt);
        IPool(pool).depositRewards(afterAmt - beforeAmt);
        pools[poolCount] = pool;
        poolCount++;
        emit Create(pool);
    }
}
