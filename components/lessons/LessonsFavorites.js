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

import { contentStyles, paperStyles } from '../../utils/view';

import { toggleLessonsFavoritesView } from '../../store/actions/view';

const styles = theme => ({
	...contentStyles(theme),
	paper: {
		position: 'relative',
		...paperStyles(theme),
	},
	title: {
		display: 'block',
		margin: '1rem 0',
		fontSize: '1.25rem',
		lineHeight: 1,
		textTransform: 'capitalize',
		[theme.breakpoints.up('sm')]: {
			fontSize: '1.5rem',
		},
	},
	lessonClose: {
		position: 'absolute',
		top: '.5rem',
		right: '.5rem',
		minWidth: '45px',
	},
});

class LessonsFavorites extends React.Component {
	closeFavorites = () => {
		this.props.dispatch(toggleLessonsFavoritesView(false));
	}

	render() {
		const { classes } = this.props;


		return (
			<Paper className={classes.paper}>
				<Button className={classes.lessonClose} size="small" onClick={this.closeFavorites}>
					<CloseIcon className={classes.lessonCloseIcon} />
				</Button>
				
				<Typography className={classes.title} variant="h2">Favorites</Typography>
			</Paper>
		);
	}
}

const mapStateToProps = state => ({
	...state.lessons,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true})(LessonsFavorites));