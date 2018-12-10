export const contentStyles = (theme, options = {}) => ({
	content: {
		maxWidth: '45rem',
		margin: '0 auto',
		padding: '1rem',
		[theme.breakpoints.up('sm')]: {
			padding: '2rem',
		}
	},
	...options
});