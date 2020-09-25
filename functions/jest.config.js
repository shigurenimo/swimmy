module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  rootDir: 'src',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['lib/', 'node_modules/'],
  testRegex: '(\\.|/)(test|spec)\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
}
