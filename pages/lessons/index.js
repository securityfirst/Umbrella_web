import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Layout from "../../components/layout";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import LessonsMenu from "../../components/lessons/LessonsMenu";

import { contentStyles, paperStyles } from "../../utils/view";

import { setAppbarTitle, toggleLessonsMenu } from "../../store/actions/view";

const styles = (theme) => ({
  ...contentStyles(theme),
  contentAdditional: {
    [theme.breakpoints.down("md")]: {
      paddingTop: "50px",
    },
  },
  wrapper: {
    position: "relative",
    display: "flex",
    flex: 1,
    height: "100%",
  },
  intro: {
    ...paperStyles(theme),
  },
  introTitle: {
    display: "block",
    margin: "1rem 0",
    fontSize: "1.25rem",
    lineHeight: 1,
    textTransform: "capitalize",
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.5rem",
    },
  },
  descriptionMobile: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  descriptionDesktop: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
});

class Lessons extends React.Component {
  componentDidMount() {
    const { dispatch, locale, systemLocaleMap } = this.props;
    dispatch(setAppbarTitle(systemLocaleMap[locale].lesson_title));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      this.props.dispatch(
        setAppbarTitle(nextProps.systemLocaleMap[nextProps.locale].lesson_title)
      );
    }
  }

  componentWillUnmount() {
    this.props.dispatch(toggleLessonsMenu(false));
  }

  render() {
    const { classes, locale, systemLocaleMap } = this.props;

    return (
      <Layout
        title={`${systemLocaleMap[locale].app_name} | ${systemLocaleMap[locale].lesson_title}`}
        description="Umbrella web application"
      >
        <div className={classes.wrapper}>
          <LessonsMenu />

          <div
            className={classNames(classes.content, classes.contentAdditional)}
          >
            <Paper className={classes.intro}>
              <Typography className={classes.introTitle} variant="h2">
                {systemLocaleMap[locale].lesson_title}
              </Typography>
              <Typography paragraph>
                {systemLocaleMap[locale].lesson_welcome_message}
              </Typography>
            </Paper>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.view,
});

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(Lessons)
);
