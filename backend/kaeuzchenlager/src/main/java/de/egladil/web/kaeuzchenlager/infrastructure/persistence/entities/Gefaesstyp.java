// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

/** The type Gefaesstyp. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "gefaesstypen")
@NamedQueries({
  @NamedQuery(name = Gefaesstyp.LOAD_ALL, query = "select g from Gefaesstyp g order by g.name asc"),
  @NamedQuery(
      name = Gefaesstyp.FIND_BY_VOLUMEN,
      query = "select g from Gefaesstyp g where g.volumen = :volumen")
})
public class Gefaesstyp {

  /** The constant LOAD_ALL. */
  public static final String LOAD_ALL = "Gefaesstyp.LOAD_ALL";

  /** The constant FIND_BY_VOLUMEN. */
  public static final String FIND_BY_VOLUMEN = "Gefaesstyp.FIND_BY_VOLUMEN";

  @Id
  @Column(name = "uuid")
  private String uuid;

  // Hinweis: Die deutsche Sortierung kommt aus der DB-Collation (utf8mb4_german2_ci am
  // Spalten-Datentyp).
  @Column(name = "name")
  private String name;

  @Column(name = "volumen")
  private Integer volumen;

  @Column(name = "anzahl")
  private int anzahl;

  @Column(name = "background_color")
  private String backgroundColor;

  // Von DB gepflegt: DEFAULT CURRENT_TIMESTAMP
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  // Von DB gepflegt: ON UPDATE CURRENT_TIMESTAMP
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "updated_by")
  private String updatedBy;

  // Optimistic Locking
  @Version
  @Column(name = "version")
  private int version;

  /** Pre persist. */
  @SuppressWarnings("unused")
  @PrePersist
  void prePersist() {
    if (StringUtils.isBlank(this.uuid)) {
      this.uuid = UUID.randomUUID().toString();
    }
  }
}
