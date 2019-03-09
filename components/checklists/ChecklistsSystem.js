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
		padding: '.75rem 1.5rem',
	},
	panelTitle: {
		display: 'inline-block',
		color: theme.palette.grey[800],
		fontWeight: 'normal',
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
	}

	componentDidMount() {
		const { content, locale } = this.props
		const YAML = require('yaml')

		const check = async (item) => {
			if (!item) return
			if (typeof item !== 'object') return

			if (item.filename === 'c_checklist.yml') {
				const res = await fetch(`${process.env.ROOT}/api/github/content/${item.sha}`)
				const encoded = await res.text()
				const checklist = YAML.parse(atob(encoded))

				this.setState({checklistCount: this.state.checklistCount + checklist.list.length})

				return
			}

			if (item.content) item.content.forEach(i => check(i))

			Object.keys(item).forEach(i => {
				if (i !== 'content') check(item[i])
			})
		}

		check(content[locale])
	}

	handlePanelToggle = i => (e, expanded) => {
		this.setState({expanded: expanded ? i : false})
	}

	renderPanel = (title, percentage, index) => {
		const { classes } = this.props
		return (
			<Paper className={classes.panel} square>
				<Typography className={classes.panelTitle} variant="h6">{title}</Typography>
				{!isNaN(percentage) && <Typography className={classes.panelPercentage} variant="h6">{percentage}%</Typography>}
			</Paper>
		)
	}

	render() {
		const { classes, getChecklistsSystemLoading, getChecklistsSystemError, checklistsSystem } = this.props
		const { expanded, checklistCount } = this.state

		if (getChecklistsSystemLoading) return <Loading />
		else if (getChecklistsSystemError) return <ErrorMessage error={getChecklistsSystemError} />

		const totalDone = Object.keys(checklistsSystem).reduce((acc, key) => (acc + checklistsSystem[key].length), 0)

		return (
			<div className={classes.content}>
				<Typography className={classes.label} variant="subtitle1">Checklists Total</Typography>

				{this.renderPanel('Total done', parseInt((totalDone / checklistCount) * 100))}

				<Typography className={classes.label} variant="subtitle1">Favourites</Typography>

				{(checklistsSystem.favorites && checklistsSystem.favorites.length) 
					? checklistsSystem.favorites.map((checklist, i) => this.renderPanel(checklist.name, 0, i))
					: this.renderPanel('No favorites saved')
				}

				<Typography className={classes.label} variant="subtitle1">My Checklists</Typography>

				{Object.keys(checklistsSystem).map((name, i) => this.renderPanel(name, 0, i))}
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