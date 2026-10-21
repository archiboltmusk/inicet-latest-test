export interface ConfusablePair {
  id: string;
  title: string;
  entities: string[];
  subject: string;
  clue: string;
  differentiatingKey: string;
  table: {
    feature: string;
    values: string[];
  }[];
  trapAlert: string;
  clusterIds?: string[];
}

export const CONFUSABLE_PAIRS: ConfusablePair[] = [
  {
    id: 'ttp-hus-dic-itp',
    title: 'Microangiopathic Haemolytic Anaemias & Thrombocytopenia',
    entities: ['TTP', 'HUS', 'DIC', 'ITP'],
    subject: 'Medicine / Pathology',
    clue: 'Patient with severe thrombocytopenia and bleeding/petechiae. First look at PT/aPTT, then peripheral smear for schistocytes, then neuro vs renal dominance.',
    differentiatingKey: 'Normal PT/aPTT rules out DIC. Schistocytes confirm MAHA (rules out ITP). Neuro predominance = TTP; Renal anuria in kids = HUS.',
    table: [
      { feature: 'Pathophysiology', values: ['ADAMTS13 deficiency (vWF cleaving protease)', 'Shiga toxin (EHEC O157:H7) endothelial damage', 'Systemic coagulation activation & consumption', 'Anti-GpIIb/IIIa autoantibodies'] },
      { feature: 'MAHA (Schistocytes)', values: ['Yes (prominent)', 'Yes (prominent)', 'Yes (present)', 'No (clean smear)'] },
      { feature: 'PT & aPTT', values: ['Normal', 'Normal', 'Prolonged (both)', 'Normal'] },
      { feature: 'Fibrinogen / D-dimer', values: ['Normal / Normal', 'Normal / Normal', 'Low Fibrinogen / Very High D-dimer', 'Normal / Normal'] },
      { feature: 'Dominant Clinical Organ', values: ['Neurological (confusion, headache, seizure)', 'Renal (oliguria, anuria, rising Cr)', 'Multiorgan bleeding + thrombosis', 'Isolated bleeding (mucocutaneous)'] },
      { feature: 'First-Line Management', values: ['Emergent Plasma Exchange (PEX). DO NOT give platelets!', 'Supportive care + dialysis (eculizumab if atypical)', 'Treat underlying cause + blood products (cryo/FFP/platelets)', 'Steroids / IVIG (platelets only for life-threatening bleed)'] },
    ],
    trapAlert: 'Giving platelet transfusion in TTP triggers catastrophic microthrombosis ("fuel to the fire"). Never give platelets in TTP unless intracranial haemorrhage is occurring.',
    clusterIds: ['med-glomerulopathies', 'path-leukemia']
  },
  {
    id: 'nms-serotonin-mh',
    title: 'Hyperthermic Syndromes: NMS vs Serotonin Syndrome vs Malignant Hyperthermia',
    entities: ['Neuroleptic Malignant (NMS)', 'Serotonin Syndrome (SS)', 'Malignant Hyperthermia (MH)'],
    subject: 'Psychiatry / Pharmacology / Anaesthesia',
    clue: 'Severe hyperthermia + muscle rigidity + autonomic instability. Look at the offending drug class and reflexes/clonus.',
    differentiatingKey: 'Reflexes: NMS = hyporeflexia with lead-pipe rigidity; SS = hyperreflexia with clonus/tremor. Halogenated anaesthetics = MH.',
    table: [
      { feature: 'Causative Agents', values: ['Dopamine antagonists (haloperidol, fluphenazine, antiemetics) or L-dopa withdrawal', 'Serotonergic combinations (SSRI + MAOI, tramadol, linezolid, dextromethorphan, triptans)', 'Inhalational anaesthetics (halothane, isoflurane) + succinylcholine'] },
      { feature: 'Onset Tempo', values: ['Days to weeks (insidious)', 'Hours (< 24 h, rapid)', 'Minutes to hours during/post anaesthesia'] },
      { feature: 'Muscle Tone & Reflexes', values: ['Lead-pipe rigidity, hyporeflexia', 'Tremor, hyperreflexia, ocular & ankle clonus', 'Masseter muscle spasm, generalized rigidity'] },
      { feature: 'Pupils & Bowel Sounds', values: ['Normal pupils, normal/hypoactive bowel', 'Mydriasis (dilated), hyperactive bowel (diarrhoea)', 'Normal pupils'] },
      { feature: 'Earliest / Key Sign', values: ['Muscle rigidity & fever', 'Neuromuscular excitation & hyperreflexia', 'Unexplained rise in End-Tidal CO2 (ETCO2)'] },
      { feature: 'Specific Antidote', values: ['Bromocriptine (dopamine agonist) / Dantrolene', 'Cyproheptadine (5-HT2 antagonist)', 'Dantrolene (Ryanodine receptor blocker) 2.5 mg/kg IV'] },
    ],
    trapAlert: 'Do not confuse clonus (SS) with lead-pipe rigidity (NMS). Ankle clonus or shivering always points to Serotonin Syndrome.',
    clusterIds: ['psy-psychopharm', 'ana-agents']
  },
  {
    id: 'pemphigus-pemphigoid',
    title: 'Vesiculobullous Disorders: Pemphigus Vulgaris vs Bullous Pemphigoid',
    entities: ['Pemphigus Vulgaris', 'Bullous Pemphigoid'],
    subject: 'Dermatology',
    clue: 'Elderly or middle-aged patient with blistering skin lesions. Check mucosal involvement, blister tenseness, and Nikolsky sign.',
    differentiatingKey: 'Pemphigus: Flaccid, Nikolsky+, oral mucosa first, suprabasal split. Pemphigoid: Tense, Nikolsky-, mucosal sparing, subepidermal split.',
    table: [
      { feature: 'Age Group', values: ['Middle-aged (40–60 years)', 'Elderly (> 60–70 years)'] },
      { feature: 'Blister Morphology', values: ['Flaccid, fragile, rupture easily leaving painful raw erosions', 'Tense, sturdy bullae, difficult to rupture'] },
      { feature: 'Mucosal Involvement', values: ['Involved early in > 70% (oral erosions precede skin)', 'Rare / mild (< 10–20%)'] },
      { feature: 'Nikolsky & Asboe-Hansen Signs', values: ['Positive (lateral skin sloughs with tangential friction)', 'Negative'] },
      { feature: 'Histology Split Level', values: ['Suprabasal intra-epidermal split with acantholysis', 'Subepidermal split (intact epidermis roof, no acantholysis)'] },
      { feature: 'Target Antigen', values: ['Desmoglein 3 (mucosa) ± Desmoglein 1 (skin)', 'BP180 (type XVII collagen) and BP230'] },
      { feature: 'Direct Immunofluorescence (DIF)', values: ['Intercellular "fishnet" / chicken-wire pattern of IgG/C3', 'Linear continuous band of IgG and C3 along basement membrane'] },
    ],
    trapAlert: 'The "tombstone" appearance of the basal keratinocyte row is pathognomonic for Pemphigus Vulgaris, where the hemidesmosomes remain anchored.',
    clusterIds: ['der-vesiculobullous']
  },
  {
    id: 'crohn-uc',
    title: 'Inflammatory Bowel Disease: Crohn Disease vs Ulcerative Colitis',
    entities: ['Crohn Disease', 'Ulcerative Colitis'],
    subject: 'Medicine / Surgery',
    clue: 'Chronic diarrhea, abdominal pain, rectal bleeding. Inspect distribution, depth of involvement, and extraintestinal associations.',
    differentiatingKey: 'Crohn: Transmural, skip lesions, ileum, granulomas, fistulae, smoking worsens. UC: Mucosal, continuous from rectum, crypt abscess, toxic megacolon, smoking protective.',
    table: [
      { feature: 'Anatomical Distribution', values: ['Mouth to anus; terminal ileum commonest; rectal sparing', 'Colon only; starts in rectum and extends continuously proximally'] },
      { feature: 'Pattern of Involvement', values: ['Skip lesions ("cobblestone" mucosa)', 'Continuous, uniform inflammation without skip areas'] },
      { feature: 'Depth of Wall Involvement', values: ['Transmural (all layers) → fistulae, strictures, fat creeping', 'Mucosa and submucosa only'] },
      { feature: 'Pathology & Biopsy', values: ['Non-caseating epithelioid granulomas (~50%)', 'Crypt architectural distortion, cryptitis, crypt abscesses; NO granulomas'] },
      { feature: 'Gross Features & Radiology', values: ['String sign of Kantor, deep linear knife-like ulcers', 'Lead-pipe appearance (loss of haustra), collar-button ulcers, pseudopolyps'] },
      { feature: 'Serology Marker', values: ['ASCA positive (anti-Saccharomyces cerevisiae)', 'p-ANCA (perinuclear ANCA) positive'] },
      { feature: 'Smoking Relationship', values: ['Smoking is a strong risk factor & worsens disease', 'Smoking is protective / ex-smokers at higher risk'] },
      { feature: 'Classic Complications', values: ['Strictures, bowel obstruction, perianal fistulae/abscesses', 'Toxic megacolon, massive rectal bleeding, PSC & colorectal carcinoma'] },
    ],
    trapAlert: 'Primary Sclerosing Cholangitis (PSC) is strongly associated with Ulcerative Colitis (70-80% of PSC patients have UC), not Crohn disease.',
    clusterIds: ['surg-gi-malignancy']
  },
  {
    id: 'prerenal-atn',
    title: 'Acute Kidney Injury: Pre-Renal Azotemia vs Acute Tubular Necrosis (ATN)',
    entities: ['Pre-Renal Azotemia', 'Intrinsic ATN'],
    subject: 'Medicine / Nephrology',
    clue: 'Abrupt elevation of BUN and serum creatinine with oliguria. Differentiate hypoperfusion from intrinsic tubular necrosis to decide on aggressive fluid resuscitation.',
    differentiatingKey: 'FeNa < 1% & Urine Na < 20 = Pre-renal (tubules still reabsorbing Na); FeNa > 2% & Urine Na > 40 = ATN (tubules damaged, salt wasting).',
    table: [
      { feature: 'Fractional Excretion of Na (FeNa)', values: ['< 1% (kidneys avidly retaining sodium)', '> 2% (damaged tubules cannot reabsorb sodium)'] },
      { feature: 'Spot Urine Sodium', values: ['< 20 mEq/L', '> 40 mEq/L'] },
      { feature: 'BUN / Serum Creatinine Ratio', values: ['> 20:1 (disproportionate BUN rise due to slow flow)', '10–15:1 (standard ratio maintained)'] },
      { feature: 'Urine Specific Gravity / Osmolality', values: ['> 1.020 / > 500 mOsm/kg (concentrated urine)', '< 1.010 / < 350 mOsm/kg (isosthenuric urine)'] },
      { feature: 'Urine Microscopy', values: ['Hyaline casts or normal', 'Muddy brown granular casts, renal tubular epithelial cells'] },
      { feature: 'Response to IV Fluid Bolus', values: ['Rapid normalization of urine output & Cr fall', 'No immediate response (may risk fluid overload)'] },
    ],
    trapAlert: 'If patient is on loop diuretics, FeNa can be falsely elevated > 1% in pre-renal failure! Use Fractional Excretion of Urea (FeUrea < 35% confirms pre-renal).',
    clusterIds: ['med-acid-base']
  },
  {
    id: 'cah-enzymes',
    title: 'Congenital Adrenal Hyperplasia (CAH): 21-OH vs 11β-OH vs 17α-OH',
    entities: ['21-Hydroxylase Deficiency (90%)', '11β-Hydroxylase Deficiency (5-8%)', '17α-Hydroxylase Deficiency (rare)'],
    subject: 'Pediatrics / Biochemistry',
    clue: 'Neonate or infant with abnormal genitalia or failure to thrive. Check Blood Pressure and Genitalia to instantly pinpoint the deficient enzyme.',
    differentiatingKey: 'BP: If starts with 1 (11, 17) -> Hypertension! Genitalia: If ends with 1 (21, 11) -> Virilised female (excess androgens).',
    table: [
      { feature: 'Blood Pressure', values: ['HYPOTENSION / Shock (Salt-wasting)', 'HYPERTENSION (11-Deoxycorticosterone excess)', 'HYPERTENSION (Corticosterone excess)'] },
      { feature: 'Potassium Level', values: ['Hyperkalaemia', 'Hypokalaemia', 'Hypokalaemia'] },
      { feature: 'Female Genitalia (46,XX)', values: ['Virilised / Ambiguous (clitoromegaly)', 'Virilised / Ambiguous', 'Phenotypically Female / Normal infant'] },
      { feature: 'Male Genitalia (46,XY)', values: ['Normal / precocious puberty later', 'Normal / precocious puberty later', 'Undervirilised / Ambiguous / Female appearance'] },
      { feature: 'Diagnostic Elevated Hormone', values: ['17-Hydroxyprogesterone (17-OHP)', '11-Deoxycorticosterone (DOC) & 11-Deoxycortisol', 'Corticosterone & Progesterone (Low 17-OHP)'] },
      { feature: 'Mineralocorticoid Activity', values: ['Deficient', 'High (due to 11-DOC)', 'High (due to 11-DOC & corticosterone)'] },
    ],
    trapAlert: 'The mnemonic rule: "If it starts with 1, it has high blood pressure (11, 17). If it ends with 1, it causes virilization in females (21, 11)."',
    clusterIds: ['bio-iem-amino-acids']
  },
  {
    id: 'transudate-exudate',
    title: 'Pleural Effusion: Transudate vs Exudate (Light Criteria)',
    entities: ['Transudative Effusion', 'Exudative Effusion'],
    subject: 'Medicine / Respiratory',
    clue: 'Pleural tap fluid analysis. Determine if effusion is due to systemic hydrostatic/oncotic forces or local pleural pathology.',
    differentiatingKey: 'Light\'s Criteria: Exudate if ANY ONE of the 3 is positive: Pleural/Serum Protein > 0.5, Pleural/Serum LDH > 0.6, Pleural LDH > 2/3 upper limit normal serum LDH.',
    table: [
      { feature: 'Pleural / Serum Protein Ratio', values: ['≤ 0.5', '> 0.5'] },
      { feature: 'Pleural / Serum LDH Ratio', values: ['≤ 0.6', '> 0.6'] },
      { feature: 'Pleural LDH vs Normal Serum ULN', values: ['≤ 2/3 of normal upper limit', '> 2/3 of normal upper limit (typically > 200 U/L)'] },
      { feature: 'Mechanism', values: ['↑ Hydrostatic pressure (CHF) or ↓ Oncotic pressure (Cirrhosis, Nephrotic)', '↑ Capillary permeability or lymphatic obstruction (Infection, Cancer, PE)'] },
      { feature: 'Pleural Fluid Glucose', values: ['Equal to serum glucose (> 60 mg/dL)', 'Can be very low (< 30 mg/dL in Empyema, Rheumatoid)'] },
      { feature: 'Common Etiologies', values: ['Congestive Heart Failure (most common), Cirrhosis, Nephrotic syndrome', 'Pneumonia (parapneumonic), Malignancy (lung, breast, lymphoma), Tuberculosis, Pulmonary Embolism'] },
    ],
    trapAlert: 'If a patient with Congestive Heart Failure is on heavy loop diuretics, the pleural effusion can falsely meet exudative criteria by protein concentration. Check serum-to-pleural albumin gradient: if > 1.2 g/dL, it is truly transudative.',
    clusterIds: ['med-heart-failure-valves']
  },
  {
    id: 'myasthenia-lambert',
    title: 'Neuromuscular Junction: Myasthenia Gravis vs Lambert-Eaton (LEMS)',
    entities: ['Myasthenia Gravis (MG)', 'Lambert-Eaton Myasthenic (LEMS)'],
    subject: 'Medicine / Neurology',
    clue: 'Muscle weakness affecting limbs, eyes, or bulbar muscles. Assess relation to exertion, DTRs, autonomic symptoms, and paraneoplastic association.',
    differentiatingKey: 'MG: Post-synaptic AChR antibody, weakness WORSE with exercise, DTRs normal, Thymoma. LEMS: Pre-synaptic VGCC antibody, weakness IMPROVES with exercise, DTRs absent, SCLC.',
    table: [
      { feature: 'Target Antigen Location', values: ['Post-synaptic Nicotinic ACh Receptors (AChR)', 'Pre-synaptic Voltage-Gated Calcium Channels (P/Q-type VGCC)'] },
      { feature: 'Effect of Exercise / Repetitive Use', values: ['Fatigable weakness: WORSENS with exertion throughout the day', 'Incremental strength: IMPROVES initially with repetitive exercise'] },
      { feature: 'Eye & Bulbar Involvement', values: ['Early and prominent (Ptosis, diplopia, dysphagia in > 80%)', 'Rare / mild; primarily proximal lower limb girdle weakness'] },
      { feature: 'Deep Tendon Reflexes (DTRs)', values: ['Normal', 'Depressed or ABSENT (recover after brief muscle contraction)'] },
      { feature: 'Autonomic Dysfunction', values: ['Absent', 'Present (Dry mouth/xerostomia, erectile dysfunction, constipation)'] },
      { feature: 'Repetitive Nerve Stimulation (RNS)', values: ['Decremental response at low-frequency stimulation (3 Hz)', 'Incremental response (> 100% increase) at high-frequency (20–50 Hz) or post-exercise'] },
      { feature: 'Associated Neoplasm', values: ['Thymoma (10–15%) or Thymic hyperplasia (65%)', 'Small Cell Lung Carcinoma (SCLC) (> 50–60%)'] },
    ],
    trapAlert: 'Dry mouth and absent tendon reflexes that return after 10 seconds of maximal isometric contraction are the classic clinical discriminators for LEMS.',
    clusterIds: ['med-brainstem-syndromes']
  },
  {
    id: 'croup-epiglottitis',
    title: 'Paediatric Upper Airway: Croup vs Acute Epiglottitis',
    entities: ['Croup (Laryngotracheobronchitis)', 'Acute Epiglottitis'],
    subject: 'Pediatrics / ENT',
    clue: 'Child with acute inspiratory stridor and respiratory distress. Assess speed of onset, cough characteristics, posture, and drooling.',
    differentiatingKey: 'Croup: Parainfluenza, barking seal cough, subacute, Steeple sign on AP X-ray. Epiglottitis: H. influenzae b, toxic, drooling, tripod, NO cough, Thumbprint on lateral X-ray.',
    table: [
      { feature: 'Common Pathogen', values: ['Parainfluenza virus (types 1 and 2)', 'Haemophilus influenzae type b (Hib), Streptococcus pyogenes'] },
      { feature: 'Age Group & Onset', values: ['6 months – 3 years; subacute onset preceded by coryza/URTI', '2 – 7 years; hyperacute progression (hours)'] },
      { feature: 'Barking Cough', values: ['Characteristic "seal-like" barking cough present', 'ABSENT (throat is too painful to cough)'] },
      { feature: 'Posture & Drooling', values: ['Lies down comfortably; no drooling', 'Tripod / sniffing position; prominent drooling; dysphagia'] },
      { feature: 'Neck X-Ray Sign', values: ['Steeple sign (subglottic tracheal narrowing on AP view)', 'Thumbprint sign (swollen edematous epiglottis on lateral view)'] },
      { feature: 'Physical Examination Warning', values: ['Throat exam safe and straightforward', 'DO NOT examine throat with tongue depressor (triggers fatal laryngospasm!)'] },
      { feature: 'Immediate Management', values: ['Oral Dexamethasone 0.6 mg/kg ± Nebulized Adrenaline', 'Endotracheal intubation in OR/ICU + IV Ceftriaxone/Vancomycin'] },
    ],
    trapAlert: 'Never send a child suspected of acute epiglottitis to radiology unescorted or try to look into the throat with a spatula in the clinic. Prepare for immediate airway control in the operating room.',
    clusterIds: ['ent-larynx-neck']
  }
];
