//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDaten;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDto;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypLoeschenResult;
import de.egladil.web.kaeuzchenlager.infrastructure.cdi.StartupListener;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.dao.GefaesstypDao;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities.Gefaesstyp;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.junit.jupiter.api.*;

import java.util.List;
import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestHTTPEndpoint(GefaesstypenResource.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class GefaesstypResourceAnlegenAendernLoeschenTest {

    @Inject
    GefaesstypDao gefaesstypDao;

    @Inject
    StartupListener startupListener;

    @BeforeEach
    void before() {

        System.out.println("============ GefaesstypResourceAnlegenAendernLoeschenTest =========================================");
        System.out.println("==========> jdbcUrl=" + startupListener.getJdbcUrl());
        System.out.println("===================================================================================================");
    }

    @Test
    @Order(1)
    void should_anlegen_work() {

        // arrange
        GefaesstypDaten daten = GefaesstypDaten.builder()
                .volumen(50)
                .name("Gefäßtyp")
                .backgroundColor("#ccffff")
                .anzahl(4)
                .build();

        // act
        final GefaesstypDto gefaesstypDto = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(daten)
                .post()
                .then()
                .statusCode(201)
                .extract()
                .as(GefaesstypDto.class);

        // assert
        GefaesstypDaten resultDaten = gefaesstypDto.getDaten();

        assertAll(() -> assertNotNull(gefaesstypDto.getUuid()),
                () -> assertNotNull(resultDaten),
                () -> assertEquals("Gefäßtyp", resultDaten.getName()),
                () -> assertEquals(50, resultDaten.getVolumen()),
                () -> assertEquals(4, resultDaten.getAnzahl()),
                () -> assertEquals("#ccffff", resultDaten.getBackgroundColor())
        );

        String uuid = gefaesstypDto.getUuid();

        final Optional<Gefaesstyp> optEntity = gefaesstypDao.findById(uuid);

        assertTrue(optEntity.isPresent());

        final Gefaesstyp entity = optEntity.get();

        assertAll(() -> assertEquals(uuid, entity.getUuid()),
                () -> assertEquals("Gefäßtyp", entity.getName()),
                () -> assertEquals(50, entity.getVolumen()),
                () -> assertEquals(4, entity.getAnzahl()),
                () -> assertEquals("#ccffff", entity.getBackgroundColor()),
                () -> assertNotNull(entity.getCreatedBy()),
                () -> assertNotNull(entity.getCreatedAt()),
                () -> assertNull(entity.getUpdatedBy()),
                () -> assertNull(entity.getUpdatedAt())
        );
    }

    @Test
    @Order(2)
    void should_aendern_work() {

        // arrange
        final List<Gefaesstyp> gefaesstypen = gefaesstypDao.loadAll();
        final Optional<Gefaesstyp> optEntity = gefaesstypen.stream().filter(gt -> "Gefäßtyp".equals(gt.getName())).findFirst();

        assertTrue(optEntity.isPresent());
        String uuid = optEntity.get().getUuid();

        // arrange 2
        GefaesstypDaten daten = GefaesstypDaten.builder()
                .volumen(50)
                .name("Gefäßtyp 7")
                .backgroundColor("#ffccff")
                .anzahl(14)
                .build();

        final GefaesstypDto gefaesstypUpdated = given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(daten)
                .put(uuid)
                .then()
                .statusCode(200)
                .extract()
                .as(GefaesstypDto.class);

        final GefaesstypDaten datenUpdated = gefaesstypUpdated.getDaten();

        assertAll(() -> assertNotNull(gefaesstypUpdated.getUuid()),
                () -> assertNotNull(datenUpdated),
                () -> assertEquals("Gefäßtyp 7", datenUpdated.getName()),
                () -> assertEquals(50, datenUpdated.getVolumen()),
                () -> assertEquals(14, datenUpdated.getAnzahl()),
                () -> assertEquals("#ffccff", datenUpdated.getBackgroundColor())
        );

        final Optional<Gefaesstyp> optEntityUpdated = gefaesstypDao.findById(uuid);

        assertTrue(optEntityUpdated.isPresent());
    }

    @Test
    @Order(3)
    void should_loeschen_work() {

        // arrange
        String uuid = "ac29258e-a6be-49e1-8ae4-953cbb1fe1c0";

        // act 3
        final GefaesstypLoeschenResult gefaesstypLoeschenResult = given()
                .header("API-Version", 1)
                .delete(uuid)
                .then()
                .statusCode(200)
                .extract()
                .as(GefaesstypLoeschenResult.class);

        final Optional<Gefaesstyp> optEntityDeleted = gefaesstypDao.findById(uuid);

        assertAll(() -> assertEquals(uuid, gefaesstypLoeschenResult.getUuid()),
                () -> assertTrue(optEntityDeleted.isEmpty()));
    }

    @Test
    @Order(4)
    void should_loeschen_return_404_when_unknown_uuid() {

        // arrange
        String uuid = "5c29258e-a6be-49e1-8ae4-953cbb1fe1c0";

        // act 3
        final ErrorResponseDto errorResponseDto = given()
                .header("API-Version", 1)
                .delete(uuid)
                .then()
                .statusCode(404)
                .extract()
                .as(ErrorResponseDto.class);

        final Optional<Gefaesstyp> optEntityDeleted = gefaesstypDao.findById(uuid);

        assertAll(() -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
                () -> assertEquals("", errorResponseDto.getMessage()),
                () -> assertTrue(optEntityDeleted.isEmpty()));
    }
}
