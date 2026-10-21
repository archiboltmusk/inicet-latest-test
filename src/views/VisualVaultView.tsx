import React, { useState, useMemo } from 'react';
import { useAppState, SUBJECTS } from '../state';
import { MedicalVisualPlayer } from '../components/MedicalVisualPlayer';
import { ClinicalSimulationVideo, CLINICAL_SIMULATIONS } from '../components/ClinicalSimulationVideo';
import { sound } from '../utils/audio';

interface VaultItem {
  id: string;
  type: 'image' | 'simulation';
  title: string;
  subject: string;
  modality: 'Histology' | 'Radiology' | 'ECG' | 'Clinical' | 'Simulation';
  src?: string;
  simulationId?: string;
  caption: string;
  clues: string[];
  aiimsTrap?: string;
  credit?: string;
  licence?: string;
}

const VAULT_ITEMS: VaultItem[] = [
  // Interactive Simulations & Video Walkthroughs
  {
    id: 'sim-acls',
    type: 'simulation',
    title: 'ACLS Shockable vs Non-Shockable Interactive Monitor & CPR Loop',
    subject: 'Medicine',
    modality: 'Simulation',
    simulationId: 'acls-simulation',
    caption: 'Dynamic oscilloscope ECG waveform showing Ventricular Fibrillation (VF) vs Asystole/PEA, biphasic defibrillation, adrenaline timing, and amiodarone bolus dosing.',
    clues: ['Unsynchronized 120-200J shock', 'Resume CPR immediately without pulse check', 'Amiodarone 300 mg bolus after 3rd shock'],
    aiimsTrap: 'Do NOT stop CPR to check pulse immediately after delivering a shock. Resume 2 min CPR immediately!'
  },
  {
    id: 'sim-k',
    type: 'simulation',
    title: 'Hyperkalemia ECG Morphing Progression & Calcium Gluconate',
    subject: 'Medicine',
    modality: 'Simulation',
    simulationId: 'hyperkalemia-ecg',
    caption: 'Morphing cardiac electrophysiology from normal 4.0 mEq/L to tall narrow peaked T waves, prolonged PR, flattening P waves, and fatal Sine Wave pattern.',
    clues: ['Tall tented narrow-based T waves in V2-V4', 'Loss of P waves (sino-ventricular conduction)', 'IV Calcium Gluconate 10% 10 mL is FIRST step'],
    aiimsTrap: 'Calcium gluconate does NOT reduce serum potassium level. It stabilizes the cardiac cell membrane.'
  },
  {
    id: 'sim-nrp',
    type: 'simulation',
    title: 'Neonatal Resuscitation Program (NRP 8th Ed) Golden Minute',
    subject: 'Pediatrics',
    modality: 'Simulation',
    simulationId: 'nrp-simulation',
    caption: 'Interactive animated timeline of delivery room resuscitation: initial steps (0-30s), PPV with right-wrist pre-ductal SpO2 (30-60s), MR. SOPA, and 3:1 compressions.',
    clues: ['Pre-ductal sensor on RIGHT wrist only', 'PPV rate 40-60 breaths/min', 'Chest compression ratio is 3:1'],
    aiimsTrap: 'Compression-to-ventilation ratio in neonatal resuscitation is 3:1, NOT 15:2 or 30:2.'
  },
  {
    id: 'sim-pupil',
    type: 'simulation',
    title: 'Pupil Light Reflex & Marcus Gunn (RAPD) Swinging Flashlight Test',
    subject: 'Ophthalmology',
    modality: 'Simulation',
    simulationId: 'pupil-light-reflex',
    caption: 'Pathway animation of afferent CN II and efferent CN III Edinger-Westphal nuclei, demonstrating paradoxical bilateral pupillary dilation upon swinging light to an eye with optic neuritis.',
    clues: ['Efferent defect = anisocoria in ambient light', 'Afferent defect = equal pupils in ambient light', 'RAPD causes paradoxical dilation on swinging'],
    aiimsTrap: 'Patients with a unilateral afferent defect (optic nerve lesion) have EQUAL pupil sizes in ambient room light.'
  },
  {
    id: 'sim-epley',
    type: 'simulation',
    title: 'Epley Maneuver Canalith Repositioning for Posterior BPPV',
    subject: 'ENT',
    modality: 'Simulation',
    simulationId: 'epley-simulation',
    caption: 'Micro-particle visualization of calcium carbonate otoconia migrating through posterior semicircular canal across positions 1 to 5 back into the utricle.',
    clues: ['Dix-Hallpike diagnostic test first', 'Hold each position 30-60 seconds', 'Otoconia deposit back into utricle'],
    aiimsTrap: 'Torsional upbeating nystagmus with latency and fatigability confirms posterior canal BPPV.'
  },

  // High-Yield Spotter Images
  {
    id: 'img-auer-faggot',
    type: 'image',
    title: 'Auer Rods & Faggot Cells in APML (AML-M3)',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/7421771fdfbb.jpg',
    caption: 'Hypergranular promyelocytes with stacks of multiple needle-like crystalline cytoplasmic inclusions (faggot cells) composed of fused lysosomes with peroxidase activity.',
    clues: ['t(15;17) PML-RARA translocation', 'Disseminated Intravascular Coagulation (DIC) risk', 'Treatment: ATRA + Arsenic Trioxide'],
    aiimsTrap: 'Do NOT give standard 7+3 cytarabine alone before starting ATRA; ATRA must be started immediately upon suspicion to avert fatal intracranial bleed.'
  },
  {
    id: 'img-auer-cropped',
    type: 'image',
    title: 'Single Myeloblast with Solitary Auer Rod',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/1dbeb5d9e237.jpg',
    caption: 'High-power oil immersion smear demonstrating a solitary Auer rod in a myeloblast, confirming myeloid lineage (excludes ALL).',
    clues: ['Myeloperoxidase (MPO) positive', 'Sudan Black B positive', 'Distinguishes AML from ALL'],
    aiimsTrap: 'Auer rods are NEVER seen in Acute Lymphoblastic Leukemia (ALL).'
  },
  {
    id: 'img-rs-cell',
    type: 'image',
    title: 'Reed-Sternberg "Owl-Eye" Cell in Classical Hodgkin Lymphoma',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/816fc9654d25.jpg',
    caption: 'Binucleated or multinucleated giant cell with prominent eosinophilic inclusion-like nucleoli and abundant amphophilic cytoplasm surrounded by a clear halo ("owl-eyes").',
    clues: ['CD15+ and CD30+ positive', 'CD45- and CD20- (usually negative)', 'Bimodal age distribution'],
    aiimsTrap: 'Lymphocyte Predominant Hodgkin Lymphoma (LPHL) has "Popcorn cells" (L&H cells) which are CD20+ and CD15-/CD30- (opposite of classical HL).'
  },
  {
    id: 'img-starry-sky',
    type: 'image',
    title: 'Starry-Sky Pattern in Burkitt Lymphoma',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/3f9d53d0e051.jpg',
    caption: 'Sheets of uniform intermediate-sized neoplastic B cells with lipid vacuoles interspersed with tingible-body macrophages containing apoptotic nuclear debris.',
    clues: ['t(8;14) c-MYC translocation', 'Ki-67 proliferation index ~100%', 'Associated with Epstein-Barr Virus (EBV) in endemic variant'],
    aiimsTrap: 'Burkitt lymphoma has a Ki-67 proliferation fraction approaching 100%, leading to high risk of Tumor Lysis Syndrome.'
  },
  {
    id: 'img-hairy-cell',
    type: 'image',
    title: 'Hairy Cell Leukemia Peripheral Smear',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/5acbff125d4c.jpg',
    caption: 'Mature B lymphocytes with delicate hair-like cytoplasmic circumferential projections and round to oval nuclei with spongy chromatin.',
    clues: ['Tartrate-Resistant Acid Phosphatase (TRAP) positive', 'BRAF V600E mutation in >95%', 'Dry tap on bone marrow aspiration due to reticulin fibrosis', 'Massive splenomegaly without lymphadenopathy'],
    aiimsTrap: 'Hairy cell leukemia classically produces a "dry tap" on bone marrow aspirate. Trephine biopsy is required.'
  },
  {
    id: 'img-plasmacytoma',
    type: 'image',
    title: 'Plasmacytoma / Multiple Myeloma with Russell Bodies',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/cdcb6406a011.jpg',
    caption: 'Malignant plasma cells displaying eccentric "cartwheel" or "clock-face" chromatin, prominent perinuclear pale halo (Golgi hof), and globular immunoglobulin Russell bodies.',
    clues: ['Russell bodies (cytoplasmic Ig)', 'Dutcher bodies (intranuclear Ig)', 'CD138+ and CD38+ positive', 'CRAB criteria: Hypercalcemia, Renal failure, Anemia, Bone lytic lesions'],
    aiimsTrap: 'Bence-Jones proteinuria is detected by sulfosalicylic acid (SSA) test or urine protein electrophoresis, NOT routine dipstick (which only detects albumin).'
  },
  {
    id: 'img-ecg-hyperkalemia',
    type: 'image',
    title: 'Severe Hyperkalemia (K+ 8.2 mEq/L) Diagnostic 12-Lead ECG',
    subject: 'Medicine',
    modality: 'ECG',
    src: 'img/8523d3ed9088.jpg',
    caption: 'Diagnostic 12-lead ECG tracing in acute renal failure showing symmetrical, narrow-based tall peaked T waves, flattened P waves, and broadened QRS complexes.',
    clues: ['Tall peaked tent-like T waves', 'Loss of P waves', 'Immediate 10% IV Calcium Gluconate indicated'],
    aiimsTrap: 'Peaked T waves in hyperkalemia have a narrow base, unlike broad-based hyperacute T waves in early myocardial infarction.'
  },
  {
    id: 'img-atn-casts',
    type: 'image',
    title: 'Muddy Brown Granular Casts in Acute Tubular Necrosis (ATN)',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/eb4ae3509693.jpg',
    caption: 'Urine sediment microscopy demonstrating coarse, pigmented "muddy brown" granular casts composed of sloughed necrotic renal tubular epithelial cells and Tamm-Horsfall mucoprotein.',
    clues: ['Fractional Excretion of Sodium (FeNa) > 2%', 'Urine osmolality < 350 mOsm/kg', 'Most common cause of intrinsic hospital-acquired AKI'],
    aiimsTrap: 'RBC casts indicate glomerulonephritis; WBC casts indicate acute interstitial nephritis or pyelonephritis; Muddy brown casts indicate ATN.'
  },
  {
    id: 'img-graves-proptosis',
    type: 'image',
    title: 'Graves\' Ophthalmopathy: Proptosis, Scleral Show & Lid Retraction',
    subject: 'Medicine',
    modality: 'Clinical',
    src: 'img/8023d9a32e62.jpg',
    caption: 'Classic Graves\' orbitopathy showing bilateral proptosis (exophthalmos), upper lid retraction (Dalrymple sign), and inferior scleral show due to retro-orbital glycosaminoglycan accumulation.',
    clues: ['TSH-receptor stimulating antibodies (TRAb)', 'Von Graefe sign: lid lag on downward gaze', 'Smoking is the strongest modifiable risk factor'],
    aiimsTrap: 'Radioactive iodine (RAI) therapy can worsen Graves\' ophthalmopathy; give concurrent prophylactic corticosteroids.'
  },
  {
    id: 'img-membranous-jones',
    type: 'image',
    title: 'Membranous Nephropathy: Spike and Dome on Jones Silver Stain',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/72fcf60f1e9e.jpg',
    caption: 'Renal cortical biopsy stained with Jones silver stain showing diffuse, uniform thickening of the glomerular basement membrane with black "spikes" projecting between subepithelial deposits.',
    clues: ['Anti-PLA2R antibodies in 70-80% of primary cases', 'Subepithelial immune complex deposits', 'Most common nephrotic syndrome in elderly adults'],
    aiimsTrap: 'Jones silver stain colors the basement membrane black; the immune complex deposits do NOT stain with silver and form the non-staining "domes".'
  },
  {
    id: 'img-rpgn-crescent',
    type: 'image',
    title: 'Crescentic Glomerulonephritis (RPGN / Goodpasture Disease)',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/d5c2ef0528b3.jpg',
    caption: 'Glomerulus showing cellular crescent filling Bowman\'s space composed of proliferating parietal epithelial cells, macrophages, and fibrin strands compressing the capillary tuft.',
    clues: ['Linear IF staining = Anti-GBM (Goodpasture)', 'Granular IF staining = Immune-complex (Lupus, PSGN)', 'Pauci-immune IF = ANCA-associated vasculitis (GPA, MPA)'],
    aiimsTrap: 'A crescent must involve at least 50% of the glomerular circumference to qualify as a crescentic glomerulonephritis.'
  },
  {
    id: 'img-kimmelstiel-wilson',
    type: 'image',
    title: 'Kimmelstiel-Wilson Nodules in Diabetic Glomerulosclerosis',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/dcea6bff95dd.jpg',
    caption: 'PAS stain of kidney showing acellular, periodic acid-Schiff positive nodular mesangial matrix expansions (Kimmelstiel-Wilson nodules) pathognomonic for diabetic nephropathy.',
    clues: ['PAS positive and silver positive', 'Microalbuminuria is the earliest clinical sign', 'ACE inhibitors/ARBs reduce intraglomerular pressure and slow progression'],
    aiimsTrap: 'Kimmelstiel-Wilson nodules are PAS-positive, unlike amyloid which stains with Congo Red and displays apple-green birefringence under polarized light.'
  },
  {
    id: 'img-livor-mortis',
    type: 'image',
    title: 'Post-Mortem Hypostasis (Livor Mortis / Post-Mortem Suggillation)',
    subject: 'Forensic',
    modality: 'Clinical',
    src: 'img/991236e66558.jpg',
    caption: 'Purplish-red discoloration in the dependent, non-compressed parts of the body caused by post-mortem cessation of circulation and gravitational settling of red blood cells.',
    clues: ['Begins 1-2 hours after death', 'Fixes completely after 6-8 hours (does not blanch with pressure)', 'Contact flattening / contact blanching over pressure points'],
    aiimsTrap: 'Cherry-red livor indicates Carbon Monoxide; Bright pink indicates Cyanide or Hypothermia; Chocolate-brown indicates Methaemoglobin.'
  },
  {
    id: 'img-russell-viper',
    type: 'image',
    title: 'Russell\'s Viper (Daboia russelii) Head & Dorsal Markings',
    subject: 'Forensic',
    modality: 'Clinical',
    src: 'img/cd9bce216712.jpg',
    caption: 'Flat triangular head covered with small keeled scales distinct from the neck with a prominent V-shaped mark and three longitudinal chains of brown, white-bordered spots on the dorsum.',
    clues: ['Vasculotoxic and hemotoxic venom', 'Consumption coagulopathy & defibrination', 'Acute pituitary necrosis (Sheehan-like syndrome) in survivors'],
    aiimsTrap: '20-Minute Whole Blood Clotting Test (20WBCT) is the single best bedside screening test for envenomation by viper bites.'
  },
  {
    id: 'img-stippling-lead',
    type: 'image',
    title: 'Basophilic Stippling in Lead Poisoning & Thalassemia',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/3fb499929f54.jpg',
    caption: 'Fine or coarse blue punctate granules distributed throughout red blood cells representing ribosomal RNA aggregates resulting from pyrimidine 5\'-nucleotidase inhibition.',
    clues: ['Inhibition of delta-ALA dehydratase and ferrochelatase', 'Burton line on gums, wrist drop/foot drop', 'DOC for severe toxicity: Dimercaprol (BAL) + Calcium Disodium EDTA'],
    aiimsTrap: 'Howell-Jolly bodies are nuclear remnants (DNA); Basophilic stippling consists of ribosomal aggregates (RNA).'
  },
  {
    id: 'img-psammoma-bodies',
    type: 'image',
    title: 'Psammoma Bodies in Papillary Thyroid Carcinoma',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/30e442335ea9.jpg',
    caption: 'Concentric, laminated round calcific spherules (psammoma bodies) formed by dystrophic calcification around single necrotic tumor cells.',
    clues: ['Remember mnemonic PSaMMoma: Papillary thyroid ca, Serous cystadenoma ovary, Meningioma, Mesothelioma', 'Orphan Annie eye nuclei in PTC', 'Nuclear grooves and pseudoinclusions'],
    aiimsTrap: 'Psammoma bodies are absent in Medullary thyroid carcinoma (which has amyloid stroma) and Follicular thyroid carcinoma.'
  },
  {
    id: 'img-gbm-palisading',
    type: 'image',
    title: 'Pseudopalisading Necrosis in Glioblastoma (WHO Grade 4)',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/ce318b36a428.jpg',
    caption: 'High-power H&E section demonstrating dense crowds of tumor nuclei lining the periphery of irregular serpentiginous zones of ischemic necrosis.',
    clues: ['Microvascular endothelial proliferation ("glomeruloid" vessels)', 'Ring-enhancing butterfly lesion across corpus callosum on MRI', 'IDH wild-type carries worst prognosis'],
    aiimsTrap: 'Pilocytic astrocytoma has Rosenthal fibers and eosinophilic granular bodies; Glioblastoma has pseudopalisading necrosis and vascular proliferation.'
  },
  {
    id: 'img-rosenthal-fibers',
    type: 'image',
    title: 'Rosenthal Fibers in Pilocytic Astrocytoma (WHO Grade 1)',
    subject: 'Pathology',
    modality: 'Histology',
    src: 'img/feffc1c59ea5.jpg',
    caption: 'Intense eosinophilic, corkscrew-shaped elongated structures located in astrocytic cell processes, characteristic of juvenile pilocytic astrocytoma.',
    clues: ['Most common primary brain tumor in children', 'Located predominantly in cerebellum (cystic with mural nodule)', 'KIAA1549-BRAF gene fusion in >70%'],
    aiimsTrap: 'Pilocytic astrocytoma is WHO Grade 1 and surgically curable; Medulloblastoma is WHO Grade 4 highly malignant small round blue cell tumor.'
  },
  {
    id: 'img-epidemic-common-source',
    type: 'image',
    title: 'Point Source Epidemic Curve (Hepatitis A Outbreak)',
    subject: 'PSM',
    modality: 'Clinical',
    src: 'img/6333be09c2e4.jpg',
    caption: 'Unimodal epidemic curve with a steep upward slope, a rapid peak within one incubation period, and a more gradual downward taper, characteristic of a point-source exposure.',
    clues: ['Cases clustered within one incubation period', 'No secondary waves if strictly point-source', 'Common vehicle e.g. contaminated well or feast food'],
    aiimsTrap: 'A propagated epidemic curve has multiple progressively larger peaks spaced roughly one incubation period apart (e.g., Measles, SARS-CoV-2).'
  },
  {
    id: 'img-epidemic-propagated',
    type: 'image',
    title: 'Propagated (Person-to-Person) Epidemic Curve (Measles Outbreak)',
    subject: 'PSM',
    modality: 'Clinical',
    src: 'img/9ccf8ad4fb40.jpg',
    caption: 'Polymodal epidemic curve showing successive, progressively taller waves of cases as infection transmits person-to-person through successive generations of susceptible contacts.',
    clues: ['Successive peaks spaced by serial interval / incubation period', 'Index case followed by secondary and tertiary generations', 'R0 (basic reproduction number) > 1'],
    aiimsTrap: 'Differentiating point source from continuous source: Continuous source has a plateau without a sharp peak.'
  }
];

