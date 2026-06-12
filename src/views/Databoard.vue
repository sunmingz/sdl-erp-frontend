<template>
  <div class="databoard-container">
    <div class="dashboard-header">
      <button class="back-btn" @click="goBack">
        <span>←</span>
        <span>返回</span>
      </button>
      <h1 class="dashboard-title">📊 SDL ERP 数据大屏</h1>
      <div class="header-info">
        <span class="date">{{ currentDate }}</span>
        <span class="time">{{ currentTime }}</span>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-box">
        <div class="stat-icon sales">💰</div>
        <div class="stat-content">
          <p class="stat-value">¥{{ formatNumber(overview.totalReceipt) }}</p>
          <p class="stat-label">今日收款</p>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon expense">💳</div>
        <div class="stat-content">
          <p class="stat-value">¥{{ formatNumber(overview.totalPayment) }}</p>
          <p class="stat-label">今日付款</p>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon purchase">📦</div>
        <div class="stat-content">
          <p class="stat-value">{{ overview.purchaseCount }}</p>
          <p class="stat-label">采购订单</p>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon orders">📋</div>
        <div class="stat-content">
          <p class="stat-value">{{ overview.salesCount }}</p>
          <p class="stat-label">销售订单</p>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon inventory">📱</div>
        <div class="stat-content">
          <p class="stat-value">{{ overview.inventoryCount }}</p>
          <p class="stat-label">库存种类</p>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon qc">✅</div>
        <div class="stat-content">
          <p class="stat-value">{{ qcStats.passRate.toFixed(1) }}%</p>
          <p class="stat-label">质检合格率</p>
        </div>
      </div>
    </div>

    <div class="charts-area">
      <div class="chart-box large">
        <h3 class="chart-title">📈 销售趋势</h3>
        <div class="chart-container">
          <div class="bar-chart">
            <div 
              v-for="(item, index) in salesTrend" 
              :key="index"
              class="bar-wrapper"
            >
              <div 
                class="bar" 
                :style="{ height: (item.amount / maxSalesAmount * 100) + '%' }"
              ></div>
              <span class="bar-label">{{ item.date }}</span>
              <span class="bar-value">¥{{ formatNumber(item.amount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-box">
        <h3 class="chart-title">📊 采购趋势</h3>
        <div class="chart-container">
          <div class="bar-chart">
            <div 
              v-for="(item, index) in purchaseTrend" 
              :key="index"
              class="bar-wrapper"
            >
              <div 
                class="bar purchase" 
                :style="{ height: (item.count / maxPurchaseCount * 100) + '%' }"
              ></div>
              <span class="bar-label">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="charts-area">
      <div class="chart-box">
        <h3 class="chart-title">✅ 质检统计</h3>
        <div class="qc-stats">
          <div class="qc-item">
            <div class="qc-circle passed">
              <span>{{ qcStats.passed }}</span>
            </div>
            <span class="qc-label">合格</span>
          </div>
          <div class="qc-item">
            <div class="qc-circle failed">
              <span>{{ qcStats.failed }}</span>
            </div>
            <span class="qc-label">不合格</span>
          </div>
          <div class="qc-item">
            <div class="qc-circle concession">
              <span>{{ qcStats.concession }}</span>
            </div>
            <span class="qc-label">让步接收</span>
          </div>
        </div>
      </div>

      <div class="chart-box">
        <h3 class="chart-title">🏭 生产状态</h3>
        <div class="production-status">
          <div 
            v-for="(item, index) in productionStatus" 
            :key="index"
            class="status-item"
          >
            <span class="status-label">{{ item.label }}</span>
            <div class="status-bar">
              <div 
                class="status-fill" 
                :class="item.type"
                :style="{ width: item.percentage + '%' }"
              ></div>
            </div>
            <span class="status-value">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <div class="chart-box">
        <h3 class="chart-title">📦 库存Top10</h3>
        <div class="inventory-top">
          <div 
            v-for="(item, index) in inventoryTop" 
            :key="index"
            class="inventory-item"
          >
            <span class="rank" :class="{ top3: index < 3 }">{{ index + 1 }}</span>
            <span class="name">{{ item.name }}</span>
            <span class="quantity">{{ item.quantity }}</span>
          </div>
        </div>
      </div>

      <div class="chart-box">
        <h3 class="chart-title">💰 财务汇总</h3>
        <div class="finance-summary">
          <div class="finance-item">
            <span class="finance-label">总收入</span>
            <span class="finance-value income">¥{{ formatNumber(finance.totalReceipt) }}</span>
          </div>
          <div class="finance-item">
            <span class="finance-label">总支出</span>
            <span class="finance-value expense">¥{{ formatNumber(finance.totalPayment) }}</span>
          </div>
          <div class="finance-item">
            <span class="finance-label">净现金流</span>
            <span class="finance-value net" :class="finance.net >= 0 ? 'positive' : 'negative'">
              {{ finance.net >= 0 ? '+' : '' }}¥{{ formatNumber(finance.net) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentDate = ref('')
const currentTime = ref('')
let timer = null

const goBack = () => {
  router.push('/dashboard')
}

const overview = reactive({
  totalReceipt: 1256800.00,
  totalPayment: 895600.00,
  purchaseCount: 156,
  salesCount: 234,
  inventoryCount: 128,
  productionCount: 28
})

const qcStats = reactive({
  total: 120,
  passed: 108,
  failed: 8,
  concession: 4,
  passRate: 90
})

const salesTrend = ref([
  { date: '01-09', amount: 120000 },
  { date: '01-10', amount: 156000 },
  { date: '01-11', amount: 98000 },
  { date: '01-12', amount: 189000 },
  { date: '01-13', amount: 145000 },
  { date: '01-14', amount: 210000 },
  { date: '01-15', amount: 125680 }
])

const purchaseTrend = ref([
  { date: '01-09', count: 18 },
  { date: '01-10', count: 22 },
  { date: '01-11', count: 15 },
  { date: '01-12', count: 28 },
  { date: '01-13', count: 20 },
  { date: '01-14', count: 32 },
  { date: '01-15', count: 21 }
])

const productionStatus = ref([
  { label: '草稿', count: 5, percentage: 18, type: 'draft' },
  { label: '待审核', count: 8, percentage: 29, type: 'pending' },
  { label: '生产中', count: 10, percentage: 36, type: 'producing' },
  { label: '已完成', count: 5, percentage: 17, type: 'completed' }
])

const inventoryTop = ref([
  { name: '原材料A', quantity: 1500 },
  { name: '原材料B', quantity: 1200 },
  { name: '成品C', quantity: 850 },
  { name: '配件D', quantity: 780 },
  { name: '包装材料', quantity: 560 },
  { name: '原材料E', quantity: 420 },
  { name: '成品F', quantity: 380 },
  { name: '配件G', quantity: 320 },
  { name: '原材料H', quantity: 280 },
  { name: '成品I', quantity: 250 }
])

const finance = reactive({
  totalReceipt: 1256800.00,
  totalPayment: 895600.00,
  net: 361200.00
})

const maxSalesAmount = ref(Math.max(...salesTrend.value.map(item => item.amount)))
const maxPurchaseCount = ref(Math.max(...purchaseTrend.value.map(item => item.count)))

const formatNumber = (num) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const updateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.databoard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #2d3561 100%);
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(-2px);
  }
  
  span:first-child {
    font-size: 20px;
  }
}

.dashboard-title {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

.header-info {
  display: flex;
  gap: 20px;
  
  .date, .time {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .time {
    font-size: 24px;
    font-weight: bold;
    color: #10b981;
    font-family: 'Courier New', monospace;
  }
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 16px;
  
  &.sales {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  &.expense {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  &.purchase {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
  
  &.orders {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  }
  
  &.inventory {
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  }
  
  &.qc {
    background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  }
}

.stat-content {
  flex: 1;
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    margin: 0 0 4px 0;
  }
  
  .stat-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }
}

.charts-area {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  
  .chart-box.large {
    grid-column: span 2;
  }
}

.chart-box {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px 0;
}

.chart-container {
  height: 200px;
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 100%;
  padding-top: 20px;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
}

.bar {
  width: 32px;
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.5s ease;
  
  &.purchase {
    background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  }
}

.bar-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
}

.bar-value {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

.qc-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 150px;
}

.qc-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .qc-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 8px;
  }
}

.qc-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  
  &.passed {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  &.failed {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  &.concession {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
}

.production-status {
  height: 150px;
}

.status-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  
  .status-label {
    width: 60px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .status-bar {
    flex: 1;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin: 0 12px;
  }
  
  .status-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
    
    &.draft {
      background: #6b7280;
    }
    
    &.pending {
      background: #f59e0b;
    }
    
    &.producing {
      background: #3b82f6;
    }
    
    &.completed {
      background: #10b981;
    }
  }
  
  .status-value {
    width: 32px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    text-align: right;
  }
}

.inventory-top {
  max-height: 180px;
  overflow-y: auto;
}

.inventory-top::-webkit-scrollbar {
  width: 4px;
}

.inventory-top::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.inventory-top::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.inventory-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  
  .rank {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    margin-right: 12px;
    
    &.top3 {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    }
  }
  
  .name {
    flex: 1;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .quantity {
    font-size: 14px;
    font-weight: bold;
    color: #10b981;
    margin-left: 8px;
  }
}

.finance-summary {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.finance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .finance-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .finance-value {
    font-size: 18px;
    font-weight: bold;
    
    &.income {
      color: #10b981;
    }
    
    &.expense {
      color: #ef4444;
    }
    
    &.net {
      color: #3b82f6;
      
      &.positive {
        color: #10b981;
      }
      
      &.negative {
        color: #ef4444;
      }
    }
  }
}
</style>
