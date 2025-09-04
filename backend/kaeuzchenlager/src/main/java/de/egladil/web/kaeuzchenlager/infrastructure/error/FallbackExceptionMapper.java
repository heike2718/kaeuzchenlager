//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import jakarta.annotation.Priority;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Request;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Provider
@Priority(3000)
public class FallbackExceptionMapper implements ExceptionMapper<RuntimeException> {

    private static final Logger LOGGER = LoggerFactory.getLogger(FallbackExceptionMapper.class);

    @Context
    UriInfo uriInfo;

    @Context
    Request request;

    @Override
    public Response toResponse(final RuntimeException exception) {

        final String method = request.getMethod();
        final String url = uriInfo.getPath();

        if (exception instanceof NotFoundException) {
            LOGGER.error("NotFoundException bei {} {}", method, url);

            ErrorResponseDto errorResponseDto = ErrorResponseDto.builder()
                    .errorLevel(ErrorLevel.ERROR)
                    .message("diese Ressource gibt es nicht oder nicht mehr").build();

            return Response.status(Response.Status.NOT_FOUND).entity(errorResponseDto).build();
        }

        if (exception instanceof WebApplicationException) {

            WebApplicationException wae = (WebApplicationException) exception;
            LOGGER.error("WebApplicationException bei {} {}: {}", method, url, exception.getMessage());
            // 405 kann vorkommen, wenn der Path-Parameter uuid fehlt.
            return wae.getResponse();
        }

        LOGGER.error("{} {}: {}", method, url, exception.getMessage(), exception);

        ErrorResponseDto errorResponseDto = ErrorResponseDto.builder()
                .errorLevel(ErrorLevel.ERROR)
                .message("Ein unerwarteter Fehler ist aufgetreten. Wende Dich bitte vertrauensvoll an Deinen technischen Support, wenn möglich mit Kontext und Screenshots.")
                .build();

        return Response.serverError().entity(errorResponseDto).build();
    }
}
