import 'reflect-metadata';
// jest.mock('module_name', () => {
//   return {
//     __esModule: true, // this property makes it work
//     default: jest.fn(() => 42),
//     namedExport: jest.fn(),
//   };
// });
process.env.TZ = 'UTC';
jest.setTimeout(30000); // Ajusta a 30 segundos
afterEach(() => {
  jest.clearAllMocks();
});
