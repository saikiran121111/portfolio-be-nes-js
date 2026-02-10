import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as http from 'http';
import * as https from 'https';

// Self-ping interval: 10 minutes (600,000 ms)
// Render free tier sleeps after ~15 min of inactivity, so 10 min is safely within that window
const SELF_PING_INTERVAL_MS = 600_000;

@Injectable()
export class SelfPingService implements OnModuleInit {
    private readonly logger = new Logger(SelfPingService.name);
    private pingUrl: string | null = null;
    private pingCount = 0;

    onModuleInit() {
        const selfPingUrl = process.env.SELF_PING_URL;

        if (selfPingUrl) {
            this.pingUrl = selfPingUrl;
            this.logger.log('=== SelfPingService STARTED ===');
            this.logger.log(`Target: ${this.pingUrl}`);
            this.logger.log(`Interval: every 10 minutes (${SELF_PING_INTERVAL_MS}ms)`);
            this.logger.log(`First ping scheduled at: ${new Date(Date.now() + SELF_PING_INTERVAL_MS).toISOString()}`);
        } else {
            this.logger.warn(
                'SELF_PING_URL not set — self-ping is DISABLED (set it in production to prevent Render sleep)',
            );
        }
    }

    @Interval(SELF_PING_INTERVAL_MS)
    async pingSelf(): Promise<void> {
        if (!this.pingUrl) {
            return;
        }

        this.pingCount++;
        const startTime = Date.now();
        const timestamp = new Date().toISOString();

        this.logger.log(`[Ping #${this.pingCount}] Pinging ${this.pingUrl} at ${timestamp}...`);

        try {
            const statusCode = await this.makeRequest(this.pingUrl);
            const responseTime = Date.now() - startTime;
            const nextPingAt = new Date(Date.now() + SELF_PING_INTERVAL_MS).toISOString();
            this.logger.log(
                `[Ping #${this.pingCount}] SUCCESS | Status: ${statusCode} | Response time: ${responseTime}ms | Next ping at: ${nextPingAt}`,
            );
        } catch (err) {
            const responseTime = Date.now() - startTime;
            const nextPingAt = new Date(Date.now() + SELF_PING_INTERVAL_MS).toISOString();
            this.logger.error(
                `[Ping #${this.pingCount}] FAILED | Response time: ${responseTime}ms | Next ping at: ${nextPingAt} | Error: ${String(err)}`,
            );
        }
    }

    private makeRequest(url: string): Promise<number> {
        return new Promise((resolve, reject) => {
            const client = url.startsWith('https') ? https : http;

            const req = client.get(url, (res) => {
                // Consume the response data to free up memory
                res.resume();
                resolve(res.statusCode ?? 0);
            });

            req.on('error', (err: Error) => {
                reject(err);
            });

            // 30 second timeout to avoid hanging requests
            req.setTimeout(30_000, () => {
                req.destroy(new Error('Request timed out after 30 seconds'));
            });
        });
    }
}
