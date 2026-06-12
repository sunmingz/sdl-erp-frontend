<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>BOM管理</h2>
            <div class="header-actions">
              <el-button type="primary" @click="openAddModal">
                <span class="btn-icon">+</span>
                创建BOM
              </el-button>
              <el-button @click="handleExport">导出Excel</el-button>
            </div>
          </div>
          <div class="search-bar">
            <el-input v-model="searchText" placeholder="搜索物料编码或名称">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-button @click="handleSearch">搜索</el-button>
          </div>
          <el-table :data="bomList" border>
            <el-table-column prop="parentMaterialCode" label="父物料编码" />
            <el-table-column prop="parentMaterialName" label="父物料名称" />
            <el-table-column prop="versionNo" label="版本号" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
                  {{ scope.row.status === 1 ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="viewBOM(scope.row)">查看明细</el-button>
                <el-button size="small" type="primary" @click="editBOM(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteBOM(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrapper">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
            />
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog title="创建/编辑BOM" v-model="showAddDialog" width="600px">
      <el-form :model="form" label-width="120px" class="bom-form">
        <el-form-item label="父物料编码" prop="parentMaterialCode" required>
          <el-input v-model="form.parentMaterialCode" placeholder="请输入父物料编码" />
        </el-form-item>
        <el-form-item label="父物料名称" prop="parentMaterialName" required>
          <el-input v-model="form.parentMaterialName" placeholder="请输入父物料名称" />
        </el-form-item>
        <el-form-item label="版本号" prop="versionNo">
          <el-input v-model="form.versionNo" placeholder="请输入版本号，如 版本1.0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-textarea v-model="form.remark" placeholder="请输入备注" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveBOM">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="BOM明细" v-model="showDetailDialog" width="700px">
      <div v-if="currentBOM">
        <div class="detail-header">
          <div class="detail-info">
            <span class="info-label">物料编码：</span>
            <span class="info-value">{{ currentBOM.parentMaterialCode }}</span>
          </div>
          <div class="detail-info">
            <span class="info-label">物料名称：</span>
            <span class="info-value">{{ currentBOM.parentMaterialName }}</span>
          </div>
          <div class="detail-info">
            <span class="info-label">版本号：</span>
            <span class="info-value">{{ currentBOM.versionNo }}</span>
          </div>
        </div>
        <div class="detail-divider"></div>
        <div class="items-header">
          <span>BOM组件列表</span>
          <el-button size="small" type="primary" @click="openAddItemModal">添加组件</el-button>
        </div>
        <el-table :data="bomItems" border>
          <el-table-column prop="componentCode" label="组件编码" />
          <el-table-column prop="componentName" label="组件名称" />
          <el-table-column prop="spec" label="规格" />
          <el-table-column prop="quantity" label="用量" />
          <el-table-column prop="unit" label="单位" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button size="small" @click="editItem(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteItem(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog :title="itemForm.id ? '编辑组件' : '添加组件'" v-model="showItemModal" width="500px">
      <el-form :model="itemForm" label-width="100px">
        <el-form-item label="组件编码">
          <el-input v-model="itemForm.componentCode" placeholder="请输入组件编码" />
        </el-form-item>
        <el-form-item label="组件名称">
          <el-input v-model="itemForm.componentName" placeholder="请输入组件名称" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="itemForm.specification" placeholder="请输入规格型号" />
        </el-form-item>
        <el-form-item label="用量">
          <el-input v-model.number="itemForm.quantity" type="number" placeholder="请输入用量" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="itemForm.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model.number="itemForm.sortOrder" type="number" placeholder="请输入排序号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showItemModal = false">取消</el-button>
        <el-button type="primary" @click="saveItem">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { ElMessage } from 'element-plus'
import { getBOMList, createBOM, updateBOM, deleteBOM as deleteBOMApi, addBOMItem, updateBOMItem as updateBOMItemApi, deleteBOMItem as deleteBOMItemApi } from '../api/bom'

const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const showItemModal = ref(false)

const bomList = ref([
  { id: 1, parentMaterialCode: 'PROD001', parentMaterialName: '成品A', versionNo: 'V1.0', status: 1, createTime: '2024-01-15 10:30:00' },
  { id: 2, parentMaterialCode: 'PROD002', parentMaterialName: '成品B', versionNo: 'V2.0', status: 1, createTime: '2024-01-14 14:20:00' },
  { id: 3, parentMaterialCode: 'PROD003', parentMaterialName: '成品C', versionNo: 'V1.1', status: 0, createTime: '2024-01-13 09:15:00' }
])

const bomItems = ref([
  { id: 1, componentCode: 'MAT001', componentName: '原材料A', spec: '规格A', quantity: 2.0, unit: '件' },
  { id: 2, componentCode: 'MAT002', componentName: '原材料B', spec: '规格B', quantity: 1.0, unit: '件' },
  { id: 3, componentCode: 'MAT003', componentName: '配件C', spec: '规格C', quantity: 3.0, unit: '个' }
])

const currentBOM = ref(null)

const form = reactive({
  id: null,
  parentMaterialCode: '',
  parentMaterialName: '',
  versionNo: '',
  status: 1,
  remark: ''
})

const itemForm = reactive({
  id: null,
  componentCode: '',
  componentName: '',
  specification: '',
  quantity: 1,
  unit: '',
  sortOrder: 0
})

const openAddModal = () => {
  form.id = null
  form.parentMaterialCode = ''
  form.parentMaterialName = ''
  form.versionNo = ''
  form.status = 1
  form.remark = ''
  showAddDialog.value = true
}

const editBOM = (row) => {
  form.id = row.id
  form.parentMaterialCode = row.parentMaterialCode
  form.parentMaterialName = row.parentMaterialName
  form.versionNo = row.versionNo
  form.status = row.status
  showAddDialog.value = true
}

const saveBOM = async () => {
  if (!form.parentMaterialCode || !form.parentMaterialName) {
    ElMessage.error('请填写必填字段')
    return
  }
  try {
    if (form.id) {
      await updateBOM(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await createBOM(form)
      ElMessage.success('创建成功')
    }
    showAddDialog.value = false
    loadBOM()
  } catch (error) {
    ElMessage.error('保存失败')
    console.error('保存BOM失败:', error)
  }
}

const deleteBOM = async (id) => {
  try {
    await deleteBOMApi(id)
    ElMessage.success('删除成功')
    loadBOM()
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('删除BOM失败:', error)
  }
}

const viewBOM = (row) => {
  currentBOM.value = row
  showDetailDialog.value = true
}

const openAddItemModal = () => {
  itemForm.id = null
  itemForm.componentCode = ''
  itemForm.componentName = ''
  itemForm.specification = ''
  itemForm.quantity = 1
  itemForm.unit = ''
  itemForm.sortOrder = bomItems.value.length + 1
  showItemModal.value = true
}

const editItem = (row) => {
  itemForm.id = row.id
  itemForm.componentCode = row.componentCode
  itemForm.componentName = row.componentName
  itemForm.specification = row.spec
  itemForm.quantity = row.quantity
  itemForm.unit = row.unit
  itemForm.sortOrder = row.sortOrder || bomItems.value.findIndex(i => i.id === row.id) + 1
  showItemModal.value = true
}

const deleteItem = async (row) => {
  try {
    if (currentBOM.value) {
      await deleteBOMItemApi(currentBOM.value.id, row.id)
    }
    bomItems.value = bomItems.value.filter(item => item.id !== row.id)
    ElMessage.success('删除组件成功')
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('删除组件失败:', error)
  }
}

const saveItem = async () => {
  try {
    if (currentBOM.value) {
      if (itemForm.id) {
        await updateBOMItemApi(currentBOM.value.id, itemForm.id, itemForm)
        const index = bomItems.value.findIndex(item => item.id === itemForm.id)
        if (index !== -1) {
          bomItems.value[index] = { ...itemForm, spec: itemForm.specification }
        }
        ElMessage.success('更新组件成功')
      } else {
        const result = await addBOMItem(currentBOM.value.id, itemForm)
        bomItems.value.push({ ...itemForm, id: result.data.id, spec: itemForm.specification })
        ElMessage.success('添加组件成功')
      }
    }
    showItemModal.value = false
  } catch (error) {
    ElMessage.error('保存失败')
    console.error('保存组件失败:', error)
  }
}

const loadBOM = async () => {
  try {
    const result = await getBOMList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchText.value
    })
    if (result && result.data) {
      bomList.value = result.data.list || result.data.content || []
      total.value = result.data.total || 0
    }
  } catch (error) {
    console.error('加载BOM列表失败:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadBOM()
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleSizeChange = (size) => {
  pageSize.value = size
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  loadBOM()
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

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-icon {
  margin-right: 4px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.bom-form {
  max-height: 400px;
  overflow-y: auto;
}

.detail-header {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.detail-info {
  margin-bottom: 8px;
  
  .info-label {
    font-size: 14px;
    color: #909399;
  }
  
  .info-value {
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }
}

.detail-divider {
  height: 1px;
  background: #e4e7ed;
  margin-bottom: 16px;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
</style>
