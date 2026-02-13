import {
	Box,
	CircularProgress,
	Dialog,
	DialogTitle,
	Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import AppContext from '../../hooks/app-context';
import { COLOR_CODES } from '../../utils/constants';

const TOAST_TIMER = 3000;
const ProfilePicUpload = ({
	open,
	handleClose,
	submitResponseHandler,
}: {
	open: boolean;
	handleClose: any;
	submitResponseHandler: any;
}) => {
	const [showLoader, setShowLoader] = React.useState<boolean>(false);

	const [error, setError] = useState<string | undefined>(undefined);
	const [success, setSuccess] = useState<string | undefined>(undefined);
	const { dispatch } = React.useContext(AppContext);

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

	const onDrop = useCallback(
		async (acceptedFiles: any[], rejectedFiles: any[]) => {
			if (rejectedFiles.length > 0) {
				setErrorMsg('Please select a valid file');
				return;
			}
			try {
				setShowLoader(true);
				const formData = new FormData();
				formData.append('profile_pic', acceptedFiles[0]);

				const data: any = await axios.put('/app/user/upload', formData);
				const token = data?.refreshToken ?? null;
				if (token) {
					dispatch({ type: 'SET_TOKEN', payload: token });
					localStorage.setItem('AUTH_USER', token);
					setShowLoader(false);
					setSuccessMsg('User profile pic successfully updated...!');
					submitResponseHandler(true);
				} else {
					throw new Error('Something went wrong...!');
				}
			} catch (e) {
				setShowLoader(false);
				setErrorMsg('Could not update the image...!');
			}
		},
		[],
	);

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: { 'image/*': [] },
		maxFiles: 1,
		onDrop,
	});

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle align="center">Upload Profile Pic</DialogTitle>
			<Box
				width={400}
				display="flex"
				justifyContent={'center'}
				alignItems="center"
				p={2}
			>
				<section
					style={{
						border: '0.5px dashed #808080',
					}}
				>
					<div {...getRootProps({ className: 'dropzone' })}>
						<input {...getInputProps()} disabled={showLoader} />
						<Typography p={2}>
							Drag 'n' drop some files here, or click to select files
						</Typography>
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
					</div>
				</section>
			</Box>
		</Dialog>
	);
};

export default ProfilePicUpload;
