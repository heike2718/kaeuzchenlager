-- V1.0.0__Initial_schema.sql
DROP TABLE IF EXISTS gefaesstypen;

CREATE TABLE IF NOT EXISTS gefaesstypen (
  uuid CHAR(36) NOT NULL,
  name VARCHAR(100) COLLATE utf8mb4_german2_ci NOT NULL,
  volumen INT UNSIGNED NOT NULL COMMENT 'Fassungsvermögen des Gefäßtyps im ml',
  anzahl INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Anzahl noch vorhandener Gefäße dieses Typs',
  background_color CHAR(7) NOT NULL DEFAULT '#ffffff' COMMENT 'hexadezimaler Farbcode',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by CHAR(36) NOT NULL COMMENT 'uuid des users, der den Datensatz angelegt hat',
  updated_by CHAR(36) COMMENT 'uuid des users, der den Datensatz geändert hat',
  version INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (uuid),
  UNIQUE KEY uk_gefaesstypen_name (name),
  UNIQUE KEY uk_gefaesstypen_volumen (volumen)
) ENGINE=InnoDB;


