import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import cyan from '@material-ui/core/colors/cyan';

import { paperStyles } from '../../utils/view';

const styles = theme => ({
	formPanel: {
		display: 'flex',
		justifyContent: 'space-between',
		margin: '.75rem 0',
		...paperStyles(theme),
	},
	formPanelTitle: {
		display: 'inline-block',
		fontWeight: 'normal',
	},
	formPanelPercentage: {
		display: 'inline-block',
		fontWeight: 'normal',
		color: cyan[500],
	},
});

const ChecklistsPanel = (props) => {
	return (
		<Paper className={props.classes.formPanel} square>
			<Typography className={props.classes.formPanelTitle} variant="h6">{props.name}</Typography>
			<Typography className={props.classes.formPanelPercentage} variant="h6">{props.percentage}%</Typography>
		</Paper>
	);
}

export default withStyles(styles, { withTheme: true })(ChecklistsPanel);