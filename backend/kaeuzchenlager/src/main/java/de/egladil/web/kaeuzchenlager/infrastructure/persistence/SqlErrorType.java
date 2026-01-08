// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.persistence;

/**
 * SqlErrorType für das Mapping von MariaDB-SQL-Error-codes in etwas
 * Sprechendes.
 */
public enum SqlErrorType {
    /** Unique violation sql error type. */
    UNIQUE_VIOLATION, // 1062
    /** Fk violation sql error type. */
    FK_VIOLATION, // 1451/1452
    /** Not null violation sql error type. */
    NOT_NULL_VIOLATION, // 1048
    /** Data too long sql error type. */
    DATA_TOO_LONG, // 1406
    /** Numeric out of range sql error type. */
    NUMERIC_OUT_OF_RANGE, // 1264
    /** Deadlock sql error type. */
    DEADLOCK, // 1213
    /** Lock timeout sql error type. */
    LOCK_TIMEOUT, // 1205
    /** Permission denied sql error type. */
    PERMISSION_DENIED, // 1142
    /** Constraint violation sql error type. */
    CONSTRAINT_VIOLATION, // SQLSTATE 23000, aber kein feiner Code erkannt
    /** Syntax error sql error type. */
    SYNTAX_ERROR, // 42000 o. ä.
    /** Not an sql exception sql error type. */
    NOT_AN_SQL_EXCEPTION,
    /** Unknown sql exception sql error type. */
    UNKNOWN_SQL_EXCEPTION;
}
