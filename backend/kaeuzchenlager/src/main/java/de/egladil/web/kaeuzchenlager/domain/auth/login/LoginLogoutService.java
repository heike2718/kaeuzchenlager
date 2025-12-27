//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.login;

import de.egladil.web.kaeuzchenlager.domain.auth.clientauth.OAuthClientCredentials;
import de.egladil.web.kaeuzchenlager.domain.auth.clientauth.OAuthClientCredentialsProvider;
import de.egladil.web.kaeuzchenlager.domain.auth.config.SessionCookieConfig;
import de.egladil.web.kaeuzchenlager.domain.auth.csrf.CsrfCookieService;
import de.egladil.web.kaeuzchenlager.domain.auth.dto.AuthResult;
import de.egladil.web.kaeuzchenlager.domain.auth.dto.MessagePayload;
import de.egladil.web.kaeuzchenlager.domain.auth.session.Session;
import de.egladil.web.kaeuzchenlager.domain.auth.session.SessionService;
import de.egladil.web.kaeuzchenlager.domain.auth.session.SessionUtils;
import java.util.Locale;
import java.util.ResourceBundle;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

/**
 * LoginLogoutService
 */
@RequestScoped
public class LoginLogoutService {

  private static final Logger LOGGER = LoggerFactory.getLogger(LoginLogoutService.class);

  private final ResourceBundle applicationMessages = ResourceBundle.getBundle("ApplicationMessages", Locale.GERMAN);

  @Inject
  SessionCookieConfig sessionCookieConfig;

  @Inject
  OAuthClientCredentialsProvider clientCredentialsProvider;

  @Inject
  SessionService sessionService;

  @Inject
  CsrfCookieService csrfCookieService;

  @Inject
  TokenExchangeService tokenExchangeService;

  /**
   * Erzeugt eine Session.
   * @param authResult
   * @return Response
   */
  public Response login(final AuthResult authResult) {

    if (authResult == null) {

      LOGGER.warn("login wurde ohne payload aufgerufen");

      throw new WebApplicationException(Status.BAD_REQUEST);
    }

    String oneTimeToken = authResult.getIdToken();

    LOGGER.info("idToken={}", StringUtils.abbreviate(oneTimeToken, 11));

    OAuthClientCredentials clientCredentials = clientCredentialsProvider.getClientCredentials(null);

    String jwt = this.tokenExchangeService.exchangeTheOneTimeToken(clientCredentials.getClientId(),
        clientCredentials.getClientSecret(), oneTimeToken);

    Session session = this.sessionService.initSession(jwt);

    if (session.isAnonym()) {

      LOGGER.warn("anonyme sessions sind nicht erlaubt => 401");

      return Response.status(Status.FORBIDDEN).entity(MessagePayload.error(applicationMessages.getString("not.authorized")))
          .build();
    }

    NewCookie sessionCookie = SessionUtils.createSessionCookie(sessionCookieConfig, session.getSessionId());
    NewCookie csrfTokenCookie = csrfCookieService.createCsrfTokenCookie(session.getSessionId());

    LOGGER.debug("session created for user {}", StringUtils.abbreviate(session.getAuthenticatedUser().getName(), 11));

    return Response.ok(session).cookie(sessionCookie).cookie(csrfTokenCookie).build();
  }

  /**
   * Entfernt die Session.
   * @param sessionId
   * @return
   */
  public Response logout(final String sessionId) {

    this.sessionService.invalidateSession(sessionId);

    NewCookie invalidatedSessionCookie = SessionUtils.createInvalidatedSessionCookie(sessionCookieConfig);
    NewCookie invalidatedCsrfTokenCookie = csrfCookieService.createInvalidatedCsrfTokenCookie();
    return Response.ok(MessagePayload.info("erfolgreich ausgeloggt")).cookie(invalidatedSessionCookie)
        .cookie(invalidatedCsrfTokenCookie).build();
  }
}
