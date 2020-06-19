import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Layout from "../components/layout";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import FeedsAll from "../components/feeds/FeedsAll";
import FeedsEdit from "../components/feeds/FeedsEdit";
import FeedsRss from "../components/feeds/FeedsRss";

import { contentStyles } from "../utils/view";

import { getFeeds } from "../store/actions/feeds";
import { setAppbarTitle } from "../store/actions/view";

const styles = (theme) => ({
  ...contentStyles(theme),
  tabs: {
    backgroundColor: theme.palette.background.paper,
  },
});

class Feeds extends React.Component {
  static async getInitialProps({ reduxStore }) {
    const store = reduxStore.getState();
    const { feedLocation, feedSources } = store.feeds;

    if (feedLocation && feedSources.length) {
      await reduxStore.dispatch(getFeeds());
    }
  }

  state = {
    isEdit: !this.props.feedLocation && !this.props.feedSources.length,
    tabIndex: 0,
  };

  componentDidMount() {
    const { dispatch, locale, systemLocaleMap } = this.props;
    dispatch(setAppbarTitle(systemLocaleMap[locale].feed_title));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      this.props.dispatch(
        setAppbarTitle(nextProps.systemLocaleMap[nextProps.locale].feed_title)
      );
    }
  }

  handleTabSelect = (e, v) => {
    let state = { tabIndex: v };
    if (v !== 0) state["isEdit"] = false;
    this.setState(state);
  };

  renderFeedsView = () => {
    const {
      getFeedsLoading,
      getFeedsError,
      feeds,
      feedLocation,
      feedSources,
    } = this.props;
    const { isEdit, tabIndex } = this.state;

    if (getFeedsLoading) return <Loading />;
    if (getFeedsError) return <ErrorMessage error={getFeedsError} />;
    if (isEdit || !feedLocation || !feedSources)
      return <FeedsEdit toggleEdit={() => this.setState({ isEdit: false })} />;

    return <FeedsAll toggleEdit={() => this.setState({ isEdit: true })} />;
  };

  renderContent = () => {
    const { classes } = this.props;
    const { tabIndex } = this.state;

    switch (tabIndex) {
      case 0:
        return this.renderFeedsView();
      case 1:
        return <FeedsRss />;
    }
  };

  render() {
    const { classes, locale, systemLocaleMap } = this.props;
    const { tabIndex } = this.state;

    return (
      <Layout
        title={`${systemLocaleMap[locale].app_name} | ${systemLocaleMap[locale].feed_title}`}
        description="Umbrella web application"
      >
        <Tabs
          className={classes.tabs}
          value={tabIndex}
          onChange={this.handleTabSelect}
        >
          <Tab label={systemLocaleMap[locale].feed_title_tab} />
          <Tab label={systemLocaleMap[locale].feed_rss_title_tab} />
        </Tabs>

        <div className={classes.content}>{this.renderContent()}</div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.view,
  ...state.feeds,
});

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(Feeds)
);
