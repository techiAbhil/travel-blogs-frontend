import axios from 'axios';

const imageHandlingAPIRoutes: string[] = [
	'/app/user/upload',
	'/app/blog/pictures',
];
axios.interceptors.request.use((req: any) => {
	req.baseURL = import.meta.env.VITE_PUBLIC_BASE_URL;
	req.headers = {
		'access-control-allow-headers': '*',
		// 'Access-Control-Allow-Origin': '*',
		'content-type': 'application/json',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
	};
	if (imageHandlingAPIRoutes.includes(req.url)) {
		req.headers['content-type'] = 'multipart/form-data';
	}
	if (req.url.startsWith('/app/')) {
		const token = localStorage.getItem('AUTH_USER');
		req.headers.Authorization = `Bearer ${token}`;
	}
	return req;
});

axios.interceptors.response.use(
	(res) => {
		return res.data;
	},
	(error) => {
		if (error?.response?.status === 401) {
			localStorage.clear();
			return Promise.reject('Session timeout!');
		}
		return Promise.reject(error?.response?.data ?? error);
	},
);
