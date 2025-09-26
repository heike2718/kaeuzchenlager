// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import java.sql.SQLException;
import java.util.Optional;

/** Packt die Exception vom gegebenen Typ aus. */
public final class ExceptionUtil {

  private ExceptionUtil() {}

  /**
   * Packt die Exception des gegebenen Typs aus.
   *
   * @param <T> the type parameter
   * @param throwable Throwable
   * @param type Type
   * @return Optional
   */
  public static <T extends Throwable> Optional<T> unwrap(
      final Throwable throwable, final Class<T> type) {
    Throwable cur = throwable;
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
   *
   * @param throwable the throwable
   * @return the optional
   */
  public static Optional<SQLException> unwrapSqlException(final Throwable throwable) {
    Throwable cur = throwable;
    while (cur != null) {
      if (cur instanceof SQLException sqlException) {
        return Optional.of(sqlException);
      }
      cur = cur.getCause();
    }
    return Optional.empty();
  }
}
