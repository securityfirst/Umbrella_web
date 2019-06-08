import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'

import Layout from '../../components/layout'
import FormControlCheckbox from '../../components/common/FormControlCheckbox'
import Marked from '../../components/common/Marked'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { setAppbarTitle } from '../../store/actions/view'
import { getPathwayFile, updatePathwaysChecked } from '../../store/actions/pathways'

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
		...paperStyles(theme),
		margin: '-1rem -1rem 1rem',
		padding: '1rem 1.5rem',
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
	itemPaper: {
		...paperStyles(theme),
		margin: '.5rem 0',
		padding: '1rem 1.5rem',
	},
})

class Checklists extends React.Component {
	static async getInitialProps({reduxStore, query}) {
		await reduxStore.dispatch(getPathwayFile(query.sha))
		await reduxStore.dispatch(setAppbarTitle(`Pathway Checklist`))
	}

	handleChecked = (item) => () => {
		const { dispatch, currentPathwayFile } = this.props

		dispatch(updatePathwaysChecked(currentPathwayFile.title, item))
	}

	render() {
		const { classes, currentPathwayFile, pathwaysChecked } = this.props

		return (
			<Layout title="Umbrella | Checklists" description="Umbrella web application">
				<div className={classes.wrapper}>
					<div className={classes.content}>
						<Paper className={classes.header} square>
							<Typography className={classes.headerText}>Top Tips: {currentPathwayFile.title}</Typography>
						</Paper>

						{currentPathwayFile.list.map((item, i) => {
							const checked = !!(pathwaysChecked[currentPathwayFile.title] || [])
											.find(checkedItem => checkedItem === item.check)

							return (
								<Paper className={classes.itemPaper} square>
									<FormControlCheckbox
										key={i}
										name={<Marked content={item.check} />}
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

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Checklists))