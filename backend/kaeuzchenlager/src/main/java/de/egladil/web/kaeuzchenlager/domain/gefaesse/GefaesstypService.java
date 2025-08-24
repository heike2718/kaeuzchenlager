//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.gefaesse;

import de.egladil.web.kaeuzchenlager.domain.exception.*;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.dao.GefaesstypDao;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities.Gefaesstyp;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.SecurityContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class GefaesstypService {

    private static final Logger LOGGER = LoggerFactory.getLogger(GefaesstypService.class);

    @Inject
    SecurityContext securityContext;

    @Inject
    GefaesstypDao gefaesstypDao;

    private final GefaesstypMapper gefaesstypMapper = new GefaesstypMapper();

    /**
     * Legt einen neuen Gefäßtyp an.
     *
     * @param gefaesstypDto GefaesstypDto
     * @return GefaesstypDto
     */
    public GefaesstypDto createNewGefaesstyp(GefaesstypDto gefaesstypDto) {

        try {
            Gefaesstyp gefaesstyp = gefaesstypMapper.toEntity(gefaesstypDto);
            gefaesstyp.setCreatedBy(securityContext.getUserPrincipal().getName());
            return doPersist(gefaesstyp);
        } catch (Exception e) {
            ErrorType errorType = HighLevelErrorClassifier.classify(e);
            switch (errorType) {
                case VERSION_CONFLICT: throw new ConcurrentUpdateException("Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.");
                case UNIQUE_CONSTRAINT: throw new EntityExistsException("Es gibt bereits einen Gefäßtyp mit diesem Namen. Bitte wähle einen anderen.");
                case TECHNICAL: throw new KaeuzchenlagerRuntimeException("", e);
            }
            throw new KaeuzchenlagerRuntimeException("ErrorTyp für die Exception konnte nicht ermittelt werden (" + e.getMessage() + ")", e);
        }
    }

    @Transactional
    GefaesstypDto doPersist(Gefaesstyp gefaesstyp) {

        Gefaesstyp persisted = gefaesstyp;

        if (gefaesstyp.getUuid() == null) {
            gefaesstypDao.insert(gefaesstyp);
        } else {
            persisted = gefaesstypDao.update(gefaesstyp);
        }

        return gefaesstypMapper.toDto(persisted);
    }
}
