package com.pubquiz.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // /ws is het adres waar clients de WebSocket-verbinding openen (de "telefoonlijn")
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Alles naar /topic/... wordt automatisch doorgestuurd naar alle geabonneerde clients
        registry.enableSimpleBroker("/topic");
        // Berichten die een client naar de server stuurt, gaan naar /app/...
        registry.setApplicationDestinationPrefixes("/app");
    }
}