const {expect} = require("chai")
const toWei = (value) => ethers.utils.parseEther(value.toString());
const fromWei = (num) => ethers.utils.formatEther(num)
const getBalance = ethers.provider.getBalance;
describe("Main Contract",()=>{
    let Amm;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let amm;

    beforeEach("",async()=>{
        Amm = await ethers.getContractFactory("AMM");
        amm = await Amm.deploy();
        amm.deployed();
        [owner,addr1,addr2,...addr3] = await ethers.getSigners();

    });

    describe("Deployment",()=>{
        it("Calculate add Tokens",async()=>{
            let addToken = await amm.addToken(1000,1000);
            let [tokenAddress1,tokenAddress2,shares] = await amm.showBalance();
            expect(await tokenAddress1.toString()).to.equal('1000')
            expect(await tokenAddress2.toString()).to.equal('1000')
            expect(await shares.toString()).to.equal('0')
          
        })
        it("Liquidity Pool initially zero",async()=>{
            let addToken = await amm.addToken(1000,1000);
            let lPool = await amm.pool(500,500); 
            let [tokenAddress1,tokenAddress2,shares] = await amm.showBalance();
            expect(await tokenAddress1.toNumber()).to.equal(500)
            expect(await tokenAddress2.toNumber()).to.equal(500)
            expect(await shares.toNumber()).to.equal(100000000)
        })
    })

    describe("Swap Token",()=>{
        it("Swapping Token 1 with token 2",async()=>{
            let addToken = await amm.addToken(1000,1000);
            let lPool = await amm.pool(500,500); 
            let swapAmount= await amm.getSwapEstimateAmount(100);
            let swapToken = await amm.swapToken1(100);
            let [tokenAddress1,tokenAddress2,shares] = await amm.showBalance();
            expect(await tokenAddress1.toNumber()).to.equal(400)
            expect(await tokenAddress2.toNumber()).to.equal(584)
            
        })
    })
 
})

