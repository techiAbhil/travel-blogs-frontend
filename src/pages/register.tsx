import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as React from 'react';

import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate } from 'react-router-dom';
import CustomFormikField from '../components/CustomFormikField';
import { COLOR_CODES } from '../utils/constants';
// import { loginSchema } from '../validations/validation';

export default function Register() {
	const nav = useNavigate();

	const [showLoader, setShowLoader] = React.useState<boolean>(false);

	const submitHandler = React.useCallback(async (values: any) => {
		try {
			const data: any = await axios.post('/auth/register', values);
			console.log('api response = ', data);
			setShowLoader(false);
			alert('Registration Successful, Please login...!');
		} catch (e: any) {
			setShowLoader(false);
			alert(e?.msg ?? 'Something went wrong!');
			console.log(e?.error);
		}
	}, []);

	return (
		<>
			<Formik
				initialValues={{
					email: '',
					password: '',
					first_name: '',
					last_name: '',
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
								<CustomFormikField name="first_name" placeholder="First Name" />
								<CustomFormikField name="last_name" placeholder="Last Name" />

								<CustomFormikField name="email" placeholder="Email Address" />

								<CustomFormikField
									name="password"
									placeholder="Password"
									type="password"
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
										Sign Up
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
								<Grid container>
									{/* <Grid item xs>
										<Link href="#" variant="body2">
											Forgot password?
										</Link>
									</Grid> */}
									<Grid item>
										<Link to="/auth/login">
											{'Already have an account? Sign In'}
										</Link>
									</Grid>
								</Grid>
							</Box>
						</Form>
					);
				}}
			</Formik>
		</>
	);
}
