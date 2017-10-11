const request = require('superagent');
const Throttle = require('superagent-throttle');
const fs = require('fs');
const credentials = require('../github-credentials.json');
const Storage = require('../src/storage');

class Agent {
  constructor() {
    this.credentials = credentials;
  }

  hostRequest(pageURL) {
    return request
      .get(pageURL)
      .auth(this.credentials.username, this.credentials.token)
      .set('Accept', 'application/vnd.github.v3+json');
  }

  fetchPopularUsers(url, popularUsersAreReady) {
    let popularUsers = [];

    function fetchPage(pageURL) {
      console.log(`Fetching${pageURL}`);

      request
        .get(pageURL)
        .auth(credentials.username, credentials.token)
        .set('Accept', 'application/vnd.github.v3+json')
        .end((err, res) => {
          popularUsers = popularUsers.concat(res.body.items);
          if (res.links.next) {
            fetchPage(res.links.next);
          } else {
            popularUsersAreReady(popularUsers);
          }
        });
    }
    fetchPage(url);
  }

  fetchUser(user, throttle, userHasBeenFetched) {
    console.log(`Fetching ${user.url}`);

    this.hostRequest(user.url)
      .use(throttle.plugin())
      .end((err, res) => {
        userHasBeenFetched(res);
      });
  }

  findHireableUsers(numberOfRepo, numberOfFollower, hireableUsersFound) {
    const pageURL = `https://api.github.com/search/users?q=repos%3A>${numberOfRepo}+followers%3A>${numberOfFollower}`;

    this.fetchPopularUsers(pageURL, (popularUsers) => {
      const hireableUsers = [];

      let numberOfUserDetailsToFetch = popularUsers.length;
      const throttle = new Throttle({
        active: true, // set false to pause queue
        rate: 500, // how many requests can be sent every `ratePer`
        ratePer: 1000, // number of ms in which `rate` requests may be sent
        concurrent: 10, // how many requests can be sent concurrently
      });


      popularUsers.forEach((user) => {
        this.fetchUser(user, throttle, (userDetails) => {
          numberOfUserDetailsToFetch -= 1;

          if (userDetails.body.hireable) {
            hireableUsers.push(userDetails.body);
          }

          if (numberOfUserDetailsToFetch === 0) {
            hireableUsersFound(hireableUsers);
          }
        });
      });
    });
  }

  createFile() {
    const numberOfRepo = 30;
    const numberOfFollower = 3000;

    this.findHireableUsers(numberOfRepo, numberOfFollower, (hireableUsers) => {
      const content = {
        info: {
          followers: numberOfFollower,
          repo: numberOfRepo,
        },
        values: hireableUsers,
      };
      const wstream = fs.createWriteStream('hireableUsers.json');
      wstream.write(JSON.stringify(content, null, 2));
      wstream.end();

      const s = new Storage(this.credentials.username, this.credentials.token, 'aliens_client');
      s.publish('docs/data/hireableUsers.json', JSON.stringify(content, null, 2), 'new version of the file');
    });
  }
}

module.exports = Agent;

new Agent(credentials).createFile();
