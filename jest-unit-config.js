module.exports = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    transform: {
        '.+\\.ts$': 'ts-jest'
    },
}
