//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestHTTPEndpoint(GefaesstypenResource.class)
public class GefaesstypenResourceGETTest {

    @Inject
    Validator validator;

    @Test
    void should_return_406_when_unsupportedAPIVersion() {

        // act
        ErrorResponseDto errorResponse = given()
                .header("API-Version", 5)
                .get()
                .then()
                .statusCode(406)
                .and()
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        final Set<ConstraintViolation<ErrorResponseDto>> cvs = validator.validate(errorResponse);

        assertAll(() -> assertTrue(cvs.isEmpty()),
                () -> assertEquals(ErrorLevel.ERROR, errorResponse.getErrorLevel()),
                () -> assertEquals("API-Version wird nicht unterstützt. Bitte Header API-Version prüfen. Unterstützte Versionen: 1", errorResponse.getMessage()));

    }

}
