const { renderAndCache } = require("../ssr");

exports.index = (app) => (req, res) => {
  const actualPage = "/index";
  return renderAndCache(app, req, res, actualPage);
};
