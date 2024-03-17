import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Controller function to serve the log file
export const serveLogFile = (req: Request, res: Response): void => {
  const logFiles = [
    path.join('C:', 'logfiles', 'err-back.txt'),
    path.join('C:', 'logfiles', 'back-err.txt')
  ];

  const fileToServe = logFiles.find(filePath => fs.existsSync(filePath));

  if (!fileToServe) {
    res.status(404).send('Log file not found.');
    return;
  }

  fs.stat(fileToServe, (err, stat) => {
    if (err) {
      res.status(404).send('Log file not found.');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Length': stat.size,
    });

    const readStream = fs.createReadStream(fileToServe);
    readStream.pipe(res);
  });
};
