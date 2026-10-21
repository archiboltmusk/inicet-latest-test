import React from 'react';
import { useAppState, esc } from '../state';

export const SPRINT: [string, string, string, string, string, string, string][] = [
  ['2026-10-08', 'Acid-base & RTA', 'med-acid-base phy-renal-acid', 'Electrolyte emergencies', 'med-electrolytes med-aki-ckd', '60 MCQs: acid-base & nephro emergencies', 'Urine anion gap formula + RTA chart'],
  ['2026-10-09', 'Hematopath & leukaemias', 'path-leukemia path-lymphoma-myeloma path-myeloproliferative', 'Glomerulopathies', 'med-glomerulopathies', '70 MCQs: hematopath & renal biopsy', 'CD-marker grid + EM of 6 glomerulopathies'],
  ['2026-10-10', 'Inborn errors & storage diseases', 'bio-iem-amino-acids bio-lsd-gsd ped-iem-genetics', 'Pediatric anchors', 'ped-milestones-growth ped-chd', '65 MCQs: pediatric genetics & metabolic', 'Enzyme + substrate + organomegaly table'],
  ['2026-10-11', 'Neuroanatomy & brainstem', 'ana-neuroanatomy-tracts med-brainstem-syndromes oph-pupil-neuro', 'Radiology signs', 'rad-imaging-signs', '70 MCQs: neuroanatomy & image radiology', 'Brainstem rule-of-4 sketch'],
  ['2026-10-12', 'Antimicrobials & resistance', 'pha-antimicrobials-resistance med-hiv-oi', 'FMT toxidromes', 'med-toxicology fmt-toxicology fmt-thanatology fmt-injuries-ballistics', '65 MCQs: antimicrobials & forensic tox', 'Antidote master table'],
  ['2026-10-13', 'Biostatistics & screening', 'psm-biostatistics psm-screening-bias-studies', 'Dermatology triad', 'der-vesiculobullous der-infections-sti', '60 MCQs: biostats 2×2 & derm spotters', '2×2 formulas + test-of-significance tree'],
  ['2026-10-14', 'ATLS, burns & resuscitation', 'surg-atls-thoracic surg-shock-pelvic-mtp surg-burns surg-head-injury', 'Obstetric emergencies & CTG', 'obg-hdp-eclampsia obg-pph obg-labour-fetal', '80 mixed GT/PYQs: surgery & OBG', 'MgSO₄ toxicity + Parkland checklist'],
  ['2026-10-15', 'Medicine: cardiology & neuro', 'med-acs med-acls-arrhythmia med-ecg-volatile med-stroke med-status-epilepticus', 'Endocrine', 'med-dka-hhs med-thyroid-parathyroid med-endocrine-crises', '70 MCQs: medicine', 'ECG criteria + DKA thresholds'],
  ['2026-10-16', 'Surgery: GI & hepatobiliary', 'surg-acute-abdomen-pancreatitis surg-hepatobiliary surg-gi-malignancy surg-thyroid-breast', 'Orthopaedics', 'ort-fractures-upper ort-fractures-lower ort-nerve-injuries ort-bone-tumours', '70 MCQs: surgery + ortho', 'Fracture classifications sheet'],
  ['2026-10-17', 'GRAND TEST (09:00–12:00, four locked 45-min parts)', '', 'GT audit: wrong + flagged, parts 1–2 then 3–4', '', 'Classify every lost mark G/R/A/T/P here', 'Log GT sillies'],
  ['2026-10-18', 'Pharmacology & microbiology', 'pha-ans pha-anticoagulants pha-oncology-mabs mic-virology mic-mycology-parasitology mic-culture-media-bacteriology', 'Physiology', 'phy-cardiovascular phy-respiratory', '70 MCQs: pharm + micro', 'DOC list + culture media'],
  ['2026-10-19', 'Gynaecology', 'obg-cervix-screening-ca obg-endometrium-ovary obg-infertility-pcos-amenorrhoea obg-aub-fibroid-endometriosis obg-contraception-medical', 'Eye & ENT', 'oph-glaucoma oph-retina oph-optics-instruments ent-audiology ent-ear-csom ent-larynx-neck', '70 MCQs: OBG + short subjects', 'FIGO staging + Volk/Hofstetter'],
  ['2026-10-20', 'Psychiatry & anaesthesia', 'psy-psychopharm psy-psychosis-mood psy-substance-neurotic ana-agents ana-nmb-airway-la', 'Anatomy', 'ana-head-neck ana-upper-limb ana-lower-limb-pelvis', '70 MCQs: psych + anaes + anatomy', 'Pharyngeal arches + plexus'],
  ['2026-10-21', 'Mistake purge + 20 easy-mark topics', 'psm-national-programs fmt-bns-law rad-safety-physics mic-immunology-sterilisation pha-pk-general', 'PSM programmes', 'psm-environment-occupational psm-demography-nutrition', 'Mistake purge block', 'Cold chain, kits, units, sterilisation indicators'],
  ['2026-10-22', 'Module 1: hemato-oncology & genetics', 'path-leukemia path-lymphoma-myeloma path-neoplasia-markers', 'Metabolic & storage', 'bio-lsd-gsd bio-lipids-metabolism', '75 PYQs: heme, genetics, IEM', 'CD grid + storage enzymes'],
  ['2026-10-23', 'Module 2: acid-base & renal biopsy', 'med-acid-base med-electrolytes med-glomerulopathies', 'Trauma & critical care', 'surg-atls-thoracic surg-burns surg-head-injury', '75 PYQs: nephro, ABG, trauma', 'UAG + EM of 6 glomerulopathies'],
  ['2026-10-24', 'GRAND TEST 1 (09:00–12:00) · target 185–192 attempts', '', 'GT audit part 1: sort errors G/R/A/T/P; misses with >60% peer accuracy first', '', 'GT audit part 2: images & vignettes', 'GT sillies into Notebook'],
  ['2026-10-25', 'Module 3: neuro-sensory', 'med-brainstem-syndromes ana-neuroanatomy-tracts', 'Eye & ENT', 'oph-pupil-neuro ent-audiology', '80 PYQs: neuroanatomy, eye, ENT', 'Visual pathway + Carhart vs noise notch'],
  ['2026-10-26', 'Module 4: antimicrobials & bugs', 'pha-antimicrobials-resistance mic-culture-media-bacteriology', 'Toxicology & FMT', 'med-toxicology fmt-thanatology fmt-bns-law', '75 PYQs: antimicrobials & forensic tox', 'Antidote table'],
  ['2026-10-27', 'Module 5: OBG emergencies', 'obg-labour-fetal obg-hdp-eclampsia obg-pph', 'Pediatrics & milestones', 'ped-milestones-growth ped-chd ped-nrp', '75 PYQs: OBG & peds', 'MgSO₄ cut-offs + reflex timeline'],
  ['2026-10-28', 'GRAND TEST 2 (09:00–12:00) · check pace at Q100 & Q150', '', 'GT 2 fast audit', '', 'Module 6: biostatistics engine', 'Biostats 2×2 sheet'],
  ['2026-10-29', 'Module 6: short-subject powerhouse', 'der-vesiculobullous der-infections-sti psy-psychopharm', 'PSM programmes & radiology', 'psm-national-programs psm-screening-bias-studies rad-imaging-signs', '80 PYQs: derm, psych, PSM', 'STI kits + DIF patterns'],
  ['2026-10-30', '20th Notebook sweep 1: formulas, staging, pre/para-clinical', '', '20th Notebook sweep 2: clinical + sillies + image spotters', '', 'Light 40-Q untimed run, weakest subject only', 'Strike out what you know cold. Early rest.'],
  ['2026-10-31', 'Image spotters (1–2 h max) + normal lab ranges', '', 'Wind-down: admit card, photo ID, route. No new topics.', '', '—', 'Sleep by 22:00'],
];

