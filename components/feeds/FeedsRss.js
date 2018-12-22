import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { contentStyles } from '../../utils/view';

const styles = theme => ({
	addButton: {
		position: 'fixed',
		top: '85vh',
		right: '10vw',
		[theme.breakpoints.up('sm')]: {
			top: '25vh',
		},
	},
	addIcon: {
		color: theme.palette.common.white,
	},
});

class FeedsRss extends React.Component {
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography paragraph>
					<strong>FEEDS RSS</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
					incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
					elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
					hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
					velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
					Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
					viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
					Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
					at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
					ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
				</Typography>
				
				<Fab className={classes.addButton} color="secondary" aria-label="Add">
					<AddIcon className={classes.addIcon} />
				</Fab>
			</div>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsRss);