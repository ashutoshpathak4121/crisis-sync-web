const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

describe('Hospital Resource Endpoints & Real-time Bounds Validation', () => {
  let authToken;
  let hospitalId;

  beforeAll(async () => {
    // Log in as Admin to obtain valid token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@crisissync.demo',
        password: 'DemoPassword123!'
      });

    authToken = loginRes.body.data.token;

    const hospitalsRes = await request(app).get('/api/hospitals');
    hospitalId = hospitalsRes.body.data.hospitals[0].id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should list all hospitals with their resources', async () => {
    const res = await request(app).get('/api/hospitals');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hospitals.length).toBeGreaterThan(0);
    expect(res.body.data.hospitals[0].resources).toBeDefined();
  });

  it('should update emergency beds and return updated resource model', async () => {
    const res = await request(app)
      .put(`/api/hospitals/${hospitalId}/resources`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        emergencyBedsAvailable: 5
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.resources.emergencyBedsAvailable).toEqual(5);
  });

  it('should reject update if available beds exceed total beds', async () => {
    const res = await request(app)
      .put(`/api/hospitals/${hospitalId}/resources`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        emergencyBedsAvailable: 999,
        emergencyBedsTotal: 20
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
