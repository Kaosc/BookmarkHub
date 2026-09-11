import type { Customizable, Sensors } from "@dnd-kit/dom"
import { PointerSensor, PointerActivationConstraints } from "@dnd-kit/dom"

/**
 * Text editing targets: pressing these should never start a drag.
 * Everything else — including the nested buttons and links inside
 * draggable items — starts a drag, matching the legacy behavior.
 * (The new default `preventActivation` blocks drags on ALL interactive
 * elements, which would make button-based items like bookmarks
 * undraggable, so we override it.)
 */
const NON_DRAGGABLE_SELECTOR =
	'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable]:not([contenteditable="false"])'

/**
 * Sensor configuration for the new dnd-kit DragDropProvider.
 *
 * The legacy MouseSensor/TouchSensor pair is merged into a single
 * PointerSensor, so the legacy `{delay, tolerance}` activation constraint
 * is recreated with `PointerActivationConstraints.Delay` for every
 * pointer type, and the legacy KeyboardSensor sorting is built into
 * sortables by default.
 *
 * @param delay hold time (ms) before a press becomes a drag
 * @param tolerance movement (px) allowed while holding before the press is
 * treated as a scroll/click and the drag is aborted
 */
export const makeSensorConfig = (delay: number, tolerance = 5): Customizable<Sensors> => {
	return (defaults) => [
		...defaults.filter((sensor) => sensor !== PointerSensor),
		PointerSensor.configure({
			activationConstraints: () => [
				new PointerActivationConstraints.Delay({ value: delay, tolerance }),
			],
			preventActivation: (event) => {
				const { target } = event
				return target instanceof Element && target.closest(NON_DRAGGABLE_SELECTOR) !== null
			},
		}),
	]
}