// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.gefaesse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import io.quarkus.security.identity.SecurityIdentity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.kaeuzchenlager.domain.exception.ConcurrentModificationException;
import de.egladil.web.kaeuzchenlager.domain.exception.EntityExistsException;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorClassification;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorType;
import de.egladil.web.kaeuzchenlager.domain.exception.HighLevelErrorClassifier;
import de.egladil.web.kaeuzchenlager.domain.exception.KaeuzchenlagerRuntimeException;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.dao.GefaesstypDao;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities.Gefaesstyp;

/** The type Gefaesstyp service. */
@ApplicationScoped
public class GefaesstypService {

    private static final String UK_NAME = "uk_gefaesstypen_name";

    private static final String UK_VOLUMEN = "uk_gefaesstypen_volumen";

    private static final Logger LOGGER = LoggerFactory.getLogger(GefaesstypService.class);

    @Inject
    SecurityIdentity securityIdentity;

    /* package-private for CDI */
    @Inject
    /* default */ GefaesstypDao gefaesstypDao;

    private final GefaesstypMapper gefaesstypMapper = new GefaesstypMapper();

    /**
     * Läd alle Gefäßtypen.
     *
     * @return List
     */
    public List<GefaesstypDto> loadGefaesstypen() {

        final List<Gefaesstyp> gefaesstypen = this.gefaesstypDao.loadAll();
        return gefaesstypen.stream().map(this.gefaesstypMapper::toDto).toList();
    }

    /**
     * @param uuid String
     * @return Optional
     */
    public Optional<GefaesstypDto> findGefaesstyp(String uuid) {

        Gefaesstyp gefaesstyp = this.gefaesstypDao.findByUuid(uuid);
        return gefaesstyp != null ? Optional.of(this.gefaesstypMapper.toDto(gefaesstyp)) : Optional.empty();
    }

