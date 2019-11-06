import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isUrl from 'is-url'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import DoneAllIcon from '@material-ui/icons/DoneAll'

import FormControlInput from '../common/FormControlInput'
import IconModalContent from '../common/IconModalContent'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

import { addChecklistCustom } from '../../store/actions/checklists'
import { openAlert } from '../../store/actions/view'

const styles = theme => ({
	iconFontSize: {
		fontSize: '4rem',
	},
	formControlInput: {
		margin: '2rem 0 4rem',
	},
	buttonsWrapper: {
		...buttonWrapperStyles(theme),
		...paperStyles(theme),
	},
})

class ChecklistsCustomAdd extends React.Component {
	state = {
		name: '',
		error: null,
		errorMessage: null,
	}

	handleChange = e => {
		this.setState({name: e.target.value})
	}

	handleSubmit = e => {
		!!e && e.preventDefault()

		const { dispatch, locale, systemLocaleMap, closeModal } = this.props
		const { name } = this.state

		if (!name || !name.length) {
			return dispatch(openAlert('error', systemLocaleMap[locale].checklist_custom_invalid_name))
		}

		dispatch(addChecklistCustom(name.trim(), closeModal))
	}

	handleCancel = () => {
		this.handleRemoveError()
		this.setState({name: ''})
		this.props.closeModal()
	}

	handleRemoveError = () => this.setState({error: null, errorMessage: null})

	render() {
		const { theme, classes, locale, systemLocaleMap, closeModal, confirm } = this.props
		const { name, error, errorMessage } = this.state

		return (
			<IconModalContent 
				icon={<DoneAllIcon classes={{fontSizeLarge: classes.iconFontSize}} fontSize="large" color="primary" />} 
			>
				<form onSubmit={this.handleSubmit}>
					<FormControlInput 
						className={classes.formControlInput}
						id="checklist-custom-form"
						label={systemLocaleMap[locale].checklist_name_your_checklist}
						value={name}
						type="string"
						error={error}
						errorMessage={errorMessage}
						onChange={this.handleChange}
						required
						autoFocus
					/>

					<FormControl className={classes.buttonsWrapper} fullWidth>
						<Button component="button" onClick={this.handleCancel}>{systemLocaleMap[locale].cancel}</Button>
						<ClickAwayListener onClickAway={this.handleRemoveError}>
							<Button color="secondary" onClick={this.handleSubmit}>{systemLocaleMap[locale].ok}</Button>
						</ClickAwayListener>
					</FormControl>
				</form>
			</IconModalContent>
		)
	}
}

const mapStateToProps = (state) => ({
	...state.view,
})

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(ChecklistsCustomAdd))