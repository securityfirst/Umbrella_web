import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ShareIcon from '@material-ui/icons/Share';
import CloseIcon from '@material-ui/icons/Close';

import Layout from '../../components/layout';
import Loading from '../../components/reusables/Loading';
import ErrorMessage from '../../components/reusables/ErrorMessage';
import Marked from '../../components/reusables/Marked';

import yellow from '@material-ui/core/colors/yellow';

import { contentStyles, paperStyles } from '../../utils/view';

import { getLessons, setLesson } from '../../store/actions/lessons';

const styles = theme => ({
	...contentStyles(theme),
	levelWrapper: {
		position: 'relative',
		[theme.breakpoints.down('sm')]: {
		    paddingTop: '1rem',
			paddingLeft: '1rem',
		},
	},
	level: {
		color: 'white',
		cursor: 'initial',
		[theme.breakpoints.up('sm')]: {
			position: 'absolute',
			top: '2rem',
			left: '2rem',
		}
	},
	beginner: {
		backgroundColor: theme.palette.secondary.main,
		'&.hover': {
			backgroundColor: theme.palette.secondary.main,
		},
	},
	advanced: {
		backgroundColor: yellow[700],
		'&.hover': {
			backgroundColor: yellow[700],
		},
	},
	expert: {
		backgroundColor: theme.palette.primary.main,
		'&.hover': {
			backgroundColor: theme.palette.primary.main,
		},
	},
	paper: {
		...paperStyles(theme),
		position: 'relative',
	},
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

class Lesson extends React.Component {
	static async getInitialProps({reduxStore, asPath}) {
		let paths = asPath.split("/");
		paths.splice(0, 2);
		await reduxStore.dispatch(getLessons());
		await reduxStore.dispatch(setLesson(paths));
	}

	state = {
		fileSelected: null,
	}

	renderFile = () => {
		const { classes, currentLesson } = this.props;
		const { fileSelected } = this.state;

		console.log("currentLesson.path + fileSelected: ", currentLesson.path + "/" + fileSelected);

		return (
			<Paper className={classes.paper}>
				<Button className={classes.lessonClose} size="small" onClick={() => this.setState({fileSelected: null})}>
					<CloseIcon />
				</Button>
				<Marked file={currentLesson.path + fileSelected} />
			</Paper>
		);
	}

	renderCard = (file, i) => {
		const { classes } = this.props;
		const title = file.slice(2).replace(/\.md/, '').replace(/-/g, ' ');

		return (
			<Card key={i} className={classes.card} onClick={() => this.setState({fileSelected: file})}>
				<CardActionArea>
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

	renderContent = () => {
		const { classes, currentLesson } = this.props;

		return (
			<React.Fragment>
				<div className={classes.levelWrapper}>
					<Fab 
						className={classNames(classes.level, classes[currentLesson.level])} 
						component="div"
						variant="extended"
						disableFocusRipple
						disableRipple
					>{currentLesson.level}</Fab>
				</div>

				<div className={classes.content}>
					<div className={classes.cardsWrapper}>
						{currentLesson.files.map(this.renderCard)}
					</div>
				</div>

				{currentLesson.checklist
					? <div>Yes checklist</div>
					: <div>No checklist</div>
				}
			</React.Fragment>
		);
	}

	render() {
		const { classes, setLessonLoading, setLessonError } = this.props;
		const { fileSelected } = this.state;

		let view;

		if (setLessonLoading) view = <Loading />;
		else if (setLessonError) view = <div className={classes.content}><ErrorMessage error={setLessonError} /></div>;
		else if (fileSelected) view = this.renderFile();
		else view = this.renderContent();

		return (
			<Layout title="Umbrella | Lesson" description="Umbrella web application">
				{view}
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
	...state.lessons,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true})(Lesson));