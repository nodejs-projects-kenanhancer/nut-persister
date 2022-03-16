module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.*'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!src/**/index.ts'],
    modulePaths: ['<rootDir>'],
    coverageDirectory: './coverage',
    testPathIgnorePatterns: ['/node_modules/', '/dist/']
};