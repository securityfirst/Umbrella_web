import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import LessonsMenu from '../../components/lessons/LessonsMenu'

import { contentStyles, paperStyles } from '../../utils/view'

import { toggleLessonsMenu } from '../../store/actions/view'

const styles = theme => ({
	...contentStyles(theme),
	contentAdditional: {
		[theme.breakpoints.down('sm')]: {
			paddingTop: '50px',
		},
	},
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
	descriptionMobile: {
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	descriptionDesktop: {
		[theme.breakpoints.down('sm')]: {
			display: 'none',
		},
	},
})

class Lessons extends React.Component {
	componentWillUnmount() {
		this.props.dispatch(toggleLessonsMenu(false))
	}

	render() {
		const { classes } = this.props

		return (
			<Layout title="Umbrella | Lessons" description="Umbrella web application">
				<div className={classes.wrapper}>
					<LessonsMenu />

					<div className={classNames(classes.content, classes.contentAdditional)}>
						<Paper className={classes.intro}>
							<Typography className={classes.introTitle} variant="h2">Lessons</Typography>
							<Typography paragraph>Use the menu panel on the <span className={classes.descriptionDesktop}>left</span><span className={classes.descriptionMobile}>top</span> to navigate lesson categories.</Typography>
						</Paper>
					</div>
				</div>
			</Layout>
		)
	}
}

export default connect()(withStyles(styles, { withTheme: true })(Lessons))