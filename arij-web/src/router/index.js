import Vue from 'vue'
import Router from 'vue-router'
import Issues from '@/components/issues'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Issues
    }
  ]
})
