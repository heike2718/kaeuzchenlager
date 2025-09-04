//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import de.egladil.web.kaeuzchenlager.domain.exception.ConcurrentModificationException;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
public class ConcurrentModificationExceptionMapperTest {

    @Inject
    ConcurrentModificationExceptionMapper exceptionMapper;

    @Test
    void should_work() {

        // arrange
        ConcurrentModificationException ex = new ConcurrentModificationException("wurde zwischenzeitlich geändert");

        // act
        try (Response response = exceptionMapper.toResponse(ex);) {

            final int status = response.getStatus();
            final Object entity = response.getEntity();

            assertAll(() -> assertTrue(entity instanceof ErrorResponseDto),
                    () -> assertEquals(412, status),
                    () -> assertEquals(ErrorLevel.ERROR, ((ErrorResponseDto)entity).getErrorLevel()),
                    () -> assertEquals("wurde zwischenzeitlich geändert", ((ErrorResponseDto)entity).getMessage()));

        }

    }
}
