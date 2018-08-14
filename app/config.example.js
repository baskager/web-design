module.exports = {
  port: 3000,
  mailer: {
    contactAdress: "",
    smtp: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: "",
        pass: ""
      }
    }
  },
  formMapper: {
    prefix: "v-"
  },
  validator: {},
  cache: {
    location: "cache/",
    defaultFile: "default.json",
    save: true
  }
};
