import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Layout from '../components/layout';

import { contentStyles } from '../utils/view';

const styles = theme => contentStyles(theme, {
	tabs: {
		backgroundColor: theme.palette.background.paper,
	},
});

class Checklists extends React.Component {
	state = {
		tabIndex: 0
	};

	handleTabSelect = (e, v) => this.setState({tabIndex: v});

	renderOverview = () => (
		<Typography paragraph>
			<strong>OVERVIEW</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
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
	);

	renderCustom = () => (
		<Typography paragraph>
			<strong>CUSTOM</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
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
	);

	render() {
		const { classes } = this.props;
		const { tabIndex } = this.state;

		let content;

		switch (tabIndex) {
			case 0: content = this.renderOverview(); break;
			case 1: content = this.renderCustom(); break;
		}

		return (
			<Layout title="Umbrella | Checklists" description="Umbrella web application">
				<Tabs 
					className={classes.tabs}
					value={tabIndex} 
					onChange={this.handleTabSelect}
				>
					<Tab label="OVERVIEW" />
					<Tab label="CUSTOM" />
				</Tabs>

				<div className={classes.content}>
					{content}
				</div>
			</Layout>
		);
	}
}

Checklists.propTypes = {

};

export default withStyles(styles, {withTheme: true})(Checklists);