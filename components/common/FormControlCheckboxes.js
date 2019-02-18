import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import FormControlCheckbox from './FormControlCheckbox'

const styles = theme => ({
	wrapper: {
		margin: '2rem 0 1rem',
	},
	label: {
		position: 'relative',
		display: 'block',
		marginBottom: '1rem',
		transform: 'initial',
	},
})

const FormControlCheckboxes = (props) => {
	const { classes, label, options, state, error, onChange } = props

	return (
		<FormControl className={classes.wrapper}>
			{!!label && <InputLabel
				error={error}
				classes={{root: classes.label}}
			>
				{label}
			</InputLabel>}

			{options.map((option, i) => {
				return (
					<FormControlCheckbox
						key={i}
						name={option.label}
						value={option.value}
						checked={(state || []).includes(option.value)} 
						onChange={() => onChange(option.value)} 
					/>
				)
			})}
		</FormControl>
	)
}

export default withStyles(styles, {withTheme: true})(FormControlCheckboxes)