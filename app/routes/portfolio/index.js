
const portfolio = require('express').Router();
const overview = require('./overview');
const category = require('./category');

portfolio.get('/:slug', category);
portfolio.get('/', overview);

module.exports = portfolio;