import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order.vue')
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/Inventory.vue')
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: () => import('../views/Purchase.vue')
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../views/Sales.vue')
  },
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('../views/Finance.vue')
  },
  {
    path: '/department',
    name: 'Department',
    component: () => import('../views/Department.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/Menu.vue')
  },
  {
    path: '/role',
    name: 'Role',
    component: () => import('../views/Role.vue')
  },
  {
    path: '/bom',
    name: 'BOM',
    component: () => import('../views/BOM.vue')
  },
  {
    path: '/route',
    name: 'Route',
    component: () => import('../views/Route.vue')
  },
  {
    path: '/qc',
    name: 'QC',
    component: () => import('../views/QC.vue')
  },
  {
    path: '/production',
    name: 'Production',
    component: () => import('../views/Production.vue')
  },
  {
    path: '/cost',
    name: 'Cost',
    component: () => import('../views/Cost.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/changepassword',
    name: 'ChangePassword',
    component: () => import('../views/ChangePassword.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
