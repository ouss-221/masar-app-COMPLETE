package com.masar.seed;

import com.masar.model.ChecklistItem;
import com.masar.model.Section;
import com.masar.repository.ChecklistItemRepository;
import com.masar.repository.SectionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Fills the database with the guide content (FR/EN/AR/ES) and checklist
 * items on first run. French is the richest, original version, adapted
 * from the "Etudier en Espagne 2026-2027" guide (Aug 2026 edition). The
 * other three languages are a first translation pass - accurate on the
 * facts and figures, but worth a native-speaker review pass before this
 * is treated as a finished, publishable translation, especially for the
 * legal/financial sections.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final SectionRepository sections;
    private final ChecklistItemRepository checklistItems;

    public DataSeeder(SectionRepository sections, ChecklistItemRepository checklistItems) {
        this.sections = sections;
        this.checklistItems = checklistItems;
    }

    @Override
    public void run(String... args) {
        if (sections.count() == 0) {
            seedSections();
            seedFranceAndItalySections();
        }
        if (checklistItems.count() == 0) {
            seedChecklist();
        }
    }

    private Section section(String slug, int order,
                             String titleFr, String titleEn, String titleAr, String titleEs,
                             String htmlFr, String htmlEn, String htmlAr, String htmlEs) {
        Section s = new Section();
        s.setSlug(slug);
        s.setOrderIndex(order);
        s.setTitleFr(titleFr);
        s.setTitleEn(titleEn);
        s.setTitleAr(titleAr);
        s.setTitleEs(titleEs);
        s.setContentHtml(htmlFr);
        s.setContentHtmlEn(htmlEn);
        s.setContentHtmlAr(htmlAr);
        s.setContentHtmlEs(htmlEs);
        s.setPublished(true);
        return s;
    }

    // Single-language helper for the newer France/Italy guides - French only for
    // now, matching how the Spain guide started before being translated. Same
    // fields exist on Section so translating later is just filling these in.
    private Section sectionFr(String slug, String country, int order, String titleFr, String htmlFr) {
        Section s = new Section();
        s.setSlug(slug);
        s.setCountry(country);
        s.setOrderIndex(order);
        s.setTitleFr(titleFr);
        s.setContentHtml(htmlFr);
        s.setPublished(true);
        return s;
    }

    private void seedSections() {
        List<Section> spain = List.of(

            // ============================================================
            // 1. VISA
            // ============================================================
            section("visa", 1,
                "Visa étudiant & exigences financières",
                "Student Visa & Financial Requirements",
                "تأشيرة الطالب والمتطلبات المالية",
                "Visado de estudiante y requisitos financieros",
                """
                <p>Les demandes de visa d'études (visa de longue durée, type D) se déposent aux centres
                <strong>BLS International</strong>, rattachés au Consulat d'Espagne d'<strong>Alger</strong>
                ou d'<strong>Oran</strong> selon votre wilaya. Comptez généralement <strong>2 à 6 semaines</strong>
                de traitement après le dépôt.</p>
                <h3>Le seuil financier — l'IPREM</h3>
                <p>L'Espagne exige la preuve de moyens financiers au moins égaux à 100% de l'IPREM
                (Indicador Público de Renta de Efectos Múltiples). En 2026, cela représente environ
                <strong>600€/mois</strong>, soit un minimum de <strong>7 200€</strong> pour une année.</p>
                <table>
                  <thead><tr><th>Mode de financement</th><th>Documents exigés</th></tr></thead>
                  <tbody>
                    <tr><td>Compte bloqué / fonds propres</td><td>Attestation de solde + historique bancaire des 6 derniers mois au nom de l'étudiant</td></tr>
                    <tr><td>Garant (parents)</td><td>Engagement notarié + fiches de paie (3 mois) + relevés bancaires (6 mois) + registre de commerce ou attestation de travail</td></tr>
                    <tr><td>Bourse officielle</td><td>Attestation d'attribution précisant montant mensuel et durée, émise par un organisme reconnu</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>Erreurs fréquentes qui mènent à un refus :</strong> un dépôt d'argent soudain sur le compte sans justificatif, un garant dont le salaire déclaré ne correspond pas au solde affiché, un garant sans lien de parenté directe, ou une assurance voyage classique au lieu d'une assurance santé complète sans franchise.</div>
                <h3>Chaîne de légalisation des documents algériens</h3>
                <p>Établissement émetteur → Ministère de tutelle (Éducation ou MESRS) → Ministère des Affaires
                Étrangères (MAE) → Consulat d'Espagne à Alger ou Oran. Les traductions doivent être faites par
                un traducteur assermenté reconnu par le MAE espagnol (Traductor Jurado).</p>
                <div class="warn"><strong>À noter :</strong> l'Algérie devrait rejoindre la Convention de La Haye sur l'apostille
                autour de juillet 2026, ce qui pourrait simplifier cette chaîne à terme — confirmez le régime en vigueur au moment de votre dépôt.</div>
                """,
                """
                <p>Student visa applications (long-stay visa, type D) are submitted at <strong>BLS International</strong>
                centers, linked to the Spanish Consulate in <strong>Algiers</strong> or <strong>Oran</strong> depending
                on your province. Processing usually takes <strong>2 to 6 weeks</strong> after submission.</p>
                <h3>The financial threshold — IPREM</h3>
                <p>Spain requires proof of financial means equal to at least 100% of the IPREM (Public Multiple
                Effects Income Indicator). In 2026 this is roughly <strong>€600/month</strong>, a minimum of
                <strong>€7,200</strong> for a full year.</p>
                <table>
                  <thead><tr><th>Funding method</th><th>Documents required</th></tr></thead>
                  <tbody>
                    <tr><td>Blocked account / own funds</td><td>Balance statement + 6 months of bank history in the student's name</td></tr>
                    <tr><td>Sponsor (parents)</td><td>Notarized commitment + 3 months of payslips + 6 months of bank statements + business registry or employment certificate</td></tr>
                    <tr><td>Official scholarship</td><td>Award letter stating monthly amount and duration, issued by a recognized body</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>Common reasons for refusal:</strong> a sudden deposit with no explanation, a sponsor whose declared salary doesn't match their account balance, a sponsor without a direct family relationship, or basic travel insurance instead of full health coverage with no deductible.</div>
                <h3>Legalization chain for Algerian documents</h3>
                <p>Issuing institution → relevant Ministry (Education or MESRS) → Ministry of Foreign Affairs (MAE)
                → Spanish Consulate in Algiers or Oran. Translations must be done by a sworn translator recognized
                by the Spanish MAE (Traductor Jurado).</p>
                <div class="warn"><strong>Worth knowing:</strong> Algeria is expected to join the Hague Apostille Convention around July 2026, which could simplify this chain going forward — confirm which regime applies at the time you apply.</div>
                """,
                """
                <p>تُقدَّم طلبات تأشيرة الدراسة (تأشيرة الإقامة الطويلة، نوع D) في مراكز
                <strong>BLS International</strong> التابعة للقنصلية الإسبانية في <strong>الجزائر العاصمة</strong>
                أو <strong>وهران</strong> حسب ولايتك. تستغرق المعالجة عادةً من <strong>أسبوعين إلى 6 أسابيع</strong>
                بعد الإيداع.</p>
                <h3>العتبة المالية — مؤشر IPREM</h3>
                <p>تشترط إسبانيا إثبات موارد مالية تعادل على الأقل 100% من مؤشر IPREM. في عام 2026 يبلغ هذا المبلغ
                نحو <strong>600 يورو شهريًا</strong>، أي حدًا أدنى قدره <strong>7200 يورو</strong> للسنة الكاملة.</p>
                <table>
                  <thead><tr><th>طريقة التمويل</th><th>الوثائق المطلوبة</th></tr></thead>
                  <tbody>
                    <tr><td>حساب مجمّد / أموال خاصة</td><td>شهادة رصيد + كشف حساب بنكي لآخر 6 أشهر باسم الطالب</td></tr>
                    <tr><td>كفيل (الوالدان)</td><td>تعهد موثّق + كشوف رواتب (3 أشهر) + كشوف بنكية (6 أشهر) + سجل تجاري أو شهادة عمل</td></tr>
                    <tr><td>منحة رسمية</td><td>شهادة منح تحدد المبلغ الشهري والمدة، صادرة عن جهة معترف بها</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>أخطاء شائعة تؤدي إلى الرفض:</strong> إيداع مبلغ مفاجئ في الحساب دون تبرير، كفيل يصرّح براتب لا يتناسب مع رصيده البنكي، كفيل دون صلة قرابة مباشرة، أو تأمين سفر عادي بدلاً من تأمين صحي شامل بدون فرنشيز.</div>
                <h3>سلسلة تصديق الوثائق الجزائرية</h3>
                <p>الجهة المُصدرة ← الوزارة المعنية (التربية أو التعليم العالي) ← وزارة الشؤون الخارجية ← القنصلية
                الإسبانية في الجزائر أو وهران. يجب أن تتم الترجمات عبر مترجم محلف معترف به من طرف وزارة الخارجية
                الإسبانية.</p>
                <div class="warn"><strong>يُذكر أن:</strong> من المتوقع أن تنضم الجزائر إلى اتفاقية لاهاي بشأن التصديق (الأبوستيل) في حدود يوليو 2026، مما قد يبسّط هذه السلسلة مستقبلاً — تأكد من النظام المعمول به وقت تقديم طلبك.</div>
                """,
                """
                <p>Las solicitudes de visado de estudios (visado de larga duración, tipo D) se presentan en los
                centros <strong>BLS International</strong>, vinculados al Consulado de España en <strong>Argel</strong>
                u <strong>Orán</strong> según su wilaya. El trámite suele tardar entre <strong>2 y 6 semanas</strong>
                tras la presentación.</p>
                <h3>El umbral financiero — el IPREM</h3>
                <p>España exige justificar medios económicos de al menos el 100% del IPREM. En 2026 esto equivale
                aproximadamente a <strong>600€/mes</strong>, un mínimo de <strong>7.200€</strong> para un año completo.</p>
                <table>
                  <thead><tr><th>Método de financiación</th><th>Documentos exigidos</th></tr></thead>
                  <tbody>
                    <tr><td>Cuenta bloqueada / fondos propios</td><td>Certificado de saldo + historial bancario de los últimos 6 meses a nombre del estudiante</td></tr>
                    <tr><td>Avalista (padres)</td><td>Compromiso notarial + nóminas (3 meses) + extractos bancarios (6 meses) + registro mercantil o certificado laboral</td></tr>
                    <tr><td>Beca oficial</td><td>Carta de concesión indicando el importe mensual y la duración, emitida por un organismo reconocido</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>Errores frecuentes que causan un rechazo:</strong> un depósito repentino sin justificar, un avalista cuyo salario declarado no coincide con su saldo, un avalista sin parentesco directo, o un seguro de viaje básico en lugar de un seguro médico completo sin franquicia.</div>
                <h3>Cadena de legalización de documentos argelinos</h3>
                <p>Institución emisora → Ministerio competente (Educación o MESRS) → Ministerio de Asuntos
                Exteriores (MAE) → Consulado de España en Argel u Orán. Las traducciones deben realizarlas
                traductores jurados reconocidos por el MAE español.</p>
                <div class="warn"><strong>A tener en cuenta:</strong> se espera que Argelia se adhiera al Convenio de La Haya sobre la apostilla hacia julio de 2026, lo que podría simplificar esta cadena — confirme el régimen vigente en el momento de su solicitud.</div>
                """),

            // ============================================================
            // 2. ADMISSION
            // ============================================================
            section("admission", 2,
                "Admission : Grado, Master & UNEDasiss",
                "Admission: Grado, Master & UNEDasiss",
                "القبول الجامعي: البكالوريوس والماستر ومنصة UNEDasiss",
                "Admisión: Grado, Máster y UNEDasiss",
                """
                <p>Le système espagnol suit le schéma européen LMD : <strong>Grado</strong> (licence, 4 ans / 240 ECTS),
                <strong>Máster</strong> (1 à 2 ans / 60-120 ECTS), <strong>Doctorado</strong>. Il existe aussi la
                Formation Professionnelle Supérieure (FP - Grado Superior, 2 ans).</p>
                <h3>Une distinction importante pour les masters</h3>
                <ul>
                  <li><strong>Máster Oficial</strong> — réglementé par l'État, donne accès au doctorat, reconnu en Algérie (équivalence MESRS)</li>
                  <li><strong>Máster Propio</strong> — titre propre de l'université, orienté emploi local, ne donne pas accès au doctorat et peut poser des problèmes d'équivalence</li>
                </ul>
                <h3>La feuille de route, étape par étape</h3>
                <ol>
                  <li><strong>Choix du programme</strong> — vérifier public/privé, langue d'enseignement</li>
                  <li><strong>Légalisation du dossier académique</strong> — Ministères + MAE + Consulat, puis traduction assermentée</li>
                  <li><strong>UNEDasiss</strong> (obligatoire pour un Grado post-bac) — créer un compte, demander la Volante de Homologación, convertir la note du bac sur 10, passer les épreuves PCE si nécessaire</li>
                  <li><strong>Dépôt des candidatures</strong> — Grados via les portails régionaux (juin-juillet) ; Masters directement sur les plateformes universitaires, dès janvier-mars pour la phase réservée aux non-UE</li>
                  <li><strong>Lettre d'admission</strong> — validation, acompte de réservation de place, attestation officielle (nécessaire pour le visa)</li>
                  <li><strong>Dépôt de la demande de visa</strong> — dossier financier, assurance, certificat médical, casier judiciaire, rendez-vous BLS</li>
                </ol>
                <div class="warn"><strong>Pour un Master :</strong> la phase réservée aux étudiants non-UE ouvre généralement entre janvier et mars. Attendre juin pour postuler signifie souvent des places déjà prises dans les filières demandées.</div>
                """,
                """
                <p>The Spanish system follows the European Bologna structure: <strong>Grado</strong> (bachelor's,
                4 years / 240 ECTS), <strong>Máster</strong> (1-2 years / 60-120 ECTS), <strong>Doctorado</strong>.
                There's also Higher Vocational Training (FP - Grado Superior, 2 years).</p>
                <h3>An important distinction for master's degrees</h3>
                <ul>
                  <li><strong>Máster Oficial</strong> — state-regulated, gives access to a doctorate, recognized in Algeria (MESRS equivalence)</li>
                  <li><strong>Máster Propio</strong> — the university's own qualification, job-market oriented, does not give doctorate access and can create equivalence issues</li>
                </ul>
                <h3>The step-by-step roadmap</h3>
                <ol>
                  <li><strong>Choose your program</strong> — check public/private, teaching language</li>
                  <li><strong>Legalize your academic file</strong> — Ministries + MAE + Consulate, then sworn translation</li>
                  <li><strong>UNEDasiss</strong> (mandatory for a post-Bac Grado) — create an account, request the Volante de Homologación, convert your Bac grade to a 10-point scale, take PCE exams if required</li>
                  <li><strong>Submit applications</strong> — Grados via regional portals (June-July); Masters directly on university platforms, from January-March for the non-EU phase</li>
                  <li><strong>Admission letter</strong> — validation, place reservation deposit, official certificate (needed for the visa)</li>
                  <li><strong>Submit your visa application</strong> — financial file, insurance, medical certificate, criminal record, BLS appointment</li>
                </ol>
                <div class="warn"><strong>For a Master's:</strong> the phase reserved for non-EU students usually opens between January and March. Waiting until June often means spots in popular programs are already gone.</div>
                """,
                """
                <p>يتبع النظام الإسباني هيكل بولونيا الأوروبي: <strong>Grado</strong> (البكالوريوس، 4 سنوات /
                240 نقطة ECTS)، <strong>Máster</strong> (سنة إلى سنتين / 60-120 نقطة)، <strong>Doctorado</strong>.
                يوجد أيضًا التكوين المهني العالي (FP - Grado Superior، سنتان).</p>
                <h3>فرق مهم بخصوص الماستر</h3>
                <ul>
                  <li><strong>Máster Oficial</strong> — منظّم من طرف الدولة، يمنح الوصول إلى الدكتوراه، معترف به في الجزائر (معادلة MESRS)</li>
                  <li><strong>Máster Propio</strong> — شهادة خاصة بالجامعة، موجهة لسوق العمل المحلي، لا تمنح الوصول للدكتوراه وقد تطرح مشاكل في المعادلة</li>
                </ul>
                <h3>خارطة الطريق خطوة بخطوة</h3>
                <ol>
                  <li><strong>اختيار البرنامج</strong> — التحقق من كونه عامًا أو خاصًا، ولغة التدريس</li>
                  <li><strong>تصديق الملف الأكاديمي</strong> — الوزارات + الخارجية + القنصلية، ثم ترجمة محلفة</li>
                  <li><strong>منصة UNEDasiss</strong> (إلزامية لـ Grado بعد البكالوريا) — إنشاء حساب، طلب معادلة الشهادة، تحويل معدل البكالوريا إلى سلم من 10، اجتياز اختبارات PCE إذا لزم الأمر</li>
                  <li><strong>تقديم الترشيحات</strong> — Grado عبر البوابات الجهوية (يونيو-يوليو)؛ الماستر مباشرة عبر منصات الجامعات، ابتداءً من يناير-مارس لمرحلة غير الاتحاد الأوروبي</li>
                  <li><strong>رسالة القبول</strong> — التثبيت، تسبيق حجز المكان، الشهادة الرسمية (ضرورية للتأشيرة)</li>
                  <li><strong>تقديم طلب التأشيرة</strong> — الملف المالي، التأمين، الشهادة الطبية، صحيفة السوابق العدلية، موعد BLS</li>
                </ol>
                <div class="warn"><strong>بالنسبة للماستر:</strong> تفتح المرحلة المخصصة لطلبة خارج الاتحاد الأوروبي عادةً بين يناير ومارس. انتظار شهر يونيو للترشح يعني غالبًا أن الأماكن في التخصصات المطلوبة قد نفدت.</div>
                """,
                """
                <p>El sistema español sigue la estructura europea de Bolonia: <strong>Grado</strong> (4 años /
                240 ECTS), <strong>Máster</strong> (1-2 años / 60-120 ECTS), <strong>Doctorado</strong>. También
                existe la Formación Profesional Superior (FP - Grado Superior, 2 años).</p>
                <h3>Una distinción importante para los másteres</h3>
                <ul>
                  <li><strong>Máster Oficial</strong> — regulado por el Estado, da acceso al doctorado, reconocido en Argelia (equivalencia MESRS)</li>
                  <li><strong>Máster Propio</strong> — título propio de la universidad, orientado al mercado laboral, no da acceso al doctorado y puede generar problemas de equivalencia</li>
                </ul>
                <h3>La hoja de ruta, paso a paso</h3>
                <ol>
                  <li><strong>Elegir el programa</strong> — comprobar si es público o privado, idioma de impartición</li>
                  <li><strong>Legalizar el expediente académico</strong> — Ministerios + MAE + Consulado, luego traducción jurada</li>
                  <li><strong>UNEDasiss</strong> (obligatorio para un Grado tras el Bac) — crear una cuenta, solicitar la Volante de Homologación, convertir la nota del Bac a escala de 10, realizar las pruebas PCE si procede</li>
                  <li><strong>Presentar solicitudes</strong> — Grados vía portales regionales (junio-julio); Másteres directamente en las plataformas universitarias, desde enero-marzo para la fase no-UE</li>
                  <li><strong>Carta de admisión</strong> — validación, depósito de reserva de plaza, certificado oficial (necesario para el visado)</li>
                  <li><strong>Solicitud de visado</strong> — expediente financiero, seguro, certificado médico, antecedentes penales, cita BLS</li>
                </ol>
                <div class="warn"><strong>Para un Máster:</strong> la fase reservada a estudiantes no-UE suele abrir entre enero y marzo. Esperar a junio para solicitar a menudo significa que las plazas en los programas más demandados ya están cubiertas.</div>
                """),

            // ============================================================
            // 3. FILIÈRES
            // ============================================================
            section("filieres", 3,
                "Quelle filière choisir",
                "Which field to choose",
                "اختيار التخصص",
                "Qué carrera elegir",
                """
                <p>Le niveau d'exigence et la procédure varient beaucoup selon la filière visée.</p>
                <table>
                  <thead><tr><th>Filière</th><th>Exigences</th><th>À savoir</th></tr></thead>
                  <tbody>
                    <tr><td>Médecine / Odontologie</td><td>Très sélectif — note de coupe ~12.8 à 13.5/14, PCE quasi indispensables</td><td>Universités privées très demandées, budget élevé</td></tr>
                    <tr><td>Ingénierie / Architecture</td><td>Moyenne 8.0 à 11.5/14 selon la spécialité</td><td>Accréditations internationales (EUR-ACE, ABET) fréquentes dans le public</td></tr>
                    <tr><td>Droit / Économie / Gestion</td><td>Moyenne 5.0 à 9.0/14 — plus accessible</td><td>Accès direct possible selon la note du bac convertie</td></tr>
                    <tr><td>Master (toutes filières)</td><td>Sélection sur dossier, pas de PCE</td><td>Déposer dès la phase 1 (janvier-mars)</td></tr>
                  </tbody>
                </table>
                <p style="font-size:13.5px;opacity:0.7;">PCE = Pruebas de Competencias Específicas, des épreuves optionnelles qui peuvent ajouter jusqu'à 4 points à votre note de coupe.</p>
                """,
                """
                <p>Entry requirements and the process vary a lot depending on the field.</p>
                <table>
                  <thead><tr><th>Field</th><th>Requirements</th><th>Worth knowing</th></tr></thead>
                  <tbody>
                    <tr><td>Medicine / Dentistry</td><td>Very selective — cutoff grade ~12.8-13.5/14, PCE exams almost essential</td><td>Private universities in high demand, high cost</td></tr>
                    <tr><td>Engineering / Architecture</td><td>Average 8.0-11.5/14 depending on specialty</td><td>International accreditations (EUR-ACE, ABET) common in public schools</td></tr>
                    <tr><td>Law / Economics / Business</td><td>Average 5.0-9.0/14 — more accessible</td><td>Direct access possible depending on converted Bac grade</td></tr>
                    <tr><td>Master's (all fields)</td><td>File-based selection, no PCE</td><td>Apply from phase 1 (January-March)</td></tr>
                  </tbody>
                </table>
                <p style="font-size:13.5px;opacity:0.7;">PCE = Pruebas de Competencias Específicas, optional exams that can add up to 4 points to your cutoff grade.</p>
                """,
                """
                <p>يختلف مستوى المتطلبات والإجراءات كثيرًا حسب التخصص المستهدف.</p>
                <table>
                  <thead><tr><th>التخصص</th><th>المتطلبات</th><th>يجب معرفته</th></tr></thead>
                  <tbody>
                    <tr><td>الطب / طب الأسنان</td><td>انتقائي جدًا — معدل القبول ~12.8 إلى 13.5/14، اختبارات PCE شبه ضرورية</td><td>الجامعات الخاصة مطلوبة بكثرة، ميزانية مرتفعة</td></tr>
                    <tr><td>الهندسة / العمارة</td><td>معدل 8.0 إلى 11.5/14 حسب التخصص</td><td>اعتمادات دولية (EUR-ACE، ABET) شائعة في القطاع العام</td></tr>
                    <tr><td>الحقوق / الاقتصاد / التسيير</td><td>معدل 5.0 إلى 9.0/14 — أكثر سهولة</td><td>إمكانية الولوج المباشر حسب معدل البكالوريا المحوَّل</td></tr>
                    <tr><td>الماستر (جميع التخصصات)</td><td>انتقاء على أساس الملف، بدون PCE</td><td>التقديم منذ المرحلة الأولى (يناير-مارس)</td></tr>
                  </tbody>
                </table>
                <p style="font-size:13.5px;opacity:0.7;">PCE = اختبارات الكفاءات الخاصة، وهي اختبارات اختيارية يمكن أن تضيف حتى 4 نقاط لمعدل القبول.</p>
                """,
                """
                <p>El nivel de exigencia y el proceso varían mucho según la carrera elegida.</p>
                <table>
                  <thead><tr><th>Carrera</th><th>Requisitos</th><th>A tener en cuenta</th></tr></thead>
                  <tbody>
                    <tr><td>Medicina / Odontología</td><td>Muy selectivo — nota de corte ~12,8 a 13,5/14, pruebas PCE casi imprescindibles</td><td>Universidades privadas muy demandadas, presupuesto elevado</td></tr>
                    <tr><td>Ingeniería / Arquitectura</td><td>Media 8,0 a 11,5/14 según la especialidad</td><td>Acreditaciones internacionales (EUR-ACE, ABET) frecuentes en el público</td></tr>
                    <tr><td>Derecho / Economía / Gestión</td><td>Media 5,0 a 9,0/14 — más accesible</td><td>Acceso directo posible según la nota del Bac convertida</td></tr>
                    <tr><td>Máster (todas las carreras)</td><td>Selección por expediente, sin PCE</td><td>Solicitar desde la fase 1 (enero-marzo)</td></tr>
                  </tbody>
                </table>
                <p style="font-size:13.5px;opacity:0.7;">PCE = Pruebas de Competencias Específicas, exámenes opcionales que pueden sumar hasta 4 puntos a la nota de corte.</p>
                """),

            // ============================================================
            // 4. UNIVERSITÉS & VILLES
            // ============================================================
            section("universites", 4,
                "Universités & villes",
                "Universities & cities",
                "الجامعات والمدن",
                "Universidades y ciudades",
                """
                <table>
                  <thead><tr><th>Université</th><th>Ville</th><th>Frais/an (non-UE)</th></tr></thead>
                  <tbody>
                    <tr><td>Universidad Complutense (UCM)</td><td>Madrid</td><td>2 500€ – 6 500€</td></tr>
                    <tr><td>Universitat de Barcelona (UB)</td><td>Barcelone</td><td>2 800€ – 6 800€</td></tr>
                    <tr><td>Universidad de Granada (UGR)</td><td>Grenade</td><td>750€ – 1 000€</td></tr>
                    <tr><td>Universidad de Sevilla (US)</td><td>Séville</td><td>750€ – 1 200€</td></tr>
                    <tr><td>Universitat Politècnica de València</td><td>Valence</td><td>1 200€ – 3 000€</td></tr>
                  </tbody>
                </table>
                <h3>Comparatif des villes étudiantes</h3>
                <table>
                  <thead><tr><th>Ville</th><th>Logement/mois</th><th>Vie quotidienne/mois</th><th>Profil</th></tr></thead>
                  <tbody>
                    <tr><td>Madrid</td><td>450€ – 700€</td><td>300€ – 400€</td><td>Capitale dynamique, stages, coût élevé</td></tr>
                    <tr><td>Barcelone</td><td>500€ – 750€</td><td>320€ – 420€</td><td>Pôle tech, tension locative très forte</td></tr>
                    <tr><td>Valence</td><td>300€ – 450€</td><td>220€ – 300€</td><td>Excellent compromis coût/qualité</td></tr>
                    <tr><td>Grenade</td><td>220€ – 350€</td><td>180€ – 250€</td><td>Ville étudiante par excellence, très abordable</td></tr>
                    <tr><td>Séville</td><td>280€ – 400€</td><td>200€ – 280€</td><td>Frais universitaires bas, cadre chaleureux</td></tr>
                  </tbody>
                </table>
                """,
                """
                <table>
                  <thead><tr><th>University</th><th>City</th><th>Fees/year (non-EU)</th></tr></thead>
                  <tbody>
                    <tr><td>Universidad Complutense (UCM)</td><td>Madrid</td><td>€2,500 – €6,500</td></tr>
                    <tr><td>Universitat de Barcelona (UB)</td><td>Barcelona</td><td>€2,800 – €6,800</td></tr>
                    <tr><td>Universidad de Granada (UGR)</td><td>Granada</td><td>€750 – €1,000</td></tr>
                    <tr><td>Universidad de Sevilla (US)</td><td>Seville</td><td>€750 – €1,200</td></tr>
                    <tr><td>Universitat Politècnica de València</td><td>Valencia</td><td>€1,200 – €3,000</td></tr>
                  </tbody>
                </table>
                <h3>Student city comparison</h3>
                <table>
                  <thead><tr><th>City</th><th>Housing/month</th><th>Daily life/month</th><th>Profile</th></tr></thead>
                  <tbody>
                    <tr><td>Madrid</td><td>€450 – €700</td><td>€300 – €400</td><td>Dynamic capital, internships, higher cost</td></tr>
                    <tr><td>Barcelona</td><td>€500 – €750</td><td>€320 – €420</td><td>Tech hub, very high rental pressure</td></tr>
                    <tr><td>Valencia</td><td>€300 – €450</td><td>€220 – €300</td><td>Excellent cost/quality balance</td></tr>
                    <tr><td>Granada</td><td>€220 – €350</td><td>€180 – €250</td><td>The quintessential student city, very affordable</td></tr>
                    <tr><td>Seville</td><td>€280 – €400</td><td>€200 – €280</td><td>Low university fees, warm atmosphere</td></tr>
                  </tbody>
                </table>
                """,
                """
                <table>
                  <thead><tr><th>الجامعة</th><th>المدينة</th><th>الرسوم/سنة (خارج ا.أ.)</th></tr></thead>
                  <tbody>
                    <tr><td>جامعة كومبلوتنسي (UCM)</td><td>مدريد</td><td>2500 – 6500 يورو</td></tr>
                    <tr><td>جامعة برشلونة (UB)</td><td>برشلونة</td><td>2800 – 6800 يورو</td></tr>
                    <tr><td>جامعة غرناطة (UGR)</td><td>غرناطة</td><td>750 – 1000 يورو</td></tr>
                    <tr><td>جامعة إشبيلية (US)</td><td>إشبيلية</td><td>750 – 1200 يورو</td></tr>
                    <tr><td>جامعة فالنسيا التقنية</td><td>فالنسيا</td><td>1200 – 3000 يورو</td></tr>
                  </tbody>
                </table>
                <h3>مقارنة المدن الطلابية</h3>
                <table>
                  <thead><tr><th>المدينة</th><th>السكن/شهر</th><th>الحياة اليومية/شهر</th><th>الوصف</th></tr></thead>
                  <tbody>
                    <tr><td>مدريد</td><td>450 – 700 يورو</td><td>300 – 400 يورو</td><td>عاصمة نشطة، فرص تدريب، تكلفة مرتفعة</td></tr>
                    <tr><td>برشلونة</td><td>500 – 750 يورو</td><td>320 – 420 يورو</td><td>قطب تكنولوجي، ضغط كبير على السكن</td></tr>
                    <tr><td>فالنسيا</td><td>300 – 450 يورو</td><td>220 – 300 يورو</td><td>توازن ممتاز بين التكلفة والجودة</td></tr>
                    <tr><td>غرناطة</td><td>220 – 350 يورو</td><td>180 – 250 يورو</td><td>المدينة الطلابية بامتياز، معيشة رخيصة جدًا</td></tr>
                    <tr><td>إشبيلية</td><td>280 – 400 يورو</td><td>200 – 280 يورو</td><td>رسوم جامعية منخفضة، أجواء دافئة</td></tr>
                  </tbody>
                </table>
                """,
                """
                <table>
                  <thead><tr><th>Universidad</th><th>Ciudad</th><th>Tasas/año (no-UE)</th></tr></thead>
                  <tbody>
                    <tr><td>Universidad Complutense (UCM)</td><td>Madrid</td><td>2.500€ – 6.500€</td></tr>
                    <tr><td>Universitat de Barcelona (UB)</td><td>Barcelona</td><td>2.800€ – 6.800€</td></tr>
                    <tr><td>Universidad de Granada (UGR)</td><td>Granada</td><td>750€ – 1.000€</td></tr>
                    <tr><td>Universidad de Sevilla (US)</td><td>Sevilla</td><td>750€ – 1.200€</td></tr>
                    <tr><td>Universitat Politècnica de València</td><td>Valencia</td><td>1.200€ – 3.000€</td></tr>
                  </tbody>
                </table>
                <h3>Comparativa de ciudades universitarias</h3>
                <table>
                  <thead><tr><th>Ciudad</th><th>Vivienda/mes</th><th>Vida diaria/mes</th><th>Perfil</th></tr></thead>
                  <tbody>
                    <tr><td>Madrid</td><td>450€ – 700€</td><td>300€ – 400€</td><td>Capital dinámica, prácticas, coste elevado</td></tr>
                    <tr><td>Barcelona</td><td>500€ – 750€</td><td>320€ – 420€</td><td>Polo tecnológico, tensión de alquiler muy alta</td></tr>
                    <tr><td>Valencia</td><td>300€ – 450€</td><td>220€ – 300€</td><td>Excelente relación coste/calidad</td></tr>
                    <tr><td>Granada</td><td>220€ – 350€</td><td>180€ – 250€</td><td>La ciudad universitaria por excelencia, muy asequible</td></tr>
                    <tr><td>Sevilla</td><td>280€ – 400€</td><td>200€ – 280€</td><td>Tasas bajas, ambiente cálido</td></tr>
                  </tbody>
                </table>
                """),

            // ============================================================
            // 5. BUDGET
            // ============================================================
            section("budget", 5,
                "Budget réel de l'étudiant algérien",
                "The Algerian student's real budget",
                "الميزانية الحقيقية للطالب الجزائري",
                "El presupuesto real del estudiante argelino",
                """
                <h3>Frais uniques avant le départ</h3>
                <table>
                  <tbody>
                    <tr><td>Homologation UNED / PCE</td><td>150€ – 350€</td></tr>
                    <tr><td>Traductions jurées & légalisations</td><td>200€ – 400€</td></tr>
                    <tr><td>Frais de visa (BLS)</td><td>80€ – 100€</td></tr>
                    <tr><td>Assurance santé annuelle</td><td>450€ – 650€</td></tr>
                    <tr><td>Billet d'avion</td><td>150€ – 300€</td></tr>
                    <tr><td>Caution logement</td><td>300€ – 1 000€</td></tr>
                    <tr><td><strong>Total estimé avant départ</strong></td><td><strong>1 330€ – 2 800€</strong></td></tr>
                  </tbody>
                </table>
                <h3>Charges mensuelles moyennes</h3>
                <table>
                  <tbody>
                    <tr><td>Chambre en colocation</td><td>280€ – 550€</td></tr>
                    <tr><td>Nourriture</td><td>180€ – 250€</td></tr>
                    <tr><td>Transport (abonnement jeune)</td><td>20€ – 35€</td></tr>
                    <tr><td>Téléphonie / internet</td><td>15€ – 25€</td></tr>
                    <tr><td>Loisirs</td><td>80€ – 150€</td></tr>
                    <tr><td><strong>Budget mensuel réel</strong></td><td><strong>575€ – 1 010€</strong></td></tr>
                  </tbody>
                </table>
                <h3>Trois scénarios</h3>
                <table>
                  <thead><tr><th>Scénario</th><th>Villes</th><th>Budget/mois</th></tr></thead>
                  <tbody>
                    <tr><td>Économique</td><td>Grenade, Jaén, Murcie</td><td>550€ – 650€</td></tr>
                    <tr><td>Moyen (recommandé)</td><td>Valence, Séville, Saragosse</td><td>700€ – 850€</td></tr>
                    <tr><td>Métropolitain</td><td>Madrid, Barcelone</td><td>950€ – 1 200€</td></tr>
                  </tbody>
                </table>
                """,
                """
                <h3>One-off costs before departure</h3>
                <table>
                  <tbody>
                    <tr><td>UNED homologation / PCE</td><td>€150 – €350</td></tr>
                    <tr><td>Sworn translations & legalizations</td><td>€200 – €400</td></tr>
                    <tr><td>Visa fees (BLS)</td><td>€80 – €100</td></tr>
                    <tr><td>Annual health insurance</td><td>€450 – €650</td></tr>
                    <tr><td>Flight ticket</td><td>€150 – €300</td></tr>
                    <tr><td>Housing deposit</td><td>€300 – €1,000</td></tr>
                    <tr><td><strong>Total before departure</strong></td><td><strong>€1,330 – €2,800</strong></td></tr>
                  </tbody>
                </table>
                <h3>Average monthly costs</h3>
                <table>
                  <tbody>
                    <tr><td>Shared room</td><td>€280 – €550</td></tr>
                    <tr><td>Food</td><td>€180 – €250</td></tr>
                    <tr><td>Transport (youth pass)</td><td>€20 – €35</td></tr>
                    <tr><td>Phone / internet</td><td>€15 – €25</td></tr>
                    <tr><td>Leisure</td><td>€80 – €150</td></tr>
                    <tr><td><strong>Real monthly budget</strong></td><td><strong>€575 – €1,010</strong></td></tr>
                  </tbody>
                </table>
                <h3>Three scenarios</h3>
                <table>
                  <thead><tr><th>Scenario</th><th>Cities</th><th>Budget/month</th></tr></thead>
                  <tbody>
                    <tr><td>Budget</td><td>Granada, Jaén, Murcia</td><td>€550 – €650</td></tr>
                    <tr><td>Mid-range (recommended)</td><td>Valencia, Seville, Zaragoza</td><td>€700 – €850</td></tr>
                    <tr><td>Metropolitan</td><td>Madrid, Barcelona</td><td>€950 – €1,200</td></tr>
                  </tbody>
                </table>
                """,
                """
                <h3>المصاريف الفردية قبل السفر</h3>
                <table>
                  <tbody>
                    <tr><td>معادلة UNED / اختبارات PCE</td><td>150 – 350 يورو</td></tr>
                    <tr><td>الترجمات المحلفة والتصديقات</td><td>200 – 400 يورو</td></tr>
                    <tr><td>رسوم التأشيرة (BLS)</td><td>80 – 100 يورو</td></tr>
                    <tr><td>التأمين الصحي السنوي</td><td>450 – 650 يورو</td></tr>
                    <tr><td>تذكرة الطائرة</td><td>150 – 300 يورو</td></tr>
                    <tr><td>تأمين السكن</td><td>300 – 1000 يورو</td></tr>
                    <tr><td><strong>المجموع التقديري قبل السفر</strong></td><td><strong>1330 – 2800 يورو</strong></td></tr>
                  </tbody>
                </table>
                <h3>المصاريف الشهرية المتوسطة</h3>
                <table>
                  <tbody>
                    <tr><td>غرفة في سكن مشترك</td><td>280 – 550 يورو</td></tr>
                    <tr><td>الغذاء</td><td>180 – 250 يورو</td></tr>
                    <tr><td>النقل (اشتراك شباب)</td><td>20 – 35 يورو</td></tr>
                    <tr><td>الهاتف / الإنترنت</td><td>15 – 25 يورو</td></tr>
                    <tr><td>الترفيه</td><td>80 – 150 يورو</td></tr>
                    <tr><td><strong>الميزانية الشهرية الحقيقية</strong></td><td><strong>575 – 1010 يورو</strong></td></tr>
                  </tbody>
                </table>
                <h3>ثلاثة سيناريوهات</h3>
                <table>
                  <thead><tr><th>السيناريو</th><th>المدن</th><th>الميزانية/شهر</th></tr></thead>
                  <tbody>
                    <tr><td>اقتصادي</td><td>غرناطة، خاين، مورسيا</td><td>550 – 650 يورو</td></tr>
                    <tr><td>متوسط (موصى به)</td><td>فالنسيا، إشبيلية، سرقسطة</td><td>700 – 850 يورو</td></tr>
                    <tr><td>حضري كبير</td><td>مدريد، برشلونة</td><td>950 – 1200 يورو</td></tr>
                  </tbody>
                </table>
                """,
                """
                <h3>Gastos únicos antes de partir</h3>
                <table>
                  <tbody>
                    <tr><td>Homologación UNED / PCE</td><td>150€ – 350€</td></tr>
                    <tr><td>Traducciones juradas y legalizaciones</td><td>200€ – 400€</td></tr>
                    <tr><td>Tasas de visado (BLS)</td><td>80€ – 100€</td></tr>
                    <tr><td>Seguro de salud anual</td><td>450€ – 650€</td></tr>
                    <tr><td>Billete de avión</td><td>150€ – 300€</td></tr>
                    <tr><td>Fianza de vivienda</td><td>300€ – 1.000€</td></tr>
                    <tr><td><strong>Total estimado antes de partir</strong></td><td><strong>1.330€ – 2.800€</strong></td></tr>
                  </tbody>
                </table>
                <h3>Gastos mensuales medios</h3>
                <table>
                  <tbody>
                    <tr><td>Habitación compartida</td><td>280€ – 550€</td></tr>
                    <tr><td>Comida</td><td>180€ – 250€</td></tr>
                    <tr><td>Transporte (abono joven)</td><td>20€ – 35€</td></tr>
                    <tr><td>Teléfono / internet</td><td>15€ – 25€</td></tr>
                    <tr><td>Ocio</td><td>80€ – 150€</td></tr>
                    <tr><td><strong>Presupuesto mensual real</strong></td><td><strong>575€ – 1.010€</strong></td></tr>
                  </tbody>
                </table>
                <h3>Tres escenarios</h3>
                <table>
                  <thead><tr><th>Escenario</th><th>Ciudades</th><th>Presupuesto/mes</th></tr></thead>
                  <tbody>
                    <tr><td>Económico</td><td>Granada, Jaén, Murcia</td><td>550€ – 650€</td></tr>
                    <tr><td>Medio (recomendado)</td><td>Valencia, Sevilla, Zaragoza</td><td>700€ – 850€</td></tr>
                    <tr><td>Metropolitano</td><td>Madrid, Barcelona</td><td>950€ – 1.200€</td></tr>
                  </tbody>
                </table>
                """),

            // ============================================================
            // 6. ARRIVAL / TIE
            // ============================================================
            section("arrival", 6,
                "Arrivée et le TIE",
                "Arrival and the TIE",
                "الوصول وبطاقة الإقامة TIE",
                "Llegada y el TIE",
                """
                <p>Dès votre arrivée, une série de démarches légales doivent être accomplies dans un ordre précis.</p>
                <table>
                  <thead><tr><th>Délai</th><th>Démarche</th></tr></thead>
                  <tbody>
                    <tr><td>Semaine 1</td><td><strong>Empadronamiento</strong> — inscription à la mairie avec le contrat de bail, pour obtenir le Certificado de Empadronamiento (indispensable pour tout le reste)</td></tr>
                    <tr><td>Semaine 2</td><td><strong>Matrícula</strong> — inscription définitive à l'université avec les originaux des diplômes et du visa</td></tr>
                    <tr><td>Semaine 3-4</td><td><strong>TIE</strong> — rendez-vous (cita previa) pour la prise d'empreintes ; la carte contient votre NIE et valide votre séjour</td></tr>
                    <tr><td>Semaine 4</td><td><strong>Compte bancaire</strong> — ouverture avec passeport + attestation d'inscription (BBVA, Santander, N26, Sabadell)</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>Le délai d'un mois</strong> — la demande de TIE doit être faite dans les 30 jours suivant l'arrivée. Mettez-le au calendrier dès le premier jour.</div>
                <h3>Renouvellement (Prórroga)</h3>
                <p>À demander dans les 60 jours précédant l'expiration de la TIE, sous condition d'avoir validé
                environ 50 à 60% des crédits ECTS de l'année écoulée et de maintenir la preuve de ressources (IPREM).</p>
                """,
                """
                <p>As soon as you arrive, a series of legal steps must be completed in a specific order.</p>
                <table>
                  <thead><tr><th>Timing</th><th>Step</th></tr></thead>
                  <tbody>
                    <tr><td>Week 1</td><td><strong>Empadronamiento</strong> — register at the town hall with your lease, to get the Certificado de Empadronamiento (needed for everything else)</td></tr>
                    <tr><td>Week 2</td><td><strong>Matrícula</strong> — finalize university enrollment with original diplomas and visa</td></tr>
                    <tr><td>Weeks 3-4</td><td><strong>TIE</strong> — appointment (cita previa) for fingerprinting; the card carries your NIE and validates your stay</td></tr>
                    <tr><td>Week 4</td><td><strong>Bank account</strong> — open one with passport + enrollment certificate (BBVA, Santander, N26, Sabadell)</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>The one-month deadline</strong> — the TIE application must be filed within 30 days of arrival. Put it on your calendar from day one.</div>
                <h3>Renewal (Prórroga)</h3>
                <p>Must be requested within the 60 days before the TIE expires, provided you've passed roughly
                50-60% of the previous year's ECTS credits and can still show proof of resources (IPREM).</p>
                """,
                """
                <p>فور وصولك، يجب إنجاز سلسلة من الإجراءات القانونية بترتيب محدد.</p>
                <table>
                  <thead><tr><th>المدة</th><th>الإجراء</th></tr></thead>
                  <tbody>
                    <tr><td>الأسبوع 1</td><td><strong>Empadronamiento</strong> — التسجيل في البلدية بعقد الإيجار للحصول على شهادة السكن (ضرورية لكل الإجراءات اللاحقة)</td></tr>
                    <tr><td>الأسبوع 2</td><td><strong>Matrícula</strong> — التسجيل النهائي في الجامعة بالشهادات والتأشيرة الأصلية</td></tr>
                    <tr><td>الأسبوع 3-4</td><td><strong>بطاقة TIE</strong> — موعد لأخذ البصمات؛ تحمل البطاقة رقم NIE الخاص بك وتثبت إقامتك</td></tr>
                    <tr><td>الأسبوع 4</td><td><strong>الحساب البنكي</strong> — فتحه بجواز السفر + شهادة التسجيل الجامعي (BBVA، Santander، N26، Sabadell)</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>مهلة الشهر الواحد</strong> — يجب تقديم طلب بطاقة TIE خلال 30 يومًا من تاريخ الوصول. ضعها في أجندتك منذ اليوم الأول.</div>
                <h3>التجديد (Prórroga)</h3>
                <p>يجب طلبه خلال 60 يومًا قبل انتهاء صلاحية بطاقة TIE، بشرط اجتياز حوالي 50 إلى 60% من نقاط ECTS
                للسنة المنقضية والاستمرار في إثبات الموارد المالية (IPREM).</p>
                """,
                """
                <p>Nada más llegar, debe completar una serie de trámites legales en un orden concreto.</p>
                <table>
                  <thead><tr><th>Plazo</th><th>Trámite</th></tr></thead>
                  <tbody>
                    <tr><td>Semana 1</td><td><strong>Empadronamiento</strong> — inscripción en el ayuntamiento con el contrato de alquiler, para obtener el Certificado de Empadronamiento (imprescindible para todo lo demás)</td></tr>
                    <tr><td>Semana 2</td><td><strong>Matrícula</strong> — inscripción definitiva en la universidad con los originales de títulos y visado</td></tr>
                    <tr><td>Semanas 3-4</td><td><strong>TIE</strong> — cita previa para la toma de huellas; la tarjeta lleva su NIE y valida su estancia</td></tr>
                    <tr><td>Semana 4</td><td><strong>Cuenta bancaria</strong> — apertura con pasaporte + certificado de matrícula (BBVA, Santander, N26, Sabadell)</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>El plazo de un mes</strong> — la solicitud de la TIE debe hacerse dentro de los 30 días siguientes a la llegada. Anótelo desde el primer día.</div>
                <h3>Renovación (Prórroga)</h3>
                <p>Debe solicitarse en los 60 días previos al vencimiento de la TIE, siempre que se hayan superado
                aproximadamente entre el 50 y el 60% de los créditos ECTS del año anterior y se mantenga la
                prueba de recursos (IPREM).</p>
                """),

            // ============================================================
            // 7. HOMOLOGACIÓN
            // ============================================================
            section("homolog", 7,
                "Équivalences & légalisation des diplômes",
                "Degree Recognition & Legalization",
                "معادلة وتصديق الشهادات",
                "Homologación y legalización de títulos",
                """
                <p>Pour un bachelier visant un Grado, la procédure passe par <strong>UNEDasiss</strong> : créer un
                compte, demander la Volante de Homologación, et convertir la note du bac algérien sur une échelle
                espagnole de 5 à 10 points.</p>
                <p>Pour un diplôme universitaire (licence, master) visant un Master en Espagne, la plupart des
                universités font leur propre vérification d'équivalence pour l'admission — un processus séparé,
                plus rapide, distinct de l'homologation formelle d'État.</p>
                <div class="warn"><strong>Quand l'homologation formelle est vraiment nécessaire :</strong> pour exercer une profession réglementée en Espagne (médecine, droit, ingénierie avec ordre professionnel) — ce processus, via le Ministère espagnol de l'Éducation, peut prendre plus d'un an en période de forte demande. Commencez tôt si votre projet en dépend.</div>
                """,
                """
                <p>For a high school graduate applying to a Grado, the process goes through <strong>UNEDasiss</strong>:
                create an account, request the Volante de Homologación, and convert the Algerian Bac grade to a
                Spanish 5-10 point scale.</p>
                <p>For a university degree (bachelor's, master's) applying to a Master's in Spain, most universities
                do their own equivalence check for admission purposes — a separate, faster process, distinct from
                formal state homologation.</p>
                <div class="warn"><strong>When formal homologation is actually needed:</strong> to practice a regulated profession in Spain (medicine, law, engineering with a professional body) — this process, through the Spanish Ministry of Education, can take over a year during busy periods. Start early if your plans depend on it.</div>
                """,
                """
                <p>بالنسبة لحامل البكالوريا الراغب في الالتحاق بـ Grado، تمر الإجراءات عبر منصة
                <strong>UNEDasiss</strong>: إنشاء حساب، طلب معادلة الشهادة، وتحويل معدل البكالوريا الجزائرية إلى
                سلم إسباني من 5 إلى 10.</p>
                <p>بالنسبة لحامل شهادة جامعية (ليسانس، ماستر) يرغب في الالتحاق بماستر في إسبانيا، تقوم معظم
                الجامعات بالتحقق من المعادلة بنفسها لأغراض القبول — وهو إجراء منفصل وأسرع، مختلف عن المعادلة
                الرسمية الحكومية.</p>
                <div class="warn"><strong>متى تكون المعادلة الرسمية ضرورية فعلًا:</strong> لممارسة مهنة منظّمة في إسبانيا (الطب، الحقوق، الهندسة المرتبطة بنقابة مهنية) — يمكن أن يستغرق هذا الإجراء، عبر وزارة التعليم الإسبانية، أكثر من سنة في فترات الإقبال الكبير. ابدأ مبكرًا إذا كان مشروعك يعتمد على ذلك.</div>
                """,
                """
                <p>Para un bachiller que solicita un Grado, el trámite pasa por <strong>UNEDasiss</strong>: crear una
                cuenta, solicitar la Volante de Homologación y convertir la nota del Bac argelino a una escala
                española de 5 a 10 puntos.</p>
                <p>Para un título universitario (grado, máster) que solicita un Máster en España, la mayoría de
                universidades realiza su propia verificación de equivalencia para la admisión — un proceso
                separado y más rápido, distinto de la homologación formal del Estado.</p>
                <div class="warn"><strong>Cuándo es realmente necesaria la homologación formal:</strong> para ejercer una profesión regulada en España (medicina, derecho, ingeniería con colegio profesional) — este trámite, a través del Ministerio de Educación español, puede tardar más de un año en épocas de mucha demanda. Empiece con antelación si su proyecto depende de ello.</div>
                """),

            // ============================================================
            // 8. LOGEMENT
            // ============================================================
            section("housing", 8,
                "Logement",
                "Housing",
                "السكن",
                "Vivienda",
                """
                <p>Souvent l'étape la plus stressante après le visa — et celle où les arnaques ciblant les
                étudiants internationaux sont les plus fréquentes.</p>
                <h3>Où chercher</h3>
                <ul>
                  <li>Résidences universitaires / colegios mayores — l'option la plus sûre, à réserver tôt</li>
                  <li>Colocations (pisos compartidos) via Idealista, Fotocasa, ou les groupes Facebook de votre université</li>
                </ul>
                <div class="warn"><strong>Attention aux arnaques :</strong> ne jamais envoyer d'argent pour un logement que vous n'avez pas vérifié — demandez un appel vidéo à l'intérieur du logement avant tout versement.</div>
                <p style="font-size:13.5px;opacity:0.7;">La tension locative à Madrid et Barcelone est particulièrement forte — réservez au moins 2 à 3 mois avant le départ si vous visez l'une de ces deux villes.</p>
                """,
                """
                <p>Often the most stressful step after the visa — and the one where scams targeting international
                students are most common.</p>
                <h3>Where to look</h3>
                <ul>
                  <li>University residences / colegios mayores — the safest option, book early</li>
                  <li>Shared flats (pisos compartidos) via Idealista, Fotocasa, or your university's Facebook groups</li>
                </ul>
                <div class="warn"><strong>Watch out for scams:</strong> never send money for a place you haven't verified — ask for a video call inside the apartment before any payment.</div>
                <p style="font-size:13.5px;opacity:0.7;">Rental pressure in Madrid and Barcelona is especially high — book at least 2-3 months ahead if you're aiming for either city.</p>
                """,
                """
                <p>غالبًا ما تكون هذه أصعب مرحلة بعد التأشيرة — والمرحلة التي تكثر فيها عمليات النصب التي تستهدف
                الطلبة الدوليين.</p>
                <h3>أين تبحث</h3>
                <ul>
                  <li>إقامات جامعية / colegios mayores — الخيار الأكثر أمانًا، احجز مبكرًا</li>
                  <li>سكن مشترك (pisos compartidos) عبر Idealista وFotocasa أو مجموعات فيسبوك الخاصة بجامعتك</li>
                </ul>
                <div class="warn"><strong>احذر عمليات النصب:</strong> لا ترسل أي مبلغ مقابل سكن لم تتحقق منه — اطلب مكالمة فيديو داخل الشقة قبل أي دفعة مالية.</div>
                <p style="font-size:13.5px;opacity:0.7;">الضغط على السكن في مدريد وبرشلونة مرتفع جدًا — احجز قبل شهرين إلى ثلاثة أشهر على الأقل إذا كنت تستهدف إحدى هاتين المدينتين.</p>
                """,
                """
                <p>A menudo el paso más estresante tras el visado — y aquel en el que las estafas dirigidas a
                estudiantes internacionales son más frecuentes.</p>
                <h3>Dónde buscar</h3>
                <ul>
                  <li>Residencias universitarias / colegios mayores — la opción más segura, reserve con antelación</li>
                  <li>Pisos compartidos vía Idealista, Fotocasa, o los grupos de Facebook de su universidad</li>
                </ul>
                <div class="warn"><strong>Cuidado con las estafas:</strong> nunca envíe dinero por un piso que no ha verificado — pida una videollamada dentro del piso antes de cualquier pago.</div>
                <p style="font-size:13.5px;opacity:0.7;">La presión del alquiler en Madrid y Barcelona es especialmente alta — reserve al menos 2-3 meses antes si apunta a una de estas dos ciudades.</p>
                """),

            // ============================================================
            // 9. MONEY
            // ============================================================
            section("money", 9,
                "Argent et banque",
                "Money & Banking",
                "المال والبنوك",
                "Dinero y banca",
                """
                <h3>Ouvrir un compte bancaire espagnol</h3>
                <p>La plupart des banques (BBVA, Santander, N26, Sabadell) demandent passeport, NIE/TIE (ou
                preuve qu'il est en cours), et une attestation d'inscription universitaire. Certaines banques
                digitales permettent d'ouvrir un compte avant même de recevoir le TIE.</p>
                <h3>Justifier des moyens financiers pour le visa</h3>
                <p>Voir la section Visa pour le détail des trois méthodes acceptées (compte bloqué, garant,
                bourse) — le point clé à retenir est que l'origine des fonds doit être claire et cohérente
                avec l'historique bancaire des 6 derniers mois.</p>
                """,
                """
                <h3>Opening a Spanish bank account</h3>
                <p>Most banks (BBVA, Santander, N26, Sabadell) ask for a passport, NIE/TIE (or proof it's in
                progress), and a university enrollment certificate. Some digital banks let you open an account
                even before receiving the TIE.</p>
                <h3>Proving financial means for the visa</h3>
                <p>See the Visa section for the three accepted methods (blocked account, sponsor, scholarship)
                in detail — the key point is that the origin of funds must be clear and consistent with the
                past 6 months of bank history.</p>
                """,
                """
                <h3>فتح حساب بنكي إسباني</h3>
                <p>تطلب معظم البنوك (BBVA، Santander، N26، Sabadell) جواز السفر، بطاقة NIE/TIE (أو إثبات أنها
                قيد المعالجة)، وشهادة التسجيل الجامعي. تسمح بعض البنوك الرقمية بفتح حساب حتى قبل استلام بطاقة TIE.</p>
                <h3>إثبات الموارد المالية للتأشيرة</h3>
                <p>راجع قسم التأشيرة لتفاصيل الطرق الثلاث المقبولة (حساب مجمّد، كفيل، منحة) — النقطة الأساسية هي
                أن مصدر الأموال يجب أن يكون واضحًا ومتسقًا مع كشف الحساب البنكي لآخر 6 أشهر.</p>
                """,
                """
                <h3>Abrir una cuenta bancaria española</h3>
                <p>La mayoría de los bancos (BBVA, Santander, N26, Sabadell) piden pasaporte, NIE/TIE (o prueba
                de que está en trámite) y un certificado de matrícula universitaria. Algunos bancos digitales
                permiten abrir una cuenta incluso antes de recibir la TIE.</p>
                <h3>Justificar medios económicos para el visado</h3>
                <p>Consulte la sección de Visado para el detalle de los tres métodos aceptados (cuenta bloqueada,
                avalista, beca) — el punto clave es que el origen de los fondos debe ser claro y coherente con
                el historial bancario de los últimos 6 meses.</p>
                """),

            // ============================================================
            // 10. STUDY / LANGUAGE
            // ============================================================
            section("study", 10,
                "Langues & certifications",
                "Language & Certifications",
                "اللغة والشهادات",
                "Idiomas y certificaciones",
                """
                <table>
                  <thead><tr><th>Cursus</th><th>Niveau exigé</th><th>Certificats acceptés</th></tr></thead>
                  <tbody>
                    <tr><td>En espagnol (Grado/Master)</td><td>B2 (exigé par la majorité des univ.)</td><td>DELE, SIELE</td></tr>
                    <tr><td>100% en anglais</td><td>B2 à C1</td><td>IELTS (6.0-6.5+), TOEFL iBT (80+)</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>Attention :</strong> les attestations de niveau délivrées par des écoles de langues privées non homologuées ne sont généralement pas acceptées par l'UNEDasiss ni par les consulats. Privilégiez exclusivement les examens officiels DELE ou SIELE.</div>
                <p style="font-size:13.5px;opacity:0.7;">Le certificat B2 est vérifié systématiquement lors de l'entretien visa, même pour les cursus en anglais — un niveau A2 en espagnol reste conseillé dans ce cas.</p>
                """,
                """
                <table>
                  <thead><tr><th>Program</th><th>Required level</th><th>Accepted certificates</th></tr></thead>
                  <tbody>
                    <tr><td>In Spanish (Grado/Master)</td><td>B2 (required by most universities)</td><td>DELE, SIELE</td></tr>
                    <tr><td>100% in English</td><td>B2 to C1</td><td>IELTS (6.0-6.5+), TOEFL iBT (80+)</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>Note:</strong> level certificates issued by unaccredited private language schools are generally not accepted by UNEDasiss or the consulates. Only use official DELE or SIELE exams.</div>
                <p style="font-size:13.5px;opacity:0.7;">The B2 certificate is routinely checked at the visa interview, even for English-taught programs — a basic A2 level in Spanish is still recommended in that case.</p>
                """,
                """
                <table>
                  <thead><tr><th>البرنامج</th><th>المستوى المطلوب</th><th>الشهادات المقبولة</th></tr></thead>
                  <tbody>
                    <tr><td>بالإسبانية (Grado/Master)</td><td>B2 (مطلوب من طرف معظم الجامعات)</td><td>DELE، SIELE</td></tr>
                    <tr><td>بالإنجليزية 100%</td><td>B2 إلى C1</td><td>IELTS (6.0-6.5+)، TOEFL iBT (80+)</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>تنبيه:</strong> شهادات المستوى الصادرة عن مدارس لغات خاصة غير معتمدة لا تُقبل عمومًا من طرف UNEDasiss أو القنصليات. اعتمد حصريًا على اختبارات DELE أو SIELE الرسمية.</div>
                <p style="font-size:13.5px;opacity:0.7;">يتم التحقق من شهادة B2 بشكل منهجي أثناء مقابلة التأشيرة، حتى بالنسبة للبرامج باللغة الإنجليزية — يُنصح مع ذلك بمستوى A2 في الإسبانية.</p>
                """,
                """
                <table>
                  <thead><tr><th>Programa</th><th>Nivel exigido</th><th>Certificados aceptados</th></tr></thead>
                  <tbody>
                    <tr><td>En español (Grado/Máster)</td><td>B2 (exigido por la mayoría de universidades)</td><td>DELE, SIELE</td></tr>
                    <tr><td>100% en inglés</td><td>B2 a C1</td><td>IELTS (6.0-6.5+), TOEFL iBT (80+)</td></tr>
                  </tbody>
                </table>
                <div class="warn"><strong>Atención:</strong> los certificados de nivel emitidos por academias de idiomas privadas no homologadas generalmente no son aceptados por UNEDasiss ni por los consulados. Use exclusivamente los exámenes oficiales DELE o SIELE.</div>
                <p style="font-size:13.5px;opacity:0.7;">El certificado B2 se verifica sistemáticamente en la entrevista de visado, incluso para programas en inglés — se recomienda igualmente un nivel A2 de español.</p>
                """),

            // ============================================================
            // 11. WORK
            // ============================================================
            section("work", 11,
                "Travail étudiant",
                "Student Work",
                "العمل الطلابي",
                "Trabajo estudiantil",
                """
                <p>La réglementation espagnole autorise les étudiants étrangers à travailler jusqu'à
                <strong>30 heures par semaine</strong>, sous réserve que l'employeur sollicite une autorisation
                auprès de l'Extranjería et que le travail reste compatible avec les horaires de cours.</p>
                <div class="warn">Les règles de travail pour visa étudiant évoluent régulièrement — confirmez toujours le détail actuel (heures exactes, démarches employeur) auprès du bureau international de votre université avant de vous engager sur un horaire.</div>
                """,
                """
                <p>Spanish regulations allow international students to work up to <strong>30 hours per week</strong>,
                provided the employer requests authorization from the Extranjería and the work remains compatible
                with class schedules.</p>
                <div class="warn">Student visa work rules change regularly — always confirm the current details (exact hours, employer procedures) with your university's international office before committing to a schedule.</div>
                """,
                """
                <p>تسمح اللوائح الإسبانية للطلبة الأجانب بالعمل حتى <strong>30 ساعة أسبوعيًا</strong>، بشرط أن
                يطلب صاحب العمل ترخيصًا من مصلحة الأجانب وأن يبقى العمل متوافقًا مع الجدول الدراسي.</p>
                <div class="warn">تتغير قواعد العمل الخاصة بتأشيرة الطالب بانتظام — تأكد دائمًا من التفاصيل الحالية (عدد الساعات الدقيق، إجراءات صاحب العمل) لدى المكتب الدولي بجامعتك قبل الالتزام بجدول عمل.</div>
                """,
                """
                <p>La normativa española permite a los estudiantes extranjeros trabajar hasta
                <strong>30 horas semanales</strong>, siempre que el empleador solicite autorización a Extranjería
                y el trabajo sea compatible con el horario de clases.</p>
                <div class="warn">Las normas de trabajo para el visado de estudiante cambian con regularidad — confirme siempre los detalles actuales (horas exactas, trámites del empleador) con la oficina internacional de su universidad antes de comprometerse con un horario.</div>
                """),

            // ============================================================
            // 12. DAILY LIFE
            // ============================================================
            section("life", 12,
                "Vie quotidienne et communauté",
                "Daily life & community",
                "الحياة اليومية والمجتمع",
                "Vida diaria y comunidad",
                """
                <h3>Trouver sa communauté</h3>
                <ul>
                  <li>Les communautés algérienne et maghrébine sont bien établies à Valence, Barcelone, Saragosse, Madrid</li>
                  <li>Les associations d'étudiants musulmans et nord-africains sont souvent le moyen le plus rapide de s'intégrer</li>
                </ul>
                <h3>Petits chocs culturels à anticiper</h3>
                <ul>
                  <li>Les horaires de repas sont plus tardifs qu'en Algérie — déjeuner vers 14h, dîner souvent après 21h</li>
                  <li>La bureaucratie prend du temps presque partout — prévoyez une marge</li>
                </ul>
                """,
                """
                <h3>Finding your community</h3>
                <ul>
                  <li>Algerian and Maghrebi communities are well established in Valencia, Barcelona, Zaragoza, Madrid</li>
                  <li>Muslim and North African student associations are often the fastest way to feel settled</li>
                </ul>
                <h3>Small culture shocks to expect</h3>
                <ul>
                  <li>Meal times run later than in Algeria — lunch around 2pm, dinner often after 9pm</li>
                  <li>Bureaucracy takes time almost everywhere — build in a margin</li>
                </ul>
                """,
                """
                <h3>إيجاد مجتمعك</h3>
                <ul>
                  <li>الجاليات الجزائرية والمغاربية راسخة جيدًا في فالنسيا وبرشلونة وسرقسطة ومدريد</li>
                  <li>جمعيات الطلبة المسلمين وشمال إفريقيا غالبًا ما تكون أسرع وسيلة للاندماج</li>
                </ul>
                <h3>صدمات ثقافية بسيطة يجب توقعها</h3>
                <ul>
                  <li>مواعيد الوجبات أكثر تأخرًا مقارنة بالجزائر — الغداء نحو الساعة 14، والعشاء غالبًا بعد الساعة 21</li>
                  <li>البيروقراطية تستغرق وقتًا في كل مكان تقريبًا — احسب هامشًا زمنيًا</li>
                </ul>
                """,
                """
                <h3>Encontrar su comunidad</h3>
                <ul>
                  <li>Las comunidades argelina y magrebí están bien establecidas en Valencia, Barcelona, Zaragoza, Madrid</li>
                  <li>Las asociaciones de estudiantes musulmanes y norteafricanos suelen ser la vía más rápida para integrarse</li>
                </ul>
                <h3>Pequeños choques culturales a esperar</h3>
                <ul>
                  <li>Los horarios de comida son más tardíos que en Argelia — comida hacia las 14h, cena a menudo después de las 21h</li>
                  <li>La burocracia lleva tiempo casi en todas partes — calcule un margen</li>
                </ul>
                """),

            // ============================================================
            // 13. FAQ
            // ============================================================
            section("faq", 13,
                "Questions fréquentes",
                "Frequently Asked Questions",
                "الأسئلة الشائعة",
                "Preguntas frecuentes",
                """
                <div class="faq-item"><div class="q">Puis-je étudier en Espagne avec un bac algérien ?</div><div>Oui, via l'homologation du bac sur UNEDasiss — la note est convertie sur une échelle de 5 à 10.</div></div>
                <div class="faq-item"><div class="q">Les épreuves PCE sont-elles obligatoires ?</div><div>Non, pas pour toutes les filières — mais elles peuvent ajouter jusqu'à 4 points pour atteindre une note de coupe élevée.</div></div>
                <div class="faq-item"><div class="q">Peut-on étudier entièrement en anglais ?</div><div>Oui, plusieurs universités publiques et privées proposent des cursus 100% anglais, niveau B2/C1 exigé.</div></div>
                <div class="faq-item"><div class="q">Un parent peut-il être mon garant financier ?</div><div>Oui, les parents directs sont les garants préférentiels, avec un dossier complet (fiches de paie, registre de commerce, historique bancaire de 6 mois).</div></div>
                <div class="faq-item"><div class="q">Combien de temps prend le traitement du visa ?</div><div>Généralement entre 2 et 6 semaines après le dépôt au centre BLS.</div></div>
                <div class="faq-item"><div class="q">Qu'est-ce que le NIE ?</div><div>Votre identifiant fiscal d'étranger — il figure sur le visa puis sur la carte TIE définitive.</div></div>
                <div class="faq-item"><div class="q">Les bourses espagnoles sont-elles accessibles aux Algériens ?</div><div>Les bourses du Ministère (Becas MEC) sont surtout réservées aux résidents européens — mieux vaut viser les bourses d'excellence des universités ou l'AUIP.</div></div>
                <div class="source-note">Contenu adapté du guide "Étudier en Espagne 2026-2027" (édition août 2026), sources : Ministerio de Inclusión, Seguridad Social y Migraciones ; Ministerio de Educación ; UNEDasiss ; Consulats d'Espagne à Alger/Oran. Ce guide reste informatif — vérifiez toujours les textes réglementaires officiels (BOE) et les consignes directes du consulat avant toute démarche.</div>
                """,
                """
                <div class="faq-item"><div class="q">Can I study in Spain with an Algerian Bac?</div><div>Yes, via Bac homologation on UNEDasiss — the grade is converted to a 5-10 scale.</div></div>
                <div class="faq-item"><div class="q">Are PCE exams mandatory?</div><div>No, not for every field — but they can add up to 4 points to reach a high cutoff grade.</div></div>
                <div class="faq-item"><div class="q">Can you study entirely in English?</div><div>Yes, several public and private universities offer 100% English-taught programs, B2/C1 level required.</div></div>
                <div class="faq-item"><div class="q">Can a parent be my financial sponsor?</div><div>Yes, direct parents are the preferred sponsors, with a complete file (payslips, business registry, 6 months of bank history).</div></div>
                <div class="faq-item"><div class="q">How long does visa processing take?</div><div>Usually 2 to 6 weeks after submission at the BLS center.</div></div>
                <div class="faq-item"><div class="q">What is the NIE?</div><div>Your foreigner tax ID number — it appears on the visa, then on the final TIE card.</div></div>
                <div class="faq-item"><div class="q">Are Spanish scholarships accessible to Algerians?</div><div>Ministry scholarships (Becas MEC) are mostly reserved for EU residents — university excellence scholarships or AUIP are better targets.</div></div>
                <div class="source-note">Content adapted from the "Étudier en Espagne 2026-2027" guide (August 2026 edition), sources: Ministerio de Inclusión, Seguridad Social y Migraciones; Ministerio de Educación; UNEDasiss; Spanish Consulates in Algiers/Oran. This guide remains informational — always check official regulatory texts (BOE) and direct consulate instructions before any procedure.</div>
                """,
                """
                <div class="faq-item"><div class="q">هل يمكنني الدراسة في إسبانيا بشهادة بكالوريا جزائرية؟</div><div>نعم، عبر معادلة البكالوريا على منصة UNEDasiss — يتم تحويل المعدل إلى سلم من 5 إلى 10.</div></div>
                <div class="faq-item"><div class="q">هل اختبارات PCE إلزامية؟</div><div>لا، ليست إلزامية لكل التخصصات — لكنها يمكن أن تضيف حتى 4 نقاط للوصول لمعدل قبول مرتفع.</div></div>
                <div class="faq-item"><div class="q">هل يمكن الدراسة بالإنجليزية بالكامل؟</div><div>نعم، تقدّم عدة جامعات عامة وخاصة برامج بالإنجليزية 100%، بمستوى B2/C1 مطلوب.</div></div>
                <div class="faq-item"><div class="q">هل يمكن لأحد الوالدين أن يكون كفيلي المالي؟</div><div>نعم، الوالدان المباشران هما الكفيلان المفضلان، بملف كامل (كشوف رواتب، سجل تجاري، كشف حساب بنكي لـ6 أشهر).</div></div>
                <div class="faq-item"><div class="q">كم تستغرق معالجة التأشيرة؟</div><div>عادةً من أسبوعين إلى 6 أسابيع بعد الإيداع في مركز BLS.</div></div>
                <div class="faq-item"><div class="q">ما هو رقم NIE؟</div><div>هو رقمك الضريبي كأجنبي — يظهر على التأشيرة ثم على بطاقة TIE النهائية.</div></div>
                <div class="faq-item"><div class="q">هل المنح الإسبانية متاحة للجزائريين؟</div><div>منح الوزارة (Becas MEC) مخصصة بالأساس لمقيمي الاتحاد الأوروبي — من الأفضل استهداف منح التميز الجامعية أو منظمة AUIP.</div></div>
                <div class="source-note">محتوى مقتبس من دليل "الدراسة في إسبانيا 2026-2027" (إصدار أغسطس 2026)، المصادر: وزارة الإدماج والضمان الاجتماعي والهجرة؛ وزارة التعليم؛ UNEDasiss؛ القنصليات الإسبانية في الجزائر ووهران. يبقى هذا الدليل ذا طابع إعلامي — تحقق دائمًا من النصوص التنظيمية الرسمية (BOE) وتعليمات القنصلية المباشرة قبل أي إجراء.</div>
                """,
                """
                <div class="faq-item"><div class="q">¿Puedo estudiar en España con un Bac argelino?</div><div>Sí, mediante la homologación del Bac en UNEDasiss — la nota se convierte a una escala de 5 a 10.</div></div>
                <div class="faq-item"><div class="q">¿Son obligatorias las pruebas PCE?</div><div>No, no para todas las carreras — pero pueden sumar hasta 4 puntos para alcanzar una nota de corte alta.</div></div>
                <div class="faq-item"><div class="q">¿Se puede estudiar totalmente en inglés?</div><div>Sí, varias universidades públicas y privadas ofrecen programas 100% en inglés, nivel B2/C1 exigido.</div></div>
                <div class="faq-item"><div class="q">¿Puede un progenitor ser mi avalista financiero?</div><div>Sí, los padres directos son los avalistas preferentes, con un expediente completo (nóminas, registro mercantil, historial bancario de 6 meses).</div></div>
                <div class="faq-item"><div class="q">¿Cuánto tarda la tramitación del visado?</div><div>Generalmente entre 2 y 6 semanas tras la presentación en el centro BLS.</div></div>
                <div class="faq-item"><div class="q">¿Qué es el NIE?</div><div>Su número de identificación fiscal como extranjero — aparece en el visado y luego en la tarjeta TIE definitiva.</div></div>
                <div class="faq-item"><div class="q">¿Son accesibles las becas españolas para argelinos?</div><div>Las becas del Ministerio (Becas MEC) están sobre todo reservadas a residentes de la UE — es mejor apuntar a becas de excelencia universitarias o a la AUIP.</div></div>
                <div class="source-note">Contenido adaptado de la guía "Étudier en Espagne 2026-2027" (edición de agosto de 2026), fuentes: Ministerio de Inclusión, Seguridad Social y Migraciones; Ministerio de Educación; UNEDasiss; Consulados de España en Argel/Orán. Esta guía sigue siendo informativa — verifique siempre los textos reglamentarios oficiales (BOE) y las instrucciones directas del consulado antes de cualquier trámite.</div>
                """)
        );

        attachNotes(spain, "visa",
            "Vous passez par BLS International (Alger ou Oran selon votre wilaya). Depuis l'entrée en vigueur de l'apostille pour l'Algérie (juillet 2026), la légalisation de vos documents est désormais simplifiée par rapport à l'ancien circuit consulaire complet.",
            "Vous passez par BLS International, avec six postes consulaires possibles selon votre lieu de résidence (Rabat, Casablanca, Tanger, Tétouan, Agadir, Nador). Le Maroc est membre de la Convention de La Haye sur l'apostille depuis 2016 — vos documents publics n'ont besoin que d'un simple apostille, pas d'une légalisation consulaire complète.",
            "Vous passez par BLS International à Tunis. La Tunisie est membre de la Convention de La Haye sur l'apostille depuis 2018 — la légalisation de vos documents est donc simplifiée, comme pour le Maroc.");

        attachNotes(spain, "homolog",
            "La procédure UNEDasiss est la même pour tous. Depuis juillet 2026, vos documents algériens à apostiller n'ont plus besoin de la légalisation consulaire complète d'avant.",
            "Même procédure UNEDasiss. Vos documents marocains sont apostillés depuis 2016 — cette étape est donc plus rapide que pour un candidat algérien d'avant juillet 2026.",
            "Même procédure UNEDasiss. Vos documents tunisiens sont apostillés depuis 2018.");

        sections.saveAll(spain);
    }

    private void seedFranceAndItalySections() {
        List<Section> france = List.of(

            // ============================================================
            // FRANCE
            // ============================================================
            section3("admission", "fr", 1,
                "Admission : la procédure Campus France",
                "Admission: the Campus France procedure",
                "القبول: إجراءات Campus France",
                """
                <p>Passer par Campus France est obligatoire pour étudier en France dès que votre pays en fait partie
                (c'est le cas de l'Algérie, du Maroc et de la Tunisie). La procédure se déroule en 5 grandes étapes.</p>

                <h3>1. Le TCF (test de connaissance du français)</h3>
                <p>Deux versions existent selon votre niveau d'études :</p>
                <ul>
                  <li><strong>TCF SO</strong> — pour une L2, L3, Master : 3 parties (compréhension orale, structures de langue/grammaire, compréhension écrite)</li>
                  <li><strong>TCF DAP</strong> (= TCF SO + production écrite) — obligatoire pour une <strong>L1</strong> (première année de licence)</li>
                </ul>
                <p style="font-size:13.5px;opacity:0.7;">Préparez-vous sérieusement : c'est un test qui peut vraiment départager les candidatures.</p>

                <h3>2. La "boîte pastel" (plateforme Études en France)</h3>
                <p>C'est la plateforme où vous déposez votre dossier pour chaque université visée. Documents généralement demandés :</p>
                <ul>
                  <li>Passeport</li>
                  <li>Diplôme du bac + relevé de notes du bac + traduction</li>
                  <li>TCF</li>
                  <li>Certificat de scolarité (ou certificat de travail si vous êtes en activité) + traduction</li>
                  <li>Diplôme universitaire + traduction (si vous en avez un)</li>
                  <li>Une <strong>lettre de motivation par université</strong> visée</li>
                  <li>CV</li>
                  <li>Relevés de notes complets + traduction</li>
                  <li>Lettre de recommandation (non obligatoire)</li>
                </ul>
                <div class="warn">Si vous avez une année de battement après le bac (redoublement, pause), prévoyez une lettre explicative — les jurys posent souvent la question en entretien.</div>

                <h3>3. L'entretien</h3>
                <p>Un entretien payant avec un agent Campus France. Il peut vous questionner sur votre projet d'études,
                votre projet professionnel, le contenu de votre lettre de motivation, pourquoi la France, pourquoi
                telle université en particulier, et — si vous avez déjà une admission — où vous comptez vous loger.</p>

                <h3>4. Réponse des universités</h3>
                <p>Une fois l'entretien validé, les universités répondent. En cas de refus, un recours est possible :
                contactez le responsable de formation par email, ou l'adresse dédiée aux recours si le programme
                n'en a pas de spécifique.</p>

                <h3>5. Visa</h3>
                <p>Dernière étape une fois admis — voir la section Visa.</p>

                <h3>Structurer sa lettre de motivation (4 parties)</h3>
                <ol>
                  <li><strong>Votre spécialité</strong> — ce que vous étudiez, en général puis en particulier ; pourquoi cette université précisément</li>
                  <li><strong>Vos compétences</strong> — ce que vous savez déjà faire, en lien avec la spécialité visée</li>
                  <li><strong>Projet d'étude</strong> — le diplôme visé, les compétences qu'il vous apportera, et pourquoi cette université correspond à ce projet</li>
                  <li><strong>Projet professionnel</strong> — le métier que vous visez après le diplôme, et les missions de ce poste</li>
                </ol>
                <p style="font-size:13.5px;opacity:0.7;">Terminez par une courte conclusion, en vous montrant disponible pour en discuter davantage en entretien.</p>
                """,
                """
                <p>Going through Campus France is mandatory to study in France once your country is part of the
                system (Algeria, Morocco, and Tunisia all are). The process runs through 5 main steps.</p>

                <h3>1. The TCF (French knowledge test)</h3>
                <p>Two versions exist depending on your study level:</p>
                <ul>
                  <li><strong>TCF SO</strong> — for L2, L3, Master's: 3 parts (listening, language structure/grammar, reading)</li>
                  <li><strong>TCF DAP</strong> (= TCF SO + written production) — mandatory for <strong>L1</strong> (first-year bachelor's)</li>
                </ul>
                <p style="font-size:13.5px;opacity:0.7;">Prepare seriously — this test can genuinely make or break an application.</p>

                <h3>2. The "boîte pastel" (Études en France platform)</h3>
                <p>This is where you submit your file for each university you're targeting. Documents usually required:</p>
                <ul>
                  <li>Passport</li>
                  <li>Bac diploma + Bac transcript + translation</li>
                  <li>TCF certificate</li>
                  <li>School enrollment certificate (or work certificate if employed) + translation</li>
                  <li>University degree + translation (if you have one)</li>
                  <li>A <strong>motivation letter per university</strong> targeted</li>
                  <li>CV</li>
                  <li>Full transcripts + translation</li>
                  <li>Recommendation letter (optional)</li>
                </ul>
                <div class="warn">If you have a gap year after the Bac (repeated year, pause), prepare an explanatory letter — panels often ask about this at interview.</div>

                <h3>3. The interview</h3>
                <p>A paid interview with a Campus France agent. They may ask about your study project, career
                project, the content of your motivation letter, why France, why that specific university, and —
                if you already have an offer — where you plan to live.</p>

                <h3>4. University response</h3>
                <p>Once the interview is validated, universities respond. If rejected, an appeal is possible:
                contact the program's responsable de formation by email, or the dedicated appeal address if the
                program doesn't have one listed.</p>

                <h3>5. Visa</h3>
                <p>Final step once admitted — see the Visa section.</p>

                <h3>Structuring your motivation letter (4 parts)</h3>
                <ol>
                  <li><strong>Your specialty</strong> — what you study, in general then in particular; why this specific university</li>
                  <li><strong>Your skills</strong> — what you already know how to do, relevant to the targeted specialty</li>
                  <li><strong>Study project</strong> — the degree you're aiming for, the skills it will give you, and why this university fits that project</li>
                  <li><strong>Career project</strong> — the job you're aiming for after the degree, and what that role involves</li>
                </ol>
                <p style="font-size:13.5px;opacity:0.7;">End with a short conclusion, showing you're available to discuss further at interview.</p>
                """,
                """
                <p>المرور عبر Campus France إلزامي للدراسة في فرنسا بمجرد أن يكون بلدك ضمن هذا النظام
                (الجزائر والمغرب وتونس جميعها كذلك). تمر الإجراءات عبر 5 مراحل رئيسية.</p>

                <h3>1. اختبار TCF (اختبار الكفاءة في اللغة الفرنسية)</h3>
                <p>يوجد نسختان حسب مستواك الدراسي:</p>
                <ul>
                  <li><strong>TCF SO</strong> — للسنة الثانية والثالثة ليسانس والماستر: 3 أجزاء (فهم شفوي، بنية اللغة/القواعد، فهم مكتوب)</li>
                  <li><strong>TCF DAP</strong> (= TCF SO + إنتاج كتابي) — إلزامي للسنة الأولى ليسانس (<strong>L1</strong>)</li>
                </ul>
                <p style="font-size:13.5px;opacity:0.7;">استعد بجدية — هذا الاختبار يمكن أن يحدد مصير الترشح فعليًا.</p>

                <h3>2. منصة "boîte pastel" (Études en France)</h3>
                <p>هي المنصة التي تودع فيها ملفك لكل جامعة تستهدفها. الوثائق المطلوبة عادةً:</p>
                <ul>
                  <li>جواز السفر</li>
                  <li>شهادة البكالوريا + كشف نقاط البكالوريا + الترجمة</li>
                  <li>شهادة TCF</li>
                  <li>شهادة مدرسية (أو شهادة عمل إذا كنت تعمل) + الترجمة</li>
                  <li>الشهادة الجامعية + الترجمة (إن وجدت)</li>
                  <li><strong>رسالة تحفيزية لكل جامعة</strong> مستهدفة</li>
                  <li>السيرة الذاتية</li>
                  <li>كشوف النقاط الكاملة + الترجمة</li>
                  <li>رسالة توصية (غير إلزامية)</li>
                </ul>
                <div class="warn">إذا كانت لديك سنة انقطاع بعد البكالوريا (إعادة سنة، توقف)، حضّر رسالة توضيحية — غالبًا ما تُطرح هذه النقطة في المقابلة.</div>

                <h3>3. المقابلة</h3>
                <p>مقابلة مدفوعة مع موظف من Campus France. قد يسألك عن مشروعك الدراسي، مشروعك المهني، محتوى
                رسالتك التحفيزية، لماذا فرنسا، لماذا هذه الجامعة بالتحديد، وإذا كان لديك قبول مسبق، أين تنوي السكن.</p>

                <h3>4. رد الجامعات</h3>
                <p>بعد التحقق من نجاح المقابلة، تردّ الجامعات. في حال الرفض، يمكن تقديم طعن: التواصل مع
                المسؤول عن التكوين عبر البريد الإلكتروني، أو عنوان الطعون المخصص إذا لم يوجد عنوان محدد للبرنامج.</p>

                <h3>5. التأشيرة</h3>
                <p>المرحلة الأخيرة بعد القبول — راجع قسم التأشيرة.</p>

                <h3>هيكلة رسالة التحفيز (4 أجزاء)</h3>
                <ol>
                  <li><strong>تخصصك</strong> — ما تدرسه، بشكل عام ثم بشكل خاص؛ ولماذا هذه الجامعة بالتحديد</li>
                  <li><strong>مهاراتك</strong> — ما تعرف فعله بالفعل، وله علاقة بالتخصص المستهدف</li>
                  <li><strong>المشروع الدراسي</strong> — الشهادة المستهدفة، المهارات التي ستكتسبها، ولماذا تتوافق هذه الجامعة مع هذا المشروع</li>
                  <li><strong>المشروع المهني</strong> — الوظيفة التي تستهدفها بعد التخرج، ومهام هذا المنصب</li>
                </ol>
                <p style="font-size:13.5px;opacity:0.7;">اختم برسالة موجزة، مُظهرًا استعدادك لمناقشة الأمر أكثر خلال المقابلة.</p>
                """),

            section3("visa", "fr", 2,
                "Visa étudiant & exigences financières",
                "Student Visa & Financial Requirements",
                "تأشيرة الطالب والمتطلبات المالية",
                """
                <p>Le visa long séjour valant titre de séjour (<strong>VLS-TS mention "étudiant"</strong>) est délivré
                par le Consulat de France, après validation de la procédure Campus France. Le dossier se dépose ensuite
                chez <strong>TLScontact</strong> (et non BLS, contrairement à l'Espagne).</p>

                <div class="warn"><strong>Changement récent important :</strong> depuis le 1er août 2026, le seuil de ressources exigé est passé de 615€/mois (fixe depuis 2002) à <strong>877,50€/mois</strong> (soit environ 10 530€/an) — indexé sur 47% du SMIC brut, donc révisé chaque année. Ce montant s'applique aussi bien aux premières demandes qu'aux renouvellements.</div>

                <h3>Justificatifs de ressources acceptés</h3>
                <ul>
                  <li>Fonds bancaires personnels</li>
                  <li>Garant avec justificatifs de revenus</li>
                  <li>Attestation de prise en charge (AVI)</li>
                </ul>

                <div class="warn">Depuis le 1er juillet 2026, les étudiants non-boursiers et non ressortissants UE/EEE/Suisse ont perdu l'accès aux aides au logement (APL/ALS/ALF). Ce n'est plus un complément de budget sur lequel compter — intégrez son absence dans votre calcul.</div>

                <h3>Documents généralement demandés</h3>
                <p>Passeport, dossier France-Visas, attestation Campus France, justificatif de ressources, justificatif
                de logement, certificat de niveau de français (TCF/DELF B2/DALF selon le programme), documents
                d'état civil.</p>
                """,
                """
                <p>The long-stay visa valid as a residence permit (<strong>VLS-TS "student"</strong>) is issued by
                the French Consulate, after clearing the Campus France procedure. The file is then submitted at
                <strong>TLScontact</strong> (not BLS, unlike Spain).</p>

                <div class="warn"><strong>Important recent change:</strong> as of August 1, 2026, the required resources threshold rose from €615/month (fixed since 2002) to <strong>€877.50/month</strong> (about €10,530/year) — indexed to 47% of the gross minimum wage, so it's revised every year. This applies to both first-time applications and renewals.</div>

                <h3>Accepted proof of resources</h3>
                <ul>
                  <li>Personal bank funds</li>
                  <li>A sponsor with proof of income</li>
                  <li>A statement of financial support (AVI)</li>
                </ul>

                <div class="warn">Since July 1, 2026, non-scholarship students who aren't EU/EEA/Swiss nationals lost access to housing aid (APL/ALS/ALF). This is no longer a budget cushion to count on — factor its absence into your calculations.</div>

                <h3>Documents typically required</h3>
                <p>Passport, France-Visas file, Campus France certificate, proof of resources, proof of
                accommodation, French level certificate (TCF/DELF B2/DALF depending on the program), civil
                status documents.</p>
                """,
                """
                <p>تُمنح تأشيرة الإقامة الطويلة التي تعادل تصريح الإقامة (<strong>VLS-TS بذكر "طالب"</strong>)
                من طرف القنصلية الفرنسية، بعد إتمام إجراءات Campus France. يُودع الملف بعد ذلك لدى
                <strong>TLScontact</strong> (وليس BLS، خلافًا لإسبانيا).</p>

                <div class="warn"><strong>تغيير حديث مهم:</strong> اعتبارًا من 1 أغسطس 2026، ارتفع الحد الأدنى للموارد المطلوبة من 615 يورو شهريًا (ثابت منذ 2002) إلى <strong>877.50 يورو شهريًا</strong> (نحو 10530 يورو سنويًا) — مرتبط بـ47% من الحد الأدنى الإجمالي للأجور، وبالتالي يُراجع سنويًا. ينطبق هذا المبلغ على الطلبات الأولى وعلى التجديدات على حد سواء.</div>

                <h3>إثباتات الموارد المقبولة</h3>
                <ul>
                  <li>أموال بنكية شخصية</li>
                  <li>كفيل مع إثباتات الدخل</li>
                  <li>شهادة تكفل مالي (AVI)</li>
                </ul>

                <div class="warn">منذ 1 يوليو 2026، فقد الطلبة غير المنحيين وغير مواطني الاتحاد الأوروبي/المنطقة الاقتصادية الأوروبية/سويسرا إمكانية الحصول على إعانات السكن (APL/ALS/ALF). لم تعد هذه الإعانة عاملًا يمكن الاعتماد عليه في الميزانية — احسب غيابها في تقديراتك.</div>

                <h3>الوثائق المطلوبة عادةً</h3>
                <p>جواز السفر، ملف France-Visas، شهادة Campus France، إثبات الموارد المالية، إثبات السكن،
                شهادة مستوى اللغة الفرنسية (TCF/DELF B2/DALF حسب البرنامج)، وثائق الحالة المدنية.</p>
                """),

            section3("budget", "fr", 3,
                "Budget réel en France",
                "Real Budget in France",
                "الميزانية الحقيقية في فرنسا",
                """
                <p>Le logement est le plus gros poste de dépense en France, souvent loin devant la nourriture ou
                le transport — jusqu'à dépasser 50% du budget mensuel dans les grandes villes.</p>

                <h3>Loyers étudiants par ville (2026)</h3>
                <table>
                  <thead><tr><th>Ville</th><th>Studio</th><th>Colocation</th></tr></thead>
                  <tbody>
                    <tr><td>Paris</td><td>850€ – 1 300€</td><td>650€ – 950€</td></tr>
                    <tr><td>Lyon</td><td>570€ – 700€ (médiane ~659€)</td><td>300€ – 400€</td></tr>
                    <tr><td>Bordeaux</td><td>~636€</td><td>—</td></tr>
                    <tr><td>Toulouse, Nantes, Rennes, Strasbourg</td><td>souvent &lt; 400€</td><td>—</td></tr>
                    <tr><td>Villes à taille humaine (Limoges, Poitiers, Saint-Étienne)</td><td>~410€</td><td>—</td></tr>
                  </tbody>
                </table>
                <p style="font-size:13.5px;opacity:0.7;">Budget national moyen logement : ~719€/mois. Résidence CROUS, quand elle est accessible, reste l'option la moins chère — mais places limitées et boursiers prioritaires.</p>

                <h3>Budget mensuel total, hors logement</h3>
                <p>Alimentation, transport, téléphone/internet, loisirs : comptez généralement entre 400€ et 600€/mois
                selon la ville et le mode de vie.</p>

                <div class="warn"><strong>Rappel :</strong> sans bourse, plus d'APL/ALS/ALF depuis juillet 2026 — le budget logement doit être couvert intégralement par vos propres moyens.</div>
                """,
                """
                <p>Housing is the biggest expense in France, often well ahead of food or transport — it can pass
                50% of the monthly budget in major cities.</p>

                <h3>Student rents by city (2026)</h3>
                <table>
                  <thead><tr><th>City</th><th>Studio</th><th>Shared flat</th></tr></thead>
                  <tbody>
                    <tr><td>Paris</td><td>€850 – €1,300</td><td>€650 – €950</td></tr>
                    <tr><td>Lyon</td><td>€570 – €700 (median ~€659)</td><td>€300 – €400</td></tr>
                    <tr><td>Bordeaux</td><td>~€636</td><td>—</td></tr>
                    <tr><td>Toulouse, Nantes, Rennes, Strasbourg</td><td>often &lt; €400</td><td>—</td></tr>
                    <tr><td>Smaller cities (Limoges, Poitiers, Saint-Étienne)</td><td>~€410</td><td>—</td></tr>
                  </tbody>
                </table>
                <p style="font-size:13.5px;opacity:0.7;">National average housing budget: ~€719/month. CROUS housing, when accessible, remains the cheapest option — but spots are limited and scholarship holders get priority.</p>

                <h3>Total monthly budget, excluding housing</h3>
                <p>Food, transport, phone/internet, leisure: generally count on €400 to €600/month depending on
                the city and lifestyle.</p>

                <div class="warn"><strong>Reminder:</strong> without a scholarship, there's no more APL/ALS/ALF since July 2026 — your housing budget needs to be fully covered by your own means.</div>
                """,
                """
                <p>السكن هو أكبر بند إنفاق في فرنسا، غالبًا بفارق كبير عن الغذاء أو النقل — يمكن أن يتجاوز
                50% من الميزانية الشهرية في المدن الكبرى.</p>

                <h3>إيجارات الطلبة حسب المدينة (2026)</h3>
                <table>
                  <thead><tr><th>المدينة</th><th>استوديو</th><th>سكن مشترك</th></tr></thead>
                  <tbody>
                    <tr><td>باريس</td><td>850 – 1300 يورو</td><td>650 – 950 يورو</td></tr>
                    <tr><td>ليون</td><td>570 – 700 يورو (الوسيط ~659)</td><td>300 – 400 يورو</td></tr>
                    <tr><td>بوردو</td><td>~636 يورو</td><td>—</td></tr>
                    <tr><td>تولوز، نانت، رين، ستراسبورغ</td><td>غالبًا أقل من 400 يورو</td><td>—</td></tr>
                    <tr><td>مدن أصغر (ليموج، بواتييه، سانت إتيان)</td><td>~410 يورو</td><td>—</td></tr>
                  </tbody>
                </table>
                <p style="font-size:13.5px;opacity:0.7;">متوسط ميزانية السكن على المستوى الوطني: ~719 يورو/شهر. سكن CROUS، عند توفره، يبقى الخيار الأرخص — لكن الأماكن محدودة والأولوية للمنحيين.</p>

                <h3>الميزانية الشهرية الإجمالية، بدون السكن</h3>
                <p>الغذاء، النقل، الهاتف/الإنترنت، الترفيه: احسب عمومًا بين 400 و600 يورو/شهر حسب المدينة
                ونمط الحياة.</p>

                <div class="warn"><strong>تذكير:</strong> بدون منحة، لم تعد إعانات APL/ALS/ALF متاحة منذ يوليو 2026 — يجب تغطية ميزانية السكن بالكامل من مواردك الخاصة.</div>
                """),

            section3("logement", "fr", 4,
                "Logement en France",
                "Housing in France",
                "السكن في فرنسا",
                """
                <h3>Les options</h3>
                <ul>
                  <li><strong>CROUS</strong> — le moins cher quand accessible, mais places limitées, boursiers prioritaires. Demande via le Dossier Social Étudiant (DSE) sur messervices.etudiant.gouv.fr, généralement entre mars et mai. Les étudiants internationaux peuvent candidater à partir de juillet selon les disponibilités.</li>
                  <li><strong>Colocation</strong> — l'option la plus courante pour les étudiants étrangers, souvent le meilleur rapport qualité/prix hors CROUS</li>
                  <li><strong>Résidence privée</strong> — plus cher mais plus simple à obtenir rapidement</li>
                </ul>

                <div class="warn"><strong>Attention à la tension locative :</strong> à Paris particulièrement, la demande dépasse largement l'offre. Commencez vos recherches dès juillet-août, et prévoyez le coût des deux mois d'été si vous signez tôt.</div>

                <h3>Conseils pratiques</h3>
                <ul>
                  <li>Évaluez votre budget réel avant de chercher (loyer + charges + dépôt de garantie + éventuels frais d'agence)</li>
                  <li>Choisissez le quartier selon la proximité avec les transports, pas seulement avec l'université</li>
                  <li>Préparez votre dossier locatif à l'avance — garant, justificatifs de revenus, etc.</li>
                  <li>La garantie <strong>Visale</strong> (gratuite) et l'avance <strong>Loca-Pass</strong> (prêt à taux zéro, jusqu'à 1 200€) peuvent faciliter l'accès à un logement sans garant classique</li>
                </ul>
                """,
                """
                <h3>Your options</h3>
                <ul>
                  <li><strong>CROUS</strong> — cheapest when accessible, but limited spots, scholarship holders get priority. Apply via the Dossier Social Étudiant (DSE) on messervices.etudiant.gouv.fr, usually between March and May. International students can apply from July depending on availability.</li>
                  <li><strong>Shared flat (colocation)</strong> — the most common option for international students, often the best value outside CROUS</li>
                  <li><strong>Private residence</strong> — more expensive but easier to secure quickly</li>
                </ul>

                <div class="warn"><strong>Watch out for rental pressure:</strong> in Paris especially, demand far exceeds supply. Start your search as early as July-August, and budget for the two summer months if you sign early.</div>

                <h3>Practical tips</h3>
                <ul>
                  <li>Work out your real budget before searching (rent + utilities + deposit + possible agency fees)</li>
                  <li>Choose your neighborhood based on transport links, not just proximity to the university</li>
                  <li>Prepare your rental file in advance — guarantor, proof of income, etc.</li>
                  <li>The free <strong>Visale</strong> guarantee and the zero-interest <strong>Loca-Pass</strong> advance (up to €1,200) can make it easier to secure housing without a traditional guarantor</li>
                </ul>
                """,
                """
                <h3>الخيارات المتاحة</h3>
                <ul>
                  <li><strong>CROUS</strong> — الأرخص عند توفره، لكن الأماكن محدودة والأولوية للمنحيين. التقديم عبر الملف الاجتماعي للطالب (DSE) على messervices.etudiant.gouv.fr، عادةً بين مارس ومايو. يمكن للطلبة الدوليين التقديم ابتداءً من يوليو حسب التوفر.</li>
                  <li><strong>السكن المشترك</strong> — الخيار الأكثر شيوعًا للطلبة الأجانب، غالبًا الأفضل من حيث الجودة والسعر خارج CROUS</li>
                  <li><strong>الإقامة الخاصة</strong> — أغلى ثمنًا لكن أسهل للحصول عليها بسرعة</li>
                </ul>

                <div class="warn"><strong>احذر ضغط السوق الإيجاري:</strong> في باريس بشكل خاص، يفوق الطلب العرض بكثير. ابدأ البحث منذ يوليو-أغسطس، واحسب تكلفة شهري الصيف إذا وقّعت مبكرًا.</div>

                <h3>نصائح عملية</h3>
                <ul>
                  <li>احسب ميزانيتك الحقيقية قبل البحث (الإيجار + الأعباء + تأمين الضمان + رسوم الوكالة المحتملة)</li>
                  <li>اختر الحي بناءً على قرب وسائل النقل، وليس فقط قرب الجامعة</li>
                  <li>حضّر ملف الإيجار مسبقًا — الضامن، إثباتات الدخل، إلخ</li>
                  <li>يمكن لضمان <strong>Visale</strong> المجاني وتسبيقة <strong>Loca-Pass</strong> بدون فوائد (حتى 1200 يورو) أن يسهّلا الحصول على سكن بدون ضامن تقليدي</li>
                </ul>
                """),

            section3("arrivee", "fr", 5,
                "Arrivée : validation du titre de séjour & banque",
                "Arrival: residence permit validation & banking",
                "الوصول: التحقق من تصريح الإقامة والبنك",
                """
                <h3>Validation du VLS-TS (ex-OFII)</h3>
                <p>Depuis 2021, la validation se fait en ligne via l'<strong>ANEF</strong>, dans les 3 mois suivant
                votre arrivée — plus besoin de passage physique à l'OFII dans la majorité des cas. Une taxe de
                <strong>150€</strong> (100€ + 50€ de timbre) s'applique depuis le 1er mai 2026 pour les étudiants
                (le tarif standard hors étudiant est de 350€). Conservez précieusement la confirmation PDF — elle
                vous sera redemandée pour la CAF, la banque, ou le renouvellement de titre.</p>

                <h3>Ouvrir un compte bancaire</h3>
                <p>Passeport, VLS-TS validé, justificatif de domicile et certificat de scolarité suffisent généralement.
                Les banques en ligne (N26, Revolut, etc.) sont souvent plus rapides à ouvrir pour un nouvel arrivant
                que les banques traditionnelles.</p>
                """,
                """
                <h3>Validating the VLS-TS (formerly OFII)</h3>
                <p>Since 2021, validation is done online via <strong>ANEF</strong>, within 3 months of your
                arrival — no more need for a physical OFII visit in most cases. A <strong>€150</strong> tax
                (€100 + €50 stamp) applies since May 1, 2026 for students (the standard non-student rate is €350).
                Keep the PDF confirmation carefully — you'll need it again for CAF, the bank, or renewal.</p>

                <h3>Opening a bank account</h3>
                <p>Passport, validated VLS-TS, proof of address, and enrollment certificate are usually enough.
                Online banks (N26, Revolut, etc.) are often faster to open for a newcomer than traditional banks.</p>
                """,
                """
                <h3>التحقق من VLS-TS (سابقًا OFII)</h3>
                <p>منذ 2021، يتم التحقق عبر الإنترنت عن طريق <strong>ANEF</strong>، خلال 3 أشهر من تاريخ
                وصولك — لم يعد هناك حاجة للحضور الفعلي إلى OFII في معظم الحالات. تُطبَّق رسوم قدرها
                <strong>150 يورو</strong> (100 يورو + 50 يورو رسم طابع) منذ 1 مايو 2026 بالنسبة للطلبة
                (الرسم العادي لغير الطلبة هو 350 يورو). احتفظ جيدًا بتأكيد PDF — ستحتاجه لاحقًا لصندوق
                المساعدات العائلية CAF، أو البنك، أو تجديد التصريح.</p>

                <h3>فتح حساب بنكي</h3>
                <p>عادةً ما يكفي جواز السفر، وVLS-TS المُحقَّق، وإثبات السكن، وشهادة التسجيل الجامعي.
                البنوك الرقمية (مثل N26 وRevolut) غالبًا ما تكون أسرع في فتح حساب للقادم الجديد مقارنة
                بالبنوك التقليدية.</p>
                """),

            section3("travail", "fr", 6,
                "Travail étudiant",
                "Student Work",
                "العمل الطلابي",
                """
                <p>Le VLS-TS mention "étudiant" autorise à travailler jusqu'à <strong>964 heures par an</strong>
                (environ 60% d'un temps plein, soit ~20h/semaine en moyenne), sans autorisation de travail séparée.
                La période de référence est glissante sur 12 mois à partir de la date de validité du titre, et non
                l'année civile.</p>
                <div class="warn">Les règles de travail évoluent régulièrement — confirmez toujours le détail actuel auprès du bureau international de votre université avant de vous engager sur un horaire.</div>
                """,
                """
                <p>The VLS-TS "student" title allows work up to <strong>964 hours per year</strong> (about 60% of
                full-time, roughly 20h/week on average), with no separate work permit needed. The reference period
                is a rolling 12 months from the title's validity date, not the calendar year.</p>
                <div class="warn">Work rules change regularly — always confirm the current details with your university's international office before committing to a schedule.</div>
                """,
                """
                <p>يسمح تصريح VLS-TS بذكر "طالب" بالعمل حتى <strong>964 ساعة سنويًا</strong> (نحو 60% من
                العمل بدوام كامل، أي ~20 ساعة أسبوعيًا في المتوسط)، بدون الحاجة إلى تصريح عمل منفصل. الفترة
                المرجعية هي 12 شهرًا متجددة من تاريخ صلاحية التصريح، وليست السنة الميلادية.</p>
                <div class="warn">تتغير قواعد العمل بانتظام — تأكد دائمًا من التفاصيل الحالية لدى المكتب الدولي بجامعتك قبل الالتزام بجدول عمل.</div>
                """)
        );

        attachNotes(france, "admission",
            "Dépôt du dossier visa chez TLScontact (villes desservies en Algérie : Alger, Oran, Annaba selon les sources disponibles). Le tarif exact de la procédure Campus France Algérie n'a pas pu être confirmé avec certitude dans nos recherches — vérifiez-le directement sur algerie.campusfrance.org lors de votre inscription.",
            "Dépôt du dossier visa chez TLScontact à Rabat. Frais de la procédure Campus France Maroc : 1 900 MAD (environ 175€), payables par carte.",
            "Dépôt du dossier visa chez TLScontact à Tunis ou Sfax. Frais de la procédure Campus France Tunisie : 400 TND (tarif en vigueur depuis août 2025).");

        attachNotes(france, "visa",
            "Le seuil de 877,50€/mois s'applique de la même façon aux candidats algériens, quelle que soit la nationalité. L'Algérie a rejoint la Convention de La Haye sur l'apostille en juillet 2026 — vos documents publics peuvent désormais être simplement apostillés plutôt que légalisés intégralement.",
            "Même seuil financier que pour les autres nationalités. Le Maroc étant membre de la Convention de La Haye depuis 2016, vos documents publics n'ont besoin que d'un apostille.",
            "Même seuil financier. La Tunisie étant membre de la Convention de La Haye depuis 2018, vos documents publics n'ont besoin que d'un apostille.");

        attachNotes(france, "travail",
            "Important : les ressortissants algériens ne relèvent pas du régime général du travail étudiant décrit ci-dessus. Un accord bilatéral franco-algérien de 1968 régit spécifiquement le séjour et le travail des Algériens en France, avec des règles distinctes du droit commun. Renseignez-vous précisément auprès du consulat ou d'un avocat spécialisé — ne présumez pas que les 964h/an standards s'appliquent tel quel à votre situation.",
            "Le régime standard décrit ci-dessus (964h/an) s'applique normalement aux ressortissants marocains, qui ne bénéficient pas d'un accord bilatéral distinct comme celui des Algériens.",
            "Le régime standard décrit ci-dessus (964h/an) s'applique normalement aux ressortissants tunisiens, qui ne bénéficient pas d'un accord bilatéral distinct comme celui des Algériens.");

        sections.saveAll(france);

        List<Section> italy = List.of(

            // ============================================================
            // ITALY
            // ============================================================
            section3("admission", "it", 1,
                "Admission : Universitaly, CIMEA & le dossier visa",
                "Admission: Universitaly, CIMEA & the visa file",
                "القبول: منصة Universitaly وCIMEA وملف التأشيرة",
                """
                <p>L'inscription passe par la plateforme <strong>Universitaly</strong> (pré-inscription obligatoire
                et gratuite) après l'admission de l'université, puis par la reconnaissance de votre diplôme via
                <strong>CIMEA</strong> (Dichiarazione di Valore ou Statement of Comparability).</p>

                <h3>Documents académiques pour le dossier visa</h3>
                <table>
                  <thead><tr><th>Niveau</th><th>Documents</th></tr></thead>
                  <tbody>
                    <tr><td>Licence</td><td>Diplôme du bac + relevé de notes (original + copie)</td></tr>
                    <tr><td>Master</td><td>Bac + relevé + relevé universitaire complet + diplôme de licence + tous les relevés annuels</td></tr>
                  </tbody>
                </table>

                <h3>Documents personnels</h3>
                <ul>
                  <li>Passeport + copies de toutes les pages</li>
                  <li>Carte d'identité nationale</li>
                  <li>Acte de naissance + état civil</li>
                  <li>Relevé bancaire (CCP ou attestation de solde)</li>
                  <li>Confirmations Pre-Admission et Pre-Enrollment</li>
                  <li>Certificat d'anglais (IELTS) si le programme l'exige</li>
                  <li>Lettre explicative en cas de besoin (parcours atypique, etc.)</li>
                </ul>
                """,
                """
                <p>Enrollment goes through the <strong>Universitaly</strong> platform (mandatory, free
                pre-enrollment) after university admission, then degree recognition via <strong>CIMEA</strong>
                (Dichiarazione di Valore or Statement of Comparability).</p>

                <h3>Academic documents for the visa file</h3>
                <table>
                  <thead><tr><th>Level</th><th>Documents</th></tr></thead>
                  <tbody>
                    <tr><td>Bachelor's (Licence)</td><td>Bac diploma + transcript (original + copy)</td></tr>
                    <tr><td>Master's</td><td>Bac + transcript + full university transcript + bachelor's diploma + all yearly transcripts</td></tr>
                  </tbody>
                </table>

                <h3>Personal documents</h3>
                <ul>
                  <li>Passport + copies of every page</li>
                  <li>National ID card</li>
                  <li>Birth certificate + civil status</li>
                  <li>Bank statement (CCP or balance certificate)</li>
                  <li>Pre-Admission and Pre-Enrollment confirmations</li>
                  <li>English certificate (IELTS) if the program requires it</li>
                  <li>Explanatory letter if needed (unusual academic path, etc.)</li>
                </ul>
                """,
                """
                <p>يتم التسجيل عبر منصة <strong>Universitaly</strong> (التسجيل المسبق إلزامي ومجاني) بعد
                القبول الجامعي، ثم معادلة الشهادة عبر <strong>CIMEA</strong> (Dichiarazione di Valore أو
                Statement of Comparability).</p>

                <h3>الوثائق الأكاديمية لملف التأشيرة</h3>
                <table>
                  <thead><tr><th>المستوى</th><th>الوثائق</th></tr></thead>
                  <tbody>
                    <tr><td>ليسانس</td><td>شهادة البكالوريا + كشف النقاط (الأصل + نسخة)</td></tr>
                    <tr><td>ماستر</td><td>البكالوريا + الكشف + الكشف الجامعي الكامل + شهادة الليسانس + جميع كشوف النقاط السنوية</td></tr>
                  </tbody>
                </table>

                <h3>الوثائق الشخصية</h3>
                <ul>
                  <li>جواز السفر + نسخ من جميع الصفحات</li>
                  <li>بطاقة التعريف الوطنية</li>
                  <li>شهادة الميلاد + الحالة المدنية</li>
                  <li>كشف حساب بنكي (CCP أو شهادة رصيد)</li>
                  <li>تأكيدات Pre-Admission وPre-Enrollment</li>
                  <li>شهادة اللغة الإنجليزية (IELTS) إذا اقتضى البرنامج ذلك</li>
                  <li>رسالة توضيحية عند الحاجة (مسار دراسي غير معتاد، إلخ)</li>
                </ul>
                """),

            section3("visa", "it", 2,
                "Visa étudiant & exigences financières",
                "Student Visa & Financial Requirements",
                "تأشيرة الطالب والمتطلبات المالية",
                """
                <div class="warn"><strong>Changement récent important :</strong> pour les années 2026-27 et 2027-28, le seuil financier exigé est de <strong>10 179,85€/an</strong> (contre environ 6 000€ auparavant, soit une hausse de +46,5%) — un montant annuel unique, sans équivalent mensuel officiel.</div>

                <h3>Documents financiers</h3>
                <ul>
                  <li>Compte bancaire au nom de l'étudiant avec les fonds requis</li>
                  <li>Certificat de donation si les fonds proviennent d'un tiers</li>
                  <li>Relevé de compte bancaire</li>
                  <li>Rendez-vous VES imprimé (Dichiarazione di Valore)</li>
                  <li>4 photos d'identité</li>
                  <li>CV au format Europass</li>
                  <li>Réservation d'hôtel ou billet d'avion (selon la date de début des cours)</li>
                  <li>Assurance médicale pour une année complète</li>
                </ul>

                <h3>Le dossier du garant — 6 catégories possibles</h3>
                <table>
                  <thead><tr><th>Type de garant</th><th>Documents à fournir</th></tr></thead>
                  <tbody>
                    <tr><td>Salarié</td><td>Certificat de travail récent, affiliation CNAS, 3 derniers bulletins de salaire, relevé bancaire (3 mois)</td></tr>
                    <tr><td>Retraité</td><td>Attestation de retraite avec montant actualisé (CNR), attestation de revenu mensuel/annuel, relevé bancaire (3 mois)</td></tr>
                    <tr><td>Commerçant / profession libérale</td><td>Registre du commerce + C20, certificat d'exercice, mise à jour CASNOS, relevé bancaire (3 mois)</td></tr>
                    <tr><td>Agriculteur</td><td>Carte d'agriculteur, certificat d'exploitation agricole, fiche signalétique, mise à jour CASNOS/C20, relevé bancaire (3 mois)</td></tr>
                    <tr><td>Résident à l'étranger</td><td>Copie du passeport ou titre de séjour, certificat de travail + 3 derniers bulletins de salaire, 3 relevés bancaires, dernière déclaration fiscale</td></tr>
                    <tr><td>Militaire</td><td>Assurance militaire, relevé de salaire mensuel/annuel, attestation d'activité ou de retraite, carte militaire, relevé CCP, état civil, acte de naissance en français</td></tr>
                  </tbody>
                </table>

                <h3>Ce qui renforce vraiment un dossier</h3>
                <ul>
                  <li>Un historique de visa Schengen déjà obtenu, surtout sans refus</li>
                  <li>Un garant de la famille proche (père, mère, frère/sœur) plutôt qu'un parent éloigné</li>
                  <li>Un bon parcours scolaire</li>
                  <li>Un compte bancaire mouvementé régulièrement plutôt qu'un dépôt ponctuel important</li>
                  <li>Un projet d'étude clair : pourquoi cette spécialité, cette université, l'Italie précisément</li>
                  <li>Un dossier du garant complet et cohérent, sans manque</li>
                  <li>Un niveau de langue démontré (certificat IELTS/anglais si applicable)</li>
                  <li>Une preuve de logement claire (réservation ou hôtel)</li>
                  <li>Aucune contradiction entre les informations et les documents fournis</li>
                </ul>
                <p style="font-size:13.5px;opacity:0.7;">Le point le plus important : un dossier logique, cohérent, qui donne l'impression d'avoir été préparé sérieusement.</p>
                """,
                """
                <div class="warn"><strong>Important recent change:</strong> for the 2026-27 and 2027-28 academic years, the required financial threshold is <strong>€10,179.85/year</strong> (up from around €6,000 before, a +46.5% increase) — a single annual amount, with no official monthly equivalent.</div>

                <h3>Financial documents</h3>
                <ul>
                  <li>Bank account in the student's name holding the required funds</li>
                  <li>Donation certificate if the funds come from a third party</li>
                  <li>Bank statement</li>
                  <li>Printed VES appointment (Dichiarazione di Valore)</li>
                  <li>4 ID photos</li>
                  <li>CV in Europass format</li>
                  <li>Hotel booking or flight ticket (depending on the course start date)</li>
                  <li>Medical insurance for a full year</li>
                </ul>

                <h3>The sponsor's file — 6 possible categories</h3>
                <table>
                  <thead><tr><th>Sponsor type</th><th>Documents required</th></tr></thead>
                  <tbody>
                    <tr><td>Employee</td><td>Recent work certificate, CNAS affiliation, last 3 payslips, bank statement (3 months)</td></tr>
                    <tr><td>Retiree</td><td>Retirement certificate with updated amount (CNR), monthly/annual income statement, bank statement (3 months)</td></tr>
                    <tr><td>Business owner / self-employed</td><td>Business registry + C20, activity certificate, updated CASNOS, bank statement (3 months)</td></tr>
                    <tr><td>Farmer</td><td>Farmer's card, farming operation certificate, identification form, updated CASNOS/C20, bank statement (3 months)</td></tr>
                    <tr><td>Resident abroad</td><td>Passport or residence permit copy, work certificate + last 3 payslips, 3 bank statements, latest tax return</td></tr>
                    <tr><td>Military</td><td>Military insurance, monthly/annual salary statement, activity or retirement certificate, military ID, CCP statement, civil status, birth certificate in French</td></tr>
                  </tbody>
                </table>

                <h3>What genuinely strengthens a file</h3>
                <ul>
                  <li>A history of already-obtained Schengen visas, especially with no refusals</li>
                  <li>A close family sponsor (father, mother, sibling) rather than a distant relative</li>
                  <li>A solid academic record</li>
                  <li>A bank account with regular activity rather than a single large deposit</li>
                  <li>A clear study project: why this specialty, this university, Italy specifically</li>
                  <li>A complete, consistent sponsor file with nothing missing</li>
                  <li>A demonstrated language level (IELTS/English certificate if applicable)</li>
                  <li>Clear proof of accommodation (booking or hotel)</li>
                  <li>No contradictions between the information and the documents provided</li>
                </ul>
                <p style="font-size:13.5px;opacity:0.7;">The most important point: a logical, consistent file that looks like it was seriously prepared.</p>
                """,
                """
                <div class="warn"><strong>تغيير حديث مهم:</strong> بالنسبة للسنتين الجامعيتين 2026-27 و2027-28، الحد الأدنى المالي المطلوب هو <strong>10179.85 يورو سنويًا</strong> (مقابل نحو 6000 يورو سابقًا، أي ارتفاع بنسبة +46.5%) — مبلغ سنوي واحد، بدون معادل شهري رسمي.</div>

                <h3>الوثائق المالية</h3>
                <ul>
                  <li>حساب بنكي باسم الطالب يحتوي على المبلغ المطلوب</li>
                  <li>شهادة هبة إذا كانت الأموال من طرف ثالث</li>
                  <li>كشف الحساب البنكي</li>
                  <li>موعد VES مطبوع (Dichiarazione di Valore)</li>
                  <li>4 صور شمسية</li>
                  <li>سيرة ذاتية بصيغة Europass</li>
                  <li>حجز فندق أو تذكرة طيران (حسب تاريخ بداية الدراسة)</li>
                  <li>تأمين طبي لمدة سنة كاملة</li>
                </ul>

                <h3>ملف الكفيل — 6 فئات ممكنة</h3>
                <table>
                  <thead><tr><th>نوع الكفيل</th><th>الوثائق المطلوبة</th></tr></thead>
                  <tbody>
                    <tr><td>موظف</td><td>شهادة عمل حديثة، الانتساب لـCNAS، آخر 3 كشوف راتب، كشف حساب بنكي (3 أشهر)</td></tr>
                    <tr><td>متقاعد</td><td>شهادة تقاعد بالمبلغ المحدَّث (CNR)، شهادة الدخل الشهري/السنوي، كشف حساب بنكي (3 أشهر)</td></tr>
                    <tr><td>تاجر / مهنة حرة</td><td>السجل التجاري + C20، شهادة ممارسة النشاط، تحديث CASNOS، كشف حساب بنكي (3 أشهر)</td></tr>
                    <tr><td>فلاح</td><td>بطاقة الفلاح، شهادة الاستغلال الفلاحي، البطاقة التعريفية، تحديث CASNOS/C20، كشف حساب بنكي (3 أشهر)</td></tr>
                    <tr><td>مقيم بالخارج</td><td>نسخة من جواز السفر أو تصريح الإقامة، شهادة عمل + آخر 3 كشوف راتب، 3 كشوف بنكية، آخر تصريح ضريبي</td></tr>
                    <tr><td>عسكري</td><td>تأمين عسكري، كشف الراتب الشهري/السنوي، شهادة نشاط أو تقاعد، البطاقة العسكرية، كشف CCP، الحالة المدنية، شهادة الميلاد بالفرنسية</td></tr>
                  </tbody>
                </table>

                <h3>ما يعزز الملف فعليًا</h3>
                <ul>
                  <li>تاريخ سابق في الحصول على تأشيرات شنغن، خاصة بدون رفض</li>
                  <li>كفيل من العائلة القريبة (الأب، الأم، الأخ/الأخت) بدلًا من قريب بعيد</li>
                  <li>مسار دراسي جيد</li>
                  <li>حساب بنكي نشط بانتظام بدلًا من إيداع كبير لمرة واحدة</li>
                  <li>مشروع دراسي واضح: لماذا هذا التخصص، هذه الجامعة، إيطاليا بالتحديد</li>
                  <li>ملف كفيل كامل ومتسق، بدون نقص</li>
                  <li>مستوى لغة مُثبت (شهادة IELTS/إنجليزية إن وجدت)</li>
                  <li>إثبات سكن واضح (حجز أو فندق)</li>
                  <li>عدم وجود تناقضات بين المعلومات والوثائق المقدمة</li>
                </ul>
                <p style="font-size:13.5px;opacity:0.7;">النقطة الأهم: ملف منطقي ومتسق يعطي انطباعًا بأنه أُعدّ بجدية.</p>
                """),

            section3("budget", "it", 3,
                "Budget réel en Italie",
                "Real Budget in Italy",
                "الميزانية الحقيقية في إيطاليا",
                """
                <h3>Exemple détaillé — Milan (la ville la plus chère d'Italie pour étudier)</h3>
                <table>
                  <tbody>
                    <tr><td>Chambre en colocation</td><td>500€ – 800€/mois</td></tr>
                    <tr><td>Charges</td><td>80€ – 150€/mois</td></tr>
                    <tr><td>Courses</td><td>200€ – 300€/mois</td></tr>
                    <tr><td>Transport public</td><td>22€ – 39€/mois</td></tr>
                    <tr><td>Sorties / loisirs</td><td>100€ – 250€/mois</td></tr>
                    <tr><td>Divers</td><td>50€ – 100€/mois</td></tr>
                    <tr><td><strong>Total (Milan)</strong></td><td><strong>900€ – 1 400€/mois</strong></td></tr>
                  </tbody>
                </table>
                <p style="font-size:13.5px;opacity:0.7;">D'autres villes italiennes (Turin, Bologne, Rome hors centre, villes du Sud) coûtent sensiblement moins cher que Milan — bon réflexe si le budget est serré.</p>
                """,
                """
                <h3>Detailed example — Milan (Italy's most expensive city to study in)</h3>
                <table>
                  <tbody>
                    <tr><td>Shared room</td><td>€500 – €800/month</td></tr>
                    <tr><td>Utilities</td><td>€80 – €150/month</td></tr>
                    <tr><td>Groceries</td><td>€200 – €300/month</td></tr>
                    <tr><td>Public transport</td><td>€22 – €39/month</td></tr>
                    <tr><td>Going out / leisure</td><td>€100 – €250/month</td></tr>
                    <tr><td>Miscellaneous</td><td>€50 – €100/month</td></tr>
                    <tr><td><strong>Total (Milan)</strong></td><td><strong>€900 – €1,400/month</strong></td></tr>
                  </tbody>
                </table>
                <p style="font-size:13.5px;opacity:0.7;">Other Italian cities (Turin, Bologna, Rome outside the center, southern cities) cost noticeably less than Milan — worth considering if your budget is tight.</p>
                """,
                """
                <h3>مثال تفصيلي — ميلانو (أغلى مدينة للدراسة في إيطاليا)</h3>
                <table>
                  <tbody>
                    <tr><td>غرفة في سكن مشترك</td><td>500 – 800 يورو/شهر</td></tr>
                    <tr><td>الأعباء</td><td>80 – 150 يورو/شهر</td></tr>
                    <tr><td>التسوق</td><td>200 – 300 يورو/شهر</td></tr>
                    <tr><td>النقل العمومي</td><td>22 – 39 يورو/شهر</td></tr>
                    <tr><td>الخروجات/الترفيه</td><td>100 – 250 يورو/شهر</td></tr>
                    <tr><td>متفرقات</td><td>50 – 100 يورو/شهر</td></tr>
                    <tr><td><strong>المجموع (ميلانو)</strong></td><td><strong>900 – 1400 يورو/شهر</strong></td></tr>
                  </tbody>
                </table>
                <p style="font-size:13.5px;opacity:0.7;">مدن إيطالية أخرى (تورينو، بولونيا، روما خارج المركز، مدن الجنوب) أرخص بشكل ملحوظ من ميلانو — خيار جيد إذا كانت الميزانية محدودة.</p>
                """),

            section3("logement", "it", 4,
                "Logement en Italie",
                "Housing in Italy",
                "السكن في إيطاليا",
                """
                <p>Les résidences universitaires sont rares en Italie et réservées en priorité aux étudiants italiens
                boursiers — la grande majorité des étudiants étrangers optent donc pour la colocation.</p>
                <ul>
                  <li>Commencez la recherche tôt, surtout à Milan où la tension est la plus forte</li>
                  <li>Le vélo est un mode de transport courant et économique (ex : BikeMi à Milan, ~36€/an)</li>
                </ul>
                <div class="warn">Vous ne pourrez pas signer de contrat de location sans votre Codice Fiscale (voir section Arrivée) — c'est un vrai blocage si vous ne l'avez pas anticipé.</div>
                """,
                """
                <p>University residences are rare in Italy and mainly reserved for scholarship-holding Italian
                students — the vast majority of international students therefore opt for a shared flat.</p>
                <ul>
                  <li>Start searching early, especially in Milan where pressure is highest</li>
                  <li>Cycling is a common, cheap way to get around (e.g. BikeMi in Milan, ~€36/year)</li>
                </ul>
                <div class="warn">You won't be able to sign a rental contract without your Codice Fiscale (see the Arrival section) — a real blocker if you haven't planned ahead for it.</div>
                """,
                """
                <p>الإقامات الجامعية نادرة في إيطاليا ومخصصة بالأولوية للطلبة الإيطاليين المنحيين — لذلك
                تختار الغالبية العظمى من الطلبة الأجانب السكن المشترك.</p>
                <ul>
                  <li>ابدأ البحث مبكرًا، خاصة في ميلانو حيث الضغط هو الأكبر</li>
                  <li>الدراجة وسيلة نقل شائعة واقتصادية (مثال: BikeMi في ميلانو، ~36 يورو/سنة)</li>
                </ul>
                <div class="warn">لن تتمكن من توقيع عقد إيجار بدون Codice Fiscale الخاص بك (راجع قسم الوصول) — هذا عائق حقيقي إذا لم تخطط له مسبقًا.</div>
                """),

            section3("arrivee", "it", 5,
                "Arrivée : Codice Fiscale, banque & permesso di soggiorno",
                "Arrival: Codice Fiscale, banking & permesso di soggiorno",
                "الوصول: الرمز الضريبي والبنك وتصريح الإقامة",
                """
                <h3>Le Codice Fiscale — votre priorité absolue</h3>
                <p>C'est votre identifiant fiscal italien, indispensable pour signer un bail, ouvrir un compte
                bancaire, ou s'inscrire au service de santé national. <strong>Demandez-le avant votre départ</strong>
                auprès du consulat italien de votre pays — c'est plus rapide qu'une fois sur place. Si vous ne l'avez
                pas fait, vous pouvez le demander à votre arrivée auprès de l'Agenzia delle Entrate (comptez environ
                10 jours d'activation).</p>
                <div class="warn">Ne tardez pas : si vous trouvez le logement idéal mais n'avez pas encore votre Codice Fiscale actif, le propriétaire peut légalement le proposer à quelqu'un d'autre.</div>

                <h3>Ouvrir un compte bancaire</h3>
                <p>Codice Fiscale obligatoire. La plupart des banques traditionnelles n'ouvrent pas de compte sans
                pièce d'identité italienne complète — un compte postal (Poste Italiane) est souvent une solution
                plus simple pour un nouvel arrivant, temporaire ou permanente.</p>

                <h3>Le permesso di soggiorno per motivi di studio</h3>
                <p>À demander dans les <strong>8 jours ouvrables</strong> suivant l'arrivée :</p>
                <ol>
                  <li>Récupérer le kit (formulaire) gratuitement dans un bureau de poste "Sportello Amico"</li>
                  <li>Le remplir et le renvoyer sur place, en payant le contributo (~100€+ au total)</li>
                  <li>Se présenter à la Questura pour la prise d'empreintes digitales</li>
                </ol>
                <p style="font-size:13.5px;opacity:0.7;">Le permis est valable 6 mois à 1 an selon les cas, renouvelable.</p>
                """,
                """
                <h3>The Codice Fiscale — your absolute priority</h3>
                <p>This is your Italian tax identifier, essential for signing a lease, opening a bank account, or
                registering with the national health service. <strong>Apply for it before you leave</strong> at
                the Italian consulate in your country — it's faster than doing it once there. If you haven't, you
                can apply on arrival at the Agenzia delle Entrate (allow about 10 days for activation).</p>
                <div class="warn">Don't delay: if you find the ideal place but don't yet have an active Codice Fiscale, the landlord can legally offer it to someone else.</div>

                <h3>Opening a bank account</h3>
                <p>Codice Fiscale is mandatory. Most traditional banks won't open an account without full Italian
                ID — a post office account (Poste Italiane) is often an easier solution for a newcomer, whether
                temporary or permanent.</p>

                <h3>The permesso di soggiorno per motivi di studio</h3>
                <p>To be applied for within <strong>8 working days</strong> of arrival:</p>
                <ol>
                  <li>Pick up the kit (form) for free at a post office "Sportello Amico"</li>
                  <li>Fill it in and submit it there, paying the contributo (~€100+ total)</li>
                  <li>Attend the Questura for fingerprinting</li>
                </ol>
                <p style="font-size:13.5px;opacity:0.7;">The permit is valid for 6 months to 1 year depending on the case, and renewable.</p>
                """,
                """
                <h3>الرمز الضريبي (Codice Fiscale) — أولويتك المطلقة</h3>
                <p>هو معرّفك الضريبي الإيطالي، ضروري لتوقيع عقد الإيجار، أو فتح حساب بنكي، أو التسجيل في
                الخدمة الصحية الوطنية. <strong>اطلبه قبل مغادرتك</strong> لدى القنصلية الإيطالية في بلدك — أسرع
                من طلبه بعد الوصول. إذا لم تفعل ذلك، يمكنك طلبه عند وصولك لدى Agenzia delle Entrate (احسب
                حوالي 10 أيام للتفعيل).</p>
                <div class="warn">لا تتأخر: إذا وجدت السكن المثالي لكن لم تحصل بعد على Codice Fiscale نشط، يمكن للمالك قانونيًا أن يعرضه على شخص آخر.</div>

                <h3>فتح حساب بنكي</h3>
                <p>الرمز الضريبي إلزامي. معظم البنوك التقليدية لا تفتح حسابًا بدون هوية إيطالية كاملة —
                حساب بريدي (Poste Italiane) غالبًا ما يكون حلاً أسهل للقادم الجديد، سواء بشكل مؤقت أو دائم.</p>

                <h3>تصريح الإقامة لأغراض الدراسة (permesso di soggiorno)</h3>
                <p>يجب طلبه خلال <strong>8 أيام عمل</strong> من تاريخ الوصول:</p>
                <ol>
                  <li>استلام الاستمارة مجانًا من مكتب بريد "Sportello Amico"</li>
                  <li>تعبئتها وتسليمها في المكان، مع دفع الرسوم (contributo، حوالي 100 يورو أو أكثر إجمالًا)</li>
                  <li>الحضور إلى Questura لأخذ البصمات</li>
                </ol>
                <p style="font-size:13.5px;opacity:0.7;">التصريح صالح لمدة 6 أشهر إلى سنة حسب الحالة، وقابل للتجديد.</p>
                """),

            section3("travail", "it", 6,
                "Travail étudiant",
                "Student Work",
                "العمل الطلابي",
                """
                <p>Le permesso di soggiorno per motivi di studio autorise à travailler jusqu'à
                <strong>20 heures par semaine</strong>, avec un plafond de <strong>1 040 heures par an</strong>
                (DPR 394/1999, art. 14). Ce plafond annuel ne peut pas être concentré sur les mois d'été.</p>
                <div class="warn">Les règles de travail évoluent régulièrement — confirmez toujours le détail actuel auprès du bureau international de votre université avant de vous engager sur un horaire.</div>
                """,
                """
                <p>The permesso di soggiorno per motivi di studio allows work up to <strong>20 hours per
                week</strong>, capped at <strong>1,040 hours per year</strong> (DPR 394/1999, art. 14). This
                annual cap can't be front-loaded into the summer months alone.</p>
                <div class="warn">Work rules change regularly — always confirm the current details with your university's international office before committing to a schedule.</div>
                """,
                """
                <p>يسمح تصريح الإقامة لأغراض الدراسة بالعمل حتى <strong>20 ساعة أسبوعيًا</strong>، بحد أقصى
                <strong>1040 ساعة سنويًا</strong> (DPR 394/1999، المادة 14). لا يمكن تجميع هذا الحد السنوي
                في أشهر الصيف فقط.</p>
                <div class="warn">تتغير قواعد العمل بانتظام — تأكد دائمًا من التفاصيل الحالية لدى المكتب الدولي بجامعتك قبل الالتزام بجدول عمل.</div>
                """)
        );

        attachNotes(italy, "admission",
            "Le prestataire chargé du dépôt des dossiers visa pour l'Italie depuis l'Algérie n'a pas pu être confirmé avec certitude dans nos recherches — vérifiez directement auprès du Consulat d'Italie en Algérie ou sur le portail Universitaly.",
            "Le dépôt du dossier visa se fait via VFS Global (centres à Rabat, Casablanca, Marrakech, Beni Mellal). Rabat traite les dossiers d'inscription universitaire pour tout le Maroc depuis juin 2024.",
            "Le dépôt du dossier visa se fait via Almaviva Visa Services (AVS), et non VFS Global — un prestataire différent de celui utilisé au Maroc.");

        attachNotes(italy, "visa",
            "Le seuil de 10 179,85€/an s'applique de la même façon aux candidats algériens, quelle que soit la nationalité.",
            "Même seuil financier que pour les autres nationalités — le montant est fixé par circulaire ministérielle italienne, indépendamment du pays d'origine.",
            "Même seuil financier, identique pour toutes les nationalités.");

        attachNotes(italy, "travail",
            "Contrairement à la France, l'Italie n'applique pas de régime spécial pour les ressortissants algériens en matière de droit au travail étudiant — les 20h/semaine s'appliquent de la même façon à toutes les nationalités.",
            "Ce plafond de 20h/semaine s'applique de la même façon à toutes les nationalités, y compris marocaine.",
            "Ce plafond de 20h/semaine s'applique de la même façon à toutes les nationalités, y compris tunisienne.");

        sections.saveAll(italy);
    }

    // Attaches nationality-specific notes to one section in an already-built list,
    // matched by slug. Called before saving. Left as a no-op if the slug isn't found.
    private void attachNotes(List<Section> list, String slug, String noteDz, String noteMa, String noteTn) {
        for (Section s : list) {
            if (s.getSlug().equals(slug)) {
                s.setNoteDz(noteDz);
                s.setNoteMa(noteMa);
                s.setNoteTn(noteTn);
                return;
            }
        }
    }

    // Three-language helper (FR/EN/AR) for France & Italy - Spanish is skipped here
    // since it isn't a selectable UI language, so translating into it would be dead content.
    private Section section3(String slug, String country, int order,
                              String titleFr, String titleEn, String titleAr,
                              String htmlFr, String htmlEn, String htmlAr) {
        Section s = new Section();
        s.setSlug(slug);
        s.setCountry(country);
        s.setOrderIndex(order);
        s.setTitleFr(titleFr);
        s.setTitleEn(titleEn);
        s.setTitleAr(titleAr);
        s.setContentHtml(htmlFr);
        s.setContentHtmlEn(htmlEn);
        s.setContentHtmlAr(htmlAr);
        s.setPublished(true);
        return s;
    }

    private void seedChecklist() {
        int order = 0;
        order = saveGroup(
            "Dossier académique & admission", "Academic file & admission", "الملف الأكاديمي والقبول", "Expediente académico y admisión",
            new String[][]{
                {"Passeport valide (plus de 12 mois)", "Valid passport (over 12 months)", "جواز سفر ساري المفعول (أكثر من 12 شهرًا)", "Pasaporte válido (más de 12 meses)"},
                {"Bac / relevés de notes légalisés et traduits", "Bac / transcripts legalized and translated", "شهادة البكالوريا / كشوف النقاط مصدّقة ومترجمة", "Bac / expedientes legalizados y traducidos"},
                {"Diplôme universitaire / relevés légalisés (si master)", "University degree / transcripts legalized (if Master's)", "الشهادة الجامعية / الكشوف مصدّقة (للماستر)", "Título universitario / expedientes legalizados (si Máster)"},
                {"Certificat de langue B2 (DELE/SIELE/IELTS)", "B2 language certificate (DELE/SIELE/IELTS)", "شهادة لغة B2 (DELE/SIELE/IELTS)", "Certificado de idioma B2 (DELE/SIELE/IELTS)"},
                {"Dossier UNEDasiss créé et validé", "UNEDasiss file created and validated", "ملف UNEDasiss منشأ ومصادق عليه", "Expediente UNEDasiss creado y validado"},
                {"Lettre d'admission officielle de l'université", "Official university admission letter", "رسالة القبول الرسمية من الجامعة", "Carta de admisión oficial de la universidad"},
            }, order);
        order = saveGroup(
            "Dossier visa & logement", "Visa & housing file", "ملف التأشيرة والسكن", "Expediente de visado y vivienda",
            new String[][]{
                {"Formulaire de demande de visa rempli", "Visa application form completed", "استمارة طلب التأشيرة معبأة", "Formulario de solicitud de visado cumplimentado"},
                {"Preuve financière réunie (100% IPREM, ~7 200€ min.)", "Financial proof gathered (100% IPREM, ~€7,200 min.)", "الإثبات المالي جاهز (100% من IPREM، ~7200 يورو كحد أدنى)", "Prueba financiera reunida (100% IPREM, ~7.200€ mín.)"},
                {"Assurance santé complète souscrite (1 an, sans franchise)", "Full health insurance taken out (1 year, no deductible)", "التأمين الصحي الشامل مكتتب (سنة واحدة، بدون فرنشيز)", "Seguro de salud completo contratado (1 año, sin franquicia)"},
                {"Extrait de casier judiciaire légalisé", "Legalized criminal record extract", "صحيفة السوابق العدلية مصدّقة", "Certificado de antecedentes penales legalizado"},
                {"Certificat médical officiel signé et traduit", "Official medical certificate signed and translated", "الشهادة الطبية الرسمية موقّعة ومترجمة", "Certificado médico oficial firmado y traducido"},
                {"Logement réservé ou attestation d'hébergement obtenue", "Housing booked or accommodation certificate obtained", "السكن محجوز أو شهادة الإيواء متحصل عليها", "Vivienda reservada o certificado de alojamiento obtenido"},
                {"Rendez-vous BLS International pris (Alger ou Oran)", "BLS International appointment booked (Algiers or Oran)", "موعد BLS International محجوز (الجزائر أو وهران)", "Cita en BLS International reservada (Argel u Orán)"},
            }, order);
        saveGroup(
            "Premières semaines en Espagne", "First weeks in Spain", "الأسابيع الأولى في إسبانيا", "Primeras semanas en España",
            new String[][]{
                {"Empadronamiento fait à la mairie", "Empadronamiento done at the town hall", "إتمام Empadronamiento في البلدية", "Empadronamiento hecho en el ayuntamiento"},
                {"Matrícula finalisée à l'université", "Matrícula finalized at the university", "إتمام Matrícula في الجامعة", "Matrícula finalizada en la universidad"},
                {"Cita previa réservée pour la TIE", "Cita previa booked for the TIE", "حجز موعد Cita previa لبطاقة TIE", "Cita previa reservada para la TIE"},
                {"Présentation aux empreintes pour la TIE", "Attended fingerprinting for the TIE", "الحضور لأخذ البصمات لبطاقة TIE", "Asistencia a la toma de huellas para la TIE"},
                {"Compte bancaire espagnol ouvert", "Spanish bank account opened", "فتح الحساب البنكي الإسباني", "Cuenta bancaria española abierta"},
                {"Carte SIM locale obtenue", "Local SIM card obtained", "الحصول على شريحة هاتف محلية", "Tarjeta SIM local obtenida"},
            }, order);
    }

    private int saveGroup(String groupFr, String groupEn, String groupAr, String groupEs, String[][] rows, int startOrder) {
        int order = startOrder;
        for (String[] row : rows) {
            ChecklistItem item = new ChecklistItem();
            item.setGroupName(groupFr);
            item.setGroupNameEn(groupEn);
            item.setGroupNameAr(groupAr);
            item.setGroupNameEs(groupEs);
            item.setText(row[0]);
            item.setTextEn(row[1]);
            item.setTextAr(row[2]);
            item.setTextEs(row[3]);
            item.setOrderIndex(order++);
            checklistItems.save(item);
        }
        return order;
    }
}
