import { COLOR, PARTICLE_EMITTER_DEFAULTS } from './ParticleEmitterConfig.js'
import { ParticleEmitterControlIcon } from './ParticleEmitterControlIcon.js'

/**
 * An ParticleEmitter is an implementation of PlaceableObject which represents a teleport between to points.
 * @extends {PlaceableObject}
 */
export class ParticleEmitter extends PlaceableObject {
    /**
     * A reference to the ControlIcon used to configure this particleEmitter
     * @type {ParticleEmitterControlIcon}
     */
    // controlIcon

    /* -------------------------------------------- */

    /** @inheritdoc */
    static get embeddedName() {
        return 'ParticleEmitter'
    }

    /** @override */
    static get RENDER_FLAGS() {
        return {
            redraw: { propagate: ['refresh'] },
            refresh: { propagate: ['refreshState', 'refreshField', 'refreshElevation'], alias: true },
            refreshField: { propagate: ['refreshPosition', 'refreshState'] },
            refreshPosition: {},
            refreshState: {},
            refreshElevation: {}
        }
    }


    get icon() {
        return this.document.icon || PARTICLE_EMITTER_DEFAULTS.icon
    }

    get x() {
        return this.document.x
    }

    get y() {
        return this.document.y
    }

    get width() {
        return this.document.width || PARTICLE_EMITTER_DEFAULTS.width
    }

    get height() {
        return this.document.height || PARTICLE_EMITTER_DEFAULTS.height
    }


    /* -------------------------------------------- */

    /**
     * Determine particleEmitter status and icon tint
     * @return {Object}
     */
    get status() {
        let background = COLOR.onScene
        let border = 0x000000

        // if (!this.onScene) {
        //     background = COLOR.onTargetScene
        // }

        // status color for configuration sheet
        const config = `#${(border !== 0x000000 ? border : background).toString(16)}`

        return { color: { background, border, config } }
    }

    /* -------------------------------------------- */

    /** @override */
    get bounds() {
        const bounds = new PIXI.Rectangle(this.x, this.y, 1, 1)
        return bounds.normalize()
    }

    /* -------------------------------------------- */
    /* Rendering
    /* -------------------------------------------- */

    /** @override */
    clear() {
        if (this.controlIcon) {
            this.controlIcon.parent.removeChild(this.controlIcon).destroy()
            this.controlIcon = null
        }
        super.clear()
    }

    /** @override */
    async _draw() {
        // create containers
        this.line = this.addChild(new PIXI.Graphics())
        this.controlIcon = this.addChild(new ParticleEmitterControlIcon({ texture: this.icon, width: this.width, height: this.height }))

        // Initial rendering
        this.refresh()
        if (this.id) this.activateListeners()
            
        return this
    }

    /* -------------------------------------------- */
    /*  Incremental Refresh                         */
    /* -------------------------------------------- */

    /** @override */
    _applyRenderFlags(flags) {
        if (flags.refreshState) this._refreshState();
        if (flags.refreshPosition) this._refreshPosition();
        // if (flags.refreshField) this._refreshField();
        if (flags.refreshElevation) this._refreshElevation();
    }
    /* -------------------------------------------- */

    /**
     * Refresh the state of the ParticleEmitter. Called when the disabled state or particle effect change.
     * @protected
     */
    _refreshState() {
        this.alpha = this._getTargetAlpha();
        this.zIndex = this.hover ? 1 : 0;
        this.refreshControl();
    }

    /* -------------------------------------------- */

    /**
     * Refresh the display of the ControlIcon for this AmbientLight source.
     */
    refreshControl() {
        const isHidden = this.id && this.document.hidden;
        this.controlIcon.tintColor = isHidden ? 0xFF3300 : 0xFFFFFF;
        this.controlIcon.borderColor = isHidden ? 0xFF3300 : 0xFF5500;
        this.controlIcon.elevation = this.document.elevation;
        // if(this.document.elevation){
        //     this.controlIcon.elevation = this.document.elevation;
        // } else {
        //     this.controlIcon.elevation = 0;
        // }
        this.controlIcon.refresh({ visible: this.layer.active, borderVisible: this.hover || this.layer.highlightObjects });
        this.controlIcon.draw();
    }

    /* -------------------------------------------- */

    /**
     * Refresh the position of the ParticleEmitter. Called with the coordinates change.
     * @protected
     */
    _refreshPosition() {
        const { x, y } = this.document;
        if ((this.position.x !== x) || (this.position.y !== y)) MouseInteractionManager.emulateMoveEvent();
        this.position.set(x, y);
    }
    /* -------------------------------------------- */

