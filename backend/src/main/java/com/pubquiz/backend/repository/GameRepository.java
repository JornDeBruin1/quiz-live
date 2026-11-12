package com.pubquiz.backend.repository;

import com.pubquiz.backend.model.Game;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, String> {

    // Haalt het spel op én vergrendelt de rij tot het einde van de transactie.
    // Een tweede request voor hetzelfde spel wacht tot de eerste klaar is.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select g from Game g where g.gameCode = :gameCode")
    Optional<Game> findForUpdate(@Param("gameCode") String gameCode);

    // Spring bouwt de query zelf uit de methodenaam (findBy + het veld gameState).
    // Ook vergrendeld, omdat de timer de spellen wijzigt.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<Game> findByGameState(String gameState);
}