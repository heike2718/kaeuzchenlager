//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Provider
@Priority(3000)
public class FallbackExceptionMapper implements ExceptionMapper<RuntimeException> {

    private static final Logger LOGGER = LoggerFactory.getLogger(FallbackExceptionMapper.class);

    @Override
    public Response toResponse(final RuntimeException exception) {

        LOGGER.error(exception.getMessage(), exception);

        ErrorResponseDto errorResponseDto = ErrorResponseDto.builder()
                .errorLevel(ErrorLevel.ERROR)
                .message("Ein unerwarteter Fehler ist aufgetreten. Wende Dich bitte vertrauensvoll an Deinen technischen Support, wenn möglich mit Kontext und Screenshots.")
                .build();

        return Response.serverError().entity(errorResponseDto).build();
    }
}
