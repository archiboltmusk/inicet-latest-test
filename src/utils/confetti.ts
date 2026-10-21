// Lightweight pure HTML5 canvas confetti celebration (zero external dependencies)

export function fireConfetti(durationMs: number = 2500) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#fbbf24'];
  const particleCount = 80;

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
  }

  const particles: Particle[] = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 200,
      y: height * 0.4 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 12 - 4,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  const startTime = Date.now();

  function render() {
    const elapsed = Date.now() - startTime;
    if (elapsed > durationMs) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - elapsed / durationMs);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  render();
}
