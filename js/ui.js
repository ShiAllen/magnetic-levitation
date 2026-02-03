import { MagObj } from './MagObj.js';

let selected = null;
let objects = [];

function select(obj) {
    selected = obj;
    const panel = document.getElementById('propPanel');
    if (obj) {
        panel.style.display = 'block';
        document.getElementById('strRange').value = obj.strength;
        document.getElementById('wRange').value = obj.w;
        document.getElementById('hRange').value = obj.h;
        document.getElementById('wLabel').innerText = obj.w + 'px';
        document.getElementById('hLabel').innerText = obj.h + 'px';
        const angleDeg = Math.round(obj.angle * 180 / Math.PI) % 360;
        document.getElementById('angRange').value = angleDeg;
        document.getElementById('degLabel').innerText = angleDeg + '°';
    } else {
        panel.style.display = 'none';
    }
    return selected;
}

function updateProp() {
    if (!selected) return;
    selected.strength = parseInt(document.getElementById('strRange').value);
    selected.w = parseInt(document.getElementById('wRange').value);
    selected.h = parseInt(document.getElementById('hRange').value);
    selected.angle = (parseInt(document.getElementById('angRange').value) * Math.PI / 180);
    
    document.getElementById('wLabel').innerText = selected.w + 'px';
    document.getElementById('hLabel').innerText = selected.h + 'px';
    document.getElementById('degLabel').innerText = document.getElementById('angRange').value + '°';
    
    selected.mass = (selected.w * selected.h) / 1000;
}

function setupUI(appState) {
    document.getElementById('addBarBtn').onclick = () => {
        const obj = new MagObj(appState.width / 2, appState.height / 2, 'bar');
        appState.objects.push(obj);
        appState.selected = select(obj);
    };
    document.getElementById('addCubeBtn').onclick = () => {
        const obj = new MagObj(appState.width / 2, appState.height / 2, 'cube');
        appState.objects.push(obj);
        appState.selected = select(obj);
    };
    document.getElementById('addIronBtn').onclick = () => {
        const obj = new MagObj(appState.width / 2, appState.height / 2, 'iron');
        appState.objects.push(obj);
        appState.selected = select(obj);
    };

    document.getElementById('simBtn').onclick = () => {
        appState.isSimulating = !appState.isSimulating;
        document.getElementById('simBtn').innerText = appState.isSimulating ? "🛑 停止模擬" : "▶ 開始模擬";
        document.getElementById('simBtn').classList.toggle('active');
    };

    document.getElementById('gravityBtn').onclick = () => {
        appState.useGravity = !appState.useGravity;
        document.getElementById('gravityBtn').innerText = appState.useGravity ? "🌍 重力: 開啟" : "🌍 重力: 關閉";
        document.getElementById('gravityBtn').classList.toggle('primary');
    };

    document.getElementById('alignBtn').onclick = () => {
        if (appState.objects.length < 2) return;
        const centerX = appState.width / 2;
        appState.objects.forEach((obj, i) => {
            obj.x = centerX;
            obj.y = appState.height / 2 - 100 + i * 150;
            obj.vx = 0; obj.vAng = 0;
            obj.angle = 0; 
        });
    };

    document.getElementById('btnLines').onclick = () => {
        appState.visMode.lines = !appState.visMode.lines;
        document.getElementById('btnLines').classList.toggle('primary');
    };
    document.getElementById('btnGrid').onclick = () => {
        appState.visMode.grid = !appState.visMode.grid;
        document.getElementById('btnGrid').classList.toggle('primary');
    };

    document.getElementById('clearBtn').onclick = () => {
        appState.objects.length = 0;
        appState.selected = select(null);
    };

    document.getElementById('strRange').oninput = updateProp;
    document.getElementById('wRange').oninput = updateProp;
    document.getElementById('hRange').oninput = updateProp;
    document.getElementById('angRange').oninput = updateProp;

    document.getElementById('flipBtn').onclick = () => { if(selected) { selected.angle += Math.PI; updateProp(); } };
    document.getElementById('delBtn').onclick = () => {
        appState.objects = appState.objects.filter(o => o !== selected);
        appState.selected = select(null);
    };

    appState.canvas.onmousedown = (e) => {
        appState.mouse.down = true;
        const hit = appState.objects.find(o => Math.hypot(o.x - appState.mouse.x, o.y - appState.mouse.y) < 40);
        appState.selected = select(hit || null);
    };
    window.onmousemove = (e) => {
        const rect = appState.canvas.getBoundingClientRect();
        appState.mouse.x = e.clientX - rect.left;
        appState.mouse.y = e.clientY - rect.top;
        if (appState.mouse.down && appState.selected) {
            appState.selected.x = appState.mouse.x;
            appState.selected.y = appState.mouse.y;
            appState.selected.vx = 0;
            appState.selected.vy = 0;
        }
    };
    window.onmouseup = () => {
        appState.mouse.down = false;
    };
}

export { setupUI, select };
