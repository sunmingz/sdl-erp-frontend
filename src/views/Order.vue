<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>订单管理</h2>
            <el-button type="primary" @click="openAddModal">
              <span class="btn-icon">+</span>
              创建订单
            </el-button>
          </div>
          <div class="search-bar">
            <el-input v-model="searchText" placeholder="搜索订单号">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-select v-model="status" placeholder="订单状态">
              <el-option label="全部" value="" />
              <el-option label="草稿" value="draft" />
              <el-option label="待审核" value="pending" />
              <el-option label="已确认" value="confirmed" />
              <el-option label="部分发货" value="partial_ship" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已完成" value="completed" />
              <el-option label="已作废" value="cancelled" />
            </el-select>
            <el-button @click="handleSearch">搜索</el-button>
          </div>
          <el-table :data="orderList" border>
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="customerName" label="客户名称" />
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="totalAmount" label="订单金额">
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
                <el-button size="small" @click="viewOrder(scope.row)">查看</el-button>
                <el-button size="small" @click="editOrder(scope.row)" :disabled="scope.row.status !== 'draft'">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDeleteOrder(scope.row.id)">删除</el-button>
                <el-button size="small" type="primary" v-if="scope.row.status === 'draft'" @click="handleSubmit(scope.row.id)">提交</el-button>
                <el-button size="small" type="success" v-if="scope.row.status === 'pending'" @click="handleConfirm(scope.row.id)">确认</el-button>
                <el-button size="small" type="warning" v-if="scope.row.status === 'pending'" @click="handleCancel(scope.row.id)">取消</el-button>
                <el-button size="small" type="info" v-if="scope.row.status === 'confirmed'" @click="handleShip(scope.row.id)">发货</el-button>
                <el-button size="small" type="success" v-if="scope.row.status === 'shipped'" @click="handleComplete(scope.row.id)">完成</el-button>
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

    <el-dialog title="创建订单" v-model="modalVisible" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="客户名称" required>
          <el-input v-model="formData.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="商品名称" required>
          <el-input v-model="formData.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="数量" required>
          <el-input v-model.number="formData.quantity" type="number" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="单价" required>
          <el-input v-model.number="formData.unitPrice" type="number" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="收货地址">
          <el-textarea v-model="formData.shippingAddress" placeholder="请输入收货地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>

    <el-dialog title="订单详情" v-model="showDetailDialog" width="600px">
      <div v-if="currentOrder" class="detail-content">
        <div class="detail-row">
          <span class="detail-label">订单号：</span>
          <span class="detail-value">{{ currentOrder.orderNo }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">客户名称：</span>
          <span class="detail-value">{{ currentOrder.customerName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">商品名称：</span>
          <span class="detail-value">{{ currentOrder.productName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">数量：</span>
          <span class="detail-value">{{ currentOrder.quantity }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">单价：</span>
          <span class="detail-value">{{ currentOrder.unitPrice }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">总金额：</span>
          <span class="detail-value">{{ (currentOrder.quantity * currentOrder.unitPrice).toFixed(2) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">状态：</span>
          <span class="detail-value">{{ statusMap[currentOrder.status] }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">创建时间：</span>
          <span class="detail-value">{{ currentOrder.createTime }}</span>
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
import { getOrderList, createOrder, updateOrder, deleteOrder, submitOrder, confirmOrder, shipOrder, completeOrder, cancelOrder } from '../api/order'

const searchText = ref('')
const status = ref('')
const orderList = ref([])
const showDetailDialog = ref(false)
const currentOrder = ref(null)
const total = ref(100)
const pageSize = ref(10)
const currentPage = ref(1)

const modalVisible = ref(false)
const isEdit = ref(false)
const formData = ref({
  customerName: '',
  productName: '',
  quantity: 1,
  unitPrice: 0,
  shippingAddress: ''
})

const statusMap = {
  draft: { text: '草稿', type: 'default' },
  pending: { text: '待审核', type: 'warning' },
  confirmed: { text: '已确认', type: 'primary' },
  partial_ship: { text: '部分发货', type: 'info' },
  shipped: { text: '已发货', type: 'info' },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已作废', type: 'danger' }
}

const getStatusText = (status) => statusMap[status]?.text || status
const getStatusType = (status) => statusMap[status]?.type || 'default'

const handleSearch = () => {
  currentPage.value = 1
  loadOrders()
}

const loadOrders = async () => {
  console.log('加载订单数据...')
  try {
    const response = await getOrderList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchText.value
    })
    console.log('订单数据响应:', response)
    
    if (response && response.data) {
      orderList.value = response.data.data?.list || response.data.list || response.data
      total.value = response.data.data?.total || response.data.total || 0
    }
  } catch (error) {
    console.error('获取订单数据失败:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadOrders()
}

const openAddModal = () => {
  isEdit.value = false
  formData.value = {
    customerName: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    shippingAddress: ''
  }
  modalVisible.value = true
}

const viewOrder = (row) => {
  currentOrder.value = row
  showDetailDialog.value = true
}

const editOrder = (row) => {
  isEdit.value = true
  formData.value = {
    id: row.id,
    customerName: row.customerName,
    productName: row.productName,
    quantity: row.quantity,
    unitPrice: row.unitPrice,
    shippingAddress: row.shippingAddress || ''
  }
  modalVisible.value = true
}

const handleCreate = async () => {
  try {
    if (isEdit.value) {
      await updateOrder(formData.value.id, formData.value)
    } else {
      await createOrder(formData.value)
    }
    modalVisible.value = false
    loadOrders()
    alert(isEdit.value ? '订单更新成功' : '订单创建成功')
  } catch (error) {
    console.error('保存订单失败:', error)
    alert('保存失败: ' + (error.response?.data?.message || error.message))
  }
}

const handleDeleteOrder = async (id) => {
  try {
    await deleteOrder(id)
    loadOrders()
  } catch (error) {
    console.error('删除订单失败:', error)
  }
}

const handleSubmit = async (id) => {
  try {
    await submitOrder(id)
    loadOrders()
    alert('订单提交成功')
  } catch (error) {
    console.error('提交订单失败:', error)
    alert('提交失败: ' + (error.response?.data?.message || error.message))
  }
}

const handleConfirm = async (id) => {
  try {
    await confirmOrder(id)
    loadOrders()
    alert('订单确认成功')
  } catch (error) {
    console.error('确认订单失败:', error)
    alert('确认失败: ' + (error.response?.data?.message || error.message))
  }
}

const handleShip = async (id) => {
  try {
    await shipOrder(id)
    loadOrders()
    alert('订单发货成功')
  } catch (error) {
    console.error('发货失败:', error)
    alert('发货失败: ' + (error.response?.data?.message || error.message))
  }
}

const handleComplete = async (id) => {
  try {
    await completeOrder(id)
    loadOrders()
    alert('订单完成成功')
  } catch (error) {
    console.error('完成订单失败:', error)
    alert('完成失败: ' + (error.response?.data?.message || error.message))
  }
}

const handleCancel = async (id) => {
  try {
    await cancelOrder(id)
    loadOrders()
    alert('订单取消成功')
  } catch (error) {
    console.error('取消订单失败:', error)
    alert('取消失败: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(() => {
  loadOrders()
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
