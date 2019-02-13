import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'

import FeedsEditInterval from './FeedsEditInterval'
import FeedsEditLocation from './FeedsEditLocation'
import FeedsEditSources from './FeedsEditSources'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

const styles = theme => ({
	panel: {
		margin: '.75rem 0',
		...paperStyles(theme),
	},
	panelTitle: {
		fontSize: '1.5rem',
	},
	panelContent: {
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
		location: null,
		sources: [],
	}

	setLocation = location => this.setState({location})
	setSources = sources => this.setState({sources})

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
		const { toggleEdit } = this.props
		const { location, sources } = this.state

		if (!location || !sources.length) return alert('Location and sources are required.')

		// Set location and sources here
		toggleEdit()
	}

	render() {
		const { classes } = this.props
		const { location, sources } = this.state

		return (
			<div>
				{/* Info panel */}
				<Paper className={classes.panel} square>
					<Typography className={classes.panelTitle} variant="h6">Set your feed</Typography>
					<Typography className={classes.panelContent} paragraph>You haven’t set the country and the sources for the feed yet. You have to do it in order for the feed to start displaying, and you can change it any time later in the settings.</Typography>
				</Paper>

				{/* Location panel */}
				<Paper className={classes.panel} square>
					<Typography className={classes.panelTitle} variant="h6">Location</Typography>
					<Typography className={classes.panelContent} paragraph>{location || 'Set location'}</Typography>
					<div className={classes.changeButtonWrapper}>
						<Button color="secondary" onClick={this.handleFormOpen('location')}>Set</Button>
					</div>
				</Paper>

				{/* Sources panel */}
				<Paper className={classes.panel} square>
					<Typography className={classes.panelTitle} variant="h6">Set your feed</Typography>
					<Typography className={classes.panelContent} paragraph>{sources.length ? `${sources.length} sources` : 'Set sources'}</Typography>
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

export default withStyles(styles, {withTheme: true})(FeedsEdit)