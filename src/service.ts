import { Service } from 'node-windows';

// Create a new service object
const svc = new Service({
  name: 'MIS Automation Backend Service',
  description: 'Backend Process Managing MongoDb And Handeling Requests',

  // Path To The Main Script
  script:
    'C:\\Users\\Administrator.ADEXON\\Desktop\\exon-backend\\dist\\app.js',
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', () => {
  console.log('Installing The Service ...');

  svc.start();
});

svc.install();

// // Listen for the "uninstall" event so we know when it's done.
// svc.on('uninstall', function () {
//   console.log('Uninstall complete.');
//   console.log('The service exists: ', svc.exists);
// });

// // Uninstall the service.
// svc.uninstall();
