<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <el-button type="primary" @click="showAddDialog = true">
              <span class="btn-icon">+</span>
              添加角色
            </el-button>
          </div>

          <el-table :data="roleList" border>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="roleName" label="角色名称" />
            <el-table-column prop="roleCode" label="角色编码" />
            <el-table-column prop="roleDesc" label="角色描述" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="showAuthDialog(scope.row.id)">权限管理</el-button>
                <el-button size="small" @click="editRole(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>

    <el-dialog title="添加/编辑角色" v-model="showAddDialog" width="400px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveRole">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="角色权限配置" v-model="showAuthDialogVisible" width="600px">
      <el-tree
        :data="menuTree"
        :props="treeProps"
        :expand-on-click-node="false"
        node-key="id"
        :default-checked-keys="checkedMenuIds"
        show-checkbox
        ref="authTreeRef"
      >
        <template #default="{ node, data }">
          <span>{{ getIcon(data.icon) }} {{ data.menuName }}</span>
        </template>
      </el-tree>
      <template #footer>
        <el-button @click="showAuthDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAuth">保存权限</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { getRoleList, createRole, updateRole, deleteRole as deleteRoleApi } from '../api/role'
import { getMenuTree, getMenusByRole, saveRoleMenus } from '../api/menu'
import { ElMessage, ElMessageBox } from 'element-plus'

const roleList = ref([])
const showAddDialog = ref(false)
const showAuthDialogVisible = ref(false)
const authTreeRef = ref(null)
const currentRoleId = ref(null)

const menuTree = ref([])
const checkedMenuIds = ref([])

const treeProps = {
  children: 'children',
  label: 'menuName'
}

const iconMap = {
  'icon-chart': '📊',
  'icon-user': '👤',
  'icon-building': '🏢',
  'icon-package': '📦',
  'icon-warehouse': '🏠',
  'icon-shopping': '🛒',
  'icon-trending': '📈',
  'icon-money': '💰',
  'icon-menu': '📋',
  'icon-users': '👥',
  'icon-bom': '📝',
  'icon-route': '🛣️',
  'icon-qc': '✅',
  'icon-production': '🏭'
}

const getIcon = (icon) => {
  if (!icon) return ''
  return iconMap[icon] || icon
}

const form = reactive({
  id: null,
  roleName: '',
  roleCode: '',
  roleDesc: ''
})

const loadRoleList = async () => {
  try {
    const response = await getRoleList({})
    if (response.code === 200) {
      roleList.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载角色列表失败')
  }
}

const loadMenuTree = async () => {
  try {
    const response = await getMenuTree()
    if (response.code === 200) {
      menuTree.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载菜单树失败')
  }
}

const editRole = (data) => {
  Object.assign(form, {
    id: data.id,
    roleName: data.roleName,
    roleCode: data.roleCode,
    roleDesc: data.roleDesc || ''
  })
  showAddDialog.value = true
}

const deleteRole = async (id) => {
  if (await ElMessageBox.confirm('确定要删除该角色吗？', '提示', { type: 'warning' })) {
    try {
      const response = await deleteRoleApi(id)
      if (response.code === 200) {
        ElMessage.success('删除成功')
        loadRoleList()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }
}

const saveRole = async () => {
  try {
    let response
    if (form.id) {
      response = await updateRole(form.id, form)
    } else {
      response = await createRole(form)
    }
    if (response.code === 200) {
      ElMessage.success(form.id ? '更新成功' : '创建成功')
      showAddDialog.value = false
      resetForm()
      loadRoleList()
    }
  } catch (error) {
    ElMessage.error(form.id ? '更新失败' : '创建失败')
  }
}

const resetForm = () => {
  form.id = null
  form.roleName = ''
  form.roleCode = ''
  form.roleDesc = ''
}

const showAuthDialog = async (roleId) => {
  currentRoleId.value = roleId
  showAuthDialogVisible.value = true
  
  await loadMenuTree()
  
  try {
    const response = await getMenusByRole(roleId)
    if (response.code === 200) {
      checkedMenuIds.value = response.data.map(item => item.id)
    }
  } catch (error) {
    ElMessage.error('加载角色权限失败')
  }
}

const saveAuth = async () => {
  const selectedIds = authTreeRef.value.getCheckedKeys()
  
  try {
    const response = await saveRoleMenus(currentRoleId.value, selectedIds)
    if (response.code === 200) {
      ElMessage.success('权限配置成功')
      showAuthDialogVisible.value = false
    }
  } catch (error) {
    ElMessage.error('权限配置失败')
  }
}

onMounted(() => {
  loadRoleList()
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

.btn-icon {
  margin-right: 4px;
}
</style>