export const SprintView: React.FC = () => {
  const { state: S, clusterMap, toggleSprintItem } = useAppState();

  const renderClusterLinks = (ids: string) => {
    const list = ids
      .split(' ')
      .map(id => id.trim())
      .filter(id => clusterMap[id]);
    return list.map((id, idx) => (
      <span key={id}>
        {idx > 0 && ' · '}
        <a href={`#/c/${id}`}>{clusterMap[id].title}</a>
      </span>
    ));
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <h1>Exam sprint to 1 Nov</h1>
      <p className="small muted">
        Days 1–7 follow your 7-day high-yield timetable, days 8–14 sweep what it leaves out (GT on 17 Oct),
        days 15–24 are your 10-day final timetable. Every topic links to its cluster; use "Drill" there for
        the evening MCQs.
      </p>
      <div className="grid">
        {SPRINT.map((x, i) => {
          const [d, b1, c1, b2, c2, b3, b4] = x;
          const done = !!(S.sprint || {})[d];
          const isToday = d === todayStr;

          return (
            <div
              key={d}
              className="card"
              style={isToday ? { borderColor: 'var(--accent)' } : undefined}
            >
              <div className="row">
                <b>{new Date(d + 'T00:00').toDateString().slice(0, 10)}</b>
                <span className="muted small">
                  Day {i + 1} / {SPRINT.length}
                </span>
                <label className="small" style={{ marginLeft: 'auto' }}>
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleSprintItem(d)}
                  />{' '}
                  done
                </label>
              </div>
              <div className="small" style={{ marginTop: 6 }}>
                <b>Morning:</b> {b1}
                {c1 && (
                  <>
                    <br />
                    {renderClusterLinks(c1)}
                  </>
                )}
              </div>
              <div className="small" style={{ marginTop: 4 }}>
                <b>Afternoon:</b> {b2}
                {c2 && (
                  <>
                    <br />
                    {renderClusterLinks(c2)}
                  </>
                )}
              </div>
              <div className="small" style={{ marginTop: 4 }}>
                <b>Evening:</b> {b3}
              </div>
              <div className="small" style={{ marginTop: 4 }}>
                <b>Night (Notebook):</b> {b4}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
