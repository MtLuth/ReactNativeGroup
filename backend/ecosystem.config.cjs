module.exports = {
  apps: [
    {
      name: "backend-server_8088",
      script: "index.js",
      watch: false,
      instances: 1,
      exec_mode: "fork",
      interpreter: "node",
      interpreter_args: "--enable-source-maps",
      env: {
        NODE_ENV: "development",
        PORT: 8088,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8088,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
