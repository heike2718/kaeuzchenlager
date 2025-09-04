//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.gefaesse;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.egladil.web.kaeuzchenlager.domain.validation.ValidationPatternsAndMessages;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Value;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Data
@AllArgsConstructor
@Value
@Builder
@Schema(name = "GefaesstypDaten", description = "Daten des Gefäßtyps")
public class GefaesstypDaten {

    @Schema(name = "name", description = "der Name und gleichzeitig fachlicher Schlüssel", examples = {"Gefäßtyp 7", "Gefäßtyp 10 ml"})
    @JsonProperty
    @NotBlank(message = "name ist erforderlich.")
    @Pattern(
            regexp = ValidationPatternsAndMessages.KAEUZCHEN_INPUT_SECURED,
            message = "name enthält ungültige Zeichen. " + ValidationPatternsAndMessages.INVALID_INPUT_MESSAGE_DETAILS
    )
    @Size(max = 100, message = "name ist zu lang (max. {max} Zeichen).")
    String name;

    @NotNull(message = "volumen ist erforderlich.")
    @Min(value = 1, message = "volumen muss mindestens {value} sein.")
    @Max(value = 9999, message = "volumen darf höchstens {value} sein.")
    Integer volumen;

    @Schema(name = "anzahl", description = "Anzahl Gefäße dieses Typs auf Lager", examples = {"23"})
    @JsonProperty
    @Min(value = 0, message = "anzahl darf nicht kleiner als {value} sein.")
    int anzahl;

    @Schema(name = "backgroundColor", description = "Hintergrundfarbe für die Kachel in der GUI", examples = {"#ff66ff"})
    @JsonProperty
    @NotNull(message = "backgroundColor ist erforderlich.")
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "backgroundColor muss ein hex-Farbcode sein.")
    String backgroundColor;
}
