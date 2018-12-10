export const contentStyles = theme => ({
	tabs: {
		backgroundColor: '#fdfdfd',
	},
	content: {
		maxWidth: '45rem',
		margin: '0 auto',
		padding: '1rem',
		[theme.breakpoints.up('sm')]: {
			padding: '2rem',
		}
	},
});