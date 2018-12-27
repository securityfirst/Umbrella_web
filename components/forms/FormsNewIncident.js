import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import FormControlInput from '../../components/reusables/FormControlInput';

import { paperStyles, buttonWrapperStyles } from '../../utils/view';

const styles = theme => ({
	wrapper: {
		...paperStyles(theme),
	},
	hint: {
		color: theme.palette.grey[500],
	},
	formControlInput: {
		margin: '2rem 0 1rem',
	},
	buttonsWrapper: {
		margin: '1rem 0 0',
		...buttonWrapperStyles(theme),
	},
});

class FormsNewIncident extends React.Component {
	state = {
		incident: this.props.form ? this.props.form.incident : "",
		error: null,
		errorMessage: null,
	}

	removeError = () => this.setState({error: null, errorMessage: null})

	onGoBack = () => {
		this.props.onGoBack({
			incident: this.state.incident,
		});
	}

	onSubmit = () => {
		this.props.onSubmit({
			incident: this.state.incident,
		});
	}

	render() {
		const { classes, goBack } = this.props;
		const { incident, error, errorMessage } = this.state;

		return (
			<Paper className={classes.wrapper} square>
				<Typography variant="h6" color="primary">Incident Description</Typography>
				<Typography className={classes.hint}>Provide a brief description</Typography>

				<form>
					<FormControlInput 
						className={classes.formControlInput}
						id="forms-new-incident"
						label="Description"
						value={incident}
						error={error}
						errorMessage={errorMessage}
						onChange={(e) => this.setState({incident: e.target.value})}
						required
						autoFocus
						multiline
					/>

					<FormControl className={classes.buttonsWrapper} fullWidth>
						<Button onClick={this.onGoBack}>Go Back</Button>
						<ClickAwayListener onClickAway={this.removeError}>
							<Button color="secondary" onClick={this.onSubmit}>Next</Button>
						</ClickAwayListener>
					</FormControl>
				</form>
			</Paper>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FormsNewIncident);