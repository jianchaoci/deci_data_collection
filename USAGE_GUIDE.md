# 双表方案使用指南

## 数据库结构

### 表1: phenotype_records (采集数据表)
- **用途**: 存储每个样本的原始采集数据
- **数据结构**: 30个样本/周 = 30行/周
- **字段**: 20个采集指标（生长、开花、产量、品质、环境管理）

### 表2: weekly_statistics (统计指标表)
- **用途**: 存储每周的统计指标（基于30个样本计算）
- **数据结构**: 1周 = 1行
- **字段**: 累积统计、配置参数、计算指标

---

## 部署步骤

### 1. 创建数据库表
在 Supabase SQL Editor 中运行：

```sql
-- 运行 supabase_schema.sql
-- 这将创建：
-- - phenotype_records 表
-- - weekly_statistics 表
-- - 索引
-- - RLS 策略
-- - 触发器
```

### 2. 验证表创建成功
检查 Supabase Table Editor：
- ✅ `phenotype_records` 表存在
- ✅ `weekly_statistics` 表存在
- ✅ 两个表都启用了 RLS

---

## 使用流程

### 数据采集（collection.html）

```
用户输入数据
    ↓
保存到 phenotype_records 表
    ↓
每个样本一行，包含20个采集指标
```

**特点**：
- 实时保存，即时生效
- 未采集的指标为 `NULL`
- 支持切换样本时验证完整性

---

### 查看统计（statistics.html）

```
用户访问统计页面
    ↓
自动触发统计计算
    ↓
从 phenotype_records 读取本周所有样本数据
    ↓
计算平均值 + 累加历史数据
    ↓
保存/更新到 weekly_statistics 表
    ↓
显示统计指标
```

**计算逻辑**：

1. **本周平均值**
   - 读取本周30个样本的数据
   - 计算每个指标的平均值

2. **历史累积**
   - 读取历史周次的统计数据
   - 累加到本周平均值

3. **示例：单头累计坐果粒数**
   ```
   Week 1: 平均 5 粒/头
   Week 2: 平均 3 粒/头
   Week 3: 平均 4 粒/头
   
   Week 3 的累计 = 5 + 3 + 4 = 12 粒/头
   ```

**特点**：
- 每次访问页面自动更新
- 确保统计数据总是最新的
- 支持修改历史数据后重新计算

---

### 趋势分析（trends.html）

#### 采集指标趋势
```
用户选择采集指标（如"生长量"）
    ↓
从 phenotype_records 表读取历史数据
    ↓
按周分组计算平均值
    ↓
绘制趋势图
```

#### 统计指标趋势（可扩展）
```
用户选择统计指标（如"单头累计坐果数"）
    ↓
从 weekly_statistics 表读取历史数据
    ↓
直接绘制趋势图（无需聚合）
```

**优势**：
- 采集指标：灵活查询原始数据
- 统计指标：快速显示预计算结果
- 支持任意时间范围

---

## 数据关系图

```
phenotype_records (采集数据)
┌─────────────────────────────────┐
│ Week 1, Rep 1: growth=10, ...   │
│ Week 1, Rep 2: growth=12, ...   │
│ ...                              │
│ Week 1, Rep 30: growth=11, ...  │  ─┐
└─────────────────────────────────┘   │
                                       │ 计算平均值
┌─────────────────────────────────┐   │
│ Week 2, Rep 1: growth=15, ...   │   │
│ Week 2, Rep 2: growth=13, ...   │   │
│ ...                              │   │
│ Week 2, Rep 30: growth=14, ...  │  ─┤
└─────────────────────────────────┘   │
                                       ↓
weekly_statistics (统计数据)
┌─────────────────────────────────┐
│ Week 1: avg_growth=11           │
│         accum_grain=5           │
│         total_yield=0.5         │
├─────────────────────────────────┤
│ Week 2: avg_growth=14           │
│         accum_grain=8 (5+3)     │
│         total_yield=1.2 (累加)  │
└─────────────────────────────────┘
```

---

## 各页面功能对比

| 页面 | 使用表 | 数据类型 | 数据量 | 性能 |
|------|--------|----------|--------|------|
| collection.html | phenotype_records | 原始采集 | 30行/周 | 快 ⚡ |
| statistics.html | 两个表都用 | 统计汇总 | 1行/周 | 中 📊 |
| trends.html | phenotype_records | 原始采集 | 所有历史 | 快 📈 |

---

## 统计指标列表

从 `weekly_statistics` 表中可以获取：

### 累积统计（自动累加）
- **单头累计坐果粒数** (`accum_grain_count`)
  - 累加所有周的 `new_grain_count` 平均值
  
- **总产量** (`total_yield_kg`)
  - 累加所有周的 `weekly_yield_kg` 平均值
  
- **单头总采收果穗数** (`total_harvest_ear_count`)
  - 累加所有周的 `new_harvest_grain_count` 平均值
  
- **单头产量** (`single_head_yield_g`)
  - 累加所有周的 `ear_weight_g` 平均值

### 配置参数（手动设置）
- **温室面积** (`greenhouse_area_m2`)
  - 从 localStorage 读取并保存

### 计算指标（自动计算）
- **单位产量** (`unit_yield`)
  - 公式: `总产量 / 温室面积`
  
- **回液比例** (`reflux_ratio`)
  - 公式: 平均(`回液量 / (灌溉量 × 滴箭个数)`) × 100

---

## 维护与优化

### 数据一致性
✅ **自动保持一致**
- 每次访问统计页面会重新计算
- 修改历史采集数据后，统计会自动更新

### 性能优化
✅ **已优化**
- 索引: `(user_id, year, week)`
- RLS: 用户只能访问自己的数据
- 触发器: 自动更新 `updated_at`

### 数据修正
如果需要重新计算所有历史统计数据：

```sql
-- 清空统计表
DELETE FROM weekly_statistics WHERE user_id = 'your_user_id';

-- 然后访问 statistics.html 页面
-- 系统会自动重新计算本周统计
```

---

## 扩展功能建议

### 1. 在趋势页面显示统计指标
修改 `trends.html`，添加从 `weekly_statistics` 读取统计指标的逻辑：

```javascript
// 如果是统计指标
if (indicator.isStatistic) {
  const { data } = await supabase
    .from('weekly_statistics')
    .select('year, week, ' + indicator.field)
    .eq('user_id', currentUser.id)
    .eq('year', currentChartYear);
  // 绘制趋势图
}
```

### 2. 导出统计报表
添加导出功能，包含两类数据：
- 原始采集数据（从 `phenotype_records`）
- 统计汇总数据（从 `weekly_statistics`）

### 3. 多时间维度统计
扩展 `weekly_statistics` 表的概念：
- `monthly_statistics` - 月度统计
- `yearly_statistics` - 年度统计

---

## 常见问题

### Q: 统计数据不准确怎么办？
A: 访问 statistics.html 页面，系统会自动重新计算并更新。

### Q: 修改了历史采集数据，统计会更新吗？
A: 会。下次访问 statistics.html 时，系统会重新计算。

### Q: 可以手动触发统计计算吗？
A: 可以在 statistics.html 添加"刷新统计"按钮，调用 `calculateAndSaveWeeklyStatistics()` 函数。

### Q: 统计指标可以在趋势页面显示吗？
A: 可以！修改 `trends.html`，从 `weekly_statistics` 表读取统计指标，直接绘制趋势图。

---

## 总结

双表方案的优势：
- ✅ **采集数据** 和 **统计数据** 分离
- ✅ 统计指标预计算，查询更快
- ✅ 可以查看统计指标的历史趋势
- ✅ 配置参数（温室面积）有历史记录
- ✅ 数据结构清晰，易于理解

适用场景：
- ✅ 需要显示统计指标的趋势图
- ✅ 需要保存配置参数的历史
- ✅ 需要快速查询历史统计数据
- ✅ 数据量适中（< 100,000 行）

现在可以开始使用了！🎉

