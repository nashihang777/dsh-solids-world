# 发布流程（GitHub Actions → npm，Trusted Publishing）

本仓库通过 `.github/workflows/publish.yml` 发布到 npm：

- 推送 `v*` 标签 → 校验后发布；
- 手动触发（Actions → publish → Run workflow）→ 只做 `npm publish --dry-run`。

发布使用 **npm Trusted Publishing（OIDC）**，仓库里不保存任何长期 npm 令牌。GitHub
Actions 用自身的 OIDC 身份换取一次性的发布凭据，并自动生成 provenance。

包名：`@nashihang777/dsh-solids-world`（`client.js` 的模块 id 必须与之相同，
workflow 的 verify 步骤会强制这一点）。

## 一次性配置

### 1. 先手动发布 1.0.0（bootstrap）

Trusted Publishing 只能配置在 npm 上**已存在**的包上，所以第一次必须手动发。
本机 npm 当前未登录，先登录（浏览器授权）：

```bash
npm login --registry=https://registry.npmjs.org
```

然后在本目录发布（若账号开了 2FA 会要求 OTP；不需要创建长期令牌）：

```bash
cd solids-world-harness
npm publish --access public --registry=https://registry.npmjs.org
```

发布前建议确认产物是最新的：`node scripts/build.mjs`（需要 esbuild/postcss/three，
见 README 的 Build 一节）。

### 2. 配置 Trusted Publisher

npmjs.com → `@nashihang777/dsh-solids-world` 包页面 → **Settings → Trusted publishing**
→ 添加 GitHub Actions：

| 字段 | 值 |
|---|---|
| Organization or user | `nashihang777` |
| Repository | `dsh-solids-world` |
| Workflow filename | `publish.yml` |
| Environment | 留空（除非你想用环境审批） |
| **Permissions** | 必须勾选 **`npm publish`**（不能只勾 `npm stage publish`） |

> 这是 `403 OIDC permission denied` 的唯一常见原因。引入 staged publishing 后，
> 信任关系的权限按命令细分：只授予 `npm stage publish` 时，CI 里的 `npm publish`
> 必然被拒，与 owner/repo/workflow 填得对不对无关。

本机 npm 是 11.9，没有 `trust` 子命令；用 npm 12+ 的 CLI 也能直接设置：

```bash
npx npm@latest trust github \
  --repo nashihang777/dsh-solids-world \
  --file publish.yml \
  --allow-publish
```

### 3. 确认前提

- 仓库需为 **public**：`--provenance` 需要公开源码；
- workflow 已声明 `permissions: id-token: write`；
- 发布 job 使用 **Node 24**（自带 npm ≥ 11.5）。

## 日常发布

```bash
# 1. 改代码后重新构建产物
node scripts/build.mjs

# 2. 更新版本号（自动提交并打 tag）
npm version patch -m "release: v%s"    # 或 minor / major

# 3. 推送提交与标签，触发发布（两端都会收到）
git push origin main --tags
```

workflow 的 `verify` 会检查：标签与 `package.json` 版本一致、包名在
`@nashihang777/` 下、`private` 不为 true、`client.js` 的模块 id 等于包名，
以及 `npm pack --dry-run` 的发布内容。

发布后验证：

```bash
npm view @nashihang777/dsh-solids-world version
```

## 手动演练（不发布）

GitHub → **Actions → publish → Run workflow**。只执行 `npm publish --dry-run`，
用来确认 workflow 能拿到 OIDC 权限、包内容正确。

## 故障排查

| 现象 | 原因 / 处理 |
|---|---|
| `403 ... OIDC permission denied for this action` | 信任关系没有授予 `npm publish`（只给了 `npm stage publish`）。编辑该条目勾上 `npm publish`，或用上面的 `npx npm@latest trust ... --allow-publish` |
| `402 Payment Required` | 该 scope 被设为私有库或需要付费计划；`publishConfig.access` 已是 `public` |
| `EOTP` / two-factor | 首次手动发布需要 OTP；CI 发布不需要（OIDC） |
| `403 Forbidden`、`404 Not Found`（无 OIDC 字样） | Trusted Publisher 的 owner/repo/workflow 填写不一致 |
| `npm ERR! ... id-token` | workflow 缺少 `id-token: write`，或跑在 self-hosted runner 上 |
| `tag vX.Y.Z does not match package.json version` | 先 `npm version` 再打标签 |
| `Cannot publish over existing version` | 版本号未递增；npm 不允许重复发布同一版本 |
| `client.js module id ... does not match package name` | 改过包名后忘记 `node scripts/build.mjs` |
| `--provenance` 报错 | 仓库不是公开仓库；去掉 `--provenance` |

> 区分两种 403：带 `OIDC permission denied` = 授权范围问题；不带 = 身份/路径不匹配。
> provenance 签名成功只说明 GitHub 侧 OIDC 正常，不代表 npm 授权通过。

## 安全约定

- 优先 OIDC：无长期令牌可泄露；
- 若必须用令牌：最小 scope、定期轮换、只放 GitHub Secret，并去掉 `id-token: write` 与 `--provenance`；
- workflow 只在标签推送时发布，避免从任意分支误发。
