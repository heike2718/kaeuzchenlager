// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

/** ConcurrentModificationException. */
public class ConcurrentModificationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Instantiates a new ConcurrentModificationException.
     *
     * @param message String - the message
     */
    public ConcurrentModificationException(final String message) {
        super(message);
    }

    /**
     * Instantiates a new ConcurrentModificationException.
     *
     * @param message String - the message
     * @param cause   Throwable - the cause
     */
    public ConcurrentModificationException(final String message, final Throwable cause) {
        super(message, cause);
    }
}
