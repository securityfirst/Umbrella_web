import systemLocaleMap from "./systemLocaleMap";

const content = {
  getContentLoading: false,
  getContentError: null,
  content: null,
};

const account = {
  loginLoading: false,
  loginError: null,
  password: null,
  checkProtectedLoading: false,
  checkProtectedError: null,
  isProtected: false,
  checkPasswordLoading: false,
  checkPasswordError: null,
  passwordExists: false,
  savePasswordLoading: false,
  savePasswordError: null,
  savePasswordSuccess: false,
  resetPasswordLoading: false,
  resetPasswordError: null,
  unsetPasswordLoading: false,
  unsetPasswordError: null,
};

const feeds = {
  loading: false,
  error: null,
  feeds: [],
  feedLocation: null,
  feedSources: [],
  getRssLoading: false,
  getRssError: null,
  rss: [],
  rssSources: [
    "http://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://threatpost.com/feed/",
    "https://krebsonsecurity.com/feed/",
    "https://nakedsecurity.sophos.com/feed/",
    "http://rss.cnn.com/rss/cnn_world.rss",
    "https://www.theguardian.com/world/rss",
  ],
};

const forms = {
  getFormLoading: false,
  getFormError: null,
  form: null,
  getFormSavedLoading: false,
  getFormSavedError: null,
  formSaved: null,
  saveFormLoading: false,
  saveFormError: null,
  saveFormSuccess: false,
  deleteFormLoading: false,
  deleteFormError: null,
  deleteFormSuccess: false,
  formsSaved: [],
};

const lessons = {
  lessonsGlossaryIndex: null,
  getLessonChecklistLoading: false,
  getLessonChecklistError: null,
  currentLessonChecklist: null,
  getLessonFileLoading: false,
  getLessonFileError: null,
  currentLessonFile: null,
  getLessonCardsFavorites: false,
  getLessonCardsError: null,
  lessonCardsFavorites: [],
  addLessonCardFavoriteLoading: false,
  addLessonCardFavoriteError: null,
  removeLessonCardFavoriteLoading: false,
  removeLessonCardFavoriteError: null,
};

const checklists = {
  getChecklistsSystemLoading: false,
  getChecklistsSystemError: null,
  checklistsSystem: {},
  updateChecklistsSystemLoading: false,
  updateChecklistsSystemError: null,
  deleteChecklistSystemLoading: false,
  deleteChecklistSystemError: null,
  getChecklistsSystemFavoritesLoading: false,
  getChecklistsSystemFavoritesError: null,
  checklistsSystemFavorites: [],
  getChecklistsCustomLoading: false,
  getChecklistsCustomError: null,
  getChecklistsCustomSuccess: false,
  checklistsCustom: [],
  toggleChecklistFavoriteLoading: false,
  toggleChecklistFavoriteError: false,
  checklistFavorites: [],
};

const pathways = {
  updatePathwaysCheckedLoading: false,
  updatePathwaysCheckedError: null,
  pathwaysChecked: {},
  getPathwayFileLoading: false,
  getPathwayFileError: null,
  currentPathwayFile: null,
  getPathwaysSavedLoading: false,
  getPathwaysSavedError: null,
  pathwaysSaved: [],
  updatePathwaysSavedLoading: false,
  updatePathwaysSavedError: null,
};

const view = {
  mainMenuOpened: false,
  appbarTitle: null,
  lessonsMenuOpened: false,
  dismissPathywayModalLoading: false,
  dismissPathywayModaError: null,
  pathwayModalOpened: false,
  setLocaleLoading: false,
  setLocaleError: null,
  setLocaleLoading: false,
  setLocaleError: null,
  locale: "en",
  getContentLocaleMapLoading: true,
  getContentLocaleMapError: null,
  contentLocaleMap: {},
  systemLocaleMap: systemLocaleMap,
  alertOpen: false,
  alertType: null,
  alertMessage: null,
};

const db = {
  loading: true,
  error: null,
};

export default {
  content,
  account,
  feeds,
  forms,
  lessons,
  checklists,
  pathways,
  view,
  db,
};
