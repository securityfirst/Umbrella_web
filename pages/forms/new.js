import React from 'react'
import { connect } from 'react-redux'
import Router, { withRouter } from 'next/router'

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
import Loading from '../../components/common/Loading'
import ErrorMessage from '../../components/common/ErrorMessage'
import FormControlInput from '../../components/common/FormControlInput'
import FormControlCheckboxes from '../../components/common/FormControlCheckboxes'
import FormControlRadios from '../../components/common/FormControlRadios'

import teal from '@material-ui/core/colors/teal'

import { getForm, saveForm, resetSaveForm } from '../../store/actions/forms'
import { contentStyles, paperStyles, buttonWrapperStyles } from '../../utils/view'
import { ID } from '../../utils/id'

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
		formState: [],
		error: null, 
		errorMessage: null,
	}

	componentDidMount() {
		const { form } = this.props

		this.setState({
			formState: form.screens.map(screen => {
				return screen.items.reduce((acc, item) => {
					switch (item.type) {
						case 'text_input': 
						case 'text_area': 
						case 'single_choice': 
							acc[item.name] = ''
							break
						case 'multiple_choice': 
							acc[item.name] = []
							break
					}

					return acc
				}, {})
			})
		})
	}

	onChange = (field, value) => {
		const { activeStep, formState } = this.state

		let newValue;
		let newState = [...formState]

		switch (field.type) {
			case 'text_input': 
			case 'text_area': 
			case 'single_choice': 
				newValue = value
				break;
			case 'multiple_choice':
				let oldValue = formState[activeStep][field.name] || []

				if (oldValue.includes(value)) newValue = oldValue.filter(v => v !== value)
				else newValue = oldValue.concat([value])

				break;
		}

		newState[activeStep] = {
			...formState[activeStep],
			[field.name]: newValue
		}

		this.setState({formState: newState})
	}

	onNext = e => {
		!!e && e.preventDefault()

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

	onFinish = () => {
		this.setState({
			activeStep: 0,
			progress: 0,
		})

		const date = new Date()

		const form = {
			id: ID(),
			sha: this.props.router.query.sha,
			filename: this.props.form.title,
			state: this.state.formState,
			dateCreated: date.valueOf()
		}

		this.props.dispatch(saveForm(form, () => {
			this.props.dispatch(resetSaveForm())
			alert('Your form has been saved')
			Router.push('/forms')
		}))
	}

	removeError = () => this.setState({error: null, errorMessage: null})

	renderField = (field, i) => {
		const { classes } = this.props
		const { activeStep, formState, error, errorMessage } = this.state

		switch (field.type) {
			case 'text_input': 
				return (
					<FormControlInput 
						key={i}
						className={classes.formControlInput}
						id={`form-input-${field.label}`}
						label={field.label}
						value={formState[activeStep][field.name]}
						error={error}
						errorMessage={errorMessage}
						onChange={e => this.onChange(field, e.target.value)}
						required
					/>
				)
			case 'text_area':
				return (
					<FormControlInput 
						key={i}
						className={classes.formControlInput}
						id={`form-input-${field.label}`}
						label={field.label}
						value={formState[activeStep][field.name]}
						error={error}
						errorMessage={errorMessage}
						onChange={e => this.onChange(field, e.target.value)}
						required
						multiline
						rows={3}
					/>
				)
			case 'multiple_choice':
				return (
					<FormControlCheckboxes 
						key={i}
						label={field.label}
						options={field.options}
						state={formState[activeStep][field.name]}
						error={error}
						onChange={v => this.onChange(field, v)}
					/>
				)
			case 'single_choice':
				return (
					<FormControlRadios 
						key={i}
						label={field.label}
						options={field.options}
						value={formState[activeStep][field.name]}
						error={error}
						onChange={v => this.onChange(field, v)}
					/>
				)
		}
	}

	renderScreen = screen => {
		const { classes, title, form } = this.props
		const { activeStep } = this.state

		return (
			<Paper className={classes.formWrapper} square>
				<Typography variant="h6" color="primary">{screen.title}</Typography>

				<form onSubmit={this.onNext}>
					{screen.items.map(this.renderField)}
				</form>

				<FormControl className={classes.buttonsWrapper} fullWidth>
					{activeStep !== 0 && <Button onClick={this.onBack}>Go Back</Button>}

					{activeStep !== form.screens.length - 1 
						? <ClickAwayListener onClickAway={this.removeError}>
							<Button color="secondary" onClick={this.onNext}>Next</Button>
						</ClickAwayListener>
						: <ClickAwayListener onClickAway={this.removeError}>
							<Button color="secondary" onClick={this.onFinish}>Finish</Button>
						</ClickAwayListener>
					}
				</FormControl>
			</Paper>
		)
	}

	render() {
		const { classes, getFormLoading, getFormError, form } = this.props
		const { activeStep, progress, formState } = this.state

		if (getFormLoading || !formState.length) return <Loading />
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
					{this.renderScreen(screen)}
				</div>
			</Layout>
		)
	}
}

const mapStateToProps = state => ({
	...state.forms
})

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FormsNew)))