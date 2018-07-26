import Vue from 'vue'
import Router from 'vue-router'
import Sales from '@/components/sales'
import Stocks from '@/components/stocks'
import Insert from '@/components/insert'
import Update from '@/components/update'
import Production from '@/components/production'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'sales',
      component: Sales
    },
    {
      path: '/sales',
      name: 'sales',
      component: Sales
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: Stocks
    },
    { path: '/insert', component: Insert },
    { path: '/update', component: Update },
    { path: '/production', component: Production }
  ]
})
