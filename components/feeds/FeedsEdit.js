import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'

import FeedsEditLocation from './FeedsEditLocation'
import FeedsEditSources from './FeedsEditSources'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

import { getFeeds, setFeedLocation, setFeedSources } from '../../store/actions/feeds'

const styles = theme => ({
	panel: {
		margin: '.75rem 0',
		...paperStyles(theme),
	},
	panelTitle: {
		fontSize: '1.5rem',
	},
	panelContent: {
		color: theme.palette.grey[600],
		fontSize: '.875rem',
	},
	changeButtonWrapper: {
		...buttonWrapperStyles(theme),
	},
	modal: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
})

class FeedsEdit extends React.Component {
	state = {
		modalOpen: false,
		modalContent: null,
	}

	setLocation = location => {
		this.props.dispatch(setFeedLocation(location))
	}

	setSources = sources => {
		this.props.dispatch(setFeedSources(sources))
	}

	handleModalClose = () => this.setState({modalOpen: false})

	handleFormOpen = type => () => {
		let state = {modalOpen: true}

		// set modal inner content
		switch (type) {
			case 'location': 
				state.modalContent = <FeedsEditLocation closeModal={this.handleModalClose} onSubmit={this.setLocation} />
				break
			case 'sources': 
				state.modalContent = <FeedsEditSources closeModal={this.handleModalClose} onSubmit={this.setSources} />
				break
		}

		this.setState(state)
	}

	handleSubmit = () => {
		const { dispatch, toggleEdit, feedLocation, feedSources } = this.props

		if (!feedLocation || !feedSources.length) return alert('Location and sources are required.')

		dispatch(getFeeds())

		toggleEdit()
	}

	render() {
		const { classes, feedLocation, feedSources } = this.props

		return (
			<div>
				{/* Info panel */}
				<Paper className={classes.panel} square>
					<Typography className={classes.panelTitle} variant="h6">Set your feed</Typography>
					<Typography className={classes.panelContent} paragraph>You haven't set the country and the sources for the feed yet. You have to do it in order for the feed to start displaying, and you can change it any time later in the settings.</Typography>
				</Paper>

				{/* Location panel */}
				<Paper className={classes.panel} square>
					<Typography className={classes.panelTitle} variant="h6">Location</Typography>
					<Typography className={classes.panelContent} paragraph>{feedLocation ? feedLocation.place_name : 'Set location'}</Typography>
					<div className={classes.changeButtonWrapper}>
						<Button color="secondary" onClick={this.handleFormOpen('location')}>Set</Button>
					</div>
				</Paper>

				{/* Sources panel */}
				<Paper className={classes.panel} square>
					<Typography className={classes.panelTitle} variant="h6">Set your feed</Typography>
					<Typography className={classes.panelContent} paragraph>{feedSources.length ? `${feedSources.length} source${feedSources.length > 1 ? 's' : ''}` : 'Set sources'}</Typography>
					<div className={classes.changeButtonWrapper}>
						<Button color="secondary" onClick={this.handleFormOpen('sources')}>Set</Button>
					</div>
				</Paper>

				<Button variant="contained" onClick={this.handleSubmit}>Done</Button>

				<Modal
					className={classes.modal}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={this.state.modalOpen}
					onClose={this.handleModalClose}
					disableAutoFocus
				>
					{this.state.modalContent}
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = store => ({
	...store.feeds
})

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(FeedsEdit))