import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Layout from '../components/layout'
import FormControlInput from '../components/common/FormControlInput'

import { contentStyles, buttonWrapperStyles } from '../utils/view'

import { savePassword } from '../store/actions/account'

const styles = theme => ({
	...contentStyles(theme),
	heading: {
		textTransform: 'capitalize',
		fontWeight: 'normal',
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

	savePassword = () => {
		const { password, passwordConfirm } = this.state

		if (
			this.checkPassword('password') && 
			this.checkPassword('passwordConfirm')
		) {
			if (password !== passwordConfirm) return alert('Passwords do not match. Please try again.')

			this.props.dispatch(savePassword(password))
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
			<form>
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
							<Typography>
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
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<ExpansionPanel expanded={this.state.expanded === 1} onChange={this.handlePanelToggle(1)}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading} variant="h6">Set password</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails className={classes.formWrapper}>
							<Typography paragraph>Your password must be at least 8 characters long and must contain at least one digit and one capital letter.</Typography>
							{this.renderPasswordForm()}
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</div>
			</Layout>
		)
	}
}

export default withRouter(connect()(withStyles(styles, { withTheme: true })(Account)))