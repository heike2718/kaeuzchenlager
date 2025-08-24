//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import java.sql.SQLException;
import java.util.Optional;

/**
 * Packt die Exception vom gegebenen Typ aus
 */
public final class ExceptionUtil {

    private ExceptionUtil() {}

    /**
     * Packt die Exception des gegebenen Typs aus.
     * @param t Throwable
     * @param type Type
     * @return Optional
     * @param <T>
     */
    public static <T extends Throwable> Optional<T> unwrap(Throwable t, Class<T> type) {
        Throwable cur = t;
        while (cur != null) {
            if (type.isInstance(cur)) {
                return Optional.of(type.cast(cur));
            }
            cur = cur.getCause();
        }
        return Optional.empty();
    }

    /**
     * Packt die SQLException aus, wenn sie gefunden wird.
     * @param t
     * @return
     */
    public static Optional<SQLException> unwrapSqlException(Throwable t) {
        Throwable cur = t;
        while (cur != null) {
            if (cur instanceof SQLException se) {
                return Optional.of(se);
            };
            cur = cur.getCause();
        }
        return Optional.empty();
    }
}
