//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.session;

import de.egladil.web.kaeuzchenlager.domain.auth.config.SessionCookieConfig;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.NewCookie.SameSite;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class SessionUtils {

  public static final String ANONYME_UUID = "Anonym";

  public static final Logger LOGGER = LoggerFactory.getLogger(SessionUtils.class);

  public static AuthenticatedUser createAnonymousUser() {
    return new AuthenticatedUser(ANONYME_UUID).withFullName("Gast");
  }

  /**
   * Berechnet den expiresAt-Zeitpunkt mit dem gegebenen idle timout.
   *
   * @param sessionIdleTimeoutMinutes int Anzahl Minuten, nach denen eine Session als idle weggeräumt wird.
   * @return long
   */
  public static long getExpiresAt(final int sessionIdleTimeoutMinutes) {
    ZoneId zoneId = ZoneId.systemDefault();
    Instant instant = LocalDateTime.now(zoneId).plus(sessionIdleTimeoutMinutes, ChronoUnit.MINUTES).atZone(zoneId).toInstant();
    return Date.from(instant).getTime();

  }

  /**
   * Prüft, ob expiresAt bereits vorbei ist.
   * @param expiresAt long (time in milli seconds)
   * @return boolean
   */
  public static boolean isExpired(long expiresAt) {

    LocalDateTime expireDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(expiresAt), ZoneId.systemDefault())
        .plusSeconds(5); // bissel Toleranz lassen, oder?
    LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());
    return now.isAfter(expireDateTime);
  }

  /**
   * Holt die sessionId aus dem JSESSIONID-Cookie.
   * @param requestContext ContainerRequestContext
   * @param cookieConfig SessionCookieConfig
   * @return String
   */
  public static String getSessionId(final ContainerRequestContext requestContext, SessionCookieConfig cookieConfig) {
    return getSessionId(requestContext, cookieConfig.name());
  }

  private static String getSessionId(final ContainerRequestContext requestContext, String sessionCookieName) {
    String sessionIdFromCookie = getSessionIdFromCookie(requestContext, sessionCookieName);
    LOGGER.debug("sessionIdFromCookie={}", sessionIdFromCookie);

    return sessionIdFromCookie;

  }

  private static String getSessionIdFromCookie(final ContainerRequestContext requestContext, String sessionCookieName) {

    Map<String, Cookie> cookies = requestContext.getCookies();

    Cookie sessionCookie = cookies.get(sessionCookieName);

    if (sessionCookie != null) {

      return sessionCookie.getValue();
    }

    String path = requestContext.getUriInfo().getPath();
    LOGGER.debug("{}: Request ohne {}-Cookie", path, sessionCookieName);

    return null;
  }

  /**
   * Generiert ein SessionCookie.
   * @param cookieConfig SessionCookieConfig
   * @param value String
   * @return NewCookie
   */
  public static NewCookie createSessionCookie(SessionCookieConfig cookieConfig, final String value) {

    // @formatter:off
    return new NewCookie.Builder(cookieConfig.name())
        .path(cookieConfig.path())
        .sameSite(SameSite.valueOf(cookieConfig.sameSite()))
        .httpOnly(true)
        .secure(cookieConfig.secure())
        .value(value)
        .build();
    // @formatter:on
  }

  /**
   * Invalidiert das SessionCookie.
   * @param cookieConfig
   * @return
   */
  public static NewCookie createInvalidatedSessionCookie(SessionCookieConfig cookieConfig) {

    long dateInThePast = LocalDateTime.now(ZoneId.systemDefault()).minus(10, ChronoUnit.YEARS).toEpochSecond(
        ZoneOffset.UTC);

    // @formatter:off
    return new NewCookie.Builder(cookieConfig.name())
        .path(cookieConfig.path())
        .maxAge(0)
        .sameSite(SameSite.valueOf(cookieConfig.sameSite()))
        .httpOnly(true)
        .secure(cookieConfig.secure())
        .expiry(new Date(dateInThePast))
        .value("")
        .build();
    // @formatter:on

  }


}
