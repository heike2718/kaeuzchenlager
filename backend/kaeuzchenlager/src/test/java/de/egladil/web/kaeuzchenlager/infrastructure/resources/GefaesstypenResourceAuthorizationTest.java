// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDaten;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDto;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

@QuarkusTest
@TestHTTPEndpoint(GefaesstypenResource.class)
public class GefaesstypenResourceAuthorizationTest {

    @Test
    void should_loadGefaesstypen_be_rejected_when_not_authenticated() {

        given().header("API-Version", 1).contentType(ContentType.JSON).get().then().statusCode(401);

    }

    @Test
    void should_getGefaesstypWithId_be_rejected_when_not_authenticated() {

        String uuid = "8efeed81-85ae-458b-8de0-481ff38ac1d4";

        given().header("API-Version", 1).contentType(ContentType.JSON).get(uuid).then().statusCode(401);

    }

    @Test
    @TestSecurity(user = "cc73be9f-4fea-43ff-bff3-588fd1dae843", roles = { "ADMIN", "LEHRER" })
    void should_loadGefaesstypen_be_rejected_when_not_authorized() {

        given().header("API-Version", 1).contentType(ContentType.JSON).get().then().statusCode(403);

    }

    @Test
    @TestSecurity(user = "cc73be9f-4fea-43ff-bff3-588fd1dae843", roles = { "ADMIN", "LEHRER" })
    void should_getGefaesstypWithId_be_rejected_when_not_authorized() {

        String uuid = "8efeed81-85ae-458b-8de0-481ff38ac1d4";

        given().header("API-Version", 1).contentType(ContentType.JSON).get(uuid).then().statusCode(403);

    }

    @Test
    @TestSecurity(user = "cc73be9f-4fea-43ff-bff3-588fd1dae843", roles = { "ADMIN", "LEHRER" })
    void should_anlegen_be_rejected() {

        // arrange
        GefaesstypDaten daten = GefaesstypDaten
                .builder()
                .volumen(300)
                .name("Gefäßtyp 3")
                .backgroundColor("#ccffff")
                .anzahl(4)
                .version(null)
                .build();

        GefaesstypDto requestPayload = GefaesstypDto.builder().uuid(UUID.randomUUID().toString()).daten(daten).build();

        // act
        given()
                .header("API-Version", 1)
                .contentType(ContentType.JSON)
                .body(requestPayload)
                .post()
                .then()
                .statusCode(403);
    }

    @Test
    @TestSecurity(user = "cc73be9f-4fea-43ff-bff3-588fd1dae843", roles = { "ADMIN", "LEHRER" })
    void should_aendern_be_rejected() {

        // arrange
        GefaesstypDaten daten = GefaesstypDaten
                .builder()
                .volumen(2)
                .name("Gefäßtyp 9")
                .backgroundColor("#ccffff")
                .anzahl(4)
                .version(0)
                .build();

        String uuid = "8efeed81-85ae-458b-8de0-481ff38ac1d4";

        given().header("API-Version", 1).contentType(ContentType.JSON).body(daten).put(uuid).then().statusCode(403);

    }

    @Test
    @TestSecurity(user = "cc73be9f-4fea-43ff-bff3-588fd1dae843", roles = { "ADMIN", "LEHRER" })
    void should_loeschen_be_rejected() {

        // arrange
        String uuid = "8efeed81-85ae-458b-8de0-481ff38ac1d4";

        given().header("API-Version", 1).delete(uuid).then().statusCode(403);
    }
}
