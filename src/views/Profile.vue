<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>个人中心</h2>
          </div>
          <div class="profile-content">
            <div class="profile-header">
              <div class="avatar">👤</div>
              <div class="user-info">
                <h3>{{ userInfo.name }}</h3>
                <p>{{ userInfo.role }}</p>
              </div>
            </div>
            <el-form :model="userInfo" label-width="120px" class="profile-form">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" disabled />
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="userInfo.name" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" />
              </el-form-item>
              <el-form-item label="角色">
                <el-input v-model="userInfo.role" disabled />
              </el-form-item>
              <el-form-item label="状态">
                <el-tag :type="userInfo.status === 'active' ? 'success' : 'warning'">
                  {{ userInfo.status === 'active' ? '在职' : '离职' }}
                </el-tag>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSave">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { getUserInfo, updateUser } from '../api/user'

const userInfo = ref({
  id: '',
  username: '',
  name: '',
  email: '',
  role: '',
  status: ''
})

const handleSave = async () => {
  try {
    await updateUser(userInfo.value.id, userInfo.value)
    alert('个人信息更新成功')
  } catch (error) {
    console.error('更新失败:', error)
    alert('更新失败: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(() => {
  getUserInfo().then(response => {
    if (response && response.data) {
      userInfo.value = response.data
    }
  }).catch(error => {
    console.error('获取用户信息失败:', error)
  })
})
</script>

<style scoped>
.page-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.content-wrapper {
  flex: 1;
  padding: 20px;
}

.page-card {
  height: calc(100% - 40px);
}

.card-header {
  margin-bottom: 20px;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.profile-content {
  max-width: 600px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 24px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.user-info {
  color: white;
  
  h3 {
    font-size: 20px;
    margin: 0 0 8px 0;
  }
  
  p {
    margin: 0;
    opacity: 0.8;
  }
}

.profile-form {
  background: white;
  padding: 24px;
  border-radius: 12px;
}
</style>