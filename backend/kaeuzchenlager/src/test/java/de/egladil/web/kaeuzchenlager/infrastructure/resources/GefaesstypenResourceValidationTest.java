//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDaten;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestHTTPEndpoint(GefaesstypenResource.class)
public class GefaesstypenResourceValidationTest {

    private static final String VALID_UUID = "a003530f-97f9-4a5b-a0a3-f6f139522fa0";

    @Inject
    Validator validator;

    @Test
    void should_gefaesstypAnlegen_return_400_when_allAttributes_invalid() {

        // arrange
        GefaesstypDaten requestPayload = GefaesstypDaten.builder()
                .name("Gefäß <1>")
                .volumen(0)
                .anzahl(-3)
                .backgroundColor("hallo")
                .build();

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .post()
                .then()
                .statusCode(400)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        final Set<ConstraintViolation<ErrorResponseDto>> cvs = validator.validate(errorResponseDto);

        assertAll(() -> assertTrue(cvs.isEmpty()),
                () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel())
        );
    }

    @Test
    void should_gefaesstypAnlegen_return_400_when_pflichtattributeNull() {

        // arrange
        GefaesstypDaten requestPayload = GefaesstypDaten.builder()
                .build();
        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .post()
                .then()
                .statusCode(400)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        final Set<ConstraintViolation<ErrorResponseDto>> cvs = validator.validate(errorResponseDto);

        assertAll(() -> assertTrue(cvs.isEmpty()),
                () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel())
        );
    }

    @Test
    void should_gefaesstypAnlegen_return_406_when_unsupportedAPIVersion() {

        // act
        // arrange
        GefaesstypDaten requestPayload = GefaesstypDaten.builder()
                .name("Gefäß 200 ml")
                .anzahl(1)
                .volumen(2)
                .backgroundColor("#ffffff")
                .build();

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 10)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .post()
                .then()
                .statusCode(406)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        final Set<ConstraintViolation<ErrorResponseDto>> cvs = validator.validate(errorResponseDto);

        assertAll(() -> assertTrue(cvs.isEmpty()),
                () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                () -> assertEquals("API-Version wird nicht unterstützt. Bitte Header API-Version prüfen. Unterstützte Versionen: 1", errorResponseDto.getMessage()));

    }



    @Test
    void should_gefaesstypAendern_return_400_when_allAttributes_invalid() {

        // arrange
        GefaesstypDaten requestPayload = GefaesstypDaten.builder()
                .name("Gefäß <1>")
                .volumen(0)
                .anzahl(-3)
                .backgroundColor("hallo")
                .build();

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .put(VALID_UUID)
                .then()
                .statusCode(400)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        final Set<ConstraintViolation<ErrorResponseDto>> cvs = validator.validate(errorResponseDto);

        assertAll(() -> assertTrue(cvs.isEmpty()),
                () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel())
        );
    }

    @Test
    void should_gefaesstypAendern_return_400_when_uuidInvalid() {

        // arrange
        GefaesstypDaten requestPayload = GefaesstypDaten.builder()
                .name("Gefäß 200 ml")
                .anzahl(1)
                .volumen(100)
                .backgroundColor("#f99999")
                .build();

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .put("INVALID-UUID-hähä")
                .then()
                .statusCode(400)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        final Set<ConstraintViolation<ErrorResponseDto>> cvs = validator.validate(errorResponseDto);

        assertAll(() -> assertTrue(cvs.isEmpty()),
                () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                () -> assertEquals("Inputvalidierung fehlgeschlagen: uuid ist keine UUID.", errorResponseDto.getMessage())
        );
    }

    @Test
    void should_gefaesstypAendern_return_400_when_uuidNull() {

        // arrange
        GefaesstypDaten requestPayload = GefaesstypDaten.builder()
                .name("Gefäß 200 ml")
                .anzahl(1)
                .volumen(200)
                .backgroundColor("#f99999")
                .build();

        // act
        given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .put()
                .then()
                .statusCode(405);
    }


    @Test
    void should_gefaesstypAendern_return_406_when_unsupportedAPIVersion() {

        // arrange
        GefaesstypDaten requestPayload = GefaesstypDaten.builder()
                .name("Gefäß 200 ml")
                .anzahl(1)
                .volumen(100)
                .backgroundColor("#ffffff")
                .build();

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 10)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .put(VALID_UUID)
                .then()
                .statusCode(406)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        final Set<ConstraintViolation<ErrorResponseDto>> cvs = validator.validate(errorResponseDto);

        assertAll(() -> assertTrue(cvs.isEmpty()),
                () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                () -> assertEquals("API-Version wird nicht unterstützt. Bitte Header API-Version prüfen. Unterstützte Versionen: 1", errorResponseDto.getMessage()));

    }

    @Test
    void should_gefaesstypLoeschen_return_400_when_uuidInvalid() {

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .delete("INVALID-UUID-hähä")
                .then()
                .statusCode(400)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        final Set<ConstraintViolation<ErrorResponseDto>> cvs = validator.validate(errorResponseDto);

        assertAll(() -> assertTrue(cvs.isEmpty()),
                () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                () -> assertEquals("Inputvalidierung fehlgeschlagen: uuid ist keine UUID.", errorResponseDto.getMessage())
        );
    }

    @Test
    void should_gefaesstypLoeschen_return_400_when_uuidNull() {

        // act
        given()
                .header("API-Version", 1)
                .delete()
                .then()
                .statusCode(405);
    }


    @Test
    void should_gefaesstypAendernLoeschen_return_406_when_unsupportedAPIVersion() {

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 10)
                .delete(VALID_UUID)
                .then()
                .statusCode(406)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        final Set<ConstraintViolation<ErrorResponseDto>> cvs = validator.validate(errorResponseDto);

        assertAll(() -> assertTrue(cvs.isEmpty()),
                () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                () -> assertEquals("API-Version wird nicht unterstützt. Bitte Header API-Version prüfen. Unterstützte Versionen: 1", errorResponseDto.getMessage()));

    }
}
