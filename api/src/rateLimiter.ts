interface PurchaseResult {
    allowed: boolean;
    remainingMs?: number;
    cornCount: number;
}

export class RateLimiter {
    private lastPurchaseTime: Map<string, number> = new Map();
    private cornCounts: Map<string, number> = new Map();
    private readonly COOLDOWN_MS = 60 * 1000; // 60 seconds

    public tryPurchase(clientId: string): PurchaseResult {
        const now = Date.now();
        const lastPurchase = this.lastPurchaseTime.get(clientId);
        const currentCorn = this.cornCounts.get(clientId) || 0;

        if (lastPurchase) {
            const timeSinceLast = now - lastPurchase;
            if (timeSinceLast < this.COOLDOWN_MS) {
                return {
                    allowed: false,
                    remainingMs: this.COOLDOWN_MS - timeSinceLast,
                    cornCount: currentCorn
                };
            }
        }

        // Allowed
        this.lastPurchaseTime.set(clientId, now);
        const newCount = currentCorn + 1;
        this.cornCounts.set(clientId, newCount);

        return {
            allowed: true,
            cornCount: newCount
        };
    }
}
