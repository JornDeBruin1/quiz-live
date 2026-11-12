package com.pubquiz.backend.service;

import com.pubquiz.backend.model.Host;          
import com.pubquiz.backend.repository.HostRepository;   
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final HostRepository hostRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(HostRepository hostRepository, PasswordEncoder passwordEncoder) {
        this.hostRepository = hostRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Host register(String username, String password) {
        if (hostRepository.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Gebruikersnaam is al in gebruik");
        }

        String hash = passwordEncoder.encode(password);
        Host host = new Host(null, username, hash);
        try {
            return hostRepository.save(host);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Gebruikersnaam is al in gebruik");
        }
    }
}
