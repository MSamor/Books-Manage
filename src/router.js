import Vue from 'vue'
import Router from 'vue-router'
import bookManage from './views/bookMange.vue'
import bookSearch from './views/bookSearch.vue'
import bookLog from './views/bookLog.vue'
import book from './views/book.vue'
import logins from './views/logins.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'logins',
      component: logins
    },
    {
      path: '/book',
      name: 'book',
      component: book,
      children: [
        {
          path: 'bookManage',
          name: 'abbookManageout',
          component: bookManage
        },
        {
          path: 'bookSearch',
          name: 'bookSearch',
          component: bookSearch
        },
        {
          path: 'bookLog',
          name: 'bookLog',
          component: bookLog
        }
      ]
    }
  ]
})
