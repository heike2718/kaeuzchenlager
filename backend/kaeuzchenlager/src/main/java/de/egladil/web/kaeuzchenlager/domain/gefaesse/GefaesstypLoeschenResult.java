//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.gefaesse;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.egladil.web.kaeuzchenlager.domain.validation.ValidationPatternsAndMessages;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Value;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Data
@AllArgsConstructor
@Value
@Builder
@Schema(name = "GefaesstypLoeschenResult", description = "Transportiert die uuid des gelöschten Gefäßtyps zurück zum Client")
public class GefaesstypLoeschenResult {

    @Schema(name = "uuid", description = "technischer Schlüssel", examples = {"7975c6c3-d1c3-4000-b720-82a2d1f6d521"})
    @JsonProperty
    @Pattern(
            regexp = ValidationPatternsAndMessages.TECHNISCHE_ID,
            message = "uuid enthält ungültige Zeichen")
    String uuid;

}
