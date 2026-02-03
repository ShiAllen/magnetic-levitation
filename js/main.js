import { updatePhysics, getFieldAt } from './physics.js';
import { drawScene } from './drawing.js';
import { setupUI } from './ui.js';
import { setupConfigHandlers } from './config.js';

const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

const appState = {
    canvas: canvas,
    ctx: ctx,
    width: 0,
    height: 0,
    objects: [],
    selected: null,
    isSimulating: false,
    useGravity: false,
    visMode: { lines: true, grid: false },
    mouse: { x: 0, y: 0, down: false },
};

// Make appState globally accessible for UI functions that are not yet refactored
window.appState = appState;

function resize() {
    appState.width = canvas.width = canvas.parentElement.clientWidth;
    appState.height = canvas.height = canvas.parentElement.clientHeight;
}

function loop() {
    updatePhysics(appState.isSimulating, appState.objects, appState.mouse, appState.selected, appState.useGravity, appState.width, appState.height);
    drawScene(ctx, appState.objects, appState.selected, appState.visMode, appState.width, appState.height);
    
    // HUD Update
    const f = getFieldAt(appState.mouse.x, appState.mouse.y, appState.objects);
    document.getElementById('valB').innerText = (f.m * 100).toFixed(2);
    
    requestAnimationFrame(loop);
}

function init() {
    window.addEventListener('resize', resize);
    resize();
    
    setupUI(appState);
    setupConfigHandlers(appState);
    
    loop();
}

init();
