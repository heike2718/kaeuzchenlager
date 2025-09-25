// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

public class ConcurrentModificationException extends RuntimeException {

  public ConcurrentModificationException(final String message) {
    super(message);
  }
}
