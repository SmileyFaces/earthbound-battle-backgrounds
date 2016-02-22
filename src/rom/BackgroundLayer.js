import ROM from "./ROM";
import BackgroundGraphics from "./BackgroundGraphics";
import BackgroundPalette from "./BackgroundPalette";
import DistortionEffect from "./DistortionEffect";
import BattleBackground from "./BattleBackground";
import Distorter from "./Distorter";
import PaletteCycle from "./PaletteCycle";
const [WIDTH, HEIGHT] = [256, 256];
export default class BackgroundLayer {
	constructor(entry) {
		this.graphics = null;
		this.paletteCycle = null;
		this.pixels = new Int16Array(WIDTH * HEIGHT * 4);
		this.distorter = new Distorter(this.pixels);
		this.loadEntry(entry);
	}
	/**
	* Renders a frame of the background animation into the specified Bitmap
	*
	* @param dst
	*            Bitmap object into which to render
	* @param letterbox
	*            Size in pixels of black borders at top and bottom of image
	* @param ticks
	*            Time value of the frame to compute
	* @param alpha
	*            Blending opacity
	* @param erase
	*            Whether or not to clear the destination bitmap before
	*            rendering
	*/
	overlayFrame(dst, letterbox, ticks, alpha, erase) {
		if (this.paletteCycle !== null ) {
			this.paletteCycle.cycle;
			this.graphics.draw(this.pixels, this.paletteCycle);
		}
		return this.distorter.overlayFrame(dst, letterbox, ticks, alpha, erase);
	}
	loadGraphics(n) {
		this.graphics = ROM.getObject(BackgroundGraphics, n);
	}
	loadPalette(bg) {
		this.paletteCycle = new PaletteCycle(ROM.getObject(BackgroundPalette, bg.paletteIndex), bg.paletteCycleType, bg.paletteCycle1Start, bg.paletteCycle1End, bg.paletteCycle2Start, bg.paletteCycle2End, bg.paletteCycleSpeed);
	};
	loadEffect(n) {
		let effect = ROM.getObject(DistortionEffect, n);
		this.distorter.effect = effect;
	}
	loadEntry(n) {
		this.entry = n;
		let bg = ROM.getObject(BattleBackground, n);
		/* Set graphics/palette */
		this.loadGraphics(bg.graphicsIndex);
		this.loadPalette(bg);
		let animation = bg.animation;
		let e1 = (animation >> 24) & 0xFF;
		let e2 = (animation >> 16) & 0xFF;
		this.loadEffect(e2 || e1);
	}
}