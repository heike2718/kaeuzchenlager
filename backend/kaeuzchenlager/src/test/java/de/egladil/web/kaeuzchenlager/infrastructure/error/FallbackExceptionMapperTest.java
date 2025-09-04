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

        // act + assert
        try (Response response = exceptionMapper.toResponse(ex)) {

            final int status = response.getStatus();

            try {
                final ErrorResponseDto errorResponseDto = (ErrorResponseDto) response.getEntity();

                assertAll(() -> assertEquals(404, status),
                        () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                        () -> assertEquals("Diese Ressource gibt es nicht oder nicht mehr.", errorResponseDto.getMessage()),
                        () -> verify(request).getMethod(),
                        () -> verify(uriInfo).getPath());
            } catch (ClassCastException e) {
                fail("Erwarten ErrorResponseDto");
            }
        }
    }

    @Test
    void should_handle_WebApplicationException() {

        // arrange
        when(request.getMethod()).thenReturn("GET");
        when(uriInfo.getPath()).thenReturn("/api/test");

        WebApplicationException ex = new WebApplicationException("MethodNotAllowed", 405);

        // act + assert
        try (Response response = exceptionMapper.toResponse(ex)) {

            final int status = response.getStatus();

            try {
                final ErrorResponseDto errorResponseDto = (ErrorResponseDto) response.getEntity();

                assertAll(() -> assertEquals(405, status),
                        () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                        () -> assertEquals("MethodNotAllowed", errorResponseDto.getMessage()),
                        () -> verify(request).getMethod(),
                        () -> verify(uriInfo).getPath());
            } catch (ClassCastException e) {
                fail("Erwarten ErrorResponseDto");
            }
        }
    }

    @Test
    void should_handle_KaeuzchenlagerRuntimeException() {

        // arrange
        when(request.getMethod()).thenReturn("GET");
        when(uriInfo.getPath()).thenReturn("/api/test");

        KaeuzchenlagerRuntimeException ex = new KaeuzchenlagerRuntimeException("schlimm! schlimm! schlimm!");

        // act + assert
        try (Response response = exceptionMapper.toResponse(ex)) {

            final int status = response.getStatus();

            try {
                final ErrorResponseDto errorResponseDto = (ErrorResponseDto) response.getEntity();

                assertAll(() -> assertEquals(500, status),
                        () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                        () -> assertEquals("Ein unerwarteter Fehler ist aufgetreten. Wende Dich bitte vertrauensvoll an Deinen technischen Support, wenn möglich mit Kontext und Screenshots.", errorResponseDto.getMessage()),
                        () -> verify(request).getMethod(),
                        () -> verify(uriInfo).getPath());
            } catch (ClassCastException e) {
                fail("Erwarten ErrorResponseDto");
            }
        }
    }

    @Test
    void should_handle_RuntimeException() {

        // arrange
        when(request.getMethod()).thenReturn("GET");
        when(uriInfo.getPath()).thenReturn("/api/test");

        RuntimeException ex = new RuntimeException("schlimm! schlimm! schlimm!");

        // act + assert
        try (Response response = exceptionMapper.toResponse(ex)) {

            final int status = response.getStatus();

            try {
                final ErrorResponseDto errorResponseDto = (ErrorResponseDto) response.getEntity();

                assertAll(() -> assertEquals(500, status),
                        () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                        () -> assertEquals("Ein unerwarteter Fehler ist aufgetreten. Wende Dich bitte vertrauensvoll an Deinen technischen Support, wenn möglich mit Kontext und Screenshots.", errorResponseDto.getMessage()),
                        () -> verify(request).getMethod(),
                        () -> verify(uriInfo).getPath());
            } catch (ClassCastException e) {
                fail("Erwarten ErrorResponseDto");
            }
        }
    }
}
