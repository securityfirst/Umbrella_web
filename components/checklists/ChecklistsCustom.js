import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import cyan from '@material-ui/core/colors/cyan';

import { paperStyles } from '../../utils/view';

import { getCustomChecklists } from '../../store/actions/checklists';

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

class ChecklistsCustom extends React.Component {
	componentWillMount() {
		this.props.dispatch(getCustomChecklists());
	}

	renderPanel = (checklist, i) => {
		const { classes } = this.props;

		return (
			<Paper key={i} className={classes.formPanel} square>
				<Typography className={classes.formPanelTitle} variant="h6">{checklist.name}</Typography>
				<Typography className={classes.formPanelPercentage} variant="h6">{checklist.percentage}%</Typography>
			</Paper>
		);
	}

	render() {
		const { classes, customChecklistsLoading, customChecklistsError, customChecklists } = this.props;

		if (customChecklistsLoading) return <CircularProgress className={classes.loading} color="secondary" />;
		else if (customChecklistsError) return <Typography variant="error">{JSON.stringify(customChecklistsError)}</Typography>;

		return (
			<div>
				{customChecklists.map(this.renderPanel)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.checklists,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ChecklistsCustom));