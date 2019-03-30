import 'isomorphic-unfetch'
import React from 'react'
import atob from 'atob'
import marked from 'marked'

import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';

import BookmarkIcon from '@material-ui/icons/Bookmark'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share'
import GetAppIcon from '@material-ui/icons/GetApp'
import LinkIcon from '@material-ui/icons/Link'

import teal from '@material-ui/core/colors/teal'
import yellow from '@material-ui/core/colors/yellow'

import { download } from '../../utils/dom'

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
	}

	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget })
	}

	handleClose = () => {
		this.setState({ anchorEl: null })
	}

	handleDownload = () => {
		const { name, sha } = this.props

		fetch(`${process.env.ROOT}/api/github/content/${sha}`)
			.then(res => {
				if (!res.ok) throw res
				return res.text()
			})
			.then(content => {
				download(name, marked(atob(content)))
			})
			.catch(err => {
				console.error('FavoriteShareIcons handleDownload error: ', err)
				alert('Something went wrong. Please refresh the page and try again.')
			})
	}

	handleCopyLink = () => {
		if (typeof document === 'undefined') return false

		if (!document.queryCommandSupported('copy')) {
			alert('This is not supported by your browser.')
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

	render() {
		const { classes, isFavorited, isFavoriteAdded, isLight, url, onFavoriteToggle, onFavoriteRemove } = this.props
		const { anchorEl, tooltipOpen } = this.state

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
					<MenuItem onClick={this.handleDownload}>
						<ListItemIcon>
							<GetAppIcon />
						</ListItemIcon>
						<ListItemText inset primary="Download" />
					</MenuItem>
					{Boolean(url) && <Tooltip
						open={tooltipOpen}
						title="Copied!"
						placement="right"
					>
						<MenuItem onClick={this.handleCopyLink}>
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
						</MenuItem>
					</Tooltip>}
				</Menu>

			</React.Fragment>
		)
	}
}

export default withStyles(styles)(FavoriteShareIcon)