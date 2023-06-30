#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios').default;

let connected;
let host = process.argv[2];

if (!host) {
  console.error('Host not found! usage: bin/docker/node/online <hostname>');
  return;
}

host = host.replace('\r', '').replace('\n', '');

let timeout = setTimeout(_timeout, 10000);
let interval = setInterval(_interval, 1000);

const localContent = fs.readFileSync('dist/spa/index.html').toString();

function _timeout() {
  console.log('[ONLINE] Timeout');
  clearInterval(interval);
  process.exit(0);
}

async function _interval() {
  console.log('[ONLINE] Try connect server', {
    host,
  });
  axios
    .get(`http://${host}/`, {
      headers: {
        Accept: '*/*',
      },
    })
    .then((r) => {
      const decoded = r.data;
      const local = localContent.match(/<title>(.*)<\/title>/gm);
      const container = decoded.match(/<title>(.*)<\/title>/gm);
      console.log({
        local,
        container,
      });
      if (local[0] == container[0]) {
        console.log('[ONLINE] Correct version');
        connected = true;
      } else {
        console.log('[ONLINE] Different local content of the image');
      }
    })
    .catch((e) => {
      console.error(e);
    });
  if (connected) {
    console.log('[ONLINE] Connected');
    clearInterval(interval);
    clearTimeout(timeout);
    process.exit(0);
  }
}

process.on('uncaughtException', (err) => {
  console.log(err);
});
