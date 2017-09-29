const chai = require('chai');
const request = require('superagent');
const { username, token } = require('../github-credentials.json');

const should = chai.should();

describe('Github API', () => {
  it('allows me to get popular contributors', (done) => {
    const numberOfRepo = 30;
    const numberOfFollower = 2500;
    const url = `https://api.github.com/search/users?q=repos%3A>${numberOfRepo}+followers%3A>${numberOfFollower}`;
    request
      .get(url)
      .auth(username, token)
      .set('Accept', 'application/vnd.github.v3+json')
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        done();
      });
  });
});

describe('Github API', () => {
  it('allows me to get popular contributors', (done) => {
    const url = 'https://api.github.com/users/Bykow';
    request
      .get(url)
      .auth(username, token)
      .set('Accept', 'application/vnd.github.v3+json')
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        //res.body.hireable.should.be('true');
        done();
      });
  });
});
