//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.persistence.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "gefaesstypen")
@NamedQueries({
        @NamedQuery(name = Gefaesstyp.LOAD_ALL, query = "select g from Gefaesstyp g order by g.name asc"),
        @NamedQuery(name = Gefaesstyp.FIND_BY_VOLUMEN, query = "select g from Gefaesstyp g where g.volumen = :volumen")
})
public class Gefaesstyp {

   public static final String LOAD_ALL = "Gefaesstyp.LOAD_ALL";

   public static final String FIND_BY_VOLUMEN = "Gefaesstyp.FIND_BY_VOLUMEN";

    @Id
    @Column(name = "uuid")
    private String uuid;

    // Hinweis: Die deutsche Sortierung kommt aus der DB-Collation (utf8mb4_german2_ci am Spalten-Datentyp).
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
    @Column(name = "version", nullable = false)
    private int version;

    @PrePersist
    void prePersist() {
        if (this.uuid == null || this.uuid.isBlank()) {
            this.uuid = UUID.randomUUID().toString();
        }
    }
}
