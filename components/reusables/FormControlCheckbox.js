import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import teal from '@material-ui/core/colors/teal';

const styles = theme => ({
	checkboxRoot: {
		padding: '.375rem .75rem',
		'&$checkboxChecked': {
			color: teal[500],
		},
	},
	checkboxChecked: {},
});

const FormControlCheckbox = (props) => {
	const { classes, name, value, checked, onChange } = props;

	return (
		<FormControlLabel
			control={
				<Checkbox 
					classes={{
						root: classes.checkboxRoot,
						checked: classes.checkboxChecked,
					}}
					checked={checked} 
					onChange={onChange} 
					value={value}
				/>
			}
			label={name}
		/>
	);
}

export default withStyles(styles, {withTheme: true})(FormControlCheckbox);