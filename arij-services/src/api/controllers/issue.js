var settings            = require('../../config/settings');
var JiraHelper          = require('../../helpers/JiraHelper');
var CalendarHelper      = require('../../helpers/CalendarHelper');

module.exports = function() {

  return {
    getIssues: function(req, res) {
      var ch = new CalendarHelper();
      ch.options = {
        token: settings.calendario.token,
        baseUrl: settings.calendario.baseUrl,
        city: settings.calendario.city.city,
        state: settings.calendario.state
      };

      var jh = new JiraHelper(ch);

      jh.options = {
        user: settings.jira.user,
        password: settings.jira.password,
        baseUrl: settings.jira.baseUrl,
        jql: settings.jira.jql
      };

      jh.getIssues()
        .then(function(r) {
          res.status(200).json(r);
        })
        .catch(function(r) {
          res.status(500).json(r);
        });
    }
  };
};
