import React from 'react'
import PropTypes from 'prop-types'
import isUrl from 'is-url'

import { withStyles } from '@material-ui/core/styles'
import RssFeedIcon from '@material-ui/icons/RssFeed'

import IconModalContent from './IconModalContent'
import IconForm from './IconForm'

const styles = theme => ({
	iconFontSize: {
		fontSize: '4rem',
	},
})

class RssSourceAdd extends React.Component {
	state = {
		source: null,
		error: null,
		errorMessage: null,
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
				content={
					<IconForm 
						id="rss-source-form"
						label="RSS source"
						value={source}
						error={error}
						errorMessage={errorMessage}
						onChange={(e,v) => this.setState({source: v})}
						onSubmit={this.handleSubmit}
						removeError={this.handleRemoveError}
						cancel={this.handleCancel}
					/>
				} 
			/>
		)
	}
}

export default withStyles(styles, {withTheme: true})(RssSourceAdd)