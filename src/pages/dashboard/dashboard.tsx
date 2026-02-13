import {
	Alert,
	AlertTitle,
	Button,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AddPost from './add-post';

export interface IPost {
	place_name: string;
	review: string;
	blog_id: number;
	pictures: string;
}
const TOAST_TIMER = 3000;
export default function Dashboard() {
	const nav = useNavigate();
	const [openAddBlogDialog, setOpenAddBlogDialog] = useState<boolean>(false);

	const [error, setError] = useState<string | undefined>(undefined);
	const [success, setSuccess] = useState<string | undefined>(undefined);

	const [rows, setRows] = useState<IPost[]>([]);

	const getPostsForUser = useCallback(async () => {
		const { blogs }: any = await axios.get('/app/blog/my');
		if (Array.isArray(blogs)) setRows(blogs);
	}, []);

	useEffect(() => {
		getPostsForUser();
	}, []);

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

	const addPostResponseHandler = useCallback((isSUccess: boolean) => {
		if (isSUccess) {
			getPostsForUser();
			setOpenAddBlogDialog(false);
			setSuccessMsg('Post has been successfully added...!');
		} else {
			setErrorMsg('Something went wrong while adding post...!');
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
					<Box
						py={1.5}
						display="flex"
						justifyContent={'end'}
						alignItems="center"
					>
						<Button
							variant="contained"
							color="success"
							onClick={() => setOpenAddBlogDialog(true)}
						>
							Add a Blog
						</Button>
					</Box>
					{rows.length === 0 && (
						<>
							<Typography variant="h5" color="Highlight">
								You have been successfully logged in...!
							</Typography>
							<Typography variant="h6" color="InfoText">
								Please click on add blog and write about your adventure
							</Typography>
						</>
					)}
					{rows.length > 0 && (
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead
									sx={{
										background: '#ccc',
									}}
								>
									<TableRow>
										<TableCell>Blog ID</TableCell>
										<TableCell align="center">Place</TableCell>
										<TableCell align="center">Review</TableCell>
										<TableCell align="center">Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map((row) => (
										<TableRow
											key={row.blog_id}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{row.blog_id}
											</TableCell>
											<TableCell align="center" component="th" scope="row">
												{row.place_name}
											</TableCell>
											<TableCell align="center">{row.review}</TableCell>
											<TableCell align="center">
												<CardContent
													style={{
														display: 'flex',
														gap: '10px',
														justifyContent: 'center',
													}}
												>
													<Button
														variant="outlined"
														onClick={() => nav(`/posts/update/${row.blog_id}`)}
													>
														Edit Blog
													</Button>
													<Button
														variant="outlined"
														color="error"
														onClick={() => deleteBlogHandler(row.blog_id)}
													>
														Delete Blog
													</Button>
												</CardContent>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Container>
			</Box>

			<AddPost
				open={openAddBlogDialog}
				handleClose={() => {
					setOpenAddBlogDialog(false);
				}}
				submitResponseHandler={addPostResponseHandler}
				post={null}
			/>
		</>
	);
}
