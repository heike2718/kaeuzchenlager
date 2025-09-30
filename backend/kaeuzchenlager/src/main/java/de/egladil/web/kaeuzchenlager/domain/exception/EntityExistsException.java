// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

/** EntityExistsException, wenn es eine Entity mit gleichem fachlichen Schlüssel bereits gibt. */
public class EntityExistsException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  /**
   * Instantiates a new EntityExistsException.
   *
   * @param message String the message
   */
  public EntityExistsException(final String message) {
    super(message);
  }

  /**
   * Instantiates a new EntityExistsException.
   *
   * @param message String - the message
   * @param cause Throwable - the cause
   */
  public EntityExistsException(final String message, final Throwable cause) {
    super(message, cause);
  }
}
