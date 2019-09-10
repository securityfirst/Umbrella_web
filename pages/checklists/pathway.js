import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'

import Layout from '../../components/layout'
import FormControlCheckbox from '../../components/common/FormControlCheckbox'
import Marked from '../../components/common/Marked'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'

import { setAppbarTitle } from '../../store/actions/view'
import { getPathwayFile, updatePathwaysChecked, updatePathwaysSaved } from '../../store/actions/pathways'

import { contentStyles, paperStyles } from '../../utils/view'

const styles = theme => ({
	...contentStyles(theme),
	wrapper: {
		position: 'relative',
		display: 'flex',
		flex: 1,
		height: '100%',
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		margin: '-1rem -1rem 1rem',
		padding: '.5rem .5rem .5rem 1.5rem',
		backgroundColor: theme.palette.primary.main,
		[theme.breakpoints.up('md')]: {
			margin: '0 0 1rem',
		},
	},
	headerText: {
		fontSize: '1.25rem',
		fontWeight: 500,
		color: theme.palette.common.white,
	},
	favoriteIcon: {
		color: theme.palette.common.white,
	},
	itemPaper: {
		...paperStyles(theme),
		margin: '.5rem 0',
		padding: '1rem 1.5rem',
	},
})

class Pathway extends React.Component {
	static async getInitialProps({reduxStore, query}) {
		await reduxStore.dispatch(getPathwayFile(query.sha))
	}

	componentDidMount() {
		const { dispatch, locale, systemLocaleMap } = this.props
		dispatch(setAppbarTitle(systemLocaleMap[locale].checklist_title))
	}

	findMatchingPathway = pathways => {
		const { currentPathwayFile } = this.props

		return pathways.find(p => {
			if (p.filename === '.category.yml') return false

			// find file that matches current file title
			const name = p.filename.split('_')[1].split('.')[0].split('-').join(' ')
			return name === currentPathwayFile.title.toLowerCase()
		})
	}

	handleFavorite = e => {
		e.preventDefault()

		const { dispatch, content, locale } = this.props

		dispatch(updatePathwaysSaved(this.findMatchingPathway(content[locale].pathways.content)))
	}

	handleChecked = (item) => () => {
		const { dispatch, currentPathwayFile } = this.props

		dispatch(updatePathwaysChecked(currentPathwayFile.title, item))
	}

	render() {
		const { classes, locale, currentPathwayFile, pathwaysChecked, pathwaysSaved } = this.props
		const isFavorited = !!this.findMatchingPathway(pathwaysSaved)

		return (
			<Layout title={`${systemLocaleMap[locale].app_name} | Top Tips`} description="Umbrella web application">
				<div className={classes.wrapper}>
					<div className={classes.content}>
						<Paper className={classes.header} square>
							<Typography className={classes.headerText}>Top Tips: {currentPathwayFile.title}</Typography>
							<IconButton aria-label="Close" onClick={this.handleFavorite}>
								{isFavorited 
									? <StarIcon className={classes.favoriteIcon} /> 
									: <StarBorderIcon className={classes.favoriteIcon} />
								}
							</IconButton>
						</Paper>

						{currentPathwayFile.list.map((item, i) => {
							/* Format incoming url with web app url */
							let url = item.check.substring(item.check.lastIndexOf('(') + 1, item.check.lastIndexOf(')'))
							url = `/lessons/${locale}/` + url.split('umbrella://')[1].replace(/\//, '.')

							const itemFormatted = item.check.replace(/\(.*\)/, `(${url})`)

							const checked = !!(pathwaysChecked[currentPathwayFile.title] || [])
											.find(checkedItem => checkedItem === item.check)

							return (
								<Paper key={i} className={classes.itemPaper} square>
									<FormControlCheckbox
										key={i}
										name={<Marked content={itemFormatted} />}
										value={item.check}
										checked={checked}
										onChange={this.handleChecked(item)} 
									/>
								</Paper>
							)
						})}
					</div>
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.content,
	...state.view,
	...state.pathways,
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Pathway))