import "isomorphic-unfetch";
import YAML from "yaml";

import { pathwaysTypes } from "../types.js";
import {
  pending,
  rejected,
  fulfilled,
} from "../helpers/asyncActionGenerator.js";

import { openAlert } from "./view";

import { decodeBlob } from "../../utils/github";

export const getPathwayFile = (sha) => async (dispatch, getState) => {
  dispatch(pending(pathwaysTypes.GET_PATHWAY_FILE));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  await fetch(`${process.env.ROOT}/api/github/content/${sha}`)
    .then((res) => {
      if (!res.ok) throw res;
      return res.text();
    })
    .then((content) => {
      dispatch(
        fulfilled(
          pathwaysTypes.GET_PATHWAY_FILE,
          YAML.parse(decodeBlob(content))
        )
      );
    })
    .catch((err) => {
      dispatch(openAlert("error", systemLocaleMap[locale].general_error));
      dispatch(rejected(pathwaysTypes.GET_PATHWAY_FILE, err));
    });
};

export const updatePathwaysChecked = (pathwayTitle, item) => async (
  dispatch,
  getState
) => {
  dispatch(pending(pathwaysTypes.UPDATE_PATHWAYS_CHECKED));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    const message = systemLocaleMap[locale].login_your_password;
    dispatch(openAlert("error", message));
    return dispatch(rejected(pathwaysTypes.UPDATE_PATHWAYS_CHECKED, message));
  }

  try {
    const savedPathway = state.pathways.pathwaysChecked[pathwayTitle];

    let newPathwaysChecked = { ...state.pathways.pathwaysChecked };

    if (!savedPathway) newPathwaysChecked[pathwayTitle] = [item.check];
    else {
      if (newPathwaysChecked[pathwayTitle].includes(item.check)) {
        newPathwaysChecked[pathwayTitle] = newPathwaysChecked[
          pathwayTitle
        ].filter((i) => i !== item.check);
      } else {
        newPathwaysChecked[pathwayTitle].push(item.check);
      }
    }

    const ClientDB = require("../../db");

    ClientDB.default
      .set("pa_c", newPathwaysChecked, state.account.password)
      .then(() => {
        // NOTE: Don't alert here, it will trigger for every checkbox
        dispatch(
          fulfilled(pathwaysTypes.UPDATE_PATHWAYS_CHECKED, newPathwaysChecked)
        );
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(pathwaysTypes.UPDATE_PATHWAYS_CHECKED, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(pathwaysTypes.UPDATE_PATHWAYS_CHECKED, e));
  }
};

export const getPathwaysSaved = () => async (dispatch, getState) => {
  dispatch(pending(pathwaysTypes.GET_PATHWAYS_SAVED));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    return dispatch(fulfilled(pathwaysTypes.GET_PATHWAYS_SAVED, {}));
  }

  try {
    const ClientDB = require("../../db");

    await ClientDB.default
      .get("pa_s", state.account.password, true)
      .then((pathwaysSaved) => {
        dispatch(
          fulfilled(pathwaysTypes.GET_PATHWAYS_SAVED, pathwaysSaved || {})
        );
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(pathwaysTypes.GET_PATHWAYS_SAVED, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(pathwaysTypes.GET_PATHWAYS_SAVED, e));
  }
};

export const updatePathwaysSaved = (pathway) => (dispatch, getState) => {
  dispatch(pending(pathwaysTypes.UPDATE_PATHWAYS_SAVED));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    const message = systemLocaleMap[locale].login_your_password;
    dispatch(openAlert("error", message));
    return dispatch(rejected(pathwaysTypes.UPDATE_PATHWAYS_SAVED, message));
  }

  try {
    const savedPathway = state.pathways.pathwaysSaved.find(
      (p) => p.filename === pathway.filename
    );

    let newPathwaysSaved = [...state.pathways.pathwaysSaved];

    if (!savedPathway) newPathwaysSaved.push(pathway);
    else
      newPathwaysSaved = newPathwaysSaved.filter(
        (p) => p.filename !== pathway.filename
      );

    const ClientDB = require("../../db");

    ClientDB.default
      .set("pa_s", newPathwaysSaved, state.account.password)
      .then(() => {
        dispatch(
          openAlert("success", systemLocaleMap[locale].checklist_updated)
        );
        dispatch(
          fulfilled(pathwaysTypes.UPDATE_PATHWAYS_SAVED, newPathwaysSaved)
        );
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(pathwaysTypes.UPDATE_PATHWAYS_SAVED, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(pathwaysTypes.UPDATE_PATHWAYS_SAVED, e));
  }
};

export const clearPathways = () => ({ type: pathwaysTypes.CLEAR_CHECKLISTS });
