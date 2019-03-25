import React from 'react'

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

import { copy } from '../../utils/dom'

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

	}

	handleCopyLink = () => {
		if (copy(this.props.url)) {
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
						</MenuItem>
					</Tooltip>}
				</Menu>
			</React.Fragment>
		)
	}
}

export default withStyles(styles)(FavoriteShareIcon)