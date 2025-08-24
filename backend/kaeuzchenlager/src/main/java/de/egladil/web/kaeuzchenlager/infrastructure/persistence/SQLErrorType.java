//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.persistence;

/**
 * SQLErrorType für das Mapping von MariaDB-SQL-Error-codes in etwas Sprechendes.
 */
public enum SQLErrorType {

    UNIQUE_VIOLATION,        // 1062
    FK_VIOLATION,            // 1451/1452
    NOT_NULL_VIOLATION,      // 1048
    DATA_TOO_LONG,           // 1406
    NUMERIC_OUT_OF_RANGE,    // 1264
    DEADLOCK,                // 1213
    LOCK_TIMEOUT,            // 1205
    PERMISSION_DENIED,       // 1142
    CONSTRAINT_VIOLATION,    // SQLSTATE 23000, aber kein feiner Code erkannt
    SYNTAX_ERROR,            // 42000 o. ä.
    NOT_AN_SQL_EXCEPTION,
    UNKNOWN_SQL_EXCEPTION;
}
