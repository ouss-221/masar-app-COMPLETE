package com.masar.service;

import com.masar.controller.ChecklistController.ChecklistView;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Exports the user's checklist as a simple PDF they can save or print.
 * Kept deliberately plain here - your thesis project's PAdES/RSA signing code
 * (for legally-signed documents) isn't needed for a personal checklist export,
 * but the same PDFBox building blocks (PDDocument, PDPageContentStream) carry
 * straight over if a future feature ever needs a signed document.
 */
@Service
public class PdfExportService {

    public byte[] buildChecklistPdf(String userName, List<ChecklistView> items) throws IOException {
        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            PDType1Font bold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font regular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            Map<String, List<ChecklistView>> grouped = items.stream()
                    .collect(Collectors.groupingBy(ChecklistView::groupName, LinkedHashMap::new, Collectors.toList()));

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                float y = 780;
                float left = 50;

                cs.beginText();
                cs.setFont(bold, 18);
                cs.newLineAtOffset(left, y);
                cs.showText("Masar - My move to Spain checklist");
                cs.endText();
                y -= 22;

                cs.beginText();
                cs.setFont(regular, 10);
                cs.newLineAtOffset(left, y);
                cs.showText((userName == null || userName.isBlank() ? "" : userName + " - "));
                cs.endText();
                y -= 26;

                for (Map.Entry<String, List<ChecklistView>> group : grouped.entrySet()) {
                    if (y < 80) break; // keep this first version to one page; paginate later if needed

                    cs.beginText();
                    cs.setFont(bold, 13);
                    cs.newLineAtOffset(left, y);
                    cs.showText(group.getKey());
                    cs.endText();
                    y -= 18;

                    for (ChecklistView item : group.getValue()) {
                        String box = item.done() ? "[x] " : "[ ] ";
                        cs.beginText();
                        cs.setFont(regular, 11);
                        cs.newLineAtOffset(left + 10, y);
                        cs.showText(box + truncate(item.text(), 90));
                        cs.endText();
                        y -= 16;
                        if (y < 60) break;
                    }
                    y -= 10;
                }
            }

            doc.save(out);
            return out.toByteArray();
        }
    }

    private String truncate(String s, int max) {
        return s.length() <= max ? s : s.substring(0, max - 1) + "...";
    }
}
