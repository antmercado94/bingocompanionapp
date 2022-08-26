/**
 * Return column and number from last called number
 */

import { useContext } from 'react';
import { GameContext } from '../../Contexts/GameContext';

export default function useCalled() {
	const { calledNumbers, columns } = useContext(GameContext);

	const currentCol = columns[calledNumbers[calledNumbers.length - 1][0]],
		currentNum = calledNumbers[calledNumbers.length - 1][1];

	return { currentCol, currentNum };
}
