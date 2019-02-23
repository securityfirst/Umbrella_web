import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import ChecklistsPanel from './ChecklistsPanel'
import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'

import { contentStyles } from '../../utils/view'

import { getChecklistsCustom } from '../../store/actions/checklists'

const styles = theme => ({
	...contentStyles(theme),
})

class ChecklistsCustom extends React.Component {
	componentWillMount() {
		this.props.dispatch(getChecklistsCustom())
	}

	render() {
		const { classes, getChecklistsCustomLoading, getChecklistsCustomError, checklistsCustom } = this.props

		if (getChecklistsCustomLoading) return <Loading />
		else if (getChecklistsCustomError) return <ErrorMessage error={getChecklistsCustomError} />

		return (
			<div className={classes.content}>
				{checklistsCustom.map((checklist, i) => <ChecklistsPanel key={i} name={checklist.name} percentage={checklist.percentage} />)}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	...state.checklists,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ChecklistsCustom))