import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Loading from '../common/Loading'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

import { saveForm } from '../../store/actions/forms'

const styles = theme => ({
	wrapper: {
		...paperStyles(theme),
	},
	hint: {
		color: theme.palette.grey[500],
	},
	copy: {
		margin: '2rem 0',
	},
	buttonsWrapper: {
		margin: '1rem 0 0',
		...buttonWrapperStyles(theme),
	},
})

class FormsNewSubmit extends React.Component {
	componentWillMount() {
		this.props.dispatch(saveForm(this.props.forms))
	}

	removeError = () => this.setState({error: null, errorMessage: null})

	onGoBack = () => this.props.onGoBack({data: this.state.data})

	onSubmit = () => this.props.dispatch(saveForm(this.props.forms))

	renderError = () => {
		const { classes, saveFormError } = this.props

		return (
			<div>
				<Typography className={classes.copy} paragraph><strong>Error [{saveFormError.status}]</strong>{saveFormError.message}</Typography>

				<div className={classes.buttonsWrapper}>
					<Button onClick={this.onGoBack}>Go Back</Button>
					<Button color="secondary" onClick={this.onSubmit}>{systemLocaleMap[locale].try_again}</Button>
				</div>
			</div>
		)
	}

	renderSuccess = () => {
		const { classes, locale, systemLocaleMap } = this.props

		return (
			<div>
				<Typography className={classes.copy} paragraph>{systemLocaleMap[locale].form_submitted}</Typography>

				<div className={classes.buttonsWrapper}>
					<Link href="/forms/new"><Button>{systemLocaleMap[locale].form_message_body_form_new}</Button></Link>
					<Link href="/forms"><Button color="secondary">{systemLocaleMap[locale].finish}</Button></Link>
				</div>
			</div>
		)
	}

	render() {
		const { classes, locale, systemLocaleMap, saveFormLoading, saveFormError, saveFormSuccess } = this.props

		return (
			<Paper className={classes.wrapper} square>
				<Typography variant="h6" color="primary">{systemLocaleMap[locale].submit}</Typography>
				<Typography className={classes.hint}>{systemLocaleMap[locale].placeholder}</Typography>

				{saveFormLoading
					? <Loading />
					: saveFormSuccess
						? this.renderError()
						: this.renderSuccess()
				}
			</Paper>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.forms,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FormsNewSubmit))