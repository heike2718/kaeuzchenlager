// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.persistence.dao;

import de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities.Gefaesstyp;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** The type Gefaesstyp dao. */
@RequestScoped
public class GefaesstypDao {

  private static final Logger LOGGER = LoggerFactory.getLogger(GefaesstypDao.class);

  /** The Entity manager. */
  @Inject /*default*/ EntityManager entityManager;

  /**
   * Gibt den gefäßtyp mit der gegebenen Id zurück.
   *
   * @param uuid String der technische Schlüssel
   * @return Optional
   */
  public Optional<Gefaesstyp> findById(final String uuid) {
    return Optional.ofNullable(entityManager.find(Gefaesstyp.class, uuid));
  }

  /**
   * Wie viele Gefäßtypen gibt es in der DB.
   *
   * @return long
   */
  @SuppressWarnings("unused")
  public long countAll() {
    final String query = "select count(g) from Gefaesstyp g";
    return entityManager.createQuery(query, Long.class).getSingleResult();
  }

  /**
   * Läd eine gewisse Anzahl an Gefäßtypen ab einer bestimmten Position fürs Pagination. Sortiert
   * wird aufsteigend nach name.
   *
   * @param page int die Seitennummer
   * @param size int die Anzahl Gefäßtypen auf einer page
   * @return List
   */
  @SuppressWarnings("unused")
  public List<Gefaesstyp> loadPage(final int page, final int size) {

    return entityManager
        .createNamedQuery(Gefaesstyp.LOAD_ALL, Gefaesstyp.class)
        .setFirstResult(page * size)
        .setMaxResults(size)
        .getResultList();
  }

  /**
   * Läd alle Gefäßtypen. Sortiert wird nach name.
   *
   * @return List
   */
  public List<Gefaesstyp> loadAll() {

    return entityManager.createNamedQuery(Gefaesstyp.LOAD_ALL, Gefaesstyp.class).getResultList();
  }

  /**
   * Gibt den Gefäßtyp mit der gegebenen uuid zurück.
   * @param uuid String technische ID
   * @return Gefaesstyp oder null
   */
  public Gefaesstyp findByUuid(String uuid) {

    return entityManager.find(Gefaesstyp.class, uuid);
  }

  /**
   * Persistiert einen neuen Gefäßtyp.
   *
   * @param gefaesstyp Gefaesstyp
   */
  public void insert(final Gefaesstyp gefaesstyp) {
    entityManager.persist(gefaesstyp);
  }

  /**
   * Ändert einen vorhandenen Gefäßtyp.
   *
   * @param gefaesstyp Gefaesstyp
   * @return Gefaesstyp
   */
  public Gefaesstyp update(final Gefaesstyp gefaesstyp) {
    return entityManager.merge(gefaesstyp);
  }

  /**
   * Löscht die gegebene Entity.
   *
   * @param entity Gefaesstyp
   */
  @Transactional
  public void remove(final Gefaesstyp entity) {
    Gefaesstyp result = entity;
    if (!entityManager.contains(result)) {
      result = entityManager.merge(entity);
      LOGGER.info("====> entity merged into the persistence context");
    }
    entityManager.remove(result);
    LOGGER.info("====> entity with uuid {} deleted", entity.getUuid());
  }
}
