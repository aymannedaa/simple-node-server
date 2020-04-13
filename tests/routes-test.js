const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('Test webserver API routes', () => {
  it("GET /demo should get I'm alive message", (done) => {
    chai.request(app)
      .get('/demo')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal('I\'m alive!');
        done();
      });
  });
  it('GET / should return 200 status', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('GET invalid route should return 404 status', (done) => {
    chai.request(app)
      .get('/INVALID_ROUTE')
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.text).to.not.be.empty;
        done();
      });
  });
});
