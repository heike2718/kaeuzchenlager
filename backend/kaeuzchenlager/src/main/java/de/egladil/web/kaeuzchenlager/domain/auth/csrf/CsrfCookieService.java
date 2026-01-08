// =====================================================
// Project: bv-admin
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.kaeuzchenlager.domain.auth.csrf;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.NewCookie.SameSite;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.egladil_secure_tokens.SignedTokenGenerator;
import de.egladil.web.egladil_secure_tokens.SignedTokenValidationFailedException;
import de.egladil.web.egladil_secure_tokens.SignedTokenValidator;
import de.egladil.web.kaeuzchenlager.domain.auth.config.CsrfCookieConfig;

/**
 * CsrfCookieService
 */
@ApplicationScoped
public class CsrfCookieService {

    private static final Logger LOGGER = LoggerFactory.getLogger(CsrfCookieService.class);

    @Inject
    CsrfCookieConfig csrfCookieConfig;

    /**
     * @param requestContext
     * @return String oder null
     */
    public String getXsrfTokenFromCookie(final ContainerRequestContext requestContext) {

        Map<String, Cookie> cookies = requestContext.getCookies();

        Cookie csrfTokenCookie = cookies.get(csrfCookieConfig.name());

        if (csrfTokenCookie != null) {

            return csrfTokenCookie.getValue();
        }

        String path = requestContext.getUriInfo().getPath();
        LOGGER.debug("{}: Request ohne {}-Cookie", path, csrfCookieConfig.name());

        return null;
    }

    /**
     * Verifiziert die Signatur des tokens.
     *
     * @param sessionId String
     * @param token     String
     * @return boolean
     */
    public boolean verifyCsrfToken(String sessionId, String token) {

        SignedTokenValidator tokenValidator = new SignedTokenValidator();

        try {
            tokenValidator.verifyToken(token, sessionId, getSignatureKey());
            return true;
        } catch (SignedTokenValidationFailedException e) {
            LOGGER.warn(e.getMessage());
            return false;
        }
    }

    /**
     * @param sessionId
     * @return NewCookie
     */
    public NewCookie createCsrfTokenCookie(String sessionId) {

        SignedTokenGenerator tokenGenerator = new SignedTokenGenerator();
        String cookieValue = tokenGenerator.generateToken(sessionId, getSignatureKey());

        // @formatter:off
		return new NewCookie.Builder(csrfCookieConfig.name())
			.value(cookieValue)
			.path(csrfCookieConfig.path())
			.sameSite(SameSite.valueOf(csrfCookieConfig.sameSite()))
			.httpOnly(false)
			.secure(csrfCookieConfig.secure())
			.build();
		// @formatter:on
    }

    /**
     * @return NewCookie
     */
    public NewCookie createInvalidatedCsrfTokenCookie() {

        long dateInThePast = LocalDateTime
                .now(ZoneId.systemDefault())
                .minus(10, ChronoUnit.YEARS)
                .toEpochSecond(ZoneOffset.UTC);

        // @formatter:off
		return new NewCookie.Builder(csrfCookieConfig.name())
			.path(csrfCookieConfig.path())
			.maxAge(0)
			.sameSite(SameSite.valueOf(csrfCookieConfig.sameSite()))
			.httpOnly(false)
			.secure(csrfCookieConfig.secure())
			.expiry(new Date(dateInThePast))
			.value("")
			.build();
		// @formatter:on
    }

    private byte[] getSignatureKey() {
        return Base64.getDecoder().decode(csrfCookieConfig.signatureKey());
    }
}
