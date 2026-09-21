package com.masar.controller;

import com.masar.model.AppUser;
import com.masar.repository.AppUserRepository;
import com.masar.service.PdfExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final ChecklistController checklistController;
    private final PdfExportService pdfExportService;
    private final AppUserRepository users;

    public ExportController(ChecklistController checklistController,
                             PdfExportService pdfExportService,
                             AppUserRepository users) {
        this.checklistController = checklistController;
        this.pdfExportService = pdfExportService;
        this.users = users;
    }

    @GetMapping("/checklist.pdf")
    public ResponseEntity<byte[]> checklistPdf(Authentication auth) throws Exception {
        String email = (String) auth.getPrincipal();
        AppUser user = users.findByEmail(email).orElseThrow();

        byte[] pdf = pdfExportService.buildChecklistPdf(user.getDisplayName(), checklistController.myChecklist(null, auth));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=masar-checklist.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
