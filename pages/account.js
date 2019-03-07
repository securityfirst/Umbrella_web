import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import Link from 'next/link'

import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Layout from '../components/layout'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'
import FormControlInput from '../components/common/FormControlInput'

import { contentStyles, buttonWrapperStyles } from '../utils/view'

import { checkPassword, savePassword } from '../store/actions/account'
import { clearDb } from '../store/actions/db'

const styles = theme => ({
	...contentStyles(theme),
	heading: {
		textTransform: 'capitalize',
		fontWeight: 'normal',
	},
	settingsRow: {
		display: 'flex',
		alignItems: 'center',
	},
	settingsColumnLeft: {
		width: '40%',
	},
	settingsColumnRight: {
		width: '60%',
	},
	description: {
		marginBottom: '2rem',
	},
	disclaimerLarge: {
		textTransform: 'uppercase',
	},
	disclaimerSmall: {
	},
	formWrapper: {
		flexDirection: 'column',
	},
	input: {
		marginTop: '1rem',
	},
	buttonWrapper: {
		...buttonWrapperStyles(theme),
		justifyContent: 'space-between',
		marginTop: '2rem',
	},
})

class Account extends React.Component {
	state = {
		expanded: 0,
		password: '',
		passwordConfirm: '',
		passwordError: null,
		passwordErrorMessage: '',
		passwordConfirmError: null,
		passwordConfirmErrorMessage: '',
		passwordSuccessMessage: '',
	}

	componentDidMount() {
		const { query } = this.props.router
		if (query && query.setpassword) this.setState({expanded: 1})

		if (typeof window !== 'undefined') {
			this.props.dispatch(checkPassword())
		}
	}

	clearDb = () => {
		this.props.dispatch(clearDb())
	}

	handlePanelToggle = i => (e, expanded) => {
		this.setState({expanded: expanded ? i : false})
	}

	handlePasswordChange = type => e => {
		this.setState({
			[type]: e.target.value,
			passwordError: null,
			passwordErrorMessage: '',
			passwordConfirmError: null,
			passwordConfirmErrorMessage: '',
		})
	}

	clearPasswordErrors = () => {
		this.setState({
			passwordError: null,
			passwordErrorMessage: '',
			passwordConfirmError: null,
			passwordConfirmErrorMessage: '',
		})
	}

	checkPassword = type => {
		const value = this.state[type]

		if (!value) {
			this.setState({
				[`${type}Error`]: true,
				[`${type}ErrorMessage`]: 'Password cannot be empty',
			})
			return false
		} else if (value.length < 8) {
			this.setState({
				[`${type}Error`]: true,
				[`${type}ErrorMessage`]: 'Password must be at least 8 characters long',
			})
			return false
		} else if (!RegExp('[A-Z]+[0-9]*').test(value)) {
			this.setState({
				[`${type}Error`]: true,
				[`${type}ErrorMessage`]: 'Password must include at least one digit and one capital letter',
			})
			return false
		} else {
			this.setState({
				[`${type}Error`]: null,
				[`${type}ErrorMessage`]: null,
			})
			return true
		}
	}

	savePassword = e => {
		!!e && e.preventDefault()

		const { router } = this.props
		const { password, passwordConfirm } = this.state

		if (
			this.checkPassword('password') && 
			this.checkPassword('passwordConfirm')
		) {
			if (password !== passwordConfirm) return alert('Passwords do not match. Please try again.')

			this.props.dispatch(savePassword(password, router))
			this.setState({
				password: '',
				passwordConfirm: '',
				passwordError: null,
				passwordErrorMessage: '',
				passwordConfirmError: null,
				passwordConfirmErrorMessage: '',
				passwordSuccessMessage: 'Your password has been saved!'
			}, () => {
				setTimeout(() => {
					this.setState({passwordSuccessMessage: ''})
				}, 3000)
			})
		}
	}

