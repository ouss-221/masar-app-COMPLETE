// Picks the right-language field off a section or checklist item, falling
// back to French if a translation is missing for some reason.

export function pickSectionTitle(section, lang) {
  if (!section) return '';
  if (lang === 'en') return section.titleEn || section.titleFr;
  if (lang === 'ar') return section.titleAr || section.titleFr;
  if (lang === 'es') return section.titleEs || section.titleFr;
  return section.titleFr;
}

export function pickSectionContent(section, lang) {
  if (!section) return '';
  if (lang === 'en') return section.contentHtmlEn || section.contentHtml;
  if (lang === 'ar') return section.contentHtmlAr || section.contentHtml;
  if (lang === 'es') return section.contentHtmlEs || section.contentHtml;
  return section.contentHtml;
}

export function pickGroupName(item, lang) {
  if (!item) return '';
  if (lang === 'en') return item.groupNameEn || item.groupName;
  if (lang === 'ar') return item.groupNameAr || item.groupName;
  if (lang === 'es') return item.groupNameEs || item.groupName;
  return item.groupName;
}

export function pickItemText(item, lang) {
  if (!item) return '';
  if (lang === 'en') return item.textEn || item.text;
  if (lang === 'ar') return item.textAr || item.text;
  if (lang === 'es') return item.textEs || item.text;
  return item.text;
}

export function pickUniDescription(u, lang) {
  if (!u) return '';
  if (lang === 'en') return u.descriptionEn || u.descriptionFr;
  if (lang === 'ar') return u.descriptionAr || u.descriptionFr;
  return u.descriptionFr;
}

export function pickUniFields(u, lang) {
  if (!u) return '';
  if (lang === 'en') return u.fieldsEn || u.fieldsFr;
  if (lang === 'ar') return u.fieldsAr || u.fieldsFr;
  return u.fieldsFr;
}

export function pickUniTuitionNote(u, lang) {
  if (!u) return '';
  if (lang === 'en') return u.tuitionNoteEn || u.tuitionNoteFr;
  if (lang === 'ar') return u.tuitionNoteAr || u.tuitionNoteFr;
  return u.tuitionNoteFr;
}

export function pickNote(section, nationality) {
  if (!section) return null;
  if (nationality === 'ma') return section.noteMa || null;
  if (nationality === 'tn') return section.noteTn || null;
  return section.noteDz || null;
}
