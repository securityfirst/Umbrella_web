import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import ChecklistsPanel from './ChecklistsPanel';
import Loading from '../reusables/Loading';

import { contentStyles } from '../../utils/view';

import { getCustomChecklists } from '../../store/actions/checklists';

const styles = theme => ({
	...contentStyles(theme),
});

class ChecklistsCustom extends React.Component {
	componentWillMount() {
		this.props.dispatch(getCustomChecklists());
	}

	render() {
		const { classes, getCustomChecklistsLoading, getCustomChecklistsError, customChecklists } = this.props;

		if (getCustomChecklistsLoading) return <Loading />;
		else if (getCustomChecklistsError) return <Typography variant="error">{JSON.stringify(getCustomChecklistsError)}</Typography>;

		return (
			<div className={classes.content}>
				{customChecklists.map((checklist, i) => <ChecklistsPanel key={i} name={checklist.name} percentage={checklist.percentage} />)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.checklists,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ChecklistsCustom));