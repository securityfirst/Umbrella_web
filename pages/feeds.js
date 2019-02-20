import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Layout from '../components/layout'
import FeedsAll from '../components/feeds/FeedsAll'
import FeedsEdit from '../components/feeds/FeedsEdit'
import FeedsRss from '../components/feeds/FeedsRss'

import { contentStyles } from '../utils/view'

import { getFeeds } from '../store/actions/feeds'

const styles = theme => ({
	...contentStyles(theme),
	tabs: {
		backgroundColor: theme.palette.background.paper,
	},
})

class Feeds extends React.Component {
	static async getInitialProps({reduxStore}) {
		const store = reduxStore.getState()
		const { feedLocation, feedSources } = store.feeds

		if (feedLocation && feedSources.length) {
			await reduxStore.dispatch(getFeeds())
		}
	}

	state = {
		isEdit: true, // Set to false if db has location set
		tabIndex: 0,
	}

	handleTabSelect = (e, v) => {
		let state = {tabIndex: v}
		if (v !== 0) state['isEdit'] = false
		this.setState(state)
	}

	renderFeedsView = () => {
		const { isEdit, tabIndex } = this.state

		if (isEdit) return <FeedsEdit toggleEdit={() => this.setState({isEdit: false})} />

		return <FeedsAll toggleEdit={() => this.setState({isEdit: true})} />
	}

	renderContent = () => {
		const { classes } = this.props
		const { tabIndex } = this.state

		switch (tabIndex) {
			case 0: return this.renderFeedsView()
			case 1: return <FeedsRss />
		}
	}

	render() {
		const { classes } = this.props
		const { tabIndex } = this.state

		return (
			<Layout title="Umbrella | Feeds" description="Umbrella web application">
				<Tabs 
					className={classes.tabs}
					value={tabIndex} 
					onChange={this.handleTabSelect}
				>
					<Tab label="FEED" />
					<Tab label="RSS" />
				</Tabs>

				<div className={classes.content}>
					{this.renderContent()}
				</div>
			</Layout>
		)
	}
}

export default withStyles(styles, {withTheme: true})(Feeds)