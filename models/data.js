var Cloudant = require('cloudant');

var service_url = 'URL';
var service_name = 'cloudantNoSQLDB';

var services = JSON.parse(process.env.VCAP_SERVICES);
if (services[service_name]) {
	var svc = services[service_name][0].credentials;
	service_url = svc.url;
} else {
	console.log('The service ' + service_name
                + ' is not in the VCAP_SERVICES, did you forget to bind it?');
}

var cloudant = Cloudant(service_url);
console.log("process.env.DBNAME_ENV: " + process.env.DBNAME_ENV);
var dbi = cloudant.db.use(process.env.DBNAME_ENV);

// get /news/:docName/
//
module.exports.getDocumentElements = function(docName, callbackfunc) {
  dbi.get(docName, callbackfunc);
};

// get /news/:docName/:attName
//
module.exports.getDocumentAttachFile = function(docName, attName, piperes) {
	dbi.attachment.get(docName, attName).pipe(piperes);
};

// get /
// get /news/
//
module.exports.getDocumentIndex = function(callbackfunc) {
  dbi.find(
    {
      selector: {
        date: {
          "$gt": 0
        },
				"display": true
      },
      sort: [{'date': 'desc'}],
      fields: ['_id', 'title', 'date', 'dateString']
    },
	callbackfunc);
};
