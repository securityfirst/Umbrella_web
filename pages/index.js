import React from 'react'
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
	footerText: {
	    margin: '.25rem 0',
		fontSize: '.75rem',
	},
})

class Index extends React.Component {
	static async getInitialProps({reduxStore}) {
		await reduxStore.dispatch(setAppbarTitle('Home'))
	}

	render() {
		const { classes } = this.props

		return (
			<Layout title="Umbrella | Home" description="Umbrella web application">
				<div className={classes.content}>
					<Paper className={classes.paper} elevation={1}>
						<div className={classes.headerWrapper}>
							<img className={classes.logo} src="/static/assets/images/umbrella_logo.png" alt="Umbrella logo"/>
							<Typography className={classes.header} variant="h1">Welcome to Umbrella</Typography>
						</div>
						
						<Typography paragraph>
							Make a better security plan. Stay safe at home and in the field with the latest security advice. 
							Open source code trusted by journalists, activists, humanitarians. 
						</Typography>
						<Typography paragraph>
							Umbrella is your one stop shop for digital and physical security information, plus resources to 
							manage team security on a budget. Umbrella helps you identify and respond to threats you face 
							whenever you work, communicate, or travel. Get simple instructions to reduce your risk, even offline. 
							Then make sure you act on them by following one of our checklists, or creating your own. Adapt your 
							plans based on live threat alerts from trusted sources, or share incident forms with your team. 
							Umbrella’s secure infrastructure is perfect for NGOs and people at risk, because it’s funded through 
							grants and paid security training. All content and code is free to reuse under licence conditions. 
							You can even customise the content, or add your own. Ask how at <a href="mailto:info@secfirst.org" target="_blank">info@secfirst.org</a>. 
						</Typography>

						<Divider className={classes.divider} />

						<Typography className={classes.title} variant="h2">What you can do with Umbrella</Typography>
						<Typography>
							<ul className={classes.list}>
								<li>Protect yourself with lessons covering dozens of everyday and emergency situations, from sending a secure message to travelling safely in a dangerous country</li>
								<li>Protect devices and data with simple step-by-step guides to digital security tools</li>
								<li>Protect your team with shareable checklists and incident forms</li>
								<li>Measure your progress on the dashboard</li>
								<li>Monitor threats with location-based alerts from UN ReliefWeb, Centers for Disease Control, US State Department and more</li>
								<li>Stay current with sources you trust through custom RSS feeds</li>
								<li>Put your own security manual in Umbrella by forking our GitHub repo and loading yours</li>
								<li>Much more to come. What do you need to stay secure? Tell us at <a href="mailto:feedback@secfirst.org" target="_blank">feedback@secfirst.org</a></li>
							</ul>
						</Typography>

						<Divider className={classes.divider} />

						<Typography className={classes.title} variant="h2">How we help protect you</Typography>
						<Typography>
							<ul className={classes.list}>
								<li>Password encrypts data on your device, we can’t access it</li>
								<li>You enter your location, no GPS or data sharing - we don’t store your data</li>
								<li>We welcome edits, issues, and responsible disclosure</li>
								<li>Security advice sourced from EFF, Tactical Tech, Frontline Defenders, CPJ, ECHO, Protection International, and more</li>
							</ul>
						</Typography>

						<Divider className={classes.divider} />

						<Typography className={classes.footerText} paragraph>
							Our content is published under a Creative Commons licence, so feel free to reuse it. Check or 
							contribute to content and code: <a href="https://github.com/securityfirst" target="_blank">https://github.com/securityfirst</a>
						</Typography>

						<Typography className={classes.footerText} paragraph>
							Terms: <a href="https://secfirst.org/terms/" target="_blank">https://secfirst.org/terms/</a>
						</Typography>

						<Typography className={classes.footerText} paragraph>
							Privacy: <a href="https://secfirst.org/privacy/" target="_blank">https://secfirst.org/privacy/</a>
						</Typography>
					</Paper>
				</div>
			</Layout>
		)
	}
}

export default withStyles(styles, {withTheme: true})(Index)