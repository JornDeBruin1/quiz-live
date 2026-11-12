package com.pubquiz.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final long GELDIG_MS = 8 * 60 * 60 * 1000L; // 8 uur

    private final SecretKey key;

    public JwtService(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String createToken(String hostId, String username) {
        Date nu = new Date();
        return Jwts.builder()
                .subject(hostId)
                .claim("username", username)
                .issuedAt(nu)
                .expiration(new Date(nu.getTime() + GELDIG_MS))
                .signWith(key)
                .compact();
    }

    /** Geeft de claims terug, of gooit een JwtException bij een ongeldig of verlopen token. */
    public Claims parse(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}