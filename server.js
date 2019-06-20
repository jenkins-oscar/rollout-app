
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

// this property must exist in the Rollout Dashboard.
Rox.setCustomStringProperty('JenkinsX Environment', function(context){
	return context.jenkinsx_environment;
  });

// change the name accordingly
Rox.register('ski-rollout', appSettingsContainer);

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
   }

// Rollout Staging Env
async function setupRox() {
	console.log('calling Rox.setup for Staging...');
	
	// the parameter for setup, is the ID of the Staging Environment in the Rollout Dashboard.
	// you can use other environment IDs but those must be defined in the Rollout Dashboard.
	var _result =  await Rox.setup('5d016c4223864938a85c1d33', {

	  });

	await sleep (2000);
	return _result;
 }
 
 
 setupRox().then((value) => {

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

	return _env;
}

// Routes - we pass two variables to the HTML to preform approrpiate actions based on conditions.
app.get('/', function(req, res) {

	// first ensure we have our file contents, which contains the k8s namespace we are in.
	context = { jenkinsx_environment: getJXEnvironment() };
	console.log('----------- app.get() - called getJXEnvironment() and got: '+ context.jenkinsx_environment+' so rendering ---------------------');
    res.render('pages/index',{env:context.jenkinsx_environment,renderButton:appSettingsContainer.jenkinsx_environment.isEnabled(context)});
});

app.listen(8080);

console.log('------ Ok your app is listening on port 8080! -------- ');
