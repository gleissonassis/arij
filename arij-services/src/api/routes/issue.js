module.exports = function(app) {
    var controller = app.controllers.issue;

    app.route('/v1/issues')
      .get(controller.getIssues);
};
