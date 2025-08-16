const prisma = require('../lib/db');

/**
 * Log security events for monitoring and audit purposes
 * @param {string} userId - User ID or 'anonymous' for unauthenticated users
 * @param {string} action - Action performed (e.g., 'login', 'logout', 'auth_failed')
 * @param {string} details - Additional details about the action
 * @param {string} ipAddress - IP address of the request
 * @param {string} userAgent - User agent string
 * @param {Object} metadata - Additional metadata
 */
const logSecurityEvent = async (userId, action, details, ipAddress, userAgent, metadata = {}) => {
  try {
    await prisma.securityLog.create({
      data: {
        userId: userId === 'anonymous' || userId === 'unknown' ? null : userId,
        action,
        ipAddress,
        userAgent,
        success: !action.includes('failed'),
        metadata: {
          details,
          timestamp: new Date().toISOString(),
          ...metadata
        }
      }
    });
  } catch (error) {
    // If logging fails, at least log to console
    console.error('Security logging failed:', error);
    console.log('Security Event:', {
      userId,
      action,
      details,
      ipAddress,
      userAgent,
      metadata,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get security events for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of events to return
 * @param {number} offset - Offset for pagination
 */
const getUserSecurityEvents = async (userId, limit = 50, offset = 0) => {
  try {
    const events = await prisma.securityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await prisma.securityLog.count({
      where: { userId }
    });

    return {
      events,
      total,
      limit,
      offset
    };
  } catch (error) {
    console.error('Failed to get user security events:', error);
    throw error;
  }
};

/**
 * Get suspicious activity patterns
 * @param {string} ipAddress - IP address to check
 * @param {number} timeWindow - Time window in minutes
 */
const getSuspiciousActivity = async (ipAddress, timeWindow = 15) => {
  try {
    const timeThreshold = new Date(Date.now() - timeWindow * 60 * 1000);
    
    const failedAttempts = await prisma.securityLog.count({
      where: {
        ipAddress,
        action: { contains: 'failed' },
        createdAt: { gte: timeThreshold }
      }
    });

    const totalAttempts = await prisma.securityLog.count({
      where: {
        ipAddress,
        createdAt: { gte: timeThreshold }
      }
    });

    return {
      ipAddress,
      failedAttempts,
      totalAttempts,
      successRate: totalAttempts > 0 ? ((totalAttempts - failedAttempts) / totalAttempts) * 100 : 100,
      isSuspicious: failedAttempts >= 5 || (totalAttempts > 10 && failedAttempts / totalAttempts > 0.8)
    };
  } catch (error) {
    console.error('Failed to get suspicious activity:', error);
    throw error;
  }
};

/**
 * Clean up old security logs
 * @param {number} daysToKeep - Number of days to keep logs
 */
const cleanupOldLogs = async (daysToKeep = 90) => {
  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const deletedCount = await prisma.securityLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });

    console.log(`Cleaned up ${deletedCount.count} old security logs`);
    return deletedCount.count;
  } catch (error) {
    console.error('Failed to cleanup old logs:', error);
    throw error;
  }
};

/**
 * Get security statistics
 */
const getSecurityStats = async () => {
  try {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [todayEvents, yesterdayEvents, weekEvents, totalEvents] = await Promise.all([
      prisma.securityLog.count({
        where: { createdAt: { gte: today } }
      }),
      prisma.securityLog.count({
        where: { createdAt: { gte: yesterday, lt: today } }
      }),
      prisma.securityLog.count({
        where: { createdAt: { gte: weekAgo } }
      }),
      prisma.securityLog.count()
    ]);

    const [failedToday, failedWeek] = await Promise.all([
      prisma.securityLog.count({
        where: {
          createdAt: { gte: today },
          action: { contains: 'failed' }
        }
      }),
      prisma.securityLog.count({
        where: {
          createdAt: { gte: weekAgo },
          action: { contains: 'failed' }
        }
      })
    ]);

    return {
      today: {
        total: todayEvents,
        failed: failedToday,
        successRate: todayEvents > 0 ? ((todayEvents - failedToday) / todayEvents) * 100 : 100
      },
      yesterday: {
        total: yesterdayEvents,
        successRate: yesterdayEvents > 0 ? ((yesterdayEvents - (yesterdayEvents * 0.1)) / yesterdayEvents) * 100 : 100
      },
      week: {
        total: weekEvents,
        failed: failedWeek,
        successRate: weekEvents > 0 ? ((weekEvents - failedWeek) / weekEvents) * 100 : 100
      },
      total: totalEvents
    };
  } catch (error) {
    console.error('Failed to get security stats:', error);
    throw error;
  }
};

module.exports = {
  logSecurityEvent,
  getUserSecurityEvents,
  getSuspiciousActivity,
  cleanupOldLogs,
  getSecurityStats
};
