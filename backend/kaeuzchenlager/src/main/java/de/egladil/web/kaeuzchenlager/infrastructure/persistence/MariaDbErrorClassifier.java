//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.persistence;

import de.egladil.web.kaeuzchenlager.infrastructure.error.ExceptionUtil;

import java.sql.SQLException;
import java.util.Optional;

public final class MariaDbErrorClassifier {

    private MariaDbErrorClassifier() {
    }

    /**
     * Klassifiziert die gegenene Throwable, falls es sich um eine SQLException handelt.
     * @param t Throwable
     * @return SQLErrorType
     */
    public static SQLErrorType classify(Throwable t) {

        Optional<SQLException> opt = ExceptionUtil.unwrapSqlException(t);

        if (opt.isEmpty()) {
            return SQLErrorType.NOT_AN_SQL_EXCEPTION;
        };

        SQLException sql = opt.get();
        final int code = sql.getErrorCode();
        final String state = sql.getSQLState(); // z. B. "23000", "22001", "40001", "HY000"

        // Feingranular nach MariaDB/MySQL-Errorcode
        switch (code) {
            case 1062: return SQLErrorType.UNIQUE_VIOLATION;
            case 1451: // Cannot delete or update parent row: a foreign key constraint fails
            case 1452: // Cannot add or update a child row: a foreign key constraint fails
                return SQLErrorType.FK_VIOLATION;
            case 1048: return SQLErrorType.NOT_NULL_VIOLATION;
            case 1406: return SQLErrorType.DATA_TOO_LONG;
            case 1264: return SQLErrorType.NUMERIC_OUT_OF_RANGE;
            case 1213: return SQLErrorType.DEADLOCK;
            case 1205: return SQLErrorType.LOCK_TIMEOUT;
            case 1142: return SQLErrorType.PERMISSION_DENIED;
            default:
                // Fallback über SQLSTATE-Klassen
                if ("23000".equals(state)) return SQLErrorType.CONSTRAINT_VIOLATION;
                if ("42000".equals(state)) return SQLErrorType.SYNTAX_ERROR;
                // Weitere sinnvolle States:
                // 22001 = String data right truncation -> DATA_TOO_LONG
                if ("22001".equals(state)) return SQLErrorType.DATA_TOO_LONG;
                if ("22003".equals(state)) return SQLErrorType.NUMERIC_OUT_OF_RANGE;
                if ("40001".equals(state)) return SQLErrorType.DEADLOCK; // Serialization failure
                return SQLErrorType.UNKNOWN_SQL_EXCEPTION;
        }
    }
}
