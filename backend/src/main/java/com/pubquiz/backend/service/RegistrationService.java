package com.pubquiz.backend.service;

import com.pubquiz.backend.exception.UsernameTakenException;
import com.pubquiz.backend.model.Host;
import com.pubquiz.backend.repository.HostRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {

    private final HostRepository hostRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationService(HostRepository hostRepository, PasswordEncoder passwordEncoder) {
        this.hostRepository = hostRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Host register(String username, String password) {
        if (hostRepository.existsByUsername(username)) {
            throw new UsernameTakenException();
        }

        String hash = passwordEncoder.encode(password);
        Host host = new Host(null, username, hash);
        try {
            return hostRepository.saveAndFlush(host);
        } catch (DataIntegrityViolationException e) {
            throw new UsernameTakenException();
        }
    }
}