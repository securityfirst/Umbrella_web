import React from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import get from 'lodash.get'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import yellow from '@material-ui/core/colors/yellow'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'

import LessonsMenu from '../../components/lessons/LessonsMenu'

import { contentStyles, paperStyles } from '../../utils/view'

import { setAppbarTitle, toggleLessonsMenu } from '../../store/actions/view'
import { getLessonCardsFavorites } from '../../store/actions/lessons'

const levelsOrder = ['beginner', 'advanced', 'expert']

const styles = theme => ({
	...contentStyles(theme),
	contentAdditional: {
		[theme.breakpoints.down('md')]: {
			paddingTop: '50px',
		},
	},
	wrapper: {
		position: 'relative',
		display: 'flex',
		flex: 1,
		height: '100%',
	},
	breadcrumb: {
		color: theme.palette.grey[500],
		fontSize: '.875rem',
		textTransform: 'capitalize',
	},
	panel: {
		width: '100%',
		margin: '.75rem 0',
		borderRadius: 2,
		cursor: 'pointer',
		...paperStyles(theme),
		'&:hover': {
			opacity: .8,
		}
	},
	panelTitle: {
		justifyContent: 'flex-start',
		color: theme.palette.common.white,
		fontSize: '1.5rem',
		fontWeight: 400,
		textTransform: 'capitalize',
	},
	beginner: {
		backgroundColor: theme.palette.secondary.main,
		'&:hover': {
			backgroundColor: theme.palette.secondary.main,
		}
	},
	advanced: {
		backgroundColor: yellow[700],
		'&:hover': {
			backgroundColor: yellow[700],
		}
	},
	expert: {
		backgroundColor: theme.palette.primary.main,
		'&:hover': {
			backgroundColor: theme.palette.primary.main,
		}
	},
})

class LessonsCategory extends React.Component {
	componentWillUnmount() {
		this.props.dispatch(toggleLessonsMenu(false))
	}

	render() {
		const { router, classes, content, contentLocaleMap } = this.props
		const { locale, category } = router.query

		let breadcrumb = router.query.category.split('.')

		for (let i=0; i<breadcrumb.length; i++) {
			breadcrumb[i] = contentLocaleMap[locale][breadcrumb[i]].replace(/-/g, ' ')
		}

		breadcrumb = breadcrumb.join(' > ')

		let levels = get(content, `${locale}.${category}`)

		levels = Object.keys(levels)
		
		levels.sort(function(x, y) {
			if (levelsOrder.indexOf(x) < levelsOrder.indexOf(y)) return -1
			if (levelsOrder.indexOf(x) > levelsOrder.indexOf(y)) return 1
			return 0
		})

		return (
			<Layout title="Umbrella | Lesson Category" description="Umbrella web application">
				<div className={classes.wrapper}>
					<LessonsMenu />

					<div className={classNames(classes.content, classes.contentAdditional)}>
						<Typography className={classes.breadcrumb} variant="subtitle1">{breadcrumb}</Typography>

						{levels.map((level, i) => {
							if (level === 'content') return null

							return (
								<Link key={i} href={`/lessons/${locale}/${category}/${level}`}>
									<Button
										className={classNames(classes.panel, classes[level])}
										classes={{label: classes.panelTitle}}
										variant="contained"
									>
										{contentLocaleMap[locale][level]}
									</Button>
								</Link>
							)
						})}
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

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(LessonsCategory)))