import express, { Request, Response } from 'express';
import { RateLimiter } from './rateLimiter';

const app = express();
const port = 3000;
const rateLimiter = new RateLimiter();

app.use(express.json());

// Middleware to extract client ID. 
// For this challenge, we'll try to use a header 'X-Client-ID' or fallback to IP.
const getClientId = (req: Request): string => {
    const headerId = req.headers['x-client-id'];
    if (Array.isArray(headerId)) return headerId[0];
    if (headerId) return headerId;

    // Fallback to IP address if no custom header provided
    return req.ip || 'unknown-client';
};

// Logging Middleware
app.use((req: Request, res: Response, next) => {
    const clientId = getClientId(req);
    console.log(`[${new Date().toISOString()}] Incoming ${req.method} ${req.url} from ${clientId}`);

    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] Completed ${req.method} ${req.url} -> ${res.statusCode}`);
    });

    next();
});

app.post('/buy-corn', (req: Request, res: Response) => {
    const clientId = getClientId(req);

    const result = rateLimiter.tryPurchase(clientId);

    if (result.allowed) {
        res.status(200).json({
            message: '200 🌽',
            cornCount: result.cornCount
        });
    } else {
        res.header('Retry-After', Math.ceil((result.remainingMs || 0) / 1000).toString());
        res.status(429).json({
            error: 'Too Many Requests',
            retryAfter: result.remainingMs,
            cornCount: result.cornCount
        });
    }
});

app.listen(port, () => {
    console.log(`Bob's Corn API listening at http://localhost:${port}`);
});
