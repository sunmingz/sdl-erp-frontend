<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>部门管理</h2>
            <el-button type="primary" @click="openAddModal">
              <span class="btn-icon">+</span>
              添加部门
            </el-button>
          </div>
          <div class="search-bar">
            <el-input v-model="searchText" placeholder="搜索部门名称或编码">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-button @click="handleSearch">搜索</el-button>
          </div>
          <div class="tree-section">
            <h3>组织架构</h3>
            <el-tree
              :data="departmentTree"
              :props="treeProps"
              show-checkbox
              node-key="id"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </div>
          <div class="list-section">
            <h3>部门列表</h3>
            <el-table :data="departmentList" border>
              <el-table-column prop="id" label="ID" />
              <el-table-column prop="code" label="部门编码" />
              <el-table-column prop="name" label="部门名称" />
              <el-table-column prop="parentId" label="上级部门">
                <template #default="scope">
                  {{ getParentName(scope.row.parentId) }}
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" />
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
                  <el-button size="small" @click="editDepartment(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteDepartment(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :total="total"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handlePageChange"
            />
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog :title="isEdit ? '编辑部门' : '添加部门'" v-model="modalVisible">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="code">
          <el-input v-model="form.code" placeholder="部门编码" />
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="上级部门">
          <el-select v-model="form.parentId" placeholder="请选择上级部门">
            <el-option label="无（顶级部门）" :value="0" />
            <el-option
              v-for="dept in selectDepartments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="部门描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item prop="sortOrder">
          <el-input v-model.number="form.sortOrder" placeholder="排序号" />
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
import { ref, reactive, onMounted, computed } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import {
  getDepartmentTree,
  getDepartmentList,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment as apiDeleteDepartment
} from '../api/department'

const searchText = ref('')
const departmentTree = ref([])
const departmentList = ref([])
const allDepartments = ref([])
const total = ref(100)
const pageSize = ref(10)
const currentPage = ref(1)

const modalVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = reactive({
  code: '',
  name: '',
  parentId: 0,
  description: '',
  status: 'active',
  sortOrder: 0
})

const rules = {
  code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
}

const treeProps = {
  label: 'name',
  children: 'children'
}

const selectDepartments = computed(() => {
  return allDepartments.value.filter(d => d.id !== (form.id || null))
})

const getParentName = (parentId) => {
  if (!parentId || parentId === 0) return '无'
  const parent = allDepartments.value.find(d => d.id === parentId)
  return parent ? parent.name : '未知'
}

const handleSearch = () => {
  currentPage.value = 1
  loadDepartments()
}

const loadDepartments = async () => {
  console.log('加载部门数据...')
  try {
    const [treeRes, listRes, allRes] = await Promise.all([
      getDepartmentTree(),
      getDepartmentList({ page: currentPage.value, size: pageSize.value, keyword: searchText.value }),
      getAllDepartments()
    ])
    console.log('部门树:', treeRes)
    console.log('部门列表:', listRes)
    console.log('所有部门:', allRes)
    
    if (treeRes && treeRes.data) {
      departmentTree.value = treeRes.data.data || treeRes.data
    }
    if (listRes && listRes.data) {
      departmentList.value = listRes.data.data?.list || listRes.data.list || listRes.data
      total.value = listRes.data.data?.total || listRes.data.total || 0
    }
    if (allRes && allRes.data) {
      allDepartments.value = allRes.data.data || allRes.data
    }
  } catch (error) {
    console.error('获取部门数据失败:', error)
    if (error.response) {
      console.error('错误响应:', error.response)
    }
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadDepartments()
}

const handleNodeClick = (data) => {
  console.log('点击节点:', data)
}

const openAddModal = () => {
  isEdit.value = false
  form.id = null
  form.code = ''
  form.name = ''
  form.parentId = 0
  form.description = ''
  form.status = 'active'
  form.sortOrder = 0
  modalVisible.value = true
}

const editDepartment = (row) => {
  isEdit.value = true
  form.id = row.id
  form.code = row.code
  form.name = row.name
  form.parentId = row.parentId || 0
  form.description = row.description || ''
  form.status = row.status
  form.sortOrder = row.sortOrder || 0
  modalVisible.value = true
}

const handleSubmit = async () => {
  if (!await formRef.value.validate()) return
  
  try {
    const submitData = {
      code: form.code,
      name: form.name,
      parentId: form.parentId === 0 ? null : form.parentId,
      description: form.description,
      status: form.status,
      sortOrder: form.sortOrder
    }
    
    if (isEdit.value) {
      await updateDepartment(form.id, submitData)
    } else {
      await createDepartment(submitData)
    }
    modalVisible.value = false
    loadDepartments()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const deleteDepartment = async (id) => {
  try {
    await apiDeleteDepartment(id)
    loadDepartments()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

onMounted(() => {
  loadDepartments()
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

.tree-section {
  margin-bottom: 20px;
}

.tree-section h3,
.list-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.list-section {
  margin-top: 20px;
}
</style>
