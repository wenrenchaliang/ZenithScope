CREATE DATABASE IF NOT EXISTS zenithscope
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE zenithscope;

CREATE TABLE IF NOT EXISTS hosts (
  hostid VARCHAR(32) PRIMARY KEY,
  hostname VARCHAR(128) NOT NULL,
  owner VARCHAR(64) NOT NULL,
  model VARCHAR(64) NOT NULL,
  location1 VARCHAR(64) NOT NULL,
  location2 VARCHAR(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS metric_defs (
  metric_mod VARCHAR(64) PRIMARY KEY,
  metric_type VARCHAR(16) NOT NULL,
  description VARCHAR(255) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  tag VARCHAR(64) NOT NULL,
  KEY idx_metric_defs_type_tag (metric_type, tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS tsar_metrics (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ts_ms BIGINT NOT NULL,
  collected_at DATETIME NOT NULL COMMENT 'UTC+8 China local time',
  collected_date DATE NOT NULL,
  collected_year SMALLINT NOT NULL,
  collected_month TINYINT NOT NULL,
  collected_day TINYINT NOT NULL,
  hostid VARCHAR(32) NOT NULL,
  metric_type VARCHAR(16) NOT NULL,
  metric_mod VARCHAR(64) NOT NULL,
  value DECIMAL(18, 4) NOT NULL,
  tag VARCHAR(64) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_tsar_date_type_mod (collected_date, metric_type, metric_mod),
  KEY idx_tsar_host_time (hostid, collected_at),
  KEY idx_tsar_tag_date (tag, collected_date),
  KEY idx_tsar_time (collected_at),
  CONSTRAINT fk_tsar_host FOREIGN KEY (hostid) REFERENCES hosts (hostid),
  CONSTRAINT fk_tsar_metric_def FOREIGN KEY (metric_mod) REFERENCES metric_defs (metric_mod)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS daily_metric_summary (
  collected_date DATE NOT NULL,
  collected_year SMALLINT NOT NULL,
  collected_month TINYINT NOT NULL,
  collected_day TINYINT NOT NULL,
  hostid VARCHAR(32) NOT NULL,
  metric_type VARCHAR(16) NOT NULL,
  metric_mod VARCHAR(64) NOT NULL,
  tag VARCHAR(64) NOT NULL,
  avg_value DECIMAL(18, 4) NOT NULL,
  max_value DECIMAL(18, 4) NOT NULL,
  sample_count INT NOT NULL,
  PRIMARY KEY (collected_date, hostid, metric_type, metric_mod),
  KEY idx_daily_metric_date_mod (collected_date, metric_mod),
  KEY idx_daily_tag_date (tag, collected_date),
  CONSTRAINT fk_daily_host FOREIGN KEY (hostid) REFERENCES hosts (hostid),
  CONSTRAINT fk_daily_metric_def FOREIGN KEY (metric_mod) REFERENCES metric_defs (metric_mod)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
