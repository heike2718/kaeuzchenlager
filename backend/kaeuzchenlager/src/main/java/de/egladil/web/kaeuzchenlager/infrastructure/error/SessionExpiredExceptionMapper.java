// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.egladil.web.kaeuzchenlager.domain.exception.SessionExpiredException;

@Provider
@Priority(1500)
public class SessionExpiredExceptionMapper implements ExceptionMapper<SessionExpiredException> {

    @Override
    public Response toResponse(SessionExpiredException exception) {
        return Response.status(440).build();
    }
}
