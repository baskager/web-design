
const contact = require("express").Router();
const form = require("./form");
const endpoint = require("./endpoint");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

contact.get("/", form);
contact.post("/", urlencodedParser, endpoint);

module.exports = contact;