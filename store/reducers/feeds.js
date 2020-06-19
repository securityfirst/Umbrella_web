import { feedsTypes } from "../types.js";
import {
  pending,
  rejected,
  fulfilled,
} from "../helpers/asyncStatusGenerator.js";
import initialState from "../initialState.js";

export default function reducer(state = initialState, action) {
  switch (action.type) {
    /* GET_FEEDS */
    case pending(feedsTypes.GET_FEEDS):
      return {
        ...state,
        getFeedsLoading: true,
      };
    case rejected(feedsTypes.GET_FEEDS):
      return {
        ...state,
        getFeedsLoading: false,
        getFeedsError: action.payload,
      };
    case fulfilled(feedsTypes.GET_FEEDS):
      return {
        ...state,
        getFeedsLoading: false,
        getFeedsError: null,
        feeds: action.payload,
      };

    /* SET_FEED_LOCATION */
    case pending(feedsTypes.SET_FEED_LOCATION):
      return {
        ...state,
        setFeedLocationLoading: true,
      };
    case rejected(feedsTypes.SET_FEED_LOCATION):
      return {
        ...state,
        setFeedLocationLoading: false,
        setFeedLocationError: action.payload,
      };
    case fulfilled(feedsTypes.SET_FEED_LOCATION):
      return {
        ...state,
        setFeedLocationLoading: false,
        setFeedLocationError: null,
        feedLocation: action.payload,
      };

    /* SET_FEED_SOURCES */
    case pending(feedsTypes.SET_FEED_SOURCES):
      return {
        ...state,
        setFeedSourcesLoading: true,
      };
    case rejected(feedsTypes.SET_FEED_SOURCES):
      return {
        ...state,
        setFeedSourcesLoading: false,
        setFeedSourcesError: action.payload,
      };
    case fulfilled(feedsTypes.SET_FEED_SOURCES):
      return {
        ...state,
        setFeedSourcesLoading: false,
        setFeedSourcesError: null,
        feedSources: action.payload || [],
      };

    /* GET_RSS */
    case pending(feedsTypes.GET_RSS):
      return {
        ...state,
        getRssLoading: true,
      };
    case rejected(feedsTypes.GET_RSS):
      return {
        ...state,
        getRssLoading: false,
        getRssError: action.payload,
      };
    case fulfilled(feedsTypes.GET_RSS):
      return {
        ...state,
        getRssLoading: false,
        getRssError: null,
        rss: action.payload,
      };

    /* ADD_RSS_SOURCE */
    case pending(feedsTypes.ADD_RSS_SOURCE):
      return {
        ...state,
        addRssSourceLoading: true,
      };
    case rejected(feedsTypes.ADD_RSS_SOURCE):
      return {
        ...state,
        addRssSourceLoading: false,
        addRssSourceError: action.payload,
      };
    case fulfilled(feedsTypes.ADD_RSS_SOURCE):
      return {
        ...state,
        addRssSourceLoading: false,
        addRssSourceError: null,
        rssSources: action.payload.sources, // New source already concatenated
        rss: action.payload.rss, // New rss already concatenated
      };

    /* REMOVE_RSS_SOURCE */
    case pending(feedsTypes.REMOVE_RSS_SOURCE):
      return {
        ...state,
        removeRssSourceLoading: true,
      };
    case rejected(feedsTypes.REMOVE_RSS_SOURCE):
      return {
        ...state,
        removeRssSourceLoading: false,
        removeRssSourceError: action.payload,
      };
    case fulfilled(feedsTypes.REMOVE_RSS_SOURCE):
      return {
        ...state,
        removeRssSourceLoading: false,
        removeRssSourceError: null,
        rssSources: action.payload.sources, // Source already filtered
        rss: action.payload.rss, // Feed already filtered
      };

    /* SYNC_FEEDS */
    case feedsTypes.SYNC_FEEDS:
      return {
        ...state,
        ...action.payload,
      };

    /* CLEAR_FEEDS */
    case feedsTypes.CLEAR_FEEDS:
      return {
        ...state,
        ...initialState.feeds,
      };
  }

  return state;
}
