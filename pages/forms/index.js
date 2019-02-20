import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import AddButton from '../../components/common/AddButton'

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
		textTransform: "capitalize",
	},
	formPanelButtonsWrapper: {
		...buttonWrapperStyles(theme),
	},
})

class Forms extends React.Component {
	handleEdit = form => () => {
		alert("Edit " + form.typeId)
	}

	handleShare = form => () => {
		alert("Sharing " + form.typeId)
	}

	renderPanel = (isActive) => (form, i) => {
		const { classes } = this.props

		if (form.filename.indexOf("f_") === 0) {
			return (
				<Paper key={i} className={classes.formPanel} square>
					<Typography className={classes.formPanelTitle} variant="h6">
						{form.filename.slice(2, form.filename.length - 4).replace(/-/g, " ")}
					</Typography>
					{/*<Typography paragraph>{formType.description}</Typography>*/}

					{isActive 
						? <div className={classes.formPanelButtonsWrapper}>
							<Button component="button" onClick={this.handleEdit(form)}>Edit</Button>
							<Button color="primary" onClick={this.handleShare(form)}>Share</Button>
						</div>
						: <div className={classes.formPanelButtonsWrapper}>
							<Button color="primary" href={`/forms/${form.sha}`}>New</Button>
						</div>
					}
				</Paper>
			)
		}
	}

	renderContent = () => {
		const { classes, locale, content, getContentLoading, getContentError } = this.props

		if (getContentLoading) return <Loading />
		else if (getContentError) return <ErrorMessage error={getContentError} />

		return (
			<div className={classes.content}>
				{/* TODO: Set up active form */}
				{/*<Typography className={classes.label} variant="subtitle1">Active</Typography>*/}

				{/*this.renderPanel(form, null, true)*/}

				<Typography className={classes.label} variant="subtitle1">All</Typography>

				{content[locale].forms.content.map(this.renderPanel(false))}
			</div>
		)
	}

	render() {
		const { classes } = this.props

		return (
			<Layout title="Umbrella | Forms" description="Umbrella web application">
				{this.renderContent()}

				<AddButton href="/forms/new" />
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.content,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Forms))