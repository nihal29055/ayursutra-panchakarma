const http = require('http');
const mongoose = require('mongoose');

// Health check configuration
const HEALTH_CHECK_PORT = process.env.HEALTH_CHECK_PORT || 3001;
const HEALTH_CHECK_HOST = process.env.HEALTH_CHECK_HOST || 'localhost';

// Database connection check
async function checkDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      // Test a simple query
      await mongoose.connection.db.admin().ping();
      return { status: 'healthy', message: 'Database connection is active' };
    } else {
      return { status: 'unhealthy', message: 'Database connection is not established' };
    }
  } catch (error) {
    return { status: 'unhealthy', message: `Database error: ${error.message}` };
  }
}

// Memory usage check
function checkMemory() {
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };

  // Consider unhealthy if heap usage is over 1GB
  if (memUsageMB.heapUsed > 1024) {
    return { status: 'unhealthy', message: 'High memory usage detected', usage: memUsageMB };
  }

  return { status: 'healthy', message: 'Memory usage is normal', usage: memUsageMB };
}

// Uptime check
function checkUptime() {
  const uptime = process.uptime();
  const uptimeHours = Math.floor(uptime / 3600);
  const uptimeMinutes = Math.floor((uptime % 3600) / 60);

  return {
    status: 'healthy',
    message: 'Application is running',
    uptime: `${uptimeHours}h ${uptimeMinutes}m`,
    uptimeSeconds: Math.floor(uptime)
  };
}

// Main health check function
async function performHealthCheck() {
  const startTime = Date.now();
  
  try {
    const [dbCheck, memoryCheck, uptimeCheck] = await Promise.all([
      checkDatabase(),
      Promise.resolve(checkMemory()),
      Promise.resolve(checkUptime())
    ]);

    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      responseTime: `${responseTime}ms`,
      checks: {
        database: dbCheck,
        memory: memoryCheck,
        uptime: uptimeCheck
      }
    };

    // Overall status is unhealthy if any check fails
    if (dbCheck.status === 'unhealthy' || memoryCheck.status === 'unhealthy') {
      healthStatus.status = 'unhealthy';
    }

    return healthStatus;
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}

// Create HTTP server for health checks
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    try {
      const healthStatus = await performHealthCheck();
      const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
      
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(healthStatus, null, 2));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      }));
    }
  } else if (req.method === 'GET' && req.url === '/ready') {
    // Simple readiness check
    try {
      const dbCheck = await checkDatabase();
      const statusCode = dbCheck.status === 'healthy' ? 200 : 503;
      
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: dbCheck.status,
        timestamp: new Date().toISOString(),
        message: dbCheck.message
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      }));
    }
  } else if (req.method === 'GET' && req.url === '/live') {
    // Simple liveness check
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'Application is alive'
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'error',
      message: 'Endpoint not found',
      availableEndpoints: ['/health', '/ready', '/live']
    }));
  }
});

// Start the health check server
server.listen(HEALTH_CHECK_PORT, HEALTH_CHECK_HOST, () => {
  console.log(`Health check server running on http://${HEALTH_CHECK_HOST}:${HEALTH_CHECK_PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /health - Full health check');
  console.log('  GET /ready - Readiness check');
  console.log('  GET /live - Liveness check');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Health check server shutting down...');
  server.close(() => {
    console.log('Health check server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Health check server shutting down...');
  server.close(() => {
    console.log('Health check server closed');
    process.exit(0);
  });
});

module.exports = { performHealthCheck, checkDatabase, checkMemory, checkUptime };
