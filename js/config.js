import { MagObj } from './MagObj.js';
import { select } from './ui.js';

function saveConfig(appState) {
    const config = {
        objects: appState.objects.map(o => ({
            x: o.x, y: o.y,
            type: o.type,
            w: o.w, h: o.h,
            angle: o.angle,
            strength: o.strength,
            isIron: o.isIron
        })),
        settings: {
            useGravity: appState.useGravity,
            friction: document.getElementById('frictionRange').value,
            forceScale: document.getElementById('forceScale').value
        }
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "magnet_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function loadConfig(event, appState) {
    console.log("Hi Noah There is Loading config...");

    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const config = JSON.parse(e.target.result);
            
            document.getElementById('frictionRange').value = config.settings.friction;
            document.getElementById('forceScale').value = config.settings.forceScale;
            if (appState.useGravity !== config.settings.useGravity) {
                document.getElementById('gravityBtn').click();
            }

            appState.objects.length = 0; // Clear existing objects
            config.objects.forEach(objData => {
                const newObj = new MagObj(objData.x, objData.y, objData.type);
                newObj.w = objData.w;
                newObj.h = objData.h;
                newObj.angle = objData.angle;
                newObj.strength = objData.strength;
                newObj.isIron = objData.isIron;
                newObj.mass = (newObj.w * newObj.h) / 1000;
                appState.objects.push(newObj);
            });
            appState.selected = select(null);
        } catch (err) {
            alert("讀取設定檔失敗，請確認檔案格式是否正確。");
            console.error(err);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function setupConfigHandlers(appState) {
    document.getElementById('saveBtn').onclick = () => saveConfig(appState);
    document.getElementById('loadInput').onchange = (e) => loadConfig(e, appState);
    document.getElementById('loadBtn').onclick = () => document.getElementById('loadInput').click();
}

export { setupConfigHandlers };
