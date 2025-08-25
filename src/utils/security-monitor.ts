import { logSecurityEvent } from './security';

// Security monitoring and intrusion detection
interface SecurityAlert {
  id: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  ip: string;
  userAgent?: string;
  endpoint?: string;
  metadata?: Record<string, any>;
}

interface ThreatPattern {
  name: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

// In-memory storage for security events (in production, use a proper database)
const securityAlerts: SecurityAlert[] = [];
const suspiciousIPs = new Map<
  string,
  {
    violations: number;
    lastViolation: Date;
    blocked: boolean;
  }
>();

// Common attack patterns to detect
const threatPatterns: ThreatPattern[] = [
  {
    name: 'SQL Injection',
    pattern: /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b|\bDROP\b)/i,
    severity: 'high',
    description: 'Potential SQL injection attempt detected',
  },
  {
    name: 'XSS Attempt',
    pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    severity: 'high',
    description: 'Potential XSS attempt detected',
  },
  {
    name: 'Path Traversal',
    pattern: /(\.\.[\/\\]|\.\.%2[fF]|\.\.%5[cC])/,
    severity: 'medium',
    description: 'Potential path traversal attempt detected',
  },
  {
    name: 'Command Injection',
    pattern: /[;&|`$()]/,
    severity: 'high',
    description: 'Potential command injection attempt detected',
  },
  {
    name: 'Suspicious User Agent',
    pattern: /(sqlmap|nmap|nikto|w3af|acunetix|burp|owasp|masscan)/i,
    severity: 'medium',
    description: 'Suspicious security scanner detected',
  },
];

// Bot detection patterns
const botPatterns = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /go-http-client/i,
];

/**
 * Analyze request for suspicious patterns
 */
export function analyzeRequest(
  url: string,
  userAgent?: string,
  ip?: string,
  body?: string,
  headers?: Record<string, string>
): SecurityAlert[] {
  const alerts: SecurityAlert[] = [];
  const timestamp = new Date();

  // Check URL for suspicious patterns
  for (const threat of threatPatterns) {
    if (threat.pattern.test(url)) {
      alerts.push({
        id: generateAlertId(),
        timestamp,
        severity: threat.severity,
        type: threat.name,
        description: `${threat.description} in URL: ${url}`,
        ip: ip || 'unknown',
        userAgent,
        endpoint: url,
        metadata: { pattern: threat.pattern.source },
      });
    }
  }

  // Check body content for threats
  if (body) {
    for (const threat of threatPatterns) {
      if (threat.pattern.test(body)) {
        alerts.push({
          id: generateAlertId(),
          timestamp,
          severity: threat.severity,
          type: threat.name,
          description: `${threat.description} in request body`,
          ip: ip || 'unknown',
          userAgent,
          endpoint: url,
          metadata: { contentLength: body.length },
        });
      }
    }
  }

  // Check User-Agent for suspicious patterns
  if (userAgent) {
    for (const threat of threatPatterns) {
      if (threat.name === 'Suspicious User Agent' && threat.pattern.test(userAgent)) {
        alerts.push({
          id: generateAlertId(),
          timestamp,
          severity: 'medium',
          type: 'Suspicious User Agent',
          description: `Security scanner or bot detected: ${userAgent}`,
          ip: ip || 'unknown',
          userAgent,
          endpoint: url,
        });
      }
    }
  }

  // Detect excessive header count (potential header pollution)
  if (headers && Object.keys(headers).length > 50) {
    alerts.push({
      id: generateAlertId(),
      timestamp,
      severity: 'medium',
      type: 'Header Pollution',
      description: `Excessive number of headers: ${Object.keys(headers).length}`,
      ip: ip || 'unknown',
      userAgent,
      endpoint: url,
      metadata: { headerCount: Object.keys(headers).length },
    });
  }

  // Store alerts and update IP tracking
  alerts.forEach((alert) => {
    securityAlerts.push(alert);
    updateSuspiciousIP(alert.ip, alert.severity);

    // Log critical and high severity alerts
    if (alert.severity === 'critical' || alert.severity === 'high') {
      logSecurityEvent('suspicious_request', {
        ip: alert.ip,
        userAgent: alert.userAgent,
        endpoint: alert.endpoint,
        reason: alert.description,
      });
    }
  });

  return alerts;
}

/**
 * Check if an IP address is blocked
 */
export function isIPBlocked(ip: string): boolean {
  const entry = suspiciousIPs.get(ip);
  return entry?.blocked || false;
}

/**
 * Check if request appears to be from a bot
 */
export function isBotRequest(userAgent?: string): boolean {
  if (!userAgent) return false;

  return botPatterns.some((pattern) => pattern.test(userAgent));
}

/**
 * Get security statistics
 */
export function getSecurityStats() {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

  const recentAlerts = securityAlerts.filter((alert) => alert.timestamp >= last24Hours);
  const criticalAlerts = recentAlerts.filter((alert) => alert.severity === 'critical');
  const highAlerts = recentAlerts.filter((alert) => alert.severity === 'high');
  const hourlyAlerts = securityAlerts.filter((alert) => alert.timestamp >= lastHour);

  const topThreats = recentAlerts.reduce(
    (acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const suspiciousIPList = Array.from(suspiciousIPs.entries())
    .filter(([, data]) => data.violations > 5)
    .sort(([, a], [, b]) => b.violations - a.violations)
    .slice(0, 10);

  return {
    totalAlerts: securityAlerts.length,
    last24Hours: recentAlerts.length,
    lastHour: hourlyAlerts.length,
    criticalAlerts: criticalAlerts.length,
    highAlerts: highAlerts.length,
    topThreats: Object.entries(topThreats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5),
    suspiciousIPs: suspiciousIPList,
    blockedIPs: Array.from(suspiciousIPs.entries()).filter(([, data]) => data.blocked).length,
  };
}

/**
 * Get recent security alerts
 */
export function getRecentAlerts(limit: number = 50): SecurityAlert[] {
  return securityAlerts
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Update suspicious IP tracking
 */
function updateSuspiciousIP(ip: string, severity: SecurityAlert['severity']) {
  const entry = suspiciousIPs.get(ip) || {
    violations: 0,
    lastViolation: new Date(),
    blocked: false,
  };

  // Weight violations by severity
  const severityWeight = {
    low: 1,
    medium: 2,
    high: 4,
    critical: 8,
  };

  entry.violations += severityWeight[severity];
  entry.lastViolation = new Date();

  // Auto-block IPs with excessive violations
  if (entry.violations >= 20 && !entry.blocked) {
    entry.blocked = true;
    logSecurityEvent('auth_failure', {
      ip,
      reason: `IP auto-blocked due to ${entry.violations} security violations`,
    });
  }

  suspiciousIPs.set(ip, entry);
}

/**
 * Generate unique alert ID
 */
function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clean up old alerts and IP entries
 */
function cleanupOldData() {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days

  // Remove old alerts
  const alertCount = securityAlerts.length;
  for (let i = alertCount - 1; i >= 0; i--) {
    const alert = securityAlerts[i];
    if (alert && alert.timestamp < cutoff) {
      securityAlerts.splice(i, 1);
    }
  }

  // Reset old IP violations (but keep blocked status)
  for (const [ip, entry] of suspiciousIPs.entries()) {
    if (entry.lastViolation < cutoff) {
      if (!entry.blocked) {
        suspiciousIPs.delete(ip);
      } else {
        entry.violations = 0; // Reset violations but keep blocked
      }
    }
  }
}

// Clean up old data every hour
setInterval(cleanupOldData, 60 * 60 * 1000);

/**
 * Manually block/unblock an IP
 */
export function blockIP(ip: string, reason: string = 'Manual block') {
  const entry = suspiciousIPs.get(ip) || {
    violations: 0,
    lastViolation: new Date(),
    blocked: false,
  };

  entry.blocked = true;
  suspiciousIPs.set(ip, entry);

  logSecurityEvent('auth_failure', {
    ip,
    reason: `IP manually blocked: ${reason}`,
  });
}

export function unblockIP(ip: string) {
  const entry = suspiciousIPs.get(ip);
  if (entry) {
    entry.blocked = false;
    entry.violations = 0;
    suspiciousIPs.set(ip, entry);
  }
}
