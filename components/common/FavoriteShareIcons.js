import "isomorphic-unfetch";
import React from "react";
import { withRouter } from "next/router";
import atob from "atob";
import marked from "marked";
import replace from "batch-replace";
import { connect } from "react-redux";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import BookmarkIcon from "@material-ui/icons/Bookmark";
import DeleteIcon from "@material-ui/icons/Delete";
import ShareIcon from "@material-ui/icons/Share";
import GetAppIcon from "@material-ui/icons/GetApp";
import LinkIcon from "@material-ui/icons/Link";

import teal from "@material-ui/core/colors/teal";
import yellow from "@material-ui/core/colors/yellow";

import { openAlert } from "../../store/actions/view";

import { formatContentUrls } from "../../utils/github";
import { downloadPdf, downloadHtml, downloadDocx } from "../../utils/dom";
import { decodeBlob } from "../../utils/github";

const styles = (theme) => ({
  cardActionIcon: {
    color: theme.palette.grey[600],
  },
  cardActionIconWhite: {
    color: theme.palette.common.white,
  },
  cardActionIconYellow: {
    color: yellow[500],
  },
  cardActionIconTeal: {
    color: teal[500],
  },
  cardActionIconTealLight: {
    color: teal[200],
  },
  copyInput: {
    maxWidth: "10rem",
  },
});

class FavoriteShareIcon extends React.Component {
  state = {
    anchorEl: null,
    tooltipOpen: false,
    downloadOpen: false,
  };

  handleClick = (e) => this.setState({ anchorEl: e.currentTarget });

  handleClose = () => this.setState({ anchorEl: null });

  handleCopyLink = () => {
    const { dispatch, locale, systemLocaleMap } = this.props;

    if (typeof document === "undefined") return false;

    if (!document.queryCommandSupported("copy")) {
      dispatch(openAlert("error", systemLocaleMap[locale].browser_unsupported));
      return false;
    }

    this.copyInput.focus();
    this.copyInput.select();

    if (document.execCommand("copy")) {
      this.setState({ tooltipOpen: true }, () => {
        setTimeout(() => {
          this.setState({ tooltipOpen: false });
        }, 1500);
      });
    }
  };

  toggleDownloadList = () => {
    this.setState({ downloadOpen: !this.state.downloadOpen });
  };

  downloadHtml = () => {
    const {
      router,
      dispatch,
      content,
      locale,
      systemLocaleMap,
      type,
      name,
      sha,
      category,
      level,
    } = this.props;

    const cat = category || router.query.category;
    const lev = level || router.query.level;

    dispatch(openAlert("info", systemLocaleMap[locale].downloading_html));

    fetch(`${process.env.ROOT}/api/github/content/${sha}`)
      .then((res) => {
        if (!res.ok) throw res;
        return res.text();
      })
      .then((blob) => {
        if (type === "lesson") {
          downloadHtml(
            name,
            '<h1 id="title">Umbrella Lesson</h1>' +
              `<h2 id="subtitle">${cat.split(".").join("/")}: ${lev}</h2>` +
              marked(
                formatContentUrls({
                  blob,
                  locale,
                  category: cat,
                  level: lev,
                  content,
                })
              )
          );
        } else if (type === "checklist") {
          let markdown = marked(decodeBlob(blob));
          markdown = replace(/check\:/g)
            .with('<input type="checkbox" style="margin-right: .5rem;" />')
            .in(markdown);

          downloadHtml(
            name,
            '<h1 id="title">Umbrella Checklist</h1>' +
              `<h2 id="subtitle">${cat.split(".").join("/")}: ${lev}</h2>` +
              `<div id="checklist">${markdown}</div>`
          );
        } else {
          downloadHtml(name, marked(decodeBlob(blob)));
        }

        dispatch(openAlert("success", systemLocaleMap[locale].downloaded));

        this.handleClose();
      })
      .catch((err) => {
        console.error("FavoriteShareIcons handleDownload error: ", err);
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
      });
  };

  downloadPdf = () => {
    const {
      router,
      dispatch,
      content,
      locale,
      systemLocaleMap,
      type,
      name,
      sha,
      category,
      level,
    } = this.props;

    const cat = category || router.query.category;
    const lev = level || router.query.level;

    dispatch(openAlert("info", systemLocaleMap[locale].downloading_pdf));

    fetch(`${process.env.ROOT}/api/github/content/${sha}`)
      .then((res) => {
        if (!res.ok) throw res;
        return res.text();
      })
      .then((blob) => {
        if (type === "lesson") {
          downloadPdf(
            name,
            '<h1 id="title">Umbrella Lesson</h1>' +
              `<h2 id="subtitle">${cat.split(".").join("/")}: ${lev}</h2>` +
              marked(
                formatContentUrls({
                  blob,
                  locale,
                  category: cat,
                  level: lev,
                  content,
                })
              )
          );
        } else if (type === "checklist") {
          let markdown = marked(decodeBlob(blob));
          markdown = replace(/check\:/g)
            .with('<input type="checkbox" style="margin-right: .5rem;" />')
            .in(markdown);

          downloadPdf(
            name,
            '<h1 id="title">Umbrella Checklist</h1>' +
              `<h2 id="subtitle">${cat.split(".").join("/")}: ${lev}</h2>` +
              `<div id="checklist">${markdown}</div>`
          );
        } else {
          downloadPdf(name, marked(decodeBlob(blob)));
        }

        dispatch(openAlert("success", systemLocaleMap[locale].downloaded));
        this.handleClose();
      })
      .catch((err) => {
        console.error("FavoriteShareIcons handleDownload error: ", err);
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
      });
  };

