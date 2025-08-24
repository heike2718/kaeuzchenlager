//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import de.egladil.web.kaeuzchenlager.domain.exception.ConcurrentUpdateException;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorType;
import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
@Priority(2000)
public class ConcurrentUpdateExceptionMapper implements ExceptionMapper<ConcurrentUpdateException> {


    @Override
    public Response toResponse(final ConcurrentUpdateException exception) {
        ErrorResponseDto payload = ErrorResponseDto.builder().errorLevel(ErrorLevel.ERROR).message(exception.getMessage()).build();
        return Response.status(Response.Status.CONFLICT).entity(payload).build();
    }
}
