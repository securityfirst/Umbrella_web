import { accountTypes } from "../types.js";
import {
  pending,
  rejected,
  fulfilled,
} from "../helpers/asyncStatusGenerator.js";
import initialState from "../initialState.js";

export default function reducer(state = initialState, action) {
  switch (action.type) {
    /* LOGIN */
    case pending(accountTypes.LOGIN):
      return {
        ...state,
        loginLoading: true,
      };
    case rejected(accountTypes.LOGIN):
      return {
        ...state,
        loginLoading: false,
        loginError: action.payload,
        password: null,
      };
    case fulfilled(accountTypes.LOGIN):
      return {
        ...state,
        loginLoading: false,
        loginError: null,
        password: action.payload,
      };

    /* CHECK_PROTECTED */
    case pending(accountTypes.CHECK_PROTECTED):
      return {
        ...state,
        checkProtectedLoading: true,
        checkProtectedError: null,
      };
    case rejected(accountTypes.CHECK_PROTECTED):
      return {
        ...state,
        checkProtectedLoading: false,
        checkProtectedError: action.payload,
      };
    case fulfilled(accountTypes.CHECK_PROTECTED):
      return {
        ...state,
        checkProtectedLoading: false,
        checkProtectedError: null,
        isProtected: action.payload,
      };

    /* CHECK_PASSWORD */
    case pending(accountTypes.CHECK_PASSWORD):
      return {
        ...state,
        checkPasswordLoading: true,
        checkPasswordError: null,
      };
    case rejected(accountTypes.CHECK_PASSWORD):
      return {
        ...state,
        checkPasswordLoading: false,
        checkPasswordError: action.payload,
      };
    case fulfilled(accountTypes.CHECK_PASSWORD):
      return {
        ...state,
        checkPasswordLoading: false,
        checkPasswordError: null,
        passwordExists: action.payload,
      };

    /* SAVE_PASSWORD */
    case pending(accountTypes.SAVE_PASSWORD):
      return {
        ...state,
        savePasswordLoading: true,
        savePasswordError: null,
        savePasswordSuccess: false,
      };
    case rejected(accountTypes.SAVE_PASSWORD):
      return {
        ...state,
        savePasswordLoading: false,
        savePasswordError: action.payload,
        savePasswordSuccess: false,
      };
    case fulfilled(accountTypes.SAVE_PASSWORD):
      return {
        ...state,
        savePasswordLoading: false,
        savePasswordError: null,
        savePasswordSuccess: true,
        password: action.payload,
      };

    /* RESET_PASSWORD */
    case pending(accountTypes.RESET_PASSWORD):
      return {
        ...state,
        resetPasswordLoading: true,
        resetPasswordError: null,
      };
    case rejected(accountTypes.RESET_PASSWORD):
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordError: action.payload,
      };
    case fulfilled(accountTypes.RESET_PASSWORD):
      return {
        ...state,
        resetPasswordLoading: false,
        resetPasswordError: null,
        password: action.payload,
      };

    /* UNSET_PASSWORD */
    case pending(accountTypes.UNSET_PASSWORD):
      return {
        ...state,
        unsetPasswordLoading: true,
        unsetPasswordError: null,
      };
    case rejected(accountTypes.UNSET_PASSWORD):
      return {
        ...state,
        unsetPasswordLoading: false,
        unsetPasswordError: action.payload,
      };

    /* CLEAR_PASSWORD */
    case accountTypes.CLEAR_PASSWORD:
      return {
        ...state,
        ...initialState.account,
      };
  }

  return state;
}
