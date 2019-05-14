import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import cyan from '@material-ui/core/colors/cyan'

import ChecklistsPanel from './ChecklistsPanel'
import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'

import { deleteChecklistSystem } from '../../store/actions/checklists'

import { contentStyles } from '../../utils/view'
import { decodeBlob } from '../../utils/github'

const styles = theme => ({
	...contentStyles(theme),
	label: {
		marginTop: '1rem',
		color: theme.palette.grey[500],
		fontSize: '.875rem',
	},
	panelWrapper: {
		position: 'relative',
	},
	panel: {
		display: 'flex',
		justifyContent: 'left',
		alignItems: 'center',
		width: '97%',
		margin: '.5rem 0',
		padding: '.75rem 1.5rem',
		backgroundColor: theme.palette.common.white,
	},
	panelButtonInner: {
		display: 'flex',
		justifyContent: 'left',
	},
	panelIcon: {
		width: '2.5rem',
		marginRight: '1rem',
	},
	panelTitle: {
		display: 'inline-block',
		color: theme.palette.grey[800],
		fontSize: '1.125rem',
		fontWeight: 'normal',
		textTransform: 'capitalize',
	},
	panelPercentage: {
		display: 'inline-block',
		marginLeft: 'auto',
		fontWeight: 'normal',
		color: cyan[500],
	},
	panelTotalIconsWrapper: {
		position: 'relative',
    	width: '5rem',
    	height: '2.5rem',
		marginRight: '1rem',
	},
	panelTotalIcon: {
		position: 'absolute',
		top: '50%',
		transform: 'translateY(-50%)',
		display: 'inline-block',
		width: '2.5rem',
	},
	panelTotalIconSecond: {
		left: '1.25rem',
	},
	panelTotalIconThird: {
		left: '2.5rem',
	},
	panelActionButton: {
		position: 'absolute',
		left: '98%',
		top: '50%',
    	transform: 'translateY(-50%)',
	},
})

class ChecklistsSystem extends React.Component {
	state = {
		expanded: false,
		checklistCount: 0,
		checklists: [],
	}

	componentDidMount() {
		const { content, locale } = this.props
		const YAML = require('yaml')

		let checklists = []

		const check = async (item) => {
			if (!item) return
			if (typeof item !== 'object') return

			if (item.filename === 'c_checklist.yml') {
				const res = await fetch(`${process.env.ROOT}/api/github/content/${item.sha}`)
				const encoded = await res.text()
				const checklist = YAML.parse(decodeBlob(encoded))

				if (checklist) {
					checklists.push(checklist)
					this.setState({checklistCount: this.state.checklistCount + checklist.list.length})
				}

				return
			}

			if (item.content) item.content.forEach(i => check(i))

			Object.keys(item).forEach(i => {
				if (i !== 'content') check(item[i])
			})
		}

		check(content[locale])

		this.setState({checklists})
	}

	handlePanelToggle = i => (e, expanded) => {
		this.setState({expanded: expanded ? i : false})
	}

	sortFavorites = () => {
		const { checklistsSystem, checklistFavorites } = this.props

		const favorites = checklistFavorites
	}

	deleteChecklist = title => () => {
		if (confirm('Are you sure you want to remove this checklist?')) {
			this.props.dispatch(deleteChecklistSystem(title))
		}
	}

	renderPanel = title => {
		const { classes } = this.props

		return (
			<Paper className={classes.panel}>
				<Typography className={classes.panelTitle} variant="h6">{title}</Typography>
			</Paper>
		)
	}

	renderPanelLink = (title, percentage, index) => {
		const { classes, locale } = this.props
		const level = title.split(' > ')[1]

		return (
			<div className={classes.panelWrapper} key={index}>
				<Link href={`/lessons/${locale}/${title.replace(/ > /, '/')}`}>
					<Button
						className={classes.panel}
						classes={{label: classes.panelButtonInner}}
						variant="contained"
					>
						<img className={classes.panelIcon} src={`/static/assets/images/${level}.png`} alt={`Umbrella lesson ${level} icon`}/>
						<Typography className={classes.panelTitle} variant="h6">{title.replace(/\./g, ' > ').replace(/-/g, ' ')}</Typography>
						{percentage !== null && <Typography className={classes.panelPercentage} variant="h6">{percentage}%</Typography>}
					</Button>
				</Link>
				<IconButton className={classes.panelActionButton} aria-label="Delete" onClick={this.deleteChecklist(title)}>
					<DeleteIcon />
				</IconButton>
			</div>
		)
	}

