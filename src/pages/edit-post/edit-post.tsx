import {
	Alert,
	AlertTitle,
	Box,
	Button,
	CircularProgress,
	Container,
} from '@mui/material';
import axios from 'axios';
import { Form, Formik } from 'formik';
import JWT from 'jwt-decode';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BlackPanther from '../../assets/black-panther.jpg';
import CustomFormikField from '../../components/CustomFormikField';
import AppContext from '../../hooks/app-context';
import { COLOR_CODES } from '../../utils/constants';
import BlogPicsUpload from './upload-post-pics';
import { useParams } from 'react-router-dom';
import { getUserDetaillsFromToken } from '../../utils/helper';

const TOAST_TIMER = 3000;

const EditPost = () => {
	const [showLoader, setShowLoader] = useState<boolean>(false);
	const [blogDetails, setBlogDetails] = useState<any>(null);
	const { blog_id } = useParams();
	const [openProfileUploadDialog, setOpenProfileUploadDialog] =
		useState<boolean>(false);

	const [error, setError] = useState<string | undefined>(undefined);
	const [success, setSuccess] = useState<string | undefined>(undefined);

	useEffect(() => {
		setShowLoader(true);
		axios
			.get(`/app/blog/${blog_id}`)
			.then((data) => {
				setBlogDetails(data?.blog);
			})
			.finally(() => {
				setShowLoader(false);
			});
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

	const blogPicUploadResponseHandler = useCallback((isSUccess: boolean) => {
		if (isSUccess) {
			setOpenProfileUploadDialog(false);
			setSuccessMsg('Post has been successfully added...!');
		} else {
			setErrorMsg('Something went wrong while adding post...!');
		}
	}, []);

	const submitHandler = React.useCallback(async (values: any) => {
		try {
			setShowLoader(true);
			const data: any = await axios.put(`/app/blog/${blog_id}`, values);
			if (data.blog) {
				setShowLoader(false);
				setSuccessMsg('Blog details successfully updated...!');
				setBlogDetails({ ...blogDetails, ...data.blog });
			} else {
				throw new Error('Something went wrong...!');
			}
		} catch (e: any) {
			setShowLoader(false);
			setErrorMsg(e?.message ?? 'Something went wrong!');
		}
	}, []);

	const blogImages = useMemo(() => {
		if (blogDetails?.profile_pic) {
			return `${import.meta.env.VITE_ASSETS_URL}profile/${blogDetails?.profile_pic}`;
		}
		return BlackPanther;
	}, [blogDetails?.profile_pic]);
	return (
		<Box
			sx={{
				bgcolor: 'background.paper',
				pt: 2,
				pb: 6,
			}}
		>
			<Container maxWidth="sm">
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
				<Box display="flex" justifyContent="center" alignItems="center" pt={3}>
					{blogDetails && (
						<div>
							<Formik
								initialValues={{
									place_name: blogDetails?.place_name ?? '',
									review: blogDetails?.review ?? '',
								}}
								// validationSchema={loginSchema}
								onSubmit={submitHandler}
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
												}}
											>
												<Box
													display="flex"
													justifyContent="center"
													alignItems="center"
													my={2}
													sx={{
														'& :hover': {
															cursor: 'pointer',
														},
													}}
													onClick={() => setOpenProfileUploadDialog(true)}
												>
													<BlogPicsUpload
														submitResponseHandler={blogPicUploadResponseHandler}
														blog_id={blog_id ?? ''}
													/>
												</Box>

												<CustomFormikField
													name="place_name"
													placeholder="Enter place name"
												/>
												<CustomFormikField
													type="textarea"
													name="review"
													placeholder="Enter review"
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
														Save Changes
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
						</div>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default EditPost;
