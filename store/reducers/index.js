import { combineReducers } from "redux";
import content from "./content";
import account from "./account";
import feeds from "./feeds";
import forms from "./forms";
import lessons from "./lessons";
import checklists from "./checklists";
import pathways from "./pathways";
import view from "./view";
import db from "./db";

const reducer = combineReducers({
  content,
  account,
  feeds,
  forms,
  lessons,
  checklists,
  pathways,
  view,
  db,
});

export default reducer;
