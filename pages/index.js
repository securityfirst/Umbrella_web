import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import Layout from '../components/Layout.js';

import { contentStyles } from '../lib/view';

class Index extends React.Component {
	render() {
		const { classes } = this.props;

		return (
			<Layout title="Umbrella | Home" description="Umbrella web application">
				<div className={classes.content}>
					<Typography variant="h6">Home</Typography>

					<Divider />

					<Typography paragraph>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
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
				</div>
			</Layout>
		);
	}
}

export default withStyles(contentStyles, {withTheme: true})(Index);