<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <div class="header-left">
              <el-button icon="el-icon-arrow-left" @click="goBack" class="back-btn">返回</el-button>
            </div>
            <el-button type="primary" @click="showAddDialog = true">
              <span class="btn-icon">+</span>
              添加菜单
            </el-button>
          </div>

          <div class="table-wrapper">
            <el-table :data="menuList" border>
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="menuName" label="菜单名称" />
              <el-table-column prop="parentName" label="上级菜单" />
              <el-table-column prop="path" label="路由路径" />
              <el-table-column prop="component" label="组件名称" />
              <el-table-column prop="menuType" label="类型">
                <template #default="scope">
                  <el-tag :type="scope.row.menuType === 'menu' ? 'primary' : 'default'">
                    {{ scope.row.menuType === 'menu' ? '菜单' : '按钮' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="icon" label="图标">
                <template #default="scope">
                  <span>{{ getIcon(scope.row.icon) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="visible" label="显示">
                <template #default="scope">
                  <el-tag :type="scope.row.visible === 1 ? 'success' : 'danger'">
                    {{ scope.row.visible === 1 ? '显示' : '隐藏' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="sortOrder" label="排序" width="80" />
              <el-table-column prop="permission" label="权限标识" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button size="small" @click="editMenu(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteMenu(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog title="添加/编辑菜单" v-model="showAddDialog" width="550px">
      <el-form :model="form" label-width="120px" class="menu-form">
        <el-form-item label="菜单名称" prop="menuName" required>
          <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-tree-select
            :data="menuTree"
            :props="treeProps"
            v-model="form.parentId"
            placeholder="请选择上级菜单（顶级菜单请留空）"
            :show-checkbox="false"
            class="tree-select"
          />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入路由路径，如 /dashboard" />
        </el-form-item>
        <el-form-item label="组件名称" prop="component">
          <el-input v-model="form.component" placeholder="请输入组件名称，如 仪表盘" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType" required>
          <el-select v-model="form.menuType">
            <el-option label="菜单" value="menu" />
            <el-option label="按钮" value="button" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="form.permission" placeholder="请输入权限标识，如 dashboard:view" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标名称，如 图表" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input v-model.number="form.sortOrder" type="number" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="是否显示" prop="visible">
          <el-switch v-model="form.visible" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-textarea v-model="form.remark" placeholder="请输入备注" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveMenu">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { getMenuTree, createMenu, updateMenu, deleteMenu as deleteMenuApi } from '../api/menu'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const menuTree = ref([])
const menuList = ref([])
const showAddDialog = ref(false)
const treeRef = ref(null)

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

const goBack = () => {
  router.back()
}

const form = reactive({
  id: null,
  menuName: '',
  parentId: null,
  path: '',
  component: '',
  menuType: 'menu',
  permission: '',
  icon: '',
  sortOrder: 0,
  visible: 1,
  remark: ''
})

const loadMenuTree = async () => {
  try {
    const response = await getMenuTree()
    if (response && (response.code === 200 || response.success)) {
      menuTree.value = response.data || response.result || []
      menuList.value = flattenMenuTree(menuTree.value)
    }
  } catch (error) {
    ElMessage.error('加载菜单树失败')
    console.error('加载菜单失败:', error)
  }
}

const flattenMenuTree = (tree) => {
  const result = []
  const parentMap = {}
  
  const addNode = (node, parentName = '') => {
    const menuItem = { ...node, parentName }
    result.push(menuItem)
    parentMap[node.id] = node.menuName
    
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => addNode(child, node.menuName))
    }
  }
  
  tree.forEach(node => addNode(node))
  return result
}

const editMenu = (data) => {
  Object.assign(form, {
    id: data.id,
    menuName: data.menuName,
    parentId: data.parentId,
    path: data.path || '',
    component: data.component || '',
    menuType: data.menuType,
    permission: data.permission || '',
    icon: data.icon || '',
    sortOrder: data.sortOrder || 0,
    visible: data.visible || 1,
    remark: data.remark || ''
  })
  showAddDialog.value = true
}

const deleteMenu = async (id) => {
  if (await ElMessageBox.confirm('确定要删除该菜单吗？', '提示', { type: 'warning' })) {
    try {
      const response = await deleteMenuApi(id)
      if (response && (response.code === 200 || response.success)) {
        ElMessage.success('删除成功')
        loadMenuTree()
      } else {
        ElMessage.error('删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除菜单失败:', error)
    }
  }
}

const saveMenu = async () => {
  try {
    let response
    if (form.id) {
      response = await updateMenu(form.id, form)
    } else {
      response = await createMenu(form)
    }
    if (response && (response.code === 200 || response.success)) {
      ElMessage.success(form.id ? '更新成功' : '创建成功')
      showAddDialog.value = false
      resetForm()
      loadMenuTree()
    } else {
      ElMessage.error(form.id ? '更新失败' : '创建失败')
    }
  } catch (error) {
    ElMessage.error(form.id ? '更新失败' : '创建失败')
    console.error('保存菜单失败:', error)
  }
}

const resetForm = () => {
  form.id = null
  form.menuName = ''
  form.parentId = null
  form.path = ''
  form.component = ''
  form.menuType = 'menu'
  form.permission = ''
  form.icon = ''
  form.sortOrder = 0
  form.visible = 1
  form.remark = ''
}

onMounted(() => {
  loadMenuTree()
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
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  padding: 6px 12px;
  font-size: 14px;
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

.table-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 10px;
}

.icon-wrapper {
  font-size: 14px;
}



.delete-btn {
  color: #f56c6c;
}

.delete-btn:hover {
  color: #f78989;
}

.menu-form {
  max-height: 400px;
  overflow-y: auto;
}

.tree-select {
  width: 100%;
}
</style>
