package com.masar.seed;

import com.masar.model.University;
import com.masar.repository.UniversityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds a broader, real, verifiable list of public (and a few well-known
 * private) universities per destination - originally 4 per country, now
 * ~14 (Spain), 12 (France) and 12 (Italy), so the Universities screen can
 * show a genuinely browsable list rather than just 4 examples. Runs
 * independently from DataSeeder so a University-only content fix never
 * risks touching the much larger Section seed data.
 *
 * Every institution here is real and well documented (founding year,
 * public/private status, city, notable fields, official website all
 * sourced from the university's own site or well-established public
 * information as of Sept 2026). Tuition for public universities is given
 * as an approximate national/regional range with a note on its basis, not
 * a unique per-institution figure - the real rate depends on the specific
 * program and the student's nationality/agreements. Private institutions
 * (IE University, ESADE, HEC Paris, EDHEC, Bocconi, LUISS) intentionally
 * have NO invented tuition figure: their fees are set independently and
 * vary widely by program, so a specific number here would likely be wrong
 * - the note points the student to the official site instead. Deliberately
 * no star ratings or review counts anywhere: those would have to be
 * invented for real institutions, and a fabricated number could steer a
 * real student's decision - so the app omits them rather than making them up.
 */
@Component
@Order(20)
public class UniversitySeeder implements CommandLineRunner {

    private final UniversityRepository universities;

    public UniversitySeeder(UniversityRepository universities) {
        this.universities = universities;
    }

    @Override
    public void run(String... args) {
        if (universities.count() == 0) {
            seedSpain();
            seedFrance();
            seedItaly();
        }
    }

    private University uni(String slug, String country, String name, String city, Integer founded, boolean isPublic, String website,
                            String descFr, String descEn, String descAr,
                            String fieldsFr, String fieldsEn, String fieldsAr,
                            Integer tuitionMin, Integer tuitionMax,
                            String tuitionNoteFr, String tuitionNoteEn, String tuitionNoteAr,
                            String primaryField, String mainLanguage, String degreeLevels,
                            int order) {
        University u = new University();
        u.setSlug(slug);
        u.setCountry(country);
        u.setName(name);
        u.setCity(city);
        u.setFoundedYear(founded);
        u.setPublicUniversity(isPublic);
        u.setWebsiteUrl(website);
        u.setDescriptionFr(descFr);
        u.setDescriptionEn(descEn);
        u.setDescriptionAr(descAr);
        u.setFieldsFr(fieldsFr);
        u.setFieldsEn(fieldsEn);
        u.setFieldsAr(fieldsAr);
        u.setTuitionMinEur(tuitionMin);
        u.setTuitionMaxEur(tuitionMax);
        u.setTuitionNoteFr(tuitionNoteFr);
        u.setTuitionNoteEn(tuitionNoteEn);
        u.setTuitionNoteAr(tuitionNoteAr);
        u.setPrimaryField(primaryField);
        u.setMainLanguage(mainLanguage);
        u.setEnglishPrograms(true);
        u.setDegreeLevels(degreeLevels);
        u.setOrderIndex(order);
        u.setPublished(true);
        return u;
    }

    // Attaches the researched, source-verified Gallery photo fields to a
    // University built by uni(...). campusUrl/campusLicense/campusCredit are
    // null when no genuine, verifiably-matching photo of that institution's
    // own building could be found (see the project's gallery-photos research
    // doc) - the frontend falls back to the city photo rather than showing a
    // fabricated or mismatched "campus" photo in that case.
    private University withPhoto(University u, String campusUrl, String campusLicense, String campusCredit,
                                  String cityUrl, String cityCredit) {
        u.setCampusPhotoUrl(campusUrl);
        u.setCampusPhotoLicense(campusLicense);
        u.setCampusPhotoCredit(campusCredit);
        u.setCityPhotoUrl(cityUrl);
        u.setCityPhotoCredit(cityCredit);
        return u;
    }

    private static final String DEGREES = "Bachelor's,Master's,PhD";

