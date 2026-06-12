<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>生产订单管理</h2>
            <div class="header-actions">
              <el-button type="primary" @click="openAddModal">
                <span class="btn-icon">+</span>
                创建生产订单
              </el-button>
              <el-button @click="handleExport">导出Excel</el-button>
            </div>
          </div>
          <div class="search-bar">
            <el-input v-model="searchText" placeholder="搜索生产订单号">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-select v-model="status" placeholder="订单状态">
              <el-option label="全部" value="" />
              <el-option label="草稿" value="draft" />
              <el-option label="待审核" value="pending" />
              <el-option label="生产中" value="producing" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
            <el-button @click="handleSearch">搜索</el-button>
          </div>
          <el-table :data="productionList" border>
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="materialCode" label="物料编码" />
            <el-table-column prop="materialName" label="物料名称" />
            <el-table-column prop="bomVersion" label="BOM版本" />
            <el-table-column prop="planQuantity" label="计划数量" />
            <el-table-column prop="completedQuantity" label="已完成" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="startDate" label="计划开始" width="120" />
            <el-table-column prop="endDate" label="计划完成" width="120" />
            <el-table-column label="操作" width="250">
              <template #default="scope">
                <el-button size="small" @click="viewProduction(scope.row)">查看</el-button>
                <el-button size="small" type="primary" @click="editProduction(scope.row)">编辑</el-button>
                <el-button size="small" type="success" @click="startProduction(scope.row)" v-if="scope.row.status === 'pending'">开始生产</el-button>
                <el-button size="small" type="danger" @click="deleteProduction(scope.row.id)">删除</el-button>
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

    <el-dialog title="创建生产订单" v-model="showAddDialog" width="600px">
      <el-form :model="form" label-width="120px" class="production-form">
        <el-form-item label="物料编码" prop="materialCode" required>
          <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName" required>
          <el-input v-model="form.materialName" placeholder="请输入物料名称" />
        </el-form-item>
        <el-form-item label="BOM版本" prop="bomVersion">
          <el-input v-model="form.bomVersion" placeholder="请输入物料清单版本" />
        </el-form-item>
        <el-form-item label="工艺路线" prop="routeCode">
          <el-input v-model="form.routeCode" placeholder="请输入工艺路线编码" />
        </el-form-item>
        <el-form-item label="计划数量" prop="planQuantity" required>
          <el-input v-model.number="form.planQuantity" type="number" placeholder="请输入计划数量" />
        </el-form-item>
        <el-form-item label="计划开始日期" prop="startDate">
          <el-date-picker v-model="form.startDate" type="date" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item label="计划完成日期" prop="endDate">
          <el-date-picker v-model="form.endDate" type="date" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-textarea v-model="form.remark" placeholder="请输入备注" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProduction">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="生产订单详情" v-model="showDetailDialog" width="700px">
      <div v-if="currentProduction">
        <div class="detail-header">
          <div class="detail-info">
            <span class="info-label">订单号：</span>
            <span class="info-value">{{ currentProduction.orderNo }}</span>
          </div>
          <div class="detail-info">
            <span class="info-label">物料：</span>
            <span class="info-value">{{ currentProduction.materialName }}</span>
          </div>
          <div class="detail-info">
            <span class="info-label">状态：</span>
            <el-tag :type="getStatusType(currentProduction.status)">
              {{ getStatusText(currentProduction.status) }}
            </el-tag>
          </div>
        </div>
        <div class="detail-divider"></div>
        <div class="progress-section">
          <div class="progress-header">
            <span>生产进度</span>
            <span>{{ currentProduction.completedQuantity }} / {{ currentProduction.planQuantity }}</span>
          </div>
          <el-progress :percentage="getProgress(currentProduction)" :stroke-width="12" />
        </div>
        <div class="detail-divider"></div>
        <div class="report-section">
          <span class="section-title">报工录入</span>
          <el-form :model="reportForm" label-width="100px" class="report-form">
            <el-form-item label="报工数量">
              <el-input v-model.number="reportForm.qty" type="number" />
            </el-form-item>
            <el-form-item label="工序">
              <el-select v-model="reportForm.process">
                <el-option label="下料" value="cut" />
                <el-option label="加工" value="process" />
                <el-option label="装配" value="assemble" />
                <el-option label="检验" value="inspect" />
              </el-select>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="submitReport">提交报工</el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { ElMessage } from 'element-plus'
