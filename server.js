
var http = require('http');
var fileSystem = require('fs');
var Rox = require('rox-node');
var express = require('express');
var app = express();


const appSettingsContainer = {
	jenkinsx_environment: new Rox.Flag()
  };

var context= { jenkinsx_environment: getJXEnvironment() };
  console.log("-------------- getJXEnvironment() VALUE: "+getJXEnvironment()+'---------------------');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Routes - we pass two variables to the HTML to preform approrpiate actions based on conditions.
app.get('/', function(req, res) {
    res.render('pages/index',{env:context.jenkinsx_environment,renderButton:appSettingsContainer.jenkinsx_environment.isEnabled(context)});
});


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
	console.log('Rox returned value: '+ value);
	console.log('Rox passed context:' + context.jenkinsx_environment);
	console.log('setupBox() finished');
	console.log(appSettingsContainer.jenkinsx_environment.isEnabled(context));

	if (appSettingsContainer.jenkinsx_environment.isEnabled(context)) {
		console.log('We are in Staging Jenkins X environment!');
	 }
	 else {
		console.log('What Jenkins X environment? : '+ context.jenkinsx_environment);
	 }
	
 });


function getJXEnvironment() {
	var _env = '';
		
	fileSystem.readFile('/var/run/secrets/kubernetes.io/serviceaccount/namespace', function (error, fileContent) {
		if (error) {
			console.log('getJXEnvironment(): hey there was an error reading the file: '+error);
			throw error;
		}
	
		_env = fileContent;
		console.log("getJXEnvrionment(): value:"+ _env);
		
	});

	return _env;
}


app.listen(8080);

console.log('Oh check this out, your app is listening on port 8080!');
