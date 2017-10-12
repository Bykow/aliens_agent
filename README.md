#GITHUB ALIENS
This is a project realized for the TWEB course of the HEIG-VD. The goal is very simple: display an ordered list of the most popular GitHub contributors that are __hireable__ !

The website is looking great thanks to a [Creative Tim Template](https://www.creative-tim.com/).

The purpose of this small project is to get familiar with web design, this website gets its data from an [_agent_](https://github.com/Bykow/aliens_agent) crawling through the [GitHub v3 API](https://developer.github.com/v3/).
That agent runs thanks to [Heroku](https://www.heroku.com) and has a task scheduled every hour to push a text file containing the result of its work. 

The website is hosted thanks to GitHub Pages and can be found [here](https://bykow.github.io/aliens_client/).

Client [repo](https://github.com/Bykow/aliens_client)

##Agent
The agent uses a JS Script to fetch datas on the GitHub API and pushes it on the client repo. The agent is hosted on Heroku and runs every our thanks to a scheduler.

In this version of the agent, it also saves a local copy of the result file.

##Side Note
To make the agent work, you will need an GitHub acces token, generated in your account settings. Make sure to give this token the persmissions on your repos.

###Local
You will need a JSON file named with this content.
```
$ touch github-credentials.json
```
```JSON
{
  "username" : "Bykow",
  "token" : "YOUR_TOKEN_GOES_HERE"
}
```
I strongly recommend __not__ to push this file on your remote repo. Add it to your _.gitignore_
This will allow the agent to make more request to the GitHub API without getting restricted.

###Heroku
Once your app is deployed on Heroku, it will miss those credentials, you can add those as environment variables from the Heroku dashboard. 
