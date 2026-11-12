package com.pubquiz.backend.controller;

import com.pubquiz.backend.api.AuthApi;
import com.pubquiz.backend.api.model.HostResponse;
import com.pubquiz.backend.api.model.LoginRequest;
import com.pubquiz.backend.api.model.LoginResponse;
import com.pubquiz.backend.api.model.RegisterRequest;
import com.pubquiz.backend.mapper.HostMapper;
import com.pubquiz.backend.model.Host;
import com.pubquiz.backend.service.LoginService;
import com.pubquiz.backend.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController implements AuthApi {

    private final RegistrationService registrationService;
    private final LoginService loginService;

    public AuthController(RegistrationService registrationService, LoginService loginService) {
        this.registrationService = registrationService;
        this.loginService = loginService;
    }

    @Override
    public ResponseEntity<HostResponse> registerHost(RegisterRequest request) {
        Host host = registrationService.register(request.getUsername(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).body(HostMapper.toResponse(host));
    }

    @Override
    public ResponseEntity<LoginResponse> loginHost(LoginRequest request) {
        String token = loginService.login(request.getUsername(), request.getPassword());
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUsername(request.getUsername());
        return ResponseEntity.ok(response);
    }
}