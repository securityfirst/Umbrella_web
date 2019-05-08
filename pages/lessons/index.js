import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import LessonsMenu from '../../components/lessons/LessonsMenu'

import { contentStyles, paperStyles } from '../../utils/view'

const styles = theme => ({
	...contentStyles(theme),
	wrapper: {
		position: 'relative',
		display: 'flex',
		flex: 1,
		height: '100%',
	},
	intro: {
		...paperStyles(theme),
	},
	introTitle: {
		display: 'block',
		margin: '1rem 0',
		fontSize: '1.25rem',
		lineHeight: 1,
		textTransform: 'capitalize',
		[theme.breakpoints.up('sm')]: {
			fontSize: '1.5rem',
		},
	},
})

class Lessons extends React.Component {
	render() {
		const { classes } = this.props

		return (
			<Layout title="Umbrella | Lessons" description="Umbrella web application">
				<div className={classes.wrapper}>
					<LessonsMenu />

					<div className={classes.content}>
						<Paper className={classes.intro}>
							<Typography className={classes.introTitle} variant="h2">Lessons</Typography>
							<Typography paragraph>Use the menu panel on the left to navigate lesson categories.</Typography>
						</Paper>
					</div>
				</div>
			</Layout>
		)
	}
}

export default withStyles(styles, { withTheme: true })(Lessons)