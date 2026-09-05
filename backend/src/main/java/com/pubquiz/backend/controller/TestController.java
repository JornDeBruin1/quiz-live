package com.pubquiz.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TestController {

    // Luistert op /app/test (client stuurt), broadcast return-waarde naar /topic/test (alle clients ontvangen)
    @MessageMapping("/test")
    @SendTo("/topic/test")
    public String handleTestMessage(String message) {
        return "Server ontving: " + message;
    }
}