import React from 'react'
import { connect } from 'react-redux'
import YAML from 'yaml'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import CloseIcon from '@material-ui/icons/Close'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import ShareIcon from '@material-ui/icons/Share'

import Layout from '../layout'
import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'
import FormControlCheckbox from '../common/FormControlCheckbox'

import { contentStyles } from '../../utils/view'

import { getLessonChecklist, getLessonFile, closeLesson } from '../../store/actions/lessons'
import { getChecklistsSystem, updateChecklistsSystem } from '../../store/actions/checklists'
import { toggleLessonFileView, setAppbarTitle } from '../../store/actions/view'

const styles = theme => ({
	...contentStyles(theme),
	cardsWrapper: {
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
	},
	card: {
		margin: '1rem 0',
		[theme.breakpoints.up('sm')]: {
			width: '23%',
			margin: '1%',
		},
	},
	cardHead: {
		padding: '1rem',
		backgroundColor: theme.palette.primary.main,
		[theme.breakpoints.up('sm')]: {
			minHeight: '8rem',
		},
	},
	cardTitle: {
		display: 'block',
		color: 'white',
		fontSize: '1.25rem',
		lineHeight: 1,
		textTransform: 'capitalize',
	},
	cardActions: {
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
			justifyContent: 'space-between',
		},
	},
	cardActionIcon: {
		color: theme.palette.grey[600],
	},
	checklistCard: {
		margin: '1rem 0',
		[theme.breakpoints.up('sm')]: {
			margin: '.5rem',
		},
	},
	checklistCardHead: {
		padding: '1rem',
		backgroundColor: theme.palette.primary.main,
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
	lessonClose: {
		position: 'absolute',
		top: '1rem',
		right: '1rem',
	},
})

class LessonLevel extends React.Component {
	componentWillMount() {
		const { dispatch, currentLesson } = this.props

		if (currentLesson.checklist) {
			dispatch(getLessonChecklist(currentLesson.checklist.sha))
			dispatch(getChecklistsSystem())
		}
	}
	
	getLessonFile = sha => () => {
		this.props.dispatch(toggleLessonFileView(true))
		this.props.dispatch(getLessonFile(sha))
	}

	closeLevel = () => {
		this.props.dispatch(closeLesson())
		this.props.dispatch(setAppbarTitle('Lessons'))
	}

	handleCheck = (itemName, savedChecklist) => e => {
		const { dispatch, currentLesson, checklistsSystem } = this.props

		const listKey = `${currentLesson.name} > ${currentLesson.level}`
		let newChecklists = {...checklistsSystem}

		if (!savedChecklist) newChecklists[listKey] = [itemName]
		else {
			if (newChecklists[listKey].includes(itemName)) {
				newChecklists[listKey] = newChecklists[listKey].filter(item => item !== itemName)
			} else {
				newChecklists[listKey].push(itemName)
			}
		}

		dispatch(updateChecklistsSystem(newChecklists))
	}

	renderChecklist = () => {
		const { 
			classes, 
			currentLesson,
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

		const checklist = YAML.parse(atob(currentLessonChecklist))
		const listKey = `${currentLesson.name} > ${currentLesson.level}`
		const savedChecklist = checklistsSystem[listKey]

		return (
			<Card className={classes.checklistCard}>
				<CardContent className={classes.checklistCardHead}>
					<Typography className={classes.cardTitle}>Checklist</Typography>
				</CardContent>
				<CardContent className={classes.checklistCardContent}>
					<FormControl component="fieldset" className={classes.formControl}>
						<FormGroup>
						{!!checklist.list && checklist.list.map((item, i) => {
							if (item.label) {
								return <FormLabel key={i} className={classes.checklistLabel} component="legend">{item.label}</FormLabel>
							}

							const checked = !!savedChecklist && !!savedChecklist.includes(item.check)

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

	renderCard = (file, i) => {
		const { classes } = this.props
		const title = file.name.slice(2).replace(/\.md/, '').replace(/-/g, ' ')

		return (
			<Card key={i} className={classes.card}>
				<CardActionArea onClick={this.getLessonFile(file.sha)}>
					<CardContent className={classes.cardHead}>
						<Typography className={classes.cardTitle}>{i+1}</Typography>
						<Typography className={classes.cardTitle}>{title}</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions classes={{root: classes.cardActions}}>
					<Button size="small" className={classes.cardActionIcon}><BookmarkIcon /></Button>
					<Button size="small" className={classes.cardActionIcon}><ShareIcon /></Button>
				</CardActions>
			</Card>
		)
	}

	render() {
		const { classes, currentLesson, currentLessonChecklist } = this.props

		return (
			<React.Fragment>
				<Button className={classes.lessonClose} size="small" onClick={this.closeLevel}>
					<CloseIcon />
				</Button>

				<div className={classes.cardsWrapper}>
					{currentLesson.files.map(this.renderCard)}
				</div>

				{this.renderChecklist()}
			</React.Fragment>
		)
	}
}

const mapStateToProps = state => ({
	...state.lessons,
	...state.checklists,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonLevel))