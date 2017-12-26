var privateSettings  = require('./settings.private');

module.exports = {
    servicePort: process.env.PORT || 5000,
    morganLevel: 'dev',
    jira: {
      user: process.env.JIRA_USER || privateSettings.jira.user,
      password: process.env.JIRA_PASSWORD || privateSettings.jira.password,
      baseUrl: process.env.JIRA_BASE_URL || privateSettings.jira.baseUrl,
      jql: process.env.JIRA_JQL || privateSettings.jira.jql,
    },
    calendario: {
      token: process.env.CALENDARIO_TOKEN || privateSettings.calendario.token,
      baseUrl: process.env.CALENDARIO_BASE_URL || privateSettings.calendario.baseUrl,
      city: process.env.CALENDARIO_CITY || privateSettings.calendario.city,
      state: process.env.CALENDARIO_STATE || privateSettings.calendario.state,
    }
};
