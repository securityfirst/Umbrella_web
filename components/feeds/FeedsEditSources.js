import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Button from '@material-ui/core/Button'
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm'

import teal from '@material-ui/core/colors/teal'

import FormControlCheckbox from '../common/FormControlCheckbox'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

const styles = theme => ({
	checkboxControl: {
		margin: '1rem 0 3rem',
	},
	container: {
		...paperStyles(theme),
	},
	buttonsWrapper: {
		...buttonWrapperStyles(theme),
	},
})

const sources = [
	{name: 'ReliefWeb', value: 'relief_web'},
	{name: 'UN', value: 'un'},
	{name: 'FCO', value: 'fco'},
	{name: 'CDC', value: 'cdc'},
	{name: 'Global Disaster and Alert Coordination System', value: 'global_disaster'},
	{name: 'US State Department Country Warnings', value: 'us_state_department'},
]

class FeedsEditSources extends React.Component {
	state = {
		sourcesSelected: [],
		error: null,
		errorMessage: null,
	}

	handleSelect = (sourceValue) => () => {
		const { sourcesSelected } = this.state

		if (sourcesSelected.includes(sourceValue)) {
			this.setState({sourcesSelected: sourcesSelected.filter(value => value !== sourceValue)})
		}
		
		else this.setState({sourcesSelected: sourcesSelected.concat([sourceValue])})
	}

	handleSubmit = e => {
		!!e && e.preventDefault()

		const { sourcesSelected } = this.state

		// TODO: Handle submit here, then close on callback
		this.props.onSubmit(sourcesSelected)
		this.props.closeModal()
	}

	handleCancel = () => {
		this.handleRemoveError()
		this.setState({sourcesSelected: []})
		this.props.closeModal()
	}

	handleRemoveError = () => this.setState({error: null, errorMessage: null})

	render() {
		const { classes } = this.props
		const { sourcesSelected, error, errorMessage } = this.state

		return (
			<Paper className={classes.container} square>
				<form onSubmit={this.handleSubmit}>
					<Typography variant="h6">Select the feed sources</Typography>
					<FormControl required error={error} component="fieldset" className={classes.checkboxControl}>
						<FormGroup>
							{sources.map((source, i) => (
								<FormControlCheckbox
									key={i}
									name={source.name}
									value={source.value}
									checked={sourcesSelected.includes(source.value)} 
									onChange={this.handleSelect(source.value)} 
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
		)
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEditSources)