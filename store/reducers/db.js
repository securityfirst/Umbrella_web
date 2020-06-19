import { dbTypes } from "../types.js";
import {
  pending,
  rejected,
  fulfilled,
} from "../helpers/asyncStatusGenerator.js";
import initialState from "../initialState.js";

export default function reducer(state = initialState, action) {
  switch (action.type) {
    /* SYNC_DB */
    case pending(dbTypes.SYNC_DB):
      return {
        ...state,
        loading: true,
      };
    case rejected(dbTypes.SYNC_DB):
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case fulfilled(dbTypes.SYNC_DB):
      return {
        ...state,
        loading: false,
        error: null,
      };

    /* ENCRYPT_DB */
    case pending(dbTypes.ENCRYPT_DB):
      return {
        ...state,
        loading: true,
      };
    case rejected(dbTypes.ENCRYPT_DB):
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case fulfilled(dbTypes.ENCRYPT_DB):
      return {
        ...state,
        loading: false,
        error: null,
      };

    /* RESET_DB_ENCRYPTION */
    case pending(dbTypes.RESET_DB_ENCRYPTION):
      return {
        ...state,
        loading: true,
      };
    case rejected(dbTypes.RESET_DB_ENCRYPTION):
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case fulfilled(dbTypes.RESET_DB_ENCRYPTION):
      return {
        ...state,
        loading: false,
        error: null,
      };

    /* CLEAR_DB */
    case pending(dbTypes.CLEAR_DB):
      return {
        ...state,
        loading: true,
      };
    case rejected(dbTypes.CLEAR_DB):
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case fulfilled(dbTypes.CLEAR_DB):
      return {
        ...state,
        loading: false,
        error: null,
      };
  }

  return state;
}
