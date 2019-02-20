import React from 'react'
import PropTypes from 'prop-types'
import isUrl from 'is-url'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import RssFeedIcon from '@material-ui/icons/RssFeed'

import FormControlInput from '../../components/common/FormControlInput'
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

class RssSourceAdd extends React.Component {
	state = {
		source: null,
		error: null,
		errorMessage: null,
	}

	handleChange = e => {
		this.setState({source: e.target.value})
	}

	handleSubmit = () => {
		const { source } = this.state

		if (!isUrl(source)) return alert('Input is not a valid URL.')

		// TODO: Handle submit here, then close on callback

		this.props.closeModal()
	}

	handleCancel = () => {
		this.handleRemoveError()
		this.setState({source: null})
		this.props.closeModal()
	}

	handleRemoveError = () => this.setState({error: null, errorMessage: null})

	render() {
		const { theme, classes, closeModal, confirm } = this.props
		const { source, error, errorMessage } = this.state

		return (
			<IconModalContent 
				icon={<RssFeedIcon classes={{fontSizeLarge: classes.iconFontSize}} fontSize="large" color="primary" />} 
			>
				<form>
					<FormControlInput 
						className={classes.formControlInput}
						id="rss-source-form"
						label="RSS source"
						value={source}
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

export default withStyles(styles, {withTheme: true})(RssSourceAdd)