
var http = require('http');
var fileSystem = require('fs');
var Rox = require('rox-node');
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res) {
    res.render('pages/index');
});


const appSettingsContainer = {
	jenkinsx_environment: new Rox.Flag()
  };

var context= { jenkinsx_environment: 'jx-staging' };

Rox.setCustomStringProperty('JenkinsX Environment', function(context){
	return context.jenkinsx_environment;
  });


Rox.register('ski-rollout', appSettingsContainer);

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
   }

// Rollout Staging Env
async function setupRox() {
	console.log('calling Rox.setup for Staging...');
	
	var _result =  await Rox.setup('5d016c4223864938a85c1d33', {

	  });

	await sleep (2000);
	return _result;
 }
 
 
 setupRox().then((value) => {
	console.log(value);
	console.log('setupBox() finished');
	console.log(appSettingsContainer.jenkinsx_environment.isEnabled(context));

	if (appSettingsContainer.jenkinsx_environment.isEnabled(context)) {
		console.log('We are skiing in Staging Jenkins X environment!');
	 }
	
 });



function getJXEnvironment() {
	var _env = '';

	fileSystem.readFile('/var/run/secrets/kubernetes.io/serviceaccount/namespace', function (error, fileContent) {
		if (error) {
			_env = error;
		}
		else {
			_env = fileContent;
			
		}
	});

	console.log("getJXEnvrionment value:"+ _env);
	return _env;
}


app.listen(8080);
console.log('Oh check this out, your app is listening on port 8080!');
