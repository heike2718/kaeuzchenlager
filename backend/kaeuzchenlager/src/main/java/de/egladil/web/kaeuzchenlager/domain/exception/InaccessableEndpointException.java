//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

public class InaccessableEndpointException  extends  RuntimeException{

  public InaccessableEndpointException(String message) {
    super(message);
  }
}
