const ContactPostController = require("../../controllers/contact/ContactPostController.class");

module.exports = (request, response) => {
  const contactPostController = new ContactPostController(request, response);
  contactPostController.post();
};