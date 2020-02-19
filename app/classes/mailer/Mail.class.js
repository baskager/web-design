module.exports = class Mail {
  constructor(fromName, fromEmail, subject) {
    this.from = this.buildFromString(fromName, fromEmail);
    this.subject = subject;
    this.contents = "";
  }

  buildFromString(fromName, fromEmail) {
    return fromName + " <" + fromEmail + ">";
  }
};