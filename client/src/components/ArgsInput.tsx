import React from 'react';
import { AbiFunction, type AbiParameter } from '../types/contract';

interface ArgsInputProps {
	inputs?: AbiParameter[];
	args: string[];
	setArgs: React.Dispatch<React.SetStateAction<string[]>>;
	buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

function ArgsInput({ inputs, args, setArgs, buttonRef }: ArgsInputProps) {
	const handleChange = (index: number, value: string) => {
		const newArgs = [...args];
		newArgs[index] = value;
		setArgs(newArgs);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			buttonRef?.current?.click();
		}
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
					onKeyDown={handleKeyDown}
				/>
			</span>
		);
	});
}

export default ArgsInput;
