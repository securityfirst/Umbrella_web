import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import AddButton from '../../components/reusables/AddButton'

import { getRss } from '../../store/actions/feeds'

const styles = theme => ({

})

class FeedsRss extends React.Component {
	componentWillMount() {
		this.props.dispatch(getRss())
	}

	handleAddRss = () => {

	}

	render() {
		const { classes, rss } = this.props

		console.log("rss: ", rss);

		return (
			<div>
				<Typography paragraph>
					<strong>FEEDS RSS</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
					incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
					elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
					hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
					velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
					Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
					viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
					Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
					at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
					ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
				</Typography>
				
				<AddButton onClick={this.handleAddRss} />
			</div>
		)
	}
}

const mapStateToProps = state => ({
	...state.feeds
})

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(FeedsRss))