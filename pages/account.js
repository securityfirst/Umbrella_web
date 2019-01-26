import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Layout from '../components/layout'

import { contentStyles } from '../utils/view'

const styles = theme => ({
	...contentStyles(theme),
	heading: {
		fontSize: theme.typography.pxToRem(15),
		flexBasis: '33.33%',
		flexShrink: 0,
	},
})

class Account extends React.Component {
	state = {
		expanded: false,
	}

	handleChange = i => (e, expanded) => {
		this.setState({expanded: expanded ? i : false})
	}

	render() {
		const { classes } = this.props

		return (
			<Layout title="Umbrella | Account" description="Umbrella web application">
				<div className={classes.content}>
					<ExpansionPanel expanded={this.state.expanded === 0} onChange={this.handleChange(0)}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading}>Settings</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Typography>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
								elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
								hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
								velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
								Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
								viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
								Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
								at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
								ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
							</Typography>
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<ExpansionPanel expanded={this.state.expanded === 1} onChange={this.handleChange(1)}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading}>Set password</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Typography>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
								elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
								hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
								velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
								Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
								viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
								Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
								at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
								ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
							</Typography>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</div>
			</Layout>
		)
	}
}

export default withStyles(styles, {withTheme: true})(Account)