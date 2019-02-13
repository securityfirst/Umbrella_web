import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

import teal from '@material-ui/core/colors/teal'

const styles = theme => ({
	input: {
		height: 'initial',
	},
	label: {
		'&$focused': {
			color: teal[500],
		},
	},
	focused: {},
	underline: {
		'&:after': {
			borderBottomColor: teal[500],
		},
	},
	helperText: {
		height: 0,
		minHeight: 0,
		marginTop: 0,
		lineHeight: '1.5rem',
		overflow: 'visible',
	},
})

const FormControlInput = (props) => {
	const { classes, className, id, label, value, type, error, errorMessage, onChange, autoFocus, multiline, rows, required } = props

	let wrapperProps = {}
	let inputProps = {}

	if (className) wrapperProps.className = className
	if (multiline && rows) inputProps.rows = rows 

	return (
		<FormControl {...wrapperProps} fullWidth>
			<InputLabel
				htmlFor={id}
				error={props.error}
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
				type={type || 'string'}
				classes={{
					underline: classes.underline,
				}}
				inputProps={{
					className: classes.input,
					required: true,
				}}
				onChange={onChange}
				required={required}
				autoFocus={autoFocus}
				fullWidth
				multiline={multiline || false}
				{...inputProps}
			/>
			{!!error && <FormHelperText className={classes.helperText}>{errorMessage}</FormHelperText>}
		</FormControl>
	)
}

export default withStyles(styles, {withTheme: true})(FormControlInput)