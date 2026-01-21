import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter } from './rateLimiter';

describe('RateLimiter', () => {
    let limiter: RateLimiter;

    beforeEach(() => {
        limiter = new RateLimiter();
    });

    it('should allow a first purchase', () => {
        const result = limiter.tryPurchase('client-1');
        expect(result.allowed).toBe(true);
        expect(result.cornCount).toBe(1);
    });

    it('should deny second purchase within cooldown', () => {
        limiter.tryPurchase('client-1');
        const result = limiter.tryPurchase('client-1');

        expect(result.allowed).toBe(false);
        expect(result.remainingMs).toBeGreaterThan(0);
        expect(result.cornCount).toBe(1);
    });

    it('should allow second purchase after cooldown', () => {
        vi.useFakeTimers();

        limiter.tryPurchase('client-1');

        // Advance time by 61 seconds
        vi.advanceTimersByTime(61 * 1000);

        const result = limiter.tryPurchase('client-1');
        expect(result.allowed).toBe(true);
        expect(result.cornCount).toBe(2);

        vi.useRealTimers();
    });

    it('should maintain independent counts for different clients', () => {
        limiter.tryPurchase('client-1');
        const result2 = limiter.tryPurchase('client-2');

        expect(result2.allowed).toBe(true);
        expect(result2.cornCount).toBe(1);
    });
});
