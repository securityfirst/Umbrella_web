import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import yellow from '@material-ui/core/colors/yellow';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
	wrapper: {
		width: '100%',
		maxWidth: '32rem',
		[theme.breakpoints.down('sm')]: {
			height: '100%',
			maxHeight: '32rem',
		},
	},
	iconWrapper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '14rem',
		backgroundColor: yellow[700],
	},
	contentWrapper: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
		color: theme.palette.primary.main,
	},
	buttonsWrapper: {
		display: 'flex',
		justifyContent: 'flex-end',
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
	},
});

class FeedsEditIconModalContent extends React.Component {
	render() {
		const { classes, cancel, confirm, icon, content } = this.props;

		return (
			<Paper className={classes.wrapper} square>
				<div className={classes.iconWrapper}>
					{icon}
				</div>
				<div className={classes.contentWrapper}>
					{content}
				</div>
				<div className={classes.buttonsWrapper}>
					<Button onClick={cancel}>Cancel</Button>
					<Button color="secondary" onClick={confirm}>OK</Button>
				</div>
			</Paper>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEditIconModalContent);