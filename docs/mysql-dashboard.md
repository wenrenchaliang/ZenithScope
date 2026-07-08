# MySQL8 真实数据接入

本项目的大屏已从浏览器端 mock 数据切换为 MySQL8 真实监控数据。开发环境默认请求 `http://127.0.0.1:3001/api/dashboard/*`。

## 数据库

当前可复用本机 Docker 容器：

```text
container: mysql8
image: mysql:8.0
port: 3306
root password: 123456
timezone: Asia/Shanghai
database: zenithscope
```

表结构在 `database/schema.sql`。导入时会把毫秒时间戳转换为 UTC+8 中国本地时间，并保存 `collected_at`、`collected_date`、`collected_year`、`collected_month`、`collected_day`，同时生成 `daily_metric_summary` 按天汇总表。

## 导入数据

```bash
npm run import:data
```

导入脚本读取：

- `data/host_detail.dat`
- `data/mod_detail.dat`
- `data/pref_tsar.dat`
- `data/disk_tsar.dat`

已验证导入结果：

- 主机：20 台
- 指标定义：55 个
- 监控明细：79,200 条
- 按日汇总：12,651 条
- 中国时区时间范围：2026-07-01 00:00:00 至 2026-08-11 15:55:00

大屏为了同时展示 CPU、内存、网络和磁盘，最新业务日取存在 `cpu_usage` 的最新日期：2026-07-07。

## 启动服务

启动 API：

```bash
npm run api
```

启动大屏：

```bash
npm run dev -- --host 127.0.0.1 --port 10001
```

访问：

```text
http://127.0.0.1:10001/
```

如需回到教学 mock，可显式设置：

```bash
VITE_ENABLE_MSW=true
```
