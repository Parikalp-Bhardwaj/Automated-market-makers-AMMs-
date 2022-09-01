import React,{useState,useEffect} from 'react';
import {ethers} from "ethers";
import { Box,Tabs,TabList,TabPanel,Tab,TabPanels} from '@chakra-ui/react';
import Swap from "./Swap";
import Pool from "./Pool";
import AddToken from "./AddToken";
import Ammabi from "../artifacts/contracts/Amm.sol/AMM.json"
import Address from "../artifacts/Address.json";

const Home = () => {
  const [accounts,setAccount] = useState(null);
  const [loading,setLoading] = useState(true);
  const [connectContract,setConnectContract] = useState(null);
  const [accountBal1,setAccountBal1] = useState(null)
  const [accountBal2,setAccountBal2] = useState(null)
  const [share,setShare] = useState(null)
  const [_totalToken1,setTotalToken1] = useState(null);
  const [_totalToken2,setTotalToken2] = useState(null);
  const [_totalShare,setTotalShare] = useState(null);
  
  
  const connectWeb = async()=>{
      if(typeof window.ethereum !== "undefined"){
        const account = await window.ethereum.request({method:"eth_requestAccounts"})
        const provider = new ethers.providers.Web3Provider(window.ethereum) 
        setAccount(account[0])

        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        })
    
        window.ethereum.on('accountsChanged', async function (accounts) {
          setAccount(accounts[0])
          await connectWeb()
        })
        const signer = provider.getSigner();
        if ((await signer.getChainId()) !== 31337){
          alert("Please change your network with Localhost hardhat")
        }
        const AmmContract = new ethers.Contract(Address,Ammabi.abi,signer)
        setConnectContract(AmmContract);
        const account1 = await AmmContract.accountBalance1(account[0])
        const account2 = await AmmContract.accountBalance2(account[0])
        const shares = await AmmContract.shares(account[0])
        setAccountBal1(account1.toNumber())
        setAccountBal2(account2.toNumber())
        setShare(shares.toNumber())


        const totalToken1 = await AmmContract.totalToken1();
        const totalToken2 = await AmmContract.totalToken2();
        const totalShare = await AmmContract.totalShares();
        setTotalToken1(totalToken1.toNumber())
        setTotalToken2(totalToken2.toNumber())
        setTotalShare(totalShare.toNumber())
      
        
        setLoading(false);
      }
      else{
        alert("install Meta Mask")
      }
    }

    useEffect(()=>{

      connectWeb()
    },[accounts && !loading])

  return (
    <div>
      <div className='flex justify-center mt-5
        w-96 h-14 bg-black text-white ml-96'>
        {loading?"":(<h1 className="flex justify-center items-center rounded-lg ">{accounts}</h1>)}
      </div>
    <div className="flex flex-rows">
    <div className="text-2xl flex justify-center ml-10 mt-20" >
      <div className="bg-emerald-500">
       <Box  w="800px" h="500px" maxW='md' borderWidth='3px' borderRadius='lg' overflow='hidden'>
       <div className="mx-20">
       <Tabs size='md' variant='enclosed'>
        <TabList>
          <Tab _selected={{ color: 'black' }}
           className="text-white mx-10">Deposit Token</Tab>
          <Tab _selected={{ color: 'black' }}
           className="text-white mx-10">Pool</Tab>
          <Tab _selected={{ color: 'black' }}
           className="text-white mx-10">Swap</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AddToken connectContract={connectContract} accounts={accounts} loading={loading} setLoading={setLoading}/>
          </TabPanel>
          <TabPanel>
            <Pool connectContract={connectContract} accounts={accounts} loading={loading} setLoading={setLoading} />
          </TabPanel>
          <TabPanel>
            <Swap connectContract={connectContract} accounts={accounts} loading={loading} setLoading={setLoading} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      </div>

      </Box>
      </div>
    </div>
    <div>
      <div className="ml-44 mt-20 bg-black">
      <Box  w="400px" h="500px" maxW='md' borderWidth='3px' borderRadius='lg' overflow='hidden'>
      <div className="flex flex-col justify-center mt-10">
        <h1 className="text-white flex justify-center mr-3 mb-5">Details</h1>
        <h3 className="text-white ml-12">Amount of Token 1 : {accountBal1}</h3>
        <h3 className="text-white ml-12">Amount of Token 2 : {accountBal2}</h3>
        <h3 className="text-white ml-12">Total Share: {share} </h3>
      </div>
      <div className="flex flex-col justify-center mt-10">
        <h1 className="text-white flex justify-center mr-3 mb-5">Pool Details</h1>
        <h3 className="text-white ml-12">Amount of Token 1 : {_totalToken1}</h3>
        <h3 className="text-white ml-12">Amount of Token 2 : {_totalToken2}</h3>
        <h3 className="text-white ml-12">Total Share: {_totalShare} </h3>
      </div>
      </Box>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Home