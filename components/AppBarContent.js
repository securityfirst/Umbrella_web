import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';

class AppBarContent extends React.Component {
	render() {
		const { appbarTitle } = this.props;

		let textFormated = appbarTitle.charAt(0).toUpperCase() + appbarTitle.slice(1, appbarTitle.length);
		return <Typography variant="h6" color="inherit" noWrap>{textFormated}</Typography>;
	}
}

const mapStateToProps = (state) => ({...state.view});

export default connect(mapStateToProps)(AppBarContent);