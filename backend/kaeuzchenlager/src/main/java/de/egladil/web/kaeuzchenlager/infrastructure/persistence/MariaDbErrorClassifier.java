// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.persistence;

import java.sql.SQLException;
import java.util.Optional;

import de.egladil.web.kaeuzchenlager.infrastructure.error.ExceptionUtil;

/** The type Maria db error classifier. */
public final class MariaDbErrorClassifier {

    public static final String ERROR_CODE_23000 = "23000";
    public static final String ERROR_CODE_42000 = "42000";
    public static final String ERROR_CODE_22001 = "22001";
    public static final String ERROR_CODE_22003 = "22003";
    public static final String ERROR_CODE_40001 = "40001";

    private MariaDbErrorClassifier() {
    }

    /**
     * Klassifiziert die gegenene Throwable, falls es sich um eine SQLException
     * handelt.
     *
     * @param throwable Throwable
     * @return SqlErrorType
     */
    public static SqlErrorType classify(final Throwable throwable) {

        final Optional<SQLException> opt = ExceptionUtil.unwrapSqlException(throwable);

        if (opt.isEmpty()) {
            return SqlErrorType.NOT_AN_SQL_EXCEPTION;
        }

        final SQLException sql = opt.get();
        final int code = sql.getErrorCode();
        final String state = sql.getSQLState(); // z. B. "23000", "22001", "40001", "HY000"

        // Feingranular nach MariaDB/MySQL-Errorcode
        switch (code) {
        case 1062:
            return SqlErrorType.UNIQUE_VIOLATION;
        case 1451: // Cannot delete or update parent row: a foreign key constraint fails
        case 1452: // Cannot add or update a child row: a foreign key constraint fails
            return SqlErrorType.FK_VIOLATION;
        case 1048:
            return SqlErrorType.NOT_NULL_VIOLATION;
        case 1406:
            return SqlErrorType.DATA_TOO_LONG;
        case 1264:
            return SqlErrorType.NUMERIC_OUT_OF_RANGE;
        case 1213:
            return SqlErrorType.DEADLOCK;
        case 1205:
            return SqlErrorType.LOCK_TIMEOUT;
        case 1142:
            return SqlErrorType.PERMISSION_DENIED;
        default:
            // Fallback über SQLSTATE-Klassen
            if (ERROR_CODE_23000.equals(state)) {
                return SqlErrorType.CONSTRAINT_VIOLATION;
            }
            if (ERROR_CODE_42000.equals(state)) {
                return SqlErrorType.SYNTAX_ERROR;
            }
            // Weitere sinnvolle States:
            // 22001 = String data right truncation -> DATA_TOO_LONG
            if (ERROR_CODE_22001.equals(state)) {
                return SqlErrorType.DATA_TOO_LONG;
            }
            if (ERROR_CODE_22003.equals(state)) {
                return SqlErrorType.NUMERIC_OUT_OF_RANGE;
            }
            if (ERROR_CODE_40001.equals(state)) {
                return SqlErrorType.DEADLOCK; // Serialization failure
            }
            return SqlErrorType.UNKNOWN_SQL_EXCEPTION;
        }
    }
}
