//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.session;

public interface AuthenticationContext {
  /**
   * Der user wird vom InitSecurityContextFilter in den AuthenticationContext gepackt und hier dann herausgeholt.
   *
   * @return AuthenticatedUser
   */
  AuthenticatedUser getUser();

  /**
   * @param role String
   * @return boolean
   */
  boolean isUserInRole(String role);

}
