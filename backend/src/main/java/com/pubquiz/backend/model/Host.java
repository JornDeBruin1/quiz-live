package com.pubquiz.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "hosts")
public class Host {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // unique: de database zelf weigert twee hosts met dezelfde gebruikersnaam
    @Column(unique = true, nullable = false)
    private String username;

    // Hier staat NOOIT het wachtwoord zelf, alleen de BCrypt-hash ervan
    @Column(nullable = false)
    private String passwordHash;

    protected Host() {
    }

    public Host(String id, String username, String passwordHash) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }
}