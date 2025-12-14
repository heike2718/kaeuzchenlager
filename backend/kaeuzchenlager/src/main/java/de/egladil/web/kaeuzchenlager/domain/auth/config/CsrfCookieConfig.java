//=====================================================
// Project: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================
package de.egladil.web.kaeuzchenlager.domain.auth.config;

import org.apache.commons.lang3.StringUtils;

import io.smallrye.config.ConfigMapping;

/**
 *
 */
@ConfigMapping(prefix = "csrf-cookie")
public interface CsrfCookieConfig {

	String name();

	String sameSite();

	boolean secure();

	String path();

	/**
	 * Base64 encoded. Muss also decoded werden.
	 * @return
	 */
	String signatureKey();

	default String toLog() {

		return "CsrfCookieConfig=[name=" + name() + ", path=" + path() + ", sameSite=" + sameSite() + ", secure=" + secure()
			+ ", secretKey=" + StringUtils.abbreviate(signatureKey(), 6) + "]";

	}

}
