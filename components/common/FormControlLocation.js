// import Geocoder from 'react-geocoder-autocomplete'
import Geocoder from './Geocoder'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

import teal from '@material-ui/core/colors/teal'

const styles = theme => ({
	label: {
		'&$focused': {
			color: teal[500],
		},
	},
	focused: {},
	helperText: {
		height: 0,
		minHeight: 0,
		marginTop: 0,
		lineHeight: '1.5rem',
		overflow: 'visible',
	},
})

const FormControlLocation = (props) => {
	// const { classes, className, id, label, value, type, error, errorMessage, onChange, autoFocus, multiline, rows, required } = props
	const { classes, className, id, label, placeholder, types, error, errorMessage, onSelect, autoFocus } = props

	let wrapperProps = {}
	let inputProps = {}

	if (className) wrapperProps.className = className

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
			<Geocoder
				accessToken={process.env.MAPBOX_ACCESS_TOKEN}
				onSelect={onSelect}
				inputClass="formControlLocation-input"
				inputPlaceholder={placeholder || 'Search Location'}
				resultClass="formControlLocation-results"
				resultsClass="formControlLocation-results"
				types={types || 'country'}
				focusOnMount={autoFocus}
				required
			/>
			{/*<Input
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
			/>*/}
			{!!error && <FormHelperText className={classes.helperText}>{errorMessage}</FormHelperText>}
		</FormControl>
	)
}

export default withStyles(styles, {withTheme: true})(FormControlLocation)