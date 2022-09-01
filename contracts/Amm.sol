//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract AMM{
  using SafeMath for uint;
    uint public totalToken1;
    uint public totalToken2;
    uint public totalShares;
    uint public K;
    mapping(address => uint)public accountBalance1;
    mapping(address => uint)public accountBalance2;
    mapping(address => uint)public shares;
    uint public constant PRECISION = 1_000_000;

    modifier validPool{
        require(totalShares > 0,"Liquidity greater then 0");
        _;
    }
    function addToken(uint _addToken1,uint _addToken2)public{
        require(_addToken1 > 0 && _addToken2 > 0,"Token cannot be zero");
        accountBalance1[msg.sender] = accountBalance1[msg.sender].add(_addToken1);
        accountBalance2[msg.sender] = accountBalance2[msg.sender].add(_addToken2);
    } 

    function showBalance()public view returns(uint,uint,uint){
        return(accountBalance1[msg.sender],accountBalance2[msg.sender],shares[msg.sender]);
    }

    function pool(uint _amount1,uint _amount2)public returns(uint share){
        require(_amount1 > 0 ,"Amount cannot be zero");
        require(_amount2 > 0 ,"Amount cannot be zero!");
        require(accountBalance1[msg.sender] >= _amount1,"Insufficient amount");
        require(accountBalance2[msg.sender] >= _amount1,"Insufficient amount");
        // if pool is initially zero;
        if (totalShares == 0){
            share = 100*PRECISION;
            
        }
        // Now values are equivalent or not
        else{
            uint share1 = totalShares.mul(_amount1).div(totalToken1);
            uint share2 = totalShares.mul(_amount2).div(totalToken2);
            require(share1 == share2,"No Equivalent values");
            share=share1;
        }

        accountBalance1[msg.sender] -= _amount1;
        accountBalance2[msg.sender] -= _amount2;
        totalToken1 += _amount1;
        totalToken2 += _amount2;
        K = totalToken1.mul(totalToken2);
        totalShares+=share;
        shares[msg.sender] += share;

    }

    function getSwapEstimateAmount(uint _amountToken1)public validPool view returns(uint amountToken2){
        uint token1After = totalToken1.add(_amountToken1);
        uint token2After = K.div(token1After);
        amountToken2 = totalToken2.sub(token2After);
        if(amountToken2 == totalToken2){
            amountToken2--;
        }

    }
    
    function swapToken1(uint _amountToken1)public validPool returns(uint amountToken2){
        require(accountBalance1[msg.sender] >= _amountToken1,"Insufficient amount");
         require(_amountToken1 > 0,"Amount can not be zero");
        amountToken2 = getSwapEstimateAmount(_amountToken1);
        totalToken2 -= amountToken2;
        totalToken1 += _amountToken1;
        accountBalance1[msg.sender] -= _amountToken1;
        accountBalance2[msg.sender] +=  amountToken2;

    }
    

    

   
}