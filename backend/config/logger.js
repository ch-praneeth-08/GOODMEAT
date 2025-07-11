const pino = require('pino');

// Configure pino-pretty for development
const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname', // Don't show process ID and hostname
  }
});

// Create the logger instance
const logger = pino(transport);

module.exports = logger;