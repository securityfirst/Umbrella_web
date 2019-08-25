export const contentStyles = (theme, options = {}) => ({
	content: {
		width: '100%',
		maxWidth: '50rem',
		margin: '0 auto',
		padding: '1rem',
		[theme.breakpoints.up('sm')]: {
			padding: '2rem',
			maxHeight: 'calc(100vh - 48px)',
			overflow: 'auto',
			'-webkit-overflow-scrolling': 'touch',
		},
		...options
	},
})

export const paperStyles = (theme) => ({
	...theme.mixins.gutters(),
	paddingTop: theme.spacing.unit * 2,
	paddingBottom: theme.spacing.unit * 2,
})

export const buttonWrapperStyles = (theme) => ({
	display: 'flex',
	justifyContent: 'flex-end',
	flexDirection: 'row',
})

export const viewConstants = {
	drawerWidth: 200,
	drawerIconWidth: theme => theme.spacing.unit * 7 + 1
}