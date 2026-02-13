import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: any }) => {
	const [stateToken, setStateToken] = useState<string>('');
	const [isSetupDone, setIsSetupDone] = useState<boolean>(false);
	useEffect(() => {
		(async () => {
			const token = await localStorage.getItem('AUTH_USER');
			setStateToken(token ?? '');
			setIsSetupDone(true);
		})();
	}, []);
	if (isSetupDone) {
		return !stateToken ? <Navigate to="/auth/login" replace /> : children;
	}
	return <p>Loading...</p>;
};

export default ProtectedRoute;
