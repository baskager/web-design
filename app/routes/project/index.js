
const project = require('express').Router();
const details = require('./details');

project.get('/:categorySlug/:projectSlug', details);

module.exports = project;