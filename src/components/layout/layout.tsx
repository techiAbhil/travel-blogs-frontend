import { AppBar, Grid, Toolbar } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import LOGO from '../../assets/logo.png';
import { COLOR_CODES } from '../../utils/constants';
import ProfileMenu from './profile-menu';

const Layout = () => {
	const nav = useNavigate();
	return (
		<>
			<AppBar position="relative" sx={{ background: COLOR_CODES.white }}>
				<Toolbar>
					<Grid
						display="flex"
						direction="row"
						alignItems="center"
						justifyContent="center"
						container
					>
						<Grid item display="flex" xs={10}>
							<img
								alt="JotForm"
								src={LOGO}
								style={{ height: '60px' }}
								onClick={() => nav('/dashboard')}
							/>
						</Grid>

						<Grid
							item
							display={'flex'}
							justifyContent={'flex-end'}
							alignItems="flex-end"
							xs={2}
						>
							<ProfileMenu />
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<main style={{ paddingBottom: '5px' }}>
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
