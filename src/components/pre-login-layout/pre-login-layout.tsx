import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import LOGO from '../../assets/logo.png';

const PreLoginLayout = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
			}}
		>
			<img alt="JotForm" src={LOGO} style={{ height: '125px' }} />
			<Outlet />
		</Box>
	);
};

export default PreLoginLayout;
