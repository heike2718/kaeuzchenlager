//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.session;

import jakarta.enterprise.context.RequestScoped;
import java.util.Arrays;

@RequestScoped
public class AuthenticationContextImpl implements AuthenticationContext {

  private AuthenticatedUser user;

  @Override
  public AuthenticatedUser getUser() {
    return this.user;
  }

  @Override
  public boolean isUserInRole(String role) {
    if (SessionUtils.ANONYME_UUID.equals(this.user.getName())) {
      return false;
    }
    long count = Arrays.stream(this.user.getRoles()).filter(r -> r.equalsIgnoreCase(role)).count();
    return count > 0;
  }

  public void setUser(AuthenticatedUser user) {
    this.user = user;
  }
}
