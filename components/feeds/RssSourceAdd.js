import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isUrl from 'is-url'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import RssFeedIcon from '@material-ui/icons/RssFeed'

import FormControlInput from '../common/FormControlInput'
import IconModalContent from '../common/IconModalContent'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

import { addRssSource } from '../../store/actions/feeds'
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

class RssSourceAdd extends React.Component {
	state = {
		source: '',
		error: null,
		errorMessage: null,
	}

	handleChange = e => {
		this.setState({source: e.target.value})
	}

	handleSubmit = e => {
		!!e && e.preventDefault()

		const { dispatch, closeModal } = this.props
		const { source } = this.state

		if (!isUrl(source)) return dispatch(openAlert('error', 'Input is not a valid URL'))

		dispatch(addRssSource(source, closeModal))
	}

	handleCancel = () => {
		this.handleRemoveError()
		this.setState({source: ''})
		this.props.closeModal()
	}

	handleRemoveError = () => this.setState({error: null, errorMessage: null})

	render() {
		const { theme, classes, locale, systemLocaleMap, closeModal, confirm } = this.props
		const { source, error, errorMessage } = this.state

		return (
			<IconModalContent 
				icon={<RssFeedIcon classes={{fontSizeLarge: classes.iconFontSize}} fontSize="large" color="primary" />} 
			>
				<form onSubmit={this.handleSubmit}>
					<FormControlInput 
						className={classes.formControlInput}
						id="rss-source-form"
						label={`${systemLocaleMap[locale].feed_source} (URL)`}
						value={source}
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

const mapStateToProps = state => ({
	...state.view,
})

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(RssSourceAdd))