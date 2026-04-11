import { useRef } from 'react'
import { useChainId } from 'wagmi'
import { getAbi } from '../services/abiService'

interface SearchFieldProps {
	setAbi: (abi: JSON) => void
}

function SearchField({ setAbi }: SearchFieldProps) {
	const chainId = useChainId()

	const inputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const address = inputRef.current?.value

		console.log(address)
		console.log(chainId)

		const abi = await getAbi(chainId, address!)
		console.log(abi)

		setAbi(abi)
	}

	return (
		<form onSubmit={handleSubmit}>
			<input ref={inputRef} type="text" placeholder="0x45586..." />
			<button type="submit">Submit</button>
		</form>
	)
}

export default SearchField
