// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

/** The type Unsupported version exception. */
public class UnsupportedVersionException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  /**
   * Instantiates a new Unsupported version exception.
   *
   * @param message the message
   */
  public UnsupportedVersionException(final String message) {
    super(message);
  }
}
