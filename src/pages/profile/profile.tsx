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
import ProfilePicUpload from './upload-profile-pic';

const TOAST_TIMER = 3000;

const Profile = () => {
	const [showLoader, setShowLoader] = useState<boolean>(false);
	const [userDetails, setUserDetails] = useState<any>(null);
	const [openProfileUploadDialog, setOpenProfileUploadDialog] =
		useState<boolean>(false);
	const { dispatch } = React.useContext(AppContext);

	const refreshForm = () => {
		const token = localStorage.getItem('AUTH_USER');
		const decoded = JWT(token ?? '');
		setUserDetails(decoded);
	};

	useEffect(() => {
		refreshForm();
	}, []);

	const [error, setError] = useState<string | undefined>(undefined);
	const [success, setSuccess] = useState<string | undefined>(undefined);

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

	const profileUploadResponseHandler = useCallback((isSUccess: boolean) => {
		if (isSUccess) {
			refreshForm();
			setOpenProfileUploadDialog(false);
			setSuccessMsg('Post has been successfully added...!');
		} else {
			setErrorMsg('Something went wrong while adding post...!');
		}
	}, []);

	const submitHandler = React.useCallback(async (values: any) => {
		try {
			const { refreshToken }: any = await axios.post('/app/user', values);
			if (refreshToken) {
				dispatch({ type: 'SET_TOKEN', payload: refreshToken });
				localStorage.setItem('AUTH_USER', refreshToken);
				setShowLoader(false);
				setSuccessMsg('User details successfully updated...!');
				refreshForm();

				// window.location.reload();
			} else {
				throw new Error('Something went wrong...!');
			}
		} catch (e: any) {
			setShowLoader(false);
			setErrorMsg(e?.message ?? 'Something went wrong!');
		}
	}, []);

	const porileImgSrc = useMemo(() => {
		if (userDetails?.profile_pic) {
			return `${import.meta.env.VITE_ASSETS_URL}profile/${userDetails?.profile_pic}`;
		}
		return BlackPanther;
	}, [userDetails?.profile_pic]);
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
					<ProfilePicUpload
						submitResponseHandler={profileUploadResponseHandler}
						open={openProfileUploadDialog}
						handleClose={() => setOpenProfileUploadDialog(false)}
					/>
					{userDetails && (
						<div>
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
								<img
									alt="Profile Pic"
									src={porileImgSrc}
									style={{
										width: '150px',
										height: '150px',
										borderRadius: '50%',
									}}
								/>
							</Box>
							<Formik
								initialValues={{
									email: userDetails?.email ?? '',
									first_name: userDetails?.first_name ?? '',
									last_name: userDetails?.last_name ?? '',
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
												<CustomFormikField
													name="first_name"
													placeholder="First Name"
												/>
												<CustomFormikField
													name="last_name"
													placeholder="Last Name"
												/>

												<CustomFormikField
													name="email"
													placeholder="Email Address"
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

export default Profile;
