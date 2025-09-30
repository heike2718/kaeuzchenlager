-- V1.0.0__Initial_schema.sql
CREATE TABLE IF NOT EXISTS users (
    uuid CHAR(36) NOT NULL PRIMARY KEY,
    admin tinyint(1) NOT NULL COMMENT 'Flag, ob admin oder normaler user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gefaesstypen (
  uuid CHAR(36) NOT NULL,
  name VARCHAR(100) COLLATE utf8mb4_german2_ci NOT NULL,
  anzahl INT UNSIGNED NOT NULL DEFAULT 0,
  background_color CHAR(7) NOT NULL DEFAULT '#ffffff' COMMENT 'hexadezimaler Farbcode',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by CHAR(36) NOT NULL COMMENT 'uuid des users, der den Datensatz angelegt hat',
  updated_by CHAR(36) NOT NULL COMMENT 'uuid des users, der den Datensatz geändert hat',
  version INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (uuid),
  UNIQUE KEY uk_gefaesstypen_name (name)
) ENGINE=InnoDB;


