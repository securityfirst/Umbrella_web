import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import FormControlInput from '../../components/reusables/FormControlInput'

import { paperStyles, buttonWrapperStyles } from '../../utils/view'

const styles = theme => ({
	formControlInput: {
		margin: '2rem 0 4rem',
	},
	buttonsWrapper: {
		...buttonWrapperStyles(theme),
		...paperStyles(theme),
	},
})

class FeedsEditIconForm extends React.Component {
	render() {
		const { classes, id, label, value, error, errorMessage, onChange, onSubmit, removeError, cancel } = this.props

		return (
			<form>
				<FormControlInput 
					className={classes.formControlInput}
					id={id}
					label={label}
					value={value}
					type="string"
					error={error}
					errorMessage={errorMessage}
					onChange={onChange}
					required
					autoFocus
				/>

				<FormControl className={classes.buttonsWrapper} fullWidth>
					<Button component="button" onClick={cancel}>Cancel</Button>
					<ClickAwayListener onClickAway={removeError}>
						<Button color="secondary" onClick={onSubmit}>OK</Button>
					</ClickAwayListener>
				</FormControl>
			</form>
		)
	}
}

export default withStyles(styles, {withTheme: true})(FeedsEditIconForm)