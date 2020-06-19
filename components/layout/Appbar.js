import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Router, { withRouter } from "next/router";
import Link from "next/link";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { toggleMainMenu, setLocale, openAlert } from "../../store/actions/view";

import { viewConstants, localeMap } from "../../utils/view";

const styles = (theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: viewConstants.drawerIconWidth(theme),
    [theme.breakpoints.up("sm")]: {
      marginLeft: viewConstants.drawerWidth,
    },
    width: `calc(100% - ${viewConstants.drawerIconWidth(theme)}px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${viewConstants.drawerWidth}px)`,
    },
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 5,
    marginRight: 5,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 12,
      marginRight: 24,
    },
  },
  title: {
    flexGrow: 1,
  },
  localeIcon: {
    display: "inline-block",
    width: "2rem",
    marginRight: 0,
  },
  login: {
    padding: "8px 16px",
  },
});

class Appbar extends React.Component {
  state = {
    anchorEl: null,
  };

  setLocale = (locale) => () => {
    this.props.dispatch(setLocale(locale));

    this.setState({ anchorEl: null });
  };

  logout = () => {
    const { dispatch, locale, systemLocaleMap } = this.props;
    const Account = require("../../account");

    Account.default.logout();

    dispatch(openAlert("success", systemLocaleMap[locale].logout_success));

    Router.push("/");
  };

  renderRightContent() {
    const { classes, locale, systemLocaleMap, password } = this.props;

    const loginButton = !!password ? (
      <Button
        classes={{ root: classes.login }}
        component="button"
        color="inherit"
        onClick={this.logout}
      >
        {systemLocaleMap[locale].logout}
      </Button>
    ) : (
      <Link href="/login">
        <Button
          classes={{ root: classes.login }}
          component="button"
          color="inherit"
        >
          {systemLocaleMap[locale].login_message_button}
        </Button>
      </Link>
    );

    return (
      <div>
        <IconButton
          aria-label="more"
          aria-controls="locale-menu"
          aria-haspopup="true"
          onClick={(e) => this.setState({ anchorEl: e.currentTarget })}
        >
          <img
            className={classes.localeIcon}
            src={`/static/assets/images/${locale}.png`}
            alt={`Umbrella settings locale ${locale} icon`}
          />
        </IconButton>

        <Menu
          id="locale-menu"
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={() => this.setState({ anchorEl: null })}
        >
          {Object.keys(localeMap).map((loc, i) => {
            if (loc === locale) return null;

            return (
              <MenuItem key={i} onClick={this.setLocale(loc)}>
                <ListItemIcon className={classes.localeIcon}>
                  <img
                    className={classes.localeIcon}
                    src={`/static/assets/images/${loc}.png`}
                    alt={`Umbrella settings locale ${loc} icon`}
                  />
                </ListItemIcon>
              </MenuItem>
            );
          })}
        </Menu>

        {loginButton}
      </div>
    );
  }

  renderLeftContent() {
    const {
      router,
      classes,
      locale,
      systemLocaleMap,
      appbarTitle,
    } = this.props;

    let title =
      appbarTitle ||
      (router.pathname == "/"
        ? systemLocaleMap[locale].app_name
        : // Split all subroutes and print capitalized divided by hyphens
          router.pathname.split("/").slice(1).join(" / "));

    title = title
      .split(" ")
      .map((path) => path.charAt(0).toUpperCase() + path.slice(1, path.length))
      .join(" ");

    return (
      <Typography className={classes.title} variant="h6" color="inherit" noWrap>
        {title}
      </Typography>
    );
  }

  render() {
    const { classes, mainMenuOpened } = this.props;

    return (
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: mainMenuOpened,
        })}
      >
        <Toolbar disableGutters={true}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={() => this.props.dispatch(toggleMainMenu())}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>

          {this.renderLeftContent()}

          {this.renderRightContent()}
        </Toolbar>
      </AppBar>
    );
  }
}

Appbar.propTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  ...state.view,
  ...state.account,
});

export default withRouter(
  connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Appbar))
);
