package com.masar.controller;

import com.masar.model.AppUser;
import com.masar.model.ProfilePhoto;
import com.masar.repository.AppUserRepository;
import com.masar.repository.ProfilePhotoRepository;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.Set;
import java.util.concurrent.TimeUnit;

// Profile photo storage - one row per user (see ProfilePhoto), stored as a
// blob in MySQL rather than a file on disk. This app's docker-compose only
// gives the database a persistent volume (see docker-compose.yml); the
// backend container itself is rebuilt from scratch on every deploy, so
// anything written to its local filesystem would vanish on the next
// `docker-compose up --build`. The database is the one place this survives.
//
// Every endpoint here requires a logged-in user (see SecurityConfig) - even
// GET, so viewing someone's photo needs the same login the rest of the app
// already requires to see that person's name in the first place (Community
// members, Nearby Students, Activities...). A plain <img src> can't carry
// the Authorization header this app's JWT auth needs, so the frontend fetches
// these as an authenticated blob and turns that into an object URL - same
// trick ExportApi.downloadChecklistPdf already uses for the same reason.
@RestController
@RequestMapping("/api/profile-photo")
public class ProfilePhotoController {

    // Frontend always sends an already-cropped, compressed square (see
    // AvatarEditor.jsx), so real uploads land well under this - it's a
    // generous ceiling against something going wrong client-side, not the
    // expected size.
    private static final long MAX_BYTES = 5L * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final ProfilePhotoRepository photos;
    private final AppUserRepository users;

    public ProfilePhotoController(ProfilePhotoRepository photos, AppUserRepository users) {
        this.photos = photos;
        this.users = users;
    }

    public record PhotoStatus(boolean hasPhoto, String updatedAt) {}

    // ---- Me (the logged-in user can only ever change their own photo) ----

    @PostMapping("/me")
    public ResponseEntity<?> uploadMine(@RequestParam("file") MultipartFile file, Authentication auth) {
        AppUser me = currentUser(auth);

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please choose a photo to upload.");
        }
        if (file.getSize() > MAX_BYTES) {
            return ResponseEntity.badRequest().body("That photo is too large - please choose one under 5MB.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            return ResponseEntity.badRequest().body("Please upload a JPG, PNG, or WEBP image.");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Couldn't read that file - please try again.");
        }

        ProfilePhoto photo = photos.findById(me.getId()).orElseGet(ProfilePhoto::new);
        photo.setUserId(me.getId());
        photo.setImageData(bytes);
        photo.setContentType(contentType);
        photo.setUpdatedAt(Instant.now());
        photos.save(photo);

        return ResponseEntity.ok(new PhotoStatus(true, photo.getUpdatedAt().toString()));
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> removeMine(Authentication auth) {
        AppUser me = currentUser(auth);
        // existsById first - deleteById throws if there's nothing to delete,
        // and "remove my photo" should be a harmless no-op when there wasn't
        // one to begin with (e.g. a retried request).
        if (photos.existsById(me.getId())) {
            photos.deleteById(me.getId());
        }
        return ResponseEntity.ok(new PhotoStatus(false, null));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMine(Authentication auth) {
        AppUser me = currentUser(auth);
        return servePhoto(me.getId());
    }

    // ---- Any user (Community members, Nearby Students, Activities, chats -
    // everywhere else this app already shows another student's name) ----

    @GetMapping("/{userId}")
    public ResponseEntity<?> getForUser(@PathVariable Long userId) {
        return servePhoto(userId);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleTooLarge() {
        return ResponseEntity.badRequest().body("That photo is too large - please choose one under 5MB.");
    }

    private ResponseEntity<?> servePhoto(Long userId) {
        ProfilePhoto photo = photos.findById(userId).orElse(null);
        if (photo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(photo.getContentType()))
                // Short client cache - long enough to avoid refetching on every
                // re-render of a member list, short enough that a changed/removed
                // photo shows up again soon without needing a cache-busting param.
                .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES))
                .body(photo.getImageData());
    }

    private AppUser currentUser(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return users.findByEmail(email).orElseThrow();
    }
}
