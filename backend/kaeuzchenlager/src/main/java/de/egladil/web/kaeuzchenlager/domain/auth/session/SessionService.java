//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.session;

import de.egladil.web.egladil_secure_tokens.SecureRandomGenerator;
import de.egladil.web.kaeuzchenlager.domain.auth.jwt.JwtReader;
import de.egladil.web.kaeuzchenlager.domain.exception.SessionExpiredException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import java.util.concurrent.ConcurrentHashMap;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class SessionService {

  private static final Logger LOGGER = LoggerFactory.getLogger(SessionService.class);

  private final SecureRandomGenerator secureRandomGenerator = new SecureRandomGenerator();

  private ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();

  @ConfigProperty(name = "session.idle.timeout")
  int sessionIdleTimeoutMinutes;

  @Context
  ContainerRequestContext requestContext;

  @Inject
  AuthenticationContext authCtx;

  @Inject
  JwtReader jwtReader;

  public Session initSession(final String ignoredRawJwt) {
    final String uuid = jwtReader.getSubject();
    final String userIdReference =
        uuid.substring(0, 8) + "_" + secureRandomGenerator.generateSecureRandomHex(32);

    AuthenticatedUser authenticatedUser = new AuthenticatedUser(uuid).withFullName(
        jwtReader.getFullName()).withIdReference(userIdReference).withRoles(jwtReader.getGroups());

    Session session = this.internalCreateAnonymousSession().withUser(authenticatedUser);

    if (sessionIdleTimeoutMinutes == 0) {
      LOGGER.warn("session.idle.timeout=0 => verwenden default 120 min");
      session.setExpiresAt(SessionUtils.getExpiresAt(120));
    } else {
      session.setExpiresAt(SessionUtils.getExpiresAt(sessionIdleTimeoutMinutes));
    }

    session.setSessionActive(true);
    sessions.put(session.getSessionId(), session);

    LOGGER.info("Benutzer eingeloggt: {}", session.getUser().toString());

    return session;
  }

  private Session internalCreateAnonymousSession() {

    String sessionId = secureRandomGenerator.generateSecureRandomHex(32);
    return Session.createAnonymous(sessionId);
  }

  /**
   * Tut eben das.
   *
   * @param sessionId String
   * @return Session
   */
  public Session getAndRefreshSessionIfValid(String sessionId) {
    Session session = sessions.get(sessionId);

    if (session == null) {

      return null;
    }

    if (SessionUtils.isExpired(session.getExpiresAt())) {

      sessions.remove(sessionId);
      throw new SessionExpiredException("Die Session ist abgelaufen. Bitte neu einloggen.");
    }

    session.setExpiresAt(SessionUtils.getExpiresAt(sessionIdleTimeoutMinutes));

    return session;
  }

  /**
   * Löscht die Session.
   *
   * @param sessionId String
   */
  public void invalidateSession(final String sessionId) {

    if (sessionId == null) {

      LOGGER.debug("invalidateSession ohne sessionId aufgerufen");
      return;
    }

    Session session = this.sessions.remove(sessionId);

    if (session != null && !session.isAnonym()) {

      LOGGER.info("BenutzerDto ausgeloggt: {}", session.getUser().toString());
    }
  }
}
