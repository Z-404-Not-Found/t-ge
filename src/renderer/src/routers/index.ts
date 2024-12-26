import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: '/chat',
      component: () => import('@renderer/views/Layout.vue'),
      children: [
        {
          path: 'chat',
          name: 'chat',
          component: () => import('@renderer/views/Chat.vue')
        },
        {
          path: '/setting',
          name: 'setting',
          component: () => import('@renderer/views/Setting.vue')
        }
      ]
    },
    {
      path: '/update',
      name: 'update',
      component: () => import('@renderer/views/Updater.vue')
    }
  ]
})

export default router
