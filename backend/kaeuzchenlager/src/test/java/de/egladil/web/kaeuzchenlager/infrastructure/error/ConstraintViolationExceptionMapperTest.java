// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

import de.egladil.web.kaeuzchenlager.TestUtils;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

@QuarkusTest
public class ConstraintViolationExceptionMapperTest {

    @Inject
    ConstraintViolationExceptionMapper exceptionMapper;

    @Test
    void should_work() {

        // arrange
        ConstraintViolationException ex = TestUtils.createConstraintViolationException();

        // act + assert
        try (Response response = exceptionMapper.toResponse(ex)) {

            final int status = response.getStatus();

            try {
                final ErrorResponseDto errorResponseDto = (ErrorResponseDto) response.getEntity();

                assertAll(() -> assertEquals(400, status),
                        () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                        () -> assertEquals(
                                "Inputvalidierung fehlgeschlagen: Email must be valid; Name must not be blank",
                                errorResponseDto.getMessage()));
            } catch (ClassCastException e) {
                fail("Erwarten ErrorResponseDto");
            }
        }
    }
}
