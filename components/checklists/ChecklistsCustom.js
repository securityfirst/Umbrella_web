import React from "react";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";

import ChecklistsPanel from "./ChecklistsPanel";
import ChecklistsCustomAdd from "./ChecklistsCustomAdd";
import Loading from "../common/Loading";
import ErrorMessage from "../common/ErrorMessage";
import AddButton from "../common/AddButton";

import { contentStyles, paperStyles } from "../../utils/view";

import { getChecklistsCustom } from "../../store/actions/checklists";
import { openAlert } from "../../store/actions/view";

const styles = (theme) => ({
  ...contentStyles(theme),
  panel: {
    display: "flex",
    justifyContent: "space-between",
    margin: ".75rem 0",
    ...paperStyles(theme),
  },
  text: {
    width: "100%",
    margin: "1rem 0",
    textAlign: "center",
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

class ChecklistsCustom extends React.Component {
  state = {
    expanded: false,
    modalOpen: false,
  };

  componentWillMount() {
    this.props.dispatch(getChecklistsCustom());
  }

  handlePanelToggle = (i) => (e, expanded) => {
    this.setState({ expanded: expanded ? i : false });
  };

  handleModalOpen = () => {
    const {
      dispatch,
      locale,
      systemLocaleMap,
      isProtected,
      password,
    } = this.props;

    if (isProtected && !password) {
      return dispatch(
        openAlert("error", systemLocaleMap[locale].login_your_password)
      );
    }

    this.setState({ modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  renderChecklists = () => {
    const { classes, locale, systemLocaleMap, checklistsCustom } = this.props;
    const { expanded } = this.state;

    if (!checklistsCustom.length)
      return (
        <Paper className={classes.panel} square>
          <Typography className={classes.text} paragraph>
            {systemLocaleMap[locale].checklist_empty_message}
          </Typography>
        </Paper>
      );

    return (
      <React.Fragment>
        {checklistsCustom.map((checklist, i) => (
          <ChecklistsPanel
            key={i}
            index={i}
            checklist={checklist}
            isCustom={true}
            expanded={expanded}
            handlePanelToggle={this.handlePanelToggle}
          />
        ))}
      </React.Fragment>
    );
  };

  render() {
    const {
      classes,
      locale,
      systemLocaleMap,
      isProtected,
      password,
      getChecklistsCustomLoading,
      getChecklistsCustomError,
    } = this.props;
    const { modalOpen } = this.state;

    if (isProtected && !password)
      return (
        <div className={classes.content}>
          <Paper className={classes.panel} square>
            <Typography className={classes.text} paragraph>
              {systemLocaleMap[locale].checklist_login}
            </Typography>
          </Paper>
        </div>
      );

    if (getChecklistsCustomLoading) return <Loading />;
    if (getChecklistsCustomError)
      return <ErrorMessage error={getChecklistsCustomError} />;

    return (
      <div className={classes.content}>
        {this.renderChecklists()}

        <AddButton onClick={this.handleModalOpen} />

        <Modal
          className={classes.modal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={modalOpen}
          onClose={this.handleModalClose}
          disableAutoFocus
        >
          <ChecklistsCustomAdd closeModal={this.handleModalClose} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.view,
  ...state.account,
  ...state.checklists,
});

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(ChecklistsCustom)
);