	renderLessonChecklistFavorites = () => {
		const { classes, checklistsSystem } = this.props
		const { checklists } = this.state

		const checklistsSystemKeys = Object.keys(checklistsSystem)

		if (!checklistsSystemKeys.length) return this.renderPanel('No favorites saved')

		return (
			<React.Fragment>
				{checklistsSystemKeys.map((name, i) => {
					if (!checklistsSystem[name].isFavorited) return null

					let checklist, checklistCount

					if (checklists.length) {
						checklist = checklists.find(set => {
							return set.list.find(item => item.check === checklistsSystem[name].items[0])
						})

						if (checklist) checklistCount = checklist.list.reduce((acc, item) => !!item.check ? acc + 1 : acc, 0)
					}

					const percentage = !!checklist ? parseInt((checklistsSystem[name].items.length / checklistCount) * 100) : 0

					return this.renderPanelLink(name, percentage, i)
				})}
			</React.Fragment>
		)
	}

	renderLessonChecklists = () => {
		const { classes, checklistsSystem } = this.props
		const { checklists } = this.state

		const checklistsSystemKeys = Object.keys(checklistsSystem)

		if (!checklistsSystemKeys.length) return this.renderPanel('No checklists available')

		return (
			<React.Fragment>
				{checklistsSystemKeys.map((name, i) => {
					if (checklistsSystem[name].isFavorited) return null

					let checklist, checklistCount

					if (checklists.length) {
						checklist = checklists.find(set => {
							return set.list.find(item => item.check === checklistsSystem[name].items[0])
						})

						if (checklist) checklistCount = checklist.list.reduce((acc, item) => !!item.check ? acc + 1 : acc, 0)
					}

					const percentage = !!checklist ? parseInt((checklistsSystem[name].items.length / checklistCount) * 100) : 0

					return this.renderPanelLink(name, percentage, i)
				})}
			</React.Fragment>
		)
	}

	render() {
		const { classes, getChecklistsSystemLoading, getChecklistsSystemError, checklistsSystem } = this.props
		const { expanded, checklistCount } = this.state

		if (getChecklistsSystemLoading) return <Loading />
		else if (getChecklistsSystemError) return <ErrorMessage error={getChecklistsSystemError} />

		const totalDone = Object.keys(checklistsSystem).reduce((acc, key) => (acc + checklistsSystem[key].items.length), 0)

		let totalDonePercentage = (totalDone / checklistCount) * 100

		if (totalDonePercentage !== 0 && totalDonePercentage < 1) totalDonePercentage = '< 1'
		else totalDonePercentage = parseInt(totalDonePercentage)

		return (
			<div className={classes.content}>
				<Typography className={classes.label} variant="subtitle1">Checklists Total</Typography>

				<Paper className={classes.panel}>
					<div className={classes.panelTotalIconsWrapper}>
						<img className={classes.panelTotalIcon} src={`/static/assets/images/beginner.png`} alt={`Umbrella lesson beginner icon`}/>
						<img className={classNames(classes.panelTotalIcon, classes.panelTotalIconSecond)} src={`/static/assets/images/advanced.png`} alt={`Umbrella lesson intermediate icon`}/>
						<img className={classNames(classes.panelTotalIcon, classes.panelTotalIconThird)} src={`/static/assets/images/expert.png`} alt={`Umbrella lesson expert icon`}/>
					</div>
					<Typography className={classes.panelTitle} variant="h6">Total done</Typography>
					<Typography className={classes.panelPercentage} variant="h6">{totalDonePercentage}%</Typography>
				</Paper>

				<Typography className={classes.label} variant="subtitle1">Favourites</Typography>

				{this.renderLessonChecklistFavorites()}

				<Typography className={classes.label} variant="subtitle1">My Checklists</Typography>

				{this.renderLessonChecklists()}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.content,
	...state.checklists,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ChecklistsSystem))