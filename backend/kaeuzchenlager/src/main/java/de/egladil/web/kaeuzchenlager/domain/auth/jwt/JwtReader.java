//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.jwt;

import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Dependent
public class JwtReader {

  /**
   * @param jwt JsonWebToken
   * @return String
   */
  public String getFullName(JsonWebToken jwt) {
    return jwt.getClaim(Claims.full_name.name());
  }

  /**
   * @param jwt JsonWebToken
   * @return String[]
   */
  public String[] getGroups(JsonWebToken jwt) {
    var groups = jwt.getGroups();
    return groups == null ? new String[0] : groups.toArray(new String[0]);
  }

  /**
   * @param jwt JsonWebToken
   * @return String
   */
  public String getSubject(JsonWebToken jwt) {
    return jwt.getSubject();
  }
}
