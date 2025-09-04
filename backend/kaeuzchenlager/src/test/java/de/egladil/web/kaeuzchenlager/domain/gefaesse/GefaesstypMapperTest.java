//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.gefaesse;

import de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities.Gefaesstyp;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class GefaesstypMapperTest {

    private final GefaesstypMapper mapper = new GefaesstypMapper();

    @Test
    void should_toDtoMappAllAttributes() {

        // arrange
        Gefaesstyp entity = Gefaesstyp.builder()
                .volumen(200)
                .uuid("eb274a6b-8fff-4ee2-8471-80c14cd42323")
                .backgroundColor("#ff00ff")
                .name("Gefäßtyp 2")
                .anzahl(13)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .createdBy("fd94d590-d912-4ec3-9ac8-8d17069320be")
                .updatedBy("9381613b-a504-4046-aefb-d4bbf23281b5")
                .build();

        // act
        final GefaesstypDto dto = mapper.toDto(entity);

        final GefaesstypDaten daten = dto.getDaten();

        // assert
        assertAll(() -> assertEquals("eb274a6b-8fff-4ee2-8471-80c14cd42323", dto.getUuid()),
                () -> assertNotNull(daten),
                () -> assertEquals("Gefäßtyp 2", daten.getName()),
                () -> assertEquals(13, daten.getAnzahl()),
                () -> assertEquals(200, daten.getVolumen()),
                () -> assertEquals("#ff00ff", daten.getBackgroundColor()));
    }

    @Test
    void should_updateEntityFromDto_mapOnlyDaten() {

        // arrange
        GefaesstypDaten daten = GefaesstypDaten.builder()
                .volumen(200)
                .backgroundColor("#ff00ff")
                .name("Gefäßtyp 2")
                .anzahl(13)
                .build();

        Gefaesstyp entity = Gefaesstyp.builder().build();

        // act
        mapper.copyDaten(entity, daten);

        // assert
        assertAll(() -> assertNull(entity.getUuid()),
                () -> assertEquals("Gefäßtyp 2", entity.getName()),
                () -> assertEquals(13, entity.getAnzahl()),
                () -> assertEquals(200, entity.getVolumen()),
                () -> assertEquals("#ff00ff", entity.getBackgroundColor()),
                () -> assertNull(entity.getCreatedAt()),
                () -> assertNull(entity.getCreatedBy()),
                () -> assertNull(entity.getUpdatedAt()),
                () -> assertNull(entity.getUpdatedBy()));
    }
}
