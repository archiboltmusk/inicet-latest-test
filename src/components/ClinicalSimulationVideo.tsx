import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';

export interface SimulationDef {
  id: string;
  title: string;
  category: string;
  durationSec: number;
  description: string;
  steps: {
    timeSec: number;
    title: string;
    action: string;
    details: string;
    aiimsTrap?: string;
  }[];
}

export const CLINICAL_SIMULATIONS: Record<string, SimulationDef> = {
  'acls-simulation': {
    id: 'acls-simulation',
    title: 'ACLS Shockable vs Non-Shockable Dynamic Monitor & Timeline',
    category: 'Critical Care / Medicine',
    durationSec: 24,
    description: 'Real-time oscilloscope visualization of Ventricular Fibrillation vs Asystole/PEA, shock synchronization, CPR cycle, and drug administration timeline.',
    steps: [
      {
        timeSec: 0,
        title: 'Step 1: Rhythm Recognition (0:00 - 0:04)',
        action: 'Attach monitor/defibrillator. Check pulse (< 10 sec).',
        details: 'Chaotic, irregular coarse baseline without identifiable P, QRS, or T waves = Coarse VF (Shockable).',
        aiimsTrap: 'Never pause CPR for more than 10 seconds to analyze rhythm or check pulses.'
      },
      {
        timeSec: 5,
        title: 'Step 2: Immediate Defibrillation (0:05 - 0:09)',
        action: 'Deliver 1 unsynchronized shock (Biphasic: 120-200J; Monophasic: 360J).',
        details: 'Clear patient immediately before discharging. Resume CPR INSTANTLY after shock without checking pulse!',
        aiimsTrap: 'Do NOT delay CPR to check rhythm or pulse right after shock delivery. Resume 2 min CPR immediately.'
      },
      {
        timeSec: 10,
        title: 'Step 3: High-Quality CPR & Vascular Access (0:10 - 0:14)',
        action: 'Perform 2 minutes CPR (30:2 or continuous 100-120/min with advanced airway).',
        details: 'Obtain IV/IO access. Prepare Epinephrine 1 mg IV/IO for delivery after 2nd shock if VF persists.',
        aiimsTrap: 'Compression depth: at least 5 cm (2 inches) but no more than 6 cm. Allow full chest recoil.'
      },
      {
        timeSec: 15,
        title: 'Step 4: Second Shock & Epinephrine (0:15 - 0:19)',
        action: '2-min rhythm check: VF continues. Deliver 2nd shock. Resume CPR + Epinephrine 1 mg.',
        details: 'Repeat Epinephrine every 3 to 5 minutes. Consider advanced airway & capnography (ETCO2 target > 10 mmHg).',
        aiimsTrap: 'ETCO2 < 10 mmHg after 20 minutes of CPR suggests resuscitation failure / futile effort.'
      },
      {
        timeSec: 20,
        title: 'Step 5: Third Shock & Antiarrhythmic (0:20 - 0:24)',
        action: 'Rhythm check: Refractory VF. Deliver 3rd shock. Administer Amiodarone 300 mg bolus.',
        details: 'Second dose of Amiodarone is 150 mg IV. Alternative: Lidocaine 1-1.5 mg/kg first dose, then 0.5-0.75 mg/kg.',
        aiimsTrap: 'Amiodarone first dose is 300 mg bolus, NOT 150 mg (150 mg is for stable VT with pulse or second dose).'
      }
    ]
  },
  'hyperkalemia-ecg': {
    id: 'hyperkalemia-ecg',
    title: 'Hyperkalemia ECG Progression & Emergency Stabilization',
    category: 'Nephrology / Emergency',
    durationSec: 20,
    description: 'Dynamic morphing of ECG waveform as serum K+ climbs from 5.5 to >9.0 mEq/L, followed by membrane stabilization with 10% IV Calcium Gluconate.',
    steps: [
      {
        timeSec: 0,
        title: 'Normal to Mild Elevation (K+ 5.5 - 6.0 mEq/L)',
        action: 'Earliest sign: Tall, narrow, peaked, tent-like symmetrical T waves (V2-V4).',
        details: 'QT interval is typically normal or shortened. Differentiate from hyperacute ischemic T waves (which are broad-based with prolonged QT).',
        aiimsTrap: 'Hyperkalemia peaked T waves are narrow-based and pointed; myocardial ischemia peaked T waves are broad-based.'
      },
      {
        timeSec: 5,
        title: 'Moderate Toxicity (K+ 6.5 - 7.5 mEq/L)',
        action: 'Prolongation of PR interval, progressive flattening and disappearance of P waves.',
        details: 'Sino-ventricular conduction occurs (impulse travels without atrial depolarization). ST depression and widening of QRS begin.',
        aiimsTrap: 'Loss of P waves does NOT equal atrial fibrillation if rhythm is regular and QRS is widened.'
      },
      {
        timeSec: 10,
        title: 'Severe Toxicity (K+ 8.0 - 9.0 mEq/L)',
        action: 'Marked widening of QRS merging with T wave into classic "Sine Wave" appearance.',
        details: 'Impending cardiac arrest (ventricular fibrillation, asystole, or pulseless electrical activity).',
        aiimsTrap: 'Sine wave is an absolute medical emergency requiring immediate IV Calcium before ANY other lab test.'
      },
      {
        timeSec: 15,
        title: 'Emergency Intervention Protocol (Immediate Effect)',
        action: '1st Step: IV Calcium Gluconate 10% (10 mL over 2-3 min) to stabilize cardiac membrane.',
        details: 'Does NOT lower potassium. Next steps: Insulin 10U regular + 50% Dextrose 50 mL, nebulized Salbutamol (10-20 mg), Sodium Bicarbonate (if acidotic), and Hemodialysis.',
        aiimsTrap: 'Calcium gluconate does NOT lower serum K+. It only antagonizes membrane hyperexcitability. Shifts are done by insulin/beta-agonists.'
      }
    ]
  },
  'nrp-simulation': {
    id: 'nrp-simulation',
    title: 'Neonatal Resuscitation Program (NRP) 8th Edition Golden Minute Flow',
    category: 'Pediatrics / Neonatology',
    durationSec: 24,
    description: 'Stepwise animated execution of newborn assessment, initial steps, Positive Pressure Ventilation (PPV), MR. SOPA corrective steps, chest compressions, and epinephrine.',
    steps: [
      {
        timeSec: 0,
        title: '0 - 30 Seconds: Rapid Assessment & Initial Steps',
        action: 'Check: Term? Good Tone? Breathing or Crying? If NO → Warm, Dry, Stimulate, Clear airway if needed.',
        details: 'Place under radiant warmer, sniff position, gentle suction mouth then nose only if obstructed.',
        aiimsTrap: 'Do NOT delay resuscitation for routine bulb suctioning if the neonate is vigorous, even if meconium is present.'
      },
      {
        timeSec: 6,
        title: '30 - 60 Seconds: The Golden Minute Decision',
        action: 'Heart rate < 100 bpm or apnea/gasping → Initiate Positive Pressure Ventilation (PPV) immediately.',
        details: 'Rate: 40-60 breaths/min ("Breathe, two, three, breathe"). Initial PIP 20-25 cm H2O. Attach pulse oximeter on RIGHT wrist (pre-ductal).',
        aiimsTrap: 'Pre-ductal saturation sensor must ALWAYS be placed on the RIGHT wrist or palm, never lower limbs.'
      },
      {
        timeSec: 12,
        title: '60 - 90 Seconds: PPV Check & MR. SOPA Corrective Steps',
        action: 'If HR not increasing and chest not rising → MR. SOPA ventilation corrective steps.',
        details: 'M: Mask adjustment, R: Reposition head. S: Suction mouth/nose, O: Open mouth. P: Pressure increase (up to 30-40). A: Alternative airway (ETT or LMA).',
        aiimsTrap: 'Never start chest compressions before ensuring effective ventilation that achieves chest movement!'
      },
      {
        timeSec: 18,
        title: '90+ Seconds: Compressions & Epinephrine',
        action: 'If HR remains < 60 bpm despite 30 seconds of effective PPV via ETT → Chest Compressions (3:1 ratio).',
        details: 'Two-thumb encircling technique. 90 compressions + 30 breaths = 120 events/min. Increase FiO2 to 100%. If HR < 60 persists → Epinephrine 0.02 mg/kg IV.',
        aiimsTrap: 'Chest compression ratio in neonates is 3:1 (NOT 15:2 or 30:2 as in older children/adults).'
      }
    ]
  },
  'pupil-light-reflex': {
    id: 'pupil-light-reflex',
    title: 'Pupil Light Reflex & Marcus Gunn (RAPD) Swinging Flashlight Test',
    category: 'Ophthalmology / Neurology',
    durationSec: 18,
    description: 'Anatomical pathway animation of optic nerve (afferent), pretectal nucleus, Edinger-Westphal bilateral parasympathetic outflow (efferent via CN III), and the swinging flashlight test in RAPD.',
    steps: [
      {
        timeSec: 0,
        title: 'Normal Direct & Consensual Response',
        action: 'Light shone into right eye → Right optic nerve (CN II) signals pretectal nucleus in midbrain.',
        details: 'Bilateral projection to Edinger-Westphal nuclei → Bilateral oculomotor nerves (CN III) ciliary ganglion → BOTH pupils constrict equally.',
        aiimsTrap: 'A unilateral efferent defect (CN III lesion) causes an asymmetrical pupil size at baseline (anisocoria). An afferent defect does NOT cause anisocoria in dim light.'
      },
      {
        timeSec: 6,
        title: 'Left Afferent Defect (Left Optic Nerve Lesion / Neuritis)',
        action: 'Baseline: Pupils are equal in dim light. Shine light into normal right eye → Both pupils briskly constrict.',
        details: 'Afferent signal from right eye is intact. Bilateral efferent pathway is fully intact.',
        aiimsTrap: 'Patients with complete unilateral optic nerve transection have EQUAL pupil sizes in ambient light!'
      },
      {
        timeSec: 12,
        title: 'Swinging Flashlight to Affected Left Eye (Marcus Gunn Pupil)',
        action: 'Quickly swing light from right eye to left eye → Paradoxically, BOTH pupils DILATE instead of constricting.',
        details: 'Because the left eye provides weaker sensory drive than the right eye, the brain interprets the switch as a relative reduction in light!',
        aiimsTrap: 'Relative Afferent Pupillary Defect (RAPD) is the most sensitive objective sign of unilateral optic neuropathy (e.g., Multiple Sclerosis retrobulbar neuritis).'
      }
    ]
  },
  'epley-simulation': {
    id: 'epley-simulation',
    title: 'Epley Maneuver Canalith Repositioning for Posterior BPPV',
    category: 'ENT / Neurology',
    durationSec: 20,
    description: 'Visual tracking of free-floating canalith particles (otoconia) migrating through the posterior semicircular canal across all 5 positions of the Epley maneuver back into the utricle.',
    steps: [
      {
        timeSec: 0,
        title: 'Position 1: Seated & Head Turned 45° to Affected Side',
        action: 'Patient seated on examination table, head rotated 45° towards the affected ear (e.g., Right).',
        details: 'Aligns the posterior semicircular canal with the sagittal plane for gravity-assisted repositioning.',
        aiimsTrap: 'Always perform Dix-Hallpike test first to confirm posterior canal involvement (torsional upbeating nystagmus with latency and fatigability).'
      },
      {
        timeSec: 5,
        title: 'Position 2: Rapid Supine Recline with Head 20° Extended',
        action: 'Recline patient backwards rapidly into Dix-Hallpike position. Hold for 30-60 seconds until nystagmus ceases.',
        details: 'Gravity pulls otoconia down towards the lowest dependent part of the canal, triggering typical vertigo and nystagmus.',
        aiimsTrap: 'Hold each position for at least 30-60 seconds OR until nystagmus and symptoms completely resolve.'
      },
      {
        timeSec: 10,
        title: 'Position 3: Head Rotated 90° to Opposite Side',
        action: 'Without raising head, smoothly rotate head 90° towards the unaffected ear (now 45° to the left). Hold 30-60 sec.',
        details: 'Otoconia migrate around the apex of the posterior semicircular canal towards the common crus.',
        aiimsTrap: 'Do NOT allow head extension to be lost during the 90° rotation.'
      },
      {
        timeSec: 15,
        title: 'Position 4 & 5: Body Roll onto Shoulder & Return to Seated',
        action: 'Patient rolls onto left shoulder with head turned 45° down toward floor. Hold 30 sec, then sit up.',
        details: 'Otoconia exit the common crus and drop permanently back into the utricle where they are reabsorbed.',
        aiimsTrap: 'Post-procedure instructions: Avoid violent head movements for 24-48 hours. Medical therapy (betahistine) is secondary to repositioning.'
      }
    ]
  }
};

