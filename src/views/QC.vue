<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>质检管理</h2>
            <div class="header-actions">
              <el-button type="primary" @click="openAddModal">
                <span class="btn-icon">+</span>
                创建质检单
              </el-button>
              <el-button @click="handleExport">导出Excel</el-button>
            </div>
          </div>
          <div class="search-bar">
            <el-input v-model="searchText" placeholder="搜索质检单号">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-select v-model="status" placeholder="质检状态">
              <el-option label="全部" value="" />
              <el-option label="待质检" value="pending" />
              <el-option label="合格" value="passed" />
              <el-option label="不合格" value="failed" />
              <el-option label="让步接收" value="concession" />
            </el-select>
            <el-button @click="handleSearch">搜索</el-button>
          </div>
          <el-table :data="qcList" border>
            <el-table-column prop="qcNo" label="质检单号" />
            <el-table-column prop="sourceNo" label="来源单据" />
            <el-table-column prop="sourceType" label="来源类型" />
            <el-table-column prop="productName" label="产品名称" />
            <el-table-column prop="inspectQty" label="检验数量" />
            <el-table-column prop="passQty" label="合格数量" />
            <el-table-column prop="failQty" label="不合格数量" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="viewQC(scope.row)">查看</el-button>
                <el-button size="small" type="primary" @click="editQC(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteQC(scope.row.id)">删除</el-button>
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

    <el-dialog title="创建质检单" v-model="showAddDialog" width="600px">
      <el-form :model="form" label-width="120px" class="qc-form">
        <el-form-item label="来源单据" prop="sourceNo" required>
          <el-input v-model="form.sourceNo" placeholder="请输入来源单据编号" />
        </el-form-item>
        <el-form-item label="来源类型" prop="sourceType">
          <el-select v-model="form.sourceType">
            <el-option label="采购入库" value="purchase" />
            <el-option label="生产完工" value="production" />
            <el-option label="库存抽检" value="inventory" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName" required>
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品编码" prop="productCode">
          <el-input v-model="form.productCode" placeholder="请输入产品编码" />
        </el-form-item>
        <el-form-item label="检验数量" prop="inspectQty" required>
          <el-input v-model.number="form.inspectQty" type="number" placeholder="请输入检验数量" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-textarea v-model="form.remark" placeholder="请输入备注" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveQC">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="质检结果录入" v-model="showDetailDialog" width="600px">
      <div v-if="currentQC">
        <div class="detail-header">
          <div class="detail-info">
            <span class="info-label">质检单号：</span>
            <span class="info-value">{{ currentQC.qcNo }}</span>
          </div>
          <div class="detail-info">
            <span class="info-label">产品名称：</span>
            <span class="info-value">{{ currentQC.productName }}</span>
          </div>
          <div class="detail-info">
            <span class="info-label">检验数量：</span>
            <span class="info-value">{{ currentQC.inspectQty }}</span>
          </div>
        </div>
        <div class="detail-divider"></div>
        <el-form :model="resultForm" label-width="120px" class="result-form">
          <el-form-item label="合格数量" prop="passQty">
            <el-input v-model.number="resultForm.passQty" type="number" />
          </el-form-item>
          <el-form-item label="不合格数量" prop="failQty">
            <el-input v-model.number="resultForm.failQty" type="number" />
          </el-form-item>
          <el-form-item label="质检结论" prop="status">
            <el-select v-model="resultForm.status">
              <el-option label="合格" value="passed" />
              <el-option label="不合格" value="failed" />
              <el-option label="让步接收" value="concession" />
            </el-select>
          </el-form-item>
          <el-form-item label="检验备注" prop="remark">
            <el-textarea v-model="resultForm.remark" placeholder="请输入检验备注" :rows="3" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">取消</el-button>
        <el-button type="primary" @click="submitResult">提交结果</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { ElMessage } from 'element-plus'
import { getQCList, createQC, updateQC, deleteQC as deleteQCApi, submitQCResult } from '../api/qc'

const searchText = ref('')
const status = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showAddDialog = ref(false)
const showDetailDialog = ref(false)

const qcList = ref([
  { id: 1, qcNo: 'GQ20240115001', sourceNo: 'PO20240115001', sourceType: 'purchase', productName: '原材料A', inspectQty: 100, passQty: 98, failQty: 2, status: 'passed', createTime: '2024-01-15 10:30:00' },
  { id: 2, qcNo: 'GQ20240115002', sourceNo: 'MO20240115001', sourceType: 'production', productName: '成品B', inspectQty: 50, passQty: 0, failQty: 0, status: 'pending', createTime: '2024-01-15 14:20:00' },
  { id: 3, qcNo: 'GQ20240114003', sourceNo: 'RK20240114001', sourceType: 'purchase', productName: '原材料C', inspectQty: 80, passQty: 75, failQty: 5, status: 'concession', createTime: '2024-01-14 09:15:00' },
  { id: 4, qcNo: 'GQ20240114004', sourceNo: 'PO20240114002', sourceType: 'purchase', productName: '配件D', inspectQty: 30, passQty: 25, failQty: 5, status: 'failed', createTime: '2024-01-14 16:45:00' }
])

const currentQC = ref(null)

const form = reactive({
  id: null,
  sourceNo: '',
  sourceType: 'purchase',
  productName: '',
  productCode: '',
  inspectQty: 0,
  remark: ''
})

const resultForm = reactive({
  passQty: 0,
  failQty: 0,
  status: 'passed',
  remark: ''
})

const getStatusText = (status) => {
  const map = {
    pending: '待质检',
    passed: '合格',
    failed: '不合格',
    concession: '让步接收'
  }
  return map[status] || status
}

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    passed: 'success',
    failed: 'danger',
    concession: 'info'
  }
  return map[status] || 'default'
}

const openAddModal = () => {
  form.id = null
  form.sourceNo = ''
  form.sourceType = 'purchase'
  form.productName = ''
  form.productCode = ''
  form.inspectQty = 0
  form.remark = ''
  showAddDialog.value = true
}

const editQC = (row) => {
  form.id = row.id
  form.sourceNo = row.sourceNo
  form.sourceType = row.sourceType
  form.productName = row.productName
  form.inspectQty = row.inspectQty
  showAddDialog.value = true
}

const saveQC = () => {
  if (!form.sourceNo || !form.productName || form.inspectQty <= 0) {
    ElMessage.error('请填写必填字段')
    return
  }
  ElMessage.success(form.id ? '更新成功' : '创建成功')
  showAddDialog.value = false
}

const deleteQC = async (id) => {
  try {
    await deleteQCApi(id)
    ElMessage.success('删除成功')
    loadQC()
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('删除质检单失败:', error)
  }
}

const viewQC = (row) => {
  currentQC.value = row
  resultForm.passQty = row.passQty
  resultForm.failQty = row.failQty
  resultForm.status = row.status
  resultForm.remark = ''
  showDetailDialog.value = true
}

const submitResult = () => {
  if (resultForm.passQty + resultForm.failQty !== currentQC.value.inspectQty) {
    ElMessage.error('合格数量+不合格数量必须等于检验数量')
    return
  }
  ElMessage.success('提交成功')
  showDetailDialog.value = false
}

const handleSearch = () => {
  currentPage.value = 1
  loadQC()
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
  total.value = qcList.value.length
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

.qc-form, .result-form {
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
</style>
