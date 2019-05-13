import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import WarningIcon from '@material-ui/icons/Warning'

import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'

import { closeAlert } from '../../store/actions/view'

const variants = ['success', 'warning', 'error', 'info']

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
}

const styles1 = theme => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.dark,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing.unit,
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
})

function AlertContent(props) {
	const { classes, className, message, onClose, variant, ...other } = props
	const Icon = variantIcon[variant]

	return (
		<SnackbarContent
			className={classNames(classes[variant], className)}
			aria-describedby="client-snackbar"
			message={
				<span id="client-snackbar" className={classes.message}>
					<Icon className={classNames(classes.icon, classes.iconVariant)} />
					{message}
				</span>
			}
			action={[
				<IconButton
					key="close"
					aria-label="Close"
					color="inherit"
					className={classes.close}
					onClick={onClose}
				>
					<CloseIcon className={classes.icon} />
				</IconButton>,
			]}
			{...other}
		/>
	)
}

AlertContent.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	message: PropTypes.node,
	onClose: PropTypes.func,
	variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
}

const AlertContentWrapper = withStyles(styles1)(AlertContent)

const styles2 = theme => ({
	margin: {
		margin: theme.spacing.unit,
	},
})

class Alert extends React.Component {
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		this.props.dispatch(closeAlert())
	}

	render() {
		const { classes, alertOpen, alertMessage, alertType } = this.props
		const variant = variants.includes(alertType) ? alertType : 'success'

		return (
			<div>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					open={alertOpen}
					autoHideDuration={5000}
					onClose={this.handleClose}
				>
					<AlertContentWrapper
						onClose={this.handleClose}
						variant={variant}
						message={alertMessage}
					/>
				</Snackbar>
			</div>
		)
	}
}

Alert.propTypes = {
	classes: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	...state.view,
})

export default connect(mapStateToProps)(withStyles(styles2)(Alert))