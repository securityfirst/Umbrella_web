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
import Divider from '@material-ui/core/Divider'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Modal from '@material-ui/core/Modal'

import Layout from '../components/layout'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'
import FormControlInput from '../components/common/FormControlInput'
import FeedsEditLocation from '../components/feeds/FeedsEditLocation'
import FeedsEditSources from '../components/feeds/FeedsEditSources'

import { clearDb } from '../store/actions/db'
import { setLocale, openAlert } from '../store/actions/view'
import { setFeedLocation, setFeedSources } from '../store/actions/feeds'
import { savePassword, resetPassword, unsetPassword } from '../store/actions/account'

import { contentStyles, buttonWrapperStyles } from '../utils/view'

const localeMap = {
	'en': 'English',
	'es': 'SPANISH',
	'ar': 'Arabic',
	'fa': 'Persian',
	'ru': 'Russian',
	'zh-Hant': 'Chinese - Traditional',
}

const styles = theme => ({
	...contentStyles(theme),
	heading: {
		textTransform: 'capitalize',
		fontWeight: 'normal',
	},
	settingsRow: {
		display: 'flex',
		alignItems: 'center',
		margin: '1rem 0',
	},
	settingsColumnLeft: {
		width: '40%',
	},
	settingsColumnRight: {
		width: '60%',
	},
	settingsLocale: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: '1rem',
	},
	settingsLocaleIcon: {
		display: 'inline-block',
		width: '2rem',
		marginRight: '1rem',
	},
	settingsLocaleMenuIcon: {
		alignItems: 'center',
	},
	modal: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	description: {
		margin: '0',
		fontSize: '.75rem',
		color: theme.palette.grey[600],
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
		display: 'block',
		margin: '1rem 0',
	},
	buttonWrapper: {
		marginTop: '2rem',
	},
	skipButton: {
		marginLeft: '1rem',
	},
})

class Account extends React.Component {
	state = {
		expanded: 0,
		localeMenuAnchorEl: null,
		feedsModalOpen: false,
		feedsModalContent: null,
		password: '',
		passwordConfirm: '',
		passwordOld: '',
		passwordError: null,
		passwordErrorMessage: '',
		passwordConfirmError: null,
		passwordConfirmErrorMessage: '',
	}

	componentDidMount() {
		const { query } = this.props.router
		if (query && query.setpassword) this.setState({expanded: 2})
	}

	handlePanelToggle = i => (e, expanded) => {
		this.setState({expanded: expanded ? i : false})
	}

	clearDb = () => {
		if (confirm('Are you sure you want to delete your cache? It will remove all data, including your password.')) {
			this.props.dispatch(clearDb())
		}
	}

	handleLocaleMenuOpen = e => this.setState({ anchorEl: e.currentTarget })

	handleLocaleMenuClose = () => this.setState({ anchorEl: null })

	setLocale = locale => () => {
		this.props.dispatch(setLocale(locale))
		this.handleLocaleMenuClose()
	}

	setLocation = location => {
		this.props.dispatch(setFeedLocation(location))
	}

	setSources = sources => {
		this.props.dispatch(setFeedSources(sources))
	}

	handleModalClose = () => this.setState({feedsModalOpen: false})

	handleFormOpen = type => () => {
		let state = {feedsModalOpen: true}

		// set modal inner content
		switch (type) {
			case 'location': 
				state.feedsModalContent = <FeedsEditLocation closeModal={this.handleModalClose} onSubmit={this.setLocation} />
				break
			case 'sources': 
				state.feedsModalContent = <FeedsEditSources closeModal={this.handleModalClose} onSubmit={this.setSources} />
				break
		}

		this.setState(state)
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

		const { dispatch, router, passwordExists } = this.props
		const { password, passwordConfirm, passwordOld } = this.state

		if (
			this.checkPassword('password') && 
			this.checkPassword('passwordConfirm')
		) {
			if (password !== passwordConfirm) {
				return dispatch(openAlert('error', 'Passwords do not match - please try again'))
			}

			if (passwordExists) {
				dispatch(resetPassword(password, passwordOld, () => {
					this.setState({
						password: '',
						passwordConfirm: '',
						passwordOld: '',
						passwordError: null,
						passwordErrorMessage: '',
						passwordConfirmError: null,
						passwordConfirmErrorMessage: '',
					})
				}))
			} else {
				dispatch(savePassword(password, () => {
					if (router.pathname.indexOf('account') === -1) router.back()
					else {
						this.setState({
							password: '',
							passwordConfirm: '',
							passwordError: null,
							passwordErrorMessage: '',
							passwordConfirmError: null,
							passwordConfirmErrorMessage: '',
						})
					}
				}))
			}
		}
	}

	unsetPassword = e => {
		const { dispatch, passwordExists, isProtected } = this.props

		if (!passwordExists || !isProtected) {
			return dispatch(openAlert('warning', 'You don\'t have a password set.'))
		}

		dispatch(unsetPassword())
	}

	renderSettings = () => {
		const { classes, locale } = this.props
		const { anchorEl } = this.state

		return (
			<div>
				<div className={classes.settingsRow}>
					<div className={classes.settingsColumnLeft}>
						<Button
							color="primary"
							aria-owns={anchorEl ? 'locale-menu' : undefined}
							aria-haspopup="true"
							onClick={this.handleLocaleMenuOpen}
						>Select Language</Button>

						<Menu
							id="locale-menu"
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={this.handleLocaleMenuClose}
						>
							{Object.keys(localeMap).map((locale, i) => (
								<MenuItem key={i} onClick={this.setLocale(locale)}>
									<ListItemIcon className={classes.settingsLocaleMenuIcon}>
										<img
											className={classes.settingsLocaleIcon}
											src={`/static/assets/images/${locale}.png`}
											alt={`Umbrella settings locale ${locale} icon`}
										/>
									</ListItemIcon>
									<ListItemText inset primary={localeMap[locale]} />
								</MenuItem>
							))}
						</Menu>
					</div>
					<div className={classes.settingsColumnRight}>
						<div className={classes.settingsLocale}>
							<img
								className={classes.settingsLocaleIcon}
								src={`/static/assets/images/${locale}.png`}
								alt={`Umbrella settings locale ${locale} icon`}
							/>
							<Typography>{localeMap[locale]}</Typography>
						</div>
						<Typography variant="caption">
							Change your system and content language preference.
						</Typography>
					</div>
				</div>

				<Divider/>

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
			</div>
		)
	}

	renderFeedSettings = () => {
		const { classes, locale, feedLocation, feedSources } = this.props

		return (
			<div style={{width:'100%'}}>
				<div className={classes.settingsRow}>
					<div className={classes.settingsColumnLeft}>
						<Button color="primary" onClick={this.handleFormOpen('location')}>Set Location</Button>
					</div>
					<div className={classes.settingsColumnRight}>
						<Typography>{
							feedLocation 
								? feedLocation.place_name 
								: 'Location not set'
						}</Typography>
					</div>
				</div>

				<Divider/>

				<div className={classes.settingsRow}>
					<div className={classes.settingsColumnLeft}>
						<Button color="primary" onClick={this.handleFormOpen('sources')}>Set Sources</Button>
					</div>
					<div className={classes.settingsColumnRight}>
						<Typography>{
							feedSources.length 
								? `${feedSources.length} source${feedSources.length > 1 ? 's' : ''}` 
								: 'Set sources'
						}</Typography>
					</div>
				</div>

				<Modal
					className={classes.modal}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={this.state.feedsModalOpen}
					onClose={this.handleModalClose}
					disableAutoFocus
				>
					{this.state.feedsModalContent}
				</Modal>
			</div>
		)
	}

	renderPasswordForm() {
		const { classes, passwordExists, isProtected } = this.props
		const { 
			password, 
			passwordConfirm,
			passwordOld, 
			passwordError, 
			passwordErrorMessage,
			passwordConfirmError, 
			passwordConfirmErrorMessage,
		} = this.state

		return (
			<form onSubmit={this.savePassword}>
				{passwordExists && <FormControlInput
					id="old-password"
					className={classes.input}
					type="password"
					label="Old Password"
					value={passwordOld}
					error={passwordError}
					errorMessage={passwordErrorMessage}
					onChange={this.handlePasswordChange('passwordOld')}
					inputProps={{
						onBlur: this.clearPasswordErrors
					}}
				/>}
				<FormControlInput
					id="reg-password"
					className={classes.input}
					type="password"
					label={passwordExists ? 'New Password' : 'Password'}
					value={password}
					error={passwordError}
					errorMessage={passwordErrorMessage}
					onChange={this.handlePasswordChange('password')}
					inputProps={{
						onBlur: this.clearPasswordErrors
					}}
				/>
				<FormControlInput
					id="reg-passwordConfirm"
					className={classes.input}
					type="password"
					label={passwordExists ? 'Confirm New Password' : 'Confirm Password'}
					value={passwordConfirm}
					error={passwordConfirmError}
					errorMessage={passwordConfirmErrorMessage}
					onChange={this.handlePasswordChange('passwordConfirm')}
					inputProps={{
						onBlur: this.clearPasswordErrors
					}}
				/>
				<Typography className={classes.description} paragraph>
					* Your password must be at least 8 characters long and must contain at least one digit 
					and one capital letter.
				</Typography>
				{passwordExists && <Typography className={classes.description} paragraph>
					** Enter your old password to retain your saved data.
				</Typography>}
				<div className={classes.buttonWrapper}>
					<Button color="primary" variant="contained" onClick={this.savePassword}>Confirm</Button>
					{(passwordExists && isProtected) && 
						<Button className={classes.skipButton} color="primary" onClick={this.unsetPassword}>Unset Password</Button>
					}
				</div>
			</form>
		)
	}

	renderPassword = () => {
		const { classes, checkPasswordLoading, checkPasswordError, passwordExists } = this.props

		if (checkPasswordLoading) return <Loading />
		if (checkPasswordError) return <ErrorMessage error={checkPasswordError} />

		return (
			<React.Fragment>
				<Typography paragraph><strong>Status: </strong>{passwordExists ? 'Already Set' : 'Not Set'}</Typography>
				<Typography className={classes.disclaimerLarge}>
					<strong>DISCLAIMER: </strong> We do not store any data on our servers during your 
					usage, including your password. Your password is encoded and stored on your browser, 
					and it is used to decode other information you choose to store. Please do not use a 
					sensitive password combination in case it is compromised.
				</Typography>
				{this.renderPasswordForm()}
			</React.Fragment>
		)
	}

	render() {
		const { classes, passwordExists } = this.props

		return (
			<Layout title="Umbrella | Account" description="Umbrella web application">
				<div className={classes.content}>
					{/* Settings */}
					<ExpansionPanel expanded={this.state.expanded === 0} onChange={this.handlePanelToggle(0)}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading} variant="h6">Settings</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							{this.renderSettings()}
						</ExpansionPanelDetails>
					</ExpansionPanel>

					{/* Feed Settings */}
					<ExpansionPanel expanded={this.state.expanded === 1} onChange={this.handlePanelToggle(1)}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading} variant="h6">Feed Settings</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							{this.renderFeedSettings()}
						</ExpansionPanelDetails>
					</ExpansionPanel>

					{/* Password */}
					<ExpansionPanel expanded={this.state.expanded === 2} onChange={this.handlePanelToggle(2)}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading} variant="h6">{`${passwordExists ? 'Reset' : 'Set'} password`}</Typography>
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
	...state.view,
	...state.account,
	...state.feeds,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Account)))