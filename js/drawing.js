import { getFieldAt } from './physics.js';

function drawFieldLines(ctx, objects, width, height, isSimulating) {
    const step = 20;
    ctx.lineWidth = 1;
    objects.forEach(obj => {
        if (obj.isIron) return;
        const nPole = obj.getPoles()[0];
        for (let i = 0; i < 12; i++) {
            let cx = nPole.x, cy = nPole.y;
            const ang = (i / 12) * Math.PI * 2 + obj.angle;
            cx += Math.cos(ang) * 5; cy += Math.sin(ang) * 5;
            
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.strokeStyle = `rgba(0, 170, 255, ${isSimulating ? 0.2 : 0.4})`;
            for (let s = 0; s < 50; s++) {
                const f = getFieldAt(cx, cy, objects, null);
                if (f.m < 0.001) break;
                cx += (f.bx / f.m) * 10; cy += (f.by / f.m) * 10;
                ctx.lineTo(cx, cy);
                // 撞到 S 極停止
                let hit = false;
                objects.forEach(o => { if(!o.isIron && Math.hypot(cx-o.getPoles()[1].x, cy-o.getPoles()[1].y) < 8) hit=true; });
                if (hit || cx<0 || cx>width || cy<0 || cy>height) break;
            }
            ctx.stroke();
        }
    });
}

function drawScene(ctx, objects, selected, visMode, width, height) {
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, width, height);
    if (visMode.lines) {
        drawFieldLines(ctx, objects, width, height, window.isSimulating);
    }
    objects.forEach(obj => obj.draw(ctx, selected === obj));
}

export { drawScene };
