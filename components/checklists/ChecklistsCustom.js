import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'

import ChecklistsPanel from './ChecklistsPanel'
import ChecklistsCustomAdd from './ChecklistsCustomAdd'
import Loading from '../common/Loading'
import ErrorMessage from '../common/ErrorMessage'
import AddButton from '../common/AddButton'

import { contentStyles, paperStyles } from '../../utils/view'

import { getChecklistsCustom } from '../../store/actions/checklists'

const styles = theme => ({
	...contentStyles(theme),
	panel: {
		display: 'flex',
		justifyContent: 'space-between',
		margin: '.75rem 0',
		...paperStyles(theme),
	},
	modal: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
})

class ChecklistsCustom extends React.Component {
	state = {
		modalOpen: false,
	}

	componentWillMount() {
		this.props.dispatch(getChecklistsCustom())
	}
	
	handleModalOpen = () => {
		const { password } = this.props

		if (!password) return alert('Login or set a password to create a custom checklist.')

		this.setState({modalOpen: true})
	}

	handleModalClose = () => {
		this.setState({modalOpen: false})
	}

	renderChecklists = () => {
		const { classes, checklistsCustom } = this.props

		if (!checklistsCustom.length) return (
			<Paper className={classes.panel} square>
				<Typography paragraph>You do not have any checklists saved. Click the '+' button to create a custom checklist.</Typography>
			</Paper>
		)

		return (
			<React.Fragment>
				{checklistsCustom.map((checklist, i) => <ChecklistsPanel key={i} checklist={checklist} />)}
			</React.Fragment>
		)
	}

	render() {
		const { classes, password, getChecklistsCustomLoading, getChecklistsCustomError } = this.props
		const { modalOpen } = this.state

		if (getChecklistsCustomLoading) return <Loading />
		if (getChecklistsCustomError) return <ErrorMessage error={getChecklistsCustomError} />

		return (
			<div className={classes.content}>
				{!password 
					? <Paper className={classes.panel} square>
						<Typography paragraph>Login or set your password to manage your custom checklists.</Typography>
					</Paper>
					: this.renderChecklists()
				}

				<AddButton onClick={this.handleModalOpen} />

				<Modal
					className={classes.modal}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={modalOpen}
					onClose={this.handleModalClose}
					disableAutoFocus
				>
					<ChecklistsCustomAdd closeModal={this.handleModalClose} />
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	...state.account,
	...state.checklists,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ChecklistsCustom))