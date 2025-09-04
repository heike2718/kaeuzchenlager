//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.egladil.web.kaeuzchenlager.domain.validation.ValidationPatternsAndMessages;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Value;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Data
@Value
@AllArgsConstructor
@Builder
@Schema(name = "ErrorResponseDto", description = "ein Error-Objekt")
public class ErrorResponseDto {

    @JsonProperty
    @Schema(name = "errorLevel", examples = {"ERROR", "WARN"})
    ErrorLevel errorLevel;

    @JsonProperty
    @Pattern(
            regexp = ValidationPatternsAndMessages.KAEUZCHEN_INPUT_SECURED,
            message = "message enthält ungültige Zeichen"
    )
    @Schema(name = "message", examples = {"Es ist ein Fehler aufgetreten"})
    String message;
}
