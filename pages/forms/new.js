import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import Layout from '../../components/layout'
import Loading from '../../components/reusables/Loading'
import ErrorMessage from '../../components/reusables/ErrorMessage'
import FormControlInput from '../../components/reusables/FormControlInput'
import FormControlCheckboxes from '../../components/reusables/FormControlCheckboxes'

import teal from '@material-ui/core/colors/teal'

import { contentStyles, paperStyles, buttonWrapperStyles } from '../../utils/view'
import { getForm, resetPostForm } from '../../store/actions/forms'

const styles = theme => ({
	...contentStyles(theme),
	stepperWrapper: {
		backgroundColor: theme.palette.common.white,
	},
	stepper: {
		maxWidth: '50rem',
		margin: '0 auto',
		padding: '1rem',
	},
	progressWrapper: {
		flexGrow: 1,
	},
	progressRoot: {
		height: '3px',
	},
	progressBackgroundColor: {
		backgroundColor: theme.palette.grey[900],
	},
	percentage: {
		marginTop: '1rem',
	},
	formWrapper: {
		...paperStyles(theme),
	},
	formControlInput: {
		margin: '.5rem 0',
	},
	buttonsWrapper: {
		margin: '1rem 0 0',
		...buttonWrapperStyles(theme),
	},
})

class FormsNew extends React.Component {
	static async getInitialProps({reduxStore, query}) {
		await reduxStore.dispatch(getForm(query.sha))
	}

	state = {
		activeStep: 0,
		progress: 0,
		formState: {},
		error: null, 
		errorMessage: null,
	}

	onNext = () => {
		const { form } = this.props
		const { activeStep, progress } = this.state

		const stepCount = 100 / form.screens.length

		this.setState({
			activeStep: activeStep + 1,
			progress: progress + stepCount,
		})
	}

	onBack = () => {
		const { form } = this.props
		const { activeStep, progress } = this.state

		const stepCount = 100 / form.screens.length

		this.setState(state => ({
			activeStep: activeStep - 1, 
			progress: progress - stepCount,
		}))
	}

	onChange = (field, value) => {
		const { formState } = this.state

		let newValue;

		switch (field.type) {
			case 'text_input': 
				newValue = value
				break;
			case 'multiple_choice':
				let oldValue = formState[field.name] || []

				if (oldValue.includes(value)) newValue = oldValue.filter(v => v !== value)
				else newValue = oldValue.concat([value])

				break;
		}

		this.setState({
			formState: {
				...this.state.formState,
				[field.name]: newValue
			}
		})
	}

	onSubmitSuccess = () => {
		this.setState({
			activeStep: 0,
			progress: 0,
		})

		this.props.dispatch(resetPostForm())
	}

	removeError = () => this.setState({error: null, errorMessage: null})

	renderInput = (field, i) => {
		const { classes } = this.props
		const { formState, error, errorMessage } = this.state

		switch (field.type) {
			case 'text_input': 
				return (
					<FormControlInput 
						className={classes.formControlInput}
						id={`form-input-${field.label}`}
						label={field.label}
						value={formState[field.name]}
						error={error}
						errorMessage={errorMessage}
						onChange={e => onChange(field, e.target.value)}
						required
					/>
				)
			case 'multiple_choice':
				return (
					<FormControlCheckboxes 
						label={field.label}
						options={field.options}
						state={formState[field.name]}
						error={error}
						onChange={this.onChange}
					/>
				)
			case 'text_area':
				return (
					<FormControlInput 
						className={classes.formControlInput}
						id={`form-input-${field.label}`}
						label={field.label}
						value={formState[field.name]}
						error={error}
						errorMessage={errorMessage}
						onChange={e => onChange(field, e.target.value)}
						required
						multiline
						rows={3}
					/>
				)
		}
	}

	renderForm = screen => {
		const { classes, title } = this.props

		return (
			<Paper className={classes.formWrapper} square>
				<Typography variant="h6" color="primary">{screen.title}</Typography>

				<form>
					{screen.items.map(this.renderInput)}
				</form>

				<FormControl className={classes.buttonsWrapper} fullWidth>
					<Button onClick={this.onBack}>Go Back</Button>

					<ClickAwayListener onClickAway={this.removeError}>
						<Button color="secondary" onClick={this.onNext}>Next</Button>
					</ClickAwayListener>
				</FormControl>
			</Paper>
		)
	}

	render() {
		const { classes, getFormLoading, getFormError, form } = this.props
		const { activeStep, progress } = this.state

		if (getFormLoading) return <Loading />
		else if (getFormError) return <ErrorMessage error={getFormError} />

		const screen = form.screens[activeStep]

		return (
			<Layout title="Umbrella | New Form" description="Umbrella web application">
				<div className={classes.stepperWrapper}>
					<Stepper className={classes.stepper} activeStep={activeStep}>
						{form.screens.map((screen, i) => (
							<Step key={i}>
								<StepLabel>{form.screens.length <= 6 && screen.title}</StepLabel>
							</Step>
						))}
					</Stepper>
				</div>

				<div className={classes.progressWrapper}>
					<LinearProgress 
						classes={{
							root: classes.progressRoot,
							colorSecondary: classes.progressBackgroundColor,
						}}
						color="secondary" 
						variant="determinate" 
						value={progress === 0 ? 1 : progress} 
					/>
				</div>

				<Typography className={classes.percentage} align="center" color="secondary">{progress}%</Typography>

				<div className={classes.content}>
					{this.renderForm(screen)}
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.forms
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FormsNew))