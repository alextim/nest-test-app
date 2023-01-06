import { mkdir } from 'node:fs';
import fs from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';

function fetch(url: string): Promise<[Buffer, string]> {
  return new Promise((resolve, reject) => {
    const data = [];
    const client = url.startsWith('https') ? https : http;
    client
      .request(url, (res) => {
        res.on('data', (chunk) => data.push(chunk));
        res.on('end', () => {
          const bytes = Buffer.concat(data);
          resolve([bytes, res.headers['content-type']]);
        });
        res.on('error', (err) => reject(err));
      })
      .end();
  });
}

export async function downloadFromUrl(
  url: string,
  fileWithoutExtension: string,
) {
  const [bytes, mimetype] = await fetch(url);
  const [, ext] = mimetype.split('/');
  const filepath = `${fileWithoutExtension}.${ext}`;
  const dir = path.dirname(filepath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filepath, bytes);
  return { mimetype, filepath };
}
