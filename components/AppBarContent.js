import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';

class AppBarContent extends React.Component {
	render() {
		const { router, appbarTitle } = this.props;

		const title = appbarTitle || (
			router.pathname == '/'
				? 'Umbrella'
				: router.pathname.charAt(1).toUpperCase() + router.pathname.slice(2, router.pathname.length) 
		);

		return <Typography variant="h6" color="inherit" noWrap>{title}</Typography>;
	}
}

AppBarContent.propTypes = {
	router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({...state.view});

export default withRouter(connect(mapStateToProps)(AppBarContent));