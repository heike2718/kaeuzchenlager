//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.session;

import de.egladil.web.egladil_secure_tokens.SecureRandomGenerator;
import de.egladil.web.kaeuzchenlager.domain.auth.jwt.JwtReader;
import de.egladil.web.kaeuzchenlager.domain.exception.KaeuzchenlagerRuntimeException;
import de.egladil.web.kaeuzchenlager.domain.exception.SessionExpiredException;
import io.quarkus.security.identity.SecurityIdentity;
import io.smallrye.jwt.auth.principal.JWTParser;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response.Status;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.concurrent.ConcurrentHashMap;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class SessionService {

  private static final Logger LOGGER = LoggerFactory.getLogger(SessionService.class);

  private final SecureRandomGenerator secureRandomGenerator = new SecureRandomGenerator();

  private ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();

  @ConfigProperty(name = "session.idle.timeout.minutes")
  int sessionIdleTimeoutMinutes;

  @ConfigProperty(name = "session.lifetime.seconds", defaultValue = "86400")
  int maxSessionLifetimeSeconds;

  @Inject
  JWTParser jwtParser;

  @Inject
  JwtReader jwtReader;

  @Inject
  SecurityIdentity securityIdentity;

  public Session initSession(final String rawJwt) {

    final JsonWebToken token;
    try {
      token = jwtParser.parse(rawJwt);
    } catch (Exception e) {
      throw new KaeuzchenlagerRuntimeException("JWT invalid", e);
    }

    final String uuid = jwtReader.getSubject(token);
    final String userIdReference =
        uuid.substring(0, 8) + "_" + secureRandomGenerator.generateSecureRandomHex(32);

    AuthenticatedUser authenticatedUser = new AuthenticatedUser(uuid).withFullName(
            jwtReader.getFullName(token)).withIdReference(userIdReference)
        .withRoles(jwtReader.getGroups(token));

    UserDto publicUser = UserDto.builder().fullName(authenticatedUser.getFullName()).roles(authenticatedUser.getRoles()).build();


    Session session = this.internalCreateAnonymousSession();
    session.setAuthenticatedUser(authenticatedUser);
    session.setUser(publicUser);
    session.setCreatedAt(System.currentTimeMillis());

    if (sessionIdleTimeoutMinutes == 0) {
      LOGGER.warn("session.idle.timeout.minutes=0 => verwenden default 120 min");
      session.setExpiresAt(SessionUtils.getExpiresAt(120));
    } else {
      session.setExpiresAt(SessionUtils.getExpiresAt(sessionIdleTimeoutMinutes));
    }

    session.setSessionActive(true);
    sessions.put(session.getSessionId(), session);

    LOGGER.info("Benutzer eingeloggt: {}", session.getAuthenticatedUser().toString());

    return session;
  }

  /**
   * Läd eine Session neu, sofern sie existiert.
   * @return Session
   * @throws WebApplicationException wenn es keine session gibt
   * @throws SessionExpiredException wenn sie abgelaufen ist oder ihr Lebensende überschritten hat.
   */
  public Session reloadSession() throws SessionExpiredException, WebApplicationException {

    String sessionId = this.getCurrentSessionId();

    if (sessionId != null) {
      Session session = sessions.get(sessionId);

      if (session != null) {
        checkExpiredOrDead(session);
        session.setExpiresAt(SessionUtils.getExpiresAt(sessionIdleTimeoutMinutes));
        return session;
      }
    }

    LOGGER.error("possible bot attack? keine session bekannt ");
    throw new WebApplicationException(Status.UNAUTHORIZED);
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

    checkExpiredOrDead(session);
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

      LOGGER.info("BenutzerDto ausgeloggt: {}", session.getAuthenticatedUser().toString());
    }
  }

  private String getCurrentSessionId() {
    return securityIdentity.getAttribute(SessionUtils.SESSION_ID_ATTRIBUTE_NAME);
  }

  private void checkExpiredOrDead(Session session) {
    int maxLifetime = this.maxSessionLifetimeSeconds == 0 ? 86400 : this.maxSessionLifetimeSeconds;
    LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());
    if (SessionUtils.isSessionExpieredOrDead(now, session, maxLifetime)) {
      LOGGER.info("expired or dead session");
      sessions.remove(session.getSessionId());
      throw new SessionExpiredException("Die Session ist abgelaufen. Bitte neu einloggen.");
    }
  }
}
