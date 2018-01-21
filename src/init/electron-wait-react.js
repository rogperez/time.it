const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
  client.end();

  if(!startedElectron) {
    console.log('starting electron');

    startedElectron = true;
    const spawn = require('child_process').spawn;
    const temp = spawn('yarn', ['run','electron']);
    temp.stdout.pipe(process.stdout);
    temp.stderr.pipe(process.stderr);
    temp.on('close', (code) => {
      console.log(`closing code: ${code}`);
    });
  }
});

tryConnection();

client.on('error', (error) => {
  setTimeout(tryConnection, 500);
});

const logger = (error, stdout, stderr) => {
  if(error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
}

