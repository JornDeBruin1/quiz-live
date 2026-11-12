package com.pubquiz.backend.repository;

import com.pubquiz.backend.model.Quiz;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

// Geen methodes nodig: JpaRepository levert save, findById, findAll, delete, enz.
// De twee typen: de entity (Quiz) en het type van zijn primary key (String).
public interface QuizRepository extends JpaRepository<Quiz, String> {
    List<Quiz> findByOwnerId(String ownerId);
}