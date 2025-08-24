//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

/**
 * EntityExistsException. Wenn es eine Entity mit gleichem fachlichen Schlüssel bereits gibt.
 */
public class EntityExistsException extends RuntimeException {

    public EntityExistsException(final String message) {
        super(message);
    }
}
