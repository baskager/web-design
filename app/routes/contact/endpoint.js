const ContactPostController = require("../../controllers/contact/ContactPostController.class");

module.exports = (request, response) => {
  contactPostController = new ContactPostController(request, response);
  contactPostController.post();
}