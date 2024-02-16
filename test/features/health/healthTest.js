const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const { helloWorld, status, error } = require('../../../src/features/health/health.controller.js');

// VARIABLES //////////
const port = process.env.PORT || 3004;
const envName = process.env.ENV_NAME || 'local';

describe('health.controller.js', ()=>{
  afterEach(() => {
    sinon.restore();
  });

  describe('helloWorld function', () => {
    it('should respond with status 200 and message "Hello World!!"', async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy(),
      };

      await helloWorld(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith('Hello World!!')).to.be.true;
    });
  });

  describe('status function', () => {
    it('should respond with status 200 and correct message', async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy(),
      };

      await status(req, res, envName, port);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(`Environment '${envName}' running on port: ${port}`)).to.be.true;
    });
  });

  describe('error function', () => {
    it('should respond with status 400 and correct message', async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy(),
      };

      await error(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith('400 Bad Request - On required request body or parameter')).to.be.true;
    });
  });

});
