package com.pubquiz.backend.model;

// Generiek "envelop"-formaat voor alles wat we over WebSocket sturen.
// De frontend kijkt naar "type" om te weten hoe hij "payload" moet interpreteren.
public class GameEvent {

    private String type;
    private Object payload;

    public GameEvent(String type, Object payload) {
        this.type = type;
        this.payload = payload;
    }

    public String getType() {
        return type;
    }

    public Object getPayload() {
        return payload;
    }
}