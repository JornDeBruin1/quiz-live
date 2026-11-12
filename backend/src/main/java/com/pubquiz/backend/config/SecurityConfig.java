package com.pubquiz.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORS: gebruik de bestaande instellingen uit WebConfig
                .cors(Customizer.withDefaults())
                // CSRF-bescherming is bedoeld voor cookie-sessies. Wij gaan tokens in een
                // header gebruiken, dus we schakelen het uit.
                .csrf(csrf -> csrf.disable())
                // Voorlopig alles toestaan; in stap 4 sluiten we alleen de host-endpoints af
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}