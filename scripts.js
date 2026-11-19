(() => {
    const track = document.getElementById('track');
    const container = document.querySelector('#text_id');
    console.log(container);
    const lines = [...container.querySelectorAll('.line')];
    const N = lines.length;
    console.log("lines", N)

    const IN_START = 0.04;
    const IN_END = 0.50;
    const OUT_START = 0.54;
    const OUT_END = 0.96;
    const FADE = 0.09;

    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const smooth = t => t * t * (3 - 2 * t);

    const inStep = (IN_END - IN_START - FADE) / Math.max(1, N - 1);
    const outStep = (OUT_END - OUT_START - FADE) / Math.max(1, N - 1);

    function progress() {
        const rect = track.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        return clamp(-rect.top / scrollable);
    }

    function render() {
        const p = progress();
        console.log("position", p);

        lines.forEach((el, i) => {
            const a = smooth(clamp((p - (IN_START + i * inStep)) / FADE))
            const b = smooth(clamp((p - (OUT_START + i * outStep)) / FADE))
            const v = a * (1 - b);

            console.log("opacity", v);
            console.log("index", i);

            const y = (1 - a) * 40 - b * 40;

            el.style.opacity = v.toFixed(1);
            el.style.transform = `transform3D(0, ${y.toFixed(1)}px,0)`;

        });
    }

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { render(); ticking = false; });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    render();

    // buttons actions
    document.querySelectorAll('.pill-btn').forEach((btn) => {
        const trigger = btn.querySelector('.pill-trigger');

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;

        // 1. Handle Black Pill Click / Tap
        trigger.addEventListener('pointerdown', (e) => {
            // Stop the white pill from starting a drag when pressing the black part
            e.stopPropagation();
        });

        trigger.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            console.log(`Triggered action: ${action}`);

            // Brief visual tap feedback for quick clicks/taps
            trigger.classList.add('is-tapped');
            setTimeout(() => trigger.classList.remove('is-tapped'), 150);

            // Add your custom click logic here based on `action`
        });

        // 2. Handle Dragging by the White Part
        btn.addEventListener('pointerdown', (e) => {
            if (e.target === trigger) return;

            isDragging = true;
            btn.setPointerCapture(e.pointerId);
            btn.style.zIndex = 1000; // Bring dragged button to front

            // Calculate offset from current translation
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
        });

        btn.addEventListener('pointermove', (e) => {
            if (!isDragging) return;

            currentX = e.clientX - startX;
            currentY = e.clientY - startY;

            btn.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });

        const stopDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            btn.style.zIndex = '';
            if (btn.hasPointerCapture(e.pointerId)) {
                btn.releasePointerCapture(e.pointerId);
            }
        };

        btn.addEventListener('pointerup', stopDrag);
        btn.addEventListener('pointercancel', stopDrag);
    });

    // SPINNER LOGIC
    const viewer = document.getElementById('my-spline');
    const loader = document.getElementById('spline-loader');

    viewer.addEventListener('load-complete', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    });

})();