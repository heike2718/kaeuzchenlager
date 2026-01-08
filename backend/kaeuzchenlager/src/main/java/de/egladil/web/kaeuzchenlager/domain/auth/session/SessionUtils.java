// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.session;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.NewCookie.SameSite;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.kaeuzchenlager.domain.auth.config.SessionCookieConfig;

public final class SessionUtils {

    public static final String ANONYME_UUID = "Anonym";

    public static final String SESSION_ID_ATTRIBUTE_NAME = "sessionId";

    public static final Logger LOGGER = LoggerFactory.getLogger(SessionUtils.class);

    public static AuthenticatedUser createAnonymousUser() {
        return new AuthenticatedUser(ANONYME_UUID).withFullName("Gast");
    }

    /**
     * Berechnet den expiresAt-Zeitpunkt mit dem gegebenen idle timout.
     *
     * @param sessionIdleTimeoutMinutes int Anzahl Minuten, nach denen eine Session
     *                                  als idle weggeräumt wird.
     * @return long
     */
    public static long getExpiresAt(final int sessionIdleTimeoutMinutes) {
        ZoneId zoneId = ZoneId.systemDefault();
        Instant instant = LocalDateTime
                .now(zoneId)
                .plus(sessionIdleTimeoutMinutes, ChronoUnit.MINUTES)
                .atZone(zoneId)
                .toInstant();
        return Date.from(instant).getTime();

    }

    /**
     * Prüft, ob die session dead ist, weil sie ihr Lebensende erreicht hat oder
     * wegen Inaktivität gestorben ist.
     *
     * @param now               LocalDateTime
     * @param session           Session
     * @param maxSessionSeconds int maximale Lebenszeit in Sekunden
     * @return
     */
    public static boolean isSessionExpieredOrDead(LocalDateTime now, Session session, int maxSessionSeconds) {
        LocalDateTime expireDateTime = LocalDateTime
                .ofInstant(Instant.ofEpochMilli(session.getExpiresAt()), ZoneId.systemDefault())
                .plusSeconds(5); // bissel Toleranz lassen, oder?

        if (now.isAfter(expireDateTime)) {
            return true;
        }

        LocalDateTime lebensende = LocalDateTime
                .ofInstant(Instant.ofEpochMilli(session.getCreatedAt()), ZoneId.systemDefault())
                .plusSeconds(5 + maxSessionSeconds); // bissel Toleranz lassen, oder?

        if (now.isAfter(lebensende)) {
            return true;
        }

        return false;
    }

    /**
     * Generiert ein SessionCookie.
     *
     * @param cookieConfig SessionCookieConfig
     * @param value        String
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
     *
     * @param cookieConfig
     * @return
     */
    public static NewCookie createInvalidatedSessionCookie(SessionCookieConfig cookieConfig) {

        long dateInThePast = LocalDateTime
                .now(ZoneId.systemDefault())
                .minus(10, ChronoUnit.YEARS)
                .toEpochSecond(ZoneOffset.UTC);

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

    public static String getSessionId(final ContainerRequestContext requestContext, String sessionCookieName) {
        String sessionIdFromCookie = getSessionIdFromCookie(requestContext, sessionCookieName);
        LOGGER.debug("sessionIdFromCookie={}", sessionIdFromCookie);

        return sessionIdFromCookie;

    }

    /**
     * @param requestContext
     * @return String oder null
     */
    private static String getSessionIdFromCookie(final ContainerRequestContext requestContext,
            String sessionCookieName) {

        Map<String, Cookie> cookies = requestContext.getCookies();

        Cookie sessionCookie = cookies.get(sessionCookieName);

        if (sessionCookie != null) {

            return sessionCookie.getValue();
        }

        String path = requestContext.getUriInfo().getPath();
        LOGGER.debug("{}: Request ohne {}-Cookie", path, sessionCookieName);

        return null;
    }

}
