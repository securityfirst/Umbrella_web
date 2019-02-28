import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Link from 'next/link'

import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import red from '@material-ui/core/colors/red'

import { buttonWrapperStyles, paperStyles } from '../../utils/view'

import { getFeeds } from '../../store/actions/feeds'

const styles = theme => ({
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: 500,
	},
	headingLocation: {
		marginLeft: '.5rem',
		color: red[800],
		fontWeight: 500,
	},
	location: {
		color: red[800],
	},
	locationPanelDetails: {
		display: 'block',
	},
	locationChangeLink: {
		color: theme.palette.secondary.main,
		textAlign: 'right',
		cursor: 'pointer',
	},
	buttonWrapper: {
		...buttonWrapperStyles(theme),
		marginTop: '2rem',
	},
	feed: {
		margin: '.75rem 0',
		...paperStyles(theme),
	},
	feedTitle: {
		fontSize: '1.125rem',
	},
	feedSite: {
		display: 'inline-block',
		paddingRight: '.75rem',
		color: theme.palette.grey[600],
		fontSize: '.75rem',
	},
	feedDate: {
		display: 'inline-block',
		fontSize: '.75rem',
	},
	feedContent: {
		color: theme.palette.grey[800],
		fontSize: '.875rem',
	},
})

class FeedsAll extends React.Component {
	state = {
		expanded: false,
	}

	handleChange = () => this.setState({expanded: !this.state.expanded})

	refreshFeeds = () => this.props.dispatch(getFeeds())

	render() {
		const { classes, toggleEdit, feeds, feedLocation } = this.props
		const { expanded } = this.state

		return (
			<React.Fragment>
				<ExpansionPanel expanded={expanded === true} onChange={this.handleChange}>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography className={classes.heading}>Location: 
							{!expanded && <span className={classes.headingLocation}>{feedLocation.place_name}</span>}
						</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className={classes.locationPanelDetails}>
						<Typography variant="body1"><span className={classes.location}>{feedLocation.place_name}</span></Typography>
						<Typography variant="body1" className={classes.locationChangeLink} onClick={toggleEdit}>Change</Typography>
					</ExpansionPanelDetails>
				</ExpansionPanel>

				{!feeds.length
					? <Paper className={classes.feed} square>
						<Typography className={classes.feedContent}>There are no events to display for your location. We'll display them when they are available.</Typography>
						
						<div className={classes.buttonWrapper}>
							<Button color="secondary" onClick={this.refreshFeeds}>Refresh</Button>
						</div>
					</Paper>
					: feeds.map((feed, i) => {
						return (
							<Paper key={i} className={classes.feed} square>
								<Typography className={classes.feedTitle} variant="h6">{feed.title}</Typography>
								<Typography paragraph>
									<span className={classes.feedSite}>Via {(feed.site || "").toUpperCase()}</span>
									<span className={classes.feedDate}>{new Date(feed.timestamp).toLocaleString()}</span>
								</Typography>
								<Typography className={classes.feedContent} paragraph>{feed.content}</Typography>
							</Paper>
						)
					})
				}
			</React.Fragment>
		)
	}
}

const mapStateToProps = state => ({
	...state.feeds,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FeedsAll))