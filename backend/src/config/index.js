const fs = require('fs');
const path = require('path');

class Config {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      // Determine environment
      const environment = process.env.NODE_ENV || 'development';
      
      // Load appropriate configuration file
      let configPath;
      if (environment === 'production') {
        configPath = path.join(process.cwd(), 'config', 'config.json.template');
      } else {
        configPath = path.join(process.cwd(), 'config', 'config.json');
      }

      const configFile = fs.readFileSync(configPath, 'utf8');
      let config = JSON.parse(configFile);

      // Replace environment variable placeholders in production
      if (environment === 'production') {
        config = this.replaceEnvVars(config);
      }

      return config;
    } catch (error) {
      console.error('Error loading configuration:', error);
      process.exit(1);
    }
  }

  replaceEnvVars(obj) {
    if (typeof obj === 'string') {
      return this.replaceEnvVarInString(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.replaceEnvVars(item));
    } else if (typeof obj === 'object' && obj !== null) {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replaceEnvVars(value);
      }
      return result;
    }
    return obj;
  }

  replaceEnvVarInString(str) {
    return str.replace(/\$\{([^}]+)\}/g, (match, envVar) => {
      const value = process.env[envVar];
      if (value === undefined) {
        console.warn(`Warning: Environment variable ${envVar} is not set`);
        return '';
      }
      return value;
    });
  }

  // Getter methods for easy access to configuration
  get app() {
    return this.config.app;
  }

  get frontend() {
    return this.config.frontend;
  }

  get database() {
    return this.config.database;
  }

  get redis() {
    return this.config.redis;
  }

  get auth() {
    return this.config.auth;
  }

  get upload() {
    return this.config.upload;
  }

  get email() {
    return this.config.email;
  }

  get payment() {
    return this.config.payment;
  }

  get security() {
    return this.config.security;
  }

  get logging() {
    return this.config.logging;
  }

  get monitoring() {
    return this.config.monitoring;
  }

  get cache() {
    return this.config.cache;
  }

  get admin() {
    return this.config.admin;
  }

  get development() {
    return this.config.development;
  }

  // Helper methods
  getDatabaseUrl() {
    const { database } = this.config;
    return `postgresql://${database.username}:${database.password}@${database.host}:${database.port}/${database.name}`;
  }

  getRedisUrl() {
    const { redis } = this.config;
    if (redis.password) {
      return `redis://:${redis.password}@${redis.host}:${redis.port}/${redis.db}`;
    }
    return `redis://${redis.host}:${redis.port}/${redis.db}`;
  }

  isDevelopment() {
    return this.config.app.environment === 'development';
  }

  isProduction() {
    return this.config.app.environment === 'production';
  }

  isStaging() {
    return this.config.app.environment === 'staging';
  }
}

// Create singleton instance
const config = new Config();

module.exports = config;
