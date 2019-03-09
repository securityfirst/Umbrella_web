import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Layout from '../components/layout'
import ChecklistsCustom from '../components/checklists/ChecklistsCustom'
import ChecklistsPanel from '../components/checklists/ChecklistsPanel'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'

import { contentStyles } from '../utils/view'

import { getChecklistsSystem } from '../store/actions/checklists'

const styles = theme => ({
	...contentStyles(theme),
	tabs: {
		backgroundColor: theme.palette.background.paper,
	},
	loading: {

	},
	label: {
		color: theme.palette.grey[500],
		fontSize: '.875rem',
	},
})

class Checklists extends React.Component {
	static async getInitialProps({reduxStore, isServer}) {
		await reduxStore.dispatch(getChecklistsSystem())
	}

	state = {
		tabIndex: 0
	}

	handleTabSelect = (e, v) => this.setState({tabIndex: v})

	renderOverview = () => {
		const { classes, getChecklistsSystemLoading, getChecklistsSystemError, checklistsSystem } = this.props

		if (getChecklistsSystemLoading) return <Loading />
		else if (getChecklistsSystemError) return <ErrorMessage error={getChecklistsSystemError} />

		return (
			<div className={classes.content}>
				<Typography className={classes.label} variant="subtitle1">Checklists Total</Typography>

				<ChecklistsPanel checklist={{name: "Total done"}} />

				{(checklistsSystem.favorites && checklistsSystem.favorites.length) && 
					<Typography className={classes.label} variant="subtitle1">Favourites</Typography>
				}

				{(checklistsSystem.favorites && checklistsSystem.favorites.length) && 
					checklistsSystem.favorites.map((checklist, i) => <ChecklistsPanel key={i} checklist={checklist} />)
				}

				{(checklistsSystem.checklists && checklistsSystem.checklists.length) && 
					<Typography className={classes.label} variant="subtitle1">My Checklists</Typography>
				}

				{(checklistsSystem.checklists && checklistsSystem.checklists.length) && 
					checklistsSystem.checklists.map((checklist, i) => <ChecklistsPanel key={i} checklist={checklist} />)
				}
			</div>
		)
	}

	render() {
		const { classes } = this.props
		const { tabIndex } = this.state

		return (
			<Layout title="Umbrella | Checklists" description="Umbrella web application">
				<Tabs 
					className={classes.tabs}
					value={tabIndex} 
					onChange={this.handleTabSelect}
				>
					<Tab label="OVERVIEW" />
					<Tab label="CUSTOM" />
				</Tabs>

				{tabIndex === 1
					? <ChecklistsCustom />
					: this.renderOverview()
				}
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.checklists,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Checklists))