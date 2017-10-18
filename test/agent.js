const chai = require('chai');
const credentials = require('../github-credentials.json');
const Agent = require('../src/agent.js');

// Requiered for chai testing
const should = chai.should();

describe('Agent', () => {
  it('should fetch contributors', (done) => {
    const numberOfRepo = 30;
    const numberOfFollower = 3500;
    const agent = new Agent(credentials);
    agent.findHireableUsers(numberOfRepo, numberOfFollower, (popularUsers) => {
      // should.not.exist(err);
      popularUsers.should.be.an('array');
      done();
    });
  });
});
