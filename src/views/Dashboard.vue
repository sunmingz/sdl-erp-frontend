<template>
  <div class="dashboard-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-wrapper">
        <div class="stats-cards">
          <el-card class="stat-card">
            <div class="stat-icon orders">
              <span>📦</span>
            </div>
            <div class="stat-info">
              <p class="stat-value">¥128,430</p>
              <p class="stat-label">今日销售额</p>
            </div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-icon users">
              <span>👥</span>
            </div>
            <div class="stat-info">
              <p class="stat-value">1,245</p>
              <p class="stat-label">活跃用户</p>
            </div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-icon products">
              <span>🛒</span>
            </div>
            <div class="stat-info">
              <p class="stat-value">56</p>
              <p class="stat-label">今日订单</p>
            </div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-icon revenue">
              <span>📈</span>
            </div>
            <div class="stat-info">
              <p class="stat-value">+12.5%</p>
              <p class="stat-label">增长率</p>
            </div>
          </el-card>
        </div>
        <div class="charts-row">
          <el-card class="chart-card">
            <h3>销售趋势</h3>
            <div class="chart-placeholder">
              <el-progress type="line" :percentage="65" :stroke-width="12" />
              <p>本月销售完成率</p>
            </div>
          </el-card>
          <el-card class="chart-card">
            <h3>库存状态</h3>
            <div class="chart-placeholder">
              <el-progress type="circle" :percentage="78" :stroke-width="8" />
              <p>库存周转率</p>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
</script>

<style scoped>
.dashboard-container {
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

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
}

.stat-icon.orders {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-icon.users {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.stat-icon.products {
  background: linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%);
  color: white;
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.charts-row {
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

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.chart-placeholder p {
  margin-top: 12px;
  color: #909399;
}
</style>
