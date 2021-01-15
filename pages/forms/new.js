import React from "react";
import { connect } from "react-redux";
import Router, { withRouter } from "next/router";

import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
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
    overflow: "auto",
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

class FormsNew extends React.Component {
  static async getInitialProps({ reduxStore, query }) {
    await reduxStore.dispatch(getForm(query.sha));
  }

  state = {
    activeStep: 0,
    formState: [],
    error: null,
    errorMessage: null,
  };

  componentDidMount() {
    const { dispatch, locale, systemLocaleMap, form } = this.props;

    dispatch(setAppbarTitle(systemLocaleMap[locale].form_title));

    this.setState({
      formState: form.screens.map((screen) => {
        return screen.items.reduce((acc, item) => {
          switch (item.type) {
            case "text_input":
            case "text_area":
            case "single_choice":
              acc[item.name] = "";
              break;
            case "multiple_choice":
              acc[item.name] = [];
              break;
          }

          return acc;
        }, {});
      }),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      this.props.dispatch(
        setAppbarTitle(nextProps.systemLocaleMap[nextProps.locale].form_title)
      );
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

  onSave = (e) => {
    const {
      dispatch,
      router,
      locale,
      systemLocaleMap,
      form,
      formSaved,
    } = this.props;
    const { formState } = this.state;

    if (!formSaved) {
      this.setState({ activeStep: 0 });

      const date = new Date();
      const id = ID();

      const newForm = {
        id: id,
        sha: router.query.sha,
        filename: form.title,
        state: formState,
        dateCreated: date.valueOf(),
      };

      return dispatch(
        saveForm(newForm, () => {
          dispatch(resetSaveForm());
          dispatch(openAlert("success", systemLocaleMap[locale].form_saved));

          dispatch(
            getFormSaved(id, (formSavedRetrieved) => {
              this.setState({ formState: formSavedRetrieved.state });
            })
          );
        })
      );
    }

    const date = new Date();

    const formUpdated = {
      ...formSaved,
      state: formState,
      dateModified: date.valueOf(),
    };

    return dispatch(
      saveForm(formUpdated, () => {
        dispatch(openAlert("success", systemLocaleMap[locale].form_saved));
      })
    );
  };

  onClose = (e) => {
    const { locale, systemLocaleMap } = this.props;

    if (confirm(systemLocaleMap[locale].confirm_form_close)) {
      this.setState({ activeStep: 0 });

      Router.push("/forms");
    }
  };

  onNext = (e) => {
    !!e && e.preventDefault();

    const { form } = this.props;
    const { activeStep } = this.state;

    const stepCount = 100 / form.screens.length;

    this.setState({ activeStep: activeStep + 1 });
  };

  onBack = () => {
    const { form } = this.props;
    const { activeStep } = this.state;

    const stepCount = 100 / form.screens.length;

    this.setState((state) => ({ activeStep: activeStep - 1 }));
  };

  onFinish = () => {
    const { dispatch, router, locale, systemLocaleMap, form } = this.props;
    const { formState } = this.state;

    this.setState({ activeStep: 0 });

    const date = new Date();

    const newForm = {
      id: ID(),
      sha: router.query.sha,
      filename: form.title,
      state: formState,
      dateCreated: date.valueOf(),
    };

    dispatch(
      saveForm(newForm, () => {
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
            <Button onClick={this.onSave}>
              {systemLocaleMap[locale].save}
            </Button>
            <Button onClick={this.onClose}>
              {systemLocaleMap[locale].close}
            </Button>
          </div>
          <div>
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
      form,
    } = this.props;
    const { activeStep, formState } = this.state;

    if (getFormLoading || !formState.length) return <Loading />;
    else if (getFormError) return <ErrorMessage error={getFormError} />;

    const screen = form.screens[activeStep];

    return (
      <Layout
        title={`${systemLocaleMap[locale].app_name} | ${systemLocaleMap[locale].form_title}`}
        description="Umbrella web application"
      >
        <div className={classes.stepperWrapper}>
          <Stepper
            className={classes.stepper}
            activeStep={activeStep}
            nonLinear
          >
            {form.screens.map((screen, i) => (
              <Step key={i} onClick={() => this.setState({ activeStep: i })}>
                <StepButton>
                  {form.screens.length <= 6 && screen.title}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </div>

        <div className={classes.content}>{this.renderScreen(screen)}</div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.view,
  ...state.forms,
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FormsNew))
);
