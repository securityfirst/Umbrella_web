import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Loading from '../../components/reusables/Loading';

import { paperStyles, buttonWrapperStyles } from '../../utils/view';

import { postForm } from '../../store/actions/forms';

const styles = theme => ({
	wrapper: {
		...paperStyles(theme),
	},
	hint: {
		color: theme.palette.grey[500],
	},
	copy: {
		margin: '2rem 0',
	},
	buttonsWrapper: {
		margin: '1rem 0 0',
		...buttonWrapperStyles(theme),
	},
});

class FormsNewSubmit extends React.Component {
	componentWillMount() {
		this.props.dispatch(postForm(this.props.forms));
	}

	removeError = () => this.setState({error: null, errorMessage: null})

	onGoBack = () => this.props.onGoBack({data: this.state.data})

	onSubmit = () => this.props.dispatch(postForm(this.props.forms))

	renderError = () => {
		const { classes, postFormError } = this.props;

		return (
			<div>
				<Typography className={classes.copy} paragraph><strong>Error [{postFormError.status}]</strong>{postFormError.message}</Typography>

				<div className={classes.buttonsWrapper}>
					<Button onClick={this.onGoBack}>Go Back</Button>
					<Button color="secondary" onClick={this.onSubmit}>Try Again</Button>
				</div>
			</div>
		);
	}

	renderSuccess = () => {
		const { classes } = this.props;

		return (
			<div>
				<Typography className={classes.copy} paragraph>Your form has been submitted.</Typography>

				<div className={classes.buttonsWrapper}>
					<Button href="/forms/new">Submit Another</Button>
					<Button href="/forms" color="secondary">Finish</Button>
				</div>
			</div>
		);
	}

	render() {
		const { classes, postFormLoading, postFormError, postFormSuccess } = this.props;

		return (
			<Paper className={classes.wrapper} square>
				<Typography variant="h6" color="primary">Submit</Typography>
				<Typography className={classes.hint}>Placeholder</Typography>

				{postFormLoading
					? <Loading />
					: postFormSuccess
						? this.renderError()
						: this.renderSuccess()
				}
			</Paper>
		);
	}
}

const mapStateToProps = state => ({
	...state.forms,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FormsNewSubmit));