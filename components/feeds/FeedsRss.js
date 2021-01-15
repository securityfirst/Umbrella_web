import React from "react";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

import RssSourceAdd from "./RssSourceAdd";
import Loading from "../common/Loading";
import ErrorMessage from "../common/ErrorMessage";
import Marked from "../common/Marked";
import AddButton from "../common/AddButton";

import { contentStyles, paperStyles } from "../../utils/view";

import { getRss, removeRssSource } from "../../store/actions/feeds";

const styles = (theme) => ({
  ...contentStyles(theme),
  card: {
    margin: ".75rem 0",
    padding: 0,
  },
  cardContent: {
    padding: "1rem",
  },
  cardRemoveWrapper: {
    padding: "0 1rem",
    paddingBottom: "1rem",
  },
  cardDescription: {
    margin: ".5rem 0 0",
    color: theme.palette.grey[600],
  },
  contentPanel: {
    margin: ".75rem 0",
    ...paperStyles(theme),
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

class FeedsRss extends React.Component {
  state = {
    sourceSelected: null,
    modalOpen: false,
  };

  componentWillMount() {
    this.props.dispatch(getRss());
  }

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  handleSourceRemove = (index) => () => {
    const { dispatch, locale, systemLocaleMap } = this.props;

    if (confirm(systemLocaleMap[locale].confirm_checklist_delete_rss)) {
      dispatch(removeRssSource(index));
    }
  };

  handleSourceClick = (source) => () => {
    this.setState({ sourceSelected: source });
  };

  handleArticleClick = (article) => () => {
    const win = window.open(article.link, "_blank");
    win.focus();
  };

  goBack = () => {
    this.setState({ sourceSelected: null });
  };

  renderSource = (source, i) => {
    const { classes, locale, systemLocaleMap } = this.props;

    return (
      <Card key={i} className={classes.card} square>
        <CardActionArea onClick={this.handleSourceClick(source)}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6">{source.title}</Typography>
            <Typography className={classes.cardDescription} paragraph>
              {source.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        {i > 6 && (
          <CardContent className={classes.cardRemoveWrapper}>
            <Button
              component="button"
              size="small"
              onClick={this.handleSourceRemove(i)}
            >
              {systemLocaleMap[locale].delete}
            </Button>
          </CardContent>
        )}
      </Card>
    );
  };

  renderArticle = (article, i) => {
    const { classes } = this.props;

    return (
      <Card key={i} className={classes.card} square>
        <CardActionArea onClick={this.handleArticleClick(article)}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6">{article.title}</Typography>
            <Typography className={classes.cardDescription} paragraph>
              {article.contentSnippet}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  renderContent = () => {
    const { getRssLoading, getRssError, rss } = this.props;
    const { sourceSelected } = this.state;

    if (getRssLoading) return <Loading />;
    if (getRssError) return <ErrorMessage error={getRssError} />;

    if (sourceSelected)
      return (
        <React.Fragment>
          <Button onClick={this.goBack}>Go Back</Button>

          {sourceSelected.items.map(this.renderArticle)}
        </React.Fragment>
      );

    return <React.Fragment>{rss.map(this.renderSource)}</React.Fragment>;
  };

  render() {
    const { classes } = this.props;
    const { modalOpen } = this.state;

    return (
      <React.Fragment>
        {this.renderContent()}

        <AddButton onClick={this.handleModalOpen} />

        <Modal
          className={classes.modal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={modalOpen}
          onClose={this.handleModalClose}
          disableAutoFocus
        >
          <RssSourceAdd closeModal={this.handleModalClose} />
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.view,
  ...state.feeds,
});

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(FeedsRss)
);
