export const openapiDocument = {
  openapi: "3.0.3",
  info: { title: "AutoStore API", version: "1.0.0", description: "AutoStore REST API v1" },
  servers: [{ url: "http://localhost:4000" }],
  paths: {
    "/health": { get: { summary: "Health check", responses: { "200": { description: "OK" } } } },
    "/api/v1/auth/register": { post: { summary: "Register user", responses: { "201": { description: "Created" } } } },
    "/api/v1/auth/login": { post: { summary: "Login", responses: { "200": { description: "OK" } } } },
    "/api/v1/categories": { get: { summary: "List categories", responses: { "200": { description: "OK" } } } },
    "/api/v1/products": { get: { summary: "List products", responses: { "200": { description: "OK" } } } },
    "/api/v1/orders": { get: { summary: "List authenticated user's orders", responses: { "200": { description: "OK" } } }, post: { summary: "Create order", responses: { "201": { description: "Created" } } } }
  }
};
