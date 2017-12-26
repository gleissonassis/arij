# Arij

## About

This software is a issue monitor built for managing SLA for my team. Maybe it will not be
useful for you, but is a simple example of Docker+Node+Nginx+Vue. You can check this out to find
something interesting about these technologies.

## Configurations

To run Arij you must configure arij-services/src/config/settings.private.js as follow:

```javascript
module.exports = {
  jira: {
    user: '<USER_NAME>',
    password: '<PASSWORD>',
    baseUrl: '<BASE_URL>',
    jql: '<JQL>'
  },
  calendario: {
    token: '<TOKEN>',
    baseUrl: '<BASE_URL>',
    city: '<CITY>',
    state: '<STATE>'
  }
};
```

As you can see, Arij uses the service Calendario (available at http://www.calendario.com.br/api_feriados_municipais_estaduais_nacionais.php) to verify if a day is a business day (this service is available only in Brazil). You must specify your token but you can get it for free.

## Installation
```
git clone https://github.com/gleissonassis/arij.git
cd arij
dockercompose up
```

By default the app will be running at http://localhost:8080, but you change it by editing
docker-compose.yml
