// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.gefaesse;

import de.egladil.web.kaeuzchenlager.domain.exception.ConcurrentModificationException;
import de.egladil.web.kaeuzchenlager.domain.exception.EntityExistsException;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorClassification;
import de.egladil.web.kaeuzchenlager.domain.exception.ErrorType;
import de.egladil.web.kaeuzchenlager.domain.exception.HighLevelErrorClassifier;
import de.egladil.web.kaeuzchenlager.domain.exception.KaeuzchenlagerRuntimeException;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.dao.GefaesstypDao;
import de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities.Gefaesstyp;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** The type Gefaesstyp service. */
@ApplicationScoped
public class GefaesstypService {

  private static final String UK_NAME = "uk_gefaesstypen_name";

  private static final String UK_VOLUMEN = "uk_gefaesstypen_volumen";

  private static final String FAKE_USERE_UUID = "a003530f-97f9-4a5b-a0a3-f6f139522fa0";

  private static final Logger LOGGER = LoggerFactory.getLogger(GefaesstypService.class);

  //  @Inject SecurityContext securityContext;

  /* package-private for CDI */
  @Inject /* default */ GefaesstypDao gefaesstypDao;

  private final GefaesstypMapper gefaesstypMapper = new GefaesstypMapper();

  /**
   * Läd alle Gefäßtypen.
   *
   * @return List
   */
  public List<GefaesstypDto> loadGefaesstypen() {

    List<Gefaesstyp> gefaesstypen = this.gefaesstypDao.loadAll();
    return gefaesstypen.stream().map(this.gefaesstypMapper::toDto).toList();
  }

  /**
   * Legt einen neuen Gefäßtyp an.
   *
   * @param daten GefaesstypDaten
   * @return GefaesstypDto
   * @throws EntityExistsException - wenn es eine unique constraint violaton gibt
   * @throws KaeuzchenlagerRuntimeException - bei unerwarteten Exceptions
   */
  public GefaesstypDto gefaesstypAnlegen(GefaesstypDaten daten)
      throws EntityExistsException, KaeuzchenlagerRuntimeException {

    try {
      Gefaesstyp gefaesstyp = Gefaesstyp.builder().build();
      this.gefaesstypMapper.copyDaten(gefaesstyp, daten);
      // TODO
      gefaesstyp.setCreatedAt(LocalDateTime.now());
      gefaesstyp.setCreatedBy(FAKE_USERE_UUID);
      //            gefaesstyp.setCreatedBy(securityContext.getUserPrincipal().getName());
      return this.doPersist(gefaesstyp);
    } catch (Exception e) {
      ErrorClassification errorClassification = HighLevelErrorClassifier.classify(e);
      ErrorType errorType = errorClassification.getErrorType();
      switch (errorType) {
        case UNIQUE_CONSTRAINT:
          {
            String message = "";
            if (UK_NAME.equals(errorClassification.getUniqueConstraintName())) {
              message =
                  "Es gibt bereits einen Gefäßtyp mit diesem Namen. Bitte wähl einen anderen.";
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
          throw new KaeuzchenlagerRuntimeException(
              "unerwartete Exception beim Anlegen eines gefaesstyps: "
                  + errorClassification.getErrorMessage(),
              e);
        default:
          throw new KaeuzchenlagerRuntimeException(
              "ErrorTyp für die Exception konnte nicht ermittelt werden ("
                  + errorClassification.getErrorMessage()
                  + ")",
              e);
      }
    }
  }

  /**
   * Gefaesstyp aendern gefaesstyp dto.
   *
   * @param uuid String - the uuid
   * @param daten GefaesstypDaten - the daten
   * @return GefaesstypDto
   * @throws NotFoundException - wenn es keinen Gefaesstyp mit der gegebenen uuid gibt
   * @throws EntityExistsException - wenn es eine unique constraint violaton gibt
   * @throws KaeuzchenlagerRuntimeException - bei unerwarteten Exceptions
   */
  public GefaesstypDto gefaesstypAendern(String uuid, GefaesstypDaten daten)
      throws NotFoundException, EntityExistsException, KaeuzchenlagerRuntimeException {

    try {
      Optional<Gefaesstyp> optEntity = this.gefaesstypDao.findById(uuid);

      if (optEntity.isEmpty()) {
        LOGGER.error("gefaesstyp mit uuid {} existiert nicht", uuid);
        throw new NotFoundException();
      }

      Gefaesstyp entity = optEntity.get();
      this.gefaesstypMapper.copyDaten(entity, daten);
      // TODO hier securityContext nutzen!!!
      entity.setUpdatedBy(FAKE_USERE_UUID);
      entity.setUpdatedAt(LocalDateTime.now());
      return this.doPersist(entity);
    } catch (NotFoundException e) {
      throw e;
    } catch (Exception e) {
      ErrorClassification errorClassification = HighLevelErrorClassifier.classify(e);
      ErrorType errorType = errorClassification.getErrorType();
      switch (errorType) {
        case VERSION_CONFLICT:
          throw new ConcurrentModificationException(
              "Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.", e);
        case UNIQUE_CONSTRAINT:
          {
            String message =
                "Es gibt bereits einen Gefäßtyp mit diesem Namen. Bitte wähl einen anderen.";
            if (UK_VOLUMEN.equals(errorClassification.getUniqueConstraintName())) {
              message = "Es gibt bereits einen Gefäßtyp mit diesem Volumen.";
            }
            throw new EntityExistsException(message, e);
          }
        case TECHNICAL:
          throw new KaeuzchenlagerRuntimeException(
              "unerwartete Exception beim Anlegen eines gefaesstyps: "
                  + errorClassification.getErrorMessage(),
              e);
        default:
          throw new KaeuzchenlagerRuntimeException(
              "ErrorTyp für die Exception konnte nicht ermittelt werden ("
                  + errorClassification.getErrorMessage()
                  + ")",
              e);
      }
    }
  }

  /**
   * Gefaesstyp loeschen gefaesstyp loeschen result.
   *
   * @param uuid String - the uuid
   * @return GefaesstypLoeschenResult - auch im Fall, dass es die Entity nicht (mehr) gibt.
   * @throws KaeuzchenlagerRuntimeException - bei unerwarteten Exceptions
   */
  public GefaesstypLoeschenResult gefaesstypLoeschen(String uuid)
      throws KaeuzchenlagerRuntimeException {

    try {

      Optional<Gefaesstyp> optEntity = this.gefaesstypDao.findById(uuid);

      if (optEntity.isEmpty()) {
        LOGGER.warn("gefaesstyp mit uuid = {} existiert nicht oder nicht mehr", uuid);
        return GefaesstypLoeschenResult.builder().uuid(uuid).build();
      }

      this.gefaesstypDao.remove(optEntity.get());

      return GefaesstypLoeschenResult.builder().uuid(uuid).build();
    } catch (NotFoundException e) {
      throw e;
    } catch (Exception e) {
      ErrorClassification errorClassification = HighLevelErrorClassifier.classify(e);
      throw new KaeuzchenlagerRuntimeException(
          "Beim Löschen ist ein Fehler vom Typ "
              + errorClassification.getErrorType()
              + " aufgetreten ("
              + errorClassification.getErrorMessage()
              + ")",
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
  /* default */ GefaesstypDto doPersist(Gefaesstyp gefaesstyp) {

    Gefaesstyp persisted = gefaesstyp;

    if (gefaesstyp.getUuid() == null) {
      this.gefaesstypDao.insert(gefaesstyp);
    } else {
      persisted = this.gefaesstypDao.update(gefaesstyp);
    }

    return this.gefaesstypMapper.toDto(persisted);
  }
}
