'use strict';


// IMPORTS =====================================================================

var request = require('request');
var AlexaSkill = require('libs/alexa_skill');
var config = require('./config');


// CONFIG ======================================================================

var ALEXA_APP_ID = config.ALEXA_APP_ID;

var RedditDad = function() {
  AlexaSkill.call(this, ALEXA_APP_ID);
};

// Extend AlexaSkill.
RedditDad.prototype = Object.create(AlexaSkill.prototype);
RedditDad.prototype.constructor = RedditDad;


// LIFECYCLE ===================================================================

RedditDad.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {
  console.log("RedditDad onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
}

RedditDad.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
  console.log("RedditDad onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
  handleJokeRequest(response);
}

RedditDad.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
  console.log("RedditDad onSessionEnded requestId: " + sessionEndedRequest.requestId
  + ", sessionId: " + session.sessionId);
};


// HANDLES =====================================================================

RedditDad.prototype.intentHandlers = {
  "GetJokeIntent": function (intent, session, response) {
    handleJokeRequest(response);
  },

  "AMAZON.HelpIntent": function (intent, session, response) {
    response.ask("Ask me to tell you a dad joke from Reddit!");
  },

  "AMAZON.StopIntent": function (intent, session, response) {
    response.handleStopRequest(response);
  },

  "AMAZON.CancelIntent": function (intent, session, response) {
    response.handleStopRequest(response);
  }
};

function handleJokeRequest(alexaResponse) {
  request('https://www.reddit.com/r/dadjokes.json', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var children = JSON.parse(response.body).data.children;
      var choice = Math.floor(Math.random() * children.length);
      var data = children[choice].data;
      var answer = data.title + ".\n\n " + data.selftext;
      alexaResponse.tell(answer);
    }
  });
}

function handleStopRequest(response) {
  var speechOutput = "See ya!";
  response.tell(speechOutput);
}


// EXPORT ======================================================================

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  // Create an instance of the RedditDad skill.
  var highLowBot = new RedditDad();
  highLowBot.execute(event, context);
};
