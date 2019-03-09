import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import ChecklistsPanel from './ChecklistsPanel'
import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'

import { contentStyles } from '../../utils/view'

const styles = theme => ({
	...contentStyles(theme),
	label: {
		marginTop: '1rem',
		color: theme.palette.grey[500],
		fontSize: '.875rem',
	},
})

class ChecklistsSystem extends React.Component {
	state = {
		expanded: false,
	}

	handlePanelToggle = i => (e, expanded) => {
		this.setState({expanded: expanded ? i : false})
	}

	render() {
		const { classes, getChecklistsSystemLoading, getChecklistsSystemError, checklistsSystem } = this.props
		const { expanded } = this.state

		if (getChecklistsSystemLoading) return <Loading />
		else if (getChecklistsSystemError) return <ErrorMessage error={getChecklistsSystemError} />

		return (
			<div className={classes.content}>
				<Typography className={classes.label} variant="subtitle1">Checklists Total</Typography>

				<ChecklistsPanel 
					index={0}
					checklist={{name: "Total done"}} 
					expanded={expanded} 
					handlePanelToggle={this.handlePanelToggle} 
				/>

				{(checklistsSystem.favorites && checklistsSystem.favorites.length) && 
					<Typography className={classes.label} variant="subtitle1">Favourites</Typography>
				}

				{(checklistsSystem.favorites && checklistsSystem.favorites.length) && 
					checklistsSystem.favorites.map((checklist, i) => (
						<ChecklistsPanel 
							key={i} 
							index={i + 1}
							checklist={checklist} 
							expanded={expanded} 
							handlePanelToggle={this.handlePanelToggle} 
						/>
					))
				}

				{(checklistsSystem.checklists && checklistsSystem.checklists.length) && 
					<Typography className={classes.label} variant="subtitle1">My Checklists</Typography>
				}

				{(checklistsSystem.checklists && checklistsSystem.checklists.length) && 
					checklistsSystem.checklists.map((checklist, i) => (
						<ChecklistsPanel 
							key={i} 
							index={i + 1 + (checklistsSystem.favorites ? checklistsSystem.favorites.length : 0)}
							checklist={checklist} 
							expanded={expanded} 
							handlePanelToggle={this.handlePanelToggle} 
						/>
					))
				}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	...state.checklists,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ChecklistsSystem))