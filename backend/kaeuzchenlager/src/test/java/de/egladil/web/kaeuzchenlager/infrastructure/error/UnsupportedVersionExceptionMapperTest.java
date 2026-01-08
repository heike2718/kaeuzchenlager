// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import de.egladil.web.kaeuzchenlager.domain.exception.UnsupportedVersionException;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

@QuarkusTest
public class UnsupportedVersionExceptionMapperTest {

    @Inject
    UnsupportedVersionExceptionMapper exceptionMapper;

    @Test
    void should_work() {

        // arrange
        UnsupportedVersionException ex = new UnsupportedVersionException("version wird nicht supportet");

        // act + assert
        try (Response response = exceptionMapper.toResponse(ex)) {

            final int status = response.getStatus();

            try {
                final ErrorResponseDto errorResponseDto = (ErrorResponseDto) response.getEntity();

                assertAll(() -> assertEquals(406, status),
                        () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                        () -> assertEquals("version wird nicht supportet", errorResponseDto.getMessage()));
            } catch (ClassCastException e) {
                fail("Erwarten ErrorResponseDto");
            }
        }
    }
}
