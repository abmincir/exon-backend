import { Service } from 'node-windows';

// Create a new service object
const svc = new Service({
  name: 'MIS Automation Backend Service',
  description: 'Backend Process Managing MongoDb And Handeling Requests',
  script: './app.js',
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', () => {
  console.log('Installing The Service ...');

  svc.start();
});

svc.install();
