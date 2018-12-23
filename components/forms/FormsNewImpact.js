import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import FormControlCheckbox from '../../components/reusables/FormControlCheckbox';

import { paperStyles, buttonWrapperStyles } from '../../utils/view';

const styles = theme => ({
	wrapper: {
		...paperStyles(theme),
	},
	hint: {
		color: theme.palette.grey[500],
	},
	optionsWrapper: {
		margin: '2rem 0 1rem',
	},
	formControlInput: {
		margin: '2rem 0',
	},
	buttonsWrapper: {
		margin: '1rem 0 0',
		...buttonWrapperStyles(theme),
	},
});

const options = [
	{name: 'Outside access to data', value: 'outside_access'},
	{name: 'Loss of access to account', value: 'loss_of_access'},
	{name: 'Phishing / Malware attacks on contacts', value: 'phishing_malware'},
	{name: 'Loss / Compromise of Data', value: 'loss_of_data'},
	{name: 'Damage to Systems', value: 'system_damage'},
	{name: 'Website down', value: 'website_down'},
];

class FormsNewImpact extends React.Component {
	state = {
		optionsSelected: this.props.form ? this.props.form.options : "",
		error: null,
		errorMessage: null,
	}

	handleSelect = (sourceValue) => () => {
		const { optionsSelected } = this.state;

		if (optionsSelected.includes(sourceValue)) this.setState({optionsSelected: optionsSelected.filter(value => value !== sourceValue)});
		else this.setState({optionsSelected: optionsSelected.concat([sourceValue])});
	}

	removeError = () => this.setState({error: null, errorMessage: null})

	onGoBack = () => this.props.onGoBack({options: this.state.optionsSelected})

	onSubmit = () => this.props.onSubmit({options: this.state.optionsSelected})

	render() {
		const { classes, goBack } = this.props;
		const { optionsSelected, error, errorMessage } = this.state;

		return (
			<Paper className={classes.wrapper} square>
				<Typography variant="h6" color="primary">Impact / Potential Impact</Typography>
				<Typography className={classes.hint}>Check all of the following that apply to this incident.</Typography>

				<form>
					<div className={classes.optionsWrapper}>
						{options.map((option, i) => {
							return (
								<FormControlCheckbox
									key={i}
									name={option.name}
									value={option.value}
									checked={optionsSelected.includes(option.value)} 
									onChange={this.handleSelect(option.value)} 
								/>
							);
						})}
					</div>

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

export default withStyles(styles, {withTheme: true})(FormsNewImpact);