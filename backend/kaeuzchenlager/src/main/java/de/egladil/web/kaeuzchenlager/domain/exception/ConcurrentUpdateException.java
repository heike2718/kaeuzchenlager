//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

public class ConcurrentUpdateException extends RuntimeException {

    public ConcurrentUpdateException(final String message) {
        super(message);
    }
}
