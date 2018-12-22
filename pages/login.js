import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import Layout from '../components/layout';
import FormInputControl from '../components/reusables/FormInputControl';

import { contentStyles } from '../utils/view';

const styles = theme => ({
	paper: {
		padding: '2rem 1rem',
		[theme.breakpoints.up('sm')]: {
			padding: '4rem 2rem',
		},
	},
	logo: {
		display: 'block',
		maxWidth: '6rem',
		margin: '0 auto',
	},
	description: {
		margin: '2rem 0',
		[theme.breakpoints.up('sm')]: {
			margin: '3rem',
		},
	},
	loginButtonFormControl: {
		margin: '2rem 0',
		[theme.breakpoints.up('sm')]: {
			margin: '4rem 0 0',
		},
	},
	loginButton: {
		margin: '0 auto',
	},
	loginButtonText: {
		color: theme.palette.common.white,
	},
	...contentStyles(theme)
});

class Login extends React.Component {
	state = {
		password: '',
		error: false,
		errorMessage: null,
	};

	handleLoginSubmit = () => {
		const { password } = this.state;

		if (!password || !password.length) {
			this.setState({
				error: true,
				errorMessage: 'Password is required',
			});

			return;
		}
	}

	removeError = () => this.setState({error: false, errorMessage: null});

	render() {
		const { classes } = this.props;
		const { password, error, errorMessage } = this.state;

		return (
			<Layout title="Umbrella | Login" description="Umbrella web application">
				<div className={classes.content}>
					<Paper className={classes.paper} elevation={1}>
						<img className={classes.logo} src="/static/assets/images/umbrella_logo.png" alt="Umbrella logo"/>
						
						<Typography className={classes.description} variant="h6" align="center">Log in with your password</Typography>

						<form>
							<FormInputControl 
								id="login-password"
								label="Password*"
								value={password}
								type="password"
								error={error}
								errorMessage={errorMessage}
								onChange={(e,v) => this.setState({password: v})}
							/>

							<FormControl className={classes.loginButtonFormControl} fullWidth>
								<ClickAwayListener onClickAway={this.removeError}>
									<Button 
										className={classes.loginButton}
										classes={{containedSecondary: classes.loginButtonText}}
										component="button" 
										variant="contained" 
										color="secondary"
										onClick={this.handleLoginSubmit}
									>
										Login
									</Button>
								</ClickAwayListener>
							</FormControl>
						</form>
					</Paper>
				</div>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({...state.account});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Login));