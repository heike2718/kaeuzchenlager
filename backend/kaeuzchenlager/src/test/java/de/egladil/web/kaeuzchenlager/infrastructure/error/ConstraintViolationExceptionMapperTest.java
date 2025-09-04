//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import de.egladil.web.kaeuzchenlager.TestUtils;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
public class ConstraintViolationExceptionMapperTest {

    @Inject
    ConstraintViolationExceptionMapper exceptionMapper;

    @Test
    void should_work() {

        // arrange
        ConstraintViolationException ex = TestUtils.createConstraintViolationException();

        // act
        try (Response response = exceptionMapper.toResponse(ex);) {

            final int status = response.getStatus();
            final Object entity = response.getEntity();

            assertAll(() -> assertTrue(entity instanceof ErrorResponseDto),
                    () -> assertEquals(400, status),
                    () -> assertEquals(ErrorLevel.ERROR, ((ErrorResponseDto)entity).getErrorLevel()),
                    () -> assertEquals("Inputvalidierung fehlgeschlagen: Email must be valid; Name must not be blank", ((ErrorResponseDto)entity).getMessage()));

        }


    }
}
