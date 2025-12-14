//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

public class SessionExpiredException extends RuntimeException{

  public SessionExpiredException(String message) {
    super(message);
  }
}
