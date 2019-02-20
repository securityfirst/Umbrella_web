import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
	wrapper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 'calc(100% - 48px)',
		margin: '3rem auto',
	},
})

const Loading = (props) => {
	return (
		<div className={props.classes.wrapper}>
			<CircularProgress className={props.classes.loading} color="secondary" />
		</div>
	)
}

export default withStyles(styles)(Loading)