import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const styles = theme => ({
	formInputControl: {
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
	buttonsWrapper: {
		display: 'flex',
		justifyContent: 'flex-end',
		flexDirection: 'row',
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
	},
});

class FeedsEditIconForm extends React.Component {
	render() {
		const { classes, id, label, value, error, errorMessage, onChange, onSubmit, removeError, cancel } = this.props;

		return (
			<form>
				<FormControl className={classes.formInputControl} fullWidth>
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

				<FormControl className={classes.buttonsWrapper} fullWidth>
					<Button component="button" onClick={cancel}>Cancel</Button>
					<ClickAwayListener onClickAway={removeError}>
						<Button color="secondary" onClick={onSubmit}>OK</Button>
					</ClickAwayListener>
				</FormControl>
			</form>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEditIconForm);