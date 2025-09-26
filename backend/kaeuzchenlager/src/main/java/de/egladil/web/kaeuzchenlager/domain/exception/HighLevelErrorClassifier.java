// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

import de.egladil.web.kaeuzchenlager.infrastructure.error.ExceptionUtil;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.MariaDbErrorClassifier;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.SqlErrorType;
import jakarta.persistence.OptimisticLockException;
import java.sql.SQLException;
import java.util.Optional;
import org.hibernate.exception.ConstraintViolationException;

/** The type High level error classifier. */
public final class HighLevelErrorClassifier {

  /**
   * Klassifiziert die gegebene Exception, um die, bei denen der Aufrufer sinnvolle Aktionen machen
   * kann, von denen trennen zu können, die weitergewirfen werden müssen.
   *
   * @param throwable Throwable
   * @return ErrorType
   */
  public static ErrorClassification classify(final Throwable throwable) {

    final Optional<OptimisticLockException> optLockException =
        ExceptionUtil.unwrap(throwable, OptimisticLockException.class);
    if (optLockException.isPresent()) {
      return ErrorClassification.builder()
          .errorType(ErrorType.VERSION_CONFLICT)
          .errorMessage(optLockException.get().getMessage())
          .build();
    }

    final Optional<ConstraintViolationException> optCve =
        ExceptionUtil.unwrap(throwable, ConstraintViolationException.class);
    if (optCve.isPresent()) {
      final ConstraintViolationException cve = optCve.get();
      return ErrorClassification.builder()
          .errorType(ErrorType.UNIQUE_CONSTRAINT)
          .uniqueConstraintName(cve.getConstraintName())
          .errorMessage(cve.getErrorMessage())
          .build();
    }

    final Optional<SQLException> optSqlException =
        ExceptionUtil.unwrap(throwable, SQLException.class);

    if (optSqlException.isEmpty()) {
      return ErrorClassification.builder()
          .errorType(ErrorType.TECHNICAL)
          .errorMessage(throwable.getMessage())
          .build();
    }

    final SQLException sqlException = optSqlException.get();
    final SqlErrorType sqlErrorType = MariaDbErrorClassifier.classify(sqlException);

    return SqlErrorType.UNIQUE_VIOLATION == sqlErrorType
        ? ErrorClassification.builder()
            .errorType(ErrorType.UNIQUE_CONSTRAINT)
            .uniqueConstraintName("nicht feststellbar")
            .errorMessage(sqlException.getMessage())
            .build()
        : ErrorClassification.builder()
            .errorType(ErrorType.TECHNICAL)
            .errorMessage(sqlException.getMessage())
            .build();
  }
}
