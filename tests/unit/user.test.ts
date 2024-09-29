import request from 'supertest';
import app from '../../src/app'
describe('GET /user', () => {
    it('should return a greeting message', async () => {
        const response = await request(app).get('/user');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Hello, User!' });
    });
});
