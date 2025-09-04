//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import de.egladil.web.kaeuzchenlager.domain.exception.KaeuzchenlagerRuntimeException;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Request;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@QuarkusTest
public class FallbackExceptionMapperTest {

    @InjectMock
    UriInfo uriInfo;

    @InjectMock
    Request request;

    @Inject
    FallbackExceptionMapper exceptionMapper;

    @Test
    void should_handle_NotFoundException() {

        // arrange
        when(request.getMethod()).thenReturn("GET");
        when(uriInfo.getPath()).thenReturn("/api/test");

        NotFoundException ex = new NotFoundException("URI unbekannt");

        // act
        try (Response response = exceptionMapper.toResponse(ex);) {

            final int status = response.getStatus();
            final Object entity = response.getEntity();

            assertAll(() -> assertTrue(entity instanceof ErrorResponseDto),
                    () -> assertEquals(404, status),
                    () -> assertEquals(ErrorLevel.ERROR, ((ErrorResponseDto) entity).getErrorLevel()),
                    () -> assertEquals("diese Ressource gibt es nicht oder nicht mehr", ((ErrorResponseDto) entity).getMessage()),
                    () -> verify(request).getMethod(),
                    () -> verify(uriInfo).getPath()
            );

        }
    }

    @Test
    void should_handle_WebApplicationException() {

        // arrange
        when(request.getMethod()).thenReturn("GET");
        when(uriInfo.getPath()).thenReturn("/api/test");

        WebApplicationException ex = new WebApplicationException("MethodNotAllowed", 405);

        // act
        try (Response response = exceptionMapper.toResponse(ex);) {

            final int status = response.getStatus();
            final Object entity = response.getEntity();

            assertAll(() -> assertTrue(entity instanceof ErrorResponseDto),
                    () -> assertEquals(405, status),
                    () -> assertEquals(ErrorLevel.ERROR, ((ErrorResponseDto) entity).getErrorLevel()),
                    () -> assertEquals("MethodNotAllowed", ((ErrorResponseDto) entity).getMessage()),
                    () -> verify(request).getMethod(),
                    () -> verify(uriInfo).getPath()
            );

        }
    }

    @Test
    void should_handle_KaeuzchenlagerRuntimeException() {

        // arrange
        when(request.getMethod()).thenReturn("GET");
        when(uriInfo.getPath()).thenReturn("/api/test");

        KaeuzchenlagerRuntimeException ex = new KaeuzchenlagerRuntimeException("schlimm! schlimm! schlimm!");

        // act
        try (Response response = exceptionMapper.toResponse(ex);) {

            final int status = response.getStatus();
            final Object entity = response.getEntity();

            assertAll(() -> assertTrue(entity instanceof ErrorResponseDto),
                    () -> assertEquals(500, status),
                    () -> assertEquals(ErrorLevel.ERROR, ((ErrorResponseDto) entity).getErrorLevel()),
                    () -> assertEquals("Ein unerwarteter Fehler ist aufgetreten. Wende Dich bitte vertrauensvoll an Deinen technischen Support, wenn möglich mit Kontext und Screenshots.", ((ErrorResponseDto) entity).getMessage()),
                    () -> verify(request).getMethod(),
                    () -> verify(uriInfo).getPath()
            );

        }
    }

    @Test
    void should_handle_RuntimeException() {

        // arrange
        when(request.getMethod()).thenReturn("GET");
        when(uriInfo.getPath()).thenReturn("/api/test");

        RuntimeException ex = new RuntimeException("schlimm! schlimm! schlimm!");

        // act
        try (Response response = exceptionMapper.toResponse(ex);) {

            final int status = response.getStatus();
            final Object entity = response.getEntity();

            assertAll(() -> assertTrue(entity instanceof ErrorResponseDto),
                    () -> assertEquals(500, status),
                    () -> assertEquals(ErrorLevel.ERROR, ((ErrorResponseDto) entity).getErrorLevel()),
                    () -> assertEquals("Ein unerwarteter Fehler ist aufgetreten. Wende Dich bitte vertrauensvoll an Deinen technischen Support, wenn möglich mit Kontext und Screenshots.", ((ErrorResponseDto) entity).getMessage()),
                    () -> verify(request).getMethod(),
                    () -> verify(uriInfo).getPath()
            );

        }
    }
}
