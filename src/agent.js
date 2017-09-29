const request = require('superagent');
const Throttle = require('superagent-throttle');

class Agent {
  constructor(credentials) {
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

    function fetchPage(credentials, pageURL) {
      console.log(`Fetching${pageURL}`);

      request
        .get(pageURL)
        .auth(credentials.username, credentials.token)
        .set('Accept', 'application/vnd.github.v3+json')
        .end((err, res) => {
          popularUsers = popularUsers.concat(res.body.items);
          if (res.links.next) {
            fetchPage(credentials, res.links.next);
          } else {
            popularUsersAreReady(popularUsers);
          }
        });
    }
    fetchPage(this.credentials, url);
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
            hireableUsersFound(userDetails);
          }
        });
      });
    });
  }
}


module.exports = Agent;
