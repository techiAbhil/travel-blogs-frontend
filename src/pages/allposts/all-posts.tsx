import {
	Alert,
	AlertTitle,
	Button,
	Card,
	CardContent,
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
import CustomCarousel from '../../components/image-slider/image-slider';
import { getUserDetaillsFromToken } from '../../utils/helper';

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

	const deleteBlogHandler = async (blog_id: number) => {
		try {
			await axios.delete(`/app/blog/${blog_id}`);
			const newRows = rows.filter((r) => r.blog_id !== blog_id);
			setRows(newRows);
			setSuccessMsg('Blog has been successfully deleted!');
		} catch {
			setErrorMsg('Could not delete the blog');
		}
	};

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
						<Grid container spacing={2} pt={5}>
							{rows.map((row) => {
								return (
									<Grid key={row.blog_id} item xs={4}>
										<Card
											sx={{
												maxWidth: 345,
												height: 450,
												background: '#e2faec',
												padding: 2,
											}}
										>
											<Box
												display={'flex'}
												justifyContent="center"
												alignItems={'center'}
											>
												<CustomCarousel>
													{row.pictures && row.pictures.length > 0
														? row.pictures.split(', ')?.map((picName) => (
																<img
																	key={picName}
																	src={`${import.meta.env.VITE_ASSETS_URL}images/${
																		picName
																	}`}
																	alt={picName}
																	style={{
																		maxWidth: '50%',
																		height: 'auto',
																	}}
																/>
															))
														: [
																<img
																	key={'default_image'}
																	src={DefaultImg}
																	style={{ height: '200px' }}
																/>,
															]}
												</CustomCarousel>
											</Box>
											<CardContent>
												<Typography gutterBottom variant="h6" component="p">
													{row.place_name}
												</Typography>

												<Typography variant="body2" color="text.secondary">
													{row.review}
												</Typography>
												<Typography
													gutterBottom
													variant="caption"
													component="p"
													align="right"
													pt={1}
												>
													- By {row?.users?.first_name} {row?.users?.last_name}
												</Typography>
											</CardContent>
											{row.users?.user_id === userDetails?.user_id && (
												<CardContent
													style={{
														display: 'flex',
														gap: '10px',
														justifyContent: 'center',
													}}
												>
													<Button
														variant="contained"
														onClick={() => nav(`/posts/update/${row.blog_id}`)}
													>
														Edit Blog
													</Button>
													<Button
														variant="contained"
														color="error"
														onClick={() => deleteBlogHandler(row.blog_id)}
													>
														Delete Blog
													</Button>
												</CardContent>
											)}
										</Card>
									</Grid>
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
