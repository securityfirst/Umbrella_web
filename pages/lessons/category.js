import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'

import Layout from '../../components/layout'
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'

import { contentStyles } from '../../utils/view'

const styles = theme => ({
	...contentStyles(theme),
	wrapper: {
		position: 'relative',
		display: 'flex',
		flex: 1,
		height: '100%',
	},
})

class LessonsCategory extends React.Component {
	static async getInitialProps({reduxStore, query}) {
		await reduxStore.dispatch(getForm(query.sha))
	}

	render() {
		return (
			<Layout title="Umbrella | Lesson Category" description="Umbrella web application">
				<div className={classes.wrapper}>
					{!currentLesson && this.renderMenuList()}

					<div className={classes.content}>
						{(!!currentLesson && !!currentLesson.level) && this.renderLevel()}

						{this.renderContent()}
					</div>
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.lessons
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(LessonsCategory))