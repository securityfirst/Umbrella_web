import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import cyan from '@material-ui/core/colors/cyan'

import { paperStyles } from '../../utils/view'

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
})

const ChecklistsPanel = props => {
	if (!props.checklist) return <Paper className={props.classes.formPanel} square></Paper>

	let percentage

	if (!props.checklist.items || !props.checklist.items.length) percentage = 0
	else {
		const itemsDone = props.checklist.items.reduce((acc, item) => acc + (item.done ? 1 : 0), 0)
		percentage = parseFloat((itemsDone / props.checklist.items.length) * 100)
	}

	return (
		<Paper className={props.classes.formPanel} square>
			<Typography className={props.classes.formPanelTitle} variant="h6">{props.checklist.name}</Typography>
			<Typography className={props.classes.formPanelPercentage} variant="h6">{percentage}%</Typography>
		</Paper>
	)
}

export default withStyles(styles, { withTheme: true })(ChecklistsPanel)