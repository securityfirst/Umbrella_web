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

import { getFeeds } from '../../store/actions/feeds'
import { openAlert } from '../../store/actions/view'

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

	handleModalClose = () => this.setState({modalOpen: false})

	handleFormOpen = type => () => {
		let state = {modalOpen: true}

		// set modal inner content
		switch (type) {
			case 'location': 
				state.modalContent = <FeedsEditLocation closeModal={this.handleModalClose} />
				break
			case 'sources': 
				state.modalContent = <FeedsEditSources closeModal={this.handleModalClose} />
				break
		}

		this.setState(state)
	}

	handleSubmit = () => {
		const { dispatch, locale, systemLocaleMap, toggleEdit, feedLocation, feedSources } = this.props

		if (!feedLocation || !feedSources.length) {
			return dispatch(openAlert('error', systemLocaleMap[locale].feed_set_your_feed_label))
		}

		dispatch(getFeeds())

		toggleEdit()
	}

	render() {
		const { classes, locale, systemLocaleMap, feedLocation, feedSources } = this.props

		return (
			<div>
				{/* Info panel */}
				<Paper className={classes.panel} square>
					<Typography className={classes.panelTitle} variant="h6">{systemLocaleMap[locale].feed_set_your_feed}</Typography>
					<Typography className={classes.panelContent} paragraph>{systemLocaleMap[locale].feed_set_your_feed_label}</Typography>
				</Paper>

				{/* Location panel */}
				<Paper className={classes.panel} square>
					<Typography className={classes.panelTitle} variant="h6">{systemLocaleMap[locale].feed_location}</Typography>
					<Typography className={classes.panelContent} paragraph>{feedLocation ? feedLocation.place_name : systemLocaleMap[locale].feed_location_label}</Typography>
					<div className={classes.changeButtonWrapper}>
						<Button color="secondary" onClick={this.handleFormOpen('location')}>{systemLocaleMap[locale].feed_location_label}</Button>
					</div>
				</Paper>

				{/* Sources panel */}
				<Paper className={classes.panel} square>
					<Typography className={classes.panelTitle} variant="h6">{systemLocaleMap[locale].feed_sources}</Typography>
					<Typography className={classes.panelContent} paragraph>{feedSources.length ? `${feedSources.length} source${feedSources.length > 1 ? 's' : ''}` : systemLocaleMap[locale].feed_source_label}</Typography>
					<div className={classes.changeButtonWrapper}>
						<Button color="secondary" onClick={this.handleFormOpen('sources')}>{systemLocaleMap[locale].feed_source_label}</Button>
					</div>
				</Paper>

				<Button variant="contained" onClick={this.handleSubmit}>{systemLocaleMap[locale].set}</Button>

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

const mapStateToProps = state => ({
	...state.view,
	...state.feeds
})

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(FeedsEdit))