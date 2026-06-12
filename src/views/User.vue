<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>用户列表</h2>
            <el-button type="primary" @click="openAddModal">
              <span class="btn-icon">+</span>
              添加用户
            </el-button>
          </div>
          <div class="search-bar">
            <el-input v-model="searchText" placeholder="搜索用户名">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-button @click="handleSearch">搜索</el-button>
          </div>
          <el-table :data="userList" border>
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="role" label="角色" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </el-card>
      </div>
    </div>
    <el-dialog :title="isEdit ? '编辑用户' : '添加用户'" v-model="modalVisible">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item prop="password" v-if="!isEdit">
          <el-input v-model="form.password" type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item prop="role">
          <el-select v-model="form.role" placeholder="角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { getUserList, addUser, updateUser, deleteUser as apiDeleteUser } from '../api/user'

const searchText = ref('')
const userList = ref([])
const total = ref(100)
const pageSize = ref(10)
const currentPage = ref(1)

const modalVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = reactive({
  username: '',
  name: '',
  email: '',
  password: '',
  role: 'user'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

const loadUsers = async () => {
  console.log('加载用户数据...')
  try {
    const response = await getUserList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchText.value
    })
    console.log('用户列表响应:', response)
    
    if (response && response.data) {
      userList.value = response.data.data?.list || response.data.list || response.data
      total.value = response.data.data?.total || response.data.total || 0
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    if (error.response) {
      console.error('错误响应:', error.response)
    }
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadUsers()
}

const openAddModal = () => {
  isEdit.value = false
  form.username = ''
  form.name = ''
  form.email = ''
  form.password = ''
  form.role = 'user'
  modalVisible.value = true
}

const editUser = (row) => {
  isEdit.value = true
  form.username = row.username
  form.name = row.name
  form.email = row.email
  form.role = row.role
  modalVisible.value = true
}

const handleSubmit = async () => {
  if (!await formRef.value.validate()) return
  
  try {
    const submitData = {
      username: form.username,
      name: form.name,
      email: form.email,
      role: form.role
    }
    if (!isEdit.value) {
      submitData.password = form.password
    }
    
    if (isEdit.value) {
      await updateUser(form.username, submitData)
    } else {
      await addUser(submitData)
    }
    modalVisible.value = false
    loadUsers()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const deleteUser = async (id) => {
  try {
    await apiDeleteUser(id)
    loadUsers()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

onMounted(() => {
  loadUsers()
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.btn-icon {
  margin-right: 4px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
</style>
