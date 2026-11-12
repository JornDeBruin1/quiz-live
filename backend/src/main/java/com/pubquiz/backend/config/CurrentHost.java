package com.pubquiz.backend.config;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

// Enige plek die weet waar het host-id in de security-context staat
@Component
public class CurrentHost {

    public String id() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth instanceof AnonymousAuthenticationToken) {
            throw new IllegalStateException("Geen ingelogde host");
        }
        return auth.getName(); // het host-id, door JwtAuthFilter als principal gezet
    }
}