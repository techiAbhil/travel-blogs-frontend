import ProfileIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Box, Button, Modal, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../hooks/app-context';
import { COLOR_CODES } from '../../utils/constants';
import { getUserDetaillsFromToken } from '../../utils/helper';

export default function ProfileMenu() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const nav = useNavigate();
	const handleClose = (navRoute: string) => {
		setAnchorEl(null);
		nav(navRoute);
	};
	const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
	const { dispatch } = React.useContext(AppContext);
	const userDetails = getUserDetaillsFromToken();

	return (
		<div>
			<IconButton
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				aria-label="Profile Icon"
			>
				{userDetails?.profile_pic ? (
					<Avatar
						alt="Remy Sharp"
						src={`${import.meta.env.VITE_ASSETS_URL}profile/${userDetails.profile_pic}`}
						sx={{ width: 56, height: 56 }}
					/>
				) : (
					<ProfileIcon fontSize="large" />
				)}
			</IconButton>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				<MenuItem onClick={() => handleClose('/profile')}>My Profile</MenuItem>
				<MenuItem onClick={() => handleClose('/dashboard')}>My Blogs</MenuItem>
				<MenuItem onClick={() => handleClose('/posts')}>All Blogs</MenuItem>
				<MenuItem onClick={() => setIsOpenModal(true)}>Logout</MenuItem>
			</Menu>

			<Modal
				open={isOpenModal}
				onClose={() => setIsOpenModal(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						background: COLOR_CODES.white,
						height: 170,
						width: 400,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: 5,
					}}
				>
					<LogoutIcon fontSize="large" color="info" />
					<Typography variant="body1" pt={1}>
						Are you sure, you want to logout?
					</Typography>
					<Box
						mt={2}
						display={'flex'}
						justifyContent="center"
						alignItems="center"
					>
						<Button
							variant="contained"
							color="info"
							onClick={() => setIsOpenModal(false)}
							sx={{ mx: 1 }}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="error"
							onClick={() => {
								dispatch({ type: 'CLEAR_STATE' });
								localStorage.removeItem('AUTH_USER');
								setIsOpenModal(false);
								handleClose('/auth/login');
							}}
							sx={{ mx: 1 }}
						>
							Logout
						</Button>
					</Box>
				</Box>
			</Modal>
		</div>
	);
}
