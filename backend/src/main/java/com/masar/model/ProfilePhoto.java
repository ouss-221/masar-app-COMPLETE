package com.masar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

// Deliberately its own table rather than columns on AppUser: the image bytes
// would otherwise get pulled into memory on every AppUser fetch (login,
// every "who is this" lookup across Community/Nearby/Activities...), even
// though almost none of those call sites care about the photo. Same pattern
// this app already uses for other per-user extras (UserLocation,
// ChecklistProgress) - a separate row, looked up only when the photo is
// actually needed.
//
// The primary key IS the user's id (no separate identity/FK column) - at
// most one photo per user, and "does this user have a photo" is just an
// existsById check.
@Entity
@Table(name = "profile_photos")
@Data
public class ProfilePhoto {

    @Id
    private Long userId;

    @Lob
    @Column(name = "image_data", nullable = false, columnDefinition = "MEDIUMBLOB")
    private byte[] imageData;

    @Column(nullable = false, length = 40)
    private String contentType;

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();
}
