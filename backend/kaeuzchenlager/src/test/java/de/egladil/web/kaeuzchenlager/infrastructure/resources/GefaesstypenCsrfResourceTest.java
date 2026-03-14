package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import java.util.UUID;

import jakarta.inject.Inject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.egladil.web.kaeuzchenlager.CsrfTestProfile;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDaten;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDto;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.dao.GefaesstypDao;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities.Gefaesstyp;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
@TestHTTPEndpoint(GefaesstypenResource.class)
@TestProfile(CsrfTestProfile.class)
@TestSecurity(user = "ca36e284-f8a8-4a42-93b5-012df24f08ee", roles = { "KL_ADMIN" })
public class GefaesstypenCsrfResourceTest {

    @Inject
    GefaesstypDao gefaesstypDao;

    @ConfigProperty(name = "quarkus.datasource.jdbc.url")
    String jdbcUrl;

    @ConfigProperty(name = "csrf.validation.enabled")
    boolean csrfValidationEnabled;

    @BeforeEach
    void beforeEach() {

        System.out.println("============ GefaesstypenResourceTest BEFORE EACH ===================");
        System.out.println("===> jdbcUrl=" + this.jdbcUrl);
        System.out.println("===> csrf.validation.enabled=" + this.csrfValidationEnabled);
        System.out.println("======================================================================");
    }

    @Test
    void should_laden_work() {

        // act
        GefaesstypDto[] gefaesstypen = given()
                .header("API-Version", 1)
                .get()
                .then()
                .statusCode(200)
                .and()
                .extract()
                .as(GefaesstypDto[].class);

        //
        assertAll(() -> assertTrue(gefaesstypen.length > 0));
    }

    @Test
    void should_getGefaesstyp_work() {

        final String uuid = "8efeed81-85ae-458b-8de0-481ff38ac1d4";

        // act
        GefaesstypDto gefaesstyp = given()
                .header("API-Version", 1)
                .get(uuid)
                .then()
                .statusCode(200)
                .and()
                .extract()
                .as(GefaesstypDto.class);

        //
        assertAll(() -> assertNotNull(gefaesstyp), () -> assertEquals(uuid, gefaesstyp.getUuid()));
    }

    @Test
    void should_anlegen_return_403() {

        // arrange
        final GefaesstypDaten daten = GefaesstypDaten
                .builder()
                .volumen(50)
                .name("Gefäßtyp")
                .backgroundColor("#ccffff")
                .anzahl(4)
                .version(null)
                .build();

        final GefaesstypDto requestPayload = GefaesstypDto
                .builder()
                .uuid(UUID.randomUUID().toString())
                .daten(daten)
                .build();

        // act
        given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .post()
                .then()
                .statusCode(403);

    }

    void should_aendern_return_403() {

        // arrange
        final Gefaesstyp gefaesstyp = this.gefaesstypDao.findByUuid("6ff63774-ec09-496b-b7f5-ddb85bb2edc2");
        assertNotNull(gefaesstyp);

        // arrange 2
        final GefaesstypDaten daten = GefaesstypDaten
                .builder()
                .volumen(45)
                .name("Gefäßtyp 7")
                .backgroundColor("#ffccff")
                .anzahl(14)
                .version(0)
                .build();

        given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(daten)
                .put(gefaesstyp.getUuid())
                .then()
                .statusCode(403);
    }

    @Test
    void should_loeschen_return_403() {

        // arrange
        final String uuid = "ac29258e-a6be-49e1-8ae4-953cbb1fe1c0";

        // act 3
        given().header("API-Version", 1).delete(uuid).then().statusCode(403);
    }

}
