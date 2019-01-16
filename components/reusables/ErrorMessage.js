import Typography from '@material-ui/core/Typography';

const Text = props => (
	<Typography color="error" variant="body1">{props.children}</Typography>
)

const ErrorMessage = props => {
	if (!props.error || !props.error.message) return <Text>Something went wrong.</Text>
	return <Text>{props.error.message || JSON.stringify(props.error)}</Text>;
}

export default ErrorMessage;