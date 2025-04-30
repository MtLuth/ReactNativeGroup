module.exports = {
  apps: [
    {
      name: "backend-server_7198",
      script: "index.js",
      watch: false,
      instances: 1,
      exec_mode: "fork",
      interpreter: "node",
      interpreter_args: "--enable-source-maps",
      env: {
        NODE_ENV: "development",
        PORT: 7198,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 7198,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
