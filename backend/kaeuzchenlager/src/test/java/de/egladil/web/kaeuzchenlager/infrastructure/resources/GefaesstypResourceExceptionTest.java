//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDaten;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDto;
import de.egladil.web.kaeuzchenlager.infrastructure.cdi.StartupListener;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestHTTPEndpoint(GefaesstypenResource.class)
public class GefaesstypResourceExceptionTest {

    private static final String AENDERN_UUID = "8efeed81-85ae-458b-8de0-481ff38ac1d4";

    @Inject
    StartupListener startupListener;

    @BeforeEach
    void before() {

        System.out.println("===========  GefaesstypResourceExceptionTest  ========================================");
        System.out.println("==========> jdbcUrl=" + startupListener.getJdbcUrl());
        System.out.println("======================================================================================");
    }

    @Test
    void should_anlegen_be_rejected_when_volumen_exists() {

        // arrange
        GefaesstypDaten daten = GefaesstypDaten.builder()
                .volumen(10)
                .name("Gefäßtyp 3")
                .backgroundColor("#ccffff")
                .anzahl(4)
                .build();

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(daten)
                .post()
                .then()
                .statusCode(409)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        assertAll(() -> assertEquals(ErrorLevel.WARN, errorResponseDto.getErrorLevel()),
                () -> assertEquals("Es gibt bereits einen Gefäßtyp mit diesem Volumen.", errorResponseDto.getMessage()));

    }

    @Test
    void should_anlegen_be_rejected_when_name_exists() {

        // arrange
        GefaesstypDaten daten = GefaesstypDaten.builder()
                .volumen(500)
                .name("Gefäßtyp 1")
                .backgroundColor("#ccffff")
                .anzahl(4)
                .build();

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(daten)
                .post()
                .then()
                .statusCode(409)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        assertAll(() -> assertEquals(ErrorLevel.WARN, errorResponseDto.getErrorLevel()),
                () -> assertEquals("Es gibt bereits einen Gefäßtyp mit diesem Namen. Bitte wähl einen anderen.", errorResponseDto.getMessage()));

    }

    @Test
    void should_aendern_be_rejected_when_volumen_exists() {

        // arrange
        GefaesstypDaten daten = GefaesstypDaten.builder()
                .volumen(10)
                .name("Gefäßtyp 3")
                .backgroundColor("#ccffff")
                .anzahl(4)
                .build();

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(daten)
                .put(AENDERN_UUID)
                .then()
                .statusCode(409)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        assertAll(() -> assertEquals(ErrorLevel.WARN, errorResponseDto.getErrorLevel()),
                () -> assertEquals("Es gibt bereits einen Gefäßtyp mit diesem Volumen.", errorResponseDto.getMessage()));

    }

    @Test
    void should_aendern_be_rejected_when_name_exists() {

        // arrange
        GefaesstypDaten daten = GefaesstypDaten.builder()
                .volumen(10)
                .name("Gefäßtyp 1")
                .backgroundColor("#ccffff")
                .anzahl(4)
                .build();

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(daten)
                .put(AENDERN_UUID)
                .then()
                .statusCode(409)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        assertAll(() -> assertEquals(ErrorLevel.WARN, errorResponseDto.getErrorLevel()),
                () -> assertEquals("Es gibt bereits einen Gefäßtyp mit diesem Namen. Bitte wähl einen anderen.", errorResponseDto.getMessage()));

    }

    @Test
    void should_aendern_fail_when_unknown_uuid() {

        // arrange
        String uuid = "06c34cab-756e-4197-a0a7-e1ec7c3b509f";

        GefaesstypDaten daten = GefaesstypDaten.builder()
                .volumen(150)
                .name("Gefäßtyp 6")
                .backgroundColor("#ccffff")
                .anzahl(2)
                .build();

        // act
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(daten)
                .put(uuid)
                .then()
                .statusCode(404)
                .extract()
                .as(ErrorResponseDto.class);

        // assert
        assertAll(() -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                () -> assertEquals("Diese Ressource gibt es nicht oder nicht mehr.", errorResponseDto.getMessage()));

    }

    @Test
    void should_aendern_not_be_rejected_when_gleiche_entity() {

        // arrange
        String uuid = "6ff63774-ec09-496b-b7f5-ddb85bb2edc2";

        GefaesstypDaten daten = GefaesstypDaten.builder()
                .volumen(10)
                .name("Gefäßtyp 2")
                .backgroundColor("#ffffcc")
                .anzahl(19)
                .build();

        // act
        final GefaesstypDto dto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(daten)
                .put(uuid)
                .then()
                .statusCode(200)
                .extract()
                .as(GefaesstypDto.class);

        // assert
        assertAll(
                () -> assertEquals(19, dto.getDaten().getAnzahl()),
                () -> assertEquals("#ffffcc", dto.getDaten().getBackgroundColor()));

    }

}
