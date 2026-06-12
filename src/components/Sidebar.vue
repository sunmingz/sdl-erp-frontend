<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>SDL-ERP</h2>
    </div>
    <nav class="sidebar-nav">
      <el-menu :default-active="activeMenu" mode="vertical" class="sidebar-menu" @select="handleSelect">
        <el-menu-item index="/dashboard">
          <span class="menu-icon">📊</span>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/order">
          <span class="menu-icon">📦</span>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/inventory">
          <span class="menu-icon">📦</span>
          <span>库存管理</span>
        </el-menu-item>
        <el-menu-item index="/purchase">
          <span class="menu-icon">🛒</span>
          <span>采购管理</span>
        </el-menu-item>
        <el-menu-item index="/sales">
          <span class="menu-icon">📈</span>
          <span>销售管理</span>
        </el-menu-item>
        <el-menu-item index="/finance">
          <span class="menu-icon">💰</span>
          <span>财务管理</span>
        </el-menu-item>
        <el-sub-menu index="/system">
          <template #title>
            <span class="menu-icon">⚙️</span>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/user">
            <span class="menu-icon">👤</span>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/department">
            <span class="menu-icon">🏢</span>
            <span>部门管理</span>
          </el-menu-item>
          <el-menu-item index="/menu">
            <span class="menu-icon">📋</span>
            <span>菜单管理</span>
          </el-menu-item>
          <el-menu-item index="/role">
            <span class="menu-icon">🎭</span>
            <span>角色管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/route">
          <span class="menu-icon">🛣️</span>
          <span>工艺路线</span>
        </el-menu-item>
        <el-menu-item index="/qc">
          <span class="menu-icon">✅</span>
          <span>质检管理</span>
        </el-menu-item>
        <el-menu-item index="/production">
          <span class="menu-icon">🏭</span>
          <span>生产订单</span>
        </el-menu-item>
        <el-menu-item index="/cost">
          <span class="menu-icon">💰</span>
          <span>成本核算</span>
        </el-menu-item>
      </el-menu>
    </nav>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeMenu = ref('/dashboard')

onMounted(() => {
  activeMenu.value = route.path
})

router.afterEach((to) => {
  activeMenu.value = to.path
})

const handleSelect = (index) => {
  console.log('菜单点击:', index)
  router.push({ path: index }).then(() => {
    console.log('路由跳转成功:', index)
  }).catch((error) => {
    console.error('路由跳转失败:', error)
  })
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #2f3542;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  background: #1a1d23;
  text-align: center;
}

.sidebar-header h2 {
  color: white;
  font-size: 18px;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 10px;
}

.sidebar-menu {
  border: none;
}

.menu-icon {
  margin-right: 8px;
}

.sidebar-menu :deep(.el-menu-item) {
  color: #a0aec0;
  height: 48px;
  line-height: 48px;
  margin-bottom: 4px;
  border-radius: 8px;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: #667eea;
  color: white;
}
</style>
