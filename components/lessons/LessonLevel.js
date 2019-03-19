import React from 'react'
import { connect } from 'react-redux'
import YAML from 'yaml'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import Checkbox from '@material-ui/core/Checkbox'
import CloseIcon from '@material-ui/icons/Close'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share'

import Layout from '../layout'
import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'
import FormControlCheckbox from '../common/FormControlCheckbox'
import FavoriteShareIcons from '../common/FavoriteShareIcons'
import LessonCardTile from './LessonCardTile'

import { contentStyles } from '../../utils/view'

import { getLessonChecklist, unsetLessonChecklist, closeLesson } from '../../store/actions/lessons'
import { getChecklistsSystem, updateChecklistsSystem } from '../../store/actions/checklists'
import { setAppbarTitle } from '../../store/actions/view'

const styles = theme => ({
	...contentStyles(theme),
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
		} else {
			dispatch(unsetLessonChecklist())
		}
	}

	closeLevel = () => {
		this.props.dispatch(closeLesson())
		this.props.dispatch(setAppbarTitle('Lessons'))
	}

	getChecklistKey = () => (`${this.props.currentLesson.name} > ${this.props.currentLesson.level}`)

	handleCheck = (itemName, savedChecklist) => e => {
		const { dispatch, currentLesson, checklistsSystem } = this.props

		const listKey = this.getChecklistKey()

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
	
	onChecklistFavoriteAdd = checklist => () => {
		
	}

	onChecklistFavoriteRemove = checklist => () => {

	}

	onChecklistShare = checklist => () => {

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
		const listKey = this.getChecklistKey()
		const savedChecklist = checklistsSystem[listKey]
		// const isFavorited = 

		return (
			<Card className={classes.checklistCard}>
				<CardContent className={classes.checklistCardHead}>
					<Typography className={classes.checklistCardTitle}>Checklist</Typography>
					<div className={classes.checklist}>
						<FavoriteShareIcons
							onFavoriteRemove={this.onChecklistFavoriteRemove(checklist)}
							onFavoriteAdd={this.onChecklistFavoriteAdd(checklist)}
							onShare={this.onChecklistShare(checklist)}
							//isFavorited={isFavorited}
							//isFavoriteAdded={isFavoriteAdded}
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

	render() {
		const { classes, currentLesson, currentLessonChecklist } = this.props

		return (
			<React.Fragment>
				<Button className={classes.lessonClose} size="small" onClick={this.closeLevel}>
					<CloseIcon />
				</Button>

				<div className={classes.cardsWrapper}>
					{currentLesson.files.map((file, i) => (
						<LessonCardTile 
							key={i} 
							index={i} 
							file={file} 
							level={currentLesson.level}
						/>
					))}
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