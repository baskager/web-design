const ERROR_MESSAGES = {
  EMPTY: "Input for field '{input_name}' is empty",
  BOTFILTER_TRIGGERED: "Sorry, we cannot process your inquiry at this moment",
  EMAIL_INVALID: "'{input_value}' is not a valid e-mail address",
  MIN_LENGTH_INVALID: "input for field '{input_name}' is too short",
  MAX_LENGTH_INVALID: "input for field '{input_name}' is too long'"
};

module.exports = Object.freeze(ERROR_MESSAGES);