package de.egladil.web.kaeuzchenlager.infrastructure.security;

import io.quarkus.security.identity.request.AuthenticationRequest;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public record SessionAuthenticationRequest(String sessionId, Map<String, Object> attributes)
    implements AuthenticationRequest {

  public SessionAuthenticationRequest(String sessionId) {
    this(sessionId, new ConcurrentHashMap<>());
  }

  @SuppressWarnings("unchecked")
  @Override
  public <T> T getAttribute(String name) {
    return (T) attributes.get(name);
  }

  @Override
  public void setAttribute(String name, Object value) {
    if (value == null) {
      attributes.remove(name);
    } else {
      attributes.put(name, value);
    }
  }

  @Override
  public Map<String, Object> getAttributes() {
    return attributes;
  }
}
