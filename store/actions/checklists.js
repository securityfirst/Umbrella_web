import "isomorphic-unfetch";

import { checklistsTypes } from "../types.js";
import {
  pending,
  rejected,
  fulfilled,
} from "../helpers/asyncActionGenerator.js";

import { openAlert } from "./view";

export const getChecklistsSystem = () => async (dispatch, getState) => {
  dispatch(pending(checklistsTypes.GET_CHECKLISTS_SYSTEM));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    return dispatch(fulfilled(checklistsTypes.GET_CHECKLISTS_SYSTEM, {}));
  }

  try {
    const ClientDB = require("../../db");

    await ClientDB.default
      .get("ch_s", state.account.password, true)
      .then((checklists) => {
        dispatch(
          fulfilled(checklistsTypes.GET_CHECKLISTS_SYSTEM, checklists || {})
        );
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(checklistsTypes.GET_CHECKLISTS_SYSTEM, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(checklistsTypes.GET_CHECKLISTS_SYSTEM, e));
  }
};

export const updateChecklistsSystem = (itemName, category, level) => (
  dispatch,
  getState
) => {
  dispatch(pending(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    const message = systemLocaleMap[locale].login_your_password;
    dispatch(openAlert("error", message));
    return dispatch(
      rejected(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM, message)
    );
  }

  try {
    const listKey = `${category} > ${level}`;
    const savedChecklist = state.checklists.checklistsSystem[listKey];

    let newChecklists = { ...state.checklists.checklistsSystem };

    if (!savedChecklist)
      newChecklists[listKey] = { isFavorited: false, items: [itemName] };
    else {
      if (newChecklists[listKey].items.includes(itemName)) {
        newChecklists[listKey].items = newChecklists[listKey].items.filter(
          (item) => item !== itemName
        );
      } else {
        newChecklists[listKey].items.push(itemName);
      }
    }

    const ClientDB = require("../../db");

    ClientDB.default
      .set("ch_s", newChecklists, state.account.password)
      .then(() => {
        // NOTE: Don't alert here, it will trigger for every checkbox
        dispatch(
          fulfilled(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM, newChecklists)
        );
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(checklistsTypes.UPDATE_CHECKLISTS_SYSTEM, e));
  }
};

export const deleteChecklistSystem = (listKey) => (dispatch, getState) => {
  dispatch(pending(checklistsTypes.DELETE_CHECKLIST_SYSTEM));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    const message = systemLocaleMap[locale].login_your_password;
    dispatch(openAlert("error", message));
    return dispatch(rejected(checklistsTypes.DELETE_CHECKLIST_SYSTEM, message));
  }

  try {
    let newChecklists = { ...state.checklists.checklistsSystem };
    delete newChecklists[listKey];

    const ClientDB = require("../../db");

    ClientDB.default
      .set("ch_s", newChecklists, state.account.password)
      .then(() => {
        dispatch(
          openAlert("success", systemLocaleMap[locale].checklist_removed)
        );
        dispatch(
          fulfilled(checklistsTypes.DELETE_CHECKLIST_SYSTEM, newChecklists)
        );
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(checklistsTypes.DELETE_CHECKLIST_SYSTEM, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(checklistsTypes.DELETE_CHECKLIST_SYSTEM, e));
  }
};

export const getChecklistsCustom = () => (dispatch, getState) => {
  dispatch(pending(checklistsTypes.GET_CHECKLISTS_CUSTOM));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    const message = systemLocaleMap[locale].login_your_password;
    dispatch(openAlert("warning", message));
    return dispatch(rejected(checklistsTypes.GET_CHECKLISTS_CUSTOM, message));
  }

  try {
    const ClientDB = require("../../db");

    ClientDB.default
      .get("ch_c", state.account.password, true)
      .then((checklists) => {
        dispatch(
          fulfilled(checklistsTypes.GET_CHECKLISTS_CUSTOM, checklists || [])
        );
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(checklistsTypes.GET_CHECKLISTS_CUSTOM, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(checklistsTypes.GET_CHECKLISTS_CUSTOM, e));
  }
};

export const addChecklistCustom = (name, successCb) => (dispatch, getState) => {
  dispatch(pending(checklistsTypes.ADD_CHECKLIST_CUSTOM));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    const message = systemLocaleMap[locale].login_your_password;
    dispatch(openAlert("error", message));
    return dispatch(rejected(checklistsTypes.ADD_CHECKLIST_CUSTOM, message));
  }

  if (!name) {
    const message = systemLocaleMap[locale].checklist_custom_invalid_name;
    dispatch(openAlert("error", message));
    return dispatch(rejected(checklistsTypes.ADD_CHECKLIST_CUSTOM, message));
  }

  try {
    const checklist = { name, items: [] };
    const checklists = state.checklists.checklistsCustom.concat([checklist]);

    const ClientDB = require("../../db");

    ClientDB.default
      .set("ch_c", checklists, state.account.password)
      .then(() => {
        dispatch(openAlert("success", systemLocaleMap[locale].checklist_added));
        dispatch(fulfilled(checklistsTypes.ADD_CHECKLIST_CUSTOM, checklists));
        !!successCb && successCb();
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(checklistsTypes.ADD_CHECKLIST_CUSTOM, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(checklistsTypes.ADD_CHECKLIST_CUSTOM, e));
  }
};

export const updateChecklistCustom = (checklist, i) => (dispatch, getState) => {
  dispatch(pending(checklistsTypes.UPDATE_CHECKLIST_CUSTOM));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    dispatch(openAlert("warning", systemLocaleMap[locale].login_your_password));
    return window.reload();
  }

  try {
    let checklists = [...state.checklists.checklistsCustom];
    checklists[i] = checklist;

    const ClientDB = require("../../db");

    ClientDB.default
      .set("ch_c", checklists, state.account.password)
      .then(() => {
        dispatch(
          openAlert("success", systemLocaleMap[locale].checklist_updated)
        );
        dispatch(
          fulfilled(checklistsTypes.UPDATE_CHECKLIST_CUSTOM, checklists)
        );
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(checklistsTypes.UPDATE_CHECKLIST_CUSTOM, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(checklistsTypes.UPDATE_CHECKLIST_CUSTOM, e));
  }
};

export const deleteChecklistCustom = (i) => (dispatch, getState) => {
  dispatch(pending(checklistsTypes.DELETE_CHECKLIST_CUSTOM));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    dispatch(openAlert("error", systemLocaleMap[locale].login_your_password));
    return window.reload();
  }

  try {
    let checklists = [...state.checklists.checklistsCustom];
    checklists.splice(i, 1);

    const ClientDB = require("../../db");

    ClientDB.default
      .set("ch_c", checklists, state.account.password)
      .then(() => {
        dispatch(
          openAlert("success", systemLocaleMap[locale].checklist_removed)
        );
        dispatch(
          fulfilled(checklistsTypes.DELETE_CHECKLIST_CUSTOM, checklists)
        );
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(checklistsTypes.DELETE_CHECKLIST_CUSTOM, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(checklistsTypes.DELETE_CHECKLIST_CUSTOM, e));
  }
};

export const toggleChecklistFavorite = (category, level) => (
  dispatch,
  getState
) => {
  dispatch(pending(checklistsTypes.TOGGLE_CHECKLIST_FAVORITE));

  const state = getState();
  const { locale, systemLocaleMap } = state.view;

  if (state.account.isProtected && !state.account.password) {
    const message = systemLocaleMap[locale].login_your_password;
    dispatch(openAlert("warning", message));
    return dispatch(
      rejected(checklistsTypes.TOGGLE_CHECKLIST_FAVORITE, message)
    );
  }

  try {
    const listKey = `${category} > ${level}`;
    const savedChecklist = state.checklists.checklistsSystem[listKey];

    let newChecklists = { ...state.checklists.checklistsSystem };

    if (!savedChecklist)
      newChecklists[listKey] = { isFavorited: true, items: [] };
    else
      newChecklists[listKey].isFavorited = !newChecklists[listKey].isFavorited;

    const ClientDB = require("../../db");

    ClientDB.default
      .set("ch_s", newChecklists, state.account.password)
      .then(() => {
        const message = newChecklists[listKey].isFavorited
          ? systemLocaleMap[locale].checklist_favorite_added
          : systemLocaleMap[locale].checklist_favorite_removed;
        dispatch(openAlert("success", message));
        dispatch(
          fulfilled(checklistsTypes.TOGGLE_CHECKLIST_FAVORITE, newChecklists)
        );
      })
      .catch((err) => {
        dispatch(openAlert("error", systemLocaleMap[locale].general_error));
        dispatch(rejected(checklistsTypes.TOGGLE_CHECKLIST_FAVORITE, err));
      });
  } catch (e) {
    dispatch(openAlert("error", systemLocaleMap[locale].general_error));
    dispatch(rejected(checklistsTypes.TOGGLE_CHECKLIST_FAVORITE, e));
  }
};

export const clearChecklists = () => ({
  type: checklistsTypes.CLEAR_CHECKLISTS,
});
