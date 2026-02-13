import { TextField } from '@mui/material';
import { ErrorMessage, Field } from 'formik';

const CustomFormikField = ({
	name,
	className,
	type = 'text',
	placeholder,
	hideErrorMsg = false,
	errorMessageComponent = 'div',
}: {
	name: string;
	className?: string;
	type?: string;
	placeholder?: string;
	hideErrorMsg?: boolean;
	errorMessageComponent?: string;
}) => {
	return (
		<>
			<Field
				type={type}
				className={className}
				placeholder={placeholder}
				name={name}
				as={TextField}
				margin="normal"
				fullWidth
			/>
			{!hideErrorMsg && (
				<ErrorMessage
					className="error-message"
					name={name}
					component={errorMessageComponent}
				/>
			)}
		</>
	);
};

export default CustomFormikField;
