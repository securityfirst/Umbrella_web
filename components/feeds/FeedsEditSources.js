import React from 'react'
import { connect } from 'react-redux'

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

import { setFeedSources } from '../../store/actions/feeds'

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
	{name: 'ReliefWeb / United Nations', value: '0,2'},
	{name: 'United Kingdom Foreign and Commonwealth Office', value: '1'},
	{name: 'Centres for Disease Control', value: '3'},
	{name: 'Global Disaster Alert Coordination System', value: '4'},
	{name: 'US State Department Country Warnings', value: '5'},
]

class FeedsEditSources extends React.Component {
	state = {
		sourcesSelected: [],
		error: null,
		errorMessage: null,
	}

	componentDidMount() {
		this.setState({sourcesSelected: this.props.feedSources})
	}

	handleSelect = (sourceValue) => () => {
		const { sourcesSelected } = this.state

		if (sourcesSelected.includes(sourceValue)) {
			this.setState({sourcesSelected: sourcesSelected.filter(value => value !== sourceValue)})
		}
		
		else this.setState({sourcesSelected: sourcesSelected.concat([sourceValue])})
	}

	handleSelectAll = () => {
		const { sourcesSelected } = this.state

		if (sourcesSelected.length === sources.length) this.setState({sourcesSelected: []})
		else this.setState({sourcesSelected: sources.map(s => s.value)})
	}

	handleSubmit = e => {
		!!e && e.preventDefault()

		const { dispatch, closeModal } = this.props
		const { sourcesSelected } = this.state

		dispatch(setFeedSources(sourcesSelected))
		closeModal()
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
							<FormControlCheckbox
								name="Select All"
								value="all"
								checked={sourcesSelected.length === sources.length} 
								onChange={this.handleSelectAll} 
							/>
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

const mapStateToProps = state => ({
	...state.feeds,
})

export default connect(mapStateToProps)(withStyles(styles, {withTheme: true})(FeedsEditSources))