	renderPasswordForm() {
		const { classes } = this.props
		const { 
			password, 
			passwordConfirm, 
			passwordError, 
			passwordErrorMessage,
			passwordConfirmError, 
			passwordConfirmErrorMessage,
			passwordSuccessMessage,
		} = this.state

		return (
			<form onSubmit={this.savePassword}>
				<FormControlInput
					id="account-password"
					className={classes.input}
					type="password"
					label="Password"
					value={password}
					error={passwordError}
					errorMessage={passwordErrorMessage}
					onChange={this.handlePasswordChange('password')}
					inputProps={{
						onBlur: this.clearPasswordErrors
					}}
				/>
				<FormControlInput
					id="account-passwordConfirm"
					className={classes.input}
					type="password"
					label="Password Confirm"
					value={passwordConfirm}
					error={passwordConfirmError}
					errorMessage={passwordConfirmErrorMessage}
					onChange={this.handlePasswordChange('passwordConfirm')}
					inputProps={{
						onBlur: this.clearPasswordErrors
					}}
				/>
				<div className={classes.buttonWrapper}>
					<Typography color="primary">{passwordSuccessMessage}</Typography>
					<Button color="secondary" onClick={this.savePassword}>Confirm</Button>
				</div>
			</form>
		)
	}

	renderSettings = () => {
		const { classes, checkPasswordLoading, checkPasswordError, passwordExists, password } = this.props

		if (password) return (
			<React.Fragment>
				<div className={classes.settingsRow}>
					<div className={classes.settingsColumnLeft}>
						<Button color="primary" onClick={this.clearDb}>Delete Cache</Button>
					</div>
					<div className={classes.settingsColumnRight}>
						<Typography variant="caption">
							All settings and preferences, including your password, are encrypted and stored in your local browser storage. Deleting your cache will remove all data, including your password.
						</Typography>
					</div>
				</div>
			</React.Fragment>
		)

		if (checkPasswordLoading) return <Loading />
		if (checkPasswordError) return <ErrorMessage error={checkPasswordError} />

		if (passwordExists) return (
			<Typography>
				Login to view and make changes to your app settings.
			</Typography>
		)

		return (
			<Typography>
				You do not have a password set. Create a password to save your app preferences and data.
			</Typography>
		)
	}

	renderPassword = () => {
		const { classes, checkPasswordLoading, checkPasswordError, passwordExists } = this.props

		if (checkPasswordLoading) return <Loading />
		if (checkPasswordError) return <ErrorMessage error={checkPasswordError} />

		// TODO: Add toggle to reset password and re-encrypt database
		return (
			<React.Fragment>
				<Typography><strong>Status: </strong>{passwordExists ? 'Already Set' : 'Not Set'}</Typography>
				<Typography className={classes.description} paragraph>
					Your password must be at least 8 characters long and must contain at least one digit 
					and one capital letter.
				</Typography>
				<Typography className={classes.disclaimerLarge} paragraph>
					<strong>DISCLAIMER: </strong> We do not store any data on our servers during your 
					usage, including your password. Your password is encrypted and stored on your browser, 
					and it is used to decrypt other information you choose to store. Please do not use a 
					sensitive password combination in case it is compromised.
				</Typography>
				<Typography className={classes.disclaimerSmall} paragraph>
					For more information, visit <Link href="/about"><a>this page</a></Link>.
				</Typography>
				{this.renderPasswordForm()}
			</React.Fragment>
		)
	}

	render() {
		const { classes } = this.props

		return (
			<Layout title="Umbrella | Account" description="Umbrella web application">
				<div className={classes.content}>
					<ExpansionPanel expanded={this.state.expanded === 0} onChange={this.handlePanelToggle(0)}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading} variant="h6">Settings</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							{this.renderSettings()}
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<ExpansionPanel expanded={this.state.expanded === 1} onChange={this.handlePanelToggle(1)}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading} variant="h6">Set password</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails className={classes.formWrapper}>
							{this.renderPassword()}
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.account,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Account)))