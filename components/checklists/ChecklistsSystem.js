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

import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'
import FavoriteShareIcons from '../common/FavoriteShareIcons'
import PathwayPanel from '../pathways/PathwayPanel'

import { toggleChecklistFavorite, deleteChecklistSystem } from '../../store/actions/checklists'
import { togglePathwayModal } from '../../store/actions/view'

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
		[theme.breakpoints.down('sm')]: {
			display: 'flex',
			flexWrap: 'wrap',
			height: '125px',
		},
	},
	panel: {
		display: 'flex',
		justifyContent: 'left',
		alignItems: 'center',
		width: '90%',
		margin: '.5rem 0',
		padding: '.75rem 1.5rem',
		backgroundColor: theme.palette.common.white,
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
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
		marginLeft: '1rem',
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
	panelShareButton: {
		top: '50%',
		left: '92%',
		position: 'absolute',
		transform: 'translateY(-50%)',
		[theme.breakpoints.down('sm')]: {
			position: 'initial',
			top: 'initial',
			left: 'initial',
			marginTop: '1rem',
		},
	},
	panelActionButton: {
		position: 'absolute',
		left: '98%',
		top: '50%',
    	transform: 'translateY(-50%)',
    	[theme.breakpoints.down('sm')]: {
    		position: 'initial',
    		top: 'initial',
			left: 'initial',
			marginTop: '1rem',
		},
	},
	pathwaySavedWrapper: {
		width: '97%',
	},
	pathwayTitle: {
		display: 'inline-block',
		margin: '.5rem 0',
		color: theme.palette.grey[500],
		fontSize: '1rem',
		fontWeight: 'normal',
	},
	pathwaySeeAll: {
		width: '90%',
		marginTop: '.5rem',
		color: cyan[500],
		textAlign: 'right',
		cursor: 'pointer',
		transition: '200ms opacity linear',
		'&:hover': {
			opacity: '.7',
		},
		[theme.breakpoints.down('sm')]: {
			width: '80%',
		},
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

	onChecklistFavoriteToggle = ({ category, level }) => () => {
		this.props.dispatch(toggleChecklistFavorite(category, level))
	}

	deleteChecklist = title => () => {
		const { dispatch, locale, systemLocaleMap } = this.props
		if (confirm(systemLocaleMap[locale].confirm_remove_checklist)) {
			dispatch(deleteChecklistSystem(title))
		}
	}

	openPathwaysModal = () => {
		this.props.dispatch(togglePathwayModal(true))
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
		const { classes, content, locale } = this.props
		const params = title.split(' > ')
		const category = params[0]
		const cat = category.split('.')[0]
		const subcat = category.split('.')[1]
		const level = params[1]
		const checklistFile = content[locale][cat][subcat][level].content.find(f => f.filename === 'c_checklist.yml')

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
				<FavoriteShareIcons
					classNameShare={classes.panelShareButton}
					type="checklist"
					name={`${category}-${level}`}
					sha={!!checklistFile ? checklistFile.sha : null}
					category={category}
					level={level}
					url={`${process.env.ROOT}/lessons/${locale}/${category}/${level}`}
					onFavoriteToggle={this.onChecklistFavoriteToggle({category, level})}
					onFavoriteRemove={this.onChecklistFavoriteToggle({category, level})}
				/>
				<IconButton className={classes.panelActionButton} aria-label="Delete" onClick={this.deleteChecklist(title)}>
					<DeleteIcon />
				</IconButton>
			</div>
		)
	}

	renderLessonChecklistFavorites = () => {
		const { classes, locale, systemLocaleMap, checklistsSystem } = this.props
		const { checklists } = this.state

		const checklistsSystemKeys = Object.keys(checklistsSystem)

		if (!checklistsSystemKeys.length) return this.renderPanel(systemLocaleMap[locale].checklist_favorites_empty)

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
		const { classes, locale, systemLocaleMap, checklistsSystem } = this.props
		const { checklists } = this.state

		const checklistsSystemKeys = Object.keys(checklistsSystem)

		if (!checklistsSystemKeys.length) return this.renderPanel(systemLocaleMap[locale].checklists_unavailable)

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

	renderPathways = () => {
		const { classes, locale, systemLocaleMap, pathwaysSaved } = this.props

		return (
			<React.Fragment>
				{!pathwaysSaved.length 
					? <Paper className={classes.panel}>
						<Typography className={classes.pathwayTitle} variant="h6">{systemLocaleMap[locale].checklist_pathways_empty}</Typography>
					</Paper>
					: pathwaysSaved
						.sort(pathway => pathway.filename)
						.map((pathway, i) => (
							<div key={i} className={classes.pathwaySavedWrapper}>
								<PathwayPanel key={i} pathway={pathway} />
							</div>
						))
				}
				<Typography className={classes.pathwaySeeAll} onClick={this.openPathwaysModal}>{systemLocaleMap[locale].checklist_see_all}</Typography>
			</React.Fragment>
		)
	}

	render() {
		const { 
			classes, 
			content, 
			locale, 
			systemLocaleMap, 
			getChecklistsSystemLoading, 
			getChecklistsSystemError, 
			checklistsSystem 
		} = this.props
		const { expanded, checklistCount } = this.state

		if (getChecklistsSystemLoading) return <Loading />
		else if (getChecklistsSystemError) return <ErrorMessage error={getChecklistsSystemError} />

		const totalDone = Object.keys(checklistsSystem).reduce((acc, key) => (acc + checklistsSystem[key].items.length), 0)

		let totalDonePercentage = (totalDone / checklistCount) * 100

		if (totalDonePercentage !== 0 && totalDonePercentage < 1) totalDonePercentage = '< 1'
		else totalDonePercentage = parseInt(totalDonePercentage)

		return (
			<div className={classes.content}>
				<Typography className={classes.label} variant="subtitle1">{systemLocaleMap[locale].checklist_total_title}</Typography>

				<Paper className={classes.panel}>
					<div className={classes.panelTotalIconsWrapper}>
						<img className={classes.panelTotalIcon} src={`/static/assets/images/beginner.png`} alt={`Umbrella lesson beginner icon`}/>
						<img className={classNames(classes.panelTotalIcon, classes.panelTotalIconSecond)} src={`/static/assets/images/advanced.png`} alt={`Umbrella lesson intermediate icon`}/>
						<img className={classNames(classes.panelTotalIcon, classes.panelTotalIconThird)} src={`/static/assets/images/expert.png`} alt={`Umbrella lesson expert icon`}/>
					</div>
					<Typography className={classes.panelTitle} variant="h6">{systemLocaleMap[locale].checklist_total_done}</Typography>
					<Typography className={classes.panelPercentage} variant="h6">{totalDonePercentage}%</Typography>
				</Paper>

				<Typography className={classes.label} variant="subtitle1">{systemLocaleMap[locale].favorites_title}</Typography>

				{this.renderLessonChecklistFavorites()}

				<Typography className={classes.label} variant="subtitle1">{systemLocaleMap[locale].checklist_lessons_title}</Typography>

				{this.renderLessonChecklists()}

				{!!content[locale].pathways && <Typography className={classes.label} variant="subtitle1">{systemLocaleMap[locale].checklist_pathways_title}</Typography>}

				{!!content[locale].pathways && this.renderPathways()}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.content,
	...state.checklists,
	...state.pathways,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ChecklistsSystem))