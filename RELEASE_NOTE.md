## 更新 API 配置并升级版本号

- 移除 postcss 配置，直接在 vite 配置中使用 tailwindcss 插件
- 升级 tailwindcss 至 4.0.0 版本
- 优化更新检查逻辑和界面
- 调整样式文件，引入 dark mode 支持
- 移除冗余代码，提高代码可读性和维护性
- 调整更新按钮逻辑
- 重新设计了主布局结构，增加了侧边栏
- 优化了按钮样式和布局
- 添加了面包屑导航
- 调整了聊天页面样式
- 更新了设置页面的提示信息显示方式
- 重命名 aiProviders.ts 为 existingAiProviders.ts
- 新增 aiInit.ts 工具模块
- 更新 aiProvider.ts 调用 aiInit
- 移除 chat.ts 模块
- 新增 openGithub.ts 模块
- 更新 preload/index.ts 增加 getModelList 和 openGithub 方法
- 更新 renderer 组件和样式
