import React from 'react'
import classNames from 'classnames'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import get from 'lodash.get'
import YAML from 'yaml'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import Fab from '@material-ui/core/Fab'

import yellow from '@material-ui/core/colors/yellow'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import FormControlCheckbox from '../../components/common/FormControlCheckbox'
import FavoriteShareIcons from '../../components/common/FavoriteShareIcons'
import LessonsMenu from '../../components/lessons/LessonsMenu'
import LessonCardTile from '../../components/lessons/LessonCardTile'

import { contentStyles } from '../../utils/view'

import { getLessonChecklist, unsetLessonChecklist, closeLesson } from '../../store/actions/lessons'
import { getChecklistsSystem, updateChecklistsSystem, toggleChecklistFavorite } from '../../store/actions/checklists'
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
	level: {
		color: 'white',
		cursor: 'initial',
		[theme.breakpoints.up('sm')]: {
			marginLeft: '.5rem',
			marginBottom: '1rem',
		},
		[theme.breakpoints.up('md')]: {
			position: 'absolute',
			top: '2rem',
			left: '2rem',
		},
	},
	beginner: {
		backgroundColor: theme.palette.secondary.main,
		'&.hover': {
			backgroundColor: theme.palette.secondary.main,
		},
	},
	advanced: {
		backgroundColor: yellow[700],
		'&.hover': {
			backgroundColor: yellow[700],
		},
	},
	expert: {
		backgroundColor: theme.palette.primary.main,
		'&.hover': {
			backgroundColor: theme.palette.primary.main,
		},
	},
	cardsWrapper: {
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
	},
	checklistCard: {
		margin: '1rem 0',
		[theme.breakpoints.up('sm')]: {
			margin: '.5rem',
		},
	},
	checklistCardHead: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '.5rem 1rem',
		backgroundColor: theme.palette.primary.main,
	},
	checklistCardTitle: {
		color: 'white',
		fontSize: '1.25rem',
		lineHeight: 1,
		textTransform: 'capitalize',
	},
	checklistCardIconsWrapper: {
		display: 'inline-block',
	},
	checklistCardContent: {
		padding: '1rem',
	},
	checklistLabel: {
		margin: '1rem 0 .5rem .25rem',
	},
	checklistCheckbox: {
		padding: '6px 15px',
	},
})

class LessonsLevel extends React.Component {
	static async getInitialProps({reduxStore, query}) {
		const category = query.category.replace(/-/g, ' ').split('.').join(' / ')
		await reduxStore.dispatch(setAppbarTitle(`Lessons / ${category} / ${query.level}`))
	}

	state = {
		files: [],
		checklist: null,
	}

	componentWillMount() {
		const { router, dispatch, content, locale } = this.props

		const paths = router.query.category.split('.').concat([router.query.level])

		console.log("`${locale}.${router.query.category}.${router.query.level}`: ", `${locale}.${router.query.category}.${router.query.level}`);

		let lesson = get(content, `${locale}.${router.query.category}.${router.query.level}`)

		const files = lesson.content.reduce((list, c) => {
			if (c.filename.indexOf('s_') === 0) {
				list.push({
					name: c.filename,
					sha: c.sha,
				})
			}

			return list
		}, [])

		const checklist = lesson.content.find(c => c.filename.indexOf('c_') > -1)

		if (checklist) {
			dispatch(getLessonChecklist(checklist.sha))
			dispatch(getChecklistsSystem())
		}

		this.setState({files, checklist})
	}

	getChecklistKey = () => {
		const { router } = this.props
		return `${router.query.category.split('.').join(' > ')} > ${router.query.level}`
	}

	handleCheck = itemName => e => {
		this.props.dispatch(updateChecklistsSystem(itemName))
	}
	
	onChecklistFavoriteToggle = checklist => () => {
		this.props.dispatch(toggleChecklistFavorite())
	}

	onChecklistShare = checklist => () => {

	}

	renderChecklist = () => {
		const { 
			classes, 
			getLessonChecklistLoading, 
			getLessonChecklistError, 
			currentLessonChecklist, 
			getChecklistsSystemLoading,
			getChecklistsSystemError,
			checklistsSystem, 
		} = this.props

		if (getLessonChecklistLoading || getChecklistsSystemLoading) return <Loading />
		else if (getLessonChecklistError || getChecklistsSystemError) return <ErrorMessage error={getLessonChecklistError || getChecklistsSystemError} />
		else if (!currentLessonChecklist) return null
		else if (!checklistsSystem) return null

		const checklist = YAML.parse(atob(currentLessonChecklist))
		const listKey = this.getChecklistKey()
		const savedChecklist = checklistsSystem[listKey]
		const isFavorited = !!savedChecklist && savedChecklist.isFavorited

		return (
			<Card className={classes.checklistCard}>
				<CardContent className={classes.checklistCardHead}>
					<Typography className={classes.checklistCardTitle}>Checklist</Typography>
					<div className={classes.checklist}>
						<FavoriteShareIcons
							onFavoriteToggle={this.onChecklistFavoriteToggle(checklist)}
							onShare={this.onChecklistShare(checklist)}
							isFavoriteAdded={isFavorited}
							isLight
						/>
					</div>
				</CardContent>
				<CardContent className={classes.checklistCardContent}>
					<FormControl component="fieldset" className={classes.formControl}>
						<FormGroup>
						{!!checklist.list && checklist.list.map((item, i) => {
							if (item.label) {
								return <FormLabel key={i} className={classes.checklistLabel} component="legend">{item.label}</FormLabel>
							}

							const checked = (
								!!savedChecklist && 
								!!savedChecklist.items.length &&
								!!savedChecklist.items.includes(item.check)
							)

							return (
								<FormControlCheckbox
									key={i}
									name={item.check}
									value={item.check}
									checked={checked} 
									onChange={this.handleCheck(item.check, savedChecklist)} 
								/>
							)
						})}
						</FormGroup>
					</FormControl>
				</CardContent>
			</Card>
		)
	}

	render() {
		const { router, classes } = this.props
		const { files } = this.state

		return (
			<Layout title="Umbrella | Lessons Cards" description="Umbrella web application">
				<div className={classes.wrapper}>
					<LessonsMenu />

					<div className={classes.content}>
						<div className={classes.cardsWrapper}>
							{files.map((file, i) => (
								<LessonCardTile 
									key={i} 
									index={i} 
									file={file} 
									level={router.query.level}
								/>
							))}

							{this.renderChecklist()}
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
	...state.lessons,
	...state.checklists,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonsLevel)))