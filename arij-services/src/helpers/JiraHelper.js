var Promise         = require('promise');
var request         = require('request');
var logger          = require('../config/logger');
var base64Helper    = require('./base64Helper');

function JiraHelper(ch) {
  return {
    options: {},

    calculateIssueSLA: function(issue) {
      return new Promise(function(resolve, reject) {
        logger.log('info', '[jiraHelper] Calculating SLA for ', issue.summary);
        ch.getNearBusinessDay(new Date(issue.created))
          .then(function(referenceDate) {
            logger.log('info', '[jiraHelper] The near business day is ', referenceDate);
            var slaDate = new Date(referenceDate.getTime());

            var days = 0;

            if (
              ((issue.type === 'Solicitação' || issue.type === 'Bug')
              && (
                issue.systemModule === 'Registro E/S / Apontamentos' ||
                issue.systemModule === 'AP' ||
                issue.systemModule === 'Pagamentos' ||
                issue.systemModule === 'Movimentação de Talentos'
              ))
              || issue.priority === 'Blocker'
              || issue.type === 'Dúvida'
            ) {
              days = 1;
            } else if (issue.type === 'Melhoria') {
              days = 10;
            } else {
              days = 5;
            }

            slaDate.setDate(slaDate.getDate() + days);
            var now = new Date();

            issue.sla = {};
            issue.sla.date = slaDate;
            issue.sla.isExpired = issue.sla.date < now;
            issue.sla.timeElapsed = Math.round(Math.abs(issue.created - now) / 3.6e6,0);
            issue.sla.hours = Math.abs(issue.created - issue.sla.date) / 3.6e6;
            issue.sla.days = days;
            issue.sla.percentage = (issue.sla.timeElapsed / issue.sla.hours);

            logger.log('info', '[jiraHelper] Calculated SLA for ', issue.summary);
            return issue;
          })
          .then(function(issue) {
            resolve(issue);
          })
          .catch(function() {
            reject();
          });
      });
    },

    calculateIssuesSLA: function(issues) {
      var self = this;

      return new Promise(function(resolve, reject) {
        var p = [];

        issues.forEach(function(issue) {
          p.push(self.calculateIssueSLA(issue));
        });

        Promise.all(p)
          .then(function(r) {
            console.log('aaaaaaaa', r);
            resolve(issues);
          })
          .catch(reject);
      });
    },

    readJiraIssues: function() {
      var self = this;

      logger.log('info', '[jiraHelper] Connecting to the Jira');
      return new Promise(function (resolve, reject) {
        var encoded = base64Helper(self.options.user + ':' + self.options.password);

        var options = {
          uri: self.options.baseUrl + '/rest/api/2/search?jql=' + self.options.jql + '&maxResults=100',
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + encoded,
            'Content-Type': 'application/json',
          },
          json:true
        };

        logger.log('debug', '[jiraHelper] options: %s', options);

        request(options, function (error, response, body) {
          logger.log('debug', '[jiraHelper] error: %s', error);
          logger.log('debug', '[jiraHelper] response: %s', response);
          logger.log('debug', '[jiraHelper] body: %s', body);

          if (error || (response && response.statusCode !== 200)) {
            var e = error ? error : response;
            logger.log('error', '[jiraHelper] An error has ocurred while connecting the jira %s', e);
            reject(e);
          } else {
            logger.log('info', '[jiraHelper] The connection was made succesfully');

            var issues = body.issues.map(function(issue) {
              return {
                key: issue.key,
                url: self.options.baseUrl + '/browse/' + issue.key,
                lastViewed: issue.fields.lastViewed,
                assignee: {
                  name: issue.fields.assignee.displayName,
                  email: issue.fields.assignee.emailAddress,
                },
                type: issue.fields.issuetype.name,
                status: issue.fields.status.name,
                creator: {
                  name: issue.fields.creator.displayName,
                  email: issue.fields.creator.emailAddress,
                },
                system: issue.fields.customfield_15502 ? issue.fields.customfield_15502.value : '',
                systemModule: issue.fields.customfield_17702,
                priority: issue.fields.priority.name,
                created: new Date(issue.fields.created),
                updated: new Date(issue.fields.updated),
                summary: issue.fields.summary,
                description: issue.fields.description
              };
            });

            resolve(issues);
          }
        });
      });
    },

    getIssues: function() {
      var self = this;

      return new Promise(function(resolve, reject) {
        var chain = Promise.resolve();

        chain
          .then(function() {
            return self.readJiraIssues();
          })
          .then(function(issues) {
            logger.log('info', '[jiraHelper] Calculating SLA');
            return self.calculateIssuesSLA(issues);
          })
          .then(function(issues) {
            logger.log('info', '[jiraHelper] Issues');
            resolve(issues);
          })
          .catch(reject);
      });
    }
  };
}

module.exports = JiraHelper;
