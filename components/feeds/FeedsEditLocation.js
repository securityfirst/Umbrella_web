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

	render() {
		const { theme, classes, cancel, confirm } = this.props;
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
						onChange={(e,v) => this.setState({password: v})}
					/>
				}
				cancel={this.handleModalClose} 
				confirm={this.handleModalClose} 
			/>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEditLocation);