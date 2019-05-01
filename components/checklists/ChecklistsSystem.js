import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import cyan from '@material-ui/core/colors/cyan'

import ChecklistsPanel from './ChecklistsPanel'
import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'

import { contentStyles } from '../../utils/view'

const styles = theme => ({
	...contentStyles(theme),
	label: {
		marginTop: '1rem',
		color: theme.palette.grey[500],
		fontSize: '.875rem',
	},
	panel: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: '.5rem 0',
		padding: '.75rem 1.5rem',
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
		fontWeight: 'normal',
		color: cyan[500],
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
				const checklist = YAML.parse(atob(encoded))

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

	renderPanel = (title, percentage, index) => {
		const { classes } = this.props

		let optionalProps = {}
		if (!isNaN(index)) optionalProps.key = index

		return (
			<Paper className={classes.panel} {...optionalProps}>
				<Typography className={classes.panelTitle} variant="h6">{title.replace(/\./g, ' > ').replace(/-/g, ' ')}</Typography>
				{!isNaN(percentage) && <Typography className={classes.panelPercentage} variant="h6">{percentage}%</Typography>}
			</Paper>
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

					return this.renderPanel(name, percentage, i)
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

					return this.renderPanel(name, percentage, i)
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
		totalDonePercentage = totalDonePercentage < 1 ? (totalDonePercentage).toFixed(1) : parseInt(totalDonePercentage)

		return (
			<div className={classes.content}>
				<Typography className={classes.label} variant="subtitle1">Checklists Total</Typography>

				{this.renderPanel('Total done', totalDonePercentage)}

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