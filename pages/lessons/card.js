import React from 'react'
import atob from 'atob'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import Marked from '../../components/common/Marked'
import LessonsMenu from '../../components/lessons/LessonsMenu'

import { contentStyles, paperStyles } from '../../utils/view'

import { setAppbarTitle } from '../../store/actions/view'
import { getLessonFile } from '../../store/actions/lessons'

const styles = theme => ({
	...contentStyles(theme, {
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			maxHeight: 'calc(100vh - 48px)',
			overflow: 'scroll',
		}
	}),
	wrapper: {
		position: 'relative',
		display: 'flex',
		flex: 1,
		height: '100%',
	},
	paper: {
		...paperStyles(theme),
		paddingTop: '.5rem',
		paddingRight: '2rem !important',
		paddingBottom: '2rem',
		paddingLeft: '2rem !important',
	},
})

class LessonCard extends React.Component {
	static async getInitialProps({reduxStore, query}) {
		await reduxStore.dispatch(getLessonFile(query.sha))
		await reduxStore.dispatch(setAppbarTitle(`Lesson Card`))
	}

	renderContent = () => {
		const { currentLessonFile, getLessonFileLoading, getLessonFileError } = this.props

		if (getLessonFileLoading) return <Loading />
		else if (getLessonFileError) return <ErrorMessage error={getLessonFileError} />
		return <Marked content={atob(currentLessonFile)} />
	}

	render() {
		const { classes } = this.props

		return (
			<Layout title="Umbrella | Lesson Card" description="Umbrella web application">
				<div className={classes.wrapper}>
					<LessonsMenu />

					<div className={classes.content}>
						<Paper className={'lessons-card ' + classes.paper}>
							{this.renderContent()}
						</Paper>
					</div>
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.lessons,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonCard))