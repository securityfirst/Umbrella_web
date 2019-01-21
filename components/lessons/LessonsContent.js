import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import yellow from '@material-ui/core/colors/yellow';

import { paperStyles, buttonWrapperStyles } from '../../utils/view';

import { setLesson } from '../../store/actions/lessons';

const styles = theme => ({
	breadcrumb: {
		color: theme.palette.grey[500],
		fontSize: '.875rem',
		textTransform: 'capitalize',
	},
	panel: {
		width: '100%',
		margin: '.75rem 0',
		borderRadius: 2,
		cursor: 'pointer',
		...paperStyles(theme),
		'&:hover': {
			opacity: .8,
		}
	},
	panelTitle: {
		justifyContent: 'flex-start',
		color: theme.palette.common.white,
		fontSize: '1.5rem',
		fontWeight: 400,
		textTransform: 'capitalize',
	},
	beginner: {
		backgroundColor: theme.palette.secondary.main,
		'&:hover': {
			backgroundColor: theme.palette.secondary.main,
		}
	},
	advanced: {
		backgroundColor: yellow[700],
		'&:hover': {
			backgroundColor: yellow[700],
		}
	},
	expert: {
		backgroundColor: theme.palette.primary.main,
		'&:hover': {
			backgroundColor: theme.palette.primary.main,
		}
	},
});

const levelsOrder = ['beginner', 'advanced', 'expert'];

class LessonsContent extends React.Component {
	setLesson = (level) => () => {
		const { dispatch, lessonsContentPath } = this.props;

		dispatch(setLesson(lessonsContentPath.split('.').concat([level])));
	}

	renderLevels = () => {
		const { classes, lessons, lessonsContentPath, locale } = this.props;

		const levels = Object.keys(get(lessons, `${locale}.${lessonsContentPath}`));

		levels.sort(function(x, y) {
			if (levelsOrder.indexOf(x) < levelsOrder.indexOf(y)) return -1;
			if (levelsOrder.indexOf(x) > levelsOrder.indexOf(y)) return 1;
			return 0;
		});

		return (
			<div>
				<Typography className={classes.breadcrumb} variant="subtitle1">{lessonsContentPath.split(".").join(" > ").replace(/-/g, ' ')}</Typography>

				{levels.map((level, i) => {
					if (level === "content") return null;

					return (
						<Button
							key={i}
							className={classNames(classes.panel, classes[level])}
							classes={{label: classes.panelTitle}}
							variant="contained"
							onClick={this.setLesson(level)}
						>
							{level}
						</Button>
					);
				})}
			</div>
		);
	}

	renderDefault = () => {
		return (
			<Typography paragraph>
				<strong>LESSON</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
				elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
				hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
				velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
				Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
				viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
				Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
				at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
				ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
			</Typography>
		);
	}

	render() {
		const { classes, lessonsContentType } = this.props;

		switch (lessonsContentType) {
			case 'levels': return this.renderLevels();
			default: return this.renderDefault();
		}
	}
}

const mapStateToProps = state => ({
	...state.view,
	...state.lessons,
});

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(LessonsContent));