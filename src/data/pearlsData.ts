export interface PearlContrastTable {
  title: string;
  head: string[];
  rows: string[][];
}

export interface PearlMedia {
  type: 'image' | 'video' | 'animation';
  url?: string;
  title: string;
  caption: string;
  credit?: string;
  badge?: string;
  simulationId?: string;
}

export interface PearlItem {
  id: string;
  num: number;
  title: string;
  subject: string;
  summary?: string;
  system: string;
  yield: 3 | 2 | 1;
  tags: string[]; // e.g. ['Next-Step', 'IOC', 'Gold-Standard', 'Emergency', 'Volatile', 'Image', 'DOC']
  anchor: string; // 30-second reflex clue
  highYieldSummary: string[];
  algorithm?: string;
  table?: PearlContrastTable;
  media?: PearlMedia[];
  trapAlert: string;
  whyOthersWrong: {
    distractor: string;
    reason: string;
  }[];
  clusterId?: string;
  pyqNotes: string;
  verifyGuideline?: string;
}

export const APEX_PEARLS: PearlItem[] = [
  {
    id: 'prl-abg-interpretation',
    num: 1,
    title: 'Arterial Blood Gas (ABG): Stepwise Mastery & Mixed Disorders',
    subject: 'Medicine',
    system: 'Critical Care / Nephrology',
    yield: 3,
    tags: ['Next-Step', 'Formula', 'Emergency'],
    anchor: 'Never look at pH alone. Always evaluate: Primary disorder → Expected compensation (Winter\'s) → Anion Gap (albumin-corrected) → Delta Ratio → Urine AG.',
    highYieldSummary: [
      '**Winter\'s formula** for metabolic acidosis: Expected PaCO₂ = (1.5 × [HCO₃⁻]) + 8 ± 2. If measured PaCO₂ > expected → Co-existing respiratory acidosis (e.g. tiring asthmatic). If measured < expected → Co-existing respiratory alkalosis.',
      '**Serum Anion Gap**: AG = Na⁺ − (Cl⁻ + HCO₃⁻). Normal is 12 ± 4. For every 1 g/dL albumin falls below 4.0, add 2.5 to the calculated AG.',
      '**Delta Ratio** = (Calculated AG − 12) / (24 − Measured HCO₃⁻). Ratio < 0.4: Pure NAGMA (diarrhea/RTA). Ratio 0.4–0.8: Mixed HAGMA + NAGMA. Ratio 0.8–2.0: Pure HAGMA (DKA, lactic acidosis). Ratio > 2.0: HAGMA + Metabolic Alkalosis (e.g. DKA with severe vomiting).',
      '**Urine Anion Gap (UAG)** = (UNa + UK) − UCl. Negative UAG = GI loss of HCO₃⁻ (diarrhea, normal renal excretion of NH₄⁺). Positive UAG = Renal tubular acidosis (Type 1 distal RTA, failure to excrete NH₄⁺).'
    ],
    algorithm: `Patient with abnormal blood gas
→ Check pH (<7.35 = Acidemia, >7.45 = Alkalemia)
  Primary Metabolic Acidosis (Low HCO₃⁻)?
    → Calculate Expected PaCO₂ via Winter's formula (1.5 × HCO₃⁻ + 8 ± 2)
    → Calculate Albumin-corrected Anion Gap: AG + 2.5 × (4 − Albumin)
      High Anion Gap (> 12)?
        → Check Delta Ratio = (AG − 12) / (24 − HCO₃⁻)
          > 2.0 → Mixed HAGMA + Metabolic Alkalosis
          < 0.8 → Mixed HAGMA + NAGMA
        → Check Osmolar Gap (> 10 = Methanol or Ethylene glycol)
      Normal Anion Gap (8–12)?
        → Check Urine Anion Gap: (UNa + UK) − UCl
          Negative (< 0) → Diarrhea (GI loss)
          Positive (> 0) → Distal RTA (Type 1)`,
    table: {
      title: 'Expected Compensations in Simple Acid-Base Disturbances',
      head: ['Disorder', 'Primary Change', 'Expected Secondary Compensation'],
      rows: [
        ['Metabolic Acidosis', '↓ HCO₃⁻', 'PaCO₂ = (1.5 × HCO₃⁻) + 8 ± 2 (Winter\'s)'],
        ['Metabolic Alkalosis', '↑ HCO₃⁻', 'PaCO₂ increases by 0.7 mmHg for every 1 mEq/L rise in HCO₃⁻'],
        ['Acute Respiratory Acidosis', '↑ PaCO₂', 'HCO₃⁻ increases by 1 mEq/L for every 10 mmHg rise in PaCO₂'],
        ['Chronic Respiratory Acidosis', '↑ PaCO₂', 'HCO₃⁻ increases by 3.5 to 4 mEq/L for every 10 mmHg rise in PaCO₂'],
        ['Acute Respiratory Alkalosis', '↓ PaCO₂', 'HCO₃⁻ decreases by 2 mEq/L for every 10 mmHg fall in PaCO₂'],
        ['Chronic Respiratory Alkalosis', '↓ PaCO₂', 'HCO₃⁻ decreases by 4 to 5 mEq/L for every 10 mmHg fall in PaCO₂'],
      ]
    },
    trapAlert: 'In a tachypneic asthmatic, a "normal" PaCO₂ (40 mmHg) is a MEDICAL EMERGENCY signaling respiratory muscle exhaustion and impending arrest. It should normally be < 30 mmHg due to hyperventilation.',
    whyOthersWrong: [
      { distractor: 'Normal PaCO₂ indicates the patient is stabilizing', reason: 'Tachypneic patient unable to maintain respiratory alkalosis indicates diaphragmatic exhaustion.' },
      { distractor: 'Pure HAGMA with delta ratio > 2.0', reason: 'Delta ratio > 2 indicates excess bicarbonate retention above the anion rise, diagnostic of concurrent metabolic alkalosis.' }
    ],
    clusterId: 'med-acid-base',
    pyqNotes: 'INI-CET Nov 2025, May 2026: Asked on hypoalbuminemia AG correction and Delta ratio in vomiting diabetic.',
    verifyGuideline: 'Harrison 21e Principles of Internal Medicine / Rose Clinical Physiology of Acid-Base'
  },
  {
    id: 'prl-acute-coronary-syndrome',
    num: 2,
    title: 'Acute Coronary Syndrome: Reperfusion Timing & Mechanical Catastrophes',
    subject: 'Medicine',
    system: 'Cardiology',
    yield: 3,
    tags: ['Next-Step', 'Emergency', 'IOC', 'Gold-Standard'],
    anchor: 'Ischemic chest pain + STE in 2 contiguous leads → Immediate reperfusion. Primary PCI is gold standard (FMC-to-device ≤ 90 min; or ≤ 120 min if transferred). If transfer delay > 120 min → Thrombolyse within 30 min.',
    highYieldSummary: [
      '**Reperfusion Strategy**: Primary PCI is superior to thrombolysis. Door-to-balloon ≤ 90 min (in PCI hospital) or ≤ 120 min (if transferred). If transfer time exceeds 120 min, give fibrinolysis within 30 min (door-to-needle), then transfer for routine pharmaco-invasive angiography within 2–24 hours.',
      '**NSTEMI / Unstable Angina**: Fibrinolysis is CONTRAINDICATED (increases mortality without benefit). Stratify via GRACE / TIMI score. High risk (GRACE > 140, refractory pain, hemodynamically unstable, acute HF, VT/VF) → Angiography < 2 hours.',
      '**Right Ventricular Infarct** (Inferior STEMI + hypotension + raised JVP + clear lungs): Preload dependent! Give IV Normal Saline bolus. STRICTLY AVOID nitrates, diuretics, and morphine.',
      '**Mechanical Complications (Day 3–7 post-MI)**:',
      '• Ventricular Septal Rupture (VSR): Harsh pansystolic murmur at left lower sternal border + oxygen step-up from RA to RV on Swan-Ganz catheter.',
      '• Papillary Muscle Rupture: Acute severe mitral regurgitation, apical pansystolic murmur radiating to axilla, pulmonary edema, giant "v" waves on PCWP; posteromedial papillary muscle supplied solely by PDA (RCA).',
      '• Free Wall Rupture: Sudden hemopericardium, cardiac tamponade, PEA arrest.'
    ],
    algorithm: `Chest Pain suggestive of ACS
→ 12-lead ECG within 10 minutes
  ST Elevation in ≥ 2 contiguous leads (or new LBBB / posterior MI)?
    YES (STEMI) → Aspirin 300 mg chewed + P2Y12 inhibitor + Heparin
      PCI available within 120 min? → Primary PCI (FMC-to-balloon ≤ 90 min)
      Transfer delay > 120 min? → Thrombolyse within 30 min → transfer within 2–24 h
    NO (NSTE-ACS) → Serial hs-Troponin + Antiplatelet + Anticoagulant
      Refractory pain, Shock, VT/VF, Acute pulmonary edema? → Invasive cath < 2 h
      GRACE score > 140 or positive troponin? → Invasive cath < 24 h
      Low risk → Elective stress test`,
    table: {
      title: 'Coronary Artery Territories & ECG Lead Mapping',
      head: ['Infarct Territory', 'Leads with ST Elevation', 'Culprit Occluded Artery'],
      rows: [
        ['Anteroseptal', 'V1 – V2', 'LAD (Septal branches)'],
        ['Anterior', 'V3 – V4', 'LAD (Diagonal branches)'],
        ['Anterolateral / Extensive', 'V1 – V6, I, aVL', 'Proximal Left Anterior Descending (LAD) / Left Main'],
        ['High Lateral', 'I, aVL', 'Left Circumflex (LCx) or Diagonal of LAD'],
        ['Inferior', 'II, III, aVF', 'Right Coronary Artery (RCA, 85%) or LCx'],
        ['Right Ventricular', 'V4R (≥ 1 mm elevation) with II, III, aVF', 'Proximal Right Coronary Artery (RCA)'],
        ['Posterior Wall', 'ST depression & tall broad R wave in V1–V3; STE in V7–V9', 'Posterior Descending Artery (LCx or RCA)'],
      ]
    },
    trapAlert: 'Day 4 post-inferior MI, patient develops sudden pulmonary edema and a new apical systolic murmur: The answer is Papillary Muscle Rupture (posteromedial papillary muscle has single blood supply from RCA). Do not confuse with VSR which has an oxygen step-up in RV.',
    whyOthersWrong: [
      { distractor: 'Thrombolyse NSTEMI if cath lab is > 3 hours away', reason: 'Fibrinolysis in NSTEMI is contraindicated as it dissolves non-occlusive mural thrombi without improving flow and carries high ICH risk.' },
      { distractor: 'Sublingual nitroglycerin for inferior MI with clear lung bases and BP 80/50', reason: 'Nitrates cause venodilation and reduce preload, triggering profound cardiovascular collapse in RV infarction.' }
    ],
    clusterId: 'med-acs',
    pyqNotes: 'INI-CET May 2026: Asked on oxygen step-up in VSR; Nov 2022: Drug NOT given in NSTEMI (Streptokinase).',
    verifyGuideline: 'ACC/AHA/SCAI ACS 2025 Guideline & ESC ACS Guidelines 2023'
  },
  {
    id: 'prl-stroke-acute-management',
    num: 3,
    title: 'Acute Ischemic Stroke: Thrombolysis, EVT & ASPECTS Scoring',
    subject: 'Medicine',
    system: 'Neurology',
    yield: 3,
    tags: ['Next-Step', 'Emergency', 'Gold-Standard'],
    anchor: 'Sudden neurological deficit with known Last Known Well (LKW). Step 1: Capillary blood glucose (rule out hypoglycemia). Step 2: Non-contrast CT (NCCT) brain to rule out hemorrhage. IV Thrombolysis window is ≤ 4.5 hours.',
    highYieldSummary: [
      '**Emergency Sequence**: ABC → Capillary glucose stat → NCCT brain without delay. If ischemic stroke and LKW ≤ 4.5 hours, assess for IV thrombolysis.',
      '**Blood Pressure Targets**: Before thrombolysis, BP must be < 185/110 mmHg. Use IV Labetalol (10–20 mg) or IV Nicardipine. After thrombolysis, keep BP < 180/105 mmHg for at least 24 hours to prevent hemorrhagic transformation.',
      '**Thrombolytic Dosing**: Tenecteplase (TNK) 0.25 mg/kg IV single bolus (maximum 25 mg) is now guideline-preferred over Alteplase (0.9 mg/kg, max 90 mg; 10% bolus over 1 min, 90% over 1 hour).',
      '**Mechanical Thrombectomy (Endovascular EVT)**: 0–6 hour window: Pre-stroke mRS 0–1, NIHSS ≥ 6, ASPECTS ≥ 6, and Large Vessel Occlusion (LVO) of terminal ICA or MCA-M1 on CTA. 6–24 hour extended window: Allowed with clinical-core mismatch (DAWN / DEFUSE-3 trials).',
      '**ASPECTS Score** (Alberta Stroke Programme Early CT Score): Total 10 points for MCA territory (C, L, IC, I, M1, M2, M3 at basal ganglia level; M4, M5, M6 at corona radiata level). Subtract 1 point for each region with hypodensity. Normal CT = 10. Cut-off for standard thrombectomy is ASPECTS ≥ 6.'
    ],
    algorithm: `Acute Focal Neurological Deficit
→ Check blood glucose stat (rule out < 50 mg/dL)
→ Immediate NCCT Head (+ CTA to detect Large Vessel Occlusion)
  Intracranial Hemorrhage present?
    YES → Stop stroke protocol → ICH pathway (reverse anticoagulants, lower BP)
    NO → Ischemic Stroke confirmed
      Within 4.5 hours of Last Known Well (LKW)?
        YES → Lower BP to < 185/110 mmHg with IV Labetalol → Give Tenecteplase 0.25 mg/kg (or Alteplase 0.9 mg/kg)
      Large Vessel Occlusion (ICA or M1) detected on CTA?
        YES (0–6 hours) → Activate Endovascular Thrombectomy (EVT) simultaneously (Bridging strategy)
        YES (6–24 hours) → Check Perfusion CT (DAWN/DEFUSE-3 mismatch) → EVT if core is small
      Not eligible for lysis? → Permissive hypertension up to 220/120 mmHg; Aspirin started at 24–48 hours`,
    table: {
      title: 'ASPECTS 10-Region Breakdown in MCA Territory',
      head: ['Level', 'Anatomical Region Codes', 'Earliest Early CT Signs'],
      rows: [
        ['Ganglionic Level (Basal Ganglia)', 'C (Caudate), L (Lentiform), IC (Internal Capsule), I (Insular Ribbon), M1 (Anterior MCA), M2 (Temporal MCA), M3 (Posterior MCA)', 'Loss of insular ribbon, blurring of lentiform nucleus, hyperdense MCA sign'],
        ['Supraganglionic Level (Corona Radiata)', 'M4 (Anterior cortex), M5 (Lateral cortex), M6 (Posterior cortex)', 'Loss of grey-white differentiation in frontoparietal cortex'],
      ]
    },
    trapAlert: 'Patient presents with acute hemiparesis at 2 hours, BP is 195/115 mmHg. Do NOT withhold thrombolysis or start immediate heparin. The next step is to administer IV Labetalol to lower BP below 185/110, then proceed with thrombolysis.',
    whyOthersWrong: [
      { distractor: 'Wait for Alteplase to work before transporting to cath lab for thrombectomy', reason: 'Bridging therapy means IVT and EVT proceed in parallel without waiting for clinical response, as LVO recanalization with IVT alone is < 30%.' },
      { distractor: 'Aggressively reduce BP to 120/80 in non-thrombolyzed acute stroke', reason: 'Premature BP reduction collapses collateral penumbral perfusion; permissive hypertension up to 220/120 is maintained in non-lysed patients.' }
    ],
    clusterId: 'med-stroke',
    pyqNotes: 'INI-CET 2026: Asked on contraindication to thrombolysis (BP > 185/110); ABCD2 score components.',
    verifyGuideline: 'AHA/ASA Guidelines for Early Management of Acute Ischemic Stroke (2019/2024 updates)'
  },
  {
    id: 'prl-shock-atls-resuscitation',
    num: 4,
    title: 'ATLS 10th Edition: Trauma Resuscitation, Shock Classes & Massive Transfusion',
    subject: 'Surgery',
    system: 'Trauma & Critical Care',
    yield: 3,
    tags: ['Next-Step', 'Emergency', 'Formula'],
    anchor: 'Primary Survey (ABCDE) with concurrent resuscitation. Massive Transfusion Protocol (MTP): 1:1:1 ratio of PRBC:FFP:Platelets. Tranexamic acid (TXA) 1 g IV within 3 hours.',
    highYieldSummary: [
      '**Hemorrhagic Shock Classification (ATLS 10th Edition)**:',
      '• Class I (< 15% blood loss, < 750 mL): Normal HR, normal BP, normal pulse pressure, minimal anxiety.',
      '• Class II (15–30%, 750–1500 mL): Tachycardia (HR > 100), normal SBP, DECREASED pulse pressure, tachypnea (RR 20–30).',
      '• Class III (31–40%, 1500–2000 mL): Marked tachycardia (HR > 120), HYPOTENSION (drop in SBP), tachypnea (RR 30–40), marked oliguria (5–15 mL/h), confused.',
      '• Class IV (> 40%, > 2000 mL): Severe tachycardia (HR > 140), profound hypotension, narrow pulse pressure, anuria, lethargic/unconscious.',
      '**Pulse Pressure**: Decreased pulse pressure is the EARLIEST sign of Class II shock (before systolic BP falls due to compensatory peripheral vasoconstriction).',
      '**Massive Transfusion Protocol (MTP)**: Defined as ≥ 10 units PRBCs in 24 hours or ≥ 4 units in 1 hour. Given in balanced 1:1:1 ratio (1 PRBC : 1 FFP : 1 Platelet pack). Initiate TXA 1 g IV over 10 min, followed by 1 g infusion over 8 hours (CRASH-2 trial: mortality benefit only if given within 3 hours).',
      '**Lethal Triad in Trauma**: Hypothermia (< 35°C), Acidosis (pH < 7.2), Coagulopathy. Damage control surgery (DCS) is mandated when the triad emerges.'
    ],
    algorithm: `Polytrauma / Unstable Blunt Trauma
→ Primary Survey (Airway with cervical spine protection → Breathing → Circulation)
  Hypotensive (SBP < 90 mmHg)?
    → Immediate eFAST (extended Focused Assessment with Sonography for Trauma)
      Peritoneal free fluid on eFAST + Hemodynamically unstable?
        → Immediate Exploratory Laparotomy (Do NOT send for CT!)
      Negative eFAST + Pelvic fracture suspected?
        → Apply pelvic binder at level of greater trochanters
    → Activate Massive Transfusion Protocol (1:1:1 ratio)
    → Tranexamic Acid (TXA) 1 g IV if within 3 hours of trauma
    → Warm all resuscitation fluids to 39°C to prevent lethal triad`,
    table: {
      title: 'ATLS 10th Edition Classification of Hemorrhagic Shock',
      head: ['Parameter', 'Class I (<15%)', 'Class II (15–30%)', 'Class III (31–40%)', 'Class IV (>40%)'],
      rows: [
        ['Blood Loss (mL)', '< 750 mL', '750 – 1500 mL', '1500 – 2000 mL', '> 2000 mL'],
        ['Heart Rate (bpm)', '< 100', '100 – 120', '120 – 140', '> 140'],
        ['Blood Pressure', 'Normal', 'Normal', 'DECREASED', 'Severely Decreased'],
        ['Pulse Pressure', 'Normal', 'DECREASED', 'Decreased', 'Extremely Narrow'],
        ['Respiratory Rate', '14 – 20', '20 – 30', '30 – 40', '> 35'],
        ['Urine Output (mL/h)', '> 30 mL/h', '20 – 30 mL/h', '5 – 15 mL/h', 'Negligible / Anuric'],
        ['Mental Status', 'Slightly anxious', 'Mildly anxious', 'Anxious, confused', 'Confused, lethargic'],
        ['Initial Fluid Therapy', 'Crystalloid', 'Crystalloid', 'Crystalloid + Blood', 'Massive Transfusion (1:1:1)'],
      ]
    },
    trapAlert: 'An unstable trauma patient with free fluid in Morison\'s pouch must NEVER be taken to the CT scanner ("Death in the CT scanner"). The definitive next step is immediate transfer to the Operating Room for laparotomy.',
    whyOthersWrong: [
      { distractor: 'Contrast-enhanced CT abdomen for hypotensive blunt trauma with positive FAST', reason: 'CT requires transportation of an unstable patient who may arrest; positive FAST in shock mandates immediate operating room transfer.' },
      { distractor: 'Infuse large volumes of cold normal saline (3–4 liters)', reason: 'Causes hyperchloremic metabolic acidosis, hypothermia, and dilution coagulopathy (the lethal triad).' }
    ],
    clusterId: 'surg-atls-thoracic',
    pyqNotes: 'INI-CET 2026: Earliest sign of Class II shock (Decreased pulse pressure); CRASH-2 TXA window.',
    verifyGuideline: 'American College of Surgeons ATLS 10th Edition (2018/2023 Update)'
  },
  {
    id: 'prl-cervical-cancer-figo',
    num: 5,
    title: 'Cervical Cancer FIGO 2018 Staging, Screening & Management Boundaries',
    subject: 'OBGY',
    system: 'Gynaecological Oncology',
    yield: 3,
    tags: ['Gold-Standard', 'Volatile', 'IOC'],
    anchor: 'Parametrial invasion = Stage IIB. The golden rule: Surgery is CONTRAINDICATED in Stage IIB onwards. All Stage IIB to IVA patients receive Concurrent Chemoradiotherapy (CCRT).',
    highYieldSummary: [
      '**FIGO 2018 Revision**: Allows imaging (MRI/CT/PET) and pathological findings to assign stage. Lymph node involvement automatically classifies as Stage IIIC (IIIC1 = Pelvic lymph nodes; IIIC2 = Para-aortic lymph nodes).',
      '**Stage IA vs IB Cutoffs**:',
      '• IA1: Stromal invasion < 3 mm depth → Simple extrafascial hysterectomy (or Cone biopsy if fertility desired).',
      '• IA2: Stromal invasion ≥ 3 mm and < 5 mm depth → Modified radical hysterectomy + pelvic lymphadenectomy.',
      '• IB1: Clinically visible lesion < 2 cm → Radical hysterectomy (Wertheim) + bilateral pelvic lymphadenectomy.',
      '• IB2: Lesion 2 cm to < 4 cm → Radical hysterectomy.',
      '• IB3: Lesion ≥ 4 cm → Concurrent Chemoradiation (CCRT: External beam radiotherapy + Cisplatin + Brachytherapy).',
      '**Stage IIA vs IIB Boundary**:',
      '• IIA1: Upper 2/3 of vagina involved, < 4 cm → Radical hysterectomy.',
      '• IIA2: Upper 2/3 of vagina involved, ≥ 4 cm → CCRT.',
      '• IIB: Parametrial invasion (does not reach pelvic wall) → CCRT. SURGERY IS STRICTLY CONTRAINDICATED!',
      '**Stage IIIB**: Extension to pelvic sidewall and/or causes HYDRONEPHROSIS or non-functioning kidney (automatically IIIB regardless of tumor size).'
    ],
    algorithm: `Cervical Cancer Staging & Treatment Selection
→ Biopsy confirms invasive carcinoma → Pelvic MRI to assess parametrium & nodes
  Stage IA1 (< 3 mm depth)?
    → Fertility desired: Cone biopsy with negative margins
    → Fertility completed: Simple / Extrafascial Hysterectomy
  Stage IA2 (3–5 mm depth) to IB2 (< 4 cm)?
    → Radical Hysterectomy (Wertheim-Meigs) + Pelvic Lymphadenectomy
  Stage IIB (Parametrial invasion) up to IVA (Bladder/Rectal mucosa)?
    → SURGERY IS CONTRAINDICATED
    → Definitive Concurrent Chemoradiotherapy (CCRT: Cisplatin + EBRT + Intracavitary Brachytherapy)
  Stage IVB (Distant metastases)?
    → Systemic Palliative Chemotherapy (Paclitaxel + Cisplatin/Carboplatin + Bevacizumab)`,
    table: {
      title: 'FIGO 2018 Staging Summary & Definitive Management',
      head: ['Stage', 'Clinical / Imaging Definition', 'Primary Management Modality'],
      rows: [
        ['IA1', 'Microscopic depth < 3 mm', 'Cone biopsy (fertility) or Simple Hysterectomy'],
        ['IA2', 'Microscopic depth 3 mm to < 5 mm', 'Modified radical hysterectomy + lymphadenectomy'],
        ['IB1 / IB2', 'IB1: < 2 cm; IB2: 2 cm to < 4 cm', 'Radical Hysterectomy + Pelvic lymphadenectomy'],
        ['IB3 / IIA2', 'IB3: ≥ 4 cm confined to cervix; IIA2: Vagina upper 2/3 ≥ 4 cm', 'Concurrent Chemoradiotherapy (CCRT)'],
        ['IIB', 'Parametrial invasion (not reaching pelvic wall)', 'CCRT (Surgery contraindicated)'],
        ['IIIA / IIIB', 'IIIA: Lower 1/3 vagina; IIIB: Pelvic wall or Hydronephrosis', 'CCRT'],
        ['IIIC1 / IIIC2', 'IIIC1: Pelvic lymph node (+); IIIC2: Para-aortic lymph node (+)', 'CCRT (extended field RT for IIIC2)'],
        ['IVA / IVB', 'IVA: Bladder/rectum mucosa; IVB: Distant metastases', 'IVA: CCRT or Pelvic exenteration; IVB: Palliative Chemo + Bevacizumab'],
      ]
    },
    trapAlert: 'Hydronephrosis on ultrasound in cervical cancer automatically upgrades the tumor to Stage IIIB, even if the primary cervical lesion on speculum is under 2 cm! Management is CCRT.',
    whyOthersWrong: [
      { distractor: 'Wertheim radical hysterectomy for Stage IIB cervical cancer', reason: 'Parametrial involvement makes clear surgical margins impossible; surgery increases morbidity and recurrence compared to primary chemoradiation.' },
      { distractor: 'Stage IIIC requires immediate exploratory debulking laparotomy', reason: 'Lymph node positive cervical cancer is treated with concurrent systemic cisplatin and radiation, not primary cytoreductive surgery.' }
    ],
    clusterId: 'obg-cervix-screening-ca',
    pyqNotes: 'INI-CET Nov 2022, 2026: Asked on hydronephrosis upgrading to Stage IIIB; contraindication to surgery in IIB.',
    verifyGuideline: 'FIGO Committee on Gynecologic Oncology Staging 2018 & NCCN Cervical Cancer Guidelines 2024'
  },
  {
    id: 'prl-psm-biostatistics-screening',
    num: 6,
    title: 'Biostatistics: Screening Tests, Sensitivity, Specificity, PPV & ROC Curves',
    subject: 'Community Medicine',
    system: 'Epidemiology & Biostatistics',
    yield: 3,
    tags: ['Formula', 'Volatile', 'Next-Step'],
    anchor: 'Sensitivity and Specificity are INHERENT properties of the test and DO NOT change with disease prevalence. Positive Predictive Value (PPV) INCREASES with prevalence; NPV DECREASES with prevalence.',
    highYieldSummary: [
      '**2×2 Contingency Matrix**:',
      '• Sensitivity (True Positive Rate) = a / (a + c). Identifies true diseased individuals. High sensitivity test used for SCREENING (Rule OUT disease if negative → SNOUT).',
      '• Specificity (True Negative Rate) = d / (b + d). Identifies healthy individuals. High specificity test used for CONFIRMATION (Rule IN disease if positive → SPIN).',
      '• False Positive Rate (α, Type I error) = 1 − Specificity = b / (b + d).',
      '• False Negative Rate (β, Type II error) = 1 − Sensitivity = c / (a + c).',
      '• Power of a study = 1 − β = Probability of detecting a true difference.',
      '**Prevalence Effect on Predictive Values**:',
      '• As Prevalence ↑ : Positive Predictive Value (PPV) ↑, Negative Predictive Value (NPV) ↓.',
      '• As Prevalence ↓ : PPV ↓, NPV ↑.',
      '**Receiver Operating Characteristic (ROC) Curve**:',
      '• Plot: True Positive Rate (Sensitivity, Y-axis) vs False Positive Rate (1 − Specificity, X-axis).',
      '• Area Under the Curve (AUC): 1.0 = Perfect test; 0.5 = Diagnostic coin-flip (worthless); Area > 0.85 = Excellent test.'
    ],
    table: {
      title: 'The Master 2×2 Diagnostic Table',
      head: ['Test Result', 'Disease Present', 'Disease Absent', 'Total Row'],
      rows: [
        ['Positive Test (+)', 'a (True Positive)', 'b (False Positive)', 'a + b (Total Test Positive)'],
        ['Negative Test (−)', 'c (False Negative)', 'd (True Negative)', 'c + d (Total Test Negative)'],
        ['Total Column', 'a + c (Total Diseased)', 'b + d (Total Healthy)', 'a + b + c + d (Total N)'],
        ['Formula', 'Sensitivity = a / (a+c)', 'Specificity = d / (b+d)', 'Prevalence = (a+c) / N'],
      ]
    },
    trapAlert: 'If an exam question states: "A test is moved from a tertiary hospital (high prevalence) to a rural community screening (low prevalence). Which metric increases?" The answer is Negative Predictive Value (NPV)! Sensitivity and Specificity remain unchanged.',
    whyOthersWrong: [
      { distractor: 'Sensitivity increases when prevalence increases', reason: 'Sensitivity is an inherent biological trait of the assay (ability to detect antigen/antibody) independent of population disease frequency.' },
      { distractor: 'ROC curve X-axis plots False Negative rate', reason: 'X-axis plots False Positive rate (1 - Specificity); Y-axis plots True Positive rate (Sensitivity).' }
    ],
    clusterId: 'psm-screening-bias-studies',
    pyqNotes: 'INI-CET May 2026: Asked on ROC curve axis labels; impact of disease prevalence on PPV.',
    verifyGuideline: 'Park\'s Textbook of Preventive and Social Medicine 27th Edition'
  },
  {
    id: 'prl-toxic-alcohols-antidotes',
    num: 7,
    title: 'Toxicology: Alcohols, Toxidromes & High-Yield Antidotes',
    subject: 'Forensic Medicine',
    system: 'Medical Toxicology',
    yield: 3,
    tags: ['Emergency', 'DOC', 'Formula'],
    anchor: 'High Anion Gap Acidosis + High Osmolar Gap (> 10) = Methanol or Ethylene Glycol. Methanol = Optic neuritis (snowfield blindness) + Putaminal necrosis. Ethylene Glycol = Oxalate crystals in urine + Acute kidney injury. DOC for both is Fomepizole.',
    highYieldSummary: [
      '**Methanol**: Metabolized by alcohol dehydrogenase to Formaldehyde → Formic acid (toxic metabolite that halts cytochrome oxidase). Hallmark: Visual symptoms ("walking in a snowstorm"), retinal edema, hyperemic disc, bilateral symmetrical putaminal necrosis/hemorrhage. Treatment: Fomepizole (DOC) or Ethanol infusion + Folic/Folinic acid (accelerates formate clearance) + Hemodialysis.',
      '**Ethylene Glycol**: Metabolized to Glycolic acid and Oxalic acid. Hallmark: Calcium oxalate monohydrate (dumbbell/envelope) crystals in urine, flank pain, acute tubular necrosis, hypocalcemia (tetany/QT prolongation). Treatment: Fomepizole + Pyridoxine (B6) + Thiamine (B1) + Hemodialysis.',
      '**Isopropanol (Rubbing alcohol)**: Metabolized to Acetone. Hallmark: KETOSIS WITHOUT ACIDOSIS (normal anion gap, normal pH, positive serum/urine ketones). Fomepizole is NOT indicated.'
    ],
    table: {
      title: 'Top 10 High-Yield Antidote Master Table',
      head: ['Poison / Toxin', 'Mechanism of Toxicity', 'Specific Antidote of Choice (DOC)'],
      rows: [
        ['Methanol / Ethylene Glycol', 'Inhibition of cellular respiration by acid metabolites', 'Fomepizole (4-methylpyrazole) > Ethanol'],
        ['Paracetamol (Acetaminophen)', 'NAPQI accumulation depleting glutathione', 'N-Acetylcysteine (NAC) [Give within 8 hours for 100% hepatoprotection]'],
        ['Organophosphates (OP)', 'Irreversible acetylcholinesterase inhibition', 'Atropine (titrate to clear chest secretions) + Pralidoxime (2-PAM)'],
        ['Cyanide', 'Binds Fe³⁺ in Cytochrome c oxidase', 'Hydroxocobalamin (DOC) or Sodium nitrite + Sodium thiosulfate'],
        ['Carbon Monoxide (CO)', 'Carboxyhemoglobin formation (affinity 240× of O₂)', '100% Normobaric Oxygen (t½ 80 min) or Hyperbaric Oxygen (HBO, t½ 23 min)'],
        ['β-Blockers', 'Myocardial depression & refractory bradycardia', 'High-dose IV Glucagon (bypasses β-receptors via cAMP) + High-dose Insulin euglycemia (HIE)'],
        ['Calcium Channel Blockers (CCB)', 'Inhibition of L-type voltage-gated Ca channels', 'IV Calcium gluconate + High-dose Insulin Euglycemia therapy (HIET) + Lipid emulsion'],
        ['Digoxin', 'Na⁺/K⁺-ATPase pump inhibition → Hyperkalemia', 'Digoxin-specific Fab fragments (DigiFab)'],
        ['Iron (Ferrous sulfate)', 'Cellular free radical generation and shock', 'IV Deferoxamine (urine turns "vin rose" color)'],
        ['Heparin vs Warfarin', 'Antithrombin III activation / Vitamin K epoxide inhibition', 'Heparin: Protamine sulfate (1 mg per 100 U). Warfarin: 4-factor Prothrombin Complex Concentrate (4F-PCC) + IV Vitamin K'],
      ]
    },
    trapAlert: 'In Organophosphate poisoning, NEVER titrate Atropine to pupillary dilatation (mydriasis) or heart rate! The primary endpoint of atropinization is CLEARING OF BRONCHIAL SECRETIONS AND DRY AXILLAE.',
    whyOthersWrong: [
      { distractor: 'Pralidoxime is given before atropine in severe OP poisoning', reason: 'Atropine is the lifesaving drug for muscarinic bronchospasm and must be given immediately; pralidoxime reverses nicotinic weakness and is secondary.' },
      { distractor: 'Fomepizole is indicated for isopropanol ingestion', reason: 'Isopropanol metabolizes to acetone, which causes benign ketosis without metabolic acidosis; fomepizole offers no clinical benefit.' }
    ],
    clusterId: 'med-toxicology',
    pyqNotes: 'INI-CET May 2026, 2022: Repeated on Fomepizole indication, Putaminal necrosis in methanol, and Vin rose urine with deferoxamine.',
    verifyGuideline: 'Goldfrank\'s Toxicologic Emergencies 11th Edition / Extrip Workgroup Hemodialysis in Poisoning'
  },
  {
    id: 'prl-inborn-errors-metabolism',
    num: 8,
    title: 'Pediatric Inborn Errors of Metabolism: Lysosomal Storage & Glycogen Storage',
    subject: 'Biochemistry',
    summary: 'Distinguish Tay-Sachs from Niemann-Pick by hepatosplenomegaly. Distinguish Von Gierke from Pompe by cardiomegaly and lactic acidosis.',
    system: 'Genetics & Metabolic Disorders',
    yield: 3,
    tags: ['Gold-Standard', 'Image', 'Volatile'],
    anchor: 'Cherry-red spot + NO hepatosplenomegaly = Tay-Sachs (Hexosaminidase A). Cherry-red spot + HEPATOSPLENOMEGALY = Niemann-Pick (Sphingomyelinase). Crumpled tissue paper macrophages = Gaucher (Glucocerebrosidase).',
    highYieldSummary: [
      '**Sphingolipidoses / Lysosomal Storage Diseases (LSD)**:',
      '• Tay-Sachs Disease: Deficient Hexosaminidase A (accumulates GM2 ganglioside). Neurodegeneration, hyperacusis (startle response), cherry-red spot in macula, ABSENCE of organomegaly, onion-skin lysosomes on EM.',
      '• Niemann-Pick Disease: Deficient Sphingomyelinase (accumulates sphingomyelin). Neurodegeneration, cherry-red spot, PROMINENT HEPATOSPLENOMEGALY, zebra bodies on EM, foamy histiocytes.',
      '• Gaucher Disease: Deficient β-Glucocerebrosidase (accumulates glucocerebroside). Most common LSD! Hepatosplenomegaly, pancytopenia, aseptic bone necrosis (Erlenmeyer flask deformity of distal femur). Gaucher cells: macrophages with "crumpled tissue paper" cytoplasm.',
      '• Fabry Disease: X-linked recessive! Deficient α-galactosidase A (accumulates ceramide trihexoside). Angiokeratomas, burning acroparesthesias, hypohidrosis, renal failure, hypertrophic cardiomyopathy.',
      '**Glycogen Storage Diseases (GSD)**:',
      '• Type I (Von Gierke): Glucose-6-Phosphatase deficiency. Severe fasting hypoglycemia, massive hepatomegaly (normal spleen!), lactic acidosis, hyperuricemia (gout), doll-like cherubic face.',
      '• Type II (Pompe): Lysosomal Acid α-Glucosidase (acid maltase). Cardiomegaly (hypertrophic cardiomyopathy), heart failure, hypotonia ("floppy infant"), glycogen accumulation in lysosomes; normal blood glucose!',
      '• Type V (McArdle): Muscle Glycogen Phosphorylase (myophosphorylase). Painful exercise-induced muscle cramps, myoglobinuria (burgundy urine), second-wind phenomenon, flat venous lactate curve with normal ammonia rise during ischemic forearm exercise test.'
    ],
    table: {
      title: 'Lysosomal Storage Diseases Discriminator Matrix',
      head: ['Disease', 'Deficient Enzyme', 'Accumulated Substrate', 'Key Discriminator Features'],
      rows: [
        ['Tay-Sachs', 'Hexosaminidase A', 'GM2 Ganglioside', 'Cherry-red spot, Hyperacusis, NO Organomegaly'],
        ['Niemann-Pick', 'Sphingomyelinase', 'Sphingomyelin', 'Cherry-red spot, Hepatosplenomegaly, Foamy cells'],
        ['Gaucher (Type 1)', 'β-Glucocerebrosidase', 'Glucocerebroside', 'Crumpled paper histiocytes, Erlenmeyer flask femur, Pancytopenia'],
        ['Fabry (XLR)', 'α-Galactosidase A', 'Ceramide trihexoside', 'Angiokeratomas, Acroparesthesias, Renal failure'],
        ['Krabbe', 'Galactocerebrosidase', 'Galactocerebroside', 'Globoid cells, Optic atrophy, Peripheral neuropathy'],
        ['Hunter (MPS II, XLR)', 'Iduronate-2-sulfatase', 'Heparan & Dermatan sulfate', 'Coarse facial features, Aggressive behavior, NO corneal clouding'],
        ['Hurler (MPS I, AR)', 'α-L-Iduronidase', 'Heparan & Dermatan sulfate', 'Coarse facial features, Gargoylism, CORNEAL CLOUDING present'],
      ]
    },
    trapAlert: 'Hunter vs Hurler: Hunter syndrome is X-Linked Recessive and has CLEAR CORNEAS (no clouding) with aggressive behavior ("The hunter needs clear eyes to shoot"). Hurler has corneal clouding.',
    whyOthersWrong: [
      { distractor: 'Niemann-Pick is characterized by normal liver and spleen', reason: 'Sphingomyelin accumulates heavily in reticuloendothelial macrophages of liver and spleen, causing marked hepatosplenomegaly.' },
      { distractor: 'Von Gierke disease causes cardiomegaly and heart failure', reason: 'Cardiomegaly is characteristic of Pompe disease (Type II GSD, lysosomal acid maltase); Von Gierke has severe lactic acidosis and hepatomegaly.' }
    ],
    clusterId: 'bio-lsd-gsd',
    pyqNotes: 'INI-CET 2026: Asked on Erlenmeyer flask deformity in Gaucher; Cherry-red spot with vs without organomegaly.',
    verifyGuideline: 'Nelson Textbook of Pediatrics 22nd Edition / Harrison\'s Principles of Internal Medicine'
  },
  {
    id: 'prl-nephritic-nephrotic-glomerulopathies',
    num: 9,
    title: 'Glomerulonephritis: Electron Microscopy Deposits, Complement Levels & Light Microscopy',
    subject: 'Pathology',
    system: 'Renal Pathology',
    yield: 3,
    tags: ['Gold-Standard', 'Image', 'Volatile'],
    anchor: 'Subepithelial "humps" = PSGN. Subepithelial "spikes" = Membranous Nephropathy. Subendothelial deposits = MPGN Type 1 / Lupus Nephritis Class IV. Tram-track splitting = MPGN. Low Complement = PSGN, MPGN, Lupus.',
    highYieldSummary: [
      '**Nephrotic Glomerulopathies**:',
      '• Minimal Change Disease (MCD): Normal light microscopy; EM shows diffuse effacement of visceral epithelial foot processes (podocytes); selective proteinuria; DOC: Oral Prednisolone.',
      '• Focal Segmental Glomerulosclerosis (FSGS): Segmental sclerosis/hyalinosis; non-selective proteinuria; HIV, heroin, sickle cell; effacement of podocytes; poor response to steroids.',
      '• Membranous Nephropathy (MN): Diffuse capillary wall thickening; Silver methenamine stain shows "Spike and Dome" subepithelial IgG/C3 deposits; PLA2R antibody in primary MN.',
      '**Nephritic Glomerulopathies**:',
      '• Post-Streptococcal GN (PSGN): Hypercellular glomeruli with neutrophils; IF: "Starry sky" / granular IgG + C3; EM: Large dome-shaped subepithelial electron-dense HUMPS; Low C3, normal C4.',
      '• Membranoproliferative GN (MPGN): Mesangial hypercellularity + double-contour "tram-track" GBM splitting (silver stain); Type 1: Subendothelial deposits (HCV-associated); Type 2 (Dense Deposit): C3 nephritic factor (intramembranous ribbon dense deposits).',
      '• Rapidly Progressive GN (RPGN): Crescent formation in Bowman\'s space composed of parietal epithelial cells and monocytes/macrophages + fibrin.'
    ],
    table: {
      title: 'Glomerular Disease Discriminator Table: Deposits, Complement & Immunofluorescence',
      head: ['Disease', 'Deposit Location (EM)', 'Serum Complement (C3/C4)', 'Pathognomonic IF Pattern'],
      rows: [
        ['PSGN', 'Subepithelial HUMPS', 'Low C3 (Normal C4)', 'Lumpy-bumpy / Starry-sky granular IgG/C3'],
        ['Membranous Nephropathy', 'Subepithelial SPIKE and dome', 'Normal C3/C4', 'Diffuse granular capillary wall IgG & C3'],
        ['MPGN Type 1', 'Subendothelial deposits', 'Low C3 & Low C4', 'Granular C3 & IgG, lobular appearance'],
        ['MPGN Type 2 (Dense Deposit)', 'Intramembranous dense ribbons', 'Persistent Low C3 (C3NeF)', 'Ribbon-like linear C3 staining alone'],
        ['Goodpasture (Anti-GBM)', 'No discrete aggregates', 'Normal C3/C4', 'Smooth LINEAR IgG along GBM'],
        ['IgA Nephropathy (Berger)', 'Mesangial deposits', 'Normal C3/C4', 'Mesangial IgA granular staining'],
      ]
    },
    trapAlert: 'Linear IF staining = Anti-GBM (Goodpasture disease, type II hypersensitivity). Granular IF staining = Immune-complex mediated (PSGN, Membranous, MPGN, Lupus, type III hypersensitivity). Never confuse linear with granular.',
    whyOthersWrong: [
      { distractor: 'Goodpasture presents with granular immune complexes on immunofluorescence', reason: 'Anti-GBM antibodies bind directly to the alpha-3 chain of Type IV collagen uniformly, resulting in a smooth continuous LINEAR pattern.' },
      { distractor: 'Minimal change disease shows extensive subendothelial immune deposition', reason: 'MCD has NO immune deposits on EM or IF; it features purely diffuse foot process effacement.' }
    ],
    clusterId: 'path-renal-glomerular',
    pyqNotes: 'INI-CET Nov 2024, May 2026: Asked on Subepithelial humps in PSGN vs spikes in Membranous; Complement levels in MPGN.',
    verifyGuideline: 'Robbins & Cotran Pathologic Basis of Disease 10th Edition'
  },
  {
    id: 'prl-sepsis3-shock-bundle',
    num: 10,
    title: 'Sepsis-3 Guidelines: SOFA vs qSOFA, Septic Shock & Hour-1 Bundle',
    subject: 'Medicine',
    system: 'Critical Care Medicine',
    yield: 3,
    tags: ['Emergency', 'Gold-Standard', 'Formula'],
    anchor: 'Sepsis = Life-threatening organ dysfunction caused by a dysregulated host response to infection (SOFA score increase ≥ 2 points). Septic Shock = Sepsis requiring vasopressors to maintain MAP ≥ 65 mmHg AND serum lactate > 2 mmol/L despite fluid resuscitation.',
    highYieldSummary: [
      '**qSOFA (Bedside Quick Screen, ≥ 2 is high risk)**: HAT mnemonic: Hypotension (SBP ≤ 100 mmHg), Altered mental status (GCS < 15), Tachypnea (RR ≥ 22/min).',
      '**Surviving Sepsis Campaign Hour-1 Bundle** (Initiate immediately within 1 hour):',
      '1. Measure blood lactate level (remeasure if initial lactate > 2 mmol/L).',
      '2. Obtain blood cultures PRIOR to administering antibiotics.',
      '3. Administer broad-spectrum IV antimicrobials (within 1 hour).',
      '4. Rapid fluid resuscitation: 30 mL/kg balanced crystalloids (Plasma-Lyte / Ringer Lactate) for hypotension or lactate ≥ 4 mmol/L.',
      '5. Apply vasopressors if hypotensive during or after fluid resuscitation to maintain MAP ≥ 65 mmHg. First-line vasopressor is NORADRENALINE (Norepinephrine).',
      '6. Second-line vasopressor: Vasopressin (0.03 units/min fixed dose) added to Norepinephrine (not titrated alone).',
      '7. Refractory septic shock: IV Hydrocortisone 200 mg/day if hemodynamics remain unstable despite high-dose norepinephrine and vasopressin.'
    ],
    table: {
      title: 'SOFA Organ Systems & Sepsis Severity Criteria',
      head: ['Organ System', 'Measurement Parameter', 'SOFA Point Cutoff (Severe 3–4)'],
      rows: [
        ['Respiration', 'PaO₂ / FiO₂ ratio', '< 200 with respiratory support'],
        ['Coagulation', 'Platelets (× 10³/µL)', '< 50 × 10³/µL'],
        ['Liver', 'Bilirubin (mg/dL)', '≥ 6.0 mg/dL'],
        ['Cardiovascular', 'MAP / Inotropes required', 'Norepinephrine > 0.1 µg/kg/min or Epinephrine'],
        ['Central Nervous', 'Glasgow Coma Scale (GCS)', 'GCS ≤ 9'],
        ['Renal', 'Creatinine / Urine Output', 'Creatinine ≥ 3.5 mg/dL or Urine < 200 mL/day'],
      ]
    },
    trapAlert: 'The first-line vasopressor in Septic Shock is NO LONGER Dopamine! Noradrenaline (Norepinephrine) is the undisputed first-line agent because dopamine increases arrhythmic mortality.',
    whyOthersWrong: [
      { distractor: 'Dopamine 10 mcg/kg/min as first choice vasopressor in septic shock', reason: 'Surviving Sepsis Guidelines strongly recommend Norepinephrine over Dopamine due to dopamine\'s excessive tachyarrhythmias.' },
      { distractor: 'Delay broad-spectrum antibiotics until blood culture reports return', reason: 'Antibiotics must be initiated within the first hour; each hour of delay increases mortality by 7.6%.' }
    ],
    clusterId: 'med-sepsis-icu',
    pyqNotes: 'INI-CET May 2025: Target MAP in septic shock (65 mmHg); components of qSOFA.',
    verifyGuideline: 'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021/2024'
  },
  {
    id: 'prl-antimicrobial-resistances-docs',
    num: 11,
    title: 'Superbugs & Antimicrobials: Resistance Genes, Mechanisms & Drugs of Choice',
    subject: 'Microbiology',
    system: 'Infectious Diseases',
    yield: 3,
    tags: ['DOC', 'Gold-Standard', 'Volatile'],
    anchor: 'MRSA = mecA gene encodes altered PBP-2a (DOC: Vancomycin / Daptomycin / Linezolid). VRE = vanA/vanB gene converts D-Ala-D-Ala to D-Ala-D-Lac (DOC: Linezolid / Daptomycin). CRE = NDM-1 / KPC carbapenemases (DOC: Ceftazidime-avibactam / Colistin).',
    highYieldSummary: [
      '**Methicillin-Resistant Staphylococcus aureus (MRSA)**: Mediated by mecA/mecC gene carried on SCCmec mobile cassette; produces modified Penicillin-Binding Protein 2a (PBP2a) with low β-lactam affinity. Ceftaroline (5th gen cephalosporin) binds PBP2a. DOC: IV Vancomycin (trough 15–20 µg/mL). For MRSA pneumonia: Linezolid or Vancomycin (Daptomycin is INACTIVATED by pulmonary surfactant!).',
      '**Vancomycin-Resistant Enterococci (VRE)**: Enterococcus faecium > faecalis. Peptidoglycan cell wall precursor D-Ala-D-Ala altered to D-Ala-D-Lactate. DOC: Linezolid or Daptomycin.',
      '**Carbapenem-Resistant Enterobacteriaceae (CRE / NDM-1)**: Metallo-β-lactamase (NDM-1, VIM, IMP) hydrolyzes all β-lactams including carbapenems, resistant to Avibactam unless combined with Aztreonam. Serine carbapenemase (KPC) inhibited by Ceftazidime-avibactam.',
      '**Extended Spectrum β-Lactamases (ESBL)**: Hydrolyzes penicillins, cephalosporins, and aztreonam. Inhibited by clavulanic acid. DOC for severe ESBL: Meropenem or Imipenem.'
    ],
    table: {
      title: 'High-Yield Superbug Resistance Mechanisms & Drugs of Choice',
      head: ['Resistant Pathogen', 'Genetic Mechanism', 'Key Vulnerability / DOC', 'Crucial Contraindication'],
      rows: [
        ['MRSA Pneumonia', 'mecA gene → PBP-2a', 'Linezolid 600 mg IV / Vancomycin', 'DAPTOMYCIN CONTRAINDICATED (bound by surfactant)'],
        ['MRSA Bacteremia / Endocarditis', 'mecA gene → PBP-2a', 'Daptomycin (8–10 mg/kg) or Vancomycin', 'Daptomycin safe in bacteremia/right-sided endocarditis'],
        ['VRE (E. faecium)', 'vanA gene: D-Ala-D-Lac', 'Linezolid or Daptomycin or Tigecycline', 'Vancomycin / Teicoplanin completely ineffective'],
        ['ESBL (E. coli, Klebsiella)', 'blaCTX-M / TEM / SHV plasmids', 'Meropenem / Imipenem (Carbapenems)', '3rd/4th gen cephalosporins ineffective'],
        ['CRE (NDM-1 producers)', 'Metallo-β-lactamase (zinc enzyme)', 'Aztreonam + Ceftazidime-avibactam or Colistin', 'Ceftazidime-avibactam alone ineffective against NDM-1'],
        ['Pseudomonas aeruginosa', 'Efflux pumps + AmpC + loss of OprD', 'Ceftolozane-tazobactam / Cefepime / Meropenem', 'Ertapenem HAS NO ANTI-PSEUDOMONAL ACTIVITY'],
      ]
    },
    trapAlert: 'Daptomycin MUST NEVER be used for MRSA pneumonia! Pulmonary surfactant binds to and inactivates daptomycin, leading to clinical failure and death.',
    whyOthersWrong: [
      { distractor: 'Daptomycin 6 mg/kg IV for MRSA ventilator-associated pneumonia', reason: 'Alveolar surfactant binds to daptomycin\'s lipophilic tail, inactivating the drug in the lung parenchyma.' },
      { distractor: 'Ertapenem for Pseudomonas aeruginosa bacteremia', reason: 'Ertapenem lacks activity against Pseudomonas, Acinetobacter, and Enterococcus ("PEA" gap).' }
    ],
    clusterId: 'micro-resistance-superbugs',
    pyqNotes: 'INI-CET Nov 2023, May 2026: Asked on Daptomycin surfactant inactivation; mecA gene product.',
    verifyGuideline: 'IDSA Antimicrobial Guidance for Gram-Negative Bacterial Infections 2023 / Sanford Guide 2024'
  },
  {
    id: 'prl-thyroid-nodule-bethesda',
    num: 12,
    title: 'Thyroid Nodules: Bethesda System, USG Features & Surgical Indications',
    subject: 'Surgery',
    system: 'Endocrine Surgery',
    yield: 3,
    tags: ['IOC', 'Gold-Standard', 'Next-Step'],
    anchor: 'Investigation of choice for thyroid nodule is FNAC (guided by Ultrasound). TSH is the initial lab test. Bethesda Category II = Benign (observe). Bethesda VI = Malignant (Total/Hemithyroidectomy). Suspicious USG: Taller-than-wide, microcalcifications, irregular margins.',
    highYieldSummary: [
      '**Initial Workup**: Serum TSH + Ultrasound thyroid. If TSH is suppressed (hyperthyroid) → Radionuclide Thyroid Scan (Tc-99m or I-123) to see if nodule is "hot" (functioning, rarely malignant) or "cold" (non-functioning, higher malignancy risk). If TSH normal or elevated → Ultrasound-guided FNAC.',
      '**High-Risk USG Features (TIRADS 5)**: Microcalcifications (psammoma bodies in papillary thyroid CA), taller-than-wide shape, marked hypoechogenicity, irregular/lobulated margins, extrathyroidal extension.',
      '**Bethesda System for Reporting Thyroid Cytopathology (3rd Edition 2023)**:',
      '• Cat I: Non-diagnostic / Cyst fluid → Repeat US-guided FNAC.',
      '• Cat II: Benign (Colloid nodule, Hashimoto) → Clinical & sonographic follow-up.',
      '• Cat III: Atypia of Undetermined Significance (AUS) → Repeat FNAC or Molecular testing.',
      '• Cat IV: Follicular Neoplasm → Diagnostic Lobectomy (FNAC cannot distinguish follicular adenoma from carcinoma as capsular/vascular invasion requires histology!).',
      '• Cat V: Suspicious for Malignancy → Near-total / Total thyroidectomy or lobectomy.',
      '• Cat VI: Malignant (Papillary, Medullary, Anaplastic) → Total Thyroidectomy + central neck dissection.'
    ],
    table: {
      title: 'Bethesda 2023 Cytopathology Risk of Malignancy & Action',
      head: ['Bethesda Category', 'Cytological Diagnosis', 'Malignancy Risk (%)', 'Standard Clinical Management'],
      rows: [
        ['Category I', 'Non-diagnostic / Unsatisfactory', '5 – 10%', 'Repeat US-guided FNAC'],
        ['Category II', 'Benign', '< 3%', 'Clinical & Ultrasound surveillance'],
        ['Category III', 'Atypia of Undetermined Significance (AUS)', '15 – 30%', 'Repeat FNAC or Molecular testing'],
        ['Category IV', 'Follicular Neoplasm / Suspicious for FN', '25 – 40%', 'Diagnostic Thyroid Lobectomy'],
        ['Category V', 'Suspicious for Malignancy', '70 – 80%', 'Total Thyroidectomy / Lobectomy'],
        ['Category VI', 'Malignant (Papillary CA / Medullary CA)', '97 – 100%', 'Total Thyroidectomy ± Central Neck Dissection'],
      ]
    },
    trapAlert: 'Follicular carcinoma CANNOT be diagnosed on FNAC! FNAC only identifies follicular cells; histological demonstration of capsular invasion or vascular invasion is required to diagnose malignancy.',
    whyOthersWrong: [
      { distractor: 'FNAC confirms follicular carcinoma by showing sheets of microfollicles', reason: 'Microfollicles are present in both benign adenomas and malignant carcinomas; histology of capsule is mandatory.' },
      { distractor: 'Immediate FNAC on a hot hyperfunctioning nodule with suppressed TSH', reason: 'Hot functioning nodules are virtually always benign; workup is radioactive iodine or antithyroid therapy, not FNAC.' }
    ],
    clusterId: 'surg-thyroid-neoplasms',
    pyqNotes: 'INI-CET 2025: Malignancy risk in Bethesda IV; Ultrasound criteria for thyroid malignancy.',
    verifyGuideline: 'American Thyroid Association (ATA) Thyroid Nodules Guidelines & Bethesda 3rd Ed 2023'
  },
  {
    id: 'prl-postpartum-hemorrhage-protocol',
    num: 13,
    title: 'Postpartum Hemorrhage (PPH): 4Ts, Uterotonic Cascade & Surgical Tamponade',
    subject: 'OBGY',
    system: 'Obstetrics',
    yield: 3,
    tags: ['Emergency', 'DOC', 'Next-Step', 'Formula'],
    anchor: 'PPH = Blood loss ≥ 500 mL (vaginal) or ≥ 1000 mL (cesarean) OR any blood loss with hemodynamic instability within 24 hours. Most common cause is Uterine Atony (70%). First step: Fundal uterine massage + Oxytocin 10–20 IU infusion.',
    highYieldSummary: [
      '**The 4 Ts of PPH**: Tone (Atony, 70%), Trauma (Lacerations/Rupture, 20%), Tissue (Retained placenta, 10%), Thrombin (Coagulopathy, 1%).',
      '**Stepwise Medical Management of Uterine Atony**:',
      '1. Bimanual uterine compression + Vigorous fundal massage.',
      '2. Oxytocin: 10–20 IU in 500 mL normal saline IV infusion (or 10 IU IM). First-line drug.',
      '3. Methylergometrine (Methergine): 0.2 mg IM. CONTRAINDICATED in Pre-eclampsia / Chronic Hypertension (causes severe hypertensive crisis).',
      '4. Carboprost (15-methyl PGF2α): 250 µg IM every 15–90 min (max 8 doses). CONTRAINDICATED in Bronchial Asthma (triggers bronchospasm).',
      '5. Misoprostol (PGE1): 800–1000 µg per rectum or sublingual.',
      '6. Tranexamic Acid (TXA): 1 g IV over 10 min within 3 hours of delivery (WOMAN trial).',
      '**Surgical & Mechanical Interventions**:',
      '• Intrauterine Balloon Tamponade (Bakri balloon): Infuse 300–500 mL warm saline; tamponade test positive if bleeding ceases.',
      '• Uterine Compression Sutures: B-Lynch brace suture (most common), Hayman, Pereira.',
      '• Stepwise Devacularization: Bilateral uterine artery ligation (O\'Leary) → Utero-ovarian anastomosis ligation → Internal Iliac (Hypogastric) artery ligation (anterior division).',
      '• Ultimate Lifesaving Procedure: Subtotal or Total Emergency Peripartum Hysterectomy.'
    ],
    table: {
      title: 'PPH Uterotonic Drugs: Indications & Absolute Contraindications',
      head: ['Uterotonic Agent', 'Dose & Route', 'Mechanism', 'Absolute Contraindications'],
      rows: [
        ['Oxytocin', '10–20 IU in 500 mL IV infusion', 'Oxytocin receptor agonist', 'Rapid IV bolus (causes severe hypotension & flushing)'],
        ['Methylergometrine', '0.2 mg IM / IV slowly', 'Ergot alkaloid (sustained contraction)', 'HYPERTENSION, Pre-eclampsia, CAD, Raynaud'],
        ['Carboprost (PGF2α)', '250 µg IM (every 15 min, max 2 mg)', 'Prostaglandin F2α agonist', 'BRONCHIAL ASTHMA, Active hepatic/cardiac disease'],
        ['Misoprostol', '800 µg sublingual or rectal', 'PGE1 analogue', 'Hypersensitivity to prostaglandins'],
        ['Tranexamic Acid', '1 g IV over 10 min', 'Antifibrinolytic (plasminogen inhibitor)', 'Active thromboembolic disease'],
      ]
    },
    trapAlert: 'In a hypertensive mother with pre-eclampsia and atonic PPH, METHYLERGOMETRINE IS STRICTLY CONTRAINDICATED! The next uterotonic to choose after oxytocin is Carboprost (if not asthmatic) or Misoprostol.',
    whyOthersWrong: [
      { distractor: 'Administer Methergine 0.2 mg IV stat in pre-eclamptic mother with BP 170/110', reason: 'Ergometrine induces generalized peripheral vasoconstriction, risking hypertensive encephalopathy and intracranial hemorrhage.' },
      { distractor: 'Carboprost IM in a patient with severe active bronchial asthma', reason: 'Carboprost causes intense bronchoconstriction of airway smooth muscle via F-prostanoid receptors.' }
    ],
    clusterId: 'obg-pph-emergencies',
    pyqNotes: 'INI-CET May 2026: Contraindication to Methergine vs Carboprost; Bakri balloon volume.',
    verifyGuideline: 'WHO Recommendations for the Prevention and Treatment of Postpartum Hemorrhage & FIGO 2022'
  },
  {
    id: 'prl-nrp-neonatal-resuscitation',
    num: 14,
    title: 'Neonatal Resuscitation Program (NRP 8th Edition): Golden Minute & MR. SOPA',
    subject: 'Pediatrics',
    system: 'Neonatology',
    yield: 3,
    tags: ['Emergency', 'Next-Step', 'Formula'],
    anchor: 'The Golden Minute (First 60 seconds): Warm & dry → Position airway & suction only if obstructed → Stimulate. If Apneic, Gasping, or HR < 100 bpm → START POSITIVE PRESSURE VENTILATION (PPV) with room air (21% O₂) immediately. Chest compressions start ONLY if HR remains < 60 bpm despite effective ventilation.',
    highYieldSummary: [
      '**Initial Steps (0–30 seconds)**: Term? Tone? Breathing/crying? If YES → stay with mother (skin-to-skin). If NO → Warm, position head (sniffing position), clear airway if needed, dry, stimulate.',
      '**Positive Pressure Ventilation (PPV)**: Indication: Apnea, gasping, or HR < 100 bpm. Rate: 40–60 breaths/min ("Breathe, Two, Three, Breathe..."). Initial oxygen: For ≥ 35 weeks, start with 21% O₂ (room air). For < 35 weeks, start with 21–30% O₂.',
      '**MR. SOPA Ventilation Corrective Steps** (if heart rate not increasing and chest not rising):',
      '• M: Mask adjustment (re-seat mask for seal)',
      '• R: Reposition head (neutral/sniffing position)',
      '• S: Suction mouth and nose',
      '• O: Open mouth',
      '• P: Pressure increase (in 5 cm H₂O increments up to 40 cm H₂O)',
      '• A: Alternative airway (Laryngeal mask airway or Endotracheal tube).',
      '**Chest Compressions**: Indication: HR < 60 bpm DESPITE 30 seconds of EFFECTIVE PPV (with chest movement, ideally via ETT). Ratio: 3:1 (3 compressions : 1 ventilation, 90 compressions + 30 breaths = 120 events/min). Technique: Two-thumb encircling technique over lower third of sternum. Switch oxygen to 100% O₂.',
      '**Adrenaline / Epinephrine**: Indication: HR < 60 bpm despite 60 seconds of chest compressions + 100% PPV. Concentration: 1:10,000 (0.1 mg/mL). IV dose via umbilical venous catheter: 0.02 mg/kg (0.2 mL/kg).'
    ],
    table: {
      title: 'Target Pre-ductal SpO₂ by Pulse Oximeter (Right Hand)',
      head: ['Time after Birth', 'Target Pre-ductal SpO₂ (%)'],
      rows: [
        ['1 minute', '60% – 65%'],
        ['2 minutes', '65% – 70%'],
        ['3 minutes', '70% – 75%'],
        ['4 minutes', '75% – 80%'],
        ['5 minutes', '80% – 85%'],
        ['10 minutes', '85% – 95%'],
      ]
    },
    trapAlert: 'Never begin chest compressions immediately if newborn has HR < 60 bpm at birth! The initial problem in neonates is almost universally respiratory failure. You MUST first perform effective PPV for 30 seconds. Compressions only start if HR remains < 60 bpm despite PPV.',
    whyOthersWrong: [
      { distractor: 'Start CPR with chest compressions at 0 seconds for heart rate 50 bpm', reason: 'NRP dictates that lung aeration (PPV) is the single most critical intervention; compressions without ventilation are futile.' },
      { distractor: 'Initiate resuscitation with 100% oxygen in a term newborn', reason: 'Hyperoxia in term infants causes toxic reactive oxygen species, retinal damage, and increased mortality. Start with 21% room air.' }
    ],
    clusterId: 'peds-neonatology-nrp',
    pyqNotes: 'INI-CET 2026, 2024: Preductal SpO2 at 1 min (60-65%); CPR ratio in neonates (3:1).',
    verifyGuideline: 'AHA / AAP Neonatal Resuscitation Program (NRP) 8th Edition Guidelines'
  },
  {
    id: 'prl-raised-icp-herniations',
    num: 15,
    title: 'Raised Intracranial Pressure: Herniation Syndromes & Osmotherapy',
    subject: 'Surgery',
    system: 'Neurosurgery',
    yield: 3,
    tags: ['Emergency', 'DOC', 'Next-Step'],
    anchor: 'Normal ICP = 5–15 mmHg. Treatment threshold is ICP > 20–22 mmHg. Cushing\'s Triad: Hypertension (widened pulse pressure) + Bradycardia + Irregular respiration. Uncal herniation: Ipsilateral fixed dilated pupil (CN III) + Contralateral hemiparesis.',
    highYieldSummary: [
      '**Monro-Kellie Doctrine**: Cranium is a rigid box containing Brain (80%), Blood (10%), and CSF (10%). An increase in one component mandates reduction in others to prevent steep ICP elevation.',
      '**Cerebral Perfusion Pressure (CPP)**: CPP = MAP − ICP. Target CPP in TBI is 60–70 mmHg. If CPP < 50 mmHg, severe cerebral ischemia occurs.',
      '**Types of Brain Herniation**:',
      '• Subfalcine (Cingulate) Herniation: Cingulate gyrus herniates under falx cerebri; compresses Anterior Cerebral Artery (ACA) → Contralateral lower limb weakness.',
      '• Uncal (Transtentorial) Herniation: Medial temporal lobe (uncus) herniates over tentorium cerebelli; compresses CN III (ipsilateral fixed dilated pupil) and ipsilateral cerebral peduncle (contralateral hemiparesis). Kernohan\'s notch phenomenon: compression of opposite peduncle causes paradoxical ipsilateral hemiparesis.',
      '• Tonsillar Herniation (Coning): Cerebellar tonsils through foramen magnum; compresses medulla oblongata → Cushing\'s triad, cardiorespiratory arrest.',
      '**Tiered Management of Raised ICP**:',
      '• Head-of-bed elevation 30°, neutral neck position, analgesia & sedation.',
      '• Osmotherapy: Mannitol 20% (0.25–1 g/kg IV bolus, monitor serum osmolarity < 320 mOsm/L) OR Hypertonic Saline 3% (250 mL bolus, preferred in hypotensive trauma!).',
      '• Mild hyperventilation: PaCO₂ 30–35 mmHg (causes cerebral vasoconstriction; avoid PaCO₂ < 30 mmHg due to severe ischemia).',
      '• Refractory ICP: Decompressive craniectomy, barbiturate coma, moderate therapeutic hypothermia.'
    ],
    table: {
      title: 'Brain Herniation Syndromes Discriminator Table',
      head: ['Herniation Type', 'Displaced Structure', 'Vessel / Nerve Compressed', 'Clinical Triad / Hallmark'],
      rows: [
        ['Subfalcine', 'Cingulate gyrus', 'Anterior Cerebral Artery (ACA)', 'Contralateral leg paralysis & sensory loss'],
        ['Uncal (Lateral)', 'Uncus of temporal lobe', 'CN III & Posterior Cerebral Artery (PCA)', 'Ipsilateral blown pupil, contralateral hemiplegia, PCA infarct'],
        ['Central (Transtentorial)', 'Diencephalon & midbrain', 'Perforating basilar branches (Duret hemorrhages)', 'Cheyne-Stokes breathing, decorticate posturing, pinpoint pupils'],
        ['Tonsillar (Coning)', 'Cerebellar tonsils', 'Medulla oblongata & vertebral arteries', 'Cushing\'s triad, flaccid paralysis, respiratory arrest'],
        ['Kernohan\'s Phenomenon', 'Midbrain crushed against opposite tentorium', 'Contralateral crus cerebri', 'False localizing sign: hemiparesis ipsilateral to primary mass'],
      ]
    },
    trapAlert: 'Mannitol causes osmotic diuresis and lowers blood pressure. In a polytrauma patient who is HYPOTENSIVE (BP < 90/60 mmHg) with raised ICP, MANNITOL IS CONTRAINDICATED! The osmotherapy of choice is 3% Hypertonic Saline, which expands intravascular volume while lowering ICP.',
    whyOthersWrong: [
      { distractor: 'Give IV Mannitol bolus to hypotensive polytrauma patient with uncal herniation', reason: 'Mannitol hypovolemia collapses CPP (MAP - ICP); 3% hypertonic saline lowers ICP without decreasing MAP.' },
      { distractor: 'Aggressive prophylactic hyperventilation to PaCO2 < 25 mmHg in first 24 hours', reason: 'Induces severe cerebral vasoconstriction and secondary cerebral ischemia, increasing mortality in TBI.' }
    ],
    clusterId: 'surg-neurosurg-tbi',
    pyqNotes: 'INI-CET 2026: Kernohan notch false localizing sign; Mannitol vs 3% saline in hypotension.',
    verifyGuideline: 'Brain Trauma Foundation Guidelines for the Management of Severe TBI 4th Edition'
  },
  {
    id: 'prl-cardiac-arrhythmias-acls',
    num: 16,
    title: 'ACLS 2024 Tachycardia & Bradycardia Algorithms: Wide vs Narrow Complexes',
    subject: 'Medicine',
    system: 'Cardiology / Emergency',
    yield: 3,
    tags: ['Emergency', 'DOC', 'Next-Step', 'Formula'],
    anchor: 'Any unstable tachycardia (Hypotension, Altered mental status, Signs of shock, Ischemic chest pain, Acute HF) → SYNCHRONIZED CARDIOVERSION immediately. Stable Narrow Regular SVT: Vagal maneuvers → Adenosine (6 mg → 12 mg). Stable Wide VT: Amiodarone 150 mg IV over 10 min.',
    highYieldSummary: [
      '**ACLS Bradycardia (HR < 50 bpm) with hypoperfusion**:',
      '1. Atropine: 1 mg IV bolus every 3–5 min (maximum 3 mg). Ineffective in Mobitz Type II and 3rd degree heart block with wide QRS.',
      '2. If Atropine ineffective: Transcutaneous pacing OR Dopamine infusion (5–20 µg/kg/min) OR Epinephrine infusion (2–10 µg/min).',
      '**ACLS Tachycardia (HR ≥ 150 bpm)**:',
      '• Unstable: Synchronized Cardioversion (Narrow regular: 50–100 J; Wide regular: 100 J; Polymorphic VT: Defibrillate at 200 J unsynchronized).',
      '• Stable Narrow Regular (SVT / AVNRT): Vagal maneuvers (modified Valsalva) → Adenosine 6 mg rapid IV push followed by 20 mL saline flush → if no conversion, give 12 mg.',
      '• Stable Narrow Irregular (Atrial Fibrillation / Flutter): Rate control with IV Diltiazem / Verapamil or β-Blocker (Metoprolol).',
      '• Stable Wide Complex Regular (Monomorphic VT): IV Amiodarone 150 mg over 10 min (repeat as needed, then 1 mg/min maintenance) OR IV Procainamide (20–50 mg/min).',
      '• Polymorphic VT / Torsades de Pointes: IV Magnesium Sulfate (1–2 g diluted in 50–100 mL D5W over 15 min).'
    ],
    table: {
      title: 'Tachycardia Master Algorithmic Discriminator',
      head: ['Rhythm / Presentation', 'QRS Width & Regularity', 'Hemodynamically Stable DOC', 'Hemodynamically Unstable Action'],
      rows: [
        ['AVNRT / AVRT (SVT)', 'Narrow (< 0.12 s), Regular', 'Adenosine (6 mg → 12 mg IV push)', 'Synchronized Cardioversion 50–100 J'],
        ['Atrial Fibrillation with RVR', 'Narrow, Irregularly Irregular', 'Diltiazem / Metoprolol (Rate control)', 'Synchronized Cardioversion 120–200 J'],
        ['Monomorphic VT', 'Wide (≥ 0.12 s), Regular', 'IV Amiodarone 150 mg or Procainamide', 'Synchronized Cardioversion 100 J'],
        ['Torsades de Pointes (Polymorphic)', 'Wide, Twisting peaks around baseline', 'IV Magnesium sulfate 2 g', 'Unsynchronized Defibrillation 200 J'],
        ['Wolff-Parkinson-White + AFib', 'Wide, Irregular, Rapid bizarre QRS', 'IV Procainamide or Ibutilide', 'AV NODAL BLOCKERS CONTRAINDICATED (Cardiovert)'],
      ]
    },
    trapAlert: 'In AFib with WPW (pre-excited AFib with delta waves), NEVER administer AV nodal blockers (Adenosine, Digoxin, Diltiazem, Verapamil, β-blockers)! Blocking the AV node shunts all impulses down the accessory pathway (Bundle of Kent), precipitating Ventricular Fibrillation and cardiac arrest. DOC is IV Procainamide or electrical cardioversion.',
    whyOthersWrong: [
      { distractor: 'Administer IV Verapamil in pre-excited atrial fibrillation with WPW', reason: 'Verapamil accelerates conduction through the bypass tract, degenerating the rhythm into fatal Ventricular Fibrillation.' },
      { distractor: 'Synchronized cardioversion for Torsades de Pointes', reason: 'In polymorphic VT, the defibrillator cannot reliably synchronize to irregular R-waves; unsynchronized defibrillation is required.' }
    ],
    clusterId: 'med-cardio-arrhythmias',
    pyqNotes: 'INI-CET Nov 2024: Drugs contraindicated in WPW with AF; First step in stable SVT.',
    verifyGuideline: 'AHA / ACC / HRS Guideline for Management of Patients with Ventricular Arrhythmias & ACLS 2024'
  },
  {
    id: 'prl-pediatric-limps-ortho',
    num: 17,
    title: 'Pediatric Limping Hip: Kocher Criteria, Perthes, SCFE & Transient Synovitis',
    subject: 'Orthopedics',
    system: 'Pediatric Orthopedics',
    yield: 3,
    tags: ['Gold-Standard', 'IOC', 'Next-Step', 'Formula'],
    anchor: 'Kocher Criteria (≥ 3 = Septic Arthritis, emergency arthrotomy). Obese 12-year-old boy with groin/knee pain + external rotation deformity = SCFE (Slipped Capital Femoral Epiphysis). 6-year-old boy with painless limp + avascular necrosis = Legg-Calvé-Perthes disease.',
    highYieldSummary: [
      '**Kocher Criteria for Pediatric Septic Arthritis (Hip)** (Differentiates Septic Arthritis from Transient Synovitis):',
      '1. Inability to bear weight on affected limb.',
      '2. Temperature > 38.5°C (101.3°F).',
      '3. ESR > 40 mm/hr.',
      '4. Serum WBC count > 12,000 /µL.',
      'Score 4/4 = 99% probability of Septic Arthritis → EMERGENCY ULTRASOUND-GUIDED HIP ASPIRATION & ARTHROTOMY.',
      '**Slipped Capital Femoral Epiphysis (SCFE)**: Obese adolescent boy (11–15 years). Posteromedial slippage of femoral epiphysis on metaphysis. Klein\'s line on AP pelvis radiograph DOES NOT INTERSECT the lateral epiphysis (Trethowan sign). Management: Emergency in-situ single cannulated screw fixation (DO NOT attempt forceful closed reduction due to AVN risk!).',
      '**Legg-Calvé-Perthes Disease (LCPD)**: Idiopathic avascular necrosis of femoral head in boys aged 4–8 years. Insidious, often painless limp or dull ache in knee/thigh. Radiograph: Crescent sign (subchondral fracture), flattening, sclerosis, fragmentation of femoral epiphysis.',
      '**Transient Synovitis (Toxic Synovitis)**: Most common cause of pediatric hip pain (ages 3–8), follows a viral upper respiratory infection. Self-limiting, normal or mildly elevated inflammatory markers, ultrasound shows small effusion. Treatment: Rest + NSAIDs.'
    ],
    table: {
      title: 'Pediatric Hip Pain Confusable Matrix',
      head: ['Condition', 'Typical Age & Profile', 'Key Radiographic / Lab Signs', 'Definitive Management'],
      rows: [
        ['Septic Arthritis', 'Any age (< 4 yrs common)', 'Kocher score ≥ 3, synovial WBC > 50,000', 'Emergency Hip Arthrotomy & drainage'],
        ['Transient Synovitis', '3 – 8 years, post-viral URTI', 'Normal X-ray, minor ultrasound fluid', 'Conservative (Bed rest + Ibuprofen)'],
        ['Perthes Disease', '4 – 8 years, thin active boy', 'Crescent sign, collapsed femoral head', 'Containment (brace / femoral osteotomy)'],
        ['SCFE', '11 – 15 years, obese adolescent', 'Trethowan sign (Klein\'s line fails to intersect)', 'Emergency in-situ cannulated screw fixation'],
      ]
    },
    trapAlert: 'An adolescent with SCFE frequently presents with ISOLATED KNEE OR THIGH PAIN with normal knee examination! Referred pain via obturator nerve. Always obtain an AP and Frog-leg lateral pelvic radiograph of both hips in any limping child complaining of knee pain.',
    whyOthersWrong: [
      { distractor: 'Forceful closed manual reduction of acute SCFE before pinning', reason: 'Aggressive manipulation tears posterior retinacular vessels, causing catastrophic iatrogenic avascular necrosis.' },
      { distractor: 'Discharge child with 4/4 Kocher criteria on oral antibiotics', reason: 'Undrained septic arthritis causes irreversible chondrolysis and permanent hip destruction within 24–48 hours.' }
    ],
    clusterId: 'ortho-pediatric-hip',
    pyqNotes: 'INI-CET 2025, 2023: Klein line in SCFE; Kocher criteria cut-offs; Crescent sign in Perthes.',
    verifyGuideline: 'Tachdjian\'s Pediatric Orthopaedics 6th Edition & AAOS Guidelines'
  },
  {
    id: 'prl-ophthalmology-red-eye',
    num: 18,
    title: 'The Acute Red Eye & Sudden Vision Loss: Glaucoma vs Uveitis vs Keratitis',
    subject: 'Ophthalmology',
    system: 'Cornea & Glaucoma',
    yield: 3,
    tags: ['IOC', 'Emergency', 'Gold-Standard'],
    anchor: 'Mid-dilated vertically oval non-reactive pupil + steamy cornea + stony hard eyeball = Acute Angle-Closure Glaucoma (DOC: IV Mannitol + Topical Timolol/Pilocarpine + Peripheral Iridotomy). Miosed irregular pupil + keratic precipitates + flare = Acute Anterior Uveitis (DOC: Topical Steroids + Homatropine).',
    highYieldSummary: [
      '**Acute Primary Angle-Closure Glaucoma (APAC)**:',
      '• Presentation: Severe ocular pain, hemicranial headache, nausea/vomiting, colored halos around lights, sudden blurry vision.',
      '• Signs: Steamy/edematous cornea, shallow anterior chamber, fixed vertically oval mid-dilated pupil, ciliary flush, IOP > 40–60 mmHg.',
      '• Immediate Medical Management: IV Mannitol 20% (1–2 g/kg over 30 min) + Oral Acetazolamide 500 mg + Topical 0.5% Timolol + 1% Apraclonidine. Topical Pilocarpine 2% is given only after IOP drops below 30 mmHg (ischemic sphincter is unresponsive above 30 mmHg).',
      '• Definitive Management: Bilateral Nd:YAG Laser Peripheral Iridotomy (prophylactic LPI to the other eye is MANDATORY as 50% will develop an attack within 5 years).',
      '**Acute Anterior Uveitis (Iridocyclitis)**:',
      '• Presentation: Dull aching pain, photophobia, lacrimation, redness, HLA-B27 association.',
      '• Signs: Circumcorneal / ciliary injection, Keratic Precipitates (mutton-fat in granulomatous uveitis on lower endothelial cornea - Arlt\'s triangle), aqueous cells and flare (Tyndall effect), MIOTIC irregular pupil due to posterior synechiae.',
      '• Treatment: Topical corticosteroids (Prednisolone acetate 1%) + Mydriatics/Cycloplegics (Homatropine / Atropine to prevent posterior synechiae and relieve ciliary spasm).',
      '**Corneal Ulcer (Keratitis)**:',
      '• Bacterial: Circumscribed white infiltrates with overlying epithelial defect that stains brilliant green with Fluorescein.',
      '• Fungal: Feathery borders, satellite lesions, raised dry surface, hypopyon, history of trauma with vegetative matter (DOC: Topical Natamycin 5%).'
    ],
    table: {
      title: 'Red Eye Diagnostic Discriminator Matrix',
      head: ['Feature', 'Acute Angle-Closure Glaucoma', 'Acute Anterior Uveitis', 'Acute Conjunctivitis'],
      rows: [
        ['Pupil Size & Shape', 'Mid-dilated, Vertically oval, Fixed', 'Small (Miotic), Irregular', 'Normal size & reaction'],
        ['Cornea', 'Steamy, Hazy (Epithelial edema)', 'Clear with Keratic Precipitates (KP)', 'Clear and transparent'],
        ['Anterior Chamber', 'Very shallow (slit-like)', 'Normal depth with cells & flare', 'Normal depth, clear'],
        ['Intraocular Pressure', 'Markedly elevated (40 – 70 mmHg)', 'Normal or low (occasionally high)', 'Normal (10 – 21 mmHg)'],
        ['Discharge', 'Watery / Lacrimation', 'Watery / Photophobia', 'Mucopurulent / Purulent (eyes glued)'],
        ['Definitive Treatment', 'Nd:YAG Laser Iridotomy', 'Topical Steroids + Cycloplegics', 'Topical Antibiotics (Fluoroquinolones)'],
      ]
    },
    trapAlert: 'In Acute Anterior Uveitis, PILOCARPINE IS STRICTLY CONTRAINDICATED! Pilocarpine constricts the pupil, maximizing contact between iris and anterior lens capsule, creating extensive permanent posterior synechiae and "seclusio pupillae". Always use CYCLOPLEGICS (Atropine/Homatropine).',
    whyOthersWrong: [
      { distractor: 'Topical Pilocarpine 2% drops as first-line treatment for acute anterior uveitis', reason: 'Pilocarpine induces intense miosis and ciliary spasm, accelerating posterior synechiae formation.' },
      { distractor: 'Topical steroids for a branching dendritic corneal ulcer', reason: 'Steroids exacerbate Herpes Simplex dendritic ulcers, triggering deep amoeboid/geographic ulcers and corneal perforation.' }
    ],
    clusterId: 'oph-glaucoma-red-eye',
    pyqNotes: 'INI-CET Nov 2024, May 2025: YAG iridotomy indications; Pilocarpine vs Atropine indications in red eye.',
    verifyGuideline: 'American Academy of Ophthalmology (AAO) Preferred Practice Patterns: Primary Angle Closure'
  },
  {
    id: 'prl-pediatric-stridor-airway',
    num: 19,
    title: 'Pediatric Upper Airway Emergencies: Croup vs Epiglottitis vs Foreign Body',
    subject: 'ENT',
    summary: 'Barking seal cough = Croup (Steeple sign). Drooling + tripod position = Epiglottitis (Thumbprint sign).',
    system: 'Pediatric Airway',
    yield: 3,
    tags: ['Emergency', 'DOC', 'Image', 'Next-Step'],
    anchor: 'Barking cough + inspiratory stridor + steeple sign = Croup (Parainfluenza; DOC: Single dose oral/IV Dexamethasone ± Nebulized Racemic Epinephrine). Toxic appearance + high fever + drooling + thumbprint sign = Acute Epiglottitis (Hib; DO NOT EXAMINE PHARYNX WITH TONGUE DEPRESSOR!).',
    highYieldSummary: [
      '**Laryngotracheobronchitis (Croup)**:',
      '• Etiology: Parainfluenza virus (Type 1 most common). Age: 6 months – 3 years.',
      '• Clinical Presentation: Low-grade fever, barking ("seal-like") cough, inspiratory stridor, hoarseness, worse at night.',
      '• Radiography: AP soft tissue neck shows subglottic narrowing known as the "STEEPLE SIGN" (or pencil-point sign).',
      '• Management: Mild: Single dose oral Dexamethasone (0.15–0.6 mg/kg). Moderate-to-severe (stridor at rest): Nebulized Racemic Epinephrine (or L-epinephrine 1:1000) + Dexamethasone + humidified oxygen.',
      '**Acute Epiglottitis (Supraglottitis)**:',
      '• Etiology: Haemophilus influenzae type b (Hib), Streptococcus pyogenes, S. pneumoniae. Age: 2–7 years.',
      '• Presentation: Rapidly progressive high fever, muffled "hot potato" voice, dysphagia, DROOLING of saliva, tripod sniffing position (sitting upright, leaning forward, neck hyperextended).',
      '• Golden Clinical Rule: NEVER visualize the pharynx with a tongue depressor or perform indirect laryngoscopy outside of the operating room (risks reflex complete fatal laryngospasm!).',
      '• Radiography: Lateral neck radiograph shows swollen epiglottis known as the "THUMBPRINT SIGN".',
      '• Management: Secure airway in operating room with ENT/Anesthesia on standby → Endotracheal intubation → IV Ceftriaxone / Cefotaxime.'
    ],
    table: {
      title: 'Pediatric Airway Obstruction Confusable Matrix',
      head: ['Feature', 'Croup (Laryngotracheobronchitis)', 'Acute Epiglottitis', 'Foreign Body Aspiration'],
      rows: [
        ['Etiology', 'Parainfluenza virus Type 1', 'Haemophilus influenzae type b', 'Foreign object (peanut/seeds)'],
        ['Onset', 'Gradual over 2 – 3 days (URTI)', 'Rapid within hours (toxic, high fever)', 'Sudden choking / coughing paroxysm'],
        ['Cough / Voice', 'Loud barking cough, hoarseness', 'No cough, muffled "hot potato" voice', 'Sudden intractable cough / aphonia'],
        ['Drooling / Posture', 'Absent drooling, normal posture', 'PROMINENT DROOLING, Tripod position', 'Absent drooling, sudden wheeze/stridor'],
        ['Classic X-ray Sign', 'Steeple sign (AP neck)', 'Thumbprint sign (Lateral neck)', 'Air trapping, mediastinal shift on expiration'],
        ['Primary Drug', 'Dexamethasone + Nebulized Epinephrine', 'IV 3rd Gen Cephalosporin (after airway secure)', 'Rigid Bronchoscopy (diagnostic & therapeutic)'],
      ]
    },
    trapAlert: 'In a child with suspected epiglottitis (toxic, drooling, high fever), NEVER insert a tongue blade or examine the throat in the casualty! It triggers immediate reflex vagal laryngospasm and cardiac arrest. Keep child calm in mother\'s arms and transfer directly to the operating room.',
    whyOthersWrong: [
      { distractor: 'Depress tongue with wooden blade to inspect vocal cords in emergency room', reason: 'Mechanical irritation of the inflamed epiglottis causes immediate, fatal reflex airway obstruction.' },
      { distractor: 'Order emergent CT neck with IV contrast for acute barking cough in a calm infant', reason: 'Agitating the infant in a CT scanner worsens subglottic edema; clinical diagnosis of croup requires simple dexamethasone and observation.' }
    ],
    clusterId: 'ent-airway-stridor',
    pyqNotes: 'INI-CET May 2026: Thumbprint sign vs Steeple sign; First step in epiglottitis triage.',
    verifyGuideline: 'Nelson Textbook of Pediatrics 22nd Edition & Cummings Otolaryngology 7th Edition'
  },
  {
    id: 'prl-dermatology-blistering-disorders',
    num: 20,
    title: 'Autoimmune Blistering Dermatoses: Pemphigus Vulgaris vs Bullous Pemphigoid vs SJS',
    subject: 'Dermatology',
    system: 'Immunodermatology',
    yield: 3,
    tags: ['Gold-Standard', 'Image', 'Volatile', 'DOC'],
    anchor: 'Flaccid blisters + oral mucosal ulcers + positive Nikolsky sign + intraepidermal split (Desmoglein-3) = Pemphigus Vulgaris (DOC: Oral Corticosteroids + Rituximab). Tense bullae + NO oral involvement + negative Nikolsky + subepidermal split (BP180/BP230) = Bullous Pemphigoid.',
    highYieldSummary: [
      '**Pemphigus Vulgaris (PV)**:',
      '• Autoantibodies: IgG antibodies against Desmoglein-3 (mucosal-predominant) and Desmoglein-1 (mucocutaneous) in desmosomes.',
      '• Histopathology: Intraepidermal suprabasal acantholysis; "Tombstone appearance" of basal keratinocytes.',
      '• Direct Immunofluorescence (DIF): "Fish-net" / chicken-wire pattern of IgG and C3 in the intercellular epidermal cement substance.',
      '• Clinical Signs: Flaccid, fragile blisters that rupture leaving painful non-healing erosions; Oral mucosa involved in > 95% of cases (often the presenting sign); NIKOLSKY SIGN POSITIVE (slippage of normal skin on gentle tangential rubbing); Asboe-Hansen (Bulla-spread) sign positive.',
      '• Treatment of Choice: High-dose systemic Corticosteroids + Rituximab (Anti-CD20 monoclonal antibody).',
      '**Bullous Pemphigoid (BP)**:',
      '• Autoantibodies: IgG against BP180 (Type XVII collagen) and BP230 in hemidesmosomes.',
      '• Histopathology: Subepidermal blister with eosinophilic infiltrate in dermal papillae.',
      '• DIF: Continuous smooth LINEAR band of IgG and C3 along the dermo-epidermal junction (basement membrane zone).',
      '• Clinical Signs: Tense, firm bullae on erythematous urticarial plaques; Mucosa rarely involved (< 10–20%); Nikolsky sign NEGATIVE; Elderly patients (> 70 years).',
      '**Dermatitis Herpetiformis (Duhring Disease)**:',
      '• Extremely pruritic grouped vesicles on extensor surfaces (elbows, knees, buttocks); Associated with Celiac Disease (Gluten enteropathy).',
      '• DIF: Granular IgA deposits in dermal papillae tips; DOC: Dapsone + Gluten-Free Diet.'
    ],
    table: {
      title: 'Autoimmune Blistering Diseases Master Comparison Table',
      head: ['Feature', 'Pemphigus Vulgaris', 'Bullous Pemphigoid', 'Dermatitis Herpetiformis'],
      rows: [
        ['Autoantigen Target', 'Desmoglein 3 & 1 (Desmosomes)', 'BP180 & BP230 (Hemidesmosomes)', 'Epidermal Transglutaminase (eTG)'],
        ['Level of Blister Split', 'Intraepidermal (Suprabasal)', 'Subepidermal', 'Subepidermal (Microabscesses)'],
        ['Blister Consistency', 'Flaccid, Fragile, easily bursts', 'Tense, Thick-walled, durable', 'Tiny grouped pruritic vesicles'],
        ['Oral Mucosal Involvement', 'Frequent (> 95%, earliest sign)', 'Rare (< 10 – 20%)', 'Extremely rare'],
        ['Nikolsky Sign', 'POSITIVE', 'NEGATIVE', 'NEGATIVE'],
        ['Direct Immunofluorescence', 'Intercellular "Fish-net" IgG/C3', 'Linear basement membrane IgG/C3', 'Granular IgA in dermal papillae'],
        ['Definitive Treatment', 'Prednisolone + Rituximab', 'High-potency topical/oral steroids', 'Dapsone + Gluten-Free Diet'],
      ]
    },
    trapAlert: 'Nikolsky sign is POSITIVE in: Pemphigus Vulgaris, Staphylococcal Scalded Skin Syndrome (SSSS), Toxic Epidermal Necrolysis (TEN), and Hailey-Hailey disease. It is NEGATIVE in Bullous Pemphigoid, Dermatitis Herpetiformis, and Porphyria Cutanea Tarda.',
    whyOthersWrong: [
      { distractor: 'Direct immunofluorescence of Bullous Pemphigoid reveals fishnet intercellular staining', reason: 'Fishnet intercellular IgG staining is the hallmark of Pemphigus Vulgaris; BP shows smooth continuous linear basement membrane staining.' },
      { distractor: 'Pemphigus blisters are tense and resistant to rupture', reason: 'Due to suprabasal intraepidermal acantholysis, the roof consists of only a thin layer of stratum corneum, creating flaccid blisters that rupture immediately.' }
    ],
    clusterId: 'derm-blistering-pemphigus',
    pyqNotes: 'INI-CET Nov 2024, May 2026: Desmoglein 3 vs 1 targets; Nikolsky sign positive conditions.',
    verifyGuideline: 'Fitzpatrick\'s Dermatology in General Medicine 9th Edition & British Association of Dermatologists Guidelines'
  },
  {
    id: 'prl-hyperthermic-syndromes-psychiatry',
    num: 21,
    title: 'Hyperthermic Emergencies: NMS vs Serotonin Syndrome vs Malignant Hyperthermia',
    subject: 'Psychiatry',
    system: 'Neuropsychiatric Emergencies',
    yield: 3,
    tags: ['Emergency', 'DOC', 'Gold-Standard'],
    anchor: 'Antipsychotics + "Lead-pipe" rigidity + Hyporeflexia + high CPK = Neuroleptic Malignant Syndrome (DOC: Dantrolene / Bromocriptine). SSRI/MAOI + Hyperreflexia + CLONUS + Agitation + Mydriasis = Serotonin Syndrome (DOC: Cyproheptadine). Inhalational anesthetics/succinylcholine + muscle contracture + hypercapnia = Malignant Hyperthermia (DOC: IV Dantrolene).',
    highYieldSummary: [
      '**Neuroleptic Malignant Syndrome (NMS)**:',
      '• Culprits: Typical (Haloperidol, Fluphenazine) > Atypical antipsychotics (due to central Dopamine D2 blockade), or sudden withdrawal of Parkinsonian medications (Levodopa).',
      '• Tetrad: Hyperthermia (> 38°C / 100.4°F), Severe "lead-pipe" generalized muscle rigidity, Autonomic instability (tachycardia, labile BP, diaphoresis), Altered mental status.',
      '• Labs: Sky-high Creatine Kinase (CPK > 10,000 U/L), leukocytosis, myoglobinuria/rhabdomyolysis.',
      '• Neurological Exam: HYPOREFLEXIA and profound generalized rigidity (contrast with Serotonin Syndrome!).',
      '• Treatment: Discontinue offending agent stat; Supportive cooling and hydration; Pharmacotherapy: IV Dantrolene (ryanodine antagonist, relaxes muscle) + Bromocriptine / Amantadine (dopamine agonists).',
      '**Serotonin Syndrome (SS)**:',
      '• Culprits: Combination of SSRI, SNRI, MAOI, Tricyclics, Tramadol, Linezolid, MDMA (Ecstasy), St. John\'s Wort.',
      '• Hunter Toxicity Criteria (most sensitive): Spontaneous clonus, Inducible clonus + agitation/diaphoresis, Ocular clonus + tremor/hyperreflexia.',
      '• Neurological Exam: HYPERREFLEXIA and CLONUS (especially in lower extremities); Tremor, dilated pupils (mydriasis), hyperactive bowel sounds (diarrhea).',
      '• Treatment: Discontinue serotonergic drugs; IV Benzodiazepines (Diazepam) for agitation; Specific Antidote: Cyproheptadine (5-HT2A receptor antagonist).',
      '**Malignant Hyperthermia (MH)**:',
      '• Culprits: Volatile inhalational anesthetics (Halothane, Isoflurane) + Succinylcholine in genetically susceptible patients with RYR1 (Ryanodine receptor) mutation on chromosome 19q13.',
      '• Earliest Sign: UNEXPLAINED RAPID RISE IN END-TIDAL CO₂ (ETCO₂) followed by masseter muscle spasm / generalized rigidity, hyperthermia, and metabolic acidosis.',
      '• Treatment of Choice: Immediate cessation of anesthetics + Hyperventilate with 100% O₂ + IV DANTROLENE (2.5 mg/kg IV push, repeat up to 10 mg/kg).'
    ],
    table: {
      title: 'Hyperthermic Crises Master Discriminator Table',
      head: ['Feature', 'Neuroleptic Malignant Syndrome', 'Serotonin Syndrome', 'Malignant Hyperthermia'],
      rows: [
        ['Precipitating Trigger', 'Dopamine antagonists (Antipsychotics)', 'Serotonergic drugs (SSRI, MAOI, Linezolid)', 'Volatile anesthetics & Succinylcholine'],
        ['Onset Speed', 'Gradual over 1 – 3 days', 'Rapid within 24 hours of dose increase', 'Hyperacute during or immediately after anesthesia'],
        ['Muscle Tone', '"Lead-pipe" extreme rigidity throughout', 'Increased tone, lower limb predominance', 'Severe generalized muscle contracture / masseter spasm'],
        ['Reflexes / Clonus', 'HYPOREFLEXIA, No clonus', 'HYPERREFLEXIA, SPONTANEOUS CLONUS', 'Hyporeflexic / normal reflexes'],
        ['Pupils & Bowel', 'Normal pupils, normal/hypoactive bowel', 'MYDRIASIS, hyperactive bowel sounds / diarrhea', 'Normal pupils, metabolic acidosis'],
        ['Specific Antidote', 'Dantrolene / Bromocriptine', 'Cyproheptadine (5-HT2A blocker)', 'IV DANTROLENE (2.5 mg/kg bolus)'],
      ]
    },
    trapAlert: 'The single most reliable clinical discriminator between NMS and Serotonin Syndrome is NEUROMUSCULAR EXAM: NMS shows generalized "lead-pipe" rigidity with HYPOREFLEXIA; Serotonin syndrome shows pronounced HYPERREFLEXIA and spontaneous ocular/ankle CLONUS.',
    whyOthersWrong: [
      { distractor: 'Administer Cyproheptadine for haloperidol-induced rigidity and fever', reason: 'NMS is caused by dopamine D2 blockade; 5-HT antagonist Cyproheptadine is ineffective. NMS requires dopamine agonists (Bromocriptine) and Dantrolene.' },
      { distractor: 'Earliest sign of Malignant Hyperthermia is severe hyperthermia of 42°C', reason: 'Hyperthermia is a LATE sign; the earliest detectable sign under general anesthesia is an abrupt rise in End-Tidal CO2 refractory to ventilation.' }
    ],
    clusterId: 'psych-emergencies-nms',
    pyqNotes: 'INI-CET 2025, 2024: Discriminator between NMS and Serotonin syndrome (Clonus vs Lead-pipe); RYR1 gene in MH.',
    verifyGuideline: 'Kaplan & Sadock\'s Synopsis of Psychiatry 12th Ed & Miller\'s Anesthesia 9th Edition'
  },
  {
    id: 'prl-forensic-thanatology-time-since-death',
    num: 22,
    title: 'Thanatology: Post-Mortem Changes, Rigor Mortis, Lividity & Time Since Death',
    subject: 'Forensic Medicine',
    system: 'Forensic Pathology',
    yield: 3,
    tags: ['Gold-Standard', 'Formula', 'Volatile'],
    anchor: 'Nysten\'s Rule for Rigor Mortis: Starts at 1–2 hours in involuntary muscles → face/jaw (3–4 hrs) → spreads downwards → fully established in 12 hours → stays 12 hours → passes off in same order over next 12 hours ("12-12-12 rule" in Indian tropical climate). Fixed Post-Mortem Lividity at 6–8 hours.',
    highYieldSummary: [
      '**Algor Mortis (Post-Mortem Cooling)**:',
      '• Rate of cooling: Approximately 0.5–0.7°C per hour during first few hours, then 1°C per hour under moderate temperate conditions.',
      '• Temperature measured via chemical thermometer inserted into RECTUM (at least 10 cm deep) or subhepatic liver puncture.',
      '**Post-Mortem Lividity (Hypostasis / Suggillation)**:',
      '• Onset: Starts within 30 min to 1 hour after death as mottled patches in dependent, uncompressed parts of the body.',
      '• Fixation: Becomes completely FIXED at 6–8 hours (RBCs hemolyze and diffuse into perivascular tissues; does not blanch on finger pressure and does not shift if body position is altered).',
      '• Confusable: Lividity vs Bruise (Contusion) - In lividity, an incision washes clean with water; in contusion, extravasated coagulated blood does not wash away.',
      '• Colors of Lividity: Normal: Bluish-purple. Carbon Monoxide (CO): CHERRY-RED (carboxyhemoglobin). Cyanide: BRICK-RED / Pink. Nitrites / Chlorates / Aniline: CHOCOLATE-BROWN (methemoglobin). Hypothermia / Refrigeration: Bright PINK.',
      '**Cadaveric Spasm (Instantaneous Rigor)**:',
      '• Instantaneous stiffening of muscles at the exact moment of death WITHOUT preceding primary relaxation.',
      '• Pathognomonic of last voluntary act before death: Weapon firmly gripped in hand in suicide; grass/weeds gripped in drowning; clothing grasped in homicide struggle.'
    ],
    table: {
      title: 'Post-Mortem Lividity Diagnostic Color Matrix',
      head: ['Poison / Environmental Cause', 'Specific Color of Post-Mortem Lividity', 'Pathophysiological Mechanism'],
      rows: [
        ['Normal Asphyxia / Natural Death', 'Bluish-purple / Livid violet', 'Deoxyhemoglobin accumulation in venous cap'],
        ['Carbon Monoxide (CO)', 'CHERRY-RED', 'Carboxyhemoglobin formation (affinity 240×)'],
        ['Hydrogen Cyanide (HCN)', 'BRICK-RED / Bright pink', 'Histotoxic anoxia; oxyhemoglobin persists in veins'],
        ['Phosphorus / Potassium Chlorate', 'DARK CHOCOLATE-BROWN', 'Methemoglobinemia (oxidation of Fe²⁺ to Fe³⁺)'],
        ['Hypothermia / Freezing death', 'BRIGHT PINK / Red', 'Oxygen dissociation curve shifted to left; high HbO₂'],
        ['Hydrogen Sulfide (H₂S)', 'BLUISH-GREEN', 'Sulfhemoglobin formation in blood vessels'],
      ]
    },
    trapAlert: 'In drowning vs post-mortem submersion: Cadaveric spasm with weeds, sand, or water plants tightly clasped in the fist is ABSOLUTE INDISPUTABLE PROOF that the victim was alive when entering the water (ante-mortem drowning). It cannot be simulated post-mortem.',
    whyOthersWrong: [
      { distractor: 'Lividity shifts to newly dependent areas when body is moved 12 hours post-mortem', reason: 'Post-mortem hypostasis is irreversibly fixed by 6 to 8 hours due to capillary rupture and dermal staining; no shifting occurs after 8 hours.' },
      { distractor: 'Cadaveric spasm can be produced artificially after death by cooling the corpse', reason: 'Cadaveric spasm requires intact ATP-dependent vital antemortem nervous stimulation and cannot be produced post-mortem.' }
    ],
    clusterId: 'fmt-thanatology-rigor',
    pyqNotes: 'INI-CET 2026, 2024: Cherry-red vs chocolate-brown lividity; Nysten law sequence.',
    verifyGuideline: 'The Essentials of Forensic Medicine and Toxicology (K.S. Narayan Reddy 35th Edition)'
  },
  {
    id: 'prl-radiology-classic-imaging-signs',
    num: 23,
    title: 'Radiological Spotters & Classic Signs: X-Ray, Ultrasound, CT & MRI Signs',
    subject: 'Radiology',
    system: 'Diagnostic Imaging',
    yield: 3,
    tags: ['Image', 'Gold-Standard', 'Volatile'],
    anchor: 'Bird\'s beak sign = Achalasia Cardia (barium swallow) or Sigmoid Volvulus (barium enema). Pencil-in-cup = Psoriatic Arthritis. Apple-core sign = Colorectal Carcinoma. Target sign / Donut sign = Intussusception. Double bubble = Duodenal Atresia. Stepladder sign = Small bowel obstruction.',
    highYieldSummary: [
      '**Gastrointestinal Tract Classic Signs**:',
      '• Achalasia Cardia: Barium swallow shows smooth tapering of lower esophagus resembling a "BIRD\'S BEAK" or rat-tail with proximal esophageal dilatation.',
      '• Sigmoid Volvulus: Abdominal X-ray shows dilated ahaustral sigmoid loop resembling an inverted U or "COFFEE BEAN SIGN" pointing towards the right upper quadrant; Barium enema shows "bird-beak" at obstruction site.',
      '• Cecal Volvulus: Dilated cecum shaped like a comma or "KIDNEY BEAN SIGN" with apex pointing towards left upper quadrant.',
      '• Duodenal Atresia: Plain abdominal radiograph in newborn shows "DOUBLE BUBBLE SIGN" (gas in stomach and proximal duodenum with absence of distal gas); associated with Down Syndrome (Trisomy 21).',
      '• Intussusception: Ultrasound abdomen shows concentric rings of bowel known as the "TARGET SIGN" (transverse) or "PSEUDOKIDNEY SIGN" (longitudinal).',
      '**Musculoskeletal & Rheumatology Signs**:',
      '• Psoriatic Arthritis: Hand radiograph shows erosion of proximal phalanx with widening of base of distal phalanx resembling a "PENCIL-IN-CUP" deformity.',
      '• Osteosarcoma: "SUNBURST" periosteal reaction and Codman\'s triangle at metaphysis of long bones.',
      '• Ewing Sarcoma: Concentric "ONION-SKIN" lamellated periosteal reaction in diaphysis of long bones.'
    ],
    table: {
      title: 'The Master Radiology Classic Signs Spotter Matrix',
      head: ['Imaging Sign Name', 'Modality of Choice', 'Underlying Pathology', 'Key High-Yield Clinical Pearl'],
      rows: [
        ['Bird\'s Beak Sign (Esophagus)', 'Barium Swallow', 'Achalasia Cardia', 'Failure of LES relaxation + aperistalsis'],
        ['Coffee Bean Sign', 'Plain X-Ray Abdomen', 'Sigmoid Volvulus', 'Inverted U-loop pointing to right upper quadrant'],
        ['Double Bubble Sign', 'Plain X-Ray Abdomen (Erect)', 'Duodenal Atresia', 'Failure of recanalization, Down syndrome'],
        ['Apple-Core Sign', 'Barium Enema / CT Colonography', 'Colorectal Adenocarcinoma', 'Annular constricting circumferential mass'],
        ['Target / Donut Sign', 'Ultrasound Abdomen', 'Intussusception', 'Ileocolic invagination; air-contrast reduction'],
        ['Pencil-in-Cup Deformity', 'Plain X-Ray Hands/Feet', 'Psoriatic Arthritis', 'DIP joint erosion with telescoping digits'],
        ['Sunburst Periosteal Reaction', 'Plain Radiograph', 'Osteosarcoma', 'Malignant osteoid formation at metaphysis'],
        ['Onion-Skinning', 'Plain Radiograph', 'Ewing Sarcoma', 't(11;22) translocation, CD99/MIC2 positive'],
        ['Bamboo Spine', 'Pelvis & Spine X-Ray', 'Ankylosing Spondylitis', 'Syndesmophytes bridging vertebral bodies, HLA-B27'],
      ]
    },
    trapAlert: 'Double bubble sign with ABSENCE of distal bowel gas = Duodenal Atresia (requires surgical duodenoduodenostomy). Double bubble sign WITH presence of distal bowel gas = Duodenal Stenosis, Annular Pancreas, or Midgut Malrotation with Ladd\'s bands (requires emergency Upper GI series to rule out volvulus!).',
    whyOthersWrong: [
      { distractor: 'Sunburst appearance is pathognomonic of Ewing sarcoma', reason: 'Sunburst periosteal reaction is characteristic of Osteosarcoma; Ewing sarcoma classically displays concentric onion-skin lamellation.' },
      { distractor: 'Barium enema is the primary diagnostic and therapeutic modality in pediatric ileocolic intussusception', reason: 'Ultrasound is the imaging of choice for diagnosis; hydrostatic (saline) or pneumatic (air) enema under ultrasound/fluoroscopy is used for reduction.' }
    ],
    clusterId: 'rad-classic-signs',
    pyqNotes: 'INI-CET 2026, 2025: Coffee bean sign vs bird-beak; Double bubble with vs without distal air.',
    verifyGuideline: 'Grainger & Allison\'s Diagnostic Radiology 7th Edition'
  },
  {
    id: 'prl-cushing-adrenal-incidentaloma',
    num: 24,
    title: 'Adrenal Disorders: Cushing Syndrome Diagnostic Cascade & Pheochromocytoma',
    subject: 'Medicine',
    system: 'Endocrinology',
    yield: 3,
    tags: ['Gold-Standard', 'IOC', 'Next-Step', 'Formula'],
    anchor: 'Step 1: Confirm Hypercortisolism (2 positive first-line tests: 1 mg Overnight Dexamethasone Suppression Test, 24-hr Urinary Free Cortisol, or Late-Night Salivary Cortisol). Step 2: Measure Plasma ACTH (< 5 pg/mL = ACTH-independent adrenal adenoma/carcinoma; > 15–20 pg/mL = ACTH-dependent). Step 3: High-Dose (8 mg) DST differentiates Cushing Disease (pituitary suppresses) from Ectopic ACTH (does not suppress).',
    highYieldSummary: [
      '**Stepwise Cushing\'s Syndrome Evaluation**:',
      '• Step 1: Rule out exogenous glucocorticoid intake! Then perform at least 2 first-line screening tests:',
      '  - 1 mg Overnight Dexamethasone Suppression Test (ODST): Normal is serum cortisol < 1.8 µg/dL (< 50 nmol/L) at 8:00 AM. If ≥ 1.8 µg/dL → Positive.',
      '  - 24-hour Urinary Free Cortisol (UFC): Positive if > 3× upper limit of normal.',
      '  - Late-night salivary cortisol (at 11:00 PM): Detects loss of normal diurnal circadian rhythm.',
      '• Step 2: Measure baseline morning plasma ACTH:',
      '  - Low ACTH (< 5 pg/mL): ACTH-Independent Cushing\'s → Order Contrast-enhanced CT Adrenals.',
      '  - Normal / High ACTH (> 15–20 pg/mL): ACTH-Dependent Cushing\'s → Proceed to Step 3.',
      '• Step 3: High-Dose Dexamethasone Suppression Test (HDDST, 8 mg) + Pituitary MRI:',
      '  - Cortisol suppresses by > 50%: Cushing\'s Disease (Pituitary adenoma, 80% of ACTH-dependent cases).',
      '  - Cortisol FAILS to suppress: Ectopic ACTH production (Small cell lung carcinoma, bronchial carcinoid).',
      '**Pheochromocytoma 10% Rules & Pre-op Blockade**:',
      '• Initial screening test: Plasma free fractionated Metanephrines or 24-hr urinary metanephrines.',
      '• Localization: Contrast CT/MRI abdomen; 123I-MIBG or 68Ga-DOTATATE PET scan.',
      '• Pre-operative Medical Optimization: ALPHA-BLOCKADE FIRST (Phenoxybenzamine 10–14 days prior to surgery) until orthostasis achieved; BETA-BLOCKER STARTED ONLY AFTER ADEQUATE ALPHA-BLOCKADE! (Beta-blockade alone causes unopposed alpha-agonism and lethal hypertensive crisis).'
    ],
    table: {
      title: 'Cushing Syndrome Stepwise Diagnostic Cascade Matrix',
      head: ['Etiology', 'Plasma ACTH Level', 'High-Dose (8 mg) DST', 'Pituitary MRI / Imaging'],
      rows: [
        ['Pituitary Adenoma (Cushing Disease)', 'Elevated / Inappropriately Normal', 'SUPPRESSION (> 50% fall in cortisol)', 'Pituitary microadenoma on dynamic MRI'],
        ['Ectopic ACTH (Small Cell Lung CA)', 'Markedly Elevated (> 100 pg/mL)', 'NO SUPPRESSION (< 50% fall)', 'Normal pituitary; CT Chest shows lung mass'],
        ['Adrenal Adenoma / Carcinoma', 'Suppressed / Undetectable (< 5 pg/mL)', 'NO SUPPRESSION', 'Unilateral adrenal nodule on CT Adrenals'],
        ['Exogenous Steroids', 'Suppressed / Undetectable', 'Suppressed / variable', 'Bilateral atrophic adrenal glands'],
      ]
    },
    trapAlert: 'In Pheochromocytoma, NEVER start a β-blocker (like Propranolol) before establishing complete α-blockade! Unopposed stimulation of α1-receptors by circulating catecholamines leads to severe vasoconstriction, acute pulmonary edema, and hypertensive hemorrhage.',
    whyOthersWrong: [
      { distractor: 'Initiate Propranolol for tachycardia before starting Phenoxybenzamine in Pheochromocytoma', reason: 'Blocking beta-2 mediated vasodilation leaves alpha-1 vasoconstriction unopposed, precipitating catastrophic hypertensive encephalopathy.' },
      { distractor: 'Perform Pituitary MRI as the very first test in a patient with moon facies', reason: 'Imaging before biochemical confirmation of hypercortisolism leads to false discovery of incidental pituitary incidentalomas (present in 10% of normal population).' }
    ],
    clusterId: 'med-endocrine-adrenal',
    pyqNotes: 'INI-CET Nov 2024: Pre-op drug sequence in Pheochromocytoma; Cut-off for 1 mg ODST (1.8 ug/dL).',
    verifyGuideline: 'Endocrine Society Clinical Practice Guidelines: Treatment of Cushing\'s Syndrome 2021'
  },
  {
    id: 'prl-pulmonary-embolism-wells',
    num: 25,
    title: 'Pulmonary Embolism & DVT: Wells Score, PERC Rule, PESI & Reperfusion',
    subject: 'Medicine',
    system: 'Pulmonology / Critical Care',
    yield: 3,
    tags: ['Gold-Standard', 'IOC', 'Emergency', 'Formula'],
    anchor: 'Sudden pleuritic chest pain + dyspnea + tachycardia. Gold standard / Investigation of choice is CT Pulmonary Angiography (CTPA). If hemodynamically unstable (SBP < 90 mmHg) → Bedside Transthoracic Echocardiogram (McConnell\'s sign) → Immediate Systemic Thrombolysis (Alteplase 100 mg IV over 2 hours).',
    highYieldSummary: [
      '**Wells Score for Pulmonary Embolism**:',
      '• Clinical signs and symptoms of DVT: +3.0',
      '• PE is #1 diagnosis or equally likely: +3.0',
      '• Heart rate > 100 bpm: +1.5',
      '• Immobilization (≥ 3 days) or surgery in previous 4 weeks: +1.5',
      '• Previous objectively diagnosed PE or DVT: +1.5',
      '• Hemoptysis: +1.0',
      '• Malignancy (treatment within 6 months or palliative): +1.0',
      '• Score interpretation: ≤ 4 points (PE Unlikely) → High-sensitivity D-dimer. Score > 4 points (PE Likely) → CT Pulmonary Angiography (CTPA) directly without waiting for D-dimer.',
      '**PERC Rule (Pulmonary Embolism Rule-out Criteria)**: Used ONLY when clinical suspicion is very low. If ALL 8 criteria met (Age < 50, HR < 100, SpO₂ ≥ 95%, No hemoptysis, No estrogen use, No prior DVT/PE, No unilateral leg swelling, No surgery/trauma < 4 wks) → PE ruled out without testing or D-dimer.',
      '**Hemodynamic Risk Stratification & Reperfusion**:',
      '• High-Risk (Massive) PE: Sustained hypotension (SBP < 90 mmHg or drop ≥ 40 mmHg for > 15 min), obstructive shock, or cardiac arrest → Systemic Thrombolysis with IV Alteplase (100 mg over 2 hours) or surgical embolectomy.',
      '• Intermediate-Risk (Submassive) PE: Normotensive, but with RV dysfunction (Echo / CT) AND elevated Cardiac Biomarkers (Troponin / BNP) → Anticoagulation + close monitoring in ICU.',
      '• Low-Risk PE: Normotensive, normal RV, normal biomarkers → Direct Oral Anticoagulant (DOAC: Apixaban or Rivaroxaban) as outpatient.'
    ],
    table: {
      title: 'Pulmonary Embolism Severity & Management Classification',
      head: ['PE Risk Category', 'Hemodynamic Status', 'RV Strain / Biomarkers', 'First-Line Management'],
      rows: [
        ['Massive / High Risk', 'Unstable (SBP < 90 mmHg / Shock)', 'RV dysfunction & elevated Troponin', 'Systemic Thrombolysis (Alteplase 100 mg)'],
        ['Submassive Intermediate-High', 'Stable (SBP ≥ 90 mmHg)', 'BOTH RV dysfunction AND elevated Troponin', 'Therapeutic Anticoagulation + ICU monitoring'],
        ['Submassive Intermediate-Low', 'Stable (SBP ≥ 90 mmHg)', 'EITHER RV strain OR elevated Troponin (not both)', 'Therapeutic Anticoagulation (DOAC / LMWH)'],
        ['Low Risk', 'Stable (SBP ≥ 90 mmHg)', 'Normal RV on Echo, Normal Troponin', 'DOAC (Apixaban / Rivaroxaban) outpatient'],
      ]
    },
    trapAlert: 'In high-risk massive PE with shock (BP 70/40), NEVER send the patient down to radiology for CTPA ("Death in the radiology suite"). Perform immediate bedside Echocardiogram; if RV dilatation and McConnell\'s sign (apical sparing) are seen in an unstable patient, initiate immediate IV thrombolysis.',
    whyOthersWrong: [
      { distractor: 'Transport unstable patient in cardiogenic shock to radiology for CTPA', reason: 'Hemodynamically unstable patients must not leave the resuscitation bay; bedside echocardiography suffices to justify immediate thrombolysis.' },
      { distractor: 'Order D-dimer in a post-op patient with tachycardia, leg swelling, and Wells score 7.5', reason: 'High clinical pretest probability mandates definitive imaging with CTPA; D-dimer will be positive and wastes crucial therapeutic time.' }
    ],
    clusterId: 'med-respiratory-pe',
    pyqNotes: 'INI-CET 2026, 2025: Wells score cutoffs; McConnell sign on echo; Thrombolysis in massive PE.',
    verifyGuideline: 'ESC Guidelines for the Diagnosis and Management of Acute Pulmonary Embolism 2020 / CHEST 2021'
  }
];
