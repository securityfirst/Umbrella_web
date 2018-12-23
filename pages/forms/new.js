import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Layout from '../../components/layout';
import FormsNewContact from '../../components/forms/FormsNewContact';
import FormsNewIncident from '../../components/forms/FormsNewIncident';

import { contentStyles } from '../../utils/view';

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
	button: {
		marginRight: theme.spacing.unit,
	},
	instructions: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit,
	},
});

const steps = ['Contact', 'Incident', 'Impact', 'Data'];

class FormsNew extends React.Component {
	state = {
		activeStep: 0,
		skipped: new Set(),
		progress: 0,
		contactForm: null,
		incidentForm: null,
		impactForm: null,
		dataForm: null,
	}

	handleNext = (formName, form) => {
		const { activeStep } = this.state;
		let { skipped, progress } = this.state;
		let newProgress = (progress);

		if (this.isStepSkipped(activeStep)) {
			skipped = new Set(skipped.values());
			skipped.delete(activeStep);
		} else {
			newProgress += 25;
		}

		this.setState({
			activeStep: activeStep + 1,
			progress: newProgress,
			skipped,
			[formName]: form
		});
	}

	handleBack = (formName, form) => {
		this.setState(state => ({
			activeStep: state.activeStep - 1, 
			progress: state.progress - 25,
			[formName]: form,
		}));
	}

	handleSkip = () => {
		const { activeStep } = this.state;
		
		if (!this.isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}

		this.setState(state => {
			const skipped = new Set(state.skipped.values());
			
			skipped.add(activeStep);
			
			return {
				activeStep: state.activeStep + 1,
				skipped,
			};
		});
	}

	handleReset = () => this.setState({activeStep: 0})

	isStepSkipped = (step) => this.state.skipped.has(step)

	renderStage = () => {
		const { activeStep } = this.state;

		switch (activeStep) {
			case 0: return <FormsNewContact onSubmit={form => this.handleNext('contactForm', form)} />;
			case 1: return <FormsNewIncident onGoBack={form => this.handleBack('incidentForm', form)} onSubmit={form => this.handleNext('incidentForm', form)} />;
			case 2: return <FormsNewContact onGoBack={form => this.handleBack('impactForm', form)} onSubmit={form => this.handleNext('impactForm', form)} />;
			case 3: return <FormsNewContact onGoBack={form => this.handleBack('dataForm', form)} onSubmit={form => this.handleNext('dataForm', form)} />;
		}
	}

	render() {
		const { classes } = this.props;
		const { activeStep, progress } = this.state;

		return (
			<Layout title="Umbrella | Forms - New" description="Umbrella web application">
				<div className={classes.stepperWrapper}>
					<Stepper className={classes.stepper} activeStep={activeStep}>
						{steps.map((label, index) => {
							let props = {};

							if (this.isStepSkipped(index)) props.completed = false;

							return (
								<Step key={label} {...props}>
									<StepLabel>{label}</StepLabel>
								</Step>
							);
						})}
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
					{this.renderStage()}
				</div>
			</Layout>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FormsNew);