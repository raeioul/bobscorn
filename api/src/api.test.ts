import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './index';

describe('API Endpoints', () => {
    it('POST /buy-corn should return 200 on success', async () => {
        const res = await request(app)
            .post('/buy-corn')
            .set('X-Client-ID', 'test-client-1');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('200 🌽');
        expect(res.body.cornCount).toBe(1);
    });

    it('POST /buy-corn should return 429 on rate limit', async () => {
        // First purchase
        await request(app)
            .post('/buy-corn')
            .set('X-Client-ID', 'test-client-2');

        // Immediate second purchase
        const res = await request(app)
            .post('/buy-corn')
            .set('X-Client-ID', 'test-client-2');

        expect(res.status).toBe(429);
        expect(res.body.error).toBe('Too Many Requests');
        expect(res.header['retry-after']).toBeDefined();
    });
});