export const VisualVaultView: React.FC = () => {
  const { addNotebookItem, showToast } = useAppState();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [flashcardMode, setFlashcardMode] = useState<boolean>(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Active modal player
  const [activePlayerItem, setActivePlayerItem] = useState<VaultItem | null>(null);

  const filteredItems = useMemo(() => {
    return VAULT_ITEMS.filter(item => {
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) return false;
      if (selectedModality !== 'all' && item.modality !== selectedModality) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCap = item.caption.toLowerCase().includes(q);
        const matchClues = item.clues.some(c => c.toLowerCase().includes(q));
        const matchSub = item.subject.toLowerCase().includes(q);
        if (!matchTitle && !matchCap && !matchClues && !matchSub) return false;
      }
      return true;
    });
  }, [selectedSubject, selectedModality, searchQuery]);

  const toggleReveal = (id: string) => {
    sound.playClick();
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveToNotebook = (title: string, cap: string, sub: string) => {
    addNotebookItem(sub, `[Spotter] ${title}\nDiagnostic Clue: ${cap}`);
    sound.playCelebration();
    showToast(`⭐ Saved spotter to ${sub} in 20th Notebook!`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 20px 80px 20px' }}>
      {/* Active Modal Lightbox / Simulation */}
      {activePlayerItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setActivePlayerItem(null)}
        >
          <div
            style={{ maxWidth: 840, width: '100%', maxHeight: '92vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {activePlayerItem.type === 'simulation' && activePlayerItem.simulationId ? (
              <ClinicalSimulationVideo
                simulationId={activePlayerItem.simulationId}
                onClose={() => setActivePlayerItem(null)}
              />
            ) : (
              <MedicalVisualPlayer
                src={activePlayerItem.src || ''}
                title={activePlayerItem.title}
                caption={activePlayerItem.caption}
                credit={activePlayerItem.credit}
                licence={activePlayerItem.licence}
                onSaveToNotebook={() =>
                  handleSaveToNotebook(activePlayerItem.title, activePlayerItem.caption, activePlayerItem.subject)
                }
                onClose={() => setActivePlayerItem(null)}
              />
            )}
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #101935 0%, #17113a 100%)',
          border: '1px solid #1e3a8a',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 24,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 28 }}>🎬</span>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                Visual & Video Vault
              </h1>
              <span className="pill" style={{ background: '#0284c7', color: '#fff', fontWeight: 800 }}>
                {VAULT_ITEMS.length} High-Yield Spotters & Simulations
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', maxWidth: 750, lineHeight: 1.5 }}>
              Master image-based MCQs and emergency procedures for INI-CET with authentic histology slides, diagnostic ECG tracings, clinical photographs, and step-by-step animated clinical simulations.
            </p>
          </div>

          {/* Rapid Flashcard Mode Switch */}
          <button
            onClick={() => {
              sound.playClick();
              setFlashcardMode(!flashcardMode);
              if (!flashcardMode) setRevealedIds({});
            }}
            style={{
              background: flashcardMode ? 'linear-gradient(135deg, #ec4899, #be123c)' : '#1e293b',
              color: '#fff',
              border: '1px solid ' + (flashcardMode ? '#f43f5e' : '#475569'),
              borderRadius: 12,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: flashcardMode ? '0 0 15px rgba(236, 72, 153, 0.5)' : 'none',
            }}
          >
            <span>{flashcardMode ? '👁️ Testing Mode (Titles Hidden)' : '🙈 Turn ON Rapid Flashcard Test'}</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <input
            type="text"
            placeholder="Search spotters (e.g., Auer, Hyperkalemia, NRP, Crescent, Russell viper)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: '1 1 260px',
              background: '#0a0f24',
              border: '1px solid #1e3a8a',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#fff',
              fontSize: 13,
            }}
          />

          <select
            value={selectedModality}
            onChange={e => setSelectedModality(e.target.value)}
            style={{
              background: '#0a0f24',
              border: '1px solid #1e3a8a',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#38bdf8',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <option value="all">All Modalities</option>
            <option value="Simulation">🎬 Video Simulations</option>
            <option value="Histology">🔬 Histology & Cytology</option>
            <option value="ECG">📈 ECG & Electrophysiology</option>
            <option value="Clinical">🏥 Clinical Signs & Gross</option>
          </select>

          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            style={{
              background: '#0a0f24',
              border: '1px solid #1e3a8a',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#c084fc',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <option value="all">All 19 Subjects</option>
            {SUBJECTS.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Visual & Video Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {filteredItems.map(item => {
          const isRevealed = !flashcardMode || revealedIds[item.id];

          return (
            <div
              key={item.id}
              style={{
                background: '#0c1228',
                border: '1px solid #1e293b',
                borderRadius: 14,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                cursor: 'pointer',
              }}
              onClick={() => {
                sound.playClick();
                setActivePlayerItem(item);
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Card Image / Preview */}
              <div
                style={{
                  position: 'relative',
                  height: 190,
                  background: '#030712',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {item.type === 'simulation' ? (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle at center, #1e1b4b 0%, #030712 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 0 20px rgba(2, 132, 199, 0.7)',
                      }}
                    >
                      ▶
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>
                      Interactive Animated Simulation
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                )}

                {/* Modality Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background:
                      item.modality === 'Simulation'
                        ? 'rgba(147, 51, 234, 0.9)'
                        : item.modality === 'Histology'
                        ? 'rgba(2, 132, 199, 0.9)'
                        : item.modality === 'ECG'
                        ? 'rgba(16, 185, 129, 0.9)'
                        : 'rgba(245, 158, 11, 0.9)',
                    color: '#fff',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {item.modality}
                </div>

                {/* Subject Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(15, 23, 42, 0.85)',
                    color: '#94a3b8',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {item.subject}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {flashcardMode && !isRevealed ? (
                  <div
                    onClick={e => {
                      e.stopPropagation();
                      toggleReveal(item.id);
                    }}
                    style={{
                      background: '#1e1b4b',
                      border: '1px dashed #6366f1',
                      borderRadius: 8,
                      padding: 12,
                      textAlign: 'center',
                      color: '#a5b4fc',
                      fontSize: 13,
                      fontWeight: 700,
                      marginBottom: 10,
                      cursor: 'pointer',
                    }}
                  >
                    🙈 Tap to reveal diagnosis & anchor
                  </div>
                ) : (
                  <>
                    <h3
                      style={{
                        margin: '0 0 6px 0',
                        fontSize: 15,
                        fontWeight: 800,
                        color: '#f8fafc',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        margin: '0 0 10px 0',
                        fontSize: 12,
                        color: '#94a3b8',
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.caption}
                    </p>
                  </>
                )}

                {/* Clues Bullets */}
                {isRevealed && (
                  <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      {item.clues.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            background: '#111827',
                            color: '#cbd5e1',
                            borderRadius: 4,
                            padding: '2px 6px',
                            fontSize: 11,
                            border: '1px solid #1f2937',
                          }}
                        >
                          ✓ {c}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600 }}>
                        {item.type === 'simulation' ? '▶ Launch Simulation' : '🔍 Fullscreen Visualizer'}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleSaveToNotebook(item.title, item.caption, item.subject);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#f59e0b',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: '2px 6px',
                        }}
                        title="Add to Notebook"
                      >
                        ⭐ Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
