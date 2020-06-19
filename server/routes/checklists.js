const { renderAndCache } = require("../ssr");

exports.index = (app) => (req, res) => {
  const actualPage = "/checklists";
  return renderAndCache(app, req, res, actualPage);
};

exports.pathway = (app) => (req, res) => {
  const actualPage = "/checklists/pathway";
  return renderAndCache(app, req, res, actualPage, {
    sha: req.params.sha,
  });
};