    /**
     * Legt einen neuen Gefäßtyp an.
     *
     * @param gefaesstypDto GefaesstypDto
     * @return GefaesstypDto
     * @throws EntityExistsException          - wenn es eine unique constraint
     *                                        violaton gibt
     * @throws KaeuzchenlagerRuntimeException - bei unerwarteten Exceptions
     */
    public GefaesstypDto gefaesstypAnlegen(final GefaesstypDto gefaesstypDto)
            throws EntityExistsException, KaeuzchenlagerRuntimeException {

        try {
            final Gefaesstyp gefaesstyp = Gefaesstyp.builder().build();
            this.gefaesstypMapper.copyDaten(gefaesstyp, gefaesstypDto.getDaten());
            gefaesstyp.setCreatedAt(LocalDateTime.now());
            // TODO
            gefaesstyp.setCreatedBy(securityIdentity.getPrincipal().getName());
            return this.doInsert(gefaesstyp);
        } catch (Exception e) {
            final ErrorClassification errorClassification = HighLevelErrorClassifier.classify(e);
            final ErrorType errorType = errorClassification.getErrorType();
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
                throw new EntityExistsException(message, e);
            }
            case TECHNICAL:
                throw new KaeuzchenlagerRuntimeException("unerwartete Exception beim Anlegen eines gefaesstyps: "
                        + errorClassification.getErrorMessage(), e);
            default:
                // nothing
            }
            throw new KaeuzchenlagerRuntimeException("ErrorTyp für die Exception konnte nicht ermittelt werden ("
                    + errorClassification.getErrorMessage() + ")", e);
        }
    }

    /**
     * Gefaesstyp aendern gefaesstyp dto.
     *
     * @param uuid  String - the uuid
     * @param daten GefaesstypDaten - the daten
     * @return GefaesstypDto
     * @throws NotFoundException              - wenn es keinen Gefaesstyp mit der
     *                                        gegebenen uuid gibt
     * @throws EntityExistsException          - wenn es eine unique constraint
     *                                        violaton gibt
     * @throws KaeuzchenlagerRuntimeException - bei unerwarteten Exceptions
     */
    public GefaesstypDto gefaesstypAendern(final String uuid, final GefaesstypDaten daten)
            throws NotFoundException, EntityExistsException, KaeuzchenlagerRuntimeException {

        try {
            final Optional<Gefaesstyp> optEntity = this.gefaesstypDao.findById(uuid);

            if (optEntity.isEmpty()) {
                LOGGER.error("gefaesstyp mit uuid {} existiert nicht", uuid);
                throw new NotFoundException();
            }

            final Gefaesstyp entity = optEntity.get();

            if (daten.getVersion() != null && daten.getVersion() < entity.getVersion()) {
                throw new ConcurrentModificationException(
                        "Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.");
            }

            this.gefaesstypMapper.copyDaten(entity, daten);
            entity.setUpdatedBy(securityIdentity.getPrincipal().getName());
            entity.setUpdatedAt(LocalDateTime.now());
            return this.doUpdate(entity);
        } catch (NotFoundException | ConcurrentModificationException e) {
            throw e;
        } catch (Exception e) {
            final ErrorClassification errorClassification = HighLevelErrorClassifier.classify(e);
            final ErrorType errorType = errorClassification.getErrorType();
            switch (errorType) {
            case VERSION_CONFLICT:
                throw new ConcurrentModificationException(
                        "Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.", e);
            case UNIQUE_CONSTRAINT: {
                String message = "Es gibt bereits einen Gefäßtyp mit diesem Namen. Bitte wähl einen anderen.";
                if (UK_VOLUMEN.equals(errorClassification.getUniqueConstraintName())) {
                    message = "Es gibt bereits einen Gefäßtyp mit diesem Volumen.";
                }
                throw new EntityExistsException(message, e);
            }
            case TECHNICAL:
                throw new KaeuzchenlagerRuntimeException("unerwartete Exception beim Anlegen eines gefaesstyps: "
                        + errorClassification.getErrorMessage(), e);
            default:
                // nothing
            }
            throw new KaeuzchenlagerRuntimeException("ErrorTyp für die Exception konnte nicht ermittelt werden ("
                    + errorClassification.getErrorMessage() + ")", e);
        }
    }

    /**
     * Gefaesstyp loeschen gefaesstyp loeschen result.
     *
     * @param uuid String - the uuid
     * @return GefaesstypLoeschenResult - auch im Fall, dass es die Entity nicht
     *         (mehr) gibt.
     * @throws KaeuzchenlagerRuntimeException - bei unerwarteten Exceptions
     */
    public void gefaesstypLoeschen(final String uuid) throws KaeuzchenlagerRuntimeException {

        try {

            final Optional<Gefaesstyp> optEntity = this.gefaesstypDao.findById(uuid);

            if (optEntity.isEmpty()) {
                LOGGER.warn("gefaesstyp mit uuid = {} existiert nicht oder nicht mehr", uuid);
                return;
            }

            this.gefaesstypDao.remove(optEntity.get());
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            final ErrorClassification errorClassification = HighLevelErrorClassifier.classify(e);
            throw new KaeuzchenlagerRuntimeException(
                    "Beim Löschen ist ein Fehler vom Typ " + errorClassification.getErrorType() + " aufgetreten ("
                            + errorClassification.getErrorMessage() + ")",
                    e);
        }
    }

    /**
     * Do persist gefaesstyp dto.
     *
     * @param gefaesstyp Gefaesstyp - der zu löschende
     * @return GefaesstypDto
     */
    // package-private wegen transactional
    @Transactional
    /* default */ GefaesstypDto doInsert(final Gefaesstyp gefaesstyp) {

        Gefaesstyp persisted = gefaesstyp;
        this.gefaesstypDao.insert(gefaesstyp);
        return this.gefaesstypMapper.toDto(persisted);
    }

    /**
     * Do persist gefaesstyp dto.
     *
     * @param gefaesstyp Gefaesstyp - der zu löschende
     * @return GefaesstypDto
     */
    // package-private wegen transactional
    @Transactional
    /* default */ GefaesstypDto doUpdate(final Gefaesstyp gefaesstyp) {

        Gefaesstyp persisted = this.gefaesstypDao.update(gefaesstyp);
        return this.gefaesstypMapper.toDto(persisted);
    }

}
