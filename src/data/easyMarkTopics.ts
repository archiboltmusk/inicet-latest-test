export interface VolatileTopic {
  id: string;
  num: number;
  title: string;
  subject: string;
  summary: string;
  tableHead: string[];
  tableRows: string[][];
  discriminatorMnemonic?: string;
  pyqNote: string;
}

export const EASY_MARK_TOPICS: VolatileTopic[] = [
  {
    id: 'biomedical-waste',
    num: 1,
    title: 'Biomedical Waste (BMW) Management Colour Codes',
    subject: 'PSM / Microbiology',
    summary: 'Rules revised 2016/2018/2019. Categorized by Yellow, Red, White (Translucent), and Blue.',
    tableHead: ['Colour Bag / Container', 'Waste Type', 'Treatment / Disposal Method'],
    tableRows: [
      ['YELLOW (Incinerable / Non-chlorinated)', 'Human/animal anatomical, soiled waste, expired cytotoxic drugs, linen/bedding, chemical liquid waste, placenta', 'Incineration or Plasma pyrolysis / Deep burial'],
      ['RED (Recyclable Plastics)', 'Tubing, bottles, IV tubes/sets, catheters, urine bags, syringes WITHOUT needles, gloves, vacutainers', 'Autoclaving / Microwaving → shredding → recycling'],
      ['WHITE Translucent (Puncture-proof)', 'Sharps including needles, syringes WITH fixed needles, blades, scalpels, contaminated broken glass sharps', 'Autoclaving / Dry heat sterilisation → shredding / encapsulation'],
      ['BLUE (Glassware & Metallic Implants)', 'Broken medicine ampoules/vials, glass bottles (intact/broken), metal implants, orthopedic pins', 'Disinfection (Sodium hypochlorite) / Autoclaving → recycling'],
    ],
    discriminatorMnemonic: 'Yellow = Anatomy & Soiled; Red = Recyclable plastics; White = sharps with needles; Blue = Glass & metal implants.',
    pyqNote: 'Asked 6× in INI/AIIMS: Blood bags go to YELLOW; Syringes without needles go to RED; Vaccine vials go to BLUE.'
  },
  {
    id: 'glasgow-coma-scale',
    num: 2,
    title: 'Glasgow Coma Scale (GCS) Adult & Paediatric',
    subject: 'Surgery / Anesthesia',
    summary: 'Score ranges from 3 to 15. E(4) + V(5) + M(6). Non-testable components marked as NT (e.g., intubated = E_V_NT_M_).',
    tableHead: ['Score', 'Eye Opening (E max 4)', 'Verbal Response (V max 5)', 'Motor Response (M max 6)'],
    tableRows: [
      ['6', '—', '—', 'Obeys commands'],
      ['5', '—', 'Oriented', 'Localises to painful stimulus'],
      ['4', 'Spontaneous', 'Confused conversation', 'Normal flexion / Withdrawal from pain'],
      ['3', 'To sound / voice', 'Inappropriate words', 'Abnormal flexion (Decorticate rigidity)'],
      ['2', 'To pressure / pain', 'Incomprehensible sounds / Moaning', 'Extension response (Decerebrate rigidity)'],
      ['1', 'None', 'None', 'None (flaccid)'],
    ],
    discriminatorMnemonic: 'Decorticate (3) = arms flexed to CORE (cortex lesion). Decerebrate (2) = arms Extended outwards (brainstem/midbrain lesion). Severe TBI = GCS ≤ 8 (intubate!).',
    pyqNote: 'GCS ≤ 8 is the classic cutoff for coma and endotracheal airway protection.'
  },
  {
    id: 'sti-color-kits',
    num: 3,
    title: 'NACO Syndromic STI / RTI Colour-Coded Kits',
    subject: 'Dermatology / PSM',
    summary: 'Seven standard NACO colour-coded kits for syndromic management of STIs without laboratory delay.',
    tableHead: ['Kit # & Colour', 'Syndrome / Clinical Presentation', 'Drugs Included & Single-Dose Regimen'],
    tableRows: [
      ['Kit 1: GREY', 'Urethral discharge / Cervical discharge / Anorectal discharge', 'Tab Azithromycin 1 g stat (oral) + Tab Cefixime 400 mg stat (oral)'],
      ['Kit 2: GREEN', 'Vaginitis (Trichomoniasis, Bacterial vaginosis, Candidiasis)', 'Tab Secnidazole 2 g stat (oral) + Cap Fluconazole 150 mg stat (oral)'],
      ['Kit 3: WHITE', 'Genital Ulcer Disease – Non-Herpetic (Syphilis / Chancroid)', 'Inj Benzathine Penicillin 2.4 MU IM stat + Tab Azithromycin 1 g stat (oral)'],
      ['Kit 4: BLUE', 'Genital Ulcer – Non-Herpetic in Penicillin-Allergic', 'Tab Doxycycline 100 mg BD × 14 days + Tab Azithromycin 1 g stat (oral)'],
      ['Kit 5: RED', 'Genital Ulcer Disease – Herpetic (HSV-2)', 'Tab Acyclovir 400 mg TDS × 7 days'],
      ['Kit 6: YELLOW', 'Lower Abdominal Pain (Pelvic Inflammatory Disease / PID)', 'Tab Cefixime 400 mg BD × 14d + Tab Metronidazole 400 mg BD × 14d + Tab Doxycycline 100 mg BD × 14d'],
      ['Kit 7: BLACK', 'Inguinal Bubo (LGV / Chancroid)', 'Tab Doxycycline 100 mg BD × 21 days + Tab Azithromycin 1 g stat (oral)'],
    ],
    discriminatorMnemonic: '1-Grey (Discharge); 2-Green (Vaginitis); 3-White (Syphilis); 4-Blue (Allergic Syphilis); 5-Red (HSV); 6-Yellow (PID); 7-Black (Bubo).',
    pyqNote: 'Pregnancy modification: Replace Doxycycline with Erythromycin/Azithromycin.'
  },
  {
    id: 'csf-analysis-profiles',
    num: 4,
    title: 'CSF Profiles in Meningitis: Bacterial vs TB vs Viral vs Fungal',
    subject: 'Medicine / Microbiology / Pediatrics',
    summary: 'Normal CSF: Opening pressure 10-20 cmH2O, WBC < 5/mm³ (all lymphocytes), Protein 15-45 mg/dL, Glucose > 60% of blood glucose.',
    tableHead: ['Meningitis Type', 'Dominant Cells', 'CSF Glucose', 'CSF Protein', 'Opening Pressure & Special Stains'],
    tableRows: [
      ['Acute Pyogenic / Bacterial', 'Marked Neutrophils (> 1,000–10,000/mm³)', 'Markedly LOW (< 40 mg/dL or CSF:Serum < 0.3)', 'Markedly HIGH (> 100–500 mg/dL)', 'High pressure; Gram stain positive; elevated lactate'],
      ['Tubercular (TBM)', 'Lymphocytes (early neutrophils), cobweb clot on standing', 'Very LOW (< 30 mg/dL)', 'Markedly HIGH (> 100–500+ mg/dL)', 'High pressure; ZN stain / GeneXpert MTB; high ADA (> 10 U/L)'],
      ['Aseptic / Viral', 'Lymphocytes (early mixed), 50–500/mm³', 'NORMAL (CSF:Serum > 0.6)', 'Normal to mildly elevated (50–100 mg/dL)', 'Normal or slightly elevated; PCR for enterovirus/HSV'],
      ['Fungal (Cryptococcal)', 'Lymphocytes (20–500/mm³)', 'LOW to normal', 'HIGH', 'VERY HIGH opening pressure (> 25 cmH2O); India ink positive, capsular antigen (+)'],
    ],
    discriminatorMnemonic: 'Normal glucose = Viral. Low glucose + Neutrophils = Bacterial. Low glucose + Lymphocytes + Cobweb = Tubercular. Very high pressure + India ink = Cryptococcus.',
    pyqNote: 'Meningitis in neonates (< 1 mo): Group B Streptococcus (S. agalactiae) > E. coli > Listeria monocytogenes. Add Ampicillin for Listeria.'
  },
  {
    id: 'vaccine-cold-chain',
    num: 5,
    title: 'Vaccine Cold Chain & Vaccine Vial Monitor (VVM)',
    subject: 'PSM / Pediatrics',
    summary: 'Temperature maintenance: Most vaccines kept at +2°C to +8°C. Freezer compartment (-15°C to -25°C) for Polio (bOPV) and Yellow fever.',
    tableHead: ['Component', 'Details & Temperature', 'Sensitivity Hierarchy'],
    tableRows: [
      ['Most Heat-Sensitive Vaccine', 'bOPV (Oral Polio) > Rotavirus > Measles/MR > BCG', 'OPV is damaged most rapidly by heat'],
      ['Most Freeze-Sensitive Vaccine', 'Hepatitis B > Td / DPT / Pentavalent > TT > IPV', 'Never freeze T-series or HepB (causes precipitation/loss of potency)'],
      ['Shake Test', 'Used to detect if freeze-sensitive vaccines (DPT, TT, HepB, Pentavalent) were frozen and damaged', 'Positive shake test (flocculant sediment falls fast) → DISCARD vial'],
      ['VVM Stage 1 & 2', 'Stage 1: Inner square lighter than outer circle. Stage 2: Inner square still lighter than outer circle', 'Vaccine can be USED if within expiry date'],
      ['VVM Stage 3 & 4', 'Stage 3: Inner square matches outer circle. Stage 4: Inner square darker than outer circle', 'DISCARD VACCINE immediately even if not expired!'],
      ['Equipment Levels', 'ILR (Ice-Lined Refrigerator) = +2°C to +8°C; Deep Freezer = -15°C to -25°C', 'Dial thermometer monitored twice daily; keep conditioning icepacks on table before packing'],
    ],
    discriminatorMnemonic: 'Heat-sensitive: OPV. Freeze-sensitive: Hepatitis B. VVM: If the inner square is lighter than the circle, USE. If matched or darker, DISCARD.',
    pyqNote: 'Reconstituted BCG & Measles must be discarded after 4 hours (due to risk of toxic shock syndrome from S. aureus contamination).'
  },
  {
    id: 'bns-forensic-sections',
    num: 6,
    title: 'Bharatiya Nyaya Sanhita (BNS) 2023 vs IPC Legal Sections',
    subject: 'Forensic Medicine (FMT)',
    summary: 'The criminal laws in India were overhauled on 1 July 2024. BNS sections are now tested in INI-CET.',
    tableHead: ['Offence / Legal Provision', 'Old IPC Section', 'New BNS 2023 Section', 'Key Clinical / Legal Anchor'],
    tableRows: [
      ['Medical Negligence causing death', 'IPC 304A', 'BNS 106(1)', 'Death by rash or negligent act of doctor; punishment up to 2 years'],
      ['Murder', 'IPC 302', 'BNS 103(1)', 'Punishment for murder'],
      ['Culpable Homicide not amounting to murder', 'IPC 304', 'BNS 105', 'Causing death with intention or knowledge'],
      ['Dowry Death', 'IPC 304B', 'BNS 80', 'Death within 7 years of marriage with cruelty/dowry demand'],
      ['Rape', 'IPC 375 / 376', 'BNS 63 / 64', 'Medical examination of rape victim under BNSS 184 (old CrPC 164A)'],
      ['Grievous Hurt', 'IPC 320 / 325', 'BNS 114 / 116', '8 statutory criteria for grievous hurt (emasculation, permanent sight/hearing loss, privation of joint, fracture, 15/20 days space)'],
      ['Voluntary causing hurt by dangerous weapons', 'IPC 324', 'BNS 117', 'Hurt with sharp-edged/shooting weapons'],
      ['Attempt to commit suicide', 'IPC 309', 'BNS 226', 'Decriminalized unless attempted to compel public servant'],
    ],
    discriminatorMnemonic: 'Medical negligence = BNS 106(1) (old 304A). Dowry death = BNS 80 (old 304B). Rape = BNS 63/64 (old 375/376). Grievous hurt = BNS 114/116 (old 320/325).',
    pyqNote: 'CrPC 174 (Inquest by police) is now BNSS 194. CrPC 176 (Magistrate inquest in custodial death/dowry) is BNSS 196.'
  },
  {
    id: 'primitive-reflexes',
    num: 7,
    title: 'Neonatal & Infantile Primitive Reflexes Timeline',
    subject: 'Pediatrics',
    summary: 'Appearance and disappearance timeline of developmental primitive reflexes. Persistence indicates cerebral palsy.',
    tableHead: ['Reflex', 'Appearance Age', 'Disappearance Age', 'Clinical Significance'],
    tableRows: [
      ['Moro Reflex', '28 weeks gestation (complete at 34w)', '4–6 months (abnormal if > 6m)', 'Asymmetrical in Erb palsy, fractured clavicle, hemiplegia; absent in severe CNS depression'],
      ['Palmar Grasp', '28 weeks gestation', '2–3 months', 'Replaced by voluntary palmar grasp at 5 months and pincer grasp at 9-10 months'],
      ['Plantar Grasp', '30 weeks gestation', '9–12 months (last to disappear)', 'Persistence past 1 year suggests spastic cerebral palsy'],
      ['Asymmetric Tonic Neck (ATNR)', '35 weeks gestation', '6 months ("Fencing posture")', 'Face turned to one side → ipsilateral limbs extend, contralateral limbs flex'],
      ['Rooting & Sucking', 'Rooting 32w, Sucking 28-32w', 'Rooting disappears at 3–4m (awake)', 'Failure of rooting indicates brainstem or neurological damage'],
      ['Parachute Reflex (Postural)', '8–9 months of age (DEVELOPED)', 'PERSISTS for life (never disappears)', 'Protective response: sudden head-down tilt causes arms to extend symmetrically forward'],
    ],
    discriminatorMnemonic: 'Moro disappears by 4-6 months. Palmar grasp disappears by 2-3 months. Plantar grasp disappears by 9-12 months. Parachute APPEARS at 8-9m and PERSISTS for life.',
    pyqNote: 'Asked repeatedly: Parachute reflex is NOT a primitive reflex; it is a protective postural reflex that appears at 8-9 months and never disappears.'
  },
  {
    id: 'tests-of-significance',
    num: 8,
    title: 'Biostatistics: Test of Significance Selection Tree',
    subject: 'PSM',
    summary: 'Algorithm to choose the exact statistical test based on data type (qualitative/categorical vs quantitative/numerical) and number of groups.',
    tableHead: ['Data Type', 'Number of Groups / Comparison', 'Appropriate Statistical Test', 'Key Constraint / Rule'],
    tableRows: [
      ['Qualitative (Proportions / %) | 2 groups', 'Comparison of 2 independent proportions (e.g., cure rate drug A vs B)', 'Chi-square (χ²) test', 'If any expected cell count < 5 → use Fisher exact test'],
      ['Qualitative | Paired before/after', 'Comparison of proportions in paired samples (e.g., smokers before & after workshop)', 'McNemar test', 'Used for paired nominal/qualitative data'],
      ['Quantitative (Mean / SD) | 2 independent', 'Comparison of means between 2 independent groups (e.g., BP in males vs females)', 'Unpaired Student t-test (Independent t-test)', 'Assumes normal Gaussian distribution'],
      ['Quantitative | 2 paired samples', 'Comparison of means in same subject before & after intervention', 'Paired Student t-test', 'Controls for individual baseline variability'],
      ['Quantitative | > 2 groups (3 or more)', 'Comparison of means across 3+ independent groups (e.g., BP on Drug A vs B vs Placebo)', 'ANOVA (One-way Analysis of Variance / F-test)', 'DO NOT perform multiple t-tests (inflates Type I error)'],
      ['Non-parametric (skewed) | 2 independent', 'Non-normal continuous or ordinal data in 2 groups', 'Mann-Whitney U test (Wilcoxon rank-sum)', 'Non-parametric alternative to unpaired t-test'],
      ['Non-parametric | 2 paired groups', 'Non-normal paired continuous/ordinal data', 'Wilcoxon signed-rank test', 'Non-parametric alternative to paired t-test'],
      ['Non-parametric | > 2 groups', 'Non-normal continuous data across 3+ groups', 'Kruskal-Wallis test', 'Non-parametric alternative to ANOVA'],
    ],
    discriminatorMnemonic: 'Chi-Square for Proportions; Student t-test for 2 Means; ANOVA for > 2 Means. Paired qualitative = McNemar.',
    pyqNote: 'When expected frequency in any cell of a 2x2 contingency table is less than 5, Chi-square is invalid; use Fisher\'s Exact Test.'
  },
  {
    id: 'acid-base-formulas',
    num: 9,
    title: 'Acid-Base & Electrolyte Core Formulas',
    subject: 'Medicine / Biochemistry',
    summary: 'The 5 non-negotiable formulas for solving every arterial blood gas (ABG) in INI-CET in under 30 seconds.',
    tableHead: ['Parameter', 'Exact Formula', 'Normal Value & Interpretation Rule'],
    tableRows: [
      ['Winter\'s Formula (Metabolic Acidosis Compensation)', 'Expected PaCO2 = (1.5 × [HCO3⁻]) + 8 ± 2', 'If actual PaCO2 > expected → co-existing Respiratory Acidosis. If actual < expected → co-existing Respiratory Alkalosis.'],
      ['Serum Anion Gap (AG)', 'AG = Na⁺ − (Cl⁻ + HCO3⁻)', 'Normal = 12 ± 4 mEq/L (8–16). If Albumin is low: Corrected AG = Observed AG + 2.5 × (4.0 − Serum Albumin).'],
      ['Delta Ratio (ΔAG / ΔHCO3⁻)', 'Delta Ratio = (AG − 12) / (24 − [HCO3⁻])', '< 0.4: Pure NAGMA; 0.4–0.8: Mixed HAGMA + NAGMA; 0.8–2.0: Pure HAGMA; > 2.0: HAGMA + Metabolic Alkalosis.'],
      ['Urine Anion Gap (UAG)', 'UAG = (UNa⁺ + UK⁺) − UCl⁻', 'Negative UAG (< 0) = GI HCO3⁻ loss (diarrhea). Positive UAG (> 0) = Impaired distal renal acidification (Type 1 RTA).'],
      ['Osmolar Gap', 'Measured Osmolality − (2[Na⁺] + [Glucose]/18 + [BUN]/2.8)', 'Normal < 10 mOsm/kg. If > 10 in high-AG acidosis → Toxic alcohols (Methanol, Ethylene Glycol).'],
      ['Sodium Correction in Hyperglycemia', 'Corrected Na⁺ = Measured Na⁺ + 0.016 × (Serum Glucose − 100)', 'Katz formula: add 1.6 mEq/L Na for every 100 mg/dL glucose above 100.'],
    ],
    discriminatorMnemonic: 'Winter: 1.5×HCO3 + 8 ± 2. Delta > 2 = Vomiting + Acidosis. Delta < 0.4 = Diarrhea / RTA. UAG negative = Diarrhea.',
    pyqNote: 'Always check albumin! In critically ill patients with albumin = 1.0, failing to correct AG misses hidden lactic acidosis.'
  },
  {
    id: 'toxic-alcohols',
    num: 10,
    title: 'Toxic Alcohols: Methanol vs Ethylene Glycol vs Isopropanol',
    subject: 'Forensic Medicine / Medicine',
    summary: 'High anion gap acidosis with elevated osmolar gap. Differentiate organ targets and metabolites.',
    tableHead: ['Toxic Alcohol', 'Toxic Metabolite & Enzyme', 'Key Clinical Hallmark', 'Specific Treatment / Antidote'],
    tableRows: [
      ['Methanol (Wood alcohol)', 'Formic acid (via Alcohol dehydrogenase & Aldehyde dehydrogenase)', 'Snowfield vision / blurred vision / optic papillitis → blindness; Putaminal necrosis / hemorrhage', 'Fomepizole (DOC, 15 mg/kg) or Ethanol infusion + Folinic acid / Folic acid + Hemodialysis'],
      ['Ethylene Glycol (Antifreeze)', 'Glycolic acid, Oxalic acid', 'Calcium oxalate monohydrate (dumbbell/needle) crystals in urine, AKI, hypocalcemia (tetany), cranial nerve VII palsy', 'Fomepizole or Ethanol + Pyridoxine (B6) + Thiamine (B1) + Hemodialysis'],
      ['Isopropanol (Rubbing alcohol)', 'Acetone (via Alcohol dehydrogenase)', 'KETOSIS WITHOUT ACIDOSIS (normal AG, positive serum ketones), hemorrhagic gastritis, sweet fruity breath', 'Supportive care + IVF; NO Fomepizole needed (acetone is non-acidotic/mild); Dialysis only if severe shock'],
    ],
    discriminatorMnemonic: 'Methanol = Mind & Retina (Blindness, Putamen necrosis, Formate). Ethylene Glycol = End-stage Kidney & Oxalate crystals. Isopropanol = Ketones WITHOUT Acidosis.',
    pyqNote: 'Classic INI-CET question: High osmolar gap, positive ketones, but NORMAL anion gap and normal pH = Isopropanol poisoning.'
  },
  {
    id: 'pharyngeal-arches',
    num: 11,
    title: 'Embryology: Pharyngeal (Branchial) Arches Derivations',
    subject: 'Anatomy',
    summary: 'Cranial nerves, skeletal structures, muscles, and aortic arch arteries derived from arches 1 through 6.',
    tableHead: ['Arch', 'Cranial Nerve', 'Skeletal Cartilage & Bones', 'Muscles Derived'],
    tableRows: [
      ['1st Arch (Mandibular)', 'CN V3 (Mandibular division of Trigeminal)', 'Meckel cartilage → Malleus, Incus, Mandible, Sphenomandibular ligament', 'Muscles of mastication (Masseter, Temporalis, Medial/Lateral pterygoid), Mylohyoid, Anterior belly of digastric, Tensor tympani, Tensor veli palatini'],
      ['2nd Arch (Hyoid)', 'CN VII (Facial nerve)', 'Reichert cartilage → Stapes, Styloid process, Stylohyoid ligament, Lesser horn & upper body of Hyoid', 'Muscles of facial expression, Stapedius, Stylohyoid, Posterior belly of digastric'],
      ['3rd Arch', 'CN IX (Glossopharyngeal nerve)', 'Greater horn and lower body of Hyoid bone', 'Stylopharyngeus only'],
      ['4th Arch', 'CN X (Superior laryngeal nerve)', 'Thyroid cartilage, Cuneiform cartilage', 'Cricothyroid, Levator veli palatini, Pharyngeal constrictors'],
      ['6th Arch', 'CN X (Recurrent laryngeal nerve)', 'Cricoid, Arytenoid, Corniculate cartilages', 'All intrinsic muscles of larynx EXCEPT Cricothyroid'],
    ],
    discriminatorMnemonic: '1 = M (Mastication, Mandible, Malleus, Mylohyoid). 2 = S (Stapes, Styloid, Stapedius, Seven-CN VII). 3 = Stylopharyngeus (CN IX). 4 = Superior laryngeal. 6 = Recurrent laryngeal.',
    pyqNote: 'Malleus & Incus are 1st arch; Stapes is 2nd arch. Tensor tympani is 1st arch (V3); Stapedius is 2nd arch (VII).'
  },
  {
    id: 'porphyria-enzymes',
    num: 12,
    title: 'Heme Biosynthesis & Porphyrias',
    subject: 'Biochemistry / Dermatology',
    summary: 'Rate-limiting enzyme: ALAS-1 (feedback inhibited by heme/glucose). Cutaneous (blistering with sun) vs Neurovisceral (abdominal pain + psychosis).',
    tableHead: ['Porphyria Type', 'Deficient Enzyme', 'Accumulated Substrate', 'Clinical Picture'],
    tableRows: [
      ['Acute Intermittent Porphyria (AIP)', 'PBG Deaminase (HMB Synthase)', 'Porphobilinogen (PBG) & ALA', 'NO PHOTOSENSITIVITY! 5 Ps: Painful abdomen, Polyneuropathy, Psychosis, Port-wine urine (darkens on sunlight), Precipitated by drugs (CYP inducers)'],
      ['Porphyria Cutanea Tarda (PCT)', 'Uroporphyrinogen Decarboxylase (UROD)', 'Uroporphyrin (tea-colored urine)', 'MOST COMMON. Severe blistering cutaneous photosensitivity, hypertrichosis, associated with Hepatitis C and iron overload. Wood lamp coral-red urine.'],
      ['Congenital Erythropoietic (CEP / Gunther)', 'Uroporphyrinogen III Synthase', 'Uroporphyrin I & Coproporphyrin I', 'Severe mutilating photosensitivity from infancy, erythrodontia (red teeth fluorescing under UV), hemolytic anemia.'],
      ['Lead Poisoning', 'ALA Dehydratase & Ferrochelatase (zinc-dependent)', 'ALA & Protoporphyrin IX', 'Microcytic hypochromic anemia with basophilic stippling, Burton lines on gums, encephalopathy, colic.'],
    ],
    discriminatorMnemonic: 'AIP: Acute Abdomen, Mental, Neuropathy, NO skin lesions (PBG deaminase). PCT: Photosensitivity, Cutaneous blistering, Tea urine (UROD).',
    pyqNote: 'Treatment of AIP acute attack: IV Glucose (10% Dextrose) + IV Hemin (hematin), which downregulate ALAS-1.'
  },
  {
    id: 'parasite-eggs',
    num: 13,
    title: 'Parasitology: Stool Microscopy of Helminth Eggs',
    subject: 'Microbiology',
    summary: 'Morphology of ova is one of the highest yield image and text spotters in INI-CET.',
    tableHead: ['Helminth', 'Egg Morphology & Features', 'Diagnostic Characteristic'],
    tableRows: [
      ['Ascaris lumbricoides (Roundworm)', 'Bile-stained, brown, golden-yellow, rounded, with coarse outer mammillated albuminous coat; unfertilized eggs are longer and narrower', 'Corticated / mammillated thick shell'],
      ['Ancylostoma / Necator (Hookworm)', 'Non-bile stained, colourless, oval, transparent hyaline shell with clear space between shell and 4–8 segmenting blastomeres', 'Transparent shell with blastomeres + empty space'],
      ['Trichuris trichiura (Whipworm)', 'Bile-stained, barrel-shaped / Japanese lantern-shaped with prominent mucus plug at each pole', 'Barrel-shaped with bipolar plugs'],
      ['Enterobius vermicularis (Pinworm)', 'Non-bile stained, planoconvex (D-shaped), asymmetric with double-contoured shell containing folded tadpole-like larva', 'Planoconvex D-shaped; diagnosed by NIH cellophane tape swab, NOT stool'],
      ['Taenia solium vs saginata', 'Bile-stained, spherical, brown with thick radially striated embryophore containing hexacanth oncosphere (6 hooklets)', 'Radially striated cartwheel appearance (indistinguishable between species)'],
      ['Schistosoma haematobium', 'Non-bile stained, elongated with a sharp TERMINAL spine', 'Terminal spine (found in URINE, causes painless hematuria and squamous bladder cancer)'],
      ['Schistosoma mansoni', 'Non-bile stained, elongated with a prominent LATERAL spine', 'Lateral spine (found in stool, causes pipestem portal fibrosis)'],
      ['Schistosoma japonicum', 'Round/oval with small rudimentary lateral knob/spine', 'Rudimentary knob'],
      ['Clonorchis sinensis', 'Light brown, pitcher-shaped / flask-shaped with distinct operculum and small abopercular knob', 'Operculated with terminal knob ("seated lid")'],
    ],
    discriminatorMnemonic: 'Terminal spine = Haematobium. Lateral spine = Mansoni. Planoconvex D-shape = Pinworm. Barrel with bipolar plugs = Trichuris. Mammillated coat = Ascaris.',
    pyqNote: 'Pinworm eggs are rarely found in stool because the female migrates at night to lay eggs on the perianal skin. Test of choice: Scotch tape / NIH swab in early morning.'
  },
  {
    id: 'radiation-units',
    num: 14,
    title: 'Radiology & Radiation Physics Units & Limits',
    subject: 'Radiology',
    summary: 'SI vs Traditional radiation dosimetry units and statutory AERB (Atomic Energy Regulatory Board) occupational limits.',
    tableHead: ['Radiation Quantity', 'SI Unit', 'Traditional Unit', 'Conversion Formula'],
    tableRows: [
      ['Exposure (ionization in air)', 'Coulomb / kg (C/kg)', 'Roentgen (R)', '1 R = 2.58 × 10⁻⁴ C/kg'],
      ['Absorbed Dose (energy per mass)', 'Gray (Gy) [= 1 Joule/kg]', 'rad (radiation absorbed dose)', '1 Gy = 100 rad (1 rad = 0.01 Gy = 10 mGy)'],
      ['Equivalent / Effective Dose (biological effect)', 'Sievert (Sv) [= Gy × Wr]', 'rem (roentgen equivalent man)', '1 Sv = 100 rem (1 rem = 10 mSv = 0.01 Sv)'],
      ['Radioactivity (disintegrations/sec)', 'Becquerel (Bq) [= 1 dps]', 'Curie (Ci)', '1 Ci = 3.7 × 10¹⁰ Bq (37 GBq)'],
      ['Occupational Annual Dose Limit (AERB)', '20 mSv / year averaged over 5 consecutive years (max 30 mSv in any single year)', '—', 'Radiation workers with TLD badges'],
      ['Public Annual Dose Limit', '1 mSv / year', '—', 'General public limit'],
      ['Embryo / Fetus Dose Limit in Pregnant Worker', '1 mSv over remaining pregnancy period', '—', 'Once pregnancy is declared'],
    ],
    discriminatorMnemonic: 'Activity = Becquerel (Curie). Absorbed = Gray (Rad). Effective Biological = Sievert (Rem). Occupational limit = 20 mSv/yr.',
    pyqNote: 'AERB annual occupational limit for radiation workers is 20 mSv/year (max 30 mSv in any single year). Lens of eye limit = 20 mSv/yr.'
  },
  {
    id: 'visual-field-defects',
    num: 15,
    title: 'Neuro-Ophthalmology: Visual Pathway Field Defects',
    subject: 'Ophthalmology / Anatomy',
    summary: 'Localizing lesions along the visual pathway from optic nerve to primary visual cortex (Brodmann area 17).',
    tableHead: ['Lesion Site', 'Type of Visual Field Defect', 'Common Etiology & Distinctive Feature'],
    tableRows: [
      ['Optic Nerve', 'Ipsilateral monocular blindness / central scotoma', 'Optic neuritis (MS), central retinal artery occlusion (CRAO), optic glioma'],
      ['Optic Chiasm (Central / Decussating nasal fibers)', 'Bitemporal hemianopia', 'Pituitary adenoma (superior bitemporal first from below), Craniopharyngioma (inferior bitemporal from above)'],
      ['Optic Chiasm (Lateral compression of uncrossed fibers)', 'Binasal hemianopia (very rare)', 'Calcification/aneurysm of internal carotid arteries compressing lateral chiasm bilaterally'],
      ['Optic Tract', 'Contralateral incongruous homonymous hemianopia', 'Anterior choroidal artery stroke; Wernicke pupillary hemianopic light reflex present'],
      ['Meyer Loop (Temporal lobe / inferior optic radiation)', 'Contralateral Superior Quadrantanopia ("Pie in the sky")', 'Temporal lobectomy, MCA inferior division stroke'],
      ['Baum Loop (Parietal lobe / superior optic radiation)', 'Contralateral Inferior Quadrantanopia ("Pie on the floor")', 'Parietal lobe stroke (MCA superior division), glioblastoma'],
      ['Visual Cortex (Occipital lobe - PCA infarction)', 'Contralateral congruous homonymous hemianopia with MACULAR SPARING', 'PCA thrombosis; Macula is spared due to collateral blood supply from Middle Cerebral Artery (MCA)'],
    ],
    discriminatorMnemonic: 'Temporal lesion = Pie in the SKY (Superior). Parietal lesion = Pie on the FLOOR (Inferior). Occipital PCA = Macular Sparing. Chiasm = Bitemporal.',
    pyqNote: 'Pituitary adenoma grows UPWARDS into the chiasm → compresses inferior crossing fibers first → Bitemporal SUPERIOR quadrantanopia initially.'
  },
  {
    id: 'sleep-stages-eeg',
    num: 16,
    title: 'Sleep Architecture, EEG Waveforms & Sleep Disorders',
    subject: 'Physiology / Psychiatry',
    summary: 'NREM stages (N1, N2, N3) and REM sleep. Waveforms: Beta (awake alert) → Alpha (awake relaxed eyes closed) → Theta → Spindles → Delta.',
    tableHead: ['Sleep Stage', 'EEG Waveform & Characteristics', 'Physiological & Clinical Hallmarks'],
    tableRows: [
      ['Awake (Eyes Open, Alert)', 'Beta waves (13–30 Hz, highest frequency, lowest amplitude)', 'Active mental concentration'],
      ['Awake (Eyes Closed, Relaxed)', 'Alpha waves (8–13 Hz, posterior occipital dominance)', 'Disappears upon opening eyes'],
      ['NREM 1 (N1 - Light sleep)', 'Theta waves (4–7 Hz), disappearance of alpha rhythm', 'Hypnic jerks, easily aroused; 5% of sleep'],
      ['NREM 2 (N2 - Deeper sleep)', 'Sleep spindles (12–14 Hz bursts) + K-complexes (high voltage biphasic)', 'Largest percentage of total sleep time (~45–55%). Bruxism (teeth grinding) occurs here'],
      ['NREM 3 (N3 - Slow Wave / Deep sleep)', 'Delta waves (0.5–2 Hz, lowest frequency, highest amplitude > 75 µV)', 'Growth hormone secretion, sleep terrors, sleepwalking (somnambulism), night bedwetting (enuresis). Decreased in elderly/depression.'],
      ['REM (Rapid Eye Movement / Paradoxical)', 'Sawtooth waves, desynchronized beta-like mixed frequency', 'Dreaming, muscle atonia (paralysis), penile/clitoral tumescence, rapid conjugate eye movements. Variable heart rate/BP.'],
    ],
    discriminatorMnemonic: 'BATS Drink Blood: Beta (alert) → Alpha (relaxed) → Theta (N1) → Spindles & K-complexes (N2) → Delta (N3) → Beta (REM).',
    pyqNote: 'Sleep terrors and somnambulism occur in N3 (slow-wave sleep), NOT in REM! Nightmare disorder occurs in REM sleep and the child awakens with vivid recall.'
  },
  {
    id: 'tympanometry-graphs',
    num: 17,
    title: 'Audiology: Jerger Tympanometry Curve Classifications',
    subject: 'ENT',
    summary: 'Acoustic admittance / middle ear compliance as a function of ear canal pressure. Types A, As, Ad, B, C.',
    tableHead: ['Tympanogram Type', 'Compliance Peak & Pressure Location', 'Clinical Pathology & Diagnosis'],
    tableRows: [
      ['Type A (Normal)', 'Normal compliance peak (0.3–1.6 mL) centered at atmospheric pressure (-100 to +50 daPa)', 'Normal middle ear and intact eardrum'],
      ['Type As (Shallow / Stiff)', 'Normal pressure (near 0 daPa), but REDUCED / shallow peak compliance (< 0.3 mL)', 'Otosclerosis (stapes fixation), tympanosclerosis, thickened TM'],
      ['Type Ad (Deep / Disarticulation)', 'Normal pressure (near 0 daPa), but excessively HIGH / open compliance peak (> 1.7 mL)', 'Ossicular chain disruption / disarticulation (head trauma), flaccid monomeric TM'],
      ['Type B (Flat curve)', 'No discernible peak (flat line across all pressures)', 'Middle Ear Effusion (Serous Otitis Media / OME / Glue ear), TM perforation, or canal blocked with wax'],
      ['Type C (Negative Pressure)', 'Normal compliance amplitude, but peak shifted to significant NEGATIVE pressure (< -100 daPa)', 'Eustachian Tube Dysfunction, resolving otitis media, early OME'],
    ],
    discriminatorMnemonic: 'A = All normal; As = Stiff stapes (Otosclerosis); Ad = Disarticulated bones; B = Behind the TM is fluid (Glue ear); C = Closed Eustachian tube.',
    pyqNote: 'Carhart Notch is an audiometric dip at 2000 Hz (2 kHz) in bone conduction in otosclerosis (Type As tympanogram).'
  },
  {
    id: 'apgar-score',
    num: 18,
    title: 'Newborn Resuscitation: APGAR Score at 1 and 5 Minutes',
    subject: 'Pediatrics / Obstetrics',
    summary: 'Recorded at 1 min and 5 min after birth (and every 5 min up to 20 min if score < 7). Score 7-10 normal, 4-6 moderate depression, 0-3 severe depression.',
    tableHead: ['Parameter', '0 Points', '1 Point', '2 Points'],
    tableRows: [
      ['A - Appearance (Color)', 'Blue or pale all over (Cyanotic/pale)', 'Body pink, extremities blue (Acrocyanosis)', 'Completely pink all over'],
      ['P - Pulse (Heart Rate)', 'Absent', '< 100 beats/min', '≥ 100 beats/min'],
      ['G - Grimace (Reflex irritability)', 'No response / Flaccid', 'Grimace / weak cry on stimulation', 'Vigorous cry, cough or sneeze'],
      ['A - Activity (Muscle Tone)', 'Limp / Flaccid / No movement', 'Some flexion of arms and legs', 'Active movement / well flexed'],
      ['R - Respiration', 'Absent', 'Slow, irregular, weak gasp', 'Good strong cry, regular breathing'],
    ],
    discriminatorMnemonic: 'Acrocyanosis (pink body, blue hands/feet) gets 1 point and is physiological in normal newborns in the first 24 hours (giving a score of 9/10).',
    pyqNote: 'APGAR score is NOT used to guide newborn resuscitation steps! NRP resuscitation begins immediately based on Tone, Breathing, and Heart Rate.'
  },
  {
    id: 'minimum-alveolar-concentration',
    num: 19,
    title: 'Inhalational Anaesthetics: MAC & Blood-Gas Partition',
    subject: 'Anaesthesia',
    summary: 'MAC is inversely proportional to potency (Low MAC = high potency). Blood-gas solubility determines speed of induction (Low blood-gas = fast induction).',
    tableHead: ['Inhalational Agent', 'MAC Value (% atm)', 'Blood:Gas Partition Coefficient', 'Clinical High-Yield Anchor'],
    tableRows: [
      ['Methoxyflurane', '0.16% (MOST potent agent)', '12 (very slow)', 'Metabolized to fluoride ions → high-output nephrotoxicity'],
      ['Halothane', '0.75%', '2.4', 'Sweet smelling (pediatric mask induction); causes Halothane Hepatitis and sensitizes heart to catecholamines (arrhythmias)'],
      ['Isoflurane', '1.15%', '1.4', 'Standard neurosurgical agent; maintains cardiac output; coronary steal phenomenon in theory'],
      ['Sevoflurane', '2.0%', '0.65 (Fast)', 'Agent of choice for inhalational induction in kids (non-pungent, bronchodilator); degraded by soda lime to Compound A'],
      ['Desflurane', '6.0%', '0.42 (FASTER recovery)', 'Lowest blood:gas coefficient (fastest on/off); pungent (causes laryngospasm); requires special heated vaporizer (Tec 6)'],
      ['Nitrous Oxide (N2O)', '104% (LEAST potent, cannot produce anesthesia alone)', '0.47 (Fast)', 'Second gas effect, diffusion hypoxia (Fink effect); contraindicated in pneumothorax, bowel obstruction, air embolism'],
    ],
    discriminatorMnemonic: 'Potency: Methoxyflurane > Halothane > Isoflurane > Sevoflurane > Desflurane > N2O. Speed of induction: Desflurane > N2O > Sevoflurane > Isoflurane > Halothane.',
    pyqNote: 'Nitrous oxide expands air-filled closed cavities by diffusion (diffuses in 34 times faster than nitrogen leaves) → strictly contraindicated in pneumothorax, intestinal obstruction, and vitrectomy gas bubble.'
  },
  {
    id: 'cervical-cancer-figo',
    num: 20,
    title: 'Cervical Cancer FIGO 2018 Staging & Management',
    subject: 'OBGY / Oncology',
    summary: 'Revised 2018 staging allows imaging (MRI/CT/PET) and pathology. Node involvement upgrades directly to Stage IIIC.',
    tableHead: ['Stage', 'Definition & Extent of Disease', 'Primary Management'],
    tableRows: [
      ['Stage IA1', 'Microscopic stromal invasion < 3 mm depth (regardless of lateral spread)', 'Cone biopsy (if fertility desired) or Extrafascial / Simple hysterectomy'],
      ['Stage IA2', 'Microscopic stromal invasion ≥ 3 mm and < 5 mm depth', 'Modified radical hysterectomy + pelvic lymphadenectomy'],
      ['Stage IB1 / IB2', 'IB1: Clinically visible lesion < 2 cm; IB2: 2 cm to < 4 cm', 'Radical hysterectomy (Wertheim) + bilateral pelvic lymphadenectomy'],
      ['Stage IB3 / IIA2', 'IB3: Clinically visible lesion ≥ 4 cm; IIA2: Involves upper 2/3 vagina ≥ 4 cm', 'Concurrent Chemoradiation (CCRT: Cisplatin + External Beam RT + Brachytherapy)'],
      ['Stage IIB', 'Parametrial invasion (does NOT extend to pelvic sidewall)', 'Concurrent Chemoradiotherapy (CCRT). SURGERY IS CONTRAINDICATED once parametrium is involved!'],
      ['Stage IIIA / IIIB', 'IIIA: Lower 1/3 of vagina; IIIB: Extends to pelvic sidewall and/or causes hydronephrosis / non-functioning kidney', 'Concurrent Chemoradiation (CCRT)'],
      ['Stage IIIC', 'Pelvic or Para-aortic Lymph Node metastasis: IIIC1 = Pelvic nodes; IIIC2 = Para-aortic nodes', 'Chemoradiation with extended field if para-aortic positive'],
      ['Stage IVA / IVB', 'IVA: Invasion of bladder/rectal mucosa; IVB: Distant organ metastasis (lung, liver, bone)', 'IVA: Chemoradiation or Pelvic exenteration; IVB: Palliative systemic chemotherapy ± Bevacizumab'],
    ],
    discriminatorMnemonic: 'Parametrium involved (Stage IIB) = NO SURGERY → Concurrent Chemoradiation (Cisplatin + RT). Hydronephrosis = Stage IIIB.',
    pyqNote: 'Hydronephrosis or non-functioning kidney automatically places cervical cancer into Stage IIIB regardless of tumor size.'
  }
];
