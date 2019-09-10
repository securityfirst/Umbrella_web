import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'

import FormControlCheckbox from '../common/FormControlCheckbox'
import FormControlInput from '../common/FormControlInput'

import cyan from '@material-ui/core/colors/cyan'

import { paperStyles } from '../../utils/view'

import { updateChecklistCustom, deleteChecklistCustom } from '../../store/actions/checklists'
import { openAlert } from '../../store/actions/view'

const styles = theme => ({
	header: {
		justifyContent: 'space-between',
	},
	name: {
		display: 'inline-block',
		fontWeight: 'normal',
	},
	percentage: {
		display: 'inline-block',
		fontWeight: 'normal',
		color: cyan[500],
	},
	form: {
		width: '100%',
	},
	formControl: {
		width: '100%',
	},
	empty: {
		color: theme.palette.grey[600],
		fontSize: '.875rem',
	},
	checkboxWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	addItemWrapper: {
		display: 'flex',
		alignItems: 'flex-end',
		margin: '1rem 0 0',
		[theme.breakpoints.up('md')]: {
			width: '50%',
		},
	},
	deleteListWrapper: {
		margin: '2rem 0 1rem',
	},
})

class ChecklistsPanel extends React.Component {
	state = {
		itemText: '',
		error: null,
		errorMessage: null,
	}

	handleChecked = i => e => {
		const { dispatch, checklist, index } = this.props
		
		let items = [...checklist.items]
		items[i].done = !items[i].done

		const newChecklist = {...checklist, items}

		dispatch(updateChecklistCustom(newChecklist, index))
	}

	handleChange = e => {
		this.setState({itemText: e.target.value})
	}

	deleteItem = i => e => {
		const { dispatch, checklist, index } = this.props
		
		let items = [...checklist.items]
		items.splice(i, 1)

		const newChecklist = {...checklist, items}

		dispatch(updateChecklistCustom(newChecklist, index))
	}

	addItem = e => {
		!!e && e.preventDefault()

		const { dispatch, locale, systemLocaleMap, checklist, index } = this.props
		const { itemText } = this.state

		if (!itemText || !itemText.length) {
			return dispatch(openAlert('error', systemLocaleMap[locale].checklist_custom_empty_item_error_message))
		}

		const item = {text: itemText.trim(), done: false}
		const newChecklist = {...checklist, items: checklist.items.concat([item])}

		dispatch(updateChecklistCustom(newChecklist, index))

		this.setState({itemText: ''})
	}

	deleteChecklist = () => {
		const { dispatch, index } = this.props

		dispatch(deleteChecklistCustom(index))
	}

	renderItem = (item, i) => {
		const { classes, isCustom } = this.props

		return (
			<div key={i} className={classes.checkboxWrapper}>
				<FormControlCheckbox
					key={i}
					name={item.text}
					value={item.text}
					checked={item.done} 
					onChange={this.handleChecked(i)} 
				/>
				{isCustom && 
					<IconButton aria-label="Delete" onClick={this.deleteItem(i)}>
						<DeleteIcon fontSize="small" />
					</IconButton>
				}
			</div>
		)
	}

	render() {
		const { classes, index, checklist, expanded, handlePanelToggle, isCustom, } = this.props
		const { itemText, error, errorMessage } = this.state

		if (!checklist) return <Paper className={classes.formPanel} square></Paper>

		let percentage

		if (!checklist.items || !checklist.items.length) percentage = 0
		else {
			const itemsDone = checklist.items.reduce((acc, item) => acc + (item.done ? 1 : 0), 0)
			percentage = parseInt((itemsDone / checklist.items.length) * 100)
		}

		return (
			<ExpansionPanel expanded={expanded === index} onChange={handlePanelToggle(index)}>
				<ExpansionPanelSummary classes={{content: classes.header}} expandIcon={<ExpandMoreIcon />}>
					<Typography className={classes.name} variant="h6">{checklist.name}</Typography>
					<Typography className={classes.percentage} variant="h6">{percentage}%</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<form className={classes.form} onSubmit={this.addItem}>
						{(checklist.items && checklist.items.length) 
							? <FormControl className={classes.formControl} component="fieldset">
								<FormGroup>
									{checklist.items.map(this.renderItem)}
								</FormGroup>
							</FormControl>
							: <Typography className={classes.empty} paragraph>Checklist is empty</Typography>
						}

						{isCustom && 
							<div className={classes.addItemWrapper}>
								<FormControlInput 
									className={classes.addItemInput}
									id={`checklist-custom-form-${index}`}
									label={systemLocaleMap[locale].checklist_add_item_title}
									value={itemText}
									type="string"
									error={error}
									errorMessage={errorMessage}
									onChange={this.handleChange}
									autoFocus
								/>

								<Button component="button" size="small" onClick={this.addItem}>{systemLocaleMap[locale].checklist_add_item_title}</Button>
							</div>
						}

						{isCustom && 
							<div className={classes.deleteListWrapper}>
								<Button 
									component="button" 
									variant="contained" 
									color="primary" 
									size="small" 
									onClick={this.deleteChecklist}
								>
									{systemLocaleMap[locale].checklist_delete_item}
								</Button>
							</div>
						}
					</form>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		)
	}
}

const mapStateToProps = (state) => ({
	...state.view,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ChecklistsPanel))