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
import { setAppbarTitle, openAlert } from '../store/actions/view'

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
		const { dispatch, router, locale, systemLocaleMap } = this.props
		const { query } = router

		dispatch(setAppbarTitle(systemLocaleMap[locale].login_message_button))
		if (query && query.setpassword) this.setState({expanded: 1})
		if (typeof window !== 'undefined') dispatch(checkPassword())
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.locale !== this.props.locale) {
			this.props.dispatch(setAppbarTitle(nextProps.systemLocaleMap[nextProps.locale].login_message_button))
		}
	}

	handleLoginSubmit = e => {
		!!e && e.preventDefault()

		const { dispatch, router, locale, systemLocaleMap } = this.props
		const { password } = this.state

		if (!password || !password.length) {
			return this.setState({
				error: true,
				errorMessage: systemLocaleMap[locale].login_enter_pw,
			})
		}

		dispatch(login(password, () => {
			dispatch(openAlert('success', systemLocaleMap[locale].login_success))
			if (router.pathname.indexOf('account') === -1) router.back()

			setTimeout(() => {
				window.location.reload()
			}, 1000)
		}))
	}

	removeError = () => this.setState({error: false, errorMessage: null})

	render() {
		const { classes, locale, systemLocaleMap, loginLoading, loginError, checkPassword } = this.props
		const { password, error, errorMessage } = this.state

		return (
			<Layout title={`${systemLocaleMap[locale].app_name} | ${systemLocaleMap[locale].login_message_button}`} description="Umbrella web application">
				<div className={classes.content}>
					<Paper className={classes.paper} elevation={1}>
						<img className={classes.logo} src="/static/assets/images/umbrella_logo.png" alt="Umbrella logo"/>
						
						<Typography className={classes.description} variant="h6" align="center">{systemLocaleMap[locale].login_your_password}</Typography>

						<form onSubmit={this.handleLoginSubmit}>
							<FormControlInput 
								id="login-password"
								label={`${systemLocaleMap[locale].account_password_alert_password}*`}
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
											{systemLocaleMap[locale].login_message_button}
										</Button>
									}
								</ClickAwayListener>
								
								{(!!loginError && loginError.message === systemLocaleMap[locale].password_not_exist) &&
									<Link href={{pathname: '/account', query: {setpassword: true}}}>
										<Button 
											className={classes.loginButton}
											component="button" 
											color="primary"
										>
											{systemLocaleMap[locale].account_set_password}
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
	...state.view,
	...state.account,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Login)))