import { getProductionOrderList, createProductionOrder, updateProductionOrder, deleteProductionOrder, startProductionOrder, reportProduction } from '../api/production'

const searchText = ref('')
const status = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showAddDialog = ref(false)
const showDetailDialog = ref(false)

const productionList = ref([
  { id: 1, orderNo: 'MO20240115001', materialCode: 'PROD001', materialName: '成品A', bomVersion: 'V1.0', routeCode: 'ROUTE001', planQuantity: 100, completedQuantity: 65, status: 'producing', startDate: '2024-01-15', endDate: '2024-01-20' },
  { id: 2, orderNo: 'MO20240115002', materialCode: 'PROD002', materialName: '成品B', bomVersion: 'V2.0', routeCode: 'ROUTE002', planQuantity: 50, completedQuantity: 0, status: 'pending', startDate: '2024-01-16', endDate: '2024-01-22' },
  { id: 3, orderNo: 'MO20240114003', materialCode: 'PROD003', materialName: '成品C', bomVersion: 'V1.1', routeCode: 'ROUTE001', planQuantity: 80, completedQuantity: 80, status: 'completed', startDate: '2024-01-10', endDate: '2024-01-14' }
])

const currentProduction = ref(null)

const form = reactive({
  id: null,
  materialCode: '',
  materialName: '',
  bomVersion: '',
  routeCode: '',
  planQuantity: 0,
  startDate: '',
  endDate: '',
  remark: ''
})

const reportForm = reactive({
  qty: 0,
  process: 'cut'
})

const getStatusText = (status) => {
  const map = {
    draft: '草稿',
    pending: '待审核',
    producing: '生产中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = {
    draft: 'info',
    pending: 'warning',
    producing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || 'default'
}

const getProgress = (item) => {
  return Math.round((item.completedQuantity / item.planQuantity) * 100)
}

const openAddModal = () => {
  form.id = null
  form.materialCode = ''
  form.materialName = ''
  form.bomVersion = ''
  form.routeCode = ''
  form.planQuantity = 0
  form.startDate = ''
  form.endDate = ''
  form.remark = ''
  showAddDialog.value = true
}

const editProduction = (row) => {
  form.id = row.id
  form.materialCode = row.materialCode
  form.materialName = row.materialName
  form.bomVersion = row.bomVersion
  form.routeCode = row.routeCode
  form.planQuantity = row.planQuantity
  form.startDate = row.startDate
  form.endDate = row.endDate
  showAddDialog.value = true
}

const saveProduction = () => {
  if (!form.materialCode || !form.materialName || form.planQuantity <= 0) {
    ElMessage.error('请填写必填字段')
    return
  }
  ElMessage.success(form.id ? '更新成功' : '创建成功')
  showAddDialog.value = false
}

const deleteProduction = async (id) => {
  try {
    await deleteProductionOrder(id)
    ElMessage.success('删除成功')
    loadProduction()
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('删除生产订单失败:', error)
  }
}

const viewProduction = (row) => {
  currentProduction.value = row
  reportForm.qty = 0
  reportForm.process = 'cut'
  showDetailDialog.value = true
}

const startProduction = async (row) => {
  try {
    await startProductionOrder(row.id)
    ElMessage.success('生产已开始')
    loadProduction()
  } catch (error) {
    ElMessage.error('启动生产失败')
    console.error('启动生产失败:', error)
  }
}

const submitReport = () => {
  if (reportForm.qty <= 0) {
    ElMessage.error('请输入报工数量')
    return
  }
  ElMessage.success('报工成功')
}

const handleSearch = () => {
  currentPage.value = 1
  loadProduction()
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
  total.value = productionList.value.length
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

.production-form {
  max-height: 500px;
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

.progress-section {
  margin-bottom: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.report-section {
  padding-top: 16px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
    display: block;
  }
}

.report-form {
  margin-bottom: 16px;
}
</style>
