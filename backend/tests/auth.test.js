const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

describe('Auth Endpoints & Verification', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('healthy');
  });

  it('should successfully log in demo admin user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@crisissync.demo',
        password: 'DemoPassword123!'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toEqual('ADMIN');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@crisissync.demo',
        password: 'WrongPassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});
