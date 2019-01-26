import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import FormControlInput from '../../components/reusables/FormControlInput'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

const styles = theme => ({
	wrapper: {
		...paperStyles(theme),
	},
	formControlInput: {
		margin: '.5rem 0',
	},
	methodDescriptionWrapper: {
		margin: '2.5rem 0 1rem',
	},
	methodHint: {
		color: theme.palette.grey[500],
	},
	buttonsWrapper: {
		margin: '1rem 0 0',
		...buttonWrapperStyles(theme),
	},
})

class FormsNewContact extends React.Component {
	state = {
		name: this.props.form ? this.props.form.name : "",
		title: this.props.form ? this.props.form.title : "",
		phone: this.props.form ? this.props.form.phone : "",
		email: this.props.form ? this.props.form.email : "",
		method: this.props.form ? this.props.form.method : "",
		error: null,
		errorMessage: null,
	}

	removeError = () => this.setState({error: null, errorMessage: null})

	onSubmit = () => {
		this.props.onSubmit({
			name: this.state.name,
			title: this.state.title,
			phone: this.state.phone,
			email: this.state.email,
			method: this.state.method,
		})
	}

	render() {
		const { classes } = this.props
		const { name, title, phone, email, method, error, errorMessage } = this.state

		return (
			<Paper className={classes.wrapper} square>
				<Typography variant="h6" color="primary">Contact Information for this Incident</Typography>

				<form>
					<FormControlInput 
						className={classes.formControlInput}
						id="forms-new-name"
						label="Name"
						value={name}
						error={error}
						errorMessage={errorMessage}
						onChange={(e) => this.setState({name: e.target.value})}
						required
						autoFocus
					/>

					<FormControlInput 
						className={classes.formControlInput}
						id="forms-new-title"
						label="Title"
						value={title}
						error={error}
						errorMessage={errorMessage}
						onChange={(e) => this.setState({title: e.target.value})}
					/>

					<FormControlInput 
						className={classes.formControlInput}
						id="forms-new-phone"
						label="Phone"
						value={phone}
						type="tel"
						error={error}
						errorMessage={errorMessage}
						onChange={(e) => this.setState({phone: e.target.value})}
						required
					/>

					<FormControlInput 
						className={classes.formControlInput}
						id="forms-new-email"
						label="Email Address"
						value={email}
						type="email"
						error={error}
						errorMessage={errorMessage}
						onChange={(e) => this.setState({email: e.target.value})}
						required
					/>

					<div className={classes.methodDescriptionWrapper}>
						<Typography>Secure Communication Method</Typography>
						<Typography className={classes.methodHint}>(e.g Signal Safety Number, PGP Email ID)</Typography>
					</div>

					<FormControlInput 
						className={classes.formControlInput}
						id="forms-new-method"
						label="Secure Communication Method"
						value={method}
						error={error}
						errorMessage={errorMessage}
						onChange={(e) => this.setState({method: e.target.value})}
					/>

					<FormControl className={classes.buttonsWrapper} fullWidth>
						<Button href="/forms">Go Back</Button>
						<ClickAwayListener onClickAway={this.removeError}>
							<Button color="secondary" onClick={this.onSubmit}>Next</Button>
						</ClickAwayListener>
					</FormControl>
				</form>
			</Paper>
		)
	}
}

export default withStyles(styles, {withTheme: true})(FormsNewContact)