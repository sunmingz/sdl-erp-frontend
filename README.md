# SDL-ERP 前端项目

基于 Vue3 + Vite + Element Plus 构建的企业资源管理系统前端。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **UI框架**: Element Plus
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **HTTP客户端**: Axios

## 项目结构

```
src/
├── api/              # API接口定义
│   ├── index.js      # 全局API拦截配置
│   └── user.js       # 用户相关接口
├── components/       # 公共组件
│   ├── Header.vue    # 顶部导航栏
│   └── Sidebar.vue   # 侧边栏菜单
├── views/            # 页面视图
│   ├── Login.vue     # 登录页
│   ├── Dashboard.vue # 仪表盘
│   ├── User.vue      # 用户管理
│   ├── Order.vue     # 订单管理
│   ├── Inventory.vue # 库存管理
│   ├── Purchase.vue  # 采购管理
│   ├── Sales.vue     # 销售管理
│   └── Finance.vue   # 财务管理
├── router/           # 路由配置
│   └── index.js
├── stores/           # Pinia状态管理
├── utils/            # 工具函数
│   └── index.js
├── App.vue           # 根组件
└── main.js           # 应用入口
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 功能模块

| 模块 | 路径 | 说明 |
|------|------|------|
| 登录页 | `/login` | 用户登录认证 |
| 仪表盘 | `/dashboard` | 数据统计概览 |
| 用户管理 | `/user` | 用户CRUD操作 |
| 订单管理 | `/order` | 订单列表与状态管理 |
| 库存管理 | `/inventory` | 库存查询与调整 |
| 采购管理 | `/purchase` | 采购单管理与审批 |
| 销售管理 | `/sales` | 销售单管理 |
| 财务管理 | `/finance` | 财务报表统计 |
| 部门管理 | `/department` | 组织架构与部门管理 |

## 环境变量

在项目根目录创建 `.env` 文件：

```env
VUE_APP_BASE_API=http://localhost:8080/api
```

## 注意事项

- 前端默认运行在 `http://localhost:5173`
- 需要配合后端服务使用，后端默认端口 `8080`
- 登录账号：admin/admin123 或 user/user123
