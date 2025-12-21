// =====================================================
// Project: bv-admin
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.kaeuzchenlager.domain.auth.session;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

/**
 * Session
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {

	@JsonIgnore
	private String sessionId;

  @JsonIgnore
  private long createdAt;

	@JsonProperty
	private long expiresAt;

	@JsonProperty
	private boolean sessionActive;

	@JsonIgnore
	private String csrfTokenHmac;

	@JsonIgnore
	private AuthenticatedUser authenticatedUser;

  @JsonProperty
  private UserDto user;


	public static Session createAnonymous(final String sessionId) {

		Session session = new Session();
		session.sessionId = sessionId;
		session.sessionActive = false;
		return session;

	}

	@Override
	public String toString() {

		return "Session [sessionId=" + sessionId + ", expiresAt=" + expiresAt + ", admin=" + authenticatedUser
        + "]";
	}

	@JsonIgnore
	public boolean isAnonym() {

		return authenticatedUser == null;
	}

	@Override
	public int hashCode() {

		final int prime = 31;
		int result = 1;
		result = prime * result + ((sessionId == null) ? 0 : sessionId.hashCode());
		return result;
	}

	@Override
	public boolean equals(final Object obj) {

		if (this == obj) {

			return true;
		}

		if (!(obj instanceof Session)) {

			return false;
		}
		Session other = (Session) obj;

		if (sessionId == null) {

			if (other.sessionId != null) {

				return false;
			}
		} else if (!sessionId.equals(other.sessionId)) {

			return false;
		}
		return true;
	}
}
