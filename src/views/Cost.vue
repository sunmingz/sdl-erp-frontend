<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <div class="stats-grid">
          <el-card class="stat-card">
            <div class="stat-header">
              <span class="stat-label">本月费用</span>
            </div>
            <div class="stat-value expense">¥{{ formatNumber(stats.monthlyExpense) }}</div>
            <div class="stat-trend" :class="stats.expenseGrowth >= 0 ? 'positive' : 'negative'">
              {{ stats.expenseGrowth >= 0 ? '+' : '' }}{{ stats.expenseGrowth }}%
            </div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-header">
              <span class="stat-label">制造费用</span>
            </div>
            <div class="stat-value manufacturing">¥{{ formatNumber(stats.manufacturingCost) }}</div>
            <div class="stat-trend" :class="stats.manufacturingGrowth >= 0 ? 'positive' : 'negative'">
              {{ stats.manufacturingGrowth >= 0 ? '+' : '' }}{{ stats.manufacturingGrowth }}%
            </div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-header">
              <span class="stat-label">人工成本</span>
            </div>
            <div class="stat-value labor">¥{{ formatNumber(stats.laborCost) }}</div>
            <div class="stat-trend" :class="stats.laborGrowth >= 0 ? 'positive' : 'negative'">
              {{ stats.laborGrowth >= 0 ? '+' : '' }}{{ stats.laborGrowth }}%
            </div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-header">
              <span class="stat-label">凭证数量</span>
            </div>
            <div class="stat-value vouchers">{{ stats.voucherCount }}</div>
            <div class="stat-trend" :class="stats.voucherGrowth >= 0 ? 'positive' : 'negative'">
              {{ stats.voucherGrowth >= 0 ? '+' : '' }}{{ stats.voucherGrowth }}%
            </div>
          </el-card>
        </div>

        <el-card class="section-card">
          <div class="section-header">
            <h3>费用录入</h3>
            <el-button type="primary" @click="openExpenseModal">
              <span class="btn-icon">+</span>
              新增费用
            </el-button>
          </div>
          <div class="search-bar">
            <el-input v-model="expenseSearch" placeholder="搜索费用名称">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-select v-model="expenseType" placeholder="费用类型">
              <el-option label="全部" value="" />
              <el-option label="制造费用" value="manufacturing" />
              <el-option label="人工" value="labor" />
              <el-option label="水电费" value="utilities" />
              <el-option label="管理费用" value="admin" />
              <el-option label="销售费用" value="sales" />
            </el-select>
            <el-button @click="searchExpense">搜索</el-button>
          </div>
          <el-table :data="expenseList" border>
            <el-table-column prop="expenseNo" label="费用编号" />
            <el-table-column prop="expenseType" label="费用类型">
              <template #default="scope">
                {{ getExpenseTypeText(scope.row.expenseType) }}
              </template>
            </el-table-column>
            <el-table-column prop="expenseName" label="费用名称" />
            <el-table-column prop="departmentName" label="部门" />
            <el-table-column prop="amount" label="金额">
              <template #default="scope">
                ¥{{ formatNumber(scope.row.amount) }}
              </template>
            </el-table-column>
            <el-table-column prop="expenseDate" label="日期" width="120" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" @click="editExpense(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteExpense(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="section-card">
          <div class="section-header">
            <h3>财务凭证</h3>
            <el-button type="primary" @click="openVoucherModal">
              <span class="btn-icon">+</span>
              生成凭证
            </el-button>
          </div>
          <el-table :data="voucherList" border>
            <el-table-column prop="voucherNo" label="凭证编号" />
            <el-table-column prop="voucherType" label="凭证类型">
              <template #default="scope">
                {{ getVoucherTypeText(scope.row.voucherType) }}
              </template>
            </el-table-column>
            <el-table-column prop="subjectName" label="科目" />
            <el-table-column prop="debitAmount" label="借方">
              <template #default="scope">
                ¥{{ formatNumber(scope.row.debitAmount) }}
              </template>
            </el-table-column>
            <el-table-column prop="creditAmount" label="贷方">
              <template #default="scope">
                ¥{{ formatNumber(scope.row.creditAmount) }}
              </template>
            </el-table-column>
            <el-table-column prop="posted" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.posted === 1 ? 'success' : 'warning'">
                  {{ scope.row.posted === 1 ? '已过账' : '未过账' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="voucherDate" label="日期" width="120" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" @click="postVoucher(scope.row)" v-if="scope.row.posted === 0">过账</el-button>
                <el-button size="small" type="danger" @click="deleteVoucher(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>

    <el-dialog title="新增费用" v-model="showExpenseModal" width="500px">
      <el-form :model="expenseForm" label-width="100px">
        <el-form-item label="费用类型" prop="expenseType" required>
          <el-select v-model="expenseForm.expenseType">
            <el-option label="制造费用" value="manufacturing" />
            <el-option label="人工" value="labor" />
            <el-option label="水电费" value="utilities" />
            <el-option label="管理费用" value="admin" />
            <el-option label="销售费用" value="sales" />
          </el-select>
        </el-form-item>
        <el-form-item label="费用名称" prop="expenseName" required>
          <el-input v-model="expenseForm.expenseName" placeholder="请输入费用名称" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input v-model="expenseForm.departmentName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="金额" prop="amount" required>
          <el-input v-model.number="expenseForm.amount" type="number" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="日期" prop="expenseDate">
          <el-date-picker v-model="expenseForm.expenseDate" type="date" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-textarea v-model="expenseForm.remark" placeholder="请输入备注" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showExpenseModal = false">取消</el-button>
        <el-button type="primary" @click="saveExpense">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="生成凭证" v-model="showVoucherModal" width="500px">
      <el-form :model="voucherForm" label-width="100px">
        <el-form-item label="凭证类型" prop="voucherType" required>
          <el-select v-model="voucherForm.voucherType">
            <el-option label="收款凭证" value="receipt" />
            <el-option label="付款凭证" value="payment" />
            <el-option label="转账凭证" value="transfer" />
          </el-select>
        </el-form-item>
        <el-form-item label="科目编码" prop="subjectCode" required>
          <el-input v-model="voucherForm.subjectCode" placeholder="请输入科目编码" />
        </el-form-item>
        <el-form-item label="科目名称" prop="subjectName" required>
          <el-input v-model="voucherForm.subjectName" placeholder="请输入科目名称" />
        </el-form-item>
        <el-form-item label="借方金额" prop="debitAmount">
          <el-input v-model.number="voucherForm.debitAmount" type="number" placeholder="请输入借方金额" />
        </el-form-item>
        <el-form-item label="贷方金额" prop="creditAmount">
          <el-input v-model.number="voucherForm.creditAmount" type="number" placeholder="请输入贷方金额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-textarea v-model="voucherForm.remark" placeholder="请输入备注" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showVoucherModal = false">取消</el-button>
        <el-button type="primary" @click="saveVoucher">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { ElMessage } from 'element-plus'
import { getExpenseList, createExpense, updateExpense, deleteExpense as deleteExpenseApi, getVoucherList, createVoucher, deleteVoucher as deleteVoucherApi, postVoucher as postVoucherApi } from '../api/cost'

const expenseSearch = ref('')
const expenseType = ref('')

const stats = reactive({
  monthlyExpense: 125680.50,
  expenseGrowth: 8.5,
  manufacturingCost: 68500.00,
  manufacturingGrowth: 12.3,
  laborCost: 35000.00,
  laborGrowth: 5.2,
  voucherCount: 126,
  voucherGrowth: 15.8
})

const expenseList = ref([
  { id: 1, expenseNo: 'FE20240115001', expenseType: 'manufacturing', expenseName: '设备折旧费', departmentName: '生产部', amount: 15000.00, expenseDate: '2024-01-15' },
  { id: 2, expenseNo: 'FE20240115002', expenseType: 'labor', expenseName: '生产人员工资', departmentName: '生产部', amount: 28000.00, expenseDate: '2024-01-15' },
  { id: 3, expenseNo: 'FE20240114003', expenseType: 'utilities', expenseName: '水电费', departmentName: '行政部', amount: 5680.50, expenseDate: '2024-01-14' },
  { id: 4, expenseNo: 'FE20240114004', expenseType: 'admin', expenseName: '办公用品', departmentName: '行政部', amount: 2350.00, expenseDate: '2024-01-14' }
])

const voucherList = ref([
  { id: 1, voucherNo: 'VOU20240115001', voucherType: 'payment', subjectCode: '5001', subjectName: '制造费用', debitAmount: 15000.00, creditAmount: 0, posted: 1, voucherDate: '2024-01-15' },
  { id: 2, voucherNo: 'VOU20240115002', voucherType: 'payment', subjectCode: '5002', subjectName: '人工成本', debitAmount: 28000.00, creditAmount: 0, posted: 1, voucherDate: '2024-01-15' },
  { id: 3, voucherNo: 'VOU20240114003', voucherType: 'transfer', subjectCode: '5003', subjectName: '水电费', debitAmount: 5680.50, creditAmount: 5680.50, posted: 0, voucherDate: '2024-01-14' }
])

const showExpenseModal = ref(false)
const showVoucherModal = ref(false)

const expenseForm = reactive({
  expenseType: 'manufacturing',
  expenseName: '',
  departmentName: '',
  amount: 0,
  expenseDate: '',
  remark: ''
})

const voucherForm = reactive({
  voucherType: 'transfer',
  subjectCode: '',
  subjectName: '',
  debitAmount: 0,
  creditAmount: 0,
  remark: ''
})

const formatNumber = (num) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getExpenseTypeText = (type) => {
  const map = {
    manufacturing: '制造费用',
    labor: '人工',
    utilities: '水电费',
    admin: '管理费用',
    sales: '销售费用'
  }
  return map[type] || type
}

const getVoucherTypeText = (type) => {
  const map = {
    receipt: '收款凭证',
    payment: '付款凭证',
    transfer: '转账凭证'
  }
  return map[type] || type
}

const openExpenseModal = () => {
  expenseForm.expenseType = 'manufacturing'
  expenseForm.expenseName = ''
  expenseForm.departmentName = ''
  expenseForm.amount = 0
  expenseForm.expenseDate = ''
  expenseForm.remark = ''
  showExpenseModal.value = true
}

const saveExpense = async () => {
  if (!expenseForm.expenseName || expenseForm.amount <= 0) {
    ElMessage.error('请填写必填字段')
    return
  }
  try {
    if (expenseForm.id) {
      await updateExpense(expenseForm.id, expenseForm)
      ElMessage.success('更新成功')
    } else {
      await createExpense(expenseForm)
      ElMessage.success('创建成功')
    }
    showExpenseModal.value = false
    loadExpenses()
  } catch (error) {
    ElMessage.error('保存失败')
    console.error('保存费用失败:', error)
  }
}

const editExpense = (row) => {
  expenseForm.expenseType = row.expenseType
  expenseForm.expenseName = row.expenseName
  expenseForm.departmentName = row.departmentName
  expenseForm.amount = row.amount
  expenseForm.expenseDate = row.expenseDate
  showExpenseModal.value = true
}

const deleteExpense = async (id) => {
  try {
    await deleteExpenseApi(id)
    ElMessage.success('删除成功')
    loadExpenses()
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('删除费用失败:', error)
  }
}

const openVoucherModal = () => {
  voucherForm.voucherType = 'transfer'
  voucherForm.subjectCode = ''
  voucherForm.subjectName = ''
  voucherForm.debitAmount = 0
  voucherForm.creditAmount = 0
  voucherForm.remark = ''
  showVoucherModal.value = true
}

const saveVoucher = () => {
  if (!voucherForm.subjectCode || !voucherForm.subjectName) {
    ElMessage.error('请填写必填字段')
    return
  }
  ElMessage.success('保存成功')
  showVoucherModal.value = false
}

const postVoucher = async (row) => {
  try {
    await postVoucherApi(row.id)
    ElMessage.success('过账成功')
    loadVouchers()
  } catch (error) {
    ElMessage.error('过账失败')
    console.error('过账失败:', error)
  }
}

const deleteVoucher = async (id) => {
  try {
    await deleteVoucherApi(id)
    ElMessage.success('删除成功')
    loadVouchers()
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('删除凭证失败:', error)
  }
}

const searchExpense = () => {
  currentPage.value = 1
  loadExpenses()
}

onMounted(() => {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
}

.stat-header {
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  
  &.expense {
    color: #f56c6c;
  }
  
  &.manufacturing {
    color: #1890ff;
  }
  
  &.labor {
    color: #52c41a;
  }
  
  &.vouchers {
    color: #722ed1;
  }
}

.stat-trend {
  font-size: 14px;
  
  &.positive {
    color: #52c41a;
  }
  
  &.negative {
    color: #f56c6c;
  }
}

.section-card {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
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
