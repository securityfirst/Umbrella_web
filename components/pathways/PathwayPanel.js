import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'

import { updatePathwaysSaved } from '../../store/actions/pathways'

import { getNameFromFilenameYml } from '../../utils/github'

const styles = theme => ({
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
})

class PathwayPanel extends React.Component {
	handleFavorite = pathway => e => {
		e.preventDefault()

		this.props.dispatch(updatePathwaysSaved(pathway))
	}

	render() {
		const { classes, locale, pathwaysSaved, pathway } = this.props
		const pathwayName = getNameFromFilenameYml(pathway.filename)
		const isFavorited = pathwaysSaved.find(p => p.filename === pathway.filename)

		return (
			<div className={classes.panelWrapper}>
				<Link href={`/checklists/pathway/${pathway.sha}`}>
					<Button
						className={classes.panel}
						classes={{label: classes.panelButtonInner}}
						variant="contained"
					>
						<Typography className={classes.panelTitle}>{pathwayName}</Typography>

						<IconButton aria-label="Close" onClick={this.handleFavorite(pathway)}>
							{isFavorited ? <StarIcon /> : <StarBorderIcon />}
						</IconButton>
					</Button>
				</Link>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.pathways,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(PathwayPanel))