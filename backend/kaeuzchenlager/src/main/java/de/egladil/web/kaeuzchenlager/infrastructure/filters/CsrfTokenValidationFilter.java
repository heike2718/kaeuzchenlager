// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.filters;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.apache.commons.lang3.StringUtils;

import de.egladil.web.egladil_secure_tokens.TimeconstantStringComparator;
import de.egladil.web.kaeuzchenlager.domain.auth.csrf.CsrfCookieService;
import de.egladil.web.kaeuzchenlager.domain.auth.dto.MessagePayload;
import de.egladil.web.kaeuzchenlager.domain.auth.session.SessionService;
import de.egladil.web.kaeuzchenlager.domain.auth.session.SessionUtils;

@Provider
@PreMatching
public class CsrfTokenValidationFilter implements ContainerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(CsrfTokenValidationFilter.class);

    private static final String INVALID_CSRF_RESPONSE_PAYLOD = "CSRF-Token-Validierung fehlgeschlagen";

    private static final String KEINE_GUELTIGE_SESSION = "keine gueltige Session";

    private static final List<String> SECURE_HTTP_METHODS = Arrays.asList(new String[] { "OPTIONS", "GET", "HEAD" });

    /**
     * Erst nach dem login ist csrf-protection erforderlich. Weiter erst einmal
     * keine Einschränkungen auf Pfade.
     */
    private static final List<String> SECURE_PATHS = Arrays
            .asList(new String[] { "/api", "/api/session/login", "/api/session/logout" });

    @ConfigProperty(name = "csrf-header-name")
    String csrfHeaderName;

    // Aus irgendeinem Grund ist es nicht möglich, hier die SessionCookieConfig zu
    // injecten. Keine Ahnung warum.
    @ConfigProperty(name = "session-cookie.name")
    String sessionCookieName;

    @ConfigProperty(name = "csrf.validation.enabled")
    boolean csrfEnabled;

    @Inject
    SessionService sessionservice;

    @Inject
    CsrfCookieService csrfCookieService;

    @Override
    public void filter(final ContainerRequestContext requestContext) throws IOException {

        LOGGER.debug("entering filter");

        if (!csrfEnabled) {
            return;
        }

        String path = requestContext.getUriInfo().getPath();
        String method = requestContext.getMethod();

        if (SECURE_HTTP_METHODS.contains(method) || SECURE_PATHS.contains(path)) {
            return;
        }

        String sessionId = SessionUtils.getSessionId(requestContext, sessionCookieName);
        if (sessionId == null) {
            LOGGER.warn("session == null bei {} path={}", method, path);
            requestContext.abortWith(Response.status(403).entity(MessagePayload.error(KEINE_GUELTIGE_SESSION)).build());
        }

        if (!this.compareCookieAndHeader(requestContext)) {
            requestContext
                    .abortWith(Response.status(403).entity(MessagePayload.error(INVALID_CSRF_RESPONSE_PAYLOD)).build());
        }

        if (!this.verifyCsrfTokenSignature(requestContext, sessionId)) {
            LOGGER.warn("Verifizierung der csrfTokenCookie-Signatur schlug fehl bei {} path={}", method, path);
            requestContext
                    .abortWith(Response.status(403).entity(MessagePayload.error(INVALID_CSRF_RESPONSE_PAYLOD)).build());
        }

    }

    boolean compareCookieAndHeader(ContainerRequestContext requestContext) {

        String csrfCookieValue = csrfCookieService.getXsrfTokenFromCookie(requestContext);

        String path = requestContext.getUriInfo().getPath();
        String method = requestContext.getMethod();

        if (StringUtils.isBlank(csrfCookieValue)) {
            LOGGER.warn("csrfTokenCookie == null bei {} path={}", method, path);
            return false;
        }

        List<String> csrfTokenHeader = requestContext.getHeaders().get(csrfHeaderName);

        if (csrfTokenHeader == null || csrfTokenHeader.isEmpty()) {
            LOGGER.warn("csrfTokenHeader == null oder csrfTokenHeader.size() == 0 bei {} path={}", method, path);
            return false;
        }

        String headerValue = csrfTokenHeader.get(0);

        if (!identifyAsEquals(headerValue, csrfCookieValue)) {

            LOGGER
                    .warn("cookieValue != headerValue: [headerValue={}, cookieValue={}, path={}", headerValue,
                            csrfCookieValue, path);
            return false;
        }

        return true;
    }

    boolean verifyCsrfTokenSignature(ContainerRequestContext requestContext, String sessionId) {
        String csrfCookieValue = csrfCookieService.getXsrfTokenFromCookie(requestContext);
        return csrfCookieService.verifyCsrfToken(sessionId, csrfCookieValue);
    }

    boolean identifyAsEquals(final String headerValue, final String cookieValue) {

        String strippedHeaderValue = headerValue;

        // ist irgendwie komisch, aber der headerValue kommt mit Anführungszeichen.
        if (headerValue.contains("\"")) {

            strippedHeaderValue = headerValue.replaceAll("\"", "");
        }

        return new TimeconstantStringComparator().isEqual(strippedHeaderValue, cookieValue);
    }
}
