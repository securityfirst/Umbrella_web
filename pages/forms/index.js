import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'

import { getForm, deleteForm } from '../../store/actions/forms'
import { openAlert } from '../../store/actions/view'

import { contentStyles, paperStyles, buttonWrapperStyles } from '../../utils/view'
import { generateForm } from '../../utils/forms'
import { downloadPdf } from '../../utils/dom'

const styles = theme => ({
	...contentStyles(theme),
	label: {
		color: theme.palette.grey[500],
		fontSize: '.875rem',
	},
	formPanel: {
		margin: '.75rem 0',
		...paperStyles(theme),
	},
	formPanelTitle: {
		textTransform: 'capitalize',
	},
	formPanelTitleEmpty: {
		color: theme.palette.grey[600],
		textTransform: 'capitalize',
	},
	formPanelButtonsWrapper: {
		...buttonWrapperStyles(theme),
	},
})

class Forms extends React.Component {
	checkLogin = e => {
		const { dispatch, isProtected, password } = this.props

		if (isProtected && !password) {
			e.preventDefault()

			return dispatch(openAlert('error', 'Please login to continue'))
		}
	}

	handleShare = formSaved => () => {
		const { dispatch } = this.props

		dispatch(openAlert('info', 'Sharing form...'))
	}

	handleDownload = formSaved => async () => {
		const { dispatch, form } = this.props

		await dispatch(openAlert('info', 'Your form is downloading...'))
		
		await dispatch(getForm(formSaved.sha))
		
		const html = generateForm(form, formSaved)

		downloadPdf(formSaved.filename, html)
	}

	handleDelete = formSaved => () => {
		const { dispatch } = this.props

		if (confirm('Are you sure you want to delete this form?')) {
			dispatch(deleteForm(formSaved, () => {
				dispatch(openAlert('success', 'Your form has been deleted'))
			}))
		}
	}

	renderActivePanel = (formSaved, i) => {
		const { classes } = this.props

		return (
			<Paper key={i} className={classes.formPanel} square>
				<Typography className={classes.formPanelTitle} variant="h6">
					{formSaved.filename}
				</Typography>

				<div className={classes.formPanelButtonsWrapper}>
					<Link href={`/forms/${formSaved.sha}/${formSaved.id}`}><Button component="button">Edit</Button></Link>
					<Button component="button" onClick={this.handleShare(formSaved)}>Share</Button>
					<Button component="button" onClick={this.handleDownload(formSaved)}>Download</Button>
					<Button component="button" color="primary" onClick={this.handleDelete(formSaved)}>Delete</Button>
				</div>
			</Paper>
		)
	}

	renderAvailablePanel = (form, i) => {
		const { classes } = this.props

		return (
			<Paper key={i} className={classes.formPanel} square>
				<Typography className={classes.formPanelTitle} variant="h6">
					{form.filename.slice(2, form.filename.length - 4).replace(/-/g, " ")}
				</Typography>

				<div className={classes.formPanelButtonsWrapper}>
					<Link href={`/forms/${form.sha}`}>
						<Button color="primary" onClick={this.checkLogin}>New</Button>
					</Link>
				</div>
			</Paper>
		)
	}

	renderFilledPanel = (formSaved, i) => {
		const { dispatch, classes } = this.props

		const date = new Date(formSaved.dateCompleted)

		return (
			<Paper key={i} className={classes.formPanel} square>
				<Typography className={classes.formPanelTitle} variant="h6">
					{formSaved.filename}
				</Typography>
				<Typography paragraph>{date.toLocaleString()}</Typography>

				<div className={classes.formPanelButtonsWrapper}>
					<Link href={`/forms/${formSaved.sha}/${formSaved.id}`}><Button component="button">Edit</Button></Link>
					<Button component="button" onClick={this.handleShare(formSaved)}>Share</Button>
					<Button component="button" onClick={this.handleDownload(formSaved)}>Download</Button>
					<Button component="button" color="primary" onClick={this.handleDelete(formSaved)}>Delete</Button>
				</div>
			</Paper>
		)
	}

	render() {
		const { 
			classes, 
			locale, 
			content, 
			getContentLoading, 
			getContentError, 
			getFormsSavedLoading, 
			getFormsSavedError, 
			formsSaved,
		} = this.props

		if (getContentLoading || getFormsSavedLoading) return <Loading />
		else if (getContentError || getFormsSavedError) return <ErrorMessage error={getContentError || getFormsSavedError} />

		const formsSorted = formsSaved.reduce((acc, form) => {
			if (form.completed) acc.filled.push(form)
			else acc.active.push(form)
			return acc
		}, {
			active: [], 
			filled: [],
		})

		return (
			<Layout title="Umbrella | Forms" description="Umbrella web application">
				<div className={classes.content}>
					{!!formsSorted.active.length &&
						<React.Fragment>
							<Typography className={classes.label} variant="subtitle1">Active Forms</Typography>
							{formsSorted.active.map(this.renderActivePanel)}
						</React.Fragment>
					}

					<Typography className={classes.label} variant="subtitle1">Available Forms</Typography>
					{content[locale].forms.content
						.filter(form => form.filename.indexOf('f_') === 0)
						.map(this.renderAvailablePanel)
					}

					{!!formsSorted.filled.length &&
						<React.Fragment>
							<Typography className={classes.label} variant="subtitle1">Active Forms</Typography>
							{formsSorted.filled.map(this.renderActivePanel)}
						</React.Fragment>
					}
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.account,
	...state.content,
	...state.forms,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Forms))