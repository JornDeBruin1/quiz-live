package com.pubquiz.backend.service;

import com.pubquiz.backend.model.Host;
import com.pubquiz.backend.repository.HostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LoginService {

    private final HostRepository hostRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginService(HostRepository hostRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService) {
        this.hostRepository = hostRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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