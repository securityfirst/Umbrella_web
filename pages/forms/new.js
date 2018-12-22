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

import { contentStyles } from '../../utils/view';

const styles = theme => ({
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
	...contentStyles(theme),
});

const steps = ['Contact', 'Incident', 'Impact', 'Data'];

class FormsNew extends React.Component {
	state = {
		activeStep: 0,
		skipped: new Set(),
		progress: 0,
	}

	handleNext = () => {
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
		});
	}

	handleBack = () => this.setState(state => ({activeStep: state.activeStep - 1, progress: state.progress - 25}))

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
			case 0: return <FormsNewContact />;
			case 1: return <FormsNewContact />;
			case 2: return <FormsNewContact />;
			case 3: return <FormsNewContact />;
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

					<Typography paragraph>
						<strong>EDIT</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
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
				</div>
			</Layout>
		);
	}
}

export default withStyles(styles, {withTheme: true})(FormsNew);