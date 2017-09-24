import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/',
      name: "2048 Game",
      component: Game
    }
  ]
})
