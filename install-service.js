var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'DreamSignage',
  description: 'Node.js server for DreamSignage',
  script: require('path').join(__dirname,'DS.js'),
});

// Listen for the "install" event, which indicates the service is available
svc.on('install',function(){
  svc.start();
});

// Install the script as a service
svc.install();