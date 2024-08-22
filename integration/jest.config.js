module.exports = {
  preset: "jest-puppeteer",
  testRegex: "./*\\.test\\.js$",
  setupFilesAfterEnv: ["./setupTests.js"],
  moduleNameMapper: {
    "^axios$": "axios/dist/node/axios.cjs",
  },
}
