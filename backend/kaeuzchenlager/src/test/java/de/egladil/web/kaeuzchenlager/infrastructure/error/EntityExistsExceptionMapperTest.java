//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import de.egladil.web.kaeuzchenlager.domain.exception.EntityExistsException;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class EntityExistsExceptionMapperTest {

    @Inject
    EntityExistsExceptionMapper exceptionMapper;

    @Test
    void schould_work() {

        // arrange
        EntityExistsException ex = new EntityExistsException("gibet schon");

        // act + assert
        try (Response response = exceptionMapper.toResponse(ex)) {

            final int status = response.getStatus();

            try {
                final ErrorResponseDto errorResponseDto = (ErrorResponseDto) response.getEntity();

                assertAll(() -> assertEquals(409, status),
                        () -> assertEquals(ErrorLevel.WARN, errorResponseDto.getErrorLevel()),
                        () -> assertEquals("gibet schon", errorResponseDto.getMessage()));
            } catch (ClassCastException e) {
                fail("Erwarten ErrorResponseDto");
            }
        }
    }
}
