import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'

import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import PathwayPanel from './PathwayPanel'

import { dismissPathwayModal, openAlert } from '../../store/actions/view'

const styles = theme => ({
	modal: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		width: '100%',
		maxWidth: '32rem',
		padding: '2rem 0',
		backgroundColor: theme.palette.primary.main,
		[theme.breakpoints.down('sm')]: {
			height: '100%',
			maxHeight: '30rem',
			margin: '1rem',
		},
	},
	closeButton: {
		position: 'absolute',
		right: '1rem',
		top: '1rem',
		color: theme.palette.common.white,
	},
	panelsWrapper: {
		padding: '0 1rem',
	},
	panelWrapper: {
		position: 'relative',
	},
	panel: {
		width: '100%',
		margin: '.25rem 0',
		padding: '0 0 0 1rem',
		backgroundColor: theme.palette.common.white,
	},
	panelButtonInner: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	panelTitle: {
		color: theme.palette.grey[800],
		fontSize: '1.125rem',
		fontWeight: 'normal',
		textTransform: 'capitalize',
	},
	modalContentTitle: {
		paddingLeft: '1rem',
		fontSize: '1.25rem',
		fontWeight: 500,
		color: theme.palette.common.white,
	},
	modalContentDescription: {
		marginBottom: '.875rem',
		paddingLeft: '1rem',
		maxWidth: '80%',
		color: theme.palette.common.white,
	},
	showMeButton: {
		width: '100%',
		margin: '2rem 0 0',
		padding: '14px 16px',
		fontSize: '1rem',
		color: theme.palette.common.white,
		borderRadius: 0,
		boxShadow: 'none',
	},
	bottomText: {
		margin: '2rem 0 0',
		fontSize: '1rem',
		color: theme.palette.common.white,
		textTransform: 'uppercase',
		textAlign: 'center',
		cursor: 'pointer',
		'&:hover': {
			fontWeight: 500,
		}
	},
})

class PathwayModal extends React.Component {
	handleDismiss = () => {
		this.props.dispatch(dismissPathwayModal(false))
	}

	handleShowMe = () => {

	}

	render() {
		const { classes, content, locale, pathwayModalOpened } = this.props

		return (
			<Dialog
				className={classes.modal}
				aria-labelledby="pathway-modal-title"
				aria-describedby="pathway-modal-description"
				open={pathwayModalOpened}
				onClose={this.handleDismiss}
			>
				<Paper className={classes.modalContent} elevation={1}>
					<IconButton aria-label="Close" className={classes.closeButton} onClick={this.handleDismiss}>
						<CloseIcon />
					</IconButton>

					<div className={classes.panelsWrapper}>
						<Typography className={classes.modalContentTitle}>What do you need most?</Typography>
						<Typography className={classes.modalContentDescription}>Select a guide to start your security journey, or bookmark any guide for later.</Typography>
						{content[locale].pathways.content
							.sort(pathway => pathway.filename)
							.map((pathway, i) => {
								if (pathway.filename === '.category.yml') return null

								return <PathwayPanel key={i} pathway={pathway} />
							})
						}
					</div>

					<Button 
						className={classes.showMeButton}
						component="button" 
						variant="contained" 
						color="secondary"
						onClick={this.handleShowMe}
					>
						Show Me
					</Button>

					<Typography
						className={classes.bottomText}
						paragraph
						onClick={this.handleDismiss}
					>No thanks, I'll explore on my own</Typography>
				</Paper>
			</Dialog>
		)
	}
}

const mapStateToProps = state => ({
	...state.content,
	...state.view,
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(PathwayModal)))