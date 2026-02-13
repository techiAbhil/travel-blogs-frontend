import jwtDecode from 'jwt-decode';

export const getUserDetaillsFromToken = () => {
	return jwtDecode(localStorage.getItem('AUTH_USER') || '');
};
