import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as React from 'react';

import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate } from 'react-router-dom';
import CustomFormikField from '../components/CustomFormikField';
import AppContext from '../hooks/app-context';
import { COLOR_CODES } from '../utils/constants';
// import { loginSchema } from '../validations/validation';

export default function Login() {
	const nav = useNavigate();

	const [showLoader, setShowLoader] = React.useState<boolean>(false);
	const { dispatch } = React.useContext(AppContext);
	const submitHandler = React.useCallback(async (values: any) => {
		try {
			setShowLoader(true);
			const data: any = await axios.post('/auth/login', values);
			setShowLoader(false);
			if (data.success) {
				dispatch({ type: 'SET_TOKEN', payload: data.token });
				localStorage.setItem('AUTH_USER', data.token);
				nav('/dashboard');
			} else {
				alert('Invalid Login Credentials...!');
			}
		} catch (e: any) {
			setShowLoader(false);
			alert(e?.msg ?? 'Invalid Login attempt!');
			console.log(e.error);
		}
	}, []);

	return (
		<>
			<Formik
				initialValues={{
					email: '',
					password: '',
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
								<CustomFormikField name="email" placeholder="Email Address" />

								<CustomFormikField
									name="password"
									placeholder="Password"
									type="password"
								/>

								{/* <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    /> */}
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
										Sign In
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
										<Link to="/auth/register">
											{"Don't have an account? Sign Up"}
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
