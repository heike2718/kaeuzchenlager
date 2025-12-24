// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorLevel;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDaten;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDto;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.dao.GefaesstypDao;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities.Gefaesstyp;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

@QuarkusTest
@TestHTTPEndpoint(GefaesstypenResource.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestSecurity(user = "ca36e284-f8a8-4a42-93b5-012df24f08ee", roles = { "KL_ADMIN" })
public class GefaesstypenResourceTest {

  private static final String AENDERN_UUID = "8efeed81-85ae-458b-8de0-481ff38ac1d4";

  @Inject Validator validator;

  @Inject GefaesstypDao gefaesstypDao;

  @ConfigProperty(name = "quarkus.datasource.jdbc.url")
  String jdbcUrl;

  @BeforeEach
  void beforeEach() {

    System.out.println("============ GefaesstypenResourceTest BEFORE EACH ===================");
    System.out.println("===> jdbcUrl=" + this.jdbcUrl);
    System.out.println("======================================================================");
  }

  @Test
  @Order(0)
  void should_return_406_when_unsupportedAPIVersion() {

    // act
    ErrorResponseDto errorResponse =
        given()
            .header("API-Version", 5)
            .get()
            .then()
            .statusCode(406)
            .and()
            .extract()
            .as(ErrorResponseDto.class);

    // assert
    final Set<ConstraintViolation<ErrorResponseDto>> cvs = validator.validate(errorResponse);

    assertAll(
        () -> assertTrue(cvs.isEmpty()),
        () -> assertEquals(ErrorLevel.ERROR, errorResponse.getErrorLevel()),
        () ->
            assertEquals(
                "API-Version wird nicht unterstützt. Bitte Header API-Version prüfen. Unterstützte Versionen: 1",
                errorResponse.getMessage()));
  }

  @Test
  @Order(1)
  void should_anlegen_work() {

    // arrange
    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(50)
            .name("Gefäßtyp")
            .backgroundColor("#ccffff")
            .anzahl(4)
            .version(null)
            .build();

    GefaesstypDto requestPayload = GefaesstypDto.builder().uuid(UUID.randomUUID().toString()).daten(daten).build();

    // act
    GefaesstypDto gefaesstypDto =
        given()
            .header("API-Version", 1)
            .contentType(ContentType.JSON)
            .body(requestPayload)
            .post()
            .then()
            .statusCode(201)
            .extract()
            .as(GefaesstypDto.class);

    // assert
    GefaesstypDaten resultDaten = gefaesstypDto.getDaten();

    assertAll(
        () -> assertNotNull(gefaesstypDto.getUuid()),
        () -> assertNotNull(resultDaten),
        () -> assertEquals("Gefäßtyp", resultDaten.getName()),
        () -> assertEquals(50, resultDaten.getVolumen()),
        () -> assertEquals(4, resultDaten.getAnzahl()),
        () -> assertEquals("#ccffff", resultDaten.getBackgroundColor()));

    String uuid = gefaesstypDto.getUuid();

    Optional<Gefaesstyp> optEntity = this.gefaesstypDao.findById(uuid);

    assertTrue(optEntity.isPresent());

    Gefaesstyp entity = optEntity.get();

    assertAll(
        () -> assertEquals(uuid, entity.getUuid()),
        () -> assertEquals("Gefäßtyp", entity.getName()),
        () -> assertEquals(50, entity.getVolumen()),
        () -> assertEquals(4, entity.getAnzahl()),
        () -> assertEquals("#ccffff", entity.getBackgroundColor()),
        () -> assertNotNull(entity.getCreatedBy()),
        () -> assertNotNull(entity.getCreatedAt()),
        () -> assertNull(entity.getUpdatedBy()),
        () -> assertNull(entity.getUpdatedAt()));
  }

  @Test
  @Order(2)
  void should_aendern_work() {

    // arrange
    Gefaesstyp gefaesstyp =  this.gefaesstypDao.findByUuid("6ff63774-ec09-496b-b7f5-ddb85bb2edc2");
    assertNotNull(gefaesstyp);

    String uuid = gefaesstyp.getUuid();

    // arrange 2
    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(45)
            .name("Gefäßtyp 7")
            .backgroundColor("#ffccff")
            .anzahl(14)
            .version(0)
            .build();

    GefaesstypDto gefaesstypUpdated =
        given()
            .header("API-Version", 1)
            .contentType(ContentType.JSON)
            .body(daten)
            .put(gefaesstyp.getUuid())
            .then()
            .statusCode(200)
            .extract()
            .as(GefaesstypDto.class);

    GefaesstypDaten datenUpdated = gefaesstypUpdated.getDaten();

    assertAll(
        () -> assertNotNull(gefaesstypUpdated.getUuid()),
        () -> assertNotNull(datenUpdated),
        () -> assertEquals("Gefäßtyp 7", datenUpdated.getName()),
        () -> assertEquals(45, datenUpdated.getVolumen()),
        () -> assertEquals(14, datenUpdated.getAnzahl()),
        () -> assertEquals("#ffccff", datenUpdated.getBackgroundColor()));

    Optional<Gefaesstyp> optEntityUpdated = this.gefaesstypDao.findById(uuid);

    assertTrue(optEntityUpdated.isPresent());
  }

  @Test
  @Order(3)
  void should_loeschen_work() {

    // arrange
    final String uuid = "ac29258e-a6be-49e1-8ae4-953cbb1fe1c0";

    // act 3
    given().header("API-Version", 1).delete(uuid).then().statusCode(204);

    Optional<Gefaesstyp> optEntityDeleted = this.gefaesstypDao.findById(uuid);

    assertTrue(optEntityDeleted.isEmpty());
  }

  @Test
  @Order(4)
  void should_loeschen_return_204_when_unknown_uuid() {

    // arrange
    final String uuid = "5c29258e-a6be-49e1-8ae4-953cbb1fe1c0";

    Optional<Gefaesstyp> optEntityDeleted = this.gefaesstypDao.findById(uuid);
    assertTrue(optEntityDeleted.isEmpty());

    // act
    given().header("API-Version", 1).delete(uuid).then().statusCode(204);
  }

  @Test
  @Order(5)
  void should_anlegen_be_rejected_when_volumen_exists() {

    // arrange
    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(300)
            .name("Gefäßtyp 3")
            .backgroundColor("#ccffff")
            .anzahl(4)
            .version(null)
            .build();

    GefaesstypDto requestPayload = GefaesstypDto.builder().uuid(UUID.randomUUID().toString()).daten(daten).build();


    // act
    final ErrorResponseDto errorResponseDto =
        given()
            .header("API-Version", 1)
            .contentType(ContentType.JSON)
            .body(requestPayload)
            .post()
            .then()
            .statusCode(412)
            .extract()
            .as(ErrorResponseDto.class);

    // assert
    assertAll(
        () -> assertEquals(ErrorLevel.WARN, errorResponseDto.getErrorLevel()),
        () ->
            assertEquals(
                "Es gibt bereits einen Gefäßtyp mit diesem Volumen.",
                errorResponseDto.getMessage()));
  }

  @Test
  @Order(6)
  void should_anlegen_be_rejected_when_name_exists() {

    // arrange
    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(500)
            .name("Gefäßtyp 1")
            .backgroundColor("#ccffff")
            .anzahl(4)
            .version(null)
            .build();

    GefaesstypDto requestPayload = GefaesstypDto.builder().uuid(UUID.randomUUID().toString()).daten(daten).build();


    // act
    final ErrorResponseDto errorResponseDto =
        given()
            .header("API-Version", 1)
            .contentType(ContentType.JSON)
            .body(requestPayload)
            .post()
            .then()
            .statusCode(412)
            .extract()
            .as(ErrorResponseDto.class);

    // assert
    assertAll(
        () -> assertEquals(ErrorLevel.WARN, errorResponseDto.getErrorLevel()),
        () ->
            assertEquals(
                "Es gibt bereits einen Gefäßtyp mit diesem Namen. Bitte wähl einen anderen.",
                errorResponseDto.getMessage()));
  }

  @Test
  @Order(7)
  void should_aendern_be_rejected_when_volumen_exists() {

    // arrange
    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(2)
            .name("Gefäßtyp 9")
            .backgroundColor("#ccffff")
            .anzahl(4)
            .version(0)
            .build();

    // act
    final ErrorResponseDto errorResponseDto =
        given()
            .header("API-Version", 1)
            .contentType(ContentType.JSON)
            .body(daten)
            .put(AENDERN_UUID)
            .then()
            .statusCode(412)
            .extract()
            .as(ErrorResponseDto.class);

    // assert
    assertAll(
        () -> assertEquals(ErrorLevel.WARN, errorResponseDto.getErrorLevel()),
        () ->
            assertEquals(
                "Es gibt bereits einen Gefäßtyp mit diesem Volumen.",
                errorResponseDto.getMessage()));
  }

  @Test
  @Order(8)
  void should_aendern_be_rejected_when_name_exists() {

    // arrange
    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(10)
            .name("Gefäßtyp 1")
            .backgroundColor("#ccffff")
            .anzahl(4)
            .version(0)
            .build();

    // act
    final ErrorResponseDto errorResponseDto =
        given()
            .header("API-Version", 1)
            .contentType(ContentType.JSON)
            .body(daten)
            .put(AENDERN_UUID)
            .then()
            .statusCode(412)
            .extract()
            .as(ErrorResponseDto.class);

    // assert
    assertAll(
        () -> assertEquals(ErrorLevel.WARN, errorResponseDto.getErrorLevel()),
        () ->
            assertEquals(
                "Es gibt bereits einen Gefäßtyp mit diesem Namen. Bitte wähl einen anderen.",
                errorResponseDto.getMessage()));
  }

  @Test
  @Order(9)
  void should_aendern_fail_when_unknown_uuid() {

    // arrange
    String uuid = "06c34cab-756e-4197-a0a7-e1ec7c3b509f";

    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(150)
            .name("Gefäßtyp 6")
            .backgroundColor("#ccffff")
            .anzahl(2)
            .version(0)
            .build();

    // act
    final ErrorResponseDto errorResponseDto =
        given()
            .header("API-Version", 1)
            .contentType(ContentType.JSON)
            .body(daten)
            .put(uuid)
            .then()
            .statusCode(404)
            .extract()
            .as(ErrorResponseDto.class);

    // assert
    assertAll(
        () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
        () ->
            assertEquals(
                "Diese Ressource gibt es nicht oder nicht mehr.", errorResponseDto.getMessage()));
  }

  @Test
  @Order(10)
  void should_aendern_not_be_rejected_when_gleiche_entity() {

    // arrange
    String uuid = "6ff63774-ec09-496b-b7f5-ddb85bb2edc2";

    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(10)
            .name("Gefäßtyp 7")
            .backgroundColor("#ffffcc")
            .anzahl(19)
            .version(1)
            .build();

    // act
    final GefaesstypDto dto =
        given()
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

  @Test
  @Order(11)
  void should_gefaesstypAendern_return_409_when_concurrent_update() {

    // arrange
    String uuid = "5aad23ff-3983-459e-9431-b23969394051";

    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(2)
            .name("Gefäßtyp 1")
            .backgroundColor("#ccccff")
            .anzahl(5)
            .version(0)
            .build();

    // act
    final ErrorResponseDto errorResponseDto =
        given()
            .header("API-Version", 1)
            .contentType(ContentType.JSON)
            .body(daten)
            .put(uuid)
            .then()
            .statusCode(409)
            .extract()
            .as(ErrorResponseDto.class);

    // assert
    assertAll(
        () -> assertEquals(ErrorLevel.ERROR, errorResponseDto.getErrorLevel()),
        () ->
            assertEquals(
                "Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.",
                errorResponseDto.getMessage()));
  }
}
