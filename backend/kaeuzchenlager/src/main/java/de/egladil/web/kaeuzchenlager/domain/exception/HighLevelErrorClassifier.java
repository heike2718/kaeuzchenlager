//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

import de.egladil.web.kaeuzchenlager.infrastructure.error.ExceptionUtil;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.MariaDbErrorClassifier;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.SQLErrorType;
import jakarta.persistence.OptimisticLockException;
import org.hibernate.exception.ConstraintViolationException;

import java.sql.SQLException;
import java.util.Optional;

public final class HighLevelErrorClassifier {

    /**
     * Klassifiziert die gegebene Exception, um die, bei denen der Aufrufer sinnvolle Aktionen machen kann, von denen trennen zu können, die weitergewirfen werden müssen.
     *
     * @param t
     * @return ErrorType
     */
    public static ErrorClassification classify(Throwable t) {

        final Optional<OptimisticLockException> optLockException = ExceptionUtil.unwrap(t, OptimisticLockException.class);
        if (optLockException.isPresent()) {
            return ErrorClassification.builder()
                    .errorType(ErrorType.VERSION_CONFLICT)
                    .errorMessage(optLockException.get().getMessage())
                    .build();
        }

        final Optional<ConstraintViolationException> optCVE = ExceptionUtil.unwrap(t, ConstraintViolationException.class);
        if (optCVE.isPresent()) {
            ConstraintViolationException cve = optCVE.get();
            return ErrorClassification.builder()
                    .errorType(ErrorType.UNIQUE_CONSTRAINT)
                    .uniqueConstraintName(cve.getConstraintName())
                    .errorMessage(cve.getErrorMessage())
                    .build();
        }

        final Optional<SQLException> optSQL = ExceptionUtil.unwrap(t, SQLException.class);

        if (optSQL.isEmpty()) {
            return ErrorClassification.builder().errorType(ErrorType.TECHNICAL).errorMessage(t.getMessage()).build();
        }

        SQLException sqlException = optSQL.get();
        final SQLErrorType sqlErrorType = MariaDbErrorClassifier.classify(sqlException);

        return SQLErrorType.UNIQUE_VIOLATION == sqlErrorType ?
                ErrorClassification.builder().errorType(ErrorType.UNIQUE_CONSTRAINT).uniqueConstraintName("nicht feststellbar").errorMessage(sqlException.getMessage()).build() :
                ErrorClassification.builder().errorType(ErrorType.TECHNICAL).errorMessage(sqlException.getMessage()).build();
    }
}
