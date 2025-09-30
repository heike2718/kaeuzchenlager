// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

/** KaeuzchenlagerRuntimeException für allgemeine Serverfehler. */
public class KaeuzchenlagerRuntimeException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  /**
   * Instantiates a new Kaeuzchenlager runtime exception.
   *
   * @param message the message
   */
  public KaeuzchenlagerRuntimeException(final String message) {
    super(message);
  }

  /**
   * Instantiates a new Kaeuzchenlager runtime exception.
   *
   * @param message the message
   * @param cause the cause
   */
  public KaeuzchenlagerRuntimeException(final String message, final Throwable cause) {
    super(message, cause);
  }
}
