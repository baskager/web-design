/**
 * Path that renders the homepage
 *
 * @author: Bas Kager
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

module.exports = (req, res) => {
  res.render("home", {
    pageName: "home"
  });
};