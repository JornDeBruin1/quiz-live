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
    private final JwtService jwtService;

    public AuthService(HostRepository hostRepository,
                    PasswordEncoder passwordEncoder,
                    JwtService jwtService) {
        this.hostRepository = hostRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

    public String login(String username, String password) {
        Host host = hostRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Onjuiste gebruikersnaam of wachtwoord"));

        if (!passwordEncoder.matches(password, host.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Onjuiste gebruikersnaam of wachtwoord");
        }
        return jwtService.createToken(host.getId(), host.getUsername());
    }
}
