var Promise         = require('promise');
var request         = require('request');
var parseString     = require('xml2js').parseString;
var logger          = require('../config/logger');
var locks           = require('locks');

var cache = {};

var mutex = locks.createMutex();

function CalendarHelper() {
  return {
    options: {},

    getCalendarInfo: function(year) {
      var self = this;
      return new Promise(function(resolve, reject) {
          var options = {
            uri: self.options.baseUrl + '/api/api_feriados.php?ano=' + year +
                                         '&estado=' + self.options.state +
                                         '&cidade=' + self.options.city +
                                         '&token=' + self.options.token,
            method: 'GET'
          };
          request(options, function (error, response, body) {
            if (error || (response && response.statusCode !== 200)) {
              var e = error ? error : response;
              reject(e);
            } else {
              parseString(body, function (err, result) {
                cache[year] = [];
                result.events.event.forEach(function(event) {
                  if (event.type_code[0] === '1') {
                    var d = event.date[0].split('/');
                    cache[year].push(new Date(parseInt(d[2]) + 1900, parseInt(d[1]) - 1, d[0]));
                  }
                });
                logger.log('info', '[CalendarHelper] Holidays for ', year + 1900);
                console.log(cache[year]);
                resolve(cache[year]);
              });
            }
          });
      });
    },

    checkIsBusinessDay: function(date) {
      var self = this;
      return new Promise(function(resolve, reject) {
        logger.log('info', '[CalendarHelper] Parsing the date ', date);
        var referenceDate = new Date(date.getYear() + 1900,
                                     date.getMonth(),
                                     date.getDate());
        logger.log('info', '[CalendarHelper] ', referenceDate);

        var chain = Promise.resolve();
        chain
          .then(function() {
            logger.log('info', '[CalendarHelper] Checking if there is cache for year ', date.getYear());
            if (!cache[date.getYear()]) {
              logger.log('info', '[CalendarHelper] There is no cache for year ', date.getYear());
              return self.getCalendarInfo(date.getYear());
            } else {
              logger.log('info', '[CalendarHelper] There is cache for year ', date.getYear());
              return cache[date.getYear()];
            }
          })
          .then(function(items) {
            logger.log('info', '[CalendarHelper] Checking if the date is a business day ', referenceDate);
            var found = items.filter(function(element) {
              return element.getTime() === referenceDate.getTime();
            });

            var isHoliday = found.length > 0;
            var isBusinessDay = !isHoliday && (referenceDate.getDay() !== 0  && referenceDate.getDay() !== 6);

            logger.log('info', '[CalendarHelper] Is holiday? ', isHoliday);
            logger.log('info', '[CalendarHelper] Day of week ', referenceDate.getDay());
            logger.log('info', '[CalendarHelper] Is business day? ', isBusinessDay);

            return isBusinessDay;
          })
          .then(resolve)
          .catch(reject);
      });
    },

    getNearBusinessDay: function(date) {
      var self = this;

      return new Promise(function(resolve, reject) {
        mutex.lock(function() {
          self._getNearBusinessDay(date, resolve, reject);
        });
      });
    },

    _getNearBusinessDay: function(date, firstResolve, firstReject) {
      var self = this;
      self.checkIsBusinessDay(date)
        .then(function(isBusinessDay) {
          if (isBusinessDay) {
            mutex.unlock();
            return firstResolve(date);
          } else {
            var d = new Date(date.getTime());
            d.setDate(d.getDate() + 1);
            d.setHours(9);
            d.setMinutes(0);
            d.setSeconds(0);

            return self.getNearBusinessDay(d, firstResolve, firstReject);
          };
        })
        .catch(firstReject);
    }
  };
}

module.exports = CalendarHelper;
