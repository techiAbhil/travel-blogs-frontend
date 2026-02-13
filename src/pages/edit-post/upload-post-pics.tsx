import { Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { COLOR_CODES } from '../../utils/constants';

const TOAST_TIMER = 3000;
const BlogPicsUpload = ({
	blog_id,
	submitResponseHandler,
}: {
	submitResponseHandler: any;
	blog_id: string;
}) => {
	const [showLoader, setShowLoader] = React.useState<boolean>(false);

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

	const onDrop = useCallback(
		async (acceptedFiles: any[], rejectedFiles: any[]) => {
			if (rejectedFiles.length > 0) {
				setErrorMsg('Please select a valid file');
				return;
			}
			try {
				setShowLoader(true);
				const formData = new FormData();
				formData.append('pictures', acceptedFiles[0]);

				const data: any = await axios.put(
					`/app/blog/pictures/${blog_id}`,
					formData,
				);
				if (data) {
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
		maxFiles: 5,
		onDrop,
	});

	return (
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
						Drag 'n' drop some blog pictures here, or click to select files
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
	);
};

export default BlogPicsUpload;
