# 变更日志

本文件记录 `@nashihang777/dsh-solids-world` 的发布变更。

## 1.0.0

首个版本：把桌面应用 [solids-world](https://github.com/nashihang777/solids-world)
的 3D 图鉴移植为 DeepSeek Harness 插件。

- 侧栏图标 + `main` 整页面板两个插槽入口，面板随宿主明暗主题与界面语言；
- 53 个中英双语条目、五个板块，全部 3D 几何由物理公式实时生成；
- 分步讲解与镜头联动、小测验与进度、逐条笔记与 Markdown 导出、图鉴画廊；
- 中/英/别名/拼音检索、超胞与成键/标注/剖切/自旋、轨道与动力学参数控制；
- 本地 CIF 导入（词法、语法、空间群展开、结构提取全部离线）；
- 客户端为自包含产物（three.js 内联，仅从宿主取 `react`），样式表作用域到
  `.sw-atlas`，不改动宿主界面；设置与笔记存于页面 `localStorage`。
