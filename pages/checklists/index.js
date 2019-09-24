import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Layout from '../../components/layout'
import ChecklistsCustom from '../../components/checklists/ChecklistsCustom'
import ChecklistsSystem from '../../components/checklists/ChecklistsSystem'

import { setAppbarTitle } from '../../store/actions/view'

const styles = theme => ({
	tabs: {
		backgroundColor: theme.palette.background.paper,
	},
})

class Checklists extends React.Component {
	state = {
		tabIndex: 0
	}

	componentDidMount() {
		const { dispatch, locale, systemLocaleMap } = this.props
		dispatch(setAppbarTitle(systemLocaleMap[locale].checklist_title))
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.locale !== this.props.locale) {
			this.props.dispatch(setAppbarTitle(nextProps.systemLocaleMap[nextProps.locale].checklist_title))
		}
	}

	handleTabSelect = (e, v) => this.setState({tabIndex: v})

	render() {
		const { classes, locale, systemLocaleMap } = this.props
		const { tabIndex } = this.state

		return (
			<Layout title={`${systemLocaleMap[locale].app_name} | ${systemLocaleMap[locale].checklist_title}`} description="Umbrella web application">
				<Tabs 
					className={classes.tabs}
					value={tabIndex} 
					onChange={this.handleTabSelect}
				>
					<Tab label={systemLocaleMap[locale].checklist_title_tab} />
					<Tab label={systemLocaleMap[locale].custom_checklist_title_tab} />
				</Tabs>

				{tabIndex === 1
					? <ChecklistsCustom />
					: <ChecklistsSystem />
				}
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Checklists))