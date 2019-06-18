
var http = require('http');
var fileSystem = require('fs');
var Rox = require('rox-node');
var express = require('express');
var app = express();
var context= {};
const appSettingsContainer = {
	jenkinsx_environment: new Rox.Flag()
  };

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

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
	console.log('setupRox() returned value: '+ value);

	if (appSettingsContainer.jenkinsx_environment.isEnabled(context)) {
		console.log('----- We are in Staging Jenkins X environment! --------');
	 }
	 else {
		console.log('------ What Jenkins X environment? : '+ context.jenkinsx_environment+' ---------');
	 }
	
 });


function getJXEnvironment() {
	var _env = '';
	_env = fileSystem.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/namespace', 'utf8');
	// fileSystem.readFile('/var/run/secrets/kubernetes.io/serviceaccount/namespace', function (error, fileContent) {
	// 	if (error) {
	// 		console.log('getJXEnvironment(): hey there was an error reading the file: '+error);
	// 		_env = error;
	// 	}
	
	// 	_env = fileContent;
	// 	console.log("getJXEnvrionment(): value:"+ _env);
		
	// });
	return _env;
}

// Routes - we pass two variables to the HTML to preform approrpiate actions based on conditions.
app.get('/', function(req, res) {

	// first ensure we have our file contents
	context = { jenkinsx_environment: getJXEnvironment() };
	console.log('----------- app.get() - called getJXEnvironment() and got: '+ context.jenkinsx_environment+' so rendering ---------------------');
    res.render('pages/index',{env:context.jenkinsx_environment,renderButton:appSettingsContainer.jenkinsx_environment.isEnabled(context)});
});

app.listen(8080);

console.log('------ Ok your app is listening on port 8080! -------- ');
