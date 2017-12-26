<template>
  <div>
    <div v-show="isLoading"> <strong>Loading!</strong> Arij is loading the issues from Jira... </div>
    <div v-show="!isLoading">
      Issues <span class="badge">{{issues.length}}</span>
      <table class="table">
        <thead>
          <tr>
            <th style="width: 25px"></th>
            <th style="width: 100px">Key</th>
            <th>System</th>
            <th>Module</th>
            <th>Summary</th>
            <th>Creator</th>
            <th>Responsible</th>
            <th>Created</th>
            <th>Updated</th>
            <th>SLA</th>
            <th>Expiration</th>
          </tr>
        </thead>
        <tbody >
          <tr v-for="issue in issues" :key="issue.key">
            <td :title="issue.sla.date | fromNow"><span :inner-html.prop="issue.sla.percentage | slaIndicator"></span></td>
            <td><a :href="issue.url" target="_blank">{{issue.key}}</a></td>
            <td>{{issue.system}}</td>
            <td>{{issue.systemModule}}</td>
            <td>{{issue.summary}}</td>
            <td>{{issue.creator.name}}</td>
            <td>{{issue.assignee.name}}</td>
            <td :title="issue.created | formatDate">{{issue.created | fromNow}}</td>
            <td :title="issue.updated | formatDate">{{issue.updated | fromNow}}</td>
            <td>{{issue.sla.days}}</td>
            <td :title="issue.sla.date | formatDate">{{issue.sla.date | fromNow}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  Vue.filter('slaIndicator', function (value) {
    if (value !== undefined) {
      if (value >= 1) {
        return '<span class="label label-danger"><i class="glyphicon glyphicon-ban-circle" /></span>'
      } else if (value >= 0.75) {
        return '<span class="label label-warning"><i class="glyphicon glyphicon-warning-sign" /></span>'
      } else {
        return '<span class="label label-success"><i class="glyphicon glyphicon-ok-circle" /></span>'
      }
    }
  })

  export default {
    components: {
    },
    data: function () {
      return {
        isLoading: true,
        issues: []
      }
    },
    mounted: function () {
      this.update()
    },
    methods: {
      update: function () {
        var self = this
        this.$http.get('/api/v1/issues')
          .then(function (response) {
            self.issues = response.body
            self.isLoading = false

            self.$notify.success('The issues was loaded successfully!')
          })
      }
    }
  }
</script>
