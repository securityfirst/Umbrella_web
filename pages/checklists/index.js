import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Layout from '../../components/layout'
import ChecklistsCustom from '../../components/checklists/ChecklistsCustom'
import ChecklistsSystem from '../../components/checklists/ChecklistsSystem'

const styles = theme => ({
	tabs: {
		backgroundColor: theme.palette.background.paper,
	},
})

class Checklists extends React.Component {
	state = {
		tabIndex: 0
	}

	handleTabSelect = (e, v) => this.setState({tabIndex: v})

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
					: <ChecklistsSystem />
				}
			</Layout>
		)
	}
}

export default connect()(withStyles(styles, { withTheme: true })(Checklists))