import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import Layout from '../components/layout'

import { contentStyles } from '../utils/view'

import { setAppbarTitle } from '../store/actions/view'

const styles = theme => ({
	...contentStyles(theme, {
		[theme.breakpoints.down('sm')]: {
			backgroundColor: theme.palette.common.white,
		}
	}),
	paper: {
		position: 'relative',
		padding: '1rem 0 1.5rem',
		[theme.breakpoints.down('sm')]: {
			boxShadow: 'none',
		},
		[theme.breakpoints.up('sm')]: {
			padding: '1.5rem 2rem 2rem',
		},
	},
	headerWrapper: {
		display: 'flex',
		alignItems: 'center',
		marginTop: '1rem',
		marginBottom: '2rem',
	},
	logo: {
		display: 'block',
		maxWidth: '3rem',
		marginRight: '1rem',
	},
	header: {
		fontSize: '1.75rem',
		[theme.breakpoints.up('sm')]: {
			fontSize: '2rem',
		},
	},
	title: {
		margin: '1rem 0',
		fontSize: '1.25rem',
		[theme.breakpoints.up('sm')]: {
			margin: '2rem 0',
			fontSize: '1.5rem',
		},
	},
	list: {
		paddingLeft: '1rem',
	},
	divider: {
		margin: '2rem 0',
	},
	footerLinks: {
	    margin: '.25rem 0',
	},
})

class Index extends React.Component {
	componentDidMount() {
		const { dispatch, locale, systemLocaleMap } = this.props
		dispatch(setAppbarTitle(systemLocaleMap[locale].app_name))
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.locale !== this.props.locale) {
			this.props.dispatch(setAppbarTitle(nextProps.systemLocaleMap[nextProps.locale].app_name))
		}
	}

	render() {
		const { classes, locale, systemLocaleMap } = this.props

		return (
			<Layout title={systemLocaleMap[locale].app_name} description="Umbrella web application">
				<div className={classes.content}>
					<Paper className={classes.paper} elevation={1}>
						<div className={classes.headerWrapper}>
							<img className={classes.logo} src="/static/assets/images/umbrella_logo.png" alt="Umbrella logo"/>
							<Typography className={classes.header} variant="h1">{systemLocaleMap[locale].welcome_to_umbrella}</Typography>
						</div>
						
						<Typography paragraph>
							{systemLocaleMap[locale].welcome_paragraph_one}
						</Typography>
						<Typography paragraph>
							{systemLocaleMap[locale].welcome_paragraph_two} <a href="mailto:info@secfirst.org" target="_blank">info@secfirst.org</a>. 
						</Typography>

						<Divider className={classes.divider} />

						<Typography className={classes.title} variant="h2">{systemLocaleMap[locale].welcome_subtitle_one}</Typography>
						<Typography component="div">
							<ul className={classes.list}>
								<li>{systemLocaleMap[locale].welcome_listitem_one}</li>
								<li>{systemLocaleMap[locale].welcome_listitem_two}</li>
								<li>{systemLocaleMap[locale].welcome_listitem_three}</li>
								<li>{systemLocaleMap[locale].welcome_listitem_four}</li>
								<li>{systemLocaleMap[locale].welcome_listitem_five}</li>
								<li>{systemLocaleMap[locale].welcome_listitem_six}</li>
								<li>{systemLocaleMap[locale].welcome_listitem_seven}</li>
								<li>{systemLocaleMap[locale].welcome_listitem_eight} <a href="mailto:feedback@secfirst.org" target="_blank">feedback@secfirst.org</a></li>
							</ul>
						</Typography>

						<Divider className={classes.divider} />

						<Typography className={classes.title} variant="h2">{systemLocaleMap[locale].welcome_subtitle_two}</Typography>
						<Typography component="div">
							<ul className={classes.list}>
								<li>{systemLocaleMap[locale].welcome_listitem_nine}</li>
								<li>{systemLocaleMap[locale].welcome_listitem_ten}</li>
								<li>{systemLocaleMap[locale].welcome_listitem_eleven}</li>
								<li>{systemLocaleMap[locale].welcome_listitem_twelve}</li>
							</ul>
						</Typography>

						<Divider className={classes.divider} />

						<Typography variant="caption" paragraph>
							{systemLocaleMap[locale].welcome_paragraph_three} <a href="https://github.com/securityfirst" target="_blank">https://github.com/securityfirst</a>
						</Typography>

						<Typography className={classes.footerLinks} variant="caption" paragraph>
							{systemLocaleMap[locale].terms_conditions}: <a href="https://secfirst.org/terms/" target="_blank">https://secfirst.org/terms/</a>
						</Typography>

						<Typography className={classes.footerLinks} variant="caption" paragraph>
							{systemLocaleMap[locale].welcome_privacy_title}: <a href="https://secfirst.org/privacy/" target="_blank">https://secfirst.org/privacy/</a>
						</Typography>
					</Paper>
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = (state) => ({
	...state.view,
})

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(Index))