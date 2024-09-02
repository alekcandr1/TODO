module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!axios)/"],
  moduleNameMapper: {
    "^axios$": "axios/dist/axios.js",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
}