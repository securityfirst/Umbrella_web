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
import DeleteIcon from '@material-ui/icons/Delete'

import yellow from '@material-ui/core/colors/yellow'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import FormControlCheckbox from '../../components/common/FormControlCheckbox'
import FavoriteShareIcons from '../../components/common/FavoriteShareIcons'
import LessonsMenu from '../../components/lessons/LessonsMenu'
import LessonCardTile from '../../components/lessons/LessonCardTile'

import { getLessonChecklist, unsetLessonChecklist } from '../../store/actions/lessons'
import { getChecklistsSystem, updateChecklistsSystem, deleteChecklistSystem, toggleChecklistFavorite } from '../../store/actions/checklists'
import { setAppbarTitle, toggleLessonsMenu } from '../../store/actions/view'

import { contentStyles } from '../../utils/view'
import { decodeBlob } from '../../utils/github'

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
	    width: '100%',
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
	checklistCardDeleteIcon: {
		color: theme.palette.common.white,
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
	state = {
		files: [],
		checklist: null,
	}

	componentDidMount() {
		const { router, dispatch, content, systemLocaleMap } = this.props
		const { locale, category, level } = router.query

		dispatch(setAppbarTitle(systemLocaleMap[locale].lesson_title))

		const lesson = get(content, level !== '-' ? `${locale}.${category}.${level}` : `${locale}.${category}`)

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

		if (checklist) dispatch(getLessonChecklist(checklist.sha))

		this.setState({files, checklist})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.locale !== this.props.locale) {
			this.props.dispatch(setAppbarTitle(nextProps.systemLocaleMap[nextProps.locale].lesson_title))
		}
	}
	
	componentWillUnmount() {
		this.props.dispatch(toggleLessonsMenu(false))
	}

	getChecklistKey = () => {
		const { category, level } = this.props.router.query

		return `${category} > ${level}`
	}

	handleCheck = itemName => e => {
		const { dispatch, router } = this.props
		const { category, level } = router.query

		dispatch(updateChecklistsSystem(itemName, category, level))
	}

	deleteChecklist = title => () => {
		if (confirm('Are you sure you want to remove this checklist?')) {
			this.props.dispatch(deleteChecklistSystem(title))
		}
	}

	onChecklistFavoriteToggle = checklist => () => {
		const { dispatch, router } = this.props
		const { category, level } = router.query

		dispatch(toggleChecklistFavorite(category, level))
	}

	renderChecklist = () => {
		const { 
			router,
			classes,
			content,  
			getLessonChecklistLoading, 
			getLessonChecklistError, 
			currentLessonChecklist, 
			checklistsSystem, 
		} = this.props

		const { locale, category, level } = router.query

		if (getLessonChecklistLoading) return <Loading />
		else if (getLessonChecklistError) return <ErrorMessage error={getLessonChecklistError || getChecklistsSystemError} />
		else if (!currentLessonChecklist) return null
		else if (!checklistsSystem) return null

		const checklist = YAML.parse(decodeBlob(currentLessonChecklist))
		const listKey = this.getChecklistKey()
		const savedChecklist = checklistsSystem[listKey]
		const isFavorited = !!savedChecklist && savedChecklist.isFavorited

		const cat = category.split('.')[0]
		const subcat = category.split('.')[1]

		const checklistFile = content[locale][cat][subcat][level].content.find(f => f.filename === 'c_checklist.yml')

		return (
			<Card className={classes.checklistCard}>
				<CardContent className={classes.checklistCardHead}>
					<Typography className={classes.checklistCardTitle}>Checklist</Typography>
					<div className={classes.checklist}>
						{!!savedChecklist && <Button 
							size="small" 
							className={classes.checklistCardDeleteIcon} 
							aria-haspopup="true"
							onClick={this.deleteChecklist(listKey)}
						>
							<DeleteIcon />
						</Button>}
						<FavoriteShareIcons
							name={`${category}-${level}`}
							sha={!!checklistFile ? checklistFile.sha : null}
							url={`${process.env.ROOT}/lessons/${locale}/${category}/${level}`}
							isLight
							isFavorited={isFavorited}
							isFavoriteAdded={isFavorited}
							onFavoriteToggle={this.onChecklistFavoriteToggle(checklist)}
							onFavoriteRemove={this.onChecklistFavoriteToggle(checklist)}
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
		const { router, classes, contentLocaleMap, systemLocaleMap } = this.props
		const { locale, category, level } = router.query
		const { files } = this.state

		return (
			<Layout title={`${systemLocaleMap[locale].app_name} | ${systemLocaleMap[locale].lesson_title}`} description="Umbrella web application">
				<div className={classes.wrapper}>
					<LessonsMenu />

					<div className={classNames(classes.content, classes.contentAdditional)}>
						<div className={classes.cardsWrapper}>
							{files.map((file, i) => (
								<LessonCardTile 
									key={i} 
									index={i} 
									file={file} 
									locale={locale}
									contentLocaleMap={contentLocaleMap}
									category={category}
									level={level}
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