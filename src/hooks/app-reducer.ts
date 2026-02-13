import { useReducer } from 'react';

const useAppReducer = () => {
	const [appState, dispatch] = useReducer(
		(state: any, action: any) => {
			switch (action.type) {
				case 'SET_TOKEN':
					return { ...state, token: action.payload };
				case 'CLEAR_STATE':
					return { token: '' };
				default:
					return state;
			}
		},
		{ token: '' }
	);

	return {
		appState,
		dispatch,
	};
};

export default useAppReducer;
