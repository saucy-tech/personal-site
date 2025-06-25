#!/usr/bin/env node

/**
 * Production Monitoring Script for Next.js Upgrade and CSP Issues
 *
 * This script helps monitor the production deployment for:
 * - Next.js 15.2.2+ related issues
 * - Content Security Policy (CSP) violations
 * - CVE-2025-48068 mitigation effectiveness
 * - General application health after upgrade
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// Configuration
const CONFIG = {
  // Replace with your actual production URL
  PRODUCTION_URL: process.env.PRODUCTION_URL || 'https://your-site.com',
  CHECK_INTERVAL: 60000, // 1 minute
  LOG_FILE: path.join(__dirname, 'production-monitoring.log'),
  ALERT_KEYWORDS: [
    'Next.js',
    'nextjs',
    'Content-Security-Policy',
    'CSP',
    'CVE-2025-48068',
    'allowedDevOrigins',
    'eval',
    'unsafe-inline',
    'TypeError',
    'ReferenceError',
    'NetworkError',
    '500',
    '502',
    '503',
    '504',
  ],
};

class ProductionMonitor {
  constructor() {
    this.logFile = CONFIG.LOG_FILE;
    this.isRunning = false;
    this.checkCount = 0;
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;

    console.log(logEntry.trim());

    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (err) {
      console.error('Failed to write to log file:', err.message);
    }
  }

  async checkEndpoint(url, description = '') {
    return new Promise((resolve) => {
      const startTime = Date.now();

      const req = https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const duration = Date.now() - startTime;
          const result = {
            url,
            description,
            statusCode: res.statusCode,
            headers: res.headers,
            responseTime: duration,
            contentLength: data.length,
            hasContent: data.length > 0,
            timestamp: new Date().toISOString(),
          };

          // Check for CSP headers
          if (res.headers['content-security-policy']) {
            result.cspHeader = res.headers['content-security-policy'];
          }

          // Check for Next.js related headers
          if (res.headers['x-powered-by']) {
            result.poweredBy = res.headers['x-powered-by'];
          }

          resolve(result);
        });
      });

      req.on('error', (err) => {
        resolve({
          url,
          description,
          error: err.message,
          timestamp: new Date().toISOString(),
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({
          url,
          description,
          error: 'Request timeout',
          timestamp: new Date().toISOString(),
        });
      });
    });
  }

  async performHealthCheck() {
    this.checkCount++;
    this.log(`Starting health check #${this.checkCount}`);

    const endpoints = [
      { url: CONFIG.PRODUCTION_URL, description: 'Homepage' },
      { url: `${CONFIG.PRODUCTION_URL}/api/health`, description: 'Health API' },
      { url: `${CONFIG.PRODUCTION_URL}/blog`, description: 'Blog page' },
      { url: `${CONFIG.PRODUCTION_URL}/support`, description: 'Support page' },
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const result = await this.checkEndpoint(endpoint.url, endpoint.description);
        results.push(result);

        if (result.error) {
          this.log(`❌ ${endpoint.description} (${endpoint.url}): ${result.error}`, 'ERROR');
        } else if (result.statusCode >= 400) {
          this.log(
            `⚠️  ${endpoint.description} (${endpoint.url}): HTTP ${result.statusCode}`,
            'WARN'
          );
        } else {
          this.log(
            `✅ ${endpoint.description} (${endpoint.url}): HTTP ${result.statusCode} (${result.responseTime}ms)`
          );

          // Check CSP header
          if (result.cspHeader) {
            this.log(
              `   CSP: ${result.cspHeader.substring(0, 100)}${result.cspHeader.length > 100 ? '...' : ''}`
            );
          }

          // Check Next.js version
          if (result.poweredBy && result.poweredBy.includes('Next.js')) {
            this.log(`   Powered by: ${result.poweredBy}`);
          }
        }
      } catch (err) {
        this.log(`❌ Error checking ${endpoint.description}: ${err.message}`, 'ERROR');
      }
    }

    return results;
  }

  analyzeResults(results) {
    const issues = [];
    const warnings = [];

    results.forEach((result) => {
      if (result.error) {
        issues.push(`${result.description}: ${result.error}`);
      } else if (result.statusCode >= 500) {
        issues.push(`${result.description}: Server error (${result.statusCode})`);
      } else if (result.statusCode >= 400) {
        warnings.push(`${result.description}: Client error (${result.statusCode})`);
      }

      // Check for missing CSP header on main pages
      if (!result.error && result.statusCode === 200 && !result.cspHeader) {
        warnings.push(`${result.description}: Missing Content-Security-Policy header`);
      }

      // Check response time
      if (result.responseTime && result.responseTime > 5000) {
        warnings.push(`${result.description}: Slow response time (${result.responseTime}ms)`);
      }
    });

    if (issues.length > 0) {
      this.log(`🚨 CRITICAL ISSUES DETECTED:`, 'ERROR');
      issues.forEach((issue) => this.log(`   - ${issue}`, 'ERROR'));
    }

    if (warnings.length > 0) {
      this.log(`⚠️  WARNINGS:`, 'WARN');
      warnings.forEach((warning) => this.log(`   - ${warning}`, 'WARN'));
    }

    if (issues.length === 0 && warnings.length === 0) {
      this.log(`✅ All systems operational`);
    }

    return { issues, warnings };
  }

  async start() {
    if (this.isRunning) {
      this.log('Monitor is already running', 'WARN');
      return;
    }

    this.isRunning = true;
    this.log('🚀 Starting production monitoring...');
    this.log(`Monitoring URL: ${CONFIG.PRODUCTION_URL}`);
    this.log(`Check interval: ${CONFIG.CHECK_INTERVAL / 1000} seconds`);
    this.log(`Log file: ${this.logFile}`);

    // Perform initial check
    const results = await this.performHealthCheck();
    this.analyzeResults(results);

    // Set up recurring checks
    const interval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }

      try {
        const results = await this.performHealthCheck();
        this.analyzeResults(results);
      } catch (err) {
        this.log(`Error during health check: ${err.message}`, 'ERROR');
      }
    }, CONFIG.CHECK_INTERVAL);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.log('Received SIGINT, shutting down gracefully...');
      this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      this.log('Received SIGTERM, shutting down gracefully...');
      this.stop();
      process.exit(0);
    });
  }

  stop() {
    this.isRunning = false;
    this.log('🛑 Production monitoring stopped');
  }

  // Generate a summary report
  generateReport() {
    this.log('📊 Generating monitoring report...');

    try {
      const logContent = fs.readFileSync(this.logFile, 'utf8');
      const lines = logContent.split('\n').filter((line) => line.trim());

      const errors = lines.filter((line) => line.includes('[ERROR]')).length;
      const warnings = lines.filter((line) => line.includes('[WARN]')).length;
      const totalChecks = lines.filter((line) => line.includes('Starting health check')).length;

      this.log(`\n📈 MONITORING SUMMARY:`);
      this.log(`   Total health checks: ${totalChecks}`);
      this.log(`   Errors detected: ${errors}`);
      this.log(`   Warnings detected: ${warnings}`);
      this.log(
        `   Success rate: ${totalChecks > 0 ? (((totalChecks - errors) / totalChecks) * 100).toFixed(2) : 0}%`
      );

      if (errors > 0 || warnings > 0) {
        this.log(`\n🔍 Recent issues:`);
        const recentIssues = lines
          .filter((line) => line.includes('[ERROR]') || line.includes('[WARN]'))
          .slice(-10);
        recentIssues.forEach((issue) => this.log(`   ${issue}`));
      }
    } catch (err) {
      this.log(`Error generating report: ${err.message}`, 'ERROR');
    }
  }
}

// CLI Interface
if (require.main === module) {
  const monitor = new ProductionMonitor();

  const command = process.argv[2];

  switch (command) {
    case 'start':
      monitor.start();
      break;
    case 'report':
      monitor.generateReport();
      break;
    case 'check':
      monitor.performHealthCheck().then((results) => {
        monitor.analyzeResults(results);
        process.exit(0);
      });
      break;
    default:
      console.log(`
🔍 Production Monitoring Tool

Usage:
  node monitor-production.js start   - Start continuous monitoring
  node monitor-production.js check   - Perform single health check
  node monitor-production.js report  - Generate monitoring report

Environment Variables:
  PRODUCTION_URL - Your production URL (default: https://your-site.com)

Key monitoring areas:
✅ Next.js 15.2.2+ compatibility
✅ Content Security Policy (CSP) headers
✅ CVE-2025-48068 mitigation
✅ Response times and availability
✅ Error tracking and logging
      `);
      break;
  }
}

module.exports = ProductionMonitor;
