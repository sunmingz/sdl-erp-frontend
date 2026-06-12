<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>工艺路线管理</h2>
            <el-button type="primary" @click="openAddModal">
              <span class="btn-icon">+</span>
              创建工艺路线
            </el-button>
          </div>
          <div class="search-bar">
            <el-input v-model="searchText" placeholder="搜索路线编码或名称">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-button @click="handleSearch">搜索</el-button>
          </div>
          <el-table :data="routeList" border>
            <el-table-column prop="routeCode" label="路线编码" />
            <el-table-column prop="routeName" label="路线名称" />
            <el-table-column prop="materialCode" label="适用物料" />
            <el-table-column prop="workCenter" label="工作中心" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
                  {{ scope.row.status === 1 ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="viewRoute(scope.row)">查看工序</el-button>
                <el-button size="small" type="primary" @click="editRoute(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRoute(scope.row.id)">删除</el-button>
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

    <el-dialog title="创建/编辑工艺路线" v-model="showAddDialog" width="600px">
      <el-form :model="form" label-width="120px" class="route-form">
        <el-form-item label="路线编码" prop="routeCode" required>
          <el-input v-model="form.routeCode" placeholder="请输入路线编码" />
        </el-form-item>
        <el-form-item label="路线名称" prop="routeName" required>
          <el-input v-model="form.routeName" placeholder="请输入路线名称" />
        </el-form-item>
        <el-form-item label="适用物料" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入适用物料编码" />
        </el-form-item>
        <el-form-item label="工作中心" prop="workCenter">
          <el-input v-model="form.workCenter" placeholder="请输入工作中心" />
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
        <el-button type="primary" @click="saveRoute">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="工序列表" v-model="showDetailDialog" width="700px">
      <div v-if="currentRoute">
        <div class="detail-header">
          <div class="detail-info">
            <span class="info-label">路线编码：</span>
            <span class="info-value">{{ currentRoute.routeCode }}</span>
          </div>
          <div class="detail-info">
            <span class="info-label">路线名称：</span>
            <span class="info-value">{{ currentRoute.routeName }}</span>
          </div>
        </div>
        <div class="detail-divider"></div>
        <div class="items-header">
          <span>工序配置</span>
          <el-button size="small" type="primary" @click="openAddProcessModal">添加工序</el-button>
        </div>
        <el-table :data="processList" border>
          <el-table-column prop="sortOrder" label="序号" width="80" />
          <el-table-column prop="processCode" label="工序编码" />
          <el-table-column prop="processName" label="工序名称" />
          <el-table-column prop="workCenter" label="工作中心" />
          <el-table-column prop="standardTime" label="标准工时" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button size="small" @click="editProcess(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteProcess(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog :title="processForm.id ? '编辑工序' : '添加工序'" v-model="showProcessModal" width="500px">
      <el-form :model="processForm" label-width="100px">
        <el-form-item label="工序编码">
          <el-input v-model="processForm.processCode" placeholder="请输入工序编码" />
        </el-form-item>
        <el-form-item label="工序名称">
          <el-input v-model="processForm.processName" placeholder="请输入工序名称" />
        </el-form-item>
        <el-form-item label="工作中心">
          <el-input v-model="processForm.workCenter" placeholder="请输入工作中心" />
        </el-form-item>
        <el-form-item label="标准工时">
          <el-input v-model.number="processForm.standardTime" type="number" placeholder="请输入标准工时" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model.number="processForm.sortOrder" type="number" placeholder="请输入排序号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showProcessModal = false">取消</el-button>
        <el-button type="primary" @click="saveProcess">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { ElMessage } from 'element-plus'
import { getRouteList, createRoute, updateRoute, deleteRoute as deleteRouteApi, addProcess, updateProcess as updateProcessApi, deleteProcess as deleteProcessApi } from '../api/route'

const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const showProcessModal = ref(false)

const routeList = ref([
  { id: 1, routeCode: 'ROUTE001', routeName: '标准装配线', materialCode: 'PROD001', workCenter: '装配车间', status: 1 },
  { id: 2, routeCode: 'ROUTE002', routeName: '机加工线', materialCode: 'PROD002', workCenter: '机加车间', status: 1 },
  { id: 3, routeCode: 'ROUTE003', routeName: '包装线', materialCode: 'PROD003', workCenter: '包装车间', status: 0 }
])

const processList = ref([
  { id: 1, sortOrder: 1, processCode: 'PROC001', processName: '下料', workCenter: '机加车间', standardTime: '0.5' },
  { id: 2, sortOrder: 2, processCode: 'PROC002', processName: '加工', workCenter: '机加车间', standardTime: '2.0' },
  { id: 3, sortOrder: 3, processCode: 'PROC003', processName: '装配', workCenter: '装配车间', standardTime: '1.5' },
  { id: 4, sortOrder: 4, processCode: 'PROC004', processName: '检验', workCenter: '质检中心', standardTime: '0.3' }
])

const currentRoute = ref(null)

const form = reactive({
  id: null,
  routeCode: '',
  routeName: '',
  materialCode: '',
  workCenter: '',
  remark: ''
})

const processForm = reactive({
  id: null,
  processCode: '',
  processName: '',
  workCenter: '',
  standardTime: '',
  sortOrder: 0
})

const openAddModal = () => {
  form.id = null
  form.routeCode = ''
  form.routeName = ''
  form.materialCode = ''
  form.workCenter = ''
  form.status = 1
  form.remark = ''
  showAddDialog.value = true
}

const editRoute = (row) => {
  form.id = row.id
  form.routeCode = row.routeCode
  form.routeName = row.routeName
  form.materialCode = row.materialCode
  form.workCenter = row.workCenter
  form.status = row.status
  showAddDialog.value = true
}

const saveRoute = () => {
  if (!form.routeCode || !form.routeName) {
    ElMessage.error('请填写必填字段')
    return
  }
  ElMessage.success(form.id ? '更新成功' : '创建成功')
  showAddDialog.value = false
}

const deleteRoute = async (id) => {
  try {
    await deleteRouteApi(id)
    ElMessage.success('删除成功')
    loadRoute()
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('删除工艺路线失败:', error)
  }
}

const viewRoute = (row) => {
  currentRoute.value = row
  showDetailDialog.value = true
}

const openAddProcessModal = () => {
  processForm.id = null
  processForm.processCode = ''
  processForm.processName = ''
  processForm.workCenter = ''
  processForm.standardTime = ''
  processForm.sortOrder = processList.value.length + 1
  showProcessModal.value = true
}

const editProcess = (row) => {
  processForm.id = row.id
  processForm.processCode = row.processCode
  processForm.processName = row.processName
  processForm.workCenter = row.workCenter
  processForm.standardTime = row.standardTime
  processForm.sortOrder = row.sortOrder
  showProcessModal.value = true
}

const deleteProcess = async (row) => {
  try {
    if (currentRoute.value) {
      await deleteProcessApi(currentRoute.value.id, row.id)
    }
    processList.value = processList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除工序成功')
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('删除工序失败:', error)
  }
}

const saveProcess = async () => {
  try {
    if (currentRoute.value) {
      if (processForm.id) {
        await updateProcessApi(currentRoute.value.id, processForm.id, processForm)
        const index = processList.value.findIndex(item => item.id === processForm.id)
        if (index !== -1) {
          processList.value[index] = { ...processForm }
        }
        ElMessage.success('更新工序成功')
      } else {
        const result = await addProcess(currentRoute.value.id, processForm)
        processList.value.push({ ...processForm, id: result.data.id })
        ElMessage.success('添加工序成功')
      }
    }
    showProcessModal.value = false
  } catch (error) {
    ElMessage.error('保存失败')
    console.error('保存工序失败:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadRoute()
}

const handleSizeChange = (size) => {
  pageSize.value = size
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  total.value = routeList.value.length
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

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.route-form {
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
