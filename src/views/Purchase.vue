<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>采购管理</h2>
            <el-button type="primary" @click="openAddModal">
              <span class="btn-icon">+</span>
              创建采购单
            </el-button>
          </div>
          <div class="search-bar">
            <el-input v-model="searchText" placeholder="搜索采购单号">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-select v-model="status" placeholder="采购状态">
              <el-option label="全部" value="" />
              <el-option label="草稿" value="draft" />
              <el-option label="待审批" value="pending" />
              <el-option label="已审批" value="approved" />
              <el-option label="已拒绝" value="rejected" />
              <el-option label="已完成" value="completed" />
            </el-select>
            <el-button @click="handleSearch">搜索</el-button>
          </div>
          <el-table :data="purchaseList" border>
            <el-table-column prop="poNo" label="采购单号" />
            <el-table-column prop="supplierName" label="供应商" />
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="quantity" label="采购数量" />
            <el-table-column prop="unitPrice" label="单价">
              <template #default="scope">
                ¥{{ scope.row.unitPrice.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="总金额">
              <template #default="scope">
                ¥{{ scope.row.totalAmount.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="viewPurchase(scope.row)">查看</el-button>
                <el-button size="small" @click="submitPurchase(scope.row)" v-if="scope.row.status === 'draft'">提交</el-button>
                <el-button size="small" type="success" @click="approvePurchase(scope.row)" v-if="scope.row.status === 'pending'">审批通过</el-button>
                <el-button size="small" type="danger" @click="rejectPurchase(scope.row)" v-if="scope.row.status === 'pending'">拒绝</el-button>
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

    <el-dialog title="创建采购单" v-model="modalVisible" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="供应商" required>
          <el-input v-model="formData.supplierName" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="商品名称" required>
          <el-input v-model="formData.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="产品编码" required>
          <el-input v-model="formData.productCode" placeholder="请输入产品编码" />
        </el-form-item>
        <el-form-item label="采购数量" required>
          <el-input v-model.number="formData.quantity" type="number" placeholder="请输入采购数量" />
        </el-form-item>
        <el-form-item label="单价" required>
          <el-input v-model.number="formData.unitPrice" type="number" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="备注">
          <el-textarea v-model="formData.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>

    <el-dialog title="采购单详情" v-model="showDetailDialog" width="600px">
      <div v-if="currentPurchase" class="detail-content">
        <div class="detail-row">
          <span class="detail-label">采购单号：</span>
          <span class="detail-value">{{ currentPurchase.purchaseNo }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">供应商名称：</span>
          <span class="detail-value">{{ currentPurchase.supplierName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">供应商电话：</span>
          <span class="detail-value">{{ currentPurchase.supplierPhone }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">商品名称：</span>
          <span class="detail-value">{{ currentPurchase.productName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">数量：</span>
          <span class="detail-value">{{ currentPurchase.quantity }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">单价：</span>
          <span class="detail-value">{{ currentPurchase.unitPrice }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">总金额：</span>
          <span class="detail-value">{{ (currentPurchase.quantity * currentPurchase.unitPrice).toFixed(2) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">交货日期：</span>
          <span class="detail-value">{{ currentPurchase.deliveryDate }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">状态：</span>
          <span class="detail-value">{{ statusMap[currentPurchase.status] }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">创建时间：</span>
          <span class="detail-value">{{ currentPurchase.createTime }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import {
  getPurchaseOrderList,
  createPurchaseOrder,
  submitPurchaseOrder,
  approvePurchaseOrder,
  rejectPurchaseOrder
} from '../api/purchase'

const searchText = ref('')
const status = ref('')
const purchaseList = ref([])
const showDetailDialog = ref(false)
const currentPurchase = ref(null)
const total = ref(100)
const pageSize = ref(10)
const currentPage = ref(1)

const modalVisible = ref(false)
const formData = ref({
  supplierName: '',
  productName: '',
  productCode: '',
  quantity: 1,
  unitPrice: 0,
  remark: ''
})

const statusMap = {
  draft: { text: '草稿', type: 'default' },
  pending: { text: '待审批', type: 'warning' },
  approved: { text: '已审批', type: 'primary' },
  rejected: { text: '已拒绝', type: 'danger' },
  completed: { text: '已完成', type: 'success' }
}

const getStatusText = (status) => statusMap[status]?.text || status
const getStatusType = (status) => statusMap[status]?.type || 'default'

const handleSearch = () => {
  currentPage.value = 1
  loadPurchases()
}

const loadPurchases = async () => {
  console.log('加载采购数据...')
  try {
    const response = await getPurchaseOrderList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchText.value,
      status: status.value
    })
    console.log('采购数据响应:', response)
    
    if (response && response.data) {
      purchaseList.value = response.data.data?.list || response.data.list || response.data
      total.value = response.data.data?.total || response.data.total || 0
    }
  } catch (error) {
    console.error('获取采购订单失败:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadPurchases()
}

const openAddModal = () => {
  console.log('openAddModal 被调用')
  console.log('modalVisible 之前:', modalVisible.value)
  formData.value = {
    supplierName: '',
    productName: '',
    productCode: '',
    quantity: 1,
    unitPrice: 0,
    remark: ''
  }
  modalVisible.value = true
  console.log('modalVisible 之后:', modalVisible.value)
}

const viewPurchase = (row) => {
  currentPurchase.value = row
  showDetailDialog.value = true
}

const handleCreate = async () => {
  console.log('handleCreate 被调用')
  console.log('formData:', formData.value)
  try {
    const response = await createPurchaseOrder(formData.value)
    console.log('createPurchaseOrder 响应:', response)
    modalVisible.value = false
    loadPurchases()
    alert('采购单创建成功')
  } catch (error) {
    console.error('创建采购单失败:', error)
    alert('创建失败: ' + (error.response?.data?.message || error.message))
  }
}

const submitPurchase = async (row) => {
  try {
    await submitPurchaseOrder(row.id)
    loadPurchases()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const approvePurchase = async (row) => {
  try {
    await approvePurchaseOrder(row.id)
    loadPurchases()
  } catch (error) {
    console.error('审批失败:', error)
  }
}

const rejectPurchase = async (row) => {
  try {
    await rejectPurchaseOrder(row.id)
    loadPurchases()
  } catch (error) {
    console.error('拒绝失败:', error)
  }
}

onMounted(() => {
  loadPurchases()
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
