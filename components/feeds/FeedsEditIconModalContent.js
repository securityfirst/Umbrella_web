import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import yellow from '@material-ui/core/colors/yellow'

import { paperStyles } from '../../utils/view'

const styles = theme => ({
	wrapper: {
		width: '100%',
		maxWidth: '32rem',
		[theme.breakpoints.down('sm')]: {
			height: '100%',
			maxHeight: '30rem',
			margin: '1rem',
		},
	},
	iconWrapper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '14rem',
		backgroundColor: yellow[700],
	},
	contentWrapper: {
		...paperStyles(theme),
		color: theme.palette.primary.main,
	},
})

class FeedsEditIconModalContent extends React.Component {
	render() {
		const { classes, cancel, confirm, icon, content } = this.props

		return (
			<Paper className={classes.wrapper} square>
				<div className={classes.iconWrapper}>
					{icon}
				</div>
				<div className={classes.contentWrapper}>
					{content}
				</div>
			</Paper>
		)
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEditIconModalContent)