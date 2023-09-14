var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'DreamSignage',
  description: 'Node.js server for DreamSignage',
  script: require('path').join(__dirname,'DS.js'),
});

// Listen for the "uninstall" event, which indicates the service is removed
svc.on('uninstall', function() {
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();