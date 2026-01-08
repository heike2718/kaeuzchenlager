// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

import jakarta.validation.constraints.Pattern;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import com.fasterxml.jackson.annotation.JsonProperty;

import de.egladil.web.kaeuzchenlager.domain.validation.ValidationPatternsAndMessages;

import lombok.Builder;
import lombok.Value;

/** The type Error response dto. */
@Value
@Builder
@lombok.extern.jackson.Jacksonized
@Schema(name = "ErrorResponseDto", description = "ein Error-Objekt")
public class ErrorResponseDto {

    @JsonProperty
    @Schema(name = "errorLevel", examples = { "ERROR", "WARN" })
    ErrorLevel errorLevel;

    @JsonProperty
    @Pattern(
            regexp = ValidationPatternsAndMessages.KAEUZCHEN_INPUT_SECURED,
            message = "message enthält ungültige Zeichen")
    @Schema(name = "message", examples = { "Es ist ein Fehler aufgetreten" })
    String message;
}
