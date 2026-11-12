package com.pubquiz.backend.mapper;

import com.pubquiz.backend.api.model.HostResponse;
import com.pubquiz.backend.model.Host;

public class HostMapper {
    public static HostResponse toResponse(Host host) {
        HostResponse r = new HostResponse();
        r.setId(host.getId());
        r.setUsername(host.getUsername());
        return r;
    }
}
