// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Value;

@Data
@Value
@AllArgsConstructor
@Builder
public class ErrorClassification {

  ErrorType errorType;

  String uniqueConstraintName;

  String errorMessage;
}
