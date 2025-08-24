//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.persistence.dao;

import de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities.Gefaesstyp;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;

@RequestScoped
public class GefaesstypDao {

    @Inject
    EntityManager entityManager;

    /**
     * Gibt den gefäßtyp mit der gegebenen Id zurück.
     *
     * @param uuid String der technische Schlüssel
     * @return Optional
     */
    public Optional<Gefaesstyp> findById(String uuid) {
        return Optional.ofNullable(entityManager.find(Gefaesstyp.class, uuid));
    }

    /**
     * Wie viele Gefäßtypen gibt es in der DB
     *
     * @return long
     */
    public long countAll() {
        String query = "select count(g) from Gefaesstyp g";
        return entityManager.createQuery(query, Long.class).getSingleResult();
    }

    /**
     * Läd eine gewisse Anzahl an Gefäßtypen ab einer bestimmten Position fürs Pagination.
     *
     * @param page int die Seitennummer
     * @param size int die Anzahl Gefäßtypen auf einer page
     * @return List
     */
    public List<Gefaesstyp> loadPage(int page, int size) {

        return entityManager.createNamedQuery(Gefaesstyp.LOAD_PAGE, Gefaesstyp.class).setFirstResult(page * size).setMaxResults(size).getResultList();
    }

    /**
     * Persistiert einen neuen Gefäßtyp.
     *
     * @param gefaesstyp Gefaesstyp
     */
    public void insert(Gefaesstyp gefaesstyp) {
        entityManager.persist(gefaesstyp);
    }

    /**
     * Ändert einen vorhandenen Gefäßtyp.
     *
     * @param gefaesstyp Gefaesstyp
     * @return Gefaesstyp
     */
    public Gefaesstyp update(Gefaesstyp gefaesstyp) {
        return entityManager.merge(gefaesstyp);
    }
}
