var modelData = require('../models/data');

/* GET home page. */
module.exports.displayTopPage = function(req, res, next) {
  res.render('index', { title: 'Express' });
};
