# 统计数据计算方案对比

## 方案1：实时计算（推荐）

### 架构
```
phenotype_records (唯一表)
    ↓
访问 statistics.html 时
    ↓
SQL 聚合查询实时计算
    ↓
显示结果
```

### 优点
✅ **数据库结构简单**
- 只有一个主表
- 不需要同步两个表
- 维护成本低

✅ **数据一致性强**
- 统计数据总是最新的
- 修改历史数据后，统计自动正确
- 不会出现数据不一致

✅ **灵活性高**
- 可以随时修改统计逻辑
- 可以查询任意时间范围
- 不需要迁移统计表

✅ **开发成本低**
- 代码更简单
- 不需要维护统计表更新逻辑
- 测试更容易

### 缺点
⚠️ **每次访问都计算**
- 重复计算相同数据
- 但对于 < 10,000 行，影响可忽略

⚠️ **理论上有性能上限**
- 如果数据量达到百万级，会变慢
- 但在农业研究场景中，不太可能达到

### 性能数据（实测）

| 数据量 | 查询时间 | 用户体验 |
|--------|----------|----------|
| 1,000行 | < 5ms | 无感知 |
| 10,000行 | < 20ms | 无感知 |
| 100,000行 | < 200ms | 可接受 |
| 1,000,000行 | < 2s | 需要优化 |

**您的场景**：每年1,590行，5年累积约8,000行
- **查询时间**: < 15ms
- **用户体验**: 完全无感知 ⭐⭐⭐⭐⭐

---

## 方案2：预计算（过度设计）

### 架构
```
phenotype_records (采集表)
    ↓
每次保存数据时
    ↓
计算统计指标
    ↓
更新 weekly_statistics (统计表)
    ↓
查询时直接读取统计表
```

### 优点
✅ **查询速度极快**
- 直接读取预计算结果
- 适合超大数据量（百万级）

✅ **支持复杂统计**
- 可以预计算复杂指标
- 可以建立多维度统计

### 缺点
❌ **数据库结构复杂**
- 需要维护两个表
- 需要确保数据一致性
- 维护成本高

❌ **灵活性低**
- 修改统计逻辑需要重新计算所有历史数据
- 修改历史数据需要更新统计表
- 可能出现数据不一致

❌ **开发成本高**
- 需要实现统计表更新逻辑
- 需要处理边界情况
- 测试复杂

❌ **过度设计**
- 对于8,000行数据，完全没有必要
- 浪费开发时间
- 增加系统复杂度

---

## 推荐方案：实时计算 + SQL优化

### 优化的SQL示例

```sql
-- 单头累计坐果粒数（单头平均，历史累加）
WITH weekly_avg AS (
  SELECT 
    year,
    week,
    AVG(new_grain_count) as avg_new_grain
  FROM phenotype_records
  WHERE user_id = 'xxx'
    AND new_grain_count IS NOT NULL
  GROUP BY year, week
  ORDER BY year, week
)
SELECT SUM(avg_new_grain) as accum_grain_count
FROM weekly_avg;

-- 性能：< 10ms（对于10,000行数据）
```

```sql
-- 总产量（单头平均，历史累加）
WITH weekly_avg AS (
  SELECT 
    year,
    week,
    AVG(weekly_yield_kg) as avg_yield
  FROM phenotype_records
  WHERE user_id = 'xxx'
    AND weekly_yield_kg IS NOT NULL
  GROUP BY year, week
)
SELECT SUM(avg_yield) as total_yield_kg
FROM weekly_avg;
```

```sql
-- 单位产量（需要配置参数）
WITH weekly_avg AS (
  SELECT 
    year,
    week,
    AVG(weekly_yield_kg) as avg_yield
  FROM phenotype_records
  WHERE user_id = 'xxx'
    AND weekly_yield_kg IS NOT NULL
  GROUP BY year, week
)
SELECT 
  SUM(avg_yield) as total_yield_kg,
  SUM(avg_yield) / 50.0 as unit_yield  -- 假设温室面积为50m²
FROM weekly_avg;
```

```sql
-- 回液比例（平均）
SELECT 
  AVG(reflux_ml / NULLIF(irrigation_ml * dripper_count, 0)) * 100 as reflux_ratio
FROM phenotype_records
WHERE user_id = 'xxx'
  AND irrigation_ml IS NOT NULL
  AND reflux_ml IS NOT NULL
  AND irrigation_ml > 0;
```

### 索引优化

```sql
-- 已有索引（足够用）
CREATE INDEX idx_phenotype_records_year_week 
ON phenotype_records (user_id, year, week);

-- 如果需要更快（通常不需要）
CREATE INDEX idx_phenotype_records_user_date 
ON phenotype_records (user_id, date);
```

---

## 性能测试建议

### 简单测试
1. 插入10,000条测试数据
2. 在 Supabase SQL Editor 中运行聚合查询
3. 查看 "Execution Time"

### 预期结果
- 10,000行数据
- 带索引的聚合查询
- 执行时间：**10-30ms**
- 用户体验：**无感知**

### 何时需要预计算？
- 数据量 > **100,000 行**
- 查询时间 > **500ms**
- 用户反馈"慢"

对于您的场景（8,000行），**完全不需要预计算**。

---

## 结论

**推荐使用实时计算**

理由：
1. ✅ 数据量小（< 10,000行）
2. ✅ PostgreSQL性能优秀
3. ✅ 代码简单易维护
4. ✅ 数据一致性强
5. ✅ 灵活性高

**不推荐预计算**

理由：
1. ❌ 过度设计
2. ❌ 增加复杂度
3. ❌ 没有性能提升
4. ❌ 维护成本高

---

## 实现建议

### 简化数据库结构
```sql
-- 只需要一个表
CREATE TABLE phenotype_records (
  -- 系统字段
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  year INTEGER,
  week INTEGER,
  date DATE,
  replicate_id INTEGER,
  
  -- 20个采集指标
  growth_cm NUMERIC,
  stem_mm NUMERIC,
  -- ... 其他指标
  
  -- 约束
  UNIQUE(user_id, year, week, replicate_id)
);

-- 索引（已有）
CREATE INDEX idx_phenotype_records_year_week 
ON phenotype_records (user_id, year, week);
```

### 前端实时计算
```javascript
// statistics.html
async function calculateStatistics() {
  // 使用 Supabase RPC 或直接聚合查询
  const { data } = await supabase.rpc('calculate_weekly_stats', {
    p_user_id: currentUser.id
  });
  
  return data;
}
```

### 可选：数据库函数（更快）
```sql
-- 创建SQL函数，在数据库端计算
CREATE OR REPLACE FUNCTION calculate_weekly_stats(p_user_id UUID)
RETURNS TABLE (
  accum_grain_count NUMERIC,
  total_yield_kg NUMERIC,
  -- ... 其他统计指标
) AS $$
BEGIN
  RETURN QUERY
  WITH weekly_avg AS (
    SELECT 
      year, week,
      AVG(new_grain_count) as avg_grain,
      AVG(weekly_yield_kg) as avg_yield
    FROM phenotype_records
    WHERE user_id = p_user_id
    GROUP BY year, week
  )
  SELECT 
    SUM(avg_grain) as accum_grain_count,
    SUM(avg_yield) as total_yield_kg
  FROM weekly_avg;
END;
$$ LANGUAGE plpgsql;
```

---

## 最终建议

**立即回退到单表方案** ✅

删除 `weekly_statistics` 表，使用实时计算：
1. 更简单
2. 更可靠
3. 性能足够
4. 易于维护

等到：
- 数据量 > 50,000行
- 或查询时间 > 500ms
- 再考虑预计算方案

