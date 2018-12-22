import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';

import FeedsEditIconModalContent from './FeedsEditIconModalContent';
import FeedsEditIconForm from './FeedsEditIconForm';

const styles = theme => ({
	iconFontSize: {
		fontSize: '4rem',
	},
});

class FeedsEditLocation extends React.Component {
	state = {
		location: null,
		error: null,
		errorMessage: null,
	};

	handleSubmit = () => {
		const { location } = this.state;

		// TODO: Handle submit here, then close on callback

		this.props.closeModal();
	}

	handleCancel = () => {
		this.handleRemoveError();
		this.setState({location: null});
		this.props.closeModal();
	}

	handleRemoveError = () => this.setState({error: null, errorMessage: null})

	render() {
		const { theme, classes, closeModal, confirm } = this.props;
		const { location, error, errorMessage } = this.state;

		return (
			<FeedsEditIconModalContent 
				icon={<PersonPinCircleIcon classes={{fontSizeLarge: classes.iconFontSize}} fontSize="large" color="primary" />} 
				content={
					<FeedsEditIconForm 
						id="feed-location-form"
						label="Enter location"
						value={location}
						error={error}
						errorMessage={errorMessage}
						onChange={(e,v) => this.setState({location: v})}
						onSubmit={this.handleSubmit}
						removeError={this.handleRemoveError}
						cancel={this.handleCancel}
					/>
				} 
			/>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEditLocation);