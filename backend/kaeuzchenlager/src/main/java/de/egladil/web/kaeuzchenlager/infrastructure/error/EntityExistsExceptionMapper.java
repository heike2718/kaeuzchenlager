//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import de.egladil.web.kaeuzchenlager.domain.exception.EntityExistsException;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
@Priority(2000)
public class EntityExistsExceptionMapper implements ExceptionMapper<EntityExistsException> {


    @Override
    public Response toResponse(final EntityExistsException exception) {

        ErrorResponseDto payload = ErrorResponseDto.builder().errorLevel(ErrorLevel.WARN).message(exception.getMessage()).build();
        return Response.status(412).entity(payload).build();
    }
}
