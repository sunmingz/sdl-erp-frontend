<template>
  <header class="header">
    <div class="header-left">
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>
    <div class="header-right">
      <button class="header-btn" @click="handleNotification">
        <span>🔔</span>
      </button>
      <div class="user-dropdown">
        <button class="user-info" @click="toggleDropdown">
          <span>👤</span>
          <span>{{ userName }}</span>
        </button>
        <div v-show="dropdownVisible" class="dropdown-menu">
          <button class="dropdown-item" @click="handleProfile">个人中心</button>
          <button class="dropdown-item" @click="handleChangePassword">修改密码</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item logout" @click="handleLogout">退出登录</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { logout } from '../api/user'

const router = useRouter()
const route = useRoute()
const pageTitle = ref('仪表盘')
const userName = ref('管理员')
const dropdownVisible = ref(false)

const titleMap = {
  '/dashboard': '仪表盘',
  '/user': '用户管理',
  '/order': '订单管理',
  '/inventory': '库存管理',
  '/purchase': '采购管理',
  '/sales': '销售管理',
  '/finance': '财务管理',
  '/department': '部门管理',
  '/menu': '菜单管理',
  '/role': '角色管理',
  '/bom': 'BOM管理',
  '/route': '工艺路线',
  '/qc': '质检管理',
  '/production': '生产订单',
  '/cost': '成本核算'
}

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

const closeDropdown = () => {
  dropdownVisible.value = false
}

const handleProfile = () => {
  closeDropdown()
  router.push('/profile')
}

const handleChangePassword = () => {
  closeDropdown()
  router.push('/changepassword')
}

const handleNotification = () => {
  console.log('点击通知')
}

const handleLogout = async () => {
  console.log('点击退出登录')
  try {
    await logout()
  } catch (error) {
    console.error('退出失败:', error)
  } finally {
    localStorage.removeItem('token')
    router.push('/login')
  }
}

const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.user-dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  pageTitle.value = titleMap[route.path] || '仪表盘'
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

router.afterEach((to) => {
  pageTitle.value = titleMap[to.path] || '仪表盘'
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
}

.header-btn:hover {
  background: #f5f7fa;
}

.user-dropdown {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  color: #606266;
  border: none;
  background: transparent;
  border-radius: 4px;
}

.user-info:hover {
  background: #f5f7fa;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  z-index: 1000;
}

.dropdown-item {
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f5f7fa;
}

.dropdown-item.logout {
  color: #f56c6c;
}

.dropdown-divider {
  height: 1px;
  background: #ebeef5;
  margin: 4px 0;
}
</style>
