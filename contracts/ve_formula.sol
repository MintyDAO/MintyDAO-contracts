pragma solidity 0.8.11;

import "./interfaces/IPancakeRouter01.sol";
import "./interfaces/IPancakeFactory.sol";
import "./interfaces/IPancakePair.sol";

contract ve_formula {
    address public routerAddress = 0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52;
    address public usdcAddress = 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83;

    function getMaxTime(
        address token,
        uint256 supply,
        uint256 constructTime,
        uint256 maxX,
        uint256 maxY
    ) public view returns (uint256) {
        address factory = IPancakeRouter01(routerAddress).factory();
        address pair = IPancakeFactory(factory).getPair(token, usdcAddress);
        (
            uint256 reserveIn,
            uint256 reserveOut,
            uint256 timestamp
        ) = IPancakePair(pair).getReserves();
        uint256 supplyprice;
        if (reserveIn != 0 && reserveOut != 0 && supply != 0)
            supplyprice =
                IPancakeRouter01(routerAddress).getAmountOut(
                    supply,
                    reserveIn,
                    reserveOut
                ) /
                (10**6);
        supplyprice = supply;
        if (block.timestamp - constructTime >= maxX || supplyprice >= maxY)
            return 16 * 7 * 86400;
        if (
            block.timestamp - constructTime >= 14 * 86400 ||
            supplyprice >= 100000 * 1000 * 10**18
        ) return 14 * 7 * 86400;
        if (
            block.timestamp - constructTime >= 14 * 86400 ||
            supplyprice >= 30000 * 1000 * 10**18
        ) return 12 * 7 * 86400;
        if (
            block.timestamp - constructTime >= 14 * 86400 ||
            supplyprice >= 10000 * 1000 * 10**18
        ) return 10 * 7 * 86400;
        if (
            block.timestamp - constructTime >= 14 * 86400 ||
            supplyprice >= 4000 * 1000 * 10**18
        ) return 8 * 7 * 86400;
        if (
            block.timestamp - constructTime >= 14 * 86400 ||
            supplyprice >= 2000 * 1000 * 10**18
        ) return 6 * 7 * 86400;
        if (
            block.timestamp - constructTime >= 7 * 86400 ||
            supplyprice >= 1000 * 1000 * 10**18
        ) return 4 * 7 * 86400;
        if (
            block.timestamp - constructTime >= 4 * 86400 ||
            supplyprice >= 400 * 1000 * 10**18
        ) return 3 * 7 * 86400;
        if (
            block.timestamp - constructTime >= 2 * 86400 ||
            supplyprice >= 200 * 1000 * 10**18
        ) return 2 * 7 * 86400;
        if (
            block.timestamp - constructTime >= 1 * 86400 ||
            supplyprice >= 100 * 1000 * 10**18
        ) return 1 * 7 * 86400;
        return 86400;
    }
}
