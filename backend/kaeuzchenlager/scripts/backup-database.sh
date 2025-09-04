#!/bin/bash
# Database Backup Script für MariaDB
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./db-backups"
DB_NAME="kaeuzchen"
DB_USER="kaeuzchen"

# Backup erstellen
mysqldump -u $DB_USER -p $DB_NAME > $BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql

# Komprimieren
gzip $BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql

echo "Backup created: $BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql.gz"
