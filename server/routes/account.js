const { render } = require("../ssr");

exports.index = (app) => async (req, res) => {
  const actualPage = "/account";
  return render(app, req, res, actualPage);
};
