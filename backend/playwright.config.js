const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'https://life-os-platform.vercel.app',
    headless: true,
    screenshot: 'only-on-failure',
  },
  reporter: 'list',
})