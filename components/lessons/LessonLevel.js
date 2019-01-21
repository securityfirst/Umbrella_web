import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ShareIcon from '@material-ui/icons/Share';

import Layout from '../../components/layout';
import Loading from '../../components/reusables/Loading';
import ErrorMessage from '../../components/reusables/ErrorMessage';

import { contentStyles } from '../../utils/view';

import { getLessonFile } from '../../store/actions/lessons';
import { setLessonFileView } from '../../store/actions/view';

const styles = theme => ({
	...contentStyles(theme),
	cardsWrapper: {
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
	},
	card: {
		margin: '1rem 0',
		[theme.breakpoints.up('sm')]: {
			width: '22%',
			margin: '.5rem',
		},
	},
	cardHead: {
		padding: '1rem',
		backgroundColor: theme.palette.primary.main,
		[theme.breakpoints.up('sm')]: {
			minHeight: '10rem',
		},
	},
	cardTitle: {
		display: 'block',
		color: 'white',
		fontSize: '1.25rem',
		lineHeight: 1,
		textTransform: 'capitalize',
		[theme.breakpoints.up('sm')]: {
			fontSize: '1.5rem',
		},
	},
	cardActions: {
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
			justifyContent: 'space-between',
		},
	},
	cardActionIcon: {
		color: theme.palette.grey[600],
	},
	lessonClose: {
		position: 'absolute',
		top: '1rem',
		right: '1rem',
	},
});

class LessonLevel extends React.Component {
	state = {
		fileSelected: null,
	}

	getLessonFile = sha => () => {
		this.props.dispatch(setLessonFileView());
		this.props.dispatch(getLessonFile(sha));
	}

	renderCard = (file, i) => {
		const { classes } = this.props;
		const title = file.name.slice(2).replace(/\.md/, '').replace(/-/g, ' ');

		return (
			<Card key={i} className={classes.card}>
				<CardActionArea onClick={this.getLessonFile(file.sha)}>
					<CardContent className={classes.cardHead}>
						<Typography className={classes.cardTitle}>{i+1}</Typography>
						<Typography className={classes.cardTitle}>{title}</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions classes={{root: classes.cardActions}}>
					<Button size="small" className={classes.cardActionIcon}><BookmarkIcon /></Button>
					<Button size="small" className={classes.cardActionIcon}><ShareIcon /></Button>
				</CardActions>
			</Card>
		);
	}

	render() {
		const { classes, currentLesson } = this.props;

		return (
			<React.Fragment>
				<div className={classes.cardsWrapper}>
					{currentLesson.files.map(this.renderCard)}
				</div>

				{currentLesson.checklist
					? <div>Yes checklist</div>
					: <div>No checklist</div>
				}
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	...state.lessons,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonLevel));