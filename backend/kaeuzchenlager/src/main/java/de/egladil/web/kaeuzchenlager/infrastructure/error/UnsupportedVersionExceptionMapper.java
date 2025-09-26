// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import de.egladil.web.kaeuzchenlager.domain.exception.UnsupportedVersionException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/** The type Unsupported version exception mapper. */
@Provider
public class UnsupportedVersionExceptionMapper
    implements ExceptionMapper<UnsupportedVersionException> {

  @Override
  public Response toResponse(final UnsupportedVersionException versionException) {
    return Response.status(Response.Status.NOT_ACCEPTABLE)
        .entity(
            ErrorResponseDto.builder()
                .errorLevel(ErrorLevel.ERROR)
                .message(versionException.getMessage())
                .build())
        .build();
  }
}
