module.exports = class GenericTemplateController {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  render(templateName, pageName = "", title = "") {
    this.response.render(templateName, {
      pageName: pageName,
      title: title 
    });
  }
};