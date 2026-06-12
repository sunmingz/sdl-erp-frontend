<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <el-card class="page-card">
          <div class="card-header">
            <h2>库存管理</h2>
            <el-button type="primary" @click="openAddModal">
              <span class="btn-icon">+</span>
              入库
            </el-button>
          </div>
          <div class="search-bar">
            <el-input v-model="searchText" placeholder="搜索商品名称">
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
            <el-button @click="handleSearch">搜索</el-button>
          </div>
          <el-table :data="inventoryList" border>
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="productCode" label="商品编码" />
            <el-table-column prop="category" label="分类" />
            <el-table-column prop="quantity" label="库存数量">
              <template #default="scope">
                <el-tag :type="scope.row.quantity < 10 ? 'warning' : 'success'">
                  {{ scope.row.quantity }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" />
            <el-table-column prop="location" label="仓库位置" />
            <el-table-column prop="lastUpdate" label="更新时间" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="editInventory(scope.row)">编辑</el-button>
                <el-button size="small" @click="adjustInventory(scope.row)">调整</el-button>
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

    <el-dialog :title="isEdit ? '编辑库存' : '库存入库'" v-model="modalVisible" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="商品名称" required>
          <el-input v-model="formData.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品编码" required>
          <el-input v-model="formData.productCode" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="formData.category" placeholder="请输入商品分类" />
        </el-form-item>
        <el-form-item label="入库数量" required>
          <el-input v-model.number="formData.quantity" type="number" placeholder="请输入入库数量" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="formData.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="仓库位置">
          <el-input v-model="formData.location" placeholder="请输入仓库位置" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="调整库存" v-model="adjustModalVisible" width="400px">
      <el-form :model="adjustData" label-width="100px">
        <el-form-item label="调整数量">
          <el-input v-model.number="adjustData.changeQuantity" type="number" placeholder="正数入库，负数出库" />
        </el-form-item>
        <el-form-item label="调整原因">
          <el-textarea v-model="adjustData.reason" placeholder="请输入调整原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adjustModalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdjust">确认调整</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { getInventoryList, createStockIn, updateInventory, adjustInventory as adjustInventoryApi } from '../api/inventory'

const searchText = ref('')
const inventoryList = ref([])
const total = ref(100)
const pageSize = ref(10)
const currentPage = ref(1)

const modalVisible = ref(false)
const adjustModalVisible = ref(false)
const isEdit = ref(false)
const formData = ref({
  productName: '',
  productCode: '',
  category: '',
  quantity: 0,
  unit: '件',
  location: ''
})
const adjustData = ref({
  id: null,
  changeQuantity: 0,
  reason: ''
})

const handleSearch = () => {
  currentPage.value = 1
  loadInventory()
}

const loadInventory = async () => {
  try {
    const response = await getInventoryList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchText.value
    })
    
    if (response && response.data) {
      inventoryList.value = response.data.data?.list || response.data.list || response.data
      total.value = response.data.data?.total || response.data.total || 0
    }
  } catch (error) {
    console.error('获取库存数据失败:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadInventory()
}

const openAddModal = () => {
  isEdit.value = false
  formData.value = {
    productName: '',
    productCode: '',
    category: '',
    quantity: 0,
    unit: '件',
    location: ''
  }
  modalVisible.value = true
}

const editInventory = (row) => {
  isEdit.value = true
  formData.value = {
    id: row.id,
    productName: row.productName,
    productCode: row.productCode,
    category: row.category,
    quantity: row.quantity,
    unit: row.unit,
    location: row.location
  }
  modalVisible.value = true
}

const adjustInventory = (row) => {
  adjustData.value = {
    id: row.id,
    changeQuantity: 0,
    reason: ''
  }
  adjustModalVisible.value = true
}

const handleSave = async () => {
  try {
    if (isEdit.value) {
      await updateInventory(formData.value.id, formData.value)
    } else {
      await createStockIn(formData.value)
    }
    modalVisible.value = false
    loadInventory()
    alert(isEdit.value ? '库存更新成功' : '库存入库成功')
  } catch (error) {
    console.error('保存库存失败:', error)
    alert('保存失败: ' + (error.response?.data?.message || error.message))
  }
}

const handleAdjust = async () => {
  try {
    await adjustInventoryApi(adjustData.value.id, adjustData.value)
    adjustModalVisible.value = false
    loadInventory()
    alert('库存调整成功')
  } catch (error) {
    console.error('调整库存失败:', error)
    alert('调整失败: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(() => {
  loadInventory()
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
