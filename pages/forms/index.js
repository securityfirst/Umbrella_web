import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'

import { getForm, deleteForm } from '../../store/actions/forms'
import { setAppbarTitle, openAlert } from '../../store/actions/view'

import { contentStyles, paperStyles, buttonWrapperStyles } from '../../utils/view'
import { generateForm } from '../../utils/forms'
import { downloadPdf, downloadHtml, downloadDocx } from '../../utils/dom'

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
		justifyContent: 'space-between',
		alignItems: 'center'
	},
})

class Forms extends React.Component {
	state = {
		anchorEl: null,
	}

	componentDidMount() {
		const { dispatch, locale, systemLocaleMap } = this.props
		dispatch(setAppbarTitle(systemLocaleMap[locale].form_title))
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.locale !== this.props.locale) {
			this.props.dispatch(setAppbarTitle(nextProps.systemLocaleMap[nextProps.locale].form_title))
		}
	}

	checkLogin = e => {
		const { dispatch, locale, systemLocaleMap, isProtected, password } = this.props

		if (isProtected && !password) {
			e.preventDefault()

			return dispatch(openAlert('error', systemLocaleMap[locale].login_your_password))
		}
	}

	handleClick = e => this.setState({ anchorEl: e.currentTarget })

	handleClose = () => this.setState({ anchorEl: null })

	downloadHtml = formSaved => async () => {
		const { dispatch, locale, systemLocaleMap, form } = this.props

		try {
			await dispatch(openAlert('info', systemLocaleMap[locale].form_downloading))
			await dispatch(getForm(formSaved.sha))
			
			const html = generateForm(form, formSaved)

			downloadHtml(formSaved.filename, html)

			dispatch(openAlert('success', systemLocaleMap[locale].downloaded))
		} catch (e) {
			console.error('Download HTML error: ', e)
			dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		}
	}

	downloadPdf = formSaved => async () => {
		const { dispatch, locale, systemLocaleMap, form } = this.props

		try {
			await dispatch(openAlert('info', systemLocaleMap[locale].form_downloading))
			
			await dispatch(getForm(formSaved.sha))
			
			const html = generateForm(form, formSaved)

			downloadPdf(formSaved.filename, html)

			dispatch(openAlert('success', systemLocaleMap[locale].downloaded))
		} catch (e) {
			console.error('Download PDF error: ', e)
			dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		}
	}

	downloadDocx = formSaved => async () => {
		const { dispatch, locale, systemLocaleMap, form } = this.props

		try {
			await dispatch(openAlert('info', systemLocaleMap[locale].form_downloading))
			
			await dispatch(getForm(formSaved.sha))
			
			const html = generateForm(form, formSaved)

			downloadDocx(formSaved.filename, html)

			dispatch(openAlert('success', systemLocaleMap[locale].downloaded))
		} catch (e) {
			console.error('Download DOCX error: ', e)
			dispatch(openAlert('error', systemLocaleMap[locale].general_error))
		}
	}

	handleDelete = formSaved => () => {
		const { dispatch, locale, systemLocaleMap } = this.props

		if (confirm(systemLocaleMap[locale].confirm_form_delete)) {
			dispatch(deleteForm(formSaved, () => {
				dispatch(openAlert('success', systemLocaleMap[locale].form_deleted))
			}))
		}
	}

	renderActivePanel = (formSaved, i) => {
		const { classes, locale, systemLocaleMap } = this.props
		const { anchorEl } = this.state

		return (
			<Paper key={i} className={classes.formPanel} square>
				<Typography className={classes.formPanelTitle} variant="h6">
					{formSaved.filename}
				</Typography>

				<div className={classes.formPanelButtonsWrapper}>
					<div>
						<Typography className={classes.label}>
							<strong>{systemLocaleMap[locale].date_created}</strong>: {new Date(formSaved.dateCreated).toLocaleString()}
						</Typography>
						{formSaved.dateModified && <Typography className={classes.label}>
							<strong>{systemLocaleMap[locale].date_modified}</strong>: {new Date(formSaved.dateModified).toLocaleString()}
						</Typography>}
					</div>
					<div>
						<Link href={`/forms/${formSaved.sha}/${formSaved.id}`}><Button component="button">{systemLocaleMap[locale].form_menu_edit}</Button></Link>
						<Button 
							component="button" 
							aria-owns={anchorEl ? 'active-download-menu' : undefined}
							aria-haspopup="true"
							onClick={this.handleClick}
						>{systemLocaleMap[locale].download_title}</Button>
						<Button component="button" color="primary" onClick={this.handleDelete(formSaved)}>{systemLocaleMap[locale].delete}</Button>

						<Menu
							id={`active-download-menu-${i}`}
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={this.handleClose}
						>
							<ListItem button onClick={this.downloadHtml(formSaved)}>
								<ListItemText primary={systemLocaleMap[locale].html_name} />
							</ListItem>
							<ListItem button onClick={this.downloadPdf(formSaved)}>
								<ListItemText primary={systemLocaleMap[locale].pdf_name} />
							</ListItem>
							<ListItem button onClick={this.downloadDocx(formSaved)}>
								<ListItemText primary={systemLocaleMap[locale].docx_name} />
							</ListItem>
						</Menu>
					</div>
				</div>
			</Paper>
		)
	}

	renderAvailablePanel = (form, i) => {
		const { classes, locale, systemLocaleMap } = this.props

		return (
			<Paper key={i} className={classes.formPanel} square>
				<Typography className={classes.formPanelTitle} variant="h6">
					{form.filename.slice(2, form.filename.length - 4).replace(/-/g, " ")}
				</Typography>

				<div className={classes.formPanelButtonsWrapper}>
					<div></div>
					<Link href={`/forms/${form.sha}`}>
						<Button color="primary" onClick={this.checkLogin}>{systemLocaleMap[locale].message_body_form_new}</Button>
					</Link>
				</div>
			</Paper>
		)
	}

	render() {
		const { 
			classes, 
			locale, 
			systemLocaleMap, 
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
			<Layout title={`${systemLocaleMap[locale].app_name} | ${systemLocaleMap[locale].form_title}`} description="Umbrella web application">
				<div className={classes.content}>
					{!!formsSorted.active.length &&
						<React.Fragment>
							<Typography className={classes.label} variant="subtitle1">{systemLocaleMap[locale].form_title}</Typography>
							{formsSorted.active.map(this.renderActivePanel)}
						</React.Fragment>
					}

					<Typography className={classes.label} variant="subtitle1">{systemLocaleMap[locale].message_title_all_forms}</Typography>
					{content[locale].forms.content
						.filter(form => form.filename.indexOf('f_') === 0)
						.map(this.renderAvailablePanel)
					}

					{!!formsSorted.filled.length &&
						<React.Fragment>
							<Typography className={classes.label} variant="subtitle1">{systemLocaleMap[locale].message_title_active_forms}</Typography>
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