interface ClinicalSimulationVideoProps {
  simulationId: string;
  onClose?: () => void;
}

export const ClinicalSimulationVideo: React.FC<ClinicalSimulationVideoProps> = ({
  simulationId,
  onClose,
}) => {
  const sim = CLINICAL_SIMULATIONS[simulationId] || CLINICAL_SIMULATIONS['acls-simulation'];
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Current active step
  const activeStepIndex = Math.max(
    0,
    sim.steps.findIndex((s, idx) => {
      const nextTime = sim.steps[idx + 1]?.timeSec ?? sim.durationSec;
      return currentTime >= s.timeSec && currentTime < nextTime;
    })
  );
  const activeStep = sim.steps[activeStepIndex] || sim.steps[0];

  // Timer loop
  useEffect(() => {
    let lastStamp = performance.now();
    const interval = setInterval(() => {
      if (!isPlaying) {
        lastStamp = performance.now();
        return;
      }
      const now = performance.now();
      const deltaSec = ((now - lastStamp) / 1000) * playbackSpeed;
      lastStamp = now;

      setCurrentTime(prev => {
        const next = prev + deltaSec;
        if (next >= sim.durationSec) {
          return 0; // loop
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, sim.durationSec]);

  // Canvas interactive simulation animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrame = 0;
    const render = () => {
      localFrame++;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background grid (medical monitor style)
      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw specific simulation graphics
      if (sim.id === 'acls-simulation') {
        renderAclsAnimation(ctx, w, h, currentTime);
      } else if (sim.id === 'hyperkalemia-ecg') {
        renderHyperkalemiaAnimation(ctx, w, h, currentTime);
      } else if (sim.id === 'nrp-simulation') {
        renderNrpAnimation(ctx, w, h, currentTime);
      } else if (sim.id === 'pupil-light-reflex') {
        renderPupilAnimation(ctx, w, h, currentTime);
      } else {
        renderEpleyAnimation(ctx, w, h, currentTime);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [sim.id, currentTime]);

  function renderAclsAnimation(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const isVF = t < 5 || (t >= 15 && t < 20);
    const isShock = (t >= 4.7 && t <= 5.3) || (t >= 14.7 && t <= 15.3);

    // Shock flash
    if (isShock) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('⚡ 200J SHOCK DELIVERED - CLEAR!', w / 2 - 180, h / 2);
      return;
    }

    ctx.strokeStyle = isVF ? '#f59e0b' : '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const midY = h / 2;
    for (let x = 0; x < w; x += 3) {
      let y = midY;
      const phase = (x * 0.05) - (t * 6);
      if (isVF) {
        // Chaotic coarse VF
        y += Math.sin(phase * 1.5) * 45 + Math.cos(phase * 3.7) * 25 + (Math.random() - 0.5) * 8;
      } else {
        // CPR motion or rhythm
        const cprPhase = (x * 0.02) - (t * 4);
        y += Math.sin(cprPhase) * 20;
      }
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Top status badges
    ctx.fillStyle = isVF ? '#f59e0b' : '#10b981';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`MONITOR: ${isVF ? '⚠️ COARSE VF (SHOCKABLE)' : '🔄 CPR IN PROGRESS (30:2)'}`, 20, 30);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`TIMER: 00:${Math.floor(t).toString().padStart(2, '0')} / 00:${sim.durationSec}`, w - 180, 30);
  }

  function renderHyperkalemiaAnimation(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const kLevel = (5.0 + (t / sim.durationSec) * 4.2).toFixed(1);
    const midY = h / 2 + 30;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();

    // Morphing ECG beat
    const peakHeight = Math.min(110, 30 + (t / 15) * 90);
    const qrsWidth = Math.min(60, 20 + (t / 15) * 45);

    for (let x = 0; x < w; x += 3) {
      const relX = (x % 240);
      let y = midY;

      // P wave (flattens out with time)
      if (relX > 20 && relX < 50 && t < 10) {
        const pFactor = Math.max(0, 1 - (t / 10));
        y -= Math.sin(((relX - 20) / 30) * Math.PI) * (15 * pFactor);
      }
      // QRS complex
      if (relX >= 80 && relX <= 80 + qrsWidth) {
        const qrsFrac = (relX - 80) / qrsWidth;
        y -= Math.sin(qrsFrac * Math.PI * 2) * 55;
      }
      // Peaked T wave
      if (relX > 150 && relX < 210) {
        const tFrac = (relX - 150) / 60;
        y -= Math.pow(Math.sin(tFrac * Math.PI), 3) * peakHeight;
      }

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`SERUM POTASSIUM: ${kLevel} mEq/L`, 20, 30);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '13px monospace';
    ctx.fillText(`MORPHOLOGY: ${t < 5 ? 'Tent-like Peaked T waves' : t < 10 ? 'PR Prolongation + Lost P waves' : 'Severe Sine Wave Rhythm'}`, 20, 55);
  }

  function renderNrpAnimation(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`NRP GOLDEN MINUTE TIMELINE: ${Math.floor(t)}s`, 20, 30);

    const stages = [
      { label: 'Warm & Dry', min: 0, max: 6, color: '#38bdf8' },
      { label: 'PPV (40-60/min)', min: 6, max: 12, color: '#f59e0b' },
      { label: 'MR. SOPA', min: 12, max: 18, color: '#ec4899' },
      { label: '3:1 Compressions', min: 18, max: 24, color: '#ef4444' }
    ];

    stages.forEach((st, idx) => {
      const active = t >= st.min && t < st.max;
      const x = 30 + idx * ((w - 60) / 4);
      const boxW = (w - 100) / 4;
      ctx.fillStyle = active ? st.color : '#1e293b';
      ctx.fillRect(x, 70, boxW, 50);

      ctx.fillStyle = active ? '#000' : '#94a3b8';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(st.label, x + 10, 100);
    });

    // Pulsing ventilation circle
    const pulse = 35 + Math.sin(t * 8) * 12;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 + 45, pulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('LUNG EXPANSION TARGET', w / 2 - 85, h / 2 + 50);
  }

  function renderPupilAnimation(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    const isSwungToLeft = t >= 12;
    const isLightOnRight = t >= 0 && t < 12;

    const rPupilR = isLightOnRight ? 18 : 38;
    const lPupilR = isLightOnRight ? 18 : (isSwungToLeft ? 38 : 38); // Marcus gunn dilates on swing!

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(isSwungToLeft ? '🔦 SWUNG TO LEFT EYE (RAPD DILATION!)' : '🔦 LIGHT ON RIGHT EYE (NORMAL)', 20, 30);

    // Right Eye
    drawEye(ctx, w * 0.3, h / 2 + 10, rPupilR, 'RIGHT EYE (Normal)', isLightOnRight);

    // Left Eye
    drawEye(ctx, w * 0.7, h / 2 + 10, lPupilR, 'LEFT EYE (RAPD Defect)', isSwungToLeft);
  }

  function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, pupilR: number, label: string, lightActive: boolean) {
    // Sclera
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Iris
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x, y, 48, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(x, y, pupilR, 0, Math.PI * 2);
    ctx.fill();

    // Flashlight beam indicator
    if (lightActive) {
      ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.beginPath();
      ctx.arc(x, y, 75, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(label, x - 55, y + 85);
  }

  function renderEpleyAnimation(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('POSTERIOR CANALITH REPOSITIONING (EPLEY)', 20, 30);

    const centerX = w / 2;
    const centerY = h / 2 + 10;
    const radius = 80;

    // Semicircular canal ring
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 1.6);
    ctx.stroke();

    // Otoconia particle position moves along arc with time
    const angle = (t / sim.durationSec) * Math.PI * 1.5;
    const px = centerX + Math.cos(angle) * radius;
    const py = centerY + Math.sin(angle) * radius;

    // Otoconia cluster
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Utricle receptacle at end
    const utricleX = centerX + Math.cos(Math.PI * 1.55) * radius;
    const utricleY = centerY + Math.sin(Math.PI * 1.55) * radius;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(utricleX, utricleY, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px sans-serif';
    ctx.fillText('Utricle (Exit)', utricleX - 35, utricleY - 22);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('● Otoconia', px + 12, py + 4);
  }

  return (
    <div
      style={{
        background: '#090e1f',
        border: '1px solid #1e293b',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
        marginBottom: 20,
      }}
    >
      {/* Simulation Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: 'linear-gradient(90deg, #111833, #1e1b4b)',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🎬</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc' }}>{sim.title}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              <span className="pill" style={{ background: '#312e81', color: '#c7d2fe', marginRight: 6 }}>
                {sim.category}
              </span>
              Interactive Clinical Simulation & Animated Protocol
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Canvas Video / Simulation screen */}
      <div style={{ position: 'relative', width: '100%', height: 260, background: '#000' }}>
        <canvas
          ref={canvasRef}
          width={700}
          height={260}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Floating play/pause overlay button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsPlaying(!isPlaying);
          }}
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        {/* Speed button */}
        <button
          onClick={() => {
            sound.playClick();
            setPlaybackSpeed(s => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1));
          }}
          style={{
            position: 'absolute',
            bottom: 12,
            left: 105,
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#38bdf8',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {playbackSpeed}x Speed
        </button>
      </div>

      {/* Timeline Scrubbing Bar */}
      <div style={{ padding: '8px 18px', background: '#0d1527', borderBottom: '1px solid #1e293b' }}>
        <input
          type="range"
          min={0}
          max={sim.durationSec}
          step={0.1}
          value={currentTime}
          onChange={e => {
            setCurrentTime(parseFloat(e.target.value));
          }}
          style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
          <span>00:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
          <span>Timeline Scrubber</span>
          <span>00:{sim.durationSec.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Active Step Clinical Breakdown */}
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
            {activeStep.title}
          </span>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginBottom: 6 }}>
          🎯 Action: {activeStep.action}
        </div>
        <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, marginBottom: 8 }}>
          {activeStep.details}
        </div>

        {activeStep.aiimsTrap && (
          <div
            style={{
              background: '#29111b',
              border: '1px solid #be123c',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 12,
              color: '#fecdd3',
            }}
          >
            <strong>🚨 AIIMS Repeat Trap:</strong> {activeStep.aiimsTrap}
          </div>
        )}
      </div>
    </div>
  );
};
