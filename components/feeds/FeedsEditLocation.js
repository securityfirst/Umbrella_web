import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle'

import FormControlInput from '../../components/reusables/FormControlInput'
import IconModalContent from './IconModalContent'
import IconForm from './IconForm'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

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

class FeedsEditLocation extends React.Component {
	state = {
		location: null,
		error: null,
		errorMessage: null,
	}

	handleChange = e => {
		this.setState({location: e.target.value})
	}

	handleSubmit = () => {
		const { location } = this.state

		// TODO: Handle location check here
		this.props.onSubmit(location)
		this.props.closeModal()
	}

	handleCancel = () => {
		this.handleRemoveError()
		this.setState({location: null})
		this.props.closeModal()
	}

	handleRemoveError = () => this.setState({error: null, errorMessage: null})

	render() {
		const { theme, classes, closeModal, confirm } = this.props
		const { location, error, errorMessage } = this.state

		return (
			<IconModalContent 
				icon={<PersonPinCircleIcon classes={{fontSizeLarge: classes.iconFontSize}} fontSize="large" color="primary" />} 
			>
				<form>
					<FormControlInput 
						className={classes.formControlInput}
						id="feeds-edit-location"
						label="Set location"
						value={location}
						type="string"
						error={error}
						errorMessage={errorMessage}
						onChange={this.handleChange}
						required
						autoFocus
					/>

					<FormControl className={classes.buttonsWrapper} fullWidth>
						<Button component="button" onClick={this.handleCancel}>Cancel</Button>
						<ClickAwayListener onClickAway={this.handleRemoveError}>
							<Button color="secondary" onClick={this.handleSubmit}>OK</Button>
						</ClickAwayListener>
					</FormControl>
				</form>
			</IconModalContent>
		)
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEditLocation)