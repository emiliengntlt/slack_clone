import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', // Path to API routes
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Messages API Documentation',
        version: '1.0.0',
      },
    },
  });
  return spec;
}; 