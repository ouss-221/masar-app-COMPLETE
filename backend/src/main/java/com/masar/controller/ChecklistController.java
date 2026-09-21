package com.masar.controller;

import com.masar.model.AppUser;
import com.masar.model.ChecklistItem;
import com.masar.model.ChecklistProgress;
import com.masar.repository.AppUserRepository;
import com.masar.repository.ChecklistItemRepository;
import com.masar.repository.ChecklistProgressRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/checklist")
public class ChecklistController {

    private final ChecklistItemRepository items;
    private final ChecklistProgressRepository progress;
    private final AppUserRepository users;

    public ChecklistController(ChecklistItemRepository items,
                                ChecklistProgressRepository progress,
                                AppUserRepository users) {
        this.items = items;
        this.progress = progress;
        this.users = users;
    }

    public record ChecklistView(Long itemId, String groupName, String groupNameEn, String groupNameAr, String groupNameEs,
                                 String text, String textEn, String textAr, String textEs, boolean done) {}
    public record ToggleRequest(boolean done) {}

    // GET /api/checklist              -> Spain checklist (default), merged with this user's done/not-done state
    // GET /api/checklist?country=fr   -> that destination's checklist instead - steps genuinely differ by country
    @GetMapping
    public List<ChecklistView> myChecklist(@RequestParam(required = false) String country, Authentication auth) {
        AppUser user = currentUser(auth);
        Map<Long, Boolean> doneMap = progress.findByUser(user).stream()
                .collect(Collectors.toMap(p -> p.getChecklistItem().getId(), ChecklistProgress::isDone));

        return items.findAllByCountryOrderByOrderIndexAsc(country == null ? "es" : country).stream()
                .map(i -> new ChecklistView(i.getId(), i.getGroupName(), i.getGroupNameEn(), i.getGroupNameAr(), i.getGroupNameEs(),
                        i.getText(), i.getTextEn(), i.getTextAr(), i.getTextEs(),
                        doneMap.getOrDefault(i.getId(), false)))
                .toList();
    }

    // PUT /api/checklist/{itemId}  -> tick or untick one item
    @PutMapping("/{itemId}")
    public ChecklistView toggle(@PathVariable Long itemId, @RequestBody ToggleRequest req, Authentication auth) {
        AppUser user = currentUser(auth);
        ChecklistItem item = items.findById(itemId).orElseThrow();

        ChecklistProgress p = progress.findByUserAndChecklistItem_Id(user, itemId).orElseGet(() -> {
            ChecklistProgress np = new ChecklistProgress();
            np.setUser(user);
            np.setChecklistItem(item);
            return np;
        });
        p.setDone(req.done());
        p.setDoneAt(req.done() ? Instant.now() : null);
        progress.save(p);

        return new ChecklistView(item.getId(), item.getGroupName(), item.getGroupNameEn(), item.getGroupNameAr(), item.getGroupNameEs(),
                item.getText(), item.getTextEn(), item.getTextAr(), item.getTextEs(), p.isDone());
    }

    private AppUser currentUser(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return users.findByEmail(email).orElseThrow();
    }
}
