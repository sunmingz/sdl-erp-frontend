<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>SDL-ERP</h1>
        <p>企业资源管理系统</p>
      </div>
      <el-form :model="form" class="login-form">
        <el-form-item>
          <el-input v-model="form.username" placeholder="用户名">
            <template #prefix>
              <span class="icon-span">👤</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="密码">
            <template #prefix>
              <span class="icon-span">🔒</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { login } from '../api/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.username || !form.password) {
    alert('请输入用户名和密码')
    return
  }
  
  console.log('登录请求:', form)
  
  try {
    const response = await login(form)
    console.log('登录响应:', response)
    
    if (response && response.data) {
      const result = response.data
      if (result.token) {
        localStorage.setItem('token', result.token)
        console.log('登录成功，跳转仪表盘')
        router.push('/dashboard')
      } else if (result.data && result.data.token) {
        localStorage.setItem('token', result.data.token)
        console.log('登录成功，跳转仪表盘')
        router.push('/dashboard')
      } else {
        alert('登录失败：未获取到token')
      }
    } else {
      alert('登录失败：响应格式错误')
    }
  } catch (error) {
    console.error('登录失败:', error)
    let errorMsg = '登录失败，请检查网络连接'
    if (error.response) {
      if (error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message
      } else if (error.response.status === 401) {
        errorMsg = '用户名或密码错误'
      }
    }
    alert(errorMsg)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 32px;
  color: #303133;
  margin-bottom: 8px;
}

.login-header p {
  color: #909399;
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

.icon-span {
  font-size: 18px;
}
</style>
