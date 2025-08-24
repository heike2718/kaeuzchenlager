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

        return GefaesstypDto.builder()
                .uuid(entity.getUuid())
                .anzahl(entity.getAnzahl())
                .name(entity.getName())
                .backgroundColor(entity.getBackgroundColor())
                .build();

    }

    /**
     * Dto -> entity
     * @param dto GefaesstypDto
     * @return GefaesstypDto
     */
    public Gefaesstyp toEntity(final GefaesstypDto dto) {
        return Gefaesstyp.builder()
                .uuid(dto.getUuid())
                .anzahl(dto.getAnzahl())
                .name(dto.getName())
                .backgroundColor(dto.getBackgroundColor())
                .build();
    }

    /**
     * Übernimmt alles außer der uuid in die Entity.
     * @param entity Gefaesstyp
     * @param dto GefaesstypDto
     */
    public void updateEntityFromDto(final Gefaesstyp entity, final GefaesstypDto dto) {
        entity.setAnzahl(dto.getAnzahl());
        entity.setName(dto.getName());
        entity.setBackgroundColor(dto.getBackgroundColor());
    }
}
