// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.persistence;

import java.sql.SQLException;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import io.quarkus.test.junit.QuarkusTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
class MariaDbErrorClassifierParamTest {

    // (1) Vendor-ErrorCodes + SQLSTATE (typische MariaDB/MySQL-Fälle)
    @ParameterizedTest(name = "{index} => code={0}, state={1} => {2}")
    @MethodSource("mariaDbErrorCases")
    void classifyByErrorCodeAndState(int errorCode, String sqlState, SqlErrorType expected) {
        var ex = new SQLException("Test", sqlState, errorCode);
        assertEquals(expected, MariaDbErrorClassifier.classify(ex));
    }

    static Stream<Arguments> mariaDbErrorCases() {
        return Stream
                .of(Arguments.of(1062, "23000", SqlErrorType.UNIQUE_VIOLATION), // Duplicate entry
                        Arguments.of(1451, "23000", SqlErrorType.FK_VIOLATION), // FK delete/update fails
                        Arguments.of(1452, "23000", SqlErrorType.FK_VIOLATION), // FK insert/update fails
                        Arguments.of(1048, "23000", SqlErrorType.NOT_NULL_VIOLATION), // Column cannot be null
                        Arguments.of(1406, "22001", SqlErrorType.DATA_TOO_LONG), // Data too long
                        Arguments.of(1264, "22003", SqlErrorType.NUMERIC_OUT_OF_RANGE), // Out of range
                        Arguments.of(1213, "40001", SqlErrorType.DEADLOCK), // Deadlock
                        Arguments.of(1205, "HY000", SqlErrorType.LOCK_TIMEOUT), // Lock wait timeout
                        Arguments.of(1142, "42000", SqlErrorType.PERMISSION_DENIED), // Command denied
                        Arguments.of(9999, "23000", SqlErrorType.CONSTRAINT_VIOLATION), // generisch: Constraint
                                                                                        // verletzt
                        Arguments.of(9998, "42000", SqlErrorType.SYNTAX_ERROR) // generisch: Syntax/Access
                );
        // Hinweis: 9999/9998 dienen als Platzhalter für "unbekannte" Vendor-Codes.
    }

    // (2) Reine SQLSTATE-Fälle ohne Vendor-Code (Portabilität)
    @ParameterizedTest(name = "{index} => state={0} => {1}")
    @MethodSource("sqlStateOnlyCases")
    void classifyBySqlStateOnly(String sqlState, SqlErrorType expected) {
        var ex = new SQLException("Test", sqlState); // kein vendor code
        assertEquals(expected, MariaDbErrorClassifier.classify(ex));
    }

    static Stream<Arguments> sqlStateOnlyCases() {
        return Stream
                .of(Arguments.of("23000", SqlErrorType.CONSTRAINT_VIOLATION),
                        Arguments.of("22001", SqlErrorType.DATA_TOO_LONG),
                        Arguments.of("22003", SqlErrorType.NUMERIC_OUT_OF_RANGE),
                        Arguments.of("40001", SqlErrorType.DEADLOCK), Arguments.of("42000", SqlErrorType.SYNTAX_ERROR));
    }

    // (3) Unwrapping: erste gefundene SQLException in der Cause-Kette zählt
    @Test
    void unwrapPrefersFirstSqlExceptionInChain() {
        SQLException deep = new SQLException("Duplicate entry", "23000", 1062);
        SQLException first = new SQLException("Data too long", "22001", 1406, deep);

        RuntimeException wrapped = new RuntimeException(new RuntimeException(first));
        assertEquals(SqlErrorType.DATA_TOO_LONG, MariaDbErrorClassifier.classify(wrapped));
    }
}
