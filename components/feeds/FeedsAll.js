import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';

import red from '@material-ui/core/colors/red';

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
			<div>
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
			</div>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsAll);