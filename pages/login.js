import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import Link from 'next/link'

import { withStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'

import Layout from '../components/layout'
import Loading from '../components/common/Loading'
import FormControlInput from '../components/common/FormControlInput'

import { contentStyles } from '../utils/view'

import { checkPassword, login } from '../store/actions/account'

const styles = theme => ({
	...contentStyles(theme),
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
		display: 'flex',
		justifyContent: 'center',
		margin: '2rem 0',
		[theme.breakpoints.up('sm')]: {
			margin: '4rem 0 0',
		},
	},
	loginButton: {
		margin: '0 auto 1rem',
	},
	loginButtonText: {
		color: theme.palette.common.white,
	},
})

class Login extends React.Component {
	state = {
		password: '',
		error: false,
		errorMessage: null,
	}

	componentDidMount() {
		const { query } = this.props.router
		if (query && query.setpassword) this.setState({expanded: 1})

		if (typeof window !== 'undefined') {
			this.props.dispatch(checkPassword())
		}
	}

	handleLoginSubmit = e => {
		!!e && e.preventDefault()

		const { router } = this.props
		const { password } = this.state

		if (!password || !password.length) {
			return this.setState({
				error: true,
				errorMessage: 'Password is required',
			})
		}

		this.props.dispatch(login(password, () => {
			alert('You are now logged in!')
			if (router.pathname.indexOf('account') === -1) router.back()
		}))
	}

	removeError = () => this.setState({error: false, errorMessage: null})

	render() {
		const { classes, loginLoading, loginError, checkPassword } = this.props
		const { password, error, errorMessage } = this.state

		return (
			<Layout title="Umbrella | Login" description="Umbrella web application">
				<div className={classes.content}>
					<Paper className={classes.paper} elevation={1}>
						<img className={classes.logo} src="/static/assets/images/umbrella_logo.png" alt="Umbrella logo"/>
						
						<Typography className={classes.description} variant="h6" align="center">Log in with your password</Typography>

						<form onSubmit={this.handleLoginSubmit}>
							<FormControlInput 
								id="login-password"
								label="Password*"
								value={password}
								type="password"
								error={error || !!loginError}
								errorMessage={errorMessage || !!loginError ? loginError.message : null}
								onChange={e => this.setState({password: e.target.value})}
								required
								autoFocus
							/>

							<FormControl className={classes.loginButtonFormControl} fullWidth>
								<ClickAwayListener onClickAway={this.removeError}>
									{loginLoading
										? <Loading />
										: <Button 
											className={classes.loginButton}
											classes={{containedSecondary: classes.loginButtonText}}
											component="button" 
											variant="contained" 
											color="secondary"
											onClick={this.handleLoginSubmit}
										>
											Login
										</Button>
									}
								</ClickAwayListener>
								
								{(!!loginError && loginError.message === 'Password does not exist') &&
									<Link href={{pathname: '/account', query: {setpassword: true}}}>
										<Button 
											className={classes.loginButton}
											component="button" 
											color="primary"
										>
											Set Password
										</Button>
									</Link>
								}
							</FormControl>
						</form>
					</Paper>
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.account
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Login)))