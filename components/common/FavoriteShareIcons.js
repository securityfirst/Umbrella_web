import React from 'react'

import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share'

import teal from '@material-ui/core/colors/teal'
import yellow from '@material-ui/core/colors/yellow'

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

const FavoriteShareIcon = props => {
	return (
		<React.Fragment>
			{props.isFavorited
				? <Button 
					size="small" 
					className={classNames(
						props.classes.cardActionIcon, 
						props.isLight 
							? props.classes.cardActionIconWhite 
							: null
					)} 
					onClick={props.onFavoriteRemove}
				>
					<DeleteIcon />
				</Button>
				: <Button 
					size="small" 
					className={classNames(
						props.classes.cardActionIcon, 
						props.isLight 
							? props.classes.cardActionIconWhite 
							: null,
						props.isFavoriteAdded
							? props.isLight 
								? props.classes.cardActionIconYellow
								: props.classes.cardActionIconTeal
							: null
					)} 
					onClick={props.onFavoriteAdd}
				>
					<BookmarkIcon />
				</Button>
			}
			<Button 
				size="small" 
				className={classNames(
					props.classes.cardActionIcon,
					props.isLight 
						? props.classes.cardActionIconWhite 
						: null
				)} 
				onClick={props.onShare}
			>
				<ShareIcon />
			</Button>
		</React.Fragment>
	)
}

export default withStyles(styles)(FavoriteShareIcon)