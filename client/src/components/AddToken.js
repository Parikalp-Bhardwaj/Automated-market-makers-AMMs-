import React,{useState} from 'react'
import {Text,Input} from "@chakra-ui/react"
import { useToast } from '@chakra-ui/react'

const AddToken = ({accounts,connectContract,setLoading}) => {
    const toast = useToast()

    const [token1,setToken1] = useState(0);
    const [token2,setToken2] = useState(0);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const addToken = await connectContract.addToken(token1,token2);
        await addToken.wait().then(()=>{
              toast({
                title: `confirm transaction.`,
                status: 'success',
                isClosable: true,
              })

              setToken2(0)
              setToken1(0)
        })

        

        setLoading(true)

    }

    return (
        <div className="flex flex-col justify-center">
        <h1 className="text-yellow-400 text-3xl flex justify-center mt-4">Deposit Token</h1>
        <div className="flex flex-row justify-center  mt-20">
        <Text className="mx-5" mb='15px'>Abc </Text>
        <Input className="px-3 text-white" bg="black" width="400px" height='42px' placeholder='large size' size='lg'
            value={token1} type="number"
            onChange={(e) => setToken1(e.target.value)}
            placeholder='0.0'
        />
        </div>
       <div className="flex flex-row justify-center mt-20">
        <Text className="ml-2" mb='15px'>Xyz</Text>
        <Input className="px-3 text-white ml-10" bg="black" width="400px" height='42px' placeholder='large size' size='lg'
            value={token2} type="number"
            onChange={(e) => setToken2(e.target.value)}
            placeholder='0.0'
        />
        </div>
        
        <button className="flex items-center justify-center bg-blue-500 active:bg-blue-600 
        hover:bg-blue-700 text-white font-bold w-28 mx-64 mt-5
        rounded" onClick={handleSubmit}>Deposit</button>

        </div>
  )
}

export default AddToken