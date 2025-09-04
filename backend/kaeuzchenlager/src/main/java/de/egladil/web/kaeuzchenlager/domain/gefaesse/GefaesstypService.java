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
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.SecurityContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class GefaesstypService {

    private static final String UK_NAME = "uk_gefaesstypen_name";

    private static final String UK_VOLUMEN = "uk_gefaesstypen_volumen";

    private final String fakeUserUUID = "a003530f-97f9-4a5b-a0a3-f6f139522fa0";

    private static final Logger LOGGER = LoggerFactory.getLogger(GefaesstypService.class);

    @Inject
    SecurityContext securityContext;

    @Inject
    GefaesstypDao gefaesstypDao;

    private final GefaesstypMapper gefaesstypMapper = new GefaesstypMapper();

    public List<GefaesstypDto> loadGefaesstypen() {

        final List<Gefaesstyp> gefaesstypen = gefaesstypDao.loadAll();
        return gefaesstypen.stream().map(gefaesstypMapper::toDto).toList();
    }

    /**
     * Legt einen neuen Gefäßtyp an.
     *
     * @param daten GefaesstypDaten
     * @return GefaesstypDto
     */
    public GefaesstypDto gefaesstypAnlegen(GefaesstypDaten daten) {

        try {
            Gefaesstyp gefaesstyp = Gefaesstyp.builder().build();
            gefaesstypMapper.copyDaten(gefaesstyp, daten);
            // TODO
            gefaesstyp.setCreatedAt(LocalDateTime.now());
            gefaesstyp.setCreatedBy(fakeUserUUID);
//            gefaesstyp.setCreatedBy(securityContext.getUserPrincipal().getName());
            return doPersist(gefaesstyp);
        } catch (Exception e) {
            ErrorClassification errorClassification = HighLevelErrorClassifier.classify(e);
            ErrorType errorType = errorClassification.getErrorType();
            switch (errorType) {
                case UNIQUE_CONSTRAINT: {
                    String message = "";
                    if (UK_NAME.equals(errorClassification.getUniqueConstraintName())) {
                        message = "Es gibt bereits einen Gefäßtyp mit diesem Namen. Bitte wähl einen anderen.";
                    }
                    if (UK_VOLUMEN.equals(errorClassification.getUniqueConstraintName())) {
                        message = "Es gibt bereits einen Gefäßtyp mit diesem Volumen.";
                    }
                    if (message.isEmpty()) {
                        message = "Diesen Gefäßtyp gibt es schon.";
                        LOGGER.error("neues uk in der DB: {}", errorClassification.getUniqueConstraintName());
                    }
                    throw new EntityExistsException(message);
                }
                case TECHNICAL:
                    throw new KaeuzchenlagerRuntimeException("unerwartete Exception beim Anlegen eines gefaesstyps: " + errorClassification.getErrorMessage(), e);
            }
            throw new KaeuzchenlagerRuntimeException("ErrorTyp für die Exception konnte nicht ermittelt werden (" + errorClassification.getErrorMessage() + ")", e);
        }
    }

    public GefaesstypDto gefaesstypAendern(String uuid, GefaesstypDaten daten) {

        try {
            final Optional<Gefaesstyp> optEntity = gefaesstypDao.findById(uuid);

            if (optEntity.isEmpty()) {
                LOGGER.error("gefaesstyp mit uuid {} existiert nicht", uuid);
                throw new NotFoundException();
            }

            Gefaesstyp entity = optEntity.get();
            gefaesstypMapper.copyDaten(entity, daten);
            // TODO hier securityContext nutzen!!!
            entity.setUpdatedBy(fakeUserUUID);
            entity.setUpdatedAt(LocalDateTime.now());
            return doPersist(entity);
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            ErrorClassification errorClassification = HighLevelErrorClassifier.classify(e);
            ErrorType errorType = errorClassification.getErrorType();
            switch (errorType) {
                case VERSION_CONFLICT:
                    throw new ConcurrentModificationException("Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.");
                case UNIQUE_CONSTRAINT: {
                    String message = "Es gibt bereits einen Gefäßtyp mit diesem Namen. Bitte wähl einen anderen.";
                    if (UK_VOLUMEN.equals(errorClassification.getUniqueConstraintName())) {
                        message = "Es gibt bereits einen Gefäßtyp mit diesem Volumen.";
                    }
                    throw new EntityExistsException(message);
                }
                case TECHNICAL:
                    throw new KaeuzchenlagerRuntimeException("unerwartete Exception beim Anlegen eines gefaesstyps: " + errorClassification.getErrorMessage(), e);
            }
            throw new KaeuzchenlagerRuntimeException("ErrorTyp für die Exception konnte nicht ermittelt werden (" + errorClassification.getErrorMessage() + ")", e);
        }
    }

    public GefaesstypLoeschenResult gefaesstypLoeschen(String uuid) {

        try {

            final Optional<Gefaesstyp> optEntity = gefaesstypDao.findById(uuid);

            if (optEntity.isEmpty()) {
                LOGGER.warn("gefaesstyp mit uuid = {} existiert nicht", uuid);
                throw new NotFoundException();
            }

            gefaesstypDao.remove(optEntity.get());

            return GefaesstypLoeschenResult.builder().uuid(uuid).build();
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            ErrorClassification errorClassification = HighLevelErrorClassifier.classify(e);
            throw new KaeuzchenlagerRuntimeException("Beim Löschen ist ein Fehler vom Typ " + errorClassification.getErrorType()
                    + " aufgetreten (" + errorClassification.getErrorMessage() + ")", e);
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