    private void seedSpain() {
        String pubNoteFr = "Tarif officiel (UE) approximatif, ~60 crédits ECTS/an ; certaines universités appliquent un tarif non-UE plus élevé (2e/3e matrícula) hors accord bilatéral. Vérifiez le tarif exact avec l'université.";
        String pubNoteEn = "Approximate official (EU-rate) tuition for ~60 ECTS credits/year; some universities charge a higher non-EU rate (2nd/3rd matrícula) outside bilateral agreements. Confirm the exact rate with the university.";
        String pubNoteAr = "رسوم رسمية تقريبية (بسعر الاتحاد الأوروبي) مقابل حوالي 60 وحدة ECTS سنويًا؛ قد تطبّق بعض الجامعات رسومًا أعلى لغير الأوروبيين خارج الاتفاقيات الثنائية. تحقق من الرسوم الدقيقة مع الجامعة.";
        String privNoteFr = "Université privée : les frais sont fixés indépendamment et varient largement selon le programme (généralement bien plus élevés que le public). Consultez le site officiel pour les tarifs à jour.";
        String privNoteEn = "Private university: fees are set independently and vary widely by program (generally much higher than public universities). Check the official site for current figures.";
        String privNoteAr = "جامعة خاصة: تُحدَّد الرسوم بشكل مستقل وتختلف كثيرًا حسب البرنامج (عادةً أعلى بكثير من الجامعات العمومية). يُرجى مراجعة الموقع الرسمي للاطلاع على الأرقام الحالية.";

        universities.saveAll(List.of(
            withPhoto(uni("ugr", "es", "Universidad de Granada", "Granada", 1531, true, "https://www.ugr.es/en",
                "Une des plus grandes et plus anciennes universités publiques d'Espagne, dans la ville historique de Grenade, en Andalousie. Elle accueille une très large population Erasmus et internationale.",
                "One of Spain's largest and oldest public universities, in the historic Andalusian city of Granada. It hosts a very large Erasmus and international student population.",
                "واحدة من أكبر وأقدم الجامعات العمومية في إسبانيا، في مدينة غرناطة التاريخية بالأندلس. تستقبل عددًا كبيرًا جدًا من طلبة إيراسموس والطلبة الدوليين.",
                "Lettres, Sciences, Santé, Sciences sociales, Ingénierie", "Humanities, Sciences, Health Sciences, Social Sciences, Engineering", "الآداب، العلوم، الصحة، العلوم الاجتماعية، الهندسة",
                800, 1200, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Spanish", DEGREES, 1), null, null, null, "https://images.pexels.com/photos/19916757/pexels-photo-19916757.jpeg", "Granada"),
            withPhoto(uni("ucm", "es", "Universidad Complutense de Madrid", "Madrid", 1499, true, "https://www.ucm.es/english",
                "La plus grande université d'Espagne par le nombre d'étudiants, avec plus de 20 facultés réparties dans Madrid. Ses racines remontent à 1499 à Alcalá de Henares avant son transfert à Madrid.",
                "Spain's largest university by enrollment, with more than 20 faculties across Madrid. Its roots trace back to 1499 in Alcalá de Henares before it moved to Madrid.",
                "أكبر جامعة في إسبانيا من حيث عدد الطلبة، وتضم أكثر من 20 كلية موزعة في مدريد. تعود جذورها إلى سنة 1499 في ألكالا دي إيناريس قبل انتقالها إلى مدريد.",
                "Droit, Médecine, Journalisme & Communication, Sciences, Économie", "Law, Medicine, Journalism & Communication, Sciences, Economics", "القانون، الطب، الصحافة والاتصال، العلوم، الاقتصاد",
                800, 1400, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Spanish", DEGREES, 2), null, null, null, "https://images.pexels.com/photos/21855187/pexels-photo-21855187.jpeg", "Madrid"),
            withPhoto(uni("ub", "es", "Universitat de Barcelona", "Barcelona", 1450, true, "https://web.ub.edu/en/",
                "Fondée en 1450, elle est régulièrement classée première université espagnole dans les classements internationaux, avec une recherche forte en sciences, médecine et économie.",
                "Founded in 1450, it is consistently ranked as Spain's top university in most international rankings, with strong research in sciences, medicine and economics.",
                "تأسست سنة 1450، وهي مصنفة باستمرار كأفضل جامعة إسبانية في معظم التصنيفات الدولية، وتتميز ببحث قوي في العلوم والطب والاقتصاد.",
                "Médecine & Santé, Sciences, Économie & Gestion, Droit, Lettres", "Medicine & Health Sciences, Sciences, Economics & Business, Law, Humanities", "الطب والصحة، العلوم، الاقتصاد والأعمال، القانون، الآداب",
                800, 1300, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Spanish", DEGREES, 3), null, null, null, "https://images.pexels.com/photos/16984552/pexels-photo-16984552.jpeg", "Barcelona"),
            withPhoto(uni("uab", "es", "Universitat Autònoma de Barcelona", "Barcelone (Bellaterra)", 1968, true, "https://www.uab.cat/en/",
                "Université publique de recherche installée sur un campus unique à Bellaterra, juste à côté de Barcelone, réputée en économie, sciences de la vie, communication et médecine vétérinaire.",
                "A research-intensive public university on a single campus in Bellaterra, just outside Barcelona, known for strong programs in economics, life sciences, communication and veterinary science.",
                "جامعة عمومية بحثية تقع في حرم جامعي واحد في بيلاتيرا، بالقرب من برشلونة، معروفة ببرامجها في الاقتصاد وعلوم الحياة والاتصال والطب البيطري.",
                "Économie & Gestion, Sciences de la vie, Communication, Vétérinaire, Ingénierie", "Economics & Business, Life Sciences, Communication, Veterinary Science, Engineering", "الاقتصاد والأعمال، علوم الحياة، الاتصال، الطب البيطري، الهندسة",
                800, 1300, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Spanish", DEGREES, 4), null, null, null, "https://images.pexels.com/photos/16984552/pexels-photo-16984552.jpeg", "Barcelona"),
            withPhoto(uni("ujaen", "es", "Universidad de Jaén", "Jaén", 1993, true, "https://www.ujaen.es/en",
                "Université publique moderne d'Andalousie, réputée pour sa recherche sur l'huile d'olive et l'agroalimentaire, avec une offre internationale en pleine croissance.",
                "A modern public university in Andalusia, known for its olive-oil and agri-food research, with a growing international programs offering.",
                "جامعة عمومية حديثة في الأندلس، معروفة بأبحاثها في زيت الزيتون والصناعات الغذائية، مع عرض دولي متنامٍ.",
                "Sciences, Ingénierie, Sciences sociales, Santé", "Sciences, Engineering, Social Sciences, Health Sciences", "العلوم، الهندسة، العلوم الاجتماعية، الصحة",
                800, 1200, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Spanish", DEGREES, 5), null, null, null, "https://images.pexels.com/photos/35340105/pexels-photo-35340105.jpeg", "Jaen"),
            withPhoto(uni("uma", "es", "Universidad de Málaga", "Málaga", 1972, true, "https://www.uma.es/en/",
                "Une des plus grandes universités publiques d'Andalousie, dans la ville côtière de Málaga, réputée en tourisme, ingénierie et arts.",
                "One of Andalusia's largest public universities, in the coastal city of Málaga, known for tourism, engineering and the arts.",
                "واحدة من أكبر الجامعات العمومية في الأندلس، في مدينة ملقة الساحلية، معروفة بالسياحة والهندسة والفنون.",
                "Tourisme, Ingénierie, Arts, Sciences, Économie", "Tourism, Engineering, Arts, Sciences, Economics", "السياحة، الهندسة، الفنون، العلوم، الاقتصاد",
                800, 1200, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Spanish", DEGREES, 6), null, null, null, "https://images.pexels.com/photos/33118519/pexels-photo-33118519.jpeg", "Malaga"),
            withPhoto(uni("us", "es", "Universidad de Sevilla", "Sevilla", 1505, true, "https://www.us.es/en",
                "Une des plus anciennes et plus grandes universités d'Espagne, dans la ville historique de Séville, avec une offre couvrant presque tous les domaines.",
                "One of Spain's oldest and largest universities, in the historic city of Seville, with offerings spanning nearly every field.",
                "واحدة من أقدم وأكبر الجامعات في إسبانيا، في مدينة إشبيلية التاريخية، وتغطي عروضها تقريبًا كل المجالات.",
                "Ingénierie, Médecine, Droit, Lettres, Sciences", "Engineering, Medicine, Law, Humanities, Sciences", "الهندسة، الطب، القانون، الآداب، العلوم",
                800, 1300, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Spanish", DEGREES, 7), null, null, null, "https://images.pexels.com/photos/27379390/pexels-photo-27379390.jpeg", "Sevilla"),
            withPhoto(uni("uv", "es", "Universitat de València", "Valencia", 1499, true, "https://www.uv.es/en",
                "Une des plus anciennes universités d'Espagne, sur la côte méditerranéenne, avec des programmes solides en sciences, médecine et droit.",
                "One of the oldest universities in Spain, on the Mediterranean coast, with strong programs in sciences, medicine and law.",
                "واحدة من أقدم الجامعات في إسبانيا، على الساحل المتوسطي، وتتميز ببرامج قوية في العلوم والطب والقانون.",
                "Sciences, Médecine, Droit, Économie, Lettres", "Sciences, Medicine, Law, Economics, Humanities", "العلوم، الطب، القانون، الاقتصاد، الآداب",
                800, 1300, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Spanish", DEGREES, 8), null, null, null, "https://images.pexels.com/photos/27850060/pexels-photo-27850060.jpeg", "Valencia"),
            withPhoto(uni("upv", "es", "Universitat Politècnica de València", "Valencia", 1968, true, "https://www.upv.es/index-en.html",
                "Une université technique espagnole de premier plan, spécialisée en ingénierie, architecture et design, étroitement liée à l'industrie régionale.",
                "A leading Spanish technical university, focused on engineering, architecture and design, closely linked with regional industry.",
                "من الجامعات التقنية الرائدة في إسبانيا، متخصصة في الهندسة والعمارة والتصميم، ومرتبطة ارتباطًا وثيقًا بالصناعة الجهوية.",
                "Ingénierie, Architecture, Design", "Engineering, Architecture, Design", "الهندسة، العمارة، التصميم",
                800, 1300, pubNoteFr, pubNoteEn, pubNoteAr, "Engineering", "Spanish", DEGREES, 9), null, null, null, "https://images.pexels.com/photos/27850060/pexels-photo-27850060.jpeg", "Valencia"),
            withPhoto(uni("uam", "es", "Universidad Autónoma de Madrid", "Madrid", 1968, true, "https://www.uam.es/uam/en/",
                "Université publique de recherche sur un campus unique à Madrid, régulièrement classée parmi les meilleures universités espagnoles.",
                "A research-intensive public university on a single campus in Madrid, consistently ranked among Spain's top universities.",
                "جامعة عمومية بحثية في حرم جامعي واحد بمدريد، تُصنَّف باستمرار من بين أفضل الجامعات الإسبانية.",
                "Sciences, Économie, Droit, Sciences sociales, Médecine", "Sciences, Economics, Law, Social Sciences, Medicine", "العلوم، الاقتصاد، القانون، العلوم الاجتماعية، الطب",
                800, 1300, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Spanish", DEGREES, 10), null, null, null, "https://images.pexels.com/photos/21855187/pexels-photo-21855187.jpeg", "Madrid"),
            withPhoto(uni("uc3m", "es", "Universidad Carlos III de Madrid", "Madrid (Getafe)", 1989, true, "https://www.uc3m.es/home",
                "Université publique plus jeune et orientée recherche, réputée en droit, économie et ingénierie, avec de nombreux programmes enseignés en anglais.",
                "A younger, research-focused public university known for law, economics and engineering, with many English-taught programs.",
                "جامعة عمومية أحدث نسبيًا وموجهة نحو البحث، معروفة بالقانون والاقتصاد والهندسة، وتضم برامج عديدة تُدرَّس بالإنجليزية.",
                "Droit, Économie, Ingénierie, Sciences sociales", "Law, Economics, Engineering, Social Sciences", "القانون، الاقتصاد، الهندسة، العلوم الاجتماعية",
                800, 1400, pubNoteFr, pubNoteEn, pubNoteAr, "Social Sciences & Law", "Spanish", DEGREES, 11), null, null, null, "https://images.pexels.com/photos/21855187/pexels-photo-21855187.jpeg", "Madrid"),
            withPhoto(uni("upm", "es", "Universidad Politécnica de Madrid", "Madrid", 1971, true, "https://www.upm.es/internacional",
                "La plus grande université technique d'Espagne, spécialisée en ingénierie et architecture, répartie sur plusieurs campus madrilènes.",
                "Spain's largest technical university, specializing in engineering and architecture across multiple Madrid campuses.",
                "أكبر جامعة تقنية في إسبانيا، متخصصة في الهندسة والعمارة، وتضم عدة حرم جامعية في مدريد.",
                "Ingénierie, Architecture", "Engineering, Architecture", "الهندسة، العمارة",
                800, 1400, pubNoteFr, pubNoteEn, pubNoteAr, "Engineering", "Spanish", DEGREES, 12), null, null, null, "https://images.pexels.com/photos/21855187/pexels-photo-21855187.jpeg", "Madrid"),
            withPhoto(uni("ie", "es", "IE University", "Madrid / Segovia", 1973, false, "https://www.ie.edu/university/",
                "Université privée internationalement reconnue pour son école de commerce, avec une forte proportion d'étudiants internationaux et de nombreux programmes en anglais.",
                "A private university known internationally for its business school, with a large share of international students and many English-taught programs.",
                "جامعة خاصة معروفة عالميًا بكليتها لإدارة الأعمال، وتضم نسبة كبيرة من الطلبة الدوليين وبرامج عديدة باللغة الإنجليزية.",
                "Commerce & Gestion, Droit, Architecture, Sciences sociales", "Business & Management, Law, Architecture, Social Sciences", "التجارة والإدارة، القانون، العمارة، العلوم الاجتماعية",
                null, null, privNoteFr, privNoteEn, privNoteAr, "Business", "English", DEGREES, 13), null, null, null, "https://images.pexels.com/photos/21855187/pexels-photo-21855187.jpeg", "Madrid"),
            withPhoto(uni("esade", "es", "ESADE", "Barcelona", 1958, false, "https://www.esade.edu/en",
                "École de commerce et de droit privée fondée par les Jésuites à Barcelone, très bien classée à l'international pour son MBA et ses programmes de gestion.",
                "A private Jesuit-founded business and law school in Barcelona, highly ranked internationally for its MBA and management programs.",
                "كلية خاصة للأعمال والقانون أسسها اليسوعيون في برشلونة، وتحتل مراتب دولية مرموقة في برنامج الماجستير في إدارة الأعمال (MBA) وبرامج الإدارة.",
                "Commerce & Gestion, Droit", "Business & Management, Law", "التجارة والإدارة، القانون",
                null, null, privNoteFr, privNoteEn, privNoteAr, "Business", "English", DEGREES, 14), null, null, null, "https://images.pexels.com/photos/16984552/pexels-photo-16984552.jpeg", "Barcelona")
        ));
    }

    private void seedFrance() {
        String pubNoteFr = "Tarifs différenciés nationaux 2026-2027 pour les étudiants non-UE (Campus France). Un nombre croissant d'universités exonèrent tout ou partie des étudiants internationaux de ce tarif différencié : à vérifier au cas par cas.";
        String pubNoteEn = "2026-2027 national differentiated tuition for non-EU students (Campus France rate). A growing number of universities exempt some or all international students from this differentiated rate - confirm case by case.";
        String pubNoteAr = "الرسوم الوطنية التفاضلية لسنة 2026-2027 للطلبة من خارج الاتحاد الأوروبي (حسب Campus France). عدد متزايد من الجامعات يعفي بعض أو كل الطلبة الدوليين من هذه الرسوم التفاضلية - يجب التحقق حالة بحالة.";
        String privNoteFr = "École privée / grande école : les frais sont fixés indépendamment et généralement bien plus élevés que dans le public. Consultez le site officiel pour les tarifs à jour.";
        String privNoteEn = "Private / grande école: fees are set independently and generally much higher than public universities. Check the official site for current figures.";
        String privNoteAr = "مدرسة خاصة / grande école: تُحدَّد الرسوم بشكل مستقل وعادةً أعلى بكثير من الجامعات العمومية. يُرجى مراجعة الموقع الرسمي للاطلاع على الأرقام الحالية.";

        universities.saveAll(List.of(
            withPhoto(uni("sorbonne", "fr", "Sorbonne Université", "Paris", 2018, true, "https://www.sorbonne-universite.fr/en",
                "Née en 2018 de la fusion de Paris-Sorbonne (lettres) et de l'université Pierre-et-Marie-Curie (sciences), au cœur du Quartier latin à Paris.",
                "Formed in 2018 from the merger of Paris-Sorbonne (humanities) and Pierre-and-Marie-Curie University (sciences), in the heart of Paris's Latin Quarter.",
                "تأسست سنة 2018 من اندماج جامعة باريس-السوربون (الآداب) وجامعة بيار وماري كوري (العلوم)، في قلب الحي اللاتيني بباريس.",
                "Sciences & Ingénierie, Médecine, Lettres & Langues, Humanités", "Sciences & Engineering, Medicine, Letters & Languages, Humanities", "العلوم والهندسة، الطب، الآداب واللغات، العلوم الإنسانية",
                2902, 3950, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "French", DEGREES, 1), "https://images.pexels.com/photos/39143123/pexels-photo-39143123.jpeg", "Pexels License", "Barkali", "https://images.pexels.com/photos/17938396/pexels-photo-17938396.jpeg", "Paris"),
            withPhoto(uni("paris-saclay", "fr", "Université Paris-Saclay", "Saclay (région parisienne)", 2019, true, "https://www.universite-paris-saclay.fr/en",
                "Pôle universitaire de recherche au sud-ouest de Paris, réunissant plusieurs grandes écoles et instituts de recherche, très bien classé mondialement en mathématiques et dans plusieurs disciplines scientifiques.",
                "A research-intensive university cluster southwest of Paris bringing together several grandes écoles and research institutes, ranked among the world's best in mathematics and several STEM fields.",
                "قطب جامعي بحثي جنوب غرب باريس يجمع عدة مدارس عليا ومعاهد بحث، ويحتل مراتب عالمية مرموقة في الرياضيات وعدة تخصصات علمية.",
                "Mathématiques, Physique, Ingénierie, Informatique, Sciences de la vie", "Mathematics, Physics, Engineering, Computer Science, Life Sciences", "الرياضيات، الفيزياء، الهندسة، الإعلام الآلي، علوم الحياة",
                2902, 3950, pubNoteFr, pubNoteEn, pubNoteAr, "Sciences & Engineering", "French", DEGREES, 2), null, null, null, "https://images.pexels.com/photos/17938396/pexels-photo-17938396.jpeg", "Paris"),
            withPhoto(uni("lyon1", "fr", "Université Claude Bernard Lyon 1", "Lyon", 1971, true, "https://www.univ-lyon1.fr/en",
                "La plus grande université de sciences et de santé de France en dehors de Paris, avec des liens étroits avec le réseau hospitalier de Lyon pour la formation médicale.",
                "France's largest science and health university outside Paris, with close ties to Lyon's hospital network for medical training.",
                "أكبر جامعة للعلوم والصحة في فرنسا خارج باريس، وترتبط بعلاقات وثيقة مع الشبكة الاستشفائية لمدينة ليون في التكوين الطبي.",
                "Sciences & Technologie, Médecine & Santé, STAPS (Sciences du sport)", "Sciences & Technology, Medicine & Health, Sport Sciences (STAPS)", "العلوم والتكنولوجيا، الطب والصحة، علوم الرياضة",
                2902, 3950, pubNoteFr, pubNoteEn, pubNoteAr, "Sciences & Medicine", "French", DEGREES, 3), null, null, null, "https://images.pexels.com/photos/26519848/pexels-photo-26519848.jpeg", "Lyon"),
            withPhoto(uni("amu", "fr", "Aix-Marseille Université", "Marseille / Aix-en-Provence", 2012, true, "https://www.univ-amu.fr/en",
                "Une des plus grandes universités de France et du monde francophone, née en 2012 de la fusion de trois universités aixo-marseillaises, répartie sur des campus à Marseille et Aix-en-Provence.",
                "One of the largest universities in France and the French-speaking world, formed in 2012 from the merger of three Aix-Marseille universities, spread across campuses in Marseille and Aix-en-Provence.",
                "واحدة من أكبر الجامعات في فرنسا والعالم الفرنكوفوني، تأسست سنة 2012 من اندماج ثلاث جامعات في إكس-مرسيليا، وتضم حرمًا جامعيًا في مرسيليا وإكس أون بروفانس.",
                "Droit & Sciences politiques, Sciences, Économie & Gestion, Lettres, Sciences humaines", "Law & Political Science, Sciences, Economics & Management, Arts, Humanities", "القانون والعلوم السياسية، العلوم، الاقتصاد والتسيير، الآداب، العلوم الإنسانية",
                2902, 3950, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "French", DEGREES, 4), null, null, null, "https://images.pexels.com/photos/35995373/pexels-photo-35995373.jpeg", "Marseille"),
            withPhoto(uni("lille", "fr", "Université de Lille", "Lille", 2018, true, "https://www.univ-lille.fr/en/home/",
                "Une des plus grandes universités de France, dans la ville du nord de Lille, avec une offre couvrant un large éventail de facultés.",
                "One of France's largest universities, in the northern city of Lille, with a broad range of faculties.",
                "واحدة من أكبر الجامعات في فرنسا، في مدينة ليل بشمال البلاد، وتضم مجموعة واسعة من الكليات.",
                "Sciences, Santé, Droit, Économie, Lettres", "Sciences, Health, Law, Economics, Humanities", "العلوم، الصحة، القانون، الاقتصاد، الآداب",
                2902, 3950, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "French", DEGREES, 5), null, null, null, "https://images.pexels.com/photos/19573002/pexels-photo-19573002.jpeg", "Lille"),
            withPhoto(uni("paris-cite", "fr", "Université Paris Cité", "Paris", 2019, true, "https://u-paris.fr/en/",
                "Née de la fusion de Paris Descartes et Paris Diderot, forte en médecine, sciences et sciences humaines, au cœur de Paris.",
                "Formed from the merger of Paris Descartes and Paris Diderot, strong in medicine, sciences and humanities, in the heart of Paris.",
                "نشأت من اندماج جامعتي باريس ديكارت وباريس ديدرو، وتتميز بقوتها في الطب والعلوم والعلوم الإنسانية، في قلب باريس.",
                "Médecine, Sciences, Sciences humaines, Droit", "Medicine, Sciences, Humanities, Law", "الطب، العلوم، العلوم الإنسانية، القانون",
                2902, 3950, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "French", DEGREES, 6), null, null, null, "https://images.pexels.com/photos/17938396/pexels-photo-17938396.jpeg", "Paris"),
            withPhoto(uni("strasbourg", "fr", "Université de Strasbourg", "Strasbourg", 1538, true, "https://www.unistra.fr/en/",
                "Grande université de recherche à Strasbourg, au caractère européen et transfrontalier marqué, près de la frontière allemande.",
                "A major research university in Strasbourg, with a strong European and cross-border character near the German border.",
                "جامعة بحثية كبرى في ستراسبورغ، ذات طابع أوروبي وعابر للحدود قريبة من الحدود الألمانية.",
                "Sciences, Droit, Sciences politiques, Médecine, Lettres", "Sciences, Law, Political Science, Medicine, Humanities", "العلوم، القانون، العلوم السياسية، الطب، الآداب",
                2902, 3950, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "French", DEGREES, 7), null, null, null, "https://images.pexels.com/photos/30460371/pexels-photo-30460371.jpeg", "Strasbourg"),
            withPhoto(uni("bordeaux", "fr", "Université de Bordeaux", "Bordeaux", 2014, true, "https://www.u-bordeaux.fr/en",
                "Grande université publique du sud-ouest de la France, avec des programmes solides en sciences, santé et droit.",
                "A large public university in southwest France, with strong programs in sciences, health and law.",
                "جامعة عمومية كبرى في جنوب غرب فرنسا، وتتميز ببرامج قوية في العلوم والصحة والقانون.",
                "Sciences, Santé, Droit, Économie", "Sciences, Health, Law, Economics", "العلوم، الصحة، القانون، الاقتصاد",
                2902, 3950, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "French", DEGREES, 8), null, null, null, "https://images.pexels.com/photos/20646256/pexels-photo-20646256.jpeg", "Bordeaux"),
            withPhoto(uni("montpellier", "fr", "Université de Montpellier", "Montpellier", 1289, true, "https://www.umontpellier.fr/en/",
                "Héritière d'une tradition universitaire parmi les plus anciennes au monde (faculté de médecine dès 1220), reconstruite en université moderne et pluridisciplinaire.",
                "Heir to one of the oldest university traditions in the world (its medical faculty dates to 1220), rebuilt as a modern, multidisciplinary university.",
                "ترث تقليدًا جامعيًا من أقدم التقاليد في العالم (كلية الطب فيها تعود إلى سنة 1220)، وأعيد بناؤها كجامعة حديثة متعددة التخصصات.",
                "Médecine, Sciences, Droit, Sciences humaines", "Medicine, Sciences, Law, Humanities", "الطب، العلوم، القانون، العلوم الإنسانية",
                2902, 3950, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "French", DEGREES, 9), null, null, null, "https://images.pexels.com/photos/32451421/pexels-photo-32451421.jpeg", "Montpellier"),
            withPhoto(uni("nantes", "fr", "Université de Nantes", "Nantes", 1460, true, "https://www.univ-nantes.fr/en",
                "Université publique sur la côte atlantique française, avec une offre large en sciences, droit et santé.",
                "A public university on France's Atlantic coast, with a broad offering across sciences, law and health.",
                "جامعة عمومية على الساحل الأطلسي الفرنسي، وتقدم عرضًا واسعًا في العلوم والقانون والصحة.",
                "Sciences, Droit, Santé, Lettres", "Sciences, Law, Health, Humanities", "العلوم، القانون، الصحة، الآداب",
                2902, 3950, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "French", DEGREES, 10), null, null, null, "https://images.pexels.com/photos/30870290/pexels-photo-30870290.jpeg", "Nantes"),
            withPhoto(uni("hec", "fr", "HEC Paris", "Jouy-en-Josas (région parisienne)", 1881, false, "https://www.hec.edu/en",
                "Une des grandes écoles de commerce les mieux classées d'Europe, proposant des programmes de licence, master, MBA et doctorat.",
                "One of Europe's top-ranked business schools, offering bachelor's, master's, MBA and doctoral programs.",
                "واحدة من أعلى مدارس الأعمال تصنيفًا في أوروبا، وتقدم برامج الإجازة والماستر وMBA والدكتوراه.",
                "Commerce & Gestion, Finance", "Business & Management, Finance", "التجارة والإدارة، المالية",
                null, null, privNoteFr, privNoteEn, privNoteAr, "Business", "English", DEGREES, 11), null, null, null, "https://images.pexels.com/photos/17938396/pexels-photo-17938396.jpeg", "Paris"),
            withPhoto(uni("edhec", "fr", "EDHEC Business School", "Lille / Nice", 1906, false, "https://www.edhec.edu/en",
                "Grande école de commerce française réputée, avec des campus à Lille et à Nice, connue pour la finance et ses programmes internationaux.",
                "A leading French business school with campuses in Lille and Nice, known for finance and international programs.",
                "من أبرز مدارس الأعمال الفرنسية، ولها حرم جامعي في ليل ونيس، ومعروفة بتخصص المالية وبرامجها الدولية.",
                "Commerce & Gestion, Finance", "Business & Management, Finance", "التجارة والإدارة، المالية",
                null, null, privNoteFr, privNoteEn, privNoteAr, "Business", "English", DEGREES, 12), null, null, null, "https://images.pexels.com/photos/19573002/pexels-photo-19573002.jpeg", "Lille")
        ));
    }

    private void seedItaly() {
        String pubNoteFr = "Les frais des universités publiques italiennes sont calculés selon le revenu familial (ISEE) ; les étudiants sous le seuil « no-tax area » (variable selon l'université) ne paient qu'une taxe régionale minime. Demandez l'ISEE parificato au bureau international.";
        String pubNoteEn = "Italian public-university fees are income-assessed (ISEE); students below the \"no-tax area\" threshold (which varies by university) pay only a small regional tax. Ask the international office about the ISEE parificato equivalence.";
        String pubNoteAr = "تُحتسب رسوم الجامعات العمومية الإيطالية حسب الدخل العائلي (ISEE)؛ الطلبة تحت عتبة \"no-tax area\" (تختلف حسب الجامعة) يدفعون فقط ضريبة جهوية بسيطة. يُنصح بالاستفسار عن معادلة ISEE parificato لدى المكتب الدولي.";
        String privNoteFr = "Université privée : les frais sont fixés indépendamment et généralement plus élevés que dans le public. Consultez le site officiel pour les tarifs à jour.";
        String privNoteEn = "Private university: fees are set independently and generally higher than public universities. Check the official site for current figures.";
        String privNoteAr = "جامعة خاصة: تُحدَّد الرسوم بشكل مستقل وعادةً أعلى من الجامعات العمومية. يُرجى مراجعة الموقع الرسمي للاطلاع على الأرقام الحالية.";

        universities.saveAll(List.of(
            withPhoto(uni("polito", "it", "Politecnico di Torino", "Turin", 1859, true, "https://www.polito.it/en",
                "Une des principales écoles d'ingénierie et d'architecture d'Italie, avec de nombreux programmes de licence et master entièrement enseignés en anglais et de solides partenariats internationaux.",
                "One of Italy's leading engineering and architecture universities, with many bachelor's and master's programs taught entirely in English and strong international partnerships.",
                "من أبرز جامعات الهندسة والعمارة في إيطاليا، وتضم العديد من برامج الإجازة والماستر التي تُدرَّس بالكامل باللغة الإنجليزية، وشراكات دولية قوية.",
                "Ingénierie, Architecture, Design", "Engineering, Architecture, Design", "الهندسة، العمارة، التصميم",
                500, 4000, pubNoteFr, pubNoteEn, pubNoteAr, "Engineering", "Italian", DEGREES, 1), "https://upload.wikimedia.org/wikipedia/commons/4/43/Politecnico_di_Torino%2C_sede_di_corso_Duca_degli_Abruzzi%2C_Torino.jpg", "CC BY-SA 4.0", "Neq00", "https://images.unsplash.com/photo-1645703697898-67ea1e0e11ec", "Turin"),
            withPhoto(uni("polimi", "it", "Politecnico di Milano", "Milan", 1863, true, "https://www.polimi.it/en/",
                "La plus grande université technique d'Italie et l'une des écoles les mieux classées en Europe en ingénierie, architecture et design industriel, avec une large offre de programmes en anglais.",
                "Italy's largest technical university and one of Europe's top-ranked schools for engineering, architecture and industrial design, with a large English-taught program offering.",
                "أكبر جامعة تقنية في إيطاليا وواحدة من أفضل المدارس تصنيفًا في أوروبا في الهندسة والعمارة والتصميم الصناعي، مع عرض واسع من البرامج باللغة الإنجليزية.",
                "Ingénierie, Architecture, Design", "Engineering, Architecture, Design", "الهندسة، العمارة، التصميم",
                500, 4000, pubNoteFr, pubNoteEn, pubNoteAr, "Engineering", "Italian", DEGREES, 2), "https://upload.wikimedia.org/wikipedia/commons/1/11/Politecnico_di_MIlano.jpg", "CC BY-SA 4.0", "Luigi Brambilla", "https://images.unsplash.com/photo-1566662961381-8ff13ac24766", "Milan"),
            withPhoto(uni("unibo", "it", "Alma Mater Studiorum – Università di Bologna", "Bologne", 1088, true, "https://www.unibo.it/en",
                "Largement considérée comme la plus ancienne université du monde encore en activité, fondée en 1088. Grande université publique de recherche répartie sur plusieurs campus en Émilie-Romagne.",
                "Widely regarded as the oldest university in the world still in operation, founded in 1088. A large public research university with multiple campuses across Emilia-Romagna.",
                "تُعتبر على نطاق واسع أقدم جامعة في العالم لا تزال نشطة، تأسست سنة 1088. جامعة بحثية عمومية كبرى تضم عدة حرم جامعية في إقليم إميليا رومانيا.",
                "Droit, Lettres, Médecine, Ingénierie, Économie", "Law, Humanities, Medicine, Engineering, Economics", "القانون، الآداب، الطب، الهندسة، الاقتصاد",
                500, 4000, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Italian", DEGREES, 3), "https://upload.wikimedia.org/wikipedia/commons/1/13/Palazzo_Poggi_UniBo.jpg", "CC BY-SA 4.0", "Mattia Barci", "https://images.unsplash.com/photo-1743634427797-cda09d4bcca7", "Bologna"),
            withPhoto(uni("sapienza", "it", "Sapienza Università di Roma", "Rome", 1303, true, "https://www.uniroma1.it/en",
                "Fondée en 1303 par le pape Boniface VIII, Sapienza est l'une des plus grandes universités d'Europe par le nombre d'étudiants, avec des facultés couvrant presque tous les domaines académiques.",
                "Founded in 1303 by Pope Boniface VIII, Sapienza is one of the largest universities in Europe by enrollment, with faculties spanning nearly every academic field.",
                "تأسست سنة 1303 على يد البابا بونيفاس الثامن، وسابيينزا واحدة من أكبر الجامعات في أوروبا من حيث عدد الطلبة، وتضم كليات تغطي تقريبًا كل المجالات الأكاديمية.",
                "Médecine, Ingénierie, Lettres, Droit, Sciences", "Medicine, Engineering, Humanities, Law, Sciences", "الطب، الهندسة، الآداب، القانون، العلوم",
                500, 4000, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Italian", DEGREES, 4), "https://upload.wikimedia.org/wikipedia/commons/e/e7/Sapienza_Universit%C3%A0_di_Roma.jpg", "CC BY-SA 4.0", "Carlo Dani", "https://images.unsplash.com/photo-1555992828-ca4dbe41d294", "Rome"),
            withPhoto(uni("unimi", "it", "Università degli Studi di Milano", "Milan", 1924, true, "https://www.unimi.it/en",
                "Une des plus grandes universités publiques d'Italie ("+"\"La Statale\""+"), avec des facultés couvrant les sciences, les lettres, le droit et la médecine.",
                "One of Italy's largest public universities (\"La Statale\"), with broad faculties across sciences, humanities, law and medicine.",
                "واحدة من أكبر الجامعات العمومية في إيطاليا (\"La Statale\")، وتضم كليات واسعة في العلوم والآداب والقانون والطب.",
                "Sciences, Lettres, Droit, Médecine", "Sciences, Humanities, Law, Medicine", "العلوم، الآداب، القانون، الطب",
                500, 4000, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Italian", DEGREES, 5), "https://upload.wikimedia.org/wikipedia/commons/a/ad/Universit%C3%A0_degli_Studi_di_Milano_-_sede_via_festa_del_perdono_-_Ca%27_Granda_-_cortile_interno.JPG", "CC BY-SA 3.0", "Stefano Stabile", "https://images.unsplash.com/photo-1566662961381-8ff13ac24766", "Milan"),
            withPhoto(uni("unipd", "it", "Università di Padova", "Padoue", 1222, true, "https://www.unipd.it/en/",
                "Une des plus anciennes universités du monde, historiquement liée à Galilée, avec une offre couvrant presque tous les domaines.",
                "One of the oldest universities in the world, historically linked to Galileo Galilei, with an offering spanning nearly every field.",
                "واحدة من أقدم الجامعات في العالم، وترتبط تاريخيًا بغاليليو غاليلي، وتغطي عروضها تقريبًا كل المجالات.",
                "Sciences, Médecine, Droit, Ingénierie, Lettres", "Sciences, Medicine, Law, Engineering, Humanities", "العلوم، الطب، القانون، الهندسة، الآداب",
                500, 4000, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Italian", DEGREES, 6), "https://upload.wikimedia.org/wikipedia/commons/4/49/Palazzo_Bo_%28Padua%29.jpg", "CC BY-SA 4.0", "Didier Descouens", "https://images.unsplash.com/photo-1652987363298-967defa1dc66", "Padua"),
            withPhoto(uni("unito", "it", "Università di Torino", "Turin", 1404, true, "https://www.unito.it/en",
                "Une des plus anciennes et plus grandes universités généralistes d'Italie, dans la ville de Turin, au nord du pays.",
                "One of Italy's oldest and largest comprehensive universities, in the northern city of Turin.",
                "واحدة من أقدم وأكبر الجامعات الشاملة في إيطاليا، في مدينة تورينو شمال البلاد.",
                "Sciences, Droit, Médecine, Économie, Lettres", "Sciences, Law, Medicine, Economics, Humanities", "العلوم، القانون، الطب، الاقتصاد، الآداب",
                500, 4000, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Italian", DEGREES, 7), "https://upload.wikimedia.org/wikipedia/commons/9/9c/Rettorato_Universit%C3%A0_di_Torino.jpg", "CC BY-SA 4.0", "Egiglia", "https://images.unsplash.com/photo-1645703697898-67ea1e0e11ec", "Turin"),
            withPhoto(uni("unipi", "it", "Università di Pisa", "Pise", 1343, true, "https://www.unipi.it/index.php/english",
                "Université publique historique de Pise, également associée à Galilée, forte en sciences et ingénierie.",
                "A historic public university in Pisa, also associated with Galileo Galilei, strong in sciences and engineering.",
                "جامعة عمومية تاريخية في بيزا، وترتبط أيضًا بغاليليو غاليلي، وتتميز بقوتها في العلوم والهندسة.",
                "Sciences, Ingénierie, Médecine", "Sciences, Engineering, Medicine", "العلوم، الهندسة، الطب",
                500, 4000, pubNoteFr, pubNoteEn, pubNoteAr, "Sciences & Engineering", "Italian", DEGREES, 8), "https://upload.wikimedia.org/wikipedia/commons/c/c1/Palazzo_della_Sapienza_1.jpg", "CC BY 3.0", "Alessandro Croce", "https://images.unsplash.com/photo-1566422655726-2420d2b9ef5e", "Pisa"),
            withPhoto(uni("unifi", "it", "Università degli Studi di Firenze", "Florence", 1321, true, "https://www.unifi.it/changelang-eng.html",
                "Grande université publique de Florence, avec des programmes solides en architecture, arts et sciences.",
                "A large public university in Florence, with strong programs in architecture, arts and sciences.",
                "جامعة عمومية كبرى في فلورنسا، وتتميز ببرامج قوية في العمارة والفنون والعلوم.",
                "Architecture, Arts, Sciences, Droit", "Architecture, Arts, Sciences, Law", "العمارة، الفنون، العلوم، القانون",
                500, 4000, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Italian", DEGREES, 9), "https://upload.wikimedia.org/wikipedia/commons/0/01/Palazzo_dell%27universit%C3%A0_di_firenze%2C_piazza_san_marco.JPG", "CC BY-SA 3.0", "sailko", "https://images.unsplash.com/photo-1578262634053-eead874052be", "Florence"),
            withPhoto(uni("unina", "it", "Università degli Studi di Napoli Federico II", "Naples", 1224, true, "https://www.international.unina.it/",
                "Une des plus anciennes universités publiques financées par l'État au monde, à Naples, avec de larges facultés en ingénierie, médecine et lettres.",
                "One of the oldest state-funded universities in the world, in Naples, with broad faculties across engineering, medicine and humanities.",
                "واحدة من أقدم الجامعات العمومية الممولة من الدولة في العالم، في نابولي، وتضم كليات واسعة في الهندسة والطب والآداب.",
                "Ingénierie, Médecine, Lettres, Agronomie", "Engineering, Medicine, Humanities, Agriculture", "الهندسة، الطب، الآداب، الفلاحة",
                500, 4000, pubNoteFr, pubNoteEn, pubNoteAr, "Comprehensive", "Italian", DEGREES, 10), "https://upload.wikimedia.org/wikipedia/commons/6/67/Universit%C3%A0_degli_studi_di_Napoli_Federico_II_-_Complesso_di_Monte_Sant%27Angelo_-_entrata_principale.jpg", "CC BY-SA 4.0", "Gisorr650", "https://images.unsplash.com/photo-1567202170721-bd01fbdea30a", "Naples"),
            withPhoto(uni("bocconi", "it", "Università Bocconi", "Milan", 1902, false, "https://www.unibocconi.eu/en",
                "La principale université privée d'Italie en économie, finance et gestion, très internationale, avec de nombreux programmes enseignés en anglais.",
                "Italy's leading private university for economics, finance and management, highly international, with many English-taught programs.",
                "الجامعة الخاصة الرائدة في إيطاليا في الاقتصاد والمالية والإدارة، ذات طابع دولي كبير، وتضم برامج عديدة باللغة الإنجليزية.",
                "Économie, Finance, Gestion", "Economics, Finance, Management", "الاقتصاد، المالية، الإدارة",
                null, null, privNoteFr, privNoteEn, privNoteAr, "Business", "English", DEGREES, 11), "https://upload.wikimedia.org/wikipedia/commons/9/94/Biblioteca_Universit%C3%A0_Bocconi.jpg", "CC BY-SA 4.0", "Corinto88", "https://images.unsplash.com/photo-1566662961381-8ff13ac24766", "Milan"),
            withPhoto(uni("luiss", "it", "LUISS Guido Carli", "Rome", 1966, false, "https://www.luiss.edu/",
                "Université privée à Rome spécialisée en économie, droit, sciences politiques et gestion.",
                "A private university in Rome specializing in economics, law, political science and business.",
                "جامعة خاصة في روما متخصصة في الاقتصاد والقانون والعلوم السياسية والإدارة.",
                "Économie, Droit, Sciences politiques, Gestion", "Economics, Law, Political Science, Business", "الاقتصاد، القانون، العلوم السياسية، الإدارة",
                null, null, privNoteFr, privNoteEn, privNoteAr, "Business & Law", "English", DEGREES, 12), "https://upload.wikimedia.org/wikipedia/commons/2/2c/LUISS_Guido_Carli_sede-viale-pola.jpg", "CC BY-SA 3.0", "Andreapinti", "https://images.unsplash.com/photo-1555992828-ca4dbe41d294", "Rome")
        ));
    }
}
