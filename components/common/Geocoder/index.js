import React from 'react'
import ReactDOM from 'react-dom'
import FlipMove from 'react-flip-move'
import PropTypes from 'prop-types'
import xhr from 'xhr'

import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'

import teal from '@material-ui/core/colors/teal'

import './index.css'

const styles = theme => ({
	input: {
		height: 'initial',
	},
	underline: {
		'&:after': {
			borderBottomColor: teal[500],
		},
	},
})

class Geocoder extends React.Component {
	state = {
		results: [],
		focus: null,
		loading: false,
		error: null,
		searchTime: new Date(),
		showList: false,
		inputValue: '',
		typedInput: '',
	}

	componentWillMount() {
		this.setState({ inputValue: this.props.defaultInputValue })
	}

	componentDidMount() {
		if (this.props.focusOnMount) this.input.focus()
	}

	componentWillReceiveProps(props) {
		if (props.defaultInputValue !== this.props.inputValue) {
			this.setState({ inputValue: props.defaultInputValue })
		}
	}

	search = (endpoint, source, accessToken, proximity, bbox, types, query, callback) => {
		let searchTime = new Date()
		let uri =
			endpoint +
			'/geocoding/v5/' +
			source +
			'/' +
			encodeURIComponent(query) +
			'.json' +
			'?access_token=' +
			accessToken +
			(proximity ? '&proximity=' + proximity : '') +
			(bbox ? '&bbox=' + bbox : '') +
			(types ? '&types=' + encodeURIComponent(types) : '')
		xhr(
			{
				uri: uri,
				json: true
			},
			function(err, res, body) {
				callback(err, res, body, searchTime)
			}
		)
	}

	onInput = e => {
		let {value} = e.target

		this.setState({
			loading: true,
			showList: true,
			inputValue: value,
			typedInput: value
		})

		this.props.onInputChange(value)

		if (value === '') {
			this.setState({
				results: [],
				focus: null,
				loading: false,
				showList: false
			})
		} else {
			this.search(
				this.props.endpoint,
				this.props.source,
				this.props.accessToken,
				this.props.proximity,
				this.props.bbox,
				this.props.types,
				value,
				this.onResult
			)
		}
	}

	moveFocus = dir => {
		if (this.state.loading) return

		var focus =
			this.state.focus === null
				? 0
				: Math.max(
						-1,
						Math.min(this.state.results.length - 1, this.state.focus + dir)
					)

		var inputValue =
			focus === -1
				? this.state.typedInput
				: this.state.results[focus].place_name

		this.setState({
			focus: focus,
			inputValue: inputValue,
			typedInput: inputValue,
			showList: true
		})

		this.props.onInputChange(inputValue)
	}

	acceptFocus = () => {
		if (this.state.focus !== null && this.state.focus !== -1) {
			let inputValue = this.state.results[this.state.focus].place_name

			this.setState({ 
				showList: false, 
				inputValue: inputValue,
				typedInput: inputValue
			})
			this.props.onInputChange(inputValue)
			this.props.onSelect(this.state.results[this.state.focus])
		}
	}

	onKeyDown = e => {
		switch (e.which) {
			// up
			case 38:
				e.preventDefault()
				this.moveFocus(-1)
				break
			// down
			case 40:
				e.preventDefault()
				this.moveFocus(1)
				break
			// tab
			case 9:
				this.acceptFocus()
				break
			// esc
			case 27:
				this.setState({ showList: false, results: [] })
				break
			// accept
			case 13:
				if (this.state.results.length > 0) {
					this.clickOption(this.state.results[0], 0)
				}
				this.acceptFocus()
				e.preventDefault()
				break
			default:
				break
		}
	}

	onResult = (err, res, body, searchTime) => {
		// searchTime is compared with the last search to set the state
		// to ensure that a slow xhr response does not scramble the
		// sequence of autocomplete display.
		if (err) this.setState({error: err})
		if (!err && body && body.features && this.state.searchTime <= searchTime) {
			this.setState({
				searchTime: searchTime,
				loading: false,
				results: body.features,
				focus: 0
			})
			this.props.onSuggest(this.state.results)
		}
	}

	clickOption = (place, listLocation) => {
		this.props.onInputChange(place.place_name)
		this.props.onSelect(place)
		this.setState({
			focus: listLocation,
			showList: false,
			inputValue: place.place_name,
			typedInput: place.place_name,
		})

		// focus on the input after click to maintain key traversal
		this.input.focus()
	}

	handleBlur = e => {
		if (
			!e ||
			!e.relatedTarget ||
			!e.relatedTarget.parentElement ||
			!e.relatedTarget.parentElement.parentElement ||
			e.relatedTarget.parentElement.parentElement.id !== 'react-geo-list'
		) {
			this.setState({ showList: false })
		}
	}

	render() {
		let input = <Input
			error={this.state.error}
			id={this.props.id}
			value={this.state.inputValue || this.state.typedInput}
			type='string'
			classes={{underline: this.props.classes.underline}}
			inputProps={{
				ref: el => this.input = el,
				className: this.props.classes.input,
				required: true,
				onBlur: this.handleBlur,
				onKeyDown: this.onKeyDown,
			}}
			onChange={this.onInput}
			required={this.props.required}
			autoFocus={this.props.focusOnMount}
			fullWidth
		/>

		return React.createElement(
			'div',
			null,
			this.props.inputPosition === 'top' && input,
			React.createElement(
				FlipMove,
				{
					delay: 0,
					duration: 200,
					enterAnimation: 'accordionVertical',
					leaveAnimation: 'accordionVertical',
					maintainContainerHeight: true,
					className: ''
				},
				this.state.results.length > 0 &&
					this.state.showList &&
					React.createElement(
						'ul',
						{
							key: 'needed-for-flip-move',
							id: 'react-geo-list',
							className:
								(this.props.showLoader && this.state.loading ? 'loading' : '') +
								' geocoder__results'
						},
						this.state.results.map((result, i) => {
							return React.createElement(
								'li',
								{ 
									key: result.id,
									className:
										'geocoder__result ' +
										(i === this.state.focus
											? 'geocoder__result--focus'
											: ''),
									tabIndex: '-1',
									onClick: () => this.clickOption(result, i),
								},
								React.createElement(
									'span',
									{
										onClick: () => this.clickOption(result, i),
									},
									result.place_name
								)
							)
						})
					)
			),
			this.props.inputPosition === 'bottom' && input
		)
	}
}

Geocoder.defaultProps = {
	endpoint: 'https://api.tiles.mapbox.com',
	defaultInputValue: '',
	inputPosition: 'top',
	inputPlaceholder: 'Search',
	showLoader: false,
	source: 'mapbox.places',
	proximity: '',
	bbox: '',
	types: '',
	onSuggest: function onSuggest() {},
	onInputChange: function onInputChange() {},
	focusOnMount: true,
	required: false,
}

Geocoder.propTypes = {
	endpoint: PropTypes.string,
	defaultInputValue: PropTypes.string,
	source: PropTypes.string,
	inputPosition: PropTypes.string,
	inputPlaceholder: PropTypes.string,
	onSelect: PropTypes.func.isRequired,
	onSuggest: PropTypes.func,
	onInputChange: PropTypes.func,
	accessToken: PropTypes.string.isRequired,
	proximity: PropTypes.string,
	bbox: PropTypes.string,
	showLoader: PropTypes.bool,
	focusOnMount: PropTypes.bool,
	types: PropTypes.string,
	required: PropTypes.bool,
}

export default withStyles(styles, {withTheme: true})(Geocoder)