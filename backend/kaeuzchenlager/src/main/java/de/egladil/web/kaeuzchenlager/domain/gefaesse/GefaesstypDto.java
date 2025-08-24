//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.gefaesse;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "GefaesstypDto", description = "Daten des Gefäßtyps")
public class GefaesstypDto {

    @JsonProperty
    @Pattern(regexp = "^[a-f\\d]{4}(?:[a-f\\d]{4}-){4}[a-f\\d]{12}|neu$", message = "uuid enthält ungültige Zeichen")
    private String uuid;

    @JsonProperty
    @NotBlank(message = "name ist erforderlich")
    @Size(max = 100, message = "name zu lang (max. {max} Zeichen)")
    private String name;

    @JsonProperty
    @Min(value = 0, message = "anzahl darf nicht kleiner als 0 sein.")
    private int anzahl;

    @NotBlank
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "backgroundColor muss ein hex-Farbcode sein")
    private String backgroundColor;
}
