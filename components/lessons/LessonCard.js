import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import CloseIcon from '@material-ui/icons/Close';

import Layout from '../../components/layout';
import Loading from '../../components/reusables/Loading';
import ErrorMessage from '../../components/reusables/ErrorMessage';
import Marked from '../../components/reusables/Marked';

import { contentStyles, paperStyles } from '../../utils/view';

import { closeLessonFile } from '../../store/actions/lessons';
import { toggleLessonFileView } from '../../store/actions/view';

const styles = theme => ({
	...contentStyles(theme),
	paper: {
		...paperStyles(theme),
	},
	lessonClose: {
		position: 'absolute',
		top: '1rem',
		right: '1rem',
	},
});

class LessonCard extends React.Component {
	closeLesson = () => {
		this.props.dispatch(closeLessonFile());
		this.props.dispatch(toggleLessonFileView(false));
	}

	renderContent = () => {
		const { currentLessonFile, getLessonFileLoading, getLessonFileError } = this.props;

		if (getLessonFileLoading) return <Loading />;
		else if (getLessonFileError) return <ErrorMessage error={getLessonFileError} />;
		return <Marked content={atob(currentLessonFile)} />;
	}

	render() {
		const { classes, currentLessonFile, getLessonFileLoading, getLessonFileError } = this.props;


		return (
			<Paper className={classes.paper}>
				<Button className={classes.lessonClose} size="small" onClick={this.closeLesson}>
					<CloseIcon />
				</Button>
				
				{this.renderContent()}
			</Paper>
		);
	}
}

const mapStateToProps = state => ({
	...state.lessons,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonCard));