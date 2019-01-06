import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { addButtonStyles } from '../../utils/view';

const styles = theme => ({
	button: {
		position: 'fixed',
		top: '85vh',
		right: '10vw',
		[theme.breakpoints.up('sm')]: {
			right: '3vw',
		},
		[theme.breakpoints.up('md')]: {
			top: '25vh',
		},
		[theme.breakpoints.up('lg')]: {
			right: '10vw',
		},
	},
	icon: {
		color: theme.palette.common.white,
	},
});

class AddButton extends React.Component {
	render() {
		const { classes, onClick, href } = this.props;

		let fabProps = {};

		if (href) fabProps.href = href;
		else fabProps.onClick = onClick;

		return (
			<Fab className={classes.button} color="secondary" aria-label="Add" {...fabProps}>
				<AddIcon className={classes.icon} />
			</Fab>
		);
	}
}

AddButton.propTypes = {
	onClick: PropTypes.func,
	href: PropTypes.string,
};

export default withStyles(styles, {withTheme: true})(AddButton);