    /**
     * Refresh the elevation of the control icon.
     * @protected
     */
    _refreshElevation() {
        this.controlIcon.elevation = this.document.elevation;
    }

    /* -------------------------------------------- */

    /** @override */
    refresh(options) {
        super.refresh()

        // update state
        this.position.set(this.x, this.y)

        // clear old line
        this.line.clear()

        // draw line when master or during move
        const renderState = this.renderState
        if (renderState === 'master' || renderState === 'move') {
            // clear slave line
            if (renderState === 'master') {
                this.otherPlaceable.line.clear()
            }

            // draw connection line
            this.line.lineStyle(3, this.document.animate ? 0xccccff : 0x9fe2bf)
                .moveTo(0, 0)
                .lineTo(this.otherPlaceable.document.x - this.document.x, this.otherPlaceable.document.y - this.document.y)

            // set other particleEmitter in front of us (and therfore the line)
            // TODO: this is not working for 'move' as those particleEmitters are stored in this.layer.preview
            this.zIndex = -1
            this.otherPlaceable.zIndex = 1
        } else if (renderState === 'slave') {
            // trigger master update
            this.otherPlaceable.refresh()
        }

        // update icon tint
        const { background, border } = this.status.color
        this.controlIcon.tint = this.document.disabled === true ? 0x999999 : 0x000000
        this.controlIcon.typeColor = background
        this.controlIcon.statusColor = border
        this.controlIcon.draw()


        // Update visibility
        // this.alpha = this.document.hidden === true ? 0.5 : 1.0
        // this.controlIcon.border.visible = this.hover;

        return this
    }


    /* -------------------------------------------- */

    /** @override */
    _destroy(...args) {
        if (this.particleEmitterControl) this.particleEmitterControl.destroy({ children: true })
        super._destroy(...args)
    }

    /* -------------------------------------------- */
    /*    Socket Listeners and Handlers                             */
    /* -------------------------------------------- */

    /** @override */
    _onCreate(...args) {
        super._onCreate(...args)
        // canvas.controls.createParticleEmitterControl(this)

        // const { targetScene, targetData } = this.target
        // if (targetData) {
        //     // sync partner animate option
        //     const data = { animate: this.document.animate }

        //     // if partner is on another scene, update partner with our scene id
        //     if (targetScene) {
        //         data.scene = canvas.scene.id
        //     }

        //     (targetScene || canvas.scene).updateEmbeddedDocuments(this.document.documentName, [{ _id: targetData._id, ...data }])
        // }

        // // update sight when new particleEmitter was added
        // canvas.perception.update({ refreshVision: true }, true)
    }

    /* -------------------------------------------- */

    /** @override */
    _onUpdate(changed, options, userId) {
        super._onUpdate(changed, options, userId)

        this.renderFlags.set({
            refreshState: ("hidden" in changed) || (("config" in changed)),
            refreshElevation: "elevation" in changed
        });

    }

    /** @override */
    _onDelete(...args) {
        // unset particleEmitter connection target

        super._onDelete(...args)
    }

    /* -------------------------------------------- */

    /** @override */
    _canHUD(user, event) {
        return true;
    }
    /* -------------------------------------------- */

    /** @inheritdoc */
    _canConfigure(user, event) {
        return false; // Double-right does nothing
    }

    /* -------------------------------------------- */

    /** @inheritDoc */
    _canDragLeftStart(user, event) {
        // Prevent dragging another light if currently previewing one.
        if (this.layer?.preview?.children.length) {
            ui.notifications.warn("CONTROLS.ObjectConfigured", { localize: true });
            return false;
        }
        return super._canDragLeftStart(user, event);
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    _onClickRight(event) {
        this.document.update({ hidden: !this.document.hidden });
        if (!this._propagateRightClick(event)) event.stopPropagation();
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    _onDragLeftMove(event) {
        super._onDragLeftMove(event);
        // this.initializeLightSource({ deleted: true });
        const clones = event.interactionData.clones || [];
        // for (const c of clones) c.initializeLightSource();
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    _onDragEnd() {
        super._onDragEnd();
        if ( this.layer.active ) this.layer.draw();
    }

    /* -------------------------------------------- */

    /**
     * Is this ParticleEmitter currently visible? By default, true only if the ParticleEmitter actively emits particle effects.
     * @type {boolean}
     */
    get isVisible() {
        return !this._isParticleEmitterDisabled();
    }

    /**
     * Is the source of this ParticleEmitter disabled?
     * @type {boolean}
     * @protected
     */
    _isParticleEmitterDisabled() {
        const { hidden, config } = this.document;
        // Hidden ParticleEmitters are disabled
        if (hidden) return true;

        return false;
    }
}
