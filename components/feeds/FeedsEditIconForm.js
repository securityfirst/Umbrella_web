import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
	form: {
		margin: '2rem 0 5rem',
	},
	input: {
		height: 'initial',
	},
	label: {
		'&$focused': {
			color: theme.palette.grey[600],
		},
	},
	focused: {},
	underline: {
		'&:after': {
			borderBottomColor: theme.palette.secondary.main,
		},
	},
	helperText: {
		height: 0,
		minHeight: 0,
		marginTop: 0,
		lineHeight: '1.5rem',
		overflow: 'visible',
	},
});

class FeedsEditIconForm extends React.Component {
	render() {
		const { classes, id, label, value, error, errorMessage, onChange } = this.props;

		return (
			<form className={classes.form}>
				<FormControl fullWidth>
					<InputLabel
						htmlFor={id}
						error={error}
						classes={{
							root: classes.label,
							focused: classes.focused,
						}}
					>
						{label}
					</InputLabel>
					<Input
						error={error}
						id={id}
						value={value} 
						classes={{
							underline: classes.underline,
						}}
						inputProps={{
							className: classes.input,
							required: true,
						}}
						onChange={onChange}
						required 
						autoFocus
						fullWidth
					/>
					{!!error && <FormHelperText className={classes.helperText}>{errorMessage}</FormHelperText>}
				</FormControl>
			</form>			
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEditIconForm);