//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

/**
 * KaeuzchenlagerRuntimeException für allgemeine Serverfehler.
 */
public class KaeuzchenlagerRuntimeException extends RuntimeException {

    public KaeuzchenlagerRuntimeException(final String message) {
        super(message);
    }

    public KaeuzchenlagerRuntimeException(final String message, final Throwable cause) {
        super(message, cause);
    }
}
