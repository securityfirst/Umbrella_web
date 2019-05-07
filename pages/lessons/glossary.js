import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import LessonCardTile from '../../components/lessons/LessonCardTile'

import LessonsMenu from '../../components/lessons/LessonsMenu'

import { contentStyles } from '../../utils/view'

import { setAppbarTitle } from '../../store/actions/view'

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
	cardsWrapper: {
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
	},
})

class LessonsGlossary extends React.Component {
	static async getInitialProps({reduxStore, query}) {
		await reduxStore.dispatch(setAppbarTitle(`Lessons / Glossary`))
	}

	render() {
		const { classes, content, locale } = this.props

		const files = content[locale].glossary.content.reduce((acc, c) => {
			if (c.filename.indexOf('s_') === 0) {  // if it's a file
				acc.push({
					name: c.filename,
					sha: c.sha,
				})
			}

			return acc
		}, [])

		return (
			<Layout title="Umbrella | Lessons Glossary" description="Umbrella web application">
				<div className={classes.wrapper}>
					<LessonsMenu />

					<div className={classes.content}>
						<div className={classes.cardsWrapper}>
							{files.map((file, i) => (
								<LessonCardTile 
									key={i} 
									index={i} 
									file={file} 
								/>
							))}
						</div>
					</div>
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.content,
	...state.view,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonsGlossary))