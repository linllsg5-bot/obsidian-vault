-- 知识图谱 SQLite 数据库结构
-- 版本: 1.0
-- 创建时间: 2026-03-02

-- 1. 学科/分类表
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,                    -- 分类名称（如"数学"、"Python编程"）
    description TEXT,                      -- 分类描述
    parent_id INTEGER DEFAULT NULL,        -- 父分类ID（NULL表示顶层）
    path TEXT,                             -- 层级路径（如 "1/3/5"）
    sort_order INTEGER DEFAULT 0,          -- 同一层级中的排序
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 知识点表
CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,                   -- 知识点标题
    content TEXT,                         -- 详细内容
    summary TEXT,                         -- 简短摘要（用于卡片显示）
    subject_id INTEGER NOT NULL,          -- 所属分类ID
    parent_topic_id INTEGER DEFAULT NULL, -- 父知识点ID（允许嵌套）
    difficulty_level INTEGER DEFAULT 1,   -- 难度级别（1-5）
    estimated_minutes INTEGER DEFAULT 10, -- 预计学习分钟数
    source_type TEXT DEFAULT 'ai_generated', -- 来源类型: 'ai_generated', 'official_doc', 'wikipedia', 'manual', 'user_contributed'
    source_url TEXT,                      -- 原始来源URL
    reliability_score FLOAT DEFAULT 0.8,  -- 可靠性评分（0.0-1.0）
    verified BOOLEAN DEFAULT FALSE,       -- 是否经过人工验证
    tags_json TEXT DEFAULT '[]',          -- 标签数组（JSON格式）
    metadata_json TEXT DEFAULT '{}',      -- 扩展元数据（JSON格式）
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_topic_id) REFERENCES topics(id) ON DELETE SET NULL
);

-- 3. 知识点关联表
CREATE TABLE IF NOT EXISTS relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_topic_id INTEGER NOT NULL,     -- 来源知识点ID
    target_topic_id INTEGER NOT NULL,     -- 目标知识点ID
    relationship_type TEXT DEFAULT 'related', -- 关联类型: 'prerequisite'(先修), 'see_also'(参见), 'part_of'(属于), 'contrast'(对比), 'deepens'(深化)
    strength INTEGER DEFAULT 1,           -- 关联强度（1-10）
    description TEXT,                     -- 关联描述
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    FOREIGN KEY (target_topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE(source_topic_id, target_topic_id, relationship_type)
);

-- 4. 内容历史表（可选，用于版本控制）
CREATE TABLE IF NOT EXISTS content_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER NOT NULL,            -- 知识点ID
    content TEXT,                         -- 历史内容
    version INTEGER NOT NULL,             -- 版本号
    change_reason TEXT,                   -- 变更原因
    author TEXT DEFAULT 'system',         -- 修改者
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 5. 学习记录表（个人使用扩展）
CREATE TABLE IF NOT EXISTS learning_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'default_user',  -- 用户ID（个人版固定）
    topic_id INTEGER NOT NULL,            -- 学习的知识点ID
    status TEXT DEFAULT 'viewed',         -- 状态: 'viewed', 'mastered', 'review_needed'
    time_spent_seconds INTEGER DEFAULT 0, -- 学习时长（秒）
    confidence_score INTEGER DEFAULT 5,   -- 自信程度（1-10）
    notes TEXT,                           -- 个人笔记
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE(user_id, topic_id)
);

-- 索引优化
CREATE INDEX idx_subjects_parent ON subjects(parent_id);
CREATE INDEX idx_subjects_path ON subjects(path);
CREATE INDEX idx_subjects_created ON subjects(created_at);

CREATE INDEX idx_topics_subject ON topics(subject_id);
CREATE INDEX idx_topics_parent ON topics(parent_topic_id);
CREATE INDEX idx_topics_difficulty ON topics(difficulty_level);
CREATE INDEX idx_topics_reliability ON topics(reliability_score);
CREATE INDEX idx_topics_verified ON topics(verified) WHERE verified = TRUE;
CREATE INDEX idx_topics_created ON topics(created_at);

CREATE INDEX idx_relationships_source ON relationships(source_topic_id);
CREATE INDEX idx_relationships_target ON relationships(target_topic_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);

CREATE INDEX idx_learning_user_topic ON learning_records(user_id, topic_id);
CREATE INDEX idx_learning_status ON learning_records(status);

-- 触发器：更新时间戳
CREATE TRIGGER IF NOT EXISTS update_subjects_timestamp 
AFTER UPDATE ON subjects
BEGIN
    UPDATE subjects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_topics_timestamp 
AFTER UPDATE ON topics
BEGIN
    UPDATE topics SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_learning_records_timestamp 
AFTER UPDATE ON learning_records
BEGIN
    UPDATE learning_records SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- 创建初始数据
INSERT OR IGNORE INTO subjects (id, name, description, parent_id, path, sort_order) VALUES
(1, '数学', '数学基础知识与理论', NULL, '1', 1),
(2, '编程', '计算机编程与软件开发', NULL, '2', 2),
(3, '基础数学', '中小学数学基础', 1, '1/3', 1),
(4, '高等数学', '大学数学与进阶理论', 1, '1/4', 2),
(5, '离散数学', '计算机科学相关数学', 1, '1/5', 3),
(6, 'Python编程', 'Python语言与应用开发', 2, '2/6', 1),
(7, '算法与数据结构', '计算机科学核心', 2, '2/7', 2),
(8, 'Web开发', '前端与后端开发技术', 2, '2/8', 3),
(9, '机器学习', '人工智能与数据分析', 2, '2/9', 4);

-- 初始化示例知识点（数学基础）
INSERT OR IGNORE INTO topics (id, title, summary, subject_id, difficulty_level, source_type, reliability_score, verified) VALUES
(1, '自然数', '最基本的数学概念，包括0和正整数', 3, 1, 'manual', 0.95, TRUE),
(2, '整数运算', '加减乘除四则运算规则', 3, 1, 'manual', 0.95, TRUE),
(3, '有理数与无理数', '实数的分类与性质', 3, 2, 'manual', 0.9, TRUE),
(4, '函数概念', '数学函数的基本定义与性质', 4, 2, 'manual', 0.9, TRUE),
(5, '微积分基础', '极限、导数与积分的入门', 4, 3, 'manual', 0.85, FALSE),
(6, '集合论', '集合的基本运算与逻辑', 5, 2, 'manual', 0.9, TRUE);

-- 初始化示例知识点（编程）
INSERT OR IGNORE INTO topics (id, title, summary, subject_id, difficulty_level, source_type, reliability_score, verified) VALUES
(101, 'Python语法基础', '变量、数据类型、控制结构', 6, 1, 'official_doc', 0.98, TRUE),
(102, '函数定义与调用', '如何定义和使用函数', 6, 1, 'official_doc', 0.98, TRUE),
(103, '面向对象编程', '类、对象、继承与多态', 6, 2, 'official_doc', 0.95, TRUE),
(104, '算法复杂度分析', '时间复杂度与空间复杂度', 7, 2, 'manual', 0.9, TRUE),
(105, '数据结构：数组与链表', '基本线性数据结构', 7, 2, 'manual', 0.9, TRUE),
(106, 'HTML/CSS基础', '网页结构与样式', 8, 1, 'official_doc', 0.95, TRUE),
(107, 'JavaScript入门', '前端编程语言基础', 8, 1, 'official_doc', 0.95, TRUE),
(108, '监督学习概念', '分类与回归的基本思想', 9, 3, 'manual', 0.85, FALSE);

-- 初始化关联关系
INSERT OR IGNORE INTO relationships (source_topic_id, target_topic_id, relationship_type, strength, description) VALUES
-- 先修关系
(2, 1, 'prerequisite', 8, '整数运算需要先理解自然数'),
(3, 2, 'prerequisite', 6, '有理数建立在整数基础上'),
(5, 4, 'prerequisite', 9, '微积分需要函数概念为基础'),
-- 参见关系
(1, 2, 'see_also', 5, '自然数与整数运算密切相关'),
(4, 5, 'see_also', 7, '函数概念是微积分核心'),
-- 编程相关关系
(102, 101, 'prerequisite', 8, '使用函数需要先掌握基础语法'),
(103, 102, 'prerequisite', 7, '面向对象需要函数基础'),
(105, 104, 'see_also', 6, '数据结构实现与算法分析相关');