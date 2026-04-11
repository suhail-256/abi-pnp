import { useRef } from 'react'
import { useChainId } from 'wagmi'
import { getAbi } from '../services/abiService'
import { AbiSchema, type Abi } from '../schemas/abi'

interface SearchFieldProps {
  setContractAddress: (address: string) => void;
	setAbi: (abi: Abi) => void
}

function SearchField({ setContractAddress: setAddress, setAbi }: SearchFieldProps) {
	const chainId = useChainId()

	const inputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
    
		const address = inputRef.current?.value
    setAddress(address!)

		console.log(address)
		console.log(chainId)

		const abi = await getAbi(chainId, address!)
		console.log(abi)

    // validate abi using zod
    const parsedAbi = AbiSchema.safeParse(abi)
    if (!parsedAbi.success) {
      console.error('Invalid ABI:', parsedAbi.error)
      return
    }
		setAbi(parsedAbi.data)
	}

	return (
		<form onSubmit={handleSubmit}>
			<input ref={inputRef} type="text" placeholder="0x45586..." />
			<button type="submit">Submit</button>
		</form>
	)
}

export default SearchField
