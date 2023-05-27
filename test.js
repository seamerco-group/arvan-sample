const { spawn } = require('child_process');
const got = require('got');
const test = require('tape');

// Start the app
const env = Object.assign({}, process.env, {PORT: 3000});
const child = spawn('node', ['index.js'], {env});

test('responds to requests', (t) => {
    t.plan(4);

    // Wait until the server is ready
    child.stdout.on('data', _ => {
        // Make a request to our app
        (async () => {
            const response = await got('http://127.0.0.1:3000');
            // stop the server
            child.kill();
            // No error
            t.false(response.error);
            // Successful response
            t.equal(response.statusCode, 200);
            // Assert content checks
            t.notEqual(response.body.indexOf("<title>Hello World</title>"), -1);
            t.notEqual(response.body.indexOf("Hello From <b>ArvanCloud</b>"), -1);
        })();
    });
});

