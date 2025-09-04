//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.gefaesse;

import de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities.Gefaesstyp;

public class GefaesstypMapper {

    /**
     * Entity -> Dto.
     * @param entity Gefaesstyp
     * @return GefaesstypDto
     */
    public GefaesstypDto toDto(final Gefaesstyp entity) {

        GefaesstypDaten daten = GefaesstypDaten.builder()
                .anzahl(entity.getAnzahl())
                .name(entity.getName())
                .volumen(entity.getVolumen())
                .backgroundColor(entity.getBackgroundColor())
                .build();

        return GefaesstypDto.builder()
                .uuid(entity.getUuid())
                .daten(daten)
                .build();

    }

    /**
     * Übernimmt die Daten in die Entity.
     * @param target Gefaesstyp
     * @param source GefaesstypDto
     */
    public void copyDaten(final Gefaesstyp target, final GefaesstypDaten source) {
        target.setAnzahl(source.getAnzahl());
        target.setName(source.getName());
        target.setVolumen(source.getVolumen());
        target.setBackgroundColor(source.getBackgroundColor());
    }
}
