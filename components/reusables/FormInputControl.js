import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import teal from '@material-ui/core/colors/teal';

const styles = theme => ({
	loginInput: {
		height: 'initial',
	},
	loginLabel: {
		'&$loginFocused': {
			color: teal[500],
		},
	},
	loginFocused: {},
	loginUnderline: {
		'&:after': {
			borderBottomColor: teal[500],
		},
	},
	loginHelperText: {
		height: 0,
		minHeight: 0,
		marginTop: 0,
		lineHeight: '1.5rem',
		overflow: 'visible',
	},
});

const FormInput = (props) => {
	const { classes, className, id, label, value, type, error, errorMessage, onChange } = props;

	let wrapperClass = {};

	if (className) wrapperClass.className = className;

	return (
		<FormControl {...wrapperClass} fullWidth>
			<InputLabel
				htmlFor={id}
				error={props.error}
				classes={{
					root: classes.loginLabel,
					focused: classes.loginFocused,
				}}
			>
				{label}
			</InputLabel>
			<Input
				required 
				autoFocus
				fullWidth
				error={error}
				id={id}
				value={value} 
				type={type || 'string'}
				classes={{
					underline: classes.loginUnderline,
				}}
				inputProps={{
					className: classes.loginInput,
					required: true,
				}}
				onChange={onChange}
			/>
			{!!error && <FormHelperText className={classes.loginHelperText}>{errorMessage}</FormHelperText>}
		</FormControl>
	);
}

export default withStyles(styles, {withTheme: true})(FormInput);