  downloadDocx = () => {
    const {
      router,
      dispatch,
      content,
      locale,
      systemLocaleMap,
      type,
      name,
      sha,
      category,
      level,
    } = this.props;

    const cat = category || router.query.category;
    const lev = level || router.query.level;

    dispatch(openAlert("info", systemLocaleMap[locale].downloading_docx));

    fetch(`${process.env.ROOT}/api/github/content/${sha}`)
      .then((res) => {
        if (!res.ok) throw res;
        return res.text();
      })
      .then((blob) => {
        if (type === "lesson") {
          downloadDocx(
            name,
            '<h1 id="title">Umbrella Lesson</h1>' +
              `<h2 id="subtitle">${cat.split(".").join("/")}: ${lev}</h2>` +
              marked(
                formatContentUrls({
                  blob,
                  locale,
                  category: cat,
                  level: lev,
                  content,
                })
              )
          );
        } else if (type === "checklist") {
          let markdown = marked(decodeBlob(blob));
          markdown = replace(/check\:/g)
            .with('<input type="checkbox" style="margin-right: .5rem;" />')
            .in(markdown);

          downloadDocx(
            name,
            '<h1 id="title">Umbrella Checklist</h1>' +
              `<h2 id="subtitle">${cat.split(".").join("/")}: ${lev}</h2>` +
              `<div id="checklist">${markdown}</div>`
          );
        } else {
          downloadDocx(name, marked(decodeBlob(blob)));
        }

        dispatch(openAlert("success", systemLocaleMap[locale].downloaded));
        this.handleClose();
      })
      .catch((err) => {
        console.error("FavoriteShareIcons handleDownload error: ", err);
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
      });
  };

  render() {
    const {
      classes,
      locale,
      systemLocaleMap,
      classNameShare,
      isFavorited,
      isFavoriteAdded,
      isLight,
      url,
      onFavoriteToggle,
      onFavoriteRemove,
    } = this.props;
    const { anchorEl, tooltipOpen, downloadOpen } = this.state;

    const index = Math.floor(Math.random() * 1000000);

    return (
      <React.Fragment>
        {isFavorited && (
          <IconButton
            size="small"
            className={classNames(
              classes.cardActionIcon,
              isLight ? classes.cardActionIconWhite : null,
              isFavoriteAdded
                ? isLight
                  ? classes.cardActionIconTealLight
                  : classes.cardActionIconTeal
                : null
            )}
            onClick={onFavoriteToggle}
          >
            <BookmarkIcon />
          </IconButton>
        )}
        <IconButton
          size="small"
          className={classNames(
            classes.cardActionIcon,
            classNameShare,
            isLight ? classes.cardActionIconWhite : null
          )}
          aria-owns={anchorEl ? `share-menu-${index}` : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <ShareIcon />
        </IconButton>

        <Menu
          id={`share-menu-${index}`}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <ListItem button onClick={this.toggleDownloadList}>
            <ListItemIcon className={classes.menuListItemIcon}>
              <GetAppIcon />
            </ListItemIcon>
            <ListItemText
              className={classes.menuListItemText}
              inset
              primary={systemLocaleMap[locale].download_title}
            />

            {downloadOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={downloadOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button onClick={this.downloadHtml}>
                <ListItemText primary="HTML" />
              </ListItem>
              <ListItem button onClick={this.downloadPdf}>
                <ListItemText primary="PDF" />
              </ListItem>
              <ListItem button onClick={this.downloadDocx}>
                <ListItemText primary="DOCX" />
              </ListItem>
            </List>
          </Collapse>

          {Boolean(url) && (
            <Tooltip
              open={tooltipOpen}
              title={systemLocaleMap[locale].copied}
              placement="right"
            >
              <ListItem onClick={this.handleCopyLink}>
                <ListItemIcon>
                  <LinkIcon />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={systemLocaleMap[locale].copy_link}
                />
                <input
                  ref={(el) => (this.copyInput = el)}
                  className={classes.copyInput}
                  type="text"
                  tabIndex="-1"
                  aria-hidden="true"
                  defaultValue={url}
                />
              </ListItem>
            </Tooltip>
          )}
        </Menu>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.content,
  ...state.view,
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(FavoriteShareIcon))
);
