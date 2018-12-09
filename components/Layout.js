import React from 'react';
import Head from 'next/head';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const theme = createMuiTheme({
	palette: {
		primary: {
			// light: ,
			main: '#b83657',
			dark: '#8b2a42',
		},
	},
})

class Layout extends React.Component {
	state = {
		menuToggled: false,
	};

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<div className="layout">
					<Head>
						<title>{this.props.title}</title>
						<meta charSet='utf-8' />
						<meta name='viewport' content='initial-scale=1.0, width=device-width' />
						<meta name='description' content={this.props.description} />
						<link href="/static/styles/global.css" rel="stylesheet" />
					</Head>

					<AppBar position='fixed'>
						<Toolbar>
							<IconButton color="inherit" aria-label="Menu">
								<MenuIcon />
							</IconButton>
							<Typography variant="h6" color="inherit">
								News
							</Typography>
							{/*<Button color="inherit">Login</Button>*/}
						</Toolbar>
					</AppBar>
					
					{this.props.children}
				</div>
			</MuiThemeProvider>
		);
	}
}

export default Layout;