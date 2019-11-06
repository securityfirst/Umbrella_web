import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle'

import FormControlLocation from '../common/FormControlLocation'
import IconModalContent from '../common/IconModalContent'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

import { setFeedLocation } from '../../store/actions/feeds'

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

	componentDidMount() {
		this.setState({location: this.props.feedLocation})
	}

	handleSelect = location => {
		this.setState({location})
	}

	handleSubmit = e => {
		!!e && e.preventDefault()

		const { dispatch, locale, systemLocaleMap, closeModal } = this.props
		const { location } = this.state

		if (!location) return dispatch(openAlert('error', systemLocaleMap[locale].feed_location_label))

		dispatch(setFeedLocation(location))
		closeModal()
	}

	handleCancel = () => {
		this.handleRemoveError()
		this.setState({location: null})
		this.props.closeModal()
	}

	handleRemoveError = () => this.setState({error: null, errorMessage: null})

	render() {
		const { theme, classes, locale, systemLocaleMap, closeModal, confirm } = this.props
		const { location, error, errorMessage } = this.state

		return (
			<IconModalContent 
				icon={<PersonPinCircleIcon classes={{fontSizeLarge: classes.iconFontSize}} fontSize="large" color="primary" />} 
			>
				<form onSubmit={this.handleSubmit}>
					<FormControlLocation 
						id="feeds-edit-location"
						className={classes.formControlInput}
						label={systemLocaleMap[locale].feed_location_label}
						types={'country'}
						error={error}
						errorMessage={errorMessage}
						onSelect={this.handleSelect}
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

const mapStateToProps = state => ({
	...state.view,
	...state.feeds,
})

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(FeedsEditLocation))