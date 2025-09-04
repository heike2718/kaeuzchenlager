#!/bin/bash
# Database Restore Script
BACKUP_FILE=$1
DB_NAME="kaeuzchen"
DB_USER="kaeuzchen"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    exit 1
fi

# Datenbank leeren und Backup wiederherstellen
gunzip -c $BACKUP_FILE | mysql -u $DB_USER -p $DB_NAME

echo "Database restored from: $BACKUP_FILE"
