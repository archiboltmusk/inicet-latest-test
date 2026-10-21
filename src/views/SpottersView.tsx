import React, { useState } from 'react';
import { useAppState } from '../state';

export const SPOT: [string, string, string][] = [
  ['Reed–Sternberg variants: owl-eye (mixed cellularity), lacunar (nodular sclerosis), popcorn/LP cells (NLPHL)', 'Hodgkin lymphoma; RS cell CD15+/CD30+, LP cell CD20+/CD15−/CD30−', 'path-lymphoma-myeloma'],
  ['Bundles of Auer rods in promyelocytes (faggot cells)', 'APL, t(15;17) PML::RARA → ATRA + ATO at once (DIC)', 'path-leukemia'],
  ['Smudge / basket cells on smear', 'CLL (CD5+, CD23+)', 'path-leukemia'],
  ['Starry sky: sheets of B cells with tingible-body macrophages', 'Burkitt lymphoma, t(8;14) MYC', 'path-lymphoma-myeloma'],
  ['Apple-green birefringence with Congo red under polarised light', 'Amyloidosis', 'path-inflammation-amyloid'],
  ['Spikes and domes on silver stain; subepithelial deposits on EM', 'Membranous nephropathy (anti-PLA2R)', 'med-glomerulopathies'],
  ['Lumpy-bumpy / starry-sky granular IgG + C3; subepithelial humps', 'Post-streptococcal GN (low C3)', 'med-glomerulopathies'],
  ['Linear IgG along GBM', 'Anti-GBM (Goodpasture), RPGN type 1', 'med-glomerulopathies'],
  ['Macrophages with crumpled tissue-paper cytoplasm', 'Gaucher cells (glucocerebrosidase)', 'bio-lsd-gsd'],
  ['Cherry-red spot', 'Tay-Sachs (no organomegaly) vs Niemann-Pick (HSM) vs CRAO (sudden painless loss, pale retina)', 'bio-lsd-gsd'],
  ['Eosinophilic cytoplasmic inclusions in Purkinje / hippocampal neurons', 'Negri bodies: rabies', 'mic-virology'],
  ['Aschoff body with Anitschkow caterpillar cells', 'Rheumatic carditis', 'med-heart-failure-valves'],
  ['Golden-brown beaded dumbbells, Prussian blue +', 'Ferruginous (asbestos) bodies: asbestosis', 'path-systemic-pathology'],
  ['Fishnet / intercellular IgG on DIF, suprabasal split', 'Pemphigus vulgaris (Dsg3 ± Dsg1)', 'der-vesiculobullous'],
  ['Linear IgG/C3 at dermo-epidermal junction, tense bullae', 'Bullous pemphigoid (BP180/BP230)', 'der-vesiculobullous'],
  ['Target / iris lesions, three zones', 'Erythema multiforme (HSV commonest trigger)', 'der-vesiculobullous'],
  ['Spaghetti and meatballs on KOH', 'Malassezia furfur: pityriasis versicolor', 'der-infections-sti'],
  ['Tzanck: multinucleated giant cells, nuclear moulding', 'HSV / VZV', 'der-infections-sti'],
  ['Biconvex hyperdensity limited by sutures vs crescent crossing sutures', 'EDH (middle meningeal artery) vs SDH (bridging veins)', 'surg-head-injury'],
  ['Hyperdensity in basal cisterns (star pattern)', 'Subarachnoid haemorrhage', 'med-head-ich-sah'],
  ['Double bubble with gasless distal bowel in a neonate', 'Duodenal atresia (Down syndrome)', 'rad-imaging-signs'],
  ['Bird’s-beak narrowing of distal oesophagus', 'Achalasia', 'surg-upper-gi'],
  ['Coffee-bean / bent inner tube pointing to RUQ', 'Sigmoid volvulus', 'surg-obstruction-volvulus'],
  ['Steeple sign (AP) vs thumb sign (lateral)', 'Croup vs acute epiglottitis', 'ent-larynx-neck'],
  ['Barcode / stratosphere sign vs seashore sign on M-mode', 'Pneumothorax vs normal lung sliding', 'surg-atls-thoracic'],
  ['Lead-pipe colon, loss of haustra', 'Ulcerative colitis', 'med-gi-ibd'],
  ['Peaked T → flat P → wide QRS → sine wave; vs flat T, U waves', 'Hyperkalaemia vs hypokalaemia', 'med-ecg-volatile'],
  ['Coved ST elevation ≥2 mm with negative T in V1–V2', 'Brugada type 1', 'med-ecg-volatile'],
  ['Nadir after contraction peak vs abrupt V/W drop', 'Late deceleration (uteroplacental insufficiency) vs variable (cord compression)', 'obg-labour-fetal'],
  ['Snowstorm uterus, no fetal parts', 'Complete hydatidiform mole (β-hCG very high)', ''],
];

export const SpottersView: React.FC = () => {
  const { state: S, clusters, clusterMap, toggleSpotterItem } = useAppState();
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const doneCount = Object.values(S.spot || {}).filter(Boolean).length;

  const toggleFlip = (i: number) => {
    setOpenItems(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const clustersWithImages = clusters.filter(c => c.images && c.images.length > 0);

  return (
    <div>
      <h1>
        30 image spotters{' '}
        <span className="muted small">
          {doneCount}/30 locked
        </span>
      </h1>
      <p className="small muted">
        Read the clue, say the answer aloud, tap to check. Images live on each linked cluster page.
      </p>

      <div className="grid">
        {SPOT.map(([q, a, cid], i) => {
          const c = clusterMap[cid];
          const im = c && c.images && c.images[0];
          const isDone = !!(S.spot || {})[i];
          const isOpen = !!openItems[i];

          return (
            <div key={i} className="card tight">
              <div className="row small">
                <label>
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleSpotterItem(i)}
                  />{' '}
                  {i + 1}
                </label>
                {c && (
                  <a href={`#/c/${cid}`} style={{ marginLeft: 'auto' }}>
                    {c.title}
                  </a>
                )}
              </div>

              <div
                className={`flip ${isOpen ? 'open' : ''}`}
                style={{ marginTop: 6 }}
                onClick={() => toggleFlip(i)}
              >
                <div>{q}</div>
                <div className="back">
                  <b>{a}</b>
                </div>
              </div>

              {im && (
                <img
                  loading="lazy"
                  src={im.src}
                  alt={im.caption}
                  style={{
                    width: '100%',
                    height: 140,
                    objectFit: 'contain',
                    background: '#000',
                    borderRadius: 6,
                    marginTop: 6,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <h2>Images already on cluster pages</h2>
      <div className="grid">
        {clustersWithImages.map(c => (
          <a
            key={c.id}
            className="card tight tile"
            href={`#/c/${c.id}`}
          >
            <span className="muted small">{c.subject}</span>
            <div className="t">{c.title}</div>
            <span className="small">
              {c.images.length} image{c.images.length > 1 ? 's' : ''}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};
