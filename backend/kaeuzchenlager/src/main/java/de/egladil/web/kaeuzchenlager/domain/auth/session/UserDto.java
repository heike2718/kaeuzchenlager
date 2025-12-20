//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.session;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

@Data
@Value
@AllArgsConstructor
@Builder
public class UserDto {

  @JsonProperty
  private String fullName;      // claim full_name

  @JsonProperty
  private String[] roles;       // groups -> roles

  @JsonProperty
  private boolean anonym;
}
