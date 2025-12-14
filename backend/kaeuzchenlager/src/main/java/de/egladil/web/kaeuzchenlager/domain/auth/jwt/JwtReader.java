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

  @Inject
  JsonWebToken jwt;

  /**
   *
   * @return String
   */
  public String getFullName() {
    return jwt.getClaim(Claims.full_name.name());
  }

  /**
   *
   * @return String[]
   */
  public String[] getGroups() {
    var groups = jwt.getGroups();
    return groups == null ? new String[0] : groups.toArray(new String[0]);
  }

  /**
   *
   * @return String
   */
  public String getSubject() {
    return jwt.getSubject();
  }
}
