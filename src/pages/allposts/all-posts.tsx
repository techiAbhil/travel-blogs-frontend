import {
	Alert,
	AlertTitle,
	Avatar,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Grid,
	Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import DefaultImg from '../../assets/No_Image.jpg';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { getUserDetaillsFromToken } from '../../utils/helper';
import ProfileIcon from '@mui/icons-material/AccountCircle';

interface IPost {
	place_name: string;
	review: string;
	blog_id: number;
	users: any;
	pictures?: string;
}
const TOAST_TIMER = 3000;
export default function AllPosts() {
	const nav = useNavigate();
	const [showLoader, setShowLoader] = useState<boolean>(false);

	const [error, setError] = useState<string | undefined>(undefined);
	const [success, setSuccess] = useState<string | undefined>(undefined);

	const [rows, setRows] = useState<IPost[]>([]);
	const userDetails = getUserDetaillsFromToken();

	const setErrorMsg = useCallback((error_msg: string) => {
		setError(error_msg);

		setTimeout(() => {
			setError(undefined);
		}, TOAST_TIMER);
	}, []);

	const setSuccessMsg = useCallback((success_msg: string) => {
		setSuccess(success_msg);

		setTimeout(() => {
			setSuccess(undefined);
		}, TOAST_TIMER);
	}, []);

	const getAllPosts = useCallback(async () => {
		setShowLoader(true);
		try {
			const { blogs }: any = await axios.get('/app/blog');
			setRows(blogs);
		} finally {
			setShowLoader(false);
		}
	}, []);

	useEffect(() => {
		try {
			getAllPosts();
		} catch (e) {
			setErrorMsg('Failed to load posts, please reload the page');
		}
	}, []);

	return (
		<>
			{/* Hero unit */}
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 2,
					pb: 6,
				}}
			>
				<Container>
					{rows.length === 0 && (
						<Typography variant="h3" color="Highlight">
							{showLoader ? 'Loading, please wait...!' : 'No posts are there!'}
						</Typography>
					)}
					{rows.length > 0 && (
						<Grid
							container
							spacing={2}
							gap={5}
							justifyContent={'center'}
							mt={5}
						>
							{rows.map((row) => {
								return (
									<Card
										key={row.blog_id}
										sx={{
											background: '#e2faec',
											width: '400px',
										}}
									>
										<CardHeader
											avatar={
												row.users?.profile_pic ? (
													<Avatar
														alt="Remy Sharp"
														src={`${import.meta.env.VITE_ASSETS_URL}profile/${row.users.profile_pic}`}
														sx={{ width: 56, height: 56 }}
													/>
												) : (
													<ProfileIcon fontSize="large" />
												)
											}
											title={row.place_name}
											subheader={`By ${row?.users?.first_name} ${row?.users?.last_name}`}
										/>
										<Carousel autoPlay>
											{row.pictures && row.pictures.length > 0
												? row.pictures
														.split(', ')
														?.map((picName) => (
															<CardMedia
																key={picName}
																component="img"
																height="250"
																image={`${import.meta.env.VITE_ASSETS_URL}images/${
																	picName
																}`}
																alt={picName}
															/>
														))
												: [
														<div>
															<img
																key={'default_image'}
																src={DefaultImg}
																style={{ height: '200px' }}
															/>
														</div>,
													]}
										</Carousel>
										<CardContent>
											<Typography
												variant="body2"
												sx={{ color: 'text.secondary' }}
											>
												{row.review}
											</Typography>
										</CardContent>
									</Card>
								);
							})}
						</Grid>
					)}
				</Container>
			</Box>

			{error && (
				<Alert severity="error">
					<AlertTitle>Error</AlertTitle>
					{error}
				</Alert>
			)}
			{success && (
				<Alert severity="success">
					<AlertTitle>Success</AlertTitle>
					{success}
				</Alert>
			)}
		</>
	);
}
