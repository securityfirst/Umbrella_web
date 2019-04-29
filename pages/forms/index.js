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

import { contentStyles, paperStyles, buttonWrapperStyles } from '../../utils/view'

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
	handleShare = form => () => {
		alert('Share ' + form.id)
	}

	handleDownload = form => () => {
		alert('Download ' + form.id)
	}

	handleDelete = form => () => {
		alert('Delete ' + form.id)
	}

	renderActivePanel = (form, i) => {
		const { classes } = this.props

		return (
			<Paper key={i} className={classes.formPanel} square>
				<Typography className={classes.formPanelTitle} variant="h6">
					{form.filename}
				</Typography>

				<div className={classes.formPanelButtonsWrapper}>
					<Link href={`/forms/edit/${form.sha}`}><Button component="button">Edit</Button></Link>
					<Button component="button" onClick={this.handleShare(form)}>Share</Button>
					<Button component="button" onClick={this.handleDownload(form)}>Download</Button>
					<Button component="button" color="primary" onClick={this.handleDelete(form)}>Delete</Button>
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
					<Link href={`/forms/${form.sha}`}><Button color="primary">New</Button></Link>
				</div>
			</Paper>
		)
	}

	renderFilledPanel = (form, i) => {
		const { dispatch, classes } = this.props

		const date = new Date(form.dateCompleted)

		return (
			<Paper key={i} className={classes.formPanel} square>
				<Typography className={classes.formPanelTitle} variant="h6">
					{form.filename}
				</Typography>
				<Typography paragraph>{date.toLocaleString()}</Typography>

				<div className={classes.formPanelButtonsWrapper}>
					<Button component="button" onClick={this.handleEdit(form)}>Edit</Button>
					<Button component="button" onClick={this.handleShare(form)}>Share</Button>
					<Button component="button" onClick={this.handleDownload(form)}>Download</Button>
					<Button component="button" color="primary" onClick={this.handleDelete(form)}>Delete</Button>
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
	...state.content,
	...state.forms,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Forms))