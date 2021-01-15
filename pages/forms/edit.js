import React from "react";
import { connect } from "react-redux";
import Router, { withRouter } from "next/router";

import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import Layout from "../../components/layout";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import FormControlInput from "../../components/common/FormControlInput";
import FormControlCheckboxes from "../../components/common/FormControlCheckboxes";
import FormControlRadios from "../../components/common/FormControlRadios";

import teal from "@material-ui/core/colors/teal";

import {
  getForm,
  getFormSaved,
  saveForm,
  resetSaveForm,
} from "../../store/actions/forms";
import { setAppbarTitle, openAlert } from "../../store/actions/view";

import {
  contentStyles,
  paperStyles,
  buttonWrapperStyles,
} from "../../utils/view";
import { ID } from "../../utils/id";

const styles = (theme) => ({
  ...contentStyles(theme),
  stepperWrapper: {
    backgroundColor: theme.palette.common.white,
  },
  stepper: {
    maxWidth: "50rem",
    margin: "0 auto",
    padding: "1rem",
  },
  progressWrapper: {
    flexGrow: 1,
  },
  progressRoot: {
    height: "3px",
  },
  progressBackgroundColor: {
    backgroundColor: theme.palette.grey[900],
  },
  percentage: {
    marginTop: "1rem",
  },
  formWrapper: {
    ...paperStyles(theme),
  },
  formControlInput: {
    margin: ".5rem 0",
  },
  buttonsWrapper: {
    margin: "1rem 0 0",
    ...buttonWrapperStyles(theme),
    justifyContent: "space-between",
    alignItems: "center",
  },
});

class FormEdit extends React.Component {
  static async getInitialProps({ reduxStore, query }) {
    await reduxStore.dispatch(getForm(query.sha));
  }

  state = {
    activeStep: 0,
    progress: 0,
    formState: [],
    error: null,
    errorMessage: null,
  };

  componentDidMount() {
    const { dispatch, locale, systemLocaleMap } = this.props;

    dispatch(setAppbarTitle(systemLocaleMap[locale].form_title));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      this.props.dispatch(
        setAppbarTitle(nextProps.systemLocaleMap[nextProps.locale].form_title)
      );
    }

    if (!nextProps.dbLoading) {
      if (!this.props.password && !!nextProps.password) {
        this.props.dispatch(
          getFormSaved(this.props.router.query.id, (formSaved) => {
            this.setState({ formState: formSaved.state });
          })
        );
      }
    }
  }

  onChange = (field, value) => {
    const { activeStep, formState } = this.state;

    let newValue;
    let newState = [...formState];

    switch (field.type) {
      case "text_input":
      case "text_area":
      case "single_choice":
        newValue = value;
        break;
      case "multiple_choice":
        let oldValue = formState[activeStep][field.name] || [];

        if (oldValue.includes(value))
          newValue = oldValue.filter((v) => v !== value);
        else newValue = oldValue.concat([value]);

        break;
    }

    newState[activeStep] = {
      ...formState[activeStep],
      [field.name]: newValue,
    };

    this.setState({ formState: newState });
  };

  onClose = (e) => {
    const { locale, systemLocaleMap } = this.props;

    if (confirm(systemLocaleMap[locale].confirm_form_close)) {
      this.setState({
        activeStep: 0,
        progress: 0,
      });

      Router.push("/forms");
    }
  };

  onNext = (e) => {
    !!e && e.preventDefault();

    const { form } = this.props;
    const { activeStep, progress } = this.state;

    const stepCount = 100 / form.screens.length;

    this.setState({
      activeStep: activeStep + 1,
      progress: progress + stepCount,
    });
  };

  onBack = () => {
    const { form } = this.props;
    const { activeStep, progress } = this.state;

    const stepCount = 100 / form.screens.length;

    this.setState((state) => ({
      activeStep: activeStep - 1,
      progress: progress - stepCount,
    }));
  };

  onSave = () => {
    const { dispatch, locale, systemLocaleMap, formSaved } = this.props;
    const { formState } = this.state;

    const date = new Date();

    const formUpdated = {
      ...formSaved,
      state: formState,
      dateModified: date.valueOf(),
    };

    dispatch(
      saveForm(formUpdated, () => {
        dispatch(openAlert("success", systemLocaleMap[locale].form_saved));
      })
    );
  };

  onFinish = () => {
    const { dispatch, locale, systemLocaleMap, formSaved } = this.props;
    const { formState } = this.state;

    const date = new Date();

    const formUpdated = {
      ...formSaved,
      state: formState,
      dateModified: date.valueOf(),
    };

    dispatch(
      saveForm(formUpdated, () => {
        dispatch(resetSaveForm());
        dispatch(openAlert("success", systemLocaleMap[locale].form_saved));

        Router.push("/forms");
      })
    );
  };

  removeError = () => this.setState({ error: null, errorMessage: null });

  renderField = (field, i) => {
    const { classes } = this.props;
    const { activeStep, formState, error, errorMessage } = this.state;

    if (!field) return null;

    switch (field.type) {
      case "text_input":
        return (
          <FormControlInput
            key={i}
            className={classes.formControlInput}
            id={`form-input-${field.label}`}
            label={field.label}
            value={formState[activeStep][field.name]}
            error={error}
            errorMessage={errorMessage}
            onChange={(e) => this.onChange(field, e.target.value)}
            required
          />
        );
      case "text_area":
        return (
          <FormControlInput
            key={i}
            className={classes.formControlInput}
            id={`form-input-${field.label}`}
            label={field.label}
            value={formState[activeStep][field.name]}
            error={error}
            errorMessage={errorMessage}
            onChange={(e) => this.onChange(field, e.target.value)}
            required
            multiline
            rows={3}
          />
        );
      case "multiple_choice":
        return (
          <FormControlCheckboxes
            key={i}
            label={field.label}
            options={field.options}
            state={formState[activeStep][field.name]}
            error={error}
            onChange={(v) => this.onChange(field, v)}
          />
        );
      case "single_choice":
        return (
          <FormControlRadios
            key={i}
            label={field.label}
            options={field.options}
            value={formState[activeStep][field.name]}
            error={error}
            onChange={(v) => this.onChange(field, v)}
          />
        );
    }
  };

  renderScreen = (screen) => {
    const { classes, locale, systemLocaleMap, title, form } = this.props;
    const { activeStep } = this.state;

    return (
      <Paper className={classes.formWrapper} square>
        <Typography variant="h6" color="primary">
          {screen.title}
        </Typography>

        <form onSubmit={this.onNext}>{screen.items.map(this.renderField)}</form>

        <FormControl className={classes.buttonsWrapper} fullWidth>
          <div>
            <Button onClick={this.onClose}>
              {systemLocaleMap[locale].close}
            </Button>
          </div>
          <div>
            {activeStep !== form.screens.length - 1 && (
              <Button onClick={this.onSave}>
                {systemLocaleMap[locale].save}
              </Button>
            )}

            {activeStep !== 0 && (
              <Button onClick={this.onBack}>
                {systemLocaleMap[locale].go_back}
              </Button>
            )}

            {activeStep !== form.screens.length - 1 ? (
              <ClickAwayListener onClickAway={this.removeError}>
                <Button color="secondary" onClick={this.onNext}>
                  {systemLocaleMap[locale].next}
                </Button>
              </ClickAwayListener>
            ) : (
              <ClickAwayListener onClickAway={this.removeError}>
                <Button color="secondary" onClick={this.onFinish}>
                  {systemLocaleMap[locale].finish}
                </Button>
              </ClickAwayListener>
            )}
          </div>
        </FormControl>
      </Paper>
    );
  };

  render() {
    const {
      classes,
      locale,
      systemLocaleMap,
      getFormLoading,
      getFormError,
      getFormSavedLoading,
      getFormSavedError,
      form,
    } = this.props;
    const { activeStep, progress, formState } = this.state;

    if (getFormLoading || getFormSavedLoading || !formState.length)
      return <Loading />;
    else if (getFormError || getFormSavedError)
      return <ErrorMessage error={getFormError || getFormSavedError} />;

    const screen = form.screens[activeStep];

    return (
      <Layout
        title={`${systemLocaleMap[locale].app_name} | ${systemLocaleMap[locale].form_title}`}
        description="Umbrella web application"
      >
        <div className={classes.stepperWrapper}>
          <Stepper className={classes.stepper} activeStep={activeStep}>
            {form.screens.map((screen, i) => (
              <Step key={i}>
                <StepLabel>
                  {form.screens.length <= 6 && screen.title}
                </StepLabel>
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

        <Typography
          className={classes.percentage}
          align="center"
          color="secondary"
        >
          {progress}%
        </Typography>

        <div className={classes.content}>{this.renderScreen(screen)}</div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.account,
  ...state.view,
  ...state.forms,
  dbLoading: state.db.loading,
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FormEdit))
);
