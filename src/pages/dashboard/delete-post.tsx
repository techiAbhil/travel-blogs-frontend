import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogTitle,
	Typography,
} from '@mui/material';
import axios from 'axios';
import React from 'react';
import { COLOR_CODES } from '../../utils/constants';
import { IPost } from './dashboard';

const DeletePost = ({
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

	const submitHandler = React.useCallback(async () => {
		try {
			const data: any = await axios.delete('/app/post/' + post?.post_id);
			console.log('api response = ', data);
			setShowLoader(false);
			submitResponseHandler(true);
		} catch (e: any) {
			setShowLoader(false);
			submitResponseHandler(false);
		}
	}, [post]);

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle align="center">Delete Post</DialogTitle>
			<Box
				sx={{
					width: 400,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Typography variant="body1">
					Are you sure to delete this post?
				</Typography>
				<Box display={'flex'} justifyContent="center" alignItems={'center'}>
					<Box
						sx={{
							m: 1,
							position: 'relative',
							width: '100%',
						}}
					>
						<Button
							variant="contained"
							color="error"
							sx={{ mt: 3, mb: 2 }}
							disabled={showLoader}
							onClick={submitHandler}
						>
							Yes Delete the Post
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
			</Box>
		</Dialog>
	);
};

export default DeletePost;
