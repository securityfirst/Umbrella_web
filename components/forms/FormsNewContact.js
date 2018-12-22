import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { contentStyles } from '../../utils/view';

const styles = theme => ({
	wrapper: {
		
	},
	...contentStyles(theme),
});

const steps = ['Contact', 'Incident', 'Impact', 'Data'];

class FormsNew extends React.Component {
	state = {
	}

	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.wrapper} square>
				
			</Paper>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FormsNew);