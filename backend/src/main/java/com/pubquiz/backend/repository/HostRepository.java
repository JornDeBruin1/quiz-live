package com.pubquiz.backend.repository;

import com.pubquiz.backend.model.Host;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HostRepository extends JpaRepository<Host, String> {

    // Spring bouwt deze queries zelf uit de methodenaam (findBy + het veld username)
    Optional<Host> findByUsername(String username);

    boolean existsByUsername(String username);
}