import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import red from '@material-ui/core/colors/red';

import { paperStyles } from '../../utils/view';

import { feeds } from '../../mock/feeds';

const styles = theme => ({
	heading: {
		flexBasis: '33.33%',
		flexShrink: 0,
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
});

class FeedsAll extends React.Component {
	state = {
		expanded: false,
	};

	handleChange = () => this.setState({expanded: !this.state.expanded})

	renderLocation = () => <span className={this.props.classes.headingLocation}>Ireland</span>

	render() {
		const { classes, toggleEdit } = this.props;
		const { expanded } = this.state;

		return (
			<div className={classes.wrapper}>
				<ExpansionPanel expanded={expanded === true} onChange={this.handleChange}>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography className={classes.heading}>Location: 
							{!expanded && <span className={classes.headingLocation}>Ireland</span>}
						</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className={classes.locationPanelDetails}>
						<Typography variant="body1"><span className={classes.location}>Ireland</span></Typography>
						<Typography variant="body1" className={classes.locationChangeLink} onClick={toggleEdit}>Change</Typography>
					</ExpansionPanelDetails>
				</ExpansionPanel>

				{feeds.map((feed, i) => {
					return (
						<Paper key={i} className={classes.feed}>
							<Typography className={classes.feedTitle} variant="h6">{feed.title}</Typography>
							<Typography paragraph>
								<span className={classes.feedSite}>Via {(feed.site || "").toUpperCase()}</span>
								<span className={classes.feedDate}>{new Date(feed.timestamp).toLocaleString()}</span>
							</Typography>
							<Typography className={classes.feedContent} paragraph>{feed.content}</Typography>
						</Paper>
					);
				})}
			</div>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsAll);