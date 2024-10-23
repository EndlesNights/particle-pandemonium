import { ParticleEmitter } from './ParticleEmitter.js'
import { ParticleEmitterDocument } from './ParticleEmitterDocument.js'

const PARTICLE_EMITTER_LAYER_ZINDEX = 900

/**
 * The ParticleEmitter Layer which displays particleEmitter icons within the rendered Scene.
 * @extends {PlaceablesLayer}
 */
export class ParticleEmitterLayer extends PlaceablesLayer {
    /** @inheritdoc */
    static get documentName() {
        return 'ParticleEmitter';
    }

    /** @inheritdoc */
    static documentName = 'ParticleEmitter'

    /** @override */
    static get layerOptions() {
        return foundry.utils.mergeObject(super.layerOptions, {
            name: 'particleEmitters',
            rotatableObjects: true,
            canDragCreate: false,
            canDelete: game.user.isGM,
            controllableObjects: false,
            snapToGrid: true,
            gridPrecision: 2,
            zIndex: PARTICLE_EMITTER_LAYER_ZINDEX
        })
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    get hookName() {
        return ParticleEmitterLayer.name;
    }

    /* -------------------------------------------- */
    /*  Methods                                     */
    /* -------------------------------------------- */

    /** @override */
    _activate() {
        super._activate();
        // for (const p of this.placeables) p.renderFlags.set({ refreshField: true });
    }

    /* -------------------------------------------- */
    /*    Event Listeners and Handlers              */
    /* -------------------------------------------- */

    /** @override */
    _onClickLeft(event) {
        super._onClickLeft(event)

        // snap the origin to grid when shift isn't pressed
        const { originalEvent } = event.data
        if (this.options.snapToGrid && !originalEvent.shiftKey) {
            const { origin } = event.interactionData
            event.interactionData.origin = this.getSnappedPoint(origin)
        }

        // position
        const { origin } = event.interactionData

        // get options from layer control
        // TODO: `animate` should be synced with partner
        const animate = this._animate === true
        const disabled = this._disabled === true
        const hidden = this._hidden === true

        // create new particleEmitter
        const doc = new ParticleEmitterDocument(
            { disabled, hidden, animate, x: origin.x, y: origin.y, _id: foundry.utils.randomID(16) },
            { parent: canvas.scene }
        )
        const particleEmitter = new ParticleEmitter(doc)
        return ParticleEmitterDocument.create(particleEmitter.document.toObject(false), { parent: canvas.scene })
    }

    /* -------------------------------------------- */

    static onPasteParticleEmitter(_copy, toCreate) {
        // only one particleEmitter should be pasteable at once, warn if we got more
        if (toCreate.length > 1) {
            console.error('more then one particleEmitter was pasted', _copy, toCreate)
            ui.notifications.error(game.i18n.localize('particleEmitters.ui.messages.internal-error'))
        }

    }

    /* -------------------------------------------- */

    /** @override */
    _onMouseWheel(event) {
        console.log("_onMouseWheel");
        // Identify the hovered light source
        const emitter = this.hover;
        if (!emitter || emitter.isPreview ) return;

        // Determine the incremental angle of rotation from event data
        const snap = event.shiftKey ? 15 : 3;
        const delta = snap * Math.sign(event.delta);
        return emitter.rotate(emitter.document.rotation + delta, snap);
    }

    /* -------------------------------------------- */

    /** @override */
    _onDragLeftStart(...args) { }

    /* -------------------------------------------- */

    /** @override */
    _onDragLeftDrop(...args) { }

    /* -------------------------------------------- */

    /** @override */
    _onDragLeftMove(...args) { }

    /* -------------------------------------------- */

    /** @override */
    _onDragLeftCancel(...args) { }
}
