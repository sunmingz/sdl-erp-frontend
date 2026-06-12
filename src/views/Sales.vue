<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>销售管理</h2>
            <el-button type="primary" @click="openAddModal">
              <span class="btn-icon">+</span>
              创建销售单
            </el-button>
          </div>
          <div class="search-bar">
            <el-input v-model="searchText" placeholder="搜索销售单号">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-select v-model="status" placeholder="销售状态">
              <el-option label="全部" value="" />
              <el-option label="待发货" value="pending" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已完成" value="completed" />
            </el-select>
            <el-button @click="handleSearch">搜索</el-button>
          </div>
          <el-table :data="salesList" border>
            <el-table-column prop="salesNo" label="销售单号" />
            <el-table-column prop="customerName" label="客户名称" />
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="quantity" label="销售数量" />
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
                <el-button size="small" @click="viewSales(scope.row)">查看</el-button>
                <el-button size="small" type="success" @click="shipSales(scope.row)" v-if="scope.row.status === 'pending'">发货</el-button>
                <el-button size="small" type="primary" @click="completeSales(scope.row)" v-if="scope.row.status === 'shipped'">完成</el-button>
                <el-button size="small" type="danger" @click="deleteSales(scope.row.id)">删除</el-button>
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
    <el-dialog :title="isEdit ? '编辑销售单' : '创建销售单'" v-model="modalVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="销售单号" prop="salesNo">
          <el-input v-model="form.salesNo" placeholder="请输入销售单号" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="客户电话" prop="customerPhone">
          <el-input v-model="form.customerPhone" placeholder="请输入客户电话" />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model.number="form.quantity" type="number" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input v-model.number="form.unitPrice" type="number" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="收货地址" prop="shippingAddress">
          <el-textarea v-model="form.shippingAddress" placeholder="请输入收货地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="销售单详情" v-model="showDetailDialog" width="600px">
      <div v-if="currentSales" class="detail-content">
        <div class="detail-row">
          <span class="detail-label">销售单号：</span>
          <span class="detail-value">{{ currentSales.salesNo }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">客户名称：</span>
          <span class="detail-value">{{ currentSales.customerName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">客户电话：</span>
          <span class="detail-value">{{ currentSales.customerPhone }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">商品名称：</span>
          <span class="detail-value">{{ currentSales.productName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">数量：</span>
          <span class="detail-value">{{ currentSales.quantity }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">单价：</span>
          <span class="detail-value">{{ currentSales.unitPrice }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">总金额：</span>
          <span class="detail-value">{{ (currentSales.quantity * currentSales.unitPrice).toFixed(2) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">收货地址：</span>
          <span class="detail-value">{{ currentSales.shippingAddress }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">状态：</span>
          <span class="detail-value">{{ statusMap[currentSales.status] }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">创建时间：</span>
          <span class="detail-value">{{ currentSales.createTime }}</span>
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
import {
  getSalesOrderList,
  createSalesOrder,
  updateSalesOrder,
  shipSalesOrder,
  completeSalesOrder,
  deleteSalesOrder
} from '../api/sales'

const searchText = ref('')
const status = ref('')
const salesList = ref([])
const showDetailDialog = ref(false)
const currentSales = ref(null)
const total = ref(100)
const pageSize = ref(10)
const currentPage = ref(1)

const modalVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = reactive({
  salesNo: '',
  customerName: '',
  customerPhone: '',
  productName: '',
  quantity: 1,
  unitPrice: 0,
  shippingAddress: ''
})

const rules = {
  salesNo: [{ required: true, message: '请输入销售单号', trigger: 'blur' }],
  customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }]
}

const statusMap = {
  pending: { text: '待发货', type: 'warning' },
  shipped: { text: '已发货', type: 'primary' },
  completed: { text: '已完成', type: 'success' }
}

const getStatusText = (status) => statusMap[status]?.text || status
const getStatusType = (status) => statusMap[status]?.type || 'default'

const handleSearch = () => {
  currentPage.value = 1
  loadSales()
}

const loadSales = async () => {
  console.log('加载销售数据...')
  try {
    const response = await getSalesOrderList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchText.value,
      status: status.value
    })
    console.log('销售数据响应:', response)
    
    if (response && response.data) {
      salesList.value = response.data.data?.list || response.data.list || response.data
      total.value = response.data.data?.total || response.data.total || 0
    }
  } catch (error) {
    console.error('获取销售订单失败:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadSales()
}

const openAddModal = () => {
  isEdit.value = false
  form.salesNo = ''
  form.customerName = ''
  form.customerPhone = ''
  form.productName = ''
  form.quantity = 1
  form.unitPrice = 0
  form.shippingAddress = ''
  modalVisible.value = true
}

const viewSales = (row) => {
  currentSales.value = row
  showDetailDialog.value = true
}

const shipSales = async (row) => {
  console.log('发货:', row)
  try {
    await shipSalesOrder(row.id)
    loadSales()
  } catch (error) {
    console.error('发货失败:', error)
  }
}

const completeSales = async (row) => {
  console.log('完成:', row)
  try {
    await completeSalesOrder(row.id)
    loadSales()
  } catch (error) {
    console.error('完成失败:', error)
  }
}

const deleteSales = async (id) => {
  console.log('删除:', id)
  try {
    await deleteSalesOrder(id)
    loadSales()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const handleSubmit = async () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return
    }
    handleSave()
  })
}

const handleSave = async () => {
  try {
    if (isEdit.value) {
      await updateSalesOrder(form.id, form)
      alert('销售单更新成功')
    } else {
      await createSalesOrder(form)
      alert('销售单创建成功')
    }
    modalVisible.value = false
    loadSales()
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(() => {
  loadSales()
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

.detail-content {
  padding: 10px;
}

.detail-row {
  display: flex;
  margin-bottom: 12px;
}

.detail-label {
  width: 100px;
  font-weight: 500;
  color: #666;
}

.detail-value {
  flex: 1;
  color: #333;
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
