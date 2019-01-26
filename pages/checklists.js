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
import Loading from '../components/reusables/Loading'
import ErrorMessage from '../components/reusables/ErrorMessage'

import { contentStyles } from '../utils/view'

import { getSystemChecklists } from '../store/actions/checklists'

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
		await reduxStore.dispatch(getSystemChecklists())
	}

	state = {
		tabIndex: 0
	}

	handleTabSelect = (e, v) => this.setState({tabIndex: v})

	renderOverview = () => {
		const { classes, getSystemChecklistsLoading, getSystemChecklistsError, systemChecklists } = this.props

		if (getSystemChecklistsLoading) return <Loading />
		else if (getSystemChecklistsError) return <ErrorMessage error={getSystemChecklistsError} />

		return (
			<div className={classes.content}>
				<Typography className={classes.label} variant="subtitle1">Checklists Total</Typography>

				<ChecklistsPanel name="Total done" percentage={systemChecklists.total} />

				{(systemChecklists.favorites && systemChecklists.favorites.length) && 
					<Typography className={classes.label} variant="subtitle1">Favourites</Typography>
				}

				{(systemChecklists.favorites && systemChecklists.favorites.length) && 
					systemChecklists.favorites.map((checklist, i) => <ChecklistsPanel key={i} name={checklist.name} percentage={checklist.percentage} />)
				}

				{(systemChecklists.checklists && systemChecklists.checklists.length) && 
					<Typography className={classes.label} variant="subtitle1">My Checklists</Typography>
				}

				{(systemChecklists.checklists && systemChecklists.checklists.length) && 
					systemChecklists.checklists.map((checklist, i) => <ChecklistsPanel key={i} name={checklist.name} percentage={checklist.percentage} />)
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