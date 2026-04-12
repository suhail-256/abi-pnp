import React from 'react';
import { AbiFunction, type AbiParameter } from '../types/contract';

interface ParamsInputProps {
	inputs?: AbiParameter[];
	args: string[];
	setArgs: React.Dispatch<React.SetStateAction<string[]>>;
}

function ParamsInput({ inputs, args, setArgs }: ParamsInputProps) {
	const handleChange = (index: number, value: string) => {
		const newArgs = [...args];
		newArgs[index] = value;
		setArgs(newArgs);
	};

	return inputs?.map((input, index) => {
		const paramName = input.name || `input`;
		return (
			<span key={index}>
				<br />
				<input
					type="text"
					placeholder={`${paramName} (${input.type})`}
					value={args[index] || ''}
					onChange={e => handleChange(index, e.target.value)}
				/>
			</span>
		);
	});
}

export default ParamsInput;
