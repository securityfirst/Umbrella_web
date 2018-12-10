import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Link from 'next/link';

import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { selectChecklistMenu } from '../store/actions/view';

class AppBarContent extends React.Component {
	handleTabSelect = (e, v) => {
		this.props.dispatch(selectChecklistMenu(v));
	}

	renderText = (text) => {
		return <Typography variant="h6" color="inherit" noWrap>{text}</Typography>;
	}

	renderChecklistsMenu = () => {
		const { checklistMenuIndex } = this.props;

		return (
			<Tabs value={checklistMenuIndex} onChange={this.handleTabSelect}>
				<Tab label="OVERVIEW" />
				<Tab label="CUSTOM" />
			</Tabs>
		);
	}

	render() {
		const { pathname } = this.props.router;
		console.log("this.props: ", this.props);

		switch (pathname) {
			case '/account': 
				return this.renderText('Account');
			case '/checklists': 
				return this.renderChecklistsMenu();
		}

		return this.renderText('Umbrella');
	}
}

const mapStateToProps = (state) => ({...state.view});

export default connect(mapStateToProps)(withRouter(AppBarContent));