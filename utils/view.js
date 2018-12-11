export const contentStyles = (theme, options = {}) => ({
	content: {
		maxWidth: '50rem',
		margin: '0 auto',
		padding: '1rem',
		[theme.breakpoints.up('sm')]: {
			padding: '2rem',
		}
	},
	...options
});

export const viewConstants = {
	drawerWidth: 200,
	drawerIconWidth: theme => theme.spacing.unit * 7 + 1
};