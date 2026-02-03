class MagObj {
    constructor(x, y, type) {
        this.id = Date.now() + Math.random();
        this.x = x; this.y = y;
        this.type = type;
        this.w = (type === 'bar') ? 100 : 50;
        this.h = (type === 'bar') ? 24 : 50;
        this.angle = 0;
        this.strength = (type === 'iron') ? 0 : 2000;
        this.isIron = (type === 'iron');
        this.vx = 0; this.vy = 0; this.vAng = 0;
        this.mass = (this.w * this.h) / 1000;
    }

    getPoles() {
        if (this.isIron) return [];
        const cos = Math.cos(this.angle), sin = Math.sin(this.angle);
        const d = this.w * 0.45;
        return [
            { x: this.x + d * cos, y: this.y + d * sin, type: 'N' },
            { x: this.x - d * cos, y: this.y - d * sin, type: 'S' }
        ];
    }

    draw(ctx, isSelected) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        const r = 4; // 圓角
        if (this.isIron) {
            ctx.fillStyle = '#444'; ctx.strokeStyle = '#888';
            ctx.beginPath(); ctx.roundRect(-this.w/2, -this.h/2, this.w, this.h, r); ctx.fill(); ctx.stroke();
        } else {
            ctx.fillStyle = '#ff4444'; // N
            ctx.beginPath(); ctx.roundRect(0, -this.h/2, this.w/2, this.h, [0, r, r, 0]); ctx.fill();
            ctx.fillStyle = '#4444ff'; // S
            ctx.beginPath(); ctx.roundRect(-this.w/2, -this.h/2, this.w/2, this.h, [r, 0, 0, r]); ctx.fill();
            ctx.fillStyle = "white"; ctx.font = "bold 12px Arial"; ctx.textAlign = "center";
            ctx.fillText("N", this.w/4, 5); ctx.fillText("S", -this.w/4, 5);
        }
        if (isSelected) {
            ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2;
            ctx.strokeRect(-this.w/2-4, -this.h/2-4, this.w+8, this.h+8);
        }
        ctx.restore();
    }
}

export { MagObj };
