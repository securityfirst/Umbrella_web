import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

import teal from '@material-ui/core/colors/teal';

const styles = theme => ({
	container: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
	},
	checkboxControl: {
		margin: '1rem 0 3rem',
	},
	checkboxRoot: {
		'&$checkboxChecked': {
			color: teal[500],
		},
	},
	checkboxChecked: {},
	buttonsWrapper: {
		display: 'flex',
		justifyContent: 'flex-end',
		flexDirection: 'row',
	},
});

const sources = [
	{name: 'UN / ReliefWeb', value: 'un'},
	{name: 'CDC', value: 'cdc'},
	{name: 'Global Disaster and Alert Coordination System', value: 'global_disaster'},
	{name: 'US State Department Country Warnings', value: 'us_state_department'},
];

class FeedsEditSources extends React.Component {
	state = {
		sourcesSelected: [],
		error: null,
		errorMessage: null,
	};

	handleSelect = (sourceValue) => () => {
		const { sourcesSelected } = this.state;

		if (sourcesSelected.includes(sourceValue)) this.setState({sourcesSelected: sourcesSelected.filter(value => value !== sourceValue)});
		else this.setState({sourcesSelected: sourcesSelected.concat([sourceValue])});
	}

	handleSubmit = () => {
		const { sourcesSelected } = this.state;

		// TODO: Handle submit here, then close on callback

		this.props.closeModal();
	}

	handleCancel = () => {
		this.handleRemoveError();
		this.setState({sourcesSelected: []});
		this.props.closeModal();
	}

	handleRemoveError = () => this.setState({error: null, errorMessage: null})

	render() {
		const { classes } = this.props;
		const { sourcesSelected, error, errorMessage } = this.state;

		console.log("sourcesSelected: ", sourcesSelected);

		return (
			<Paper className={classes.container}>
				<form>
					<Typography variant="h6">Select the feed sources</Typography>
					<FormControl required error={error} component="fieldset" className={classes.checkboxControl}>
						<FormGroup>
							{sources.map((source, i) => (
								<FormControlLabel
									key={i}
									control={
										<Checkbox 
											classes={{
												checkboxRoot: classes.root,
												checkboxChecked: classes.checked,
											}}
											checked={sourcesSelected.includes(source.value)} 
											onChange={this.handleSelect(source.value)} 
											value={source.value}
										/>
									}
									label={source.name}
								/>
							))}
						</FormGroup>
						{!!error && <FormHelperText>{errorMessage}</FormHelperText>}
					</FormControl>

					<FormControl className={classes.buttonsWrapper} fullWidth>
						<Button component="button" onClick={this.handleCancel}>Cancel</Button>
						<ClickAwayListener onClickAway={this.handleRemoveError}>
							<Button color="secondary" onClick={this.handleSubmit}>OK</Button>
						</ClickAwayListener>
					</FormControl>
				</form>
			</Paper>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEditSources);