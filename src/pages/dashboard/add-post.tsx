import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogTitle,
} from '@mui/material';
import axios from 'axios';
import { Form, Formik } from 'formik';
import React from 'react';
import CustomFormikField from '../../components/CustomFormikField';
import { COLOR_CODES } from '../../utils/constants';
import { IPost } from './dashboard';

const AddPost = ({
	open,
	handleClose,
	submitResponseHandler,
	post,
}: {
	open: boolean;
	handleClose: any;
	submitResponseHandler: any;
	post: IPost | null;
}) => {
	const [showLoader, setShowLoader] = React.useState<boolean>(false);

	const addPostHandler = React.useCallback(async (values: any) => {
		try {
			const data: any = await axios.post('/app/blog', values);
			console.log('api response = ', data);
			setShowLoader(false);
			submitResponseHandler(true);
		} catch (e: any) {
			setShowLoader(false);
			submitResponseHandler(false);
		}
	}, []);

	const updatePostHandler = React.useCallback(
		async (values: any) => {
			try {
				const data: any = await axios.put(`/app/blog/${post?.blog_id}`, {
					...values,
				});
				console.log('api response = ', data);
				setShowLoader(false);
				submitResponseHandler(true);
			} catch (e: any) {
				setShowLoader(false);
				submitResponseHandler(false);
			}
		},
		[post],
	);

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>{post ? 'Update Post' : 'Add Post'}</DialogTitle>
			<Formik
				initialValues={{
					review: post ? post.review : '',
					place_name: post ? post.place_name : '',
				}}
				onSubmit={post ? updatePostHandler : addPostHandler}
			>
				{({ errors }) => {
					return (
						<Form>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									width: '400px',
									padding: '20px',
								}}
							>
								<CustomFormikField name="place_name" placeholder="Place Name" />
								<CustomFormikField
									name="review"
									placeholder="Write your thoughts about place"
								/>

								<Box
									sx={{
										m: 1,
										position: 'relative',
										width: '100%',
									}}
								>
									<Button
										type="submit"
										fullWidth
										variant="contained"
										sx={{ mt: 3, mb: 2 }}
										disabled={showLoader}
									>
										{post ? 'Update Post' : 'Save Post'}
									</Button>
									{showLoader && (
										<CircularProgress
											size={24}
											sx={{
												color: COLOR_CODES.tabBtnColor,
												position: 'absolute',
												top: '50%',
												left: '50%',
												marginTop: '-12px',
												marginLeft: '-12px',
											}}
										/>
									)}
								</Box>
							</Box>
						</Form>
					);
				}}
			</Formik>
		</Dialog>
	);
};

export default AddPost;
