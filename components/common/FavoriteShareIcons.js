import 'isomorphic-unfetch'
import React from 'react'
import atob from 'atob'
import marked from 'marked'
import { connect } from 'react-redux'

import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import BookmarkIcon from '@material-ui/icons/Bookmark'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share'
import GetAppIcon from '@material-ui/icons/GetApp'
import LinkIcon from '@material-ui/icons/Link'

import teal from '@material-ui/core/colors/teal'
import yellow from '@material-ui/core/colors/yellow'

import { openAlert } from '../../store/actions/view'

import { download, downloadHtml, downloadDocx } from '../../utils/dom'
import { decodeBlob } from '../../utils/github'

const styles = theme => ({
	cardActionIcon: {
		color: theme.palette.grey[600],
	},
	cardActionIconWhite: {
		color: theme.palette.common.white,
	},
	cardActionIconYellow: {
		color: yellow[500],
	},
	cardActionIconTeal: {
		color: teal[500],
	},
	copyInput: {
		maxWidth: '10rem',
	},
})

class FavoriteShareIcon extends React.Component {
	state = {
		anchorEl: null,
		tooltipOpen: false,
		downloadOpen: false,
	}

	handleClick = e => this.setState({ anchorEl: e.currentTarget })

	handleClose = () => this.setState({ anchorEl: null })

	handleCopyLink = () => {
		const { dispatch } = this.props

		if (typeof document === 'undefined') return false

		if (!document.queryCommandSupported('copy')) {
			dispatch(openAlert('error', 'This is not supported by your browser.'))
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

	downloadHtml = () => {
		const { dispatch, name, sha } = this.props

		dispatch(openAlert('warning', 'Downloading HTML...'))

		fetch(`${process.env.ROOT}/api/github/content/${sha}`)
			.then(res => {
				if (!res.ok) throw res
				return res.text()
			})
			.then(content => {
				download(name, marked(decodeBlob(content)))
				dispatch(openAlert('success', 'Downloaded'))
				this.handleClose()
			})
			.catch(err => {
				console.error('FavoriteShareIcons handleDownload error: ', err)
				dispatch(openAlert('error', 'Something went wrong - refresh the page and try again'))
			})
	}

	downloadPdf = () => {
		const { dispatch, name, sha } = this.props

		dispatch(openAlert('info', 'Downloading PDF...'))

		fetch(`${process.env.ROOT}/api/github/content/${sha}`)
			.then(res => {
				if (!res.ok) throw res
				return res.text()
			})
			.then(content => {
				download(name, marked(decodeBlob(content)))
				dispatch(openAlert('success', 'Downloaded'))
				this.handleClose()
			})
			.catch(err => {
				console.error('FavoriteShareIcons handleDownload error: ', err)
				dispatch(openAlert('error', 'Something went wrong - refresh the page and try again'))
			})
	}

	downloadDocx = () => {
		const { dispatch, name, sha } = this.props

		dispatch(openAlert('info', 'Downloading DOCX...'))

		fetch(`${process.env.ROOT}/api/github/content/${sha}`)
			.then(res => {
				if (!res.ok) throw res
				return res.text()
			})
			.then(content => {
				downloadDocx(name, marked(decodeBlob(content)))
				dispatch(openAlert('success', 'Downloaded'))
				this.handleClose()
			})
			.catch(err => {
				console.error('FavoriteShareIcons handleDownload error: ', err)
				dispatch(openAlert('error', 'Something went wrong - refresh the page and try again'))
			})		
	}

	render() {
		const { classes, isFavorited, isFavoriteAdded, isLight, url, onFavoriteToggle, onFavoriteRemove } = this.props
		const { anchorEl, tooltipOpen, downloadOpen } = this.state

		return (
			<React.Fragment>
				{isFavorited
					? <Button 
						size="small" 
						className={classNames(
							classes.cardActionIcon, 
							isLight 
								? classes.cardActionIconWhite 
								: null
						)} 
						onClick={onFavoriteRemove}
					>
						<DeleteIcon />
					</Button>
					: <Button 
						size="small" 
						className={classNames(
							classes.cardActionIcon, 
							isLight 
								? classes.cardActionIconWhite 
								: null,
							isFavoriteAdded
								? isLight 
									? classes.cardActionIconYellow
									: classes.cardActionIconTeal
								: null
						)} 
						onClick={onFavoriteToggle}
					>
						<BookmarkIcon />
					</Button>
				}
				<Button 
					size="small" 
					className={classNames(
						classes.cardActionIcon,
						isLight 
							? classes.cardActionIconWhite 
							: null
					)} 
					aria-owns={anchorEl ? 'share-menu' : undefined}
					aria-haspopup="true"
					onClick={this.handleClick}
				>
					<ShareIcon />
				</Button>

				<Menu
					id="share-menu"
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={this.handleClose}
				>
					<ListItem button onClick={this.toggleDownloadList}>
						<ListItemIcon className={classes.menuListItemIcon}>
							<GetAppIcon />
						</ListItemIcon>
						<ListItemText className={classes.menuListItemText} inset primary="Download" />

						{downloadOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItem>

					<Collapse in={downloadOpen} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem button onClick={this.downloadHtml}>
								<ListItemText primary="HTML" />
							</ListItem>
							<ListItem button onClick={this.downloadPdf}>
								<ListItemText primary="PDF" />
							</ListItem>
							<ListItem button onClick={this.downloadDocx}>
								<ListItemText primary="DOCX" />
							</ListItem>
						</List>
					</Collapse>

					{Boolean(url) && <Tooltip
						open={tooltipOpen}
						title="Copied!"
						placement="right"
					>
						<ListItem onClick={this.handleCopyLink}>
							<ListItemIcon>
								<LinkIcon />
							</ListItemIcon>
							<ListItemText inset primary="Copy Link" />
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

			</React.Fragment>
		)
	}
}

export default connect()(withStyles(styles)(FavoriteShareIcon))