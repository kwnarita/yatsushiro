var Cloudant = require('cloudant');

var service_url = 'URL';
var service_username = 'username';
var service_password = 'svc.password';
var service_host = 'svc.host';
var service_port = 'svc.port';

console.log('Parsing VCAP_SERVICES');
var services = JSON.parse(process.env.VCAP_SERVICES);
var service_name = 'cloudantNoSQLDB';

if (services[service_name]) {
	var svc = services[service_name][0].credentials;
	service_url = svc.url;
	service_username = svc.username;
	service_password = svc.password;
	service_host = svc.host;
	service_port = svc.port;
} else {
	console.log('The service ' + service_name
                + ' is not in the VCAP_SERVICES, did you forget to bind it?');
}

console.log('service_username = ' + service_username);
console.log('service_password = ' + new Array(service_password.length).join("X"));
console.log('service_host = ' + service_host);
console.log('service_port = ' + service_port);

var cloudant = Cloudant(service_url);
console.log("process.env.DBNAME_ENV: " + process.env.DBNAME_ENV);
var dbi = cloudant.db.use(process.env.DBNAME_ENV);
cloudant.db.list(function(err, body) {
  // body is an array
  body.forEach(function(db) {
    console.log(db);
  });
});

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
