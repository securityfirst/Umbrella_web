import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import Loading from '../../components/reusables/Loading'
import ErrorMessage from '../../components/reusables/ErrorMessage'
import Marked from '../../components/reusables/Marked'
import AddButton from '../../components/reusables/AddButton'

import { contentStyles, paperStyles } from '../../utils/view'

import { getRss } from '../../store/actions/feeds'

const styles = theme => ({
	...contentStyles(theme),
	card: {
		margin: '.75rem 0',
		padding: 0,
		// ...paperStyles(theme),
	},
	cardContent: {
		padding: '1rem',
	},
	cardDescription: {
		margin: '.5rem 0 0',
		color: theme.palette.grey[600],
	},
	contentPanel: {
		margin: '.75rem 0',
		...paperStyles(theme),
	},
})

class FeedsRss extends React.Component {
	state = {
		sourceSelected: null,
	}

	componentWillMount() {
		this.props.dispatch(getRss())
	}

	handleAddRss = () => {

	}

	handleSourceClick = source => () => {
		this.setState({sourceSelected: source})
	}

	handleArticleClick = article => () => {
		const win = window.open(article.link, '_blank');
  		win.focus();
	}

	renderSource = (source, i) => {
		const { classes } = this.props

		return (
			<Card key={i} className={classes.card}>
				<CardActionArea onClick={this.handleSourceClick(source)}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6">{source.title}</Typography>
						<Typography className={classes.cardDescription} paragraph>{source.description}</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		)
	}

	renderArticle = (article, i) => {
		const { classes } = this.props

		return (
			<Card key={i} className={classes.card}>
				<CardActionArea onClick={this.handleArticleClick(article)}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6">{article.title}</Typography>
						<Typography className={classes.cardDescription} paragraph>{article.contentSnippet}</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		)
	}

	render() {
		const { classes, getRssLoading, getRssError, rss } = this.props
		const { sourceSelected } = this.state

		if (getRssLoading) return <div className={classes.content}><Loading /></div>
		if (getRssError) return <div className={classes.content}><ErrorMessage error={getRssError} /></div>

		if (sourceSelected) return (
			<div className={classes.content}>
				{sourceSelected.items.map(this.renderArticle)}
			</div>
		)

		return (
			<div className={classes.content}>
				{rss.map(this.renderSource)}
				
				<AddButton onClick={this.handleAddRss} />
			</div>
		)
	}
}

const mapStateToProps = state => ({
	...state.feeds
})

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(FeedsRss))