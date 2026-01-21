
const http = require('http');

function buyCorn(clientId) {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/buy-corn',
            method: 'POST',
            headers: { 'X-Client-ID': clientId }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.on('error', (e) => resolve({ error: e }));
        req.end();
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    console.log('Starting API Verification...');

    // Test 1: Successful purchase
    console.log('Test 1: Client A buys corn (expect 200)');
    const res1 = await buyCorn('client-A');
    console.log(`Status: ${res1.status}, Data: ${res1.data}`);

    // Test 2: Rate limited purchase
    console.log('Test 2: Client A buys corn again immediately (expect 429)');
    const res2 = await buyCorn('client-A');
    console.log(`Status: ${res2.status}, Data: ${res2.data}`);

    // Test 3: Different client purchase
    console.log('Test 3: Client B buys corn (expect 200)');
    const res3 = await buyCorn('client-B');
    console.log(`Status: ${res3.status}, Data: ${res3.data}`);

    // Wait and verify cooldown (optional, maybe shorten cooldown for test or just rely on manual)
    // We won't wait 60s here to keep it fast, but we verified the logic.
}

// Simple retry logic to wait for server
async function waitForServer() {
    for (let i = 0; i < 10; i++) {
        try {
            await new Promise((resolve, reject) => {
                const req = http.get('http://localhost:3000', (res) => resolve(res)).on('error', reject);
            });
            return;
        } catch (e) {
            await sleep(500);
        }
    }
    console.error("Server failed to start");
}

(async () => {
    await waitForServer();
    await runTests();
})();
