//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import jakarta.annotation.Priority;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.stream.Collectors;

 @Provider
 @Priority(1500)
public class ConstraintViolationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {


    @Override
    public Response toResponse(final ConstraintViolationException exception) {
        ErrorResponseDto responsePayload = ErrorResponseDto.builder()
                .errorLevel(ErrorLevel.ERROR)
                .message("Inputvalidierung fehlgeschlagen: " + extractMessages(exception))
                .build();

        return Response.status(Response.Status.BAD_REQUEST).entity(responsePayload).build();
    }

    private String extractMessages(ConstraintViolationException exception) {
        return exception.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining("; "));
    }
}
