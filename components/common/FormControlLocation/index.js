import React from "react";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";
import xhr from "xhr";

import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

import teal from "@material-ui/core/colors/teal";

import "./index.css";

const styles = (theme) => ({
  label: {
    "&$focused": {
      color: teal[500],
    },
  },
  focused: {},
  input: {
    height: "initial",
  },
  underline: {
    "&:after": {
      borderBottomColor: teal[500],
    },
  },
  helperText: {
    height: 0,
    minHeight: 0,
    marginTop: 0,
    lineHeight: "1.5rem",
    overflow: "auto",
    "-webkit-overflow-scrolling": "touch",
  },
});

class FormControlLocation extends React.Component {
  state = {
    results: [],
    focus: null,
    loading: false,
    error: null,
    searchTime: new Date(),
    showList: false,
    inputValue: "",
    typedInput: "",
  };

  componentWillMount() {
    this.setState({ inputValue: this.props.defaultInputValue });
  }

  componentDidMount() {
    if (this.props.focusOnMount) this.input.focus();
  }

  componentWillReceiveProps(props) {
    if (props.defaultInputValue !== this.props.inputValue) {
      this.setState({ inputValue: props.defaultInputValue });
    }
  }

  search = (proximity, bbox, types, query, callback) => {
    let searchTime = new Date();
    let uri = `
			https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/
			${encodeURIComponent(query)}
			.json
			?access_token=
			${process.env.MAPBOX_ACCESS_TOKEN}
			${proximity ? "&proximity=" + proximity : ""}
			${bbox ? "&bbox=" + bbox : ""}
			${types ? "&types=" + encodeURIComponent(types) : ""}
		`;

    xhr({ uri, json: true }, (err, res, body) => {
      // searchTime is compared with the last search to set the state
      // to ensure that a slow xhr response does not scramble the
      // sequence of autocomplete display.
      if (err) this.setState({ error: err });
      if (
        !err &&
        body &&
        body.features &&
        this.state.searchTime <= searchTime
      ) {
        this.setState({
          searchTime: searchTime,
          loading: false,
          results: body.features,
          focus: 0,
        });
      }
    });
  };

  onInput = (e) => {
    let { value } = e.target;

    this.setState({
      loading: true,
      showList: true,
      inputValue: value,
      typedInput: value,
    });

    if (value === "") {
      this.setState({
        results: [],
        focus: null,
        loading: false,
        showList: false,
      });
    } else {
      this.search(
        this.props.proximity,
        this.props.bbox,
        this.props.types,
        value
      );
    }
  };

  moveFocus = (dir) => {
    if (this.state.loading) return;

    var focus =
      this.state.focus === null
        ? 0
        : Math.max(
            -1,
            Math.min(this.state.results.length - 1, this.state.focus + dir)
          );

    var inputValue =
      focus === -1
        ? this.state.typedInput
        : this.state.results[focus].place_name;

    this.setState({
      focus: focus,
      inputValue: inputValue,
      typedInput: inputValue,
      showList: true,
    });
  };

  acceptFocus = () => {
    if (this.state.focus !== null && this.state.focus !== -1) {
      let inputValue = this.state.results[this.state.focus].place_name;

      this.setState({
        showList: false,
        inputValue: inputValue,
        typedInput: inputValue,
      });

      this.props.onSelect(this.state.results[this.state.focus]);
    }
  };

  onKeyDown = (e) => {
    switch (e.which) {
      // up
      case 38:
        e.preventDefault();
        this.moveFocus(-1);
        break;
      // down
      case 40:
        e.preventDefault();
        this.moveFocus(1);
        break;
      // tab
      case 9:
        this.acceptFocus();
        break;
      // esc
      case 27:
        this.setState({ showList: false, results: [] });
        break;
      // accept
      case 13:
        if (this.state.results.length > 0)
          this.selectOption(this.state.results[0], 0);
        this.acceptFocus();
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  selectOption = (place, listLocation, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.props.onSelect(place);
    this.setState({
      focus: listLocation,
      showList: false,
      inputValue: place.place_name,
      typedInput: place.place_name,
    });

    // focus on the input after click to maintain key traversal
    this.input.focus();
  };

  handleBlur = (e) => {
    if (
      !e ||
      !e.relatedTarget ||
      !e.relatedTarget.parentElement ||
      !e.relatedTarget.parentElement.parentElement ||
      e.relatedTarget.parentElement.parentElement.id !== "react-geo-list"
    ) {
      this.setState({ showList: false });
    }
  };

  render() {
    const {
      classes,
      id,
      className,
      label,
      showLoader,
      focusOnMount,
      required,
    } = this.props;
    const {
      error,
      results,
      loading,
      focus,
      showList,
      inputValue,
      typedInput,
    } = this.state;

    let wrapperProps = {};
    let inputProps = {};

    if (className) wrapperProps.className = className;

    return (
      <FormControl {...wrapperProps} fullWidth>
        <InputLabel
          htmlFor={id}
          error={error}
          classes={{
            root: classes.label,
            focused: classes.focused,
          }}
        >
          {label}
        </InputLabel>

        <Input
          id={id}
          classes={{ underline: classes.underline }}
          inputProps={{
            ref: (el) => (this.input = el),
            className: classes.input,
            required: true,
            onBlur: this.handleBlur,
            onKeyDown: this.onKeyDown,
          }}
          error={error}
          value={inputValue || typedInput}
          type="string"
          onChange={this.onInput}
          required={required}
          autoFocus={focusOnMount}
          fullWidth
        />

        <FlipMove
          delay={0}
          duration={200}
          enterAnimation="accordionVertical"
          leaveAnimation="accordionVertical"
          maintainContainerHeight={true}
        >
          {results.length > 0 && showList && (
            <ul
              key="needed-for-flip-move"
              id="react-geo-list"
              className={
                "formcontrollocation__results" +
                (showLoader && loading ? " loading" : "")
              }
            >
              {results.map((result, i) => (
                <li
                  key={result.id}
                  className={
                    "formcontrollocation__result " +
                    (i === focus ? "formcontrollocation__result--focus" : "")
                  }
                >
                  <a
                    href=""
                    tabIndex="-1"
                    onClick={(e) => this.selectOption(result, i, e)}
                  >
                    {result.place_name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </FlipMove>

        {!!error && (
          <FormHelperText className={classes.helperText}>
            {errorMessage}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
}

FormControlLocation.defaultProps = {
  id: "",
  className: null,
  defaultInputValue: "",
  showLoader: false,
  proximity: "",
  bbox: "",
  types: "",
  focusOnMount: true,
  error: null,
  required: false,
};

FormControlLocation.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  defaultInputValue: PropTypes.string,
  proximity: PropTypes.string,
  bbox: PropTypes.string,
  showLoader: PropTypes.bool,
  focusOnMount: PropTypes.bool,
  types: PropTypes.string,
  error: PropTypes.object,
  required: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(FormControlLocation);
