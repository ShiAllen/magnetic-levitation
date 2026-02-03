# Magnetic Levitation Simulator

A 2D magnetic levitation simulator built with HTML5 Canvas and JavaScript. This interactive physics simulator allows users to study magnetic interactions and levitation phenomena.

🔗 **[Try the Live Demo](index.html)**

![Magnetic Levitation Simulator](https://github.com/user-attachments/assets/ef0944a2-787c-452b-a18b-8b1009002cf8)

## Features

### Physics Engine
- **Custom 2D Physics**: Built-from-scratch physics engine with accurate numerical integration
- **Magnetic Forces**: Inverse square law implementation for realistic magnetic interactions
- **Collision Detection**: AABB collision detection with impulse-based response
- **Gravity & Drag**: Adjustable gravity and air resistance simulation

### Interactive Elements
- **Magnets**: Place magnets with N/S pole orientation (red=North, blue=South)
- **Iron Blocks**: Add ferromagnetic objects that are attracted to magnets
- **Drag & Drop**: Click and drag objects to reposition them in real-time
- **Polarity Control**: Shift+click on magnets to flip their N/S orientation

### Visualization
- **Magnetic Field Lines**: Toggle visualization of magnetic field directions
- **Real-time Animation**: Smooth 60 FPS rendering
- **Color-Coded Objects**: Clear visual distinction between different pole orientations

### Controls
- **Gravity Adjustment**: Slider to control gravitational force (0-20 m/s²)
- **Magnetic Strength**: Adjust magnetic field strength (1000-10000)
- **Pause/Resume**: Spacebar or button to pause simulation
- **Clear All**: Remove all objects and start fresh

## How to Use

1. Open `index.html` in a modern web browser
2. Click "添加磁鐵 (M)" to add magnets to the canvas
3. Click "添加鐵塊 (I)" to add iron blocks
4. Drag objects to move them around
5. Shift+click on magnets to flip their polarity
6. Adjust gravity and magnetic strength to observe different behaviors

### Demonstrating Magnetic Levitation

To see magnetic levitation in action:
1. Place a magnet near the bottom of the canvas (N pole up - red on top)
2. Add another magnet above it
3. Shift+click the upper magnet to flip it so N pole faces down (blue on top)
4. The magnets will repel each other, demonstrating levitation!

## Technical Details

- **Single File**: Complete application in one HTML file with embedded CSS and JavaScript
- **No Dependencies**: Pure vanilla JavaScript, no external libraries required
- **Browser Compatible**: Works in all modern browsers with HTML5 Canvas support

### Architecture

- **Vector2D Class**: 2D vector mathematics for physics calculations
- **RigidBody Class**: Physical objects with mass, velocity, and collision properties
- **MagneticSimulator Class**: Main simulation engine handling physics updates and rendering

### Physics Implementation

- **Magnetic Force Formula**: F = k × (m₁ × m₂ × polarity) / r²
- **Collision Response**: Impulse-based elastic collision with restitution
- **Numerical Integration**: Semi-implicit Euler integration with timestep limiting
- **Stability Features**: Distance clamping and timestep caps prevent numerical instability

## Browser Keyboard Shortcuts

- **M**: Switch to magnet placement mode
- **I**: Switch to iron block placement mode
- **C**: Clear all objects
- **Space**: Pause/Resume simulation

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

Shi Allen

---

**Note**: This simulator is designed for educational purposes to help understand magnetic interactions and basic physics principles.

