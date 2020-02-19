const ContactPostController = require("../../controllers/contact/ContactPostController.class"),
  Log = require("../../classes/log/Log.class");

module.exports = async (request, response) => {
  const contactPostController = new ContactPostController(request, response);
  Log.breadCrumb("contact", "Attempting to post message to webmaster");

  try{
    await contactPostController.post();
  } catch(exception) {
    Log.error(exception);
    contactPostController.renderException(exception);
  }
  
  contactPostController.render();
};