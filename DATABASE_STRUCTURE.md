# 数据库结构说明

## 概述

系统使用两个主表来存储数据：
1. **phenotype_records** - 存储每个样本的采集数据
2. **weekly_statistics** - 存储每周的统计指标

## 表1: phenotype_records (采集数据表)

### 用途
存储每个样本（重复）的原始采集数据。

### 数据结构
- **每行** = 1个样本 × 1周的数据
- **每周** = 30行（30个样本）
- **每年** = 最多 30 × 53 = 1590行

### 主要字段

#### 系统字段
- `id` - 主键
- `user_id` - 用户ID（外键）
- `created_at` - 创建时间
- `year` - 年份
- `week` - 周次
- `date` - 日期
- `replicate_id` - 样本编号（1-30）

#### 采集指标（20个）

**生长指标**
- `growth_cm` - 生长量
- `stem_mm` - 茎粗
- `leaf_count` - 叶片数
- `leaf_length_cm` - 叶长
- `leaf_width_cm` - 叶宽

**开花坐果指标**
- `potential_flower_count` - 潜在花序数
- `current_flower_order` - 当前开花序位
- `accum_ear_count` - 累计坐果数
- `new_grain_count` - 本周单头新增坐果数

**产量指标**
- `weekly_yield_kg` - 本周产量
- `single_grain_g` - 单果重
- `new_harvest_grain_count` - 本周采收果粒数
- `ear_weight_g` - 单穗重

**品质指标**
- `brix` - 可溶性固形物
- `acidity` - 酸度
- `cracking_rate` - 裂果率

**环境管理指标**
- `irrigation_ml` - 灌溉量
- `reflux_ml` - 回液量
- `reflux_ec` - 回液EC
- `reflux_ph` - 回液pH
- `dripper_count` - 滴箭个数

### 约束
- 唯一约束：`(user_id, year, week, replicate_id)`
- 每个用户、每周、每个样本只能有一条记录

### RLS策略
- 用户只能访问和修改自己的数据

---

## 表2: weekly_statistics (统计指标表)

### 用途
存储基于所有样本计算的统计指标。

### 数据结构
- **每行** = 1周的统计数据
- **每周** = 1行（基于30个样本计算）
- **每年** = 最多53行

### 主要字段

#### 系统字段
- `id` - 主键
- `user_id` - 用户ID（外键）
- `created_at` - 创建时间
- `updated_at` - 更新时间
- `year` - 年份
- `week` - 周次
- `date` - 日期

#### 统计指标

**累积统计**
- `accum_grain_count` - 单头累计坐果粒数
  - 计算方法：累加所有周的 `new_grain_count` 平均值
- `total_yield_kg` - 总产量
  - 计算方法：累加所有周的 `weekly_yield_kg` 平均值
- `total_harvest_ear_count` - 单头总采收果穗数
  - 计算方法：累加所有周的 `new_harvest_grain_count` 平均值
- `single_head_yield_g` - 单头产量
  - 计算方法：累加所有周的 `ear_weight_g` 平均值

**配置参数**
- `greenhouse_area_m2` - 温室面积
  - 来源：localStorage

**计算指标**
- `unit_yield` - 单位产量
  - 计算方法：`total_yield_kg / greenhouse_area_m2`
- `reflux_ratio` - 回液比例（%）
  - 计算方法：平均(`reflux_ml / (irrigation_ml * dripper_count)`) × 100

### 约束
- 唯一约束：`(user_id, year, week)`
- 每个用户、每周只能有一条统计记录

### RLS策略
- 用户只能访问和修改自己的数据

### 触发器
- `update_updated_at_column` - 自动更新 `updated_at` 字段

---

## 数据流程

### 1. 数据采集（collection.html）
```
用户输入 → phenotype_records 表
- 每个样本独立保存
- 20个采集指标
- 未采集的指标为 NULL
```

### 2. 统计计算（statistics.html）
```
phenotype_records → 计算 → weekly_statistics
- 读取本周所有30个样本数据
- 计算平均值
- 累加历史数据
- 保存到 weekly_statistics
```

### 3. 趋势分析（trends.html）
```
phenotype_records → 图表
- 读取采集数据（按周分组）
- 计算每周平均值
- 生成趋势图
```

---

## 数据计算示例

### 单头累计坐果粒数
```
Week 1: 30个样本的 new_grain_count 平均值 = 5
Week 2: 30个样本的 new_grain_count 平均值 = 3
Week 3: 30个样本的 new_grain_count 平均值 = 4

accum_grain_count (Week 3) = 5 + 3 + 4 = 12
```

### 单位产量
```
total_yield_kg = 100 kg (累加所有周)
greenhouse_area_m2 = 50 m²

unit_yield = 100 / 50 = 2 kg/m²
```

### 回液比例
```
样本1: reflux_ml=500, irrigation_ml=1000, dripper_count=10
      ratio = 500 / (1000 * 10) * 100 = 5%

样本2: reflux_ml=600, irrigation_ml=1200, dripper_count=10
      ratio = 600 / (1200 * 10) * 100 = 5%

平均 reflux_ratio = (5 + 5) / 2 = 5%
```

---

## 迁移步骤

### 1. 创建新表
在 Supabase SQL Editor 中运行 `supabase_schema.sql`

### 2. 数据迁移（如果有旧数据）
```sql
-- 如果之前的表中有统计指标字段，需要清理
-- 新系统中，统计指标不再存储在 phenotype_records 中
```

### 3. 初始化统计数据
- 访问 statistics.html 页面
- 系统会自动计算并保存本周统计数据

---

## 优势

### 分离存储
- **采集数据**：原始、详细、不变
- **统计数据**：计算、汇总、可重算

### 性能优化
- 统计数据预计算，查询更快
- 趋势分析直接读取原始数据，更灵活

### 数据一致性
- 统计数据可以随时重新计算
- 历史数据累积更准确

### 可扩展性
- 添加新的统计指标不影响采集表
- 可以添加更多时间维度的统计（月、季度、年）

