export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'GCSE Hub API',
    version: '1.0.0',
    description: 'API for GCSE Hub learning, practice, exams, revision planning and reporting.',
  },
  servers: [
    { url: 'http://localhost:4004/api', description: 'Local development' },
    { url: 'https://your-render-api.onrender.com/api', description: 'Production example' },
  ],
  paths: {
    '/health': { get: { summary: 'Health check', responses: { '200': { description: 'API and database status' } } } },
    '/auth/login': { post: { summary: 'Log in', responses: { '200': { description: 'Authenticated user and JWT token' } } } },
    '/auth/register': { post: { summary: 'Register parent or student account', responses: { '201': { description: 'Created account and JWT token' } } } },
    '/dashboard': { get: { summary: 'Authenticated dashboard summary', responses: { '200': { description: 'Dashboard data' } } } },
    '/questions/generated-practice': {
      get: {
        summary: 'Generate practice questions',
        parameters: [
          { name: 'year', in: 'query', schema: { type: 'integer', minimum: 7, maximum: 11 } },
          { name: 'count', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50 } },
          { name: 'topic', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Generated practice question list' } },
      },
    },
    '/exams/generate': { get: { summary: 'Generate a timed maths exam paper', responses: { '200': { description: 'Generated exam paper' } } } },
    '/learning-plan/me': { get: { summary: 'Personal learning plan', responses: { '200': { description: 'Adaptive learning plan' } } } },
  },
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
};
