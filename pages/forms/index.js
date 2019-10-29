import React from 'react'
import Link from 'next/link'
import marked from 'marked'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import Collapse from '@material-ui/core/Collapse'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ShareIcon from '@material-ui/icons/Share'
import GetAppIcon from '@material-ui/icons/GetApp'
import LinkIcon from '@material-ui/icons/Link'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'

import { getForm, deleteForm } from '../../store/actions/forms'
import { setAppbarTitle, openAlert } from '../../store/actions/view'

import { contentStyles, paperStyles, buttonWrapperStyles } from '../../utils/view'
import { generateForm } from '../../utils/forms'
import { downloadPdf, downloadHtml, downloadDocx } from '../../utils/dom'
import { decodeBlob } from '../../utils/github'

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
		activeAnchorEl: null,
		newAnchorEl: null,
		downloadOpen: false,
		tooltipOpen: false,
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
	
	handleCopyLink = () => {
		const { dispatch, locale, systemLocaleMap } = this.props

		if (typeof document === 'undefined') return false

		if (!document.queryCommandSupported('copy')) {
			dispatch(openAlert('error', systemLocaleMap[locale].browser_unsupported))
			return false
		}

		this.copyInput.focus()
		this.copyInput.select()

		if (document.execCommand('copy')) {
			this.setState({tooltipOpen: true}, () => {
				setTimeout(() => {
					this.setState({tooltipOpen: false})
				}, 1500)
			})
		}
	}
	
	toggleDownloadList = () => {
		this.setState({downloadOpen: !this.state.downloadOpen})
	}

	downloadNewFormHtml = (form) => () => {
		const { dispatch, locale, systemLocaleMap } = this.props

		dispatch(openAlert('info', systemLocaleMap[locale].downloading_html))

		fetch(`${process.env.ROOT}/api/github/content/${form.sha}`)
			.then(res => {
				if (!res.ok) throw res
				return res.text()
			})
			.then(content => {
				downloadHtml(form.filename.slice(2, form.filename.length - 4), marked(decodeBlob(content)))
				dispatch(openAlert('success', systemLocaleMap[locale].downloaded))
				this.setState({ newAnchorEl: null })
			})
			.catch(err => {
				console.error('downloadNewFormHtml error: ', err)
				dispatch(openAlert('error', systemLocaleMap[locale].general_error))
			})
	}

	downloadNewFormPdf = (form) => () => {
		const { dispatch, locale, systemLocaleMap } = this.props

		dispatch(openAlert('info',systemLocaleMap[locale].downloading_pdf))

		fetch(`${process.env.ROOT}/api/github/content/${form.sha}`)
			.then(res => {
				if (!res.ok) throw res
				return res.text()
			})
			.then(content => {
				downloadPdf(form.filename.slice(2, form.filename.length - 4), marked(decodeBlob(content)))
				dispatch(openAlert('success', systemLocaleMap[locale].downloaded))
				this.setState({ newAnchorEl: null })
			})
			.catch(err => {
				console.error('downloadNewFormPdf error: ', err)
				dispatch(openAlert('error', systemLocaleMap[locale].general_error))
			})
	}

	downloadNewFormDocx = (form) => () => {
		const { dispatch, locale, systemLocaleMap } = this.props

		dispatch(openAlert('info', systemLocaleMap[locale].downloading_docx))

		fetch(`${process.env.ROOT}/api/github/content/${form.sha}`)
			.then(res => {
				if (!res.ok) throw res
				return res.text()
			})
			.then(content => {
				downloadDocx(form.filename.slice(2, form.filename.length - 4), marked(decodeBlob(content)))
				dispatch(openAlert('success', systemLocaleMap[locale].downloaded))
				this.setState({ newAnchorEl: null })
			})
			.catch(err => {
				console.error('downloadNewFormDocx error: ', err)
				dispatch(openAlert('error', systemLocaleMap[locale].general_error))
			})
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
		const { activeAnchorEl } = this.state

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
							aria-owns={activeAnchorEl ? 'active-download-menu' : undefined}
							aria-haspopup="true"
							onClick={e => this.setState({ activeAnchorEl: e.currentTarget })}
						>{systemLocaleMap[locale].download_title}</Button>
						<Button component="button" color="primary" onClick={this.handleDelete(formSaved)}>{systemLocaleMap[locale].delete}</Button>

						<Menu
							id={`active-download-menu-${i}`}
							anchorEl={activeAnchorEl}
							open={Boolean(activeAnchorEl)}
							onClose={() => this.setState({ activeAnchorEl: null })}
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
		const { newAnchorEl, downloadOpen, tooltipOpen } = this.state

		const url = `${process.env.ROOT}/forms/${form.sha}`

		return (
			<Paper key={i} className={classes.formPanel} square>
				<Typography className={classes.formPanelTitle} variant="h6">
					{form.filename.slice(2, form.filename.length - 4).replace(/-/g, " ")}
				</Typography>

				<div className={classes.formPanelButtonsWrapper}>
					<div></div>
					<div>
						<Button 
							size="small" 
							className={classes.cardActionIcon} 
							aria-owns={newAnchorEl ? 'share-menu' : undefined}
							aria-haspopup="true"
							onClick={e => this.setState({ newAnchorEl: e.currentTarget })}
						>
							<ShareIcon />
						</Button>
						<Link href={`/forms/${form.sha}`}>
							<Button color="primary" onClick={this.checkLogin}>{systemLocaleMap[locale].message_body_form_new}</Button>
						</Link>
						<Menu
							id="share-menu"
							anchorEl={newAnchorEl}
							open={Boolean(newAnchorEl)}
							onClose={() => this.setState({ newAnchorEl: null })}
						>
							<ListItem button onClick={this.toggleDownloadList}>
								<ListItemIcon>
									<GetAppIcon />
								</ListItemIcon>
								<ListItemText inset primary={systemLocaleMap[locale].download_title} />

								{downloadOpen ? <ExpandLess /> : <ExpandMore />}
							</ListItem>

							<Collapse in={downloadOpen} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									<ListItem button onClick={this.downloadNewFormHtml(form)}>
										<ListItemText primary="HTML" />
									</ListItem>
									<ListItem button onClick={this.downloadNewFormPdf(form)}>
										<ListItemText primary="PDF" />
									</ListItem>
									<ListItem button onClick={this.downloadNewFormDocx(form)}>
										<ListItemText primary="DOCX" />
									</ListItem>
								</List>
							</Collapse>

							{Boolean(url) && <Tooltip
								open={tooltipOpen}
								title={systemLocaleMap[locale].copied}
								placement="right"
							>
								<ListItem onClick={this.handleCopyLink}>
									<ListItemIcon>
										<LinkIcon />
									</ListItemIcon>
									<ListItemText inset primary={systemLocaleMap[locale].copy_link} />
									<input 
										ref={el => this.copyInput = el} 
										className={classes.copyInput} 
										type="text"
										tabIndex="-1" 
										aria-hidden="true" 
										defaultValue={url}
									/>
								</ListItem>
							</Tooltip>}
						</Menu>
					</div>
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

		return (
			<Layout title={`${systemLocaleMap[locale].app_name} | ${systemLocaleMap[locale].form_title}`} description="Umbrella web application">
				<div className={classes.content}>
					{!!formsSaved.length &&
						<React.Fragment>
							<Typography className={classes.label} variant="subtitle1">{systemLocaleMap[locale].form_title}</Typography>
							{formsSaved.map(this.renderActivePanel)}
						</React.Fragment>
					}

					<Typography className={classes.label} variant="subtitle1">{systemLocaleMap[locale].message_title_all_forms}</Typography>
					{content[locale].forms.content
						.filter(form => form.filename.indexOf('f_') === 0)
						.map(this.renderAvailablePanel)
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