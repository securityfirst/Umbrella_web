import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

import teal from '@material-ui/core/colors/teal'

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
	radioRoot: {
		padding: '.375rem .75rem',
		'&$radioChecked': {
			color: teal[500],
		},
	},
	radioChecked: {},
})

const FormControlRadios = (props) => {
	const { classes, label, options, value, error, onChange } = props

	return (
		<FormControl component="fieldset" className={classes.wrapper}>
			{!!label && 
				<FormLabel 
					classes={{root: classes.label}}
					component="legend"
				>
					{label}
				</FormLabel>
			}

			<RadioGroup
				aria-label={label || 'Radio single choice'}
				name={label}
				className={classes.group}
				value={value}
				onChange={e => onChange(e.target.value)}
			>
				{options.map((option, i) => (
					<FormControlLabel
						key={i}
						value={option.value}
						control={<Radio classes={{
							root: classes.radioRoot,
							checked: classes.radioChecked,
						}}/>} 
						label={option.label}
					/>
				))}
			</RadioGroup>
        </FormControl>
	)
}

export default withStyles(styles, {withTheme: true})(FormControlRadios)