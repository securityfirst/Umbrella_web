import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle'

import FormControlLocation from '../common/FormControlLocation'
import IconModalContent from '../common/IconModalContent'

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

	handleSelect = location => {
		this.setState({location})
	}

	handleSubmit = e => {
		!!e && e.preventDefault()

		const { location } = this.state

		if (!location) return alert('No location was selected.')

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
				<form onSubmit={this.handleSubmit}>
					<FormControlLocation 
						id="feeds-edit-location"
						className={classes.formControlInput}
						label="Set location"
						types={'country'}
						error={error}
						errorMessage={errorMessage}
						onSelect={this.handleSelect}
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