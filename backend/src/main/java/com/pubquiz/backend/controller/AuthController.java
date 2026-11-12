package com.pubquiz.backend.controller;

import com.pubquiz.backend.api.AuthApi;
import com.pubquiz.backend.api.model.HostResponse;
import com.pubquiz.backend.api.model.RegisterRequest;
import com.pubquiz.backend.mapper.HostMapper;
import com.pubquiz.backend.model.Host;          
import com.pubquiz.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController implements AuthApi {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public ResponseEntity<HostResponse> registerHost(RegisterRequest request) {
        Host host = authService.register(request.getUsername(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).body(HostMapper.toResponse(host));
    }
}
