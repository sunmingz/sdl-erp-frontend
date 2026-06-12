<template>
  <div class="page-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <div class="stats-grid">
          <el-card class="stat-card">
            <div class="stat-header">
              <span class="stat-label">本月收入</span>
            </div>
            <div class="stat-value income">¥{{ formatNumber(stats.monthlyIncome) }}</div>
            <div class="stat-trend" :class="stats.incomeGrowth >= 0 ? 'positive' : 'negative'">
              {{ stats.incomeGrowth >= 0 ? '+' : '' }}{{ stats.incomeGrowth }}%
            </div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-header">
              <span class="stat-label">本月支出</span>
            </div>
            <div class="stat-value expense">¥{{ formatNumber(stats.monthlyExpense) }}</div>
            <div class="stat-trend" :class="stats.expenseGrowth >= 0 ? 'positive' : 'negative'">
              {{ stats.expenseGrowth >= 0 ? '+' : '' }}{{ stats.expenseGrowth }}%
            </div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-header">
              <span class="stat-label">本月利润</span>
            </div>
            <div class="stat-value profit">¥{{ formatNumber(stats.monthlyProfit) }}</div>
            <div class="stat-trend" :class="stats.profitGrowth >= 0 ? 'positive' : 'negative'">
              {{ stats.profitGrowth >= 0 ? '+' : '' }}{{ stats.profitGrowth }}%
            </div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-header">
              <span class="stat-label">应收账款</span>
            </div>
            <div class="stat-value receivable">¥{{ formatNumber(stats.receivable) }}</div>
            <div class="stat-trend" :class="stats.receivableGrowth >= 0 ? 'positive' : 'negative'">
              {{ stats.receivableGrowth >= 0 ? '+' : '' }}{{ stats.receivableGrowth }}%
            </div>
          </el-card>
        </div>
        <div class="charts-grid">
          <el-card class="chart-card">
            <h3>收支趋势</h3>
            <div class="chart-content">
              <el-progress type="line" :percentage="incomePercentage" :stroke-width="8" />
              <div class="chart-detail">
                <p>收入完成率: {{ incomePercentage }}%</p>
                <p>目标: ¥200,000</p>
              </div>
            </div>
          </el-card>
          <el-card class="chart-card">
            <h3>费用分类</h3>
            <div class="chart-content">
              <div class="expense-list">
                <div class="expense-item" v-for="item in stats.expenseCategories" :key="item.name">
                  <span class="expense-dot" :style="{ background: item.color }"></span>
                  <span>{{ item.name }}</span>
                  <span class="expense-amount">¥{{ formatNumber(item.amount) }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { getFinanceStats } from '../api/finance'

const stats = ref({
  monthlyIncome: 0,
  monthlyExpense: 0,
  monthlyProfit: 0,
  receivable: 0,
  incomeGrowth: 0,
  expenseGrowth: 0,
  profitGrowth: 0,
  receivableGrowth: 0,
  expenseCategories: []
})

const incomePercentage = computed(() => {
  return Math.round((stats.value.monthlyIncome / 200000) * 100)
})

const formatNumber = (num) => {
  if (!num) return '0.00'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const loadStats = async () => {
  console.log('加载财务统计数据...')
  try {
    const response = await getFinanceStats()
    console.log('财务数据响应:', response)
    
    if (response && response.data) {
      stats.value = response.data.data || response.data
    }
  } catch (error) {
    console.error('获取财务统计数据失败:', error)
  }
}

onMounted(() => {
  loadStats()
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
  margin-bottom: 12px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-value.income {
  color: #67c23a;
}

.stat-value.expense {
  color: #f56c6c;
}

.stat-value.profit {
  color: #409eff;
}

.stat-value.receivable {
  color: #e6a23c;
}

.stat-trend {
  font-size: 14px;
}

.stat-trend.positive {
  color: #67c23a;
}

.stat-trend.negative {
  color: #f56c6c;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  padding: 20px;
}

.chart-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.chart-content {
  padding: 10px;
}

.chart-detail {
  margin-top: 16px;
}

.chart-detail p {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.expense-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.expense-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expense-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.expense-amount {
  margin-left: auto;
  font-weight: 600;
  color: #303133;
}
</style>
