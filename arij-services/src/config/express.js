var express           = require('express');
var load              = require('express-load');
var bodyParser        = require('body-parser');
var morgan            = require('morgan');
var appSettings       = require('./settings');
var cors              = require('cors');
var methodOverride    = require('method-override');

module.exports = function() {
    var app = express();

    app.set('port', appSettings.servicePort);

    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(morgan(appSettings.morganLevel));
    app.use(cors());

    load('controllers', {verbose: true, cwd:'src/api'})
    .then('routes')
    .into(app);

    return app;
};
