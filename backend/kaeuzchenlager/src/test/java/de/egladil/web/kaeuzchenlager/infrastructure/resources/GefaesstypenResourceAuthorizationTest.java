//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import static io.restassured.RestAssured.given;

import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDaten;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDto;
import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import java.util.UUID;
import org.junit.jupiter.api.Test;

@QuarkusTest
@TestHTTPEndpoint(GefaesstypenResource.class)
@TestSecurity(user = "cc73be9f-4fea-43ff-bff3-588fd1dae843", roles = {"ADMIN", "LEHRER"})
public class GefaesstypenResourceAuthorizationTest {

  @Test
  void should_alle_laden_be_rejected() {

    given()
        .header("API-Version", 1)
        .contentType(ContentType.JSON)
        .get()
        .then()
        .statusCode(403);

  }

  @Test
  void should_getGefaesstypWithId_be_rejected() {

    String uuid = "8efeed81-85ae-458b-8de0-481ff38ac1d4";

    given()
        .header("API-Version", 1)
        .contentType(ContentType.JSON)
        .get(uuid)
        .then()
        .statusCode(403);

  }


  @Test
  void should_anlegen_be_rejected() {

    // arrange
    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(300)
            .name("Gefäßtyp 3")
            .backgroundColor("#ccffff")
            .anzahl(4)
            .version(null)
            .build();

    GefaesstypDto requestPayload = GefaesstypDto.builder().uuid(UUID.randomUUID().toString())
        .daten(daten).build();

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
  void should_aendern_be_rejected() {

    // arrange
    GefaesstypDaten daten =
        GefaesstypDaten.builder()
            .volumen(2)
            .name("Gefäßtyp 9")
            .backgroundColor("#ccffff")
            .anzahl(4)
            .version(0)
            .build();

    String uuid = "8efeed81-85ae-458b-8de0-481ff38ac1d4";

    given()
        .header("API-Version", 1)
        .contentType(ContentType.JSON)
        .body(daten)
        .put(uuid)
        .then()
        .statusCode(403);

  }

  @Test
  void should_loeschen_be_rejected() {

    // arrange
    String uuid = "8efeed81-85ae-458b-8de0-481ff38ac1d4";

    given()
        .header("API-Version", 1)
        .delete(uuid)
        .then()
        .statusCode(403);
  }
}
