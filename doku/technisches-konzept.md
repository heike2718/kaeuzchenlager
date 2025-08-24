# technisches Konzept für Käuzchen

## Datenbank

```
-- Skript zur Erstellung der Datenbank 'kaeuzchen' für MariaDB
-- Ausführung: mysql -u root -p < create_kaeuzchen_database.sql

-- Datenbank erstellen (falls nicht vorhanden)
CREATE DATABASE IF NOT EXISTS kaeuzchen 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Dedizierten Datenbank-Benutzer erstellen
CREATE USER IF NOT EXISTS 'kaeuzchen'@'localhost' IDENTIFIED BY 'hwinkel';
CREATE USER IF NOT EXISTS 'kaeuzchen'@'%' IDENTIFIED BY 'hwinkel';

-- Berechtigungen für den Benutzer setzen
GRANT ALL PRIVILEGES ON kaeuzchen.* TO 'kaeuzchen'@'localhost';
GRANT ALL PRIVILEGES ON kaeuzchen.* TO 'kaeuzchen'@'%';
GRANT SELECT ON mysql.proc TO 'kaeuzchen'@'localhost';
GRANT SELECT ON mysql.proc TO 'kaeuzchen'@'%';

-- Berechtigungen aktivieren
FLUSH PRIVILEGES;

-- Zur Sicherheit ausgeben, welche Berechtigungen vergeben wurden
SHOW GRANTS FOR 'kaeuzchen'@'localhost';


Tabellen werden mit flyway durch starten der Quarkus-Anwendung angelegt.

