/** PM2: запуск commo.cc на сервере. Порт 3000 (прокси через nginx). */
module.exports = {
  apps: [
    {
      name: "commo",
      cwd: __dirname,
      script: "node_modules/.bin/next",
      args: "start",
      interpreter: "none",
      env: { NODE_ENV: "production" },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    },
  ],
};
