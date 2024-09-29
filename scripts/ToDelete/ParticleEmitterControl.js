import { MODULE_ID } from './settings.js'

/**
 * An icon representing a ParticleEmitter Control
 * @extends {PIXI.Container}
 */
export class ParticleEmitterControl extends PIXI.Container {
  constructor (particleEmitter) {
    super()
    this.particleEmitter = particleEmitter
    this.particleEmitter.particleEmitterControl = this
  }

  /* -------------------------------------------- */

  /**
   * Draw the ParticleEmitterControl icon, displaying it's icon texture and border
   * @return {Promise<ParticleEmitterControl>}
   */
  async draw () {
    console.log("Draw ParticleEmitter Control");
    const width = this.particleEmitter.controlIcon.width
    const height = this.particleEmitter.controlIcon.height
    const scale = this.particleEmitter.controlIcon.scale
    const borderSize = this.particleEmitter.controlIcon.borderSize
    const disabled = this.particleEmitter.document.disabled === true
    const hidden = this.particleEmitter.document.hidden === true


    // icon
    this.icon = this.icon || this.addChild(new PIXI.Sprite())
    this.icon.width = width
    this.icon.height = height
    this.icon.texture = await loadTexture(this.particleEmitter.icon)

    // // lock icon
    // this.lockIcon = this.lockIcon || this.addChild(new PIXI.Sprite())
    // this.lockIcon.width = width * 0.5
    // this.lockIcon.height = height * 0.5
    // this.lockIcon.texture = await loadTexture('icons/svg/padlock.svg')
    // this.lockIcon.visible = disabled && game.user.isGM
    // this.lockIcon.position.set(width * 0.5, height * 0.5)

    // background
    // this.bg = this.bg || this.addChild(new PIXI.Graphics())
    // this.bg.clear().beginFill(0x000000, 1.0).drawRoundedRect(...borderSize, 5).endFill()
    // this.bg.alpha = 0

    // border
    // this.border = this.border || this.addChild(new PIXI.Graphics())
    // this.border.clear().lineStyle(2 * scale, 0xFF5500, 0.8).drawRoundedRect(...borderSize, 5).endFill()
    // this.border.visible = false

    // control interactivity
    // this.eventMode = 'static'
    // this.interactiveChildren = false
    // this.hitArea = new PIXI.Rectangle(...borderSize)

    // set position
    this.position.set(this.particleEmitter.document.x - (width * 0.5), this.particleEmitter.document.y - (height * 0.5))

    // set visibility
    this.alpha = hidden ? 0.5 : 1.0

    // activate listeners
    this.removeAllListeners()
    this.on('pointerover', this._onMouseOver)
      .on('pointerout', this._onMouseOut)
      .on('mousedown', this._onMouseDown)
      .on('rightdown', this._onRightDown)

    // return the control icon
    return this
  }

  /* -------------------------------------------- */

  /**
   * Determine whether the ParticleEmitterControl is visible to the calling user's perspective.
   * The control is always visible if the user is a GM and no Tokens are controlled.
   * @see {SightLayer#testVisibility}
   * @type {boolean}
   */
  get isVisible () {
    const data = this.particleEmitter.document
    const point = new PIXI.Point(data.x, data.y)
    return canvas.visibility.testVisibility(point, { tolerance: 2, object: this })
  }

  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  _onMouseOver (ev) {
    ev.stopPropagation()
    if (game.paused && !game.user.isGM) return false
    this.border.visible = true
    this.bg.alpha = 0.25
    canvas.particleEmitters._hover = this.particleEmitter
  }

  /* -------------------------------------------- */

  _onMouseOut (ev) {
    ev.stopPropagation()
    if (game.paused && !game.user.isGM) return false
    this.border.visible = false
    this.bg.alpha = 0
    canvas.particleEmitters._hover = null
  }

  /* -------------------------------------------- */

  /**
   * Handle left mouse down events on the particleEmitter control icon.
   * This should teleport selected tokens to the other particleEmitter icon.
   * @param event
   * @private
   */
  async _onMouseDown (event) {
    event.stopPropagation()

    const selectedTokens = canvas.tokens.controlled

    // usage restrictions for players
    if (!game.user.isGM) {
      // particleEmitter is disabled
      if (this.particleEmitter.document.disabled) {
        ui.notifications.info(game.i18n.localize('particleEmitters.ui.messages.disabled'))
        return false
      }

      // disallow usage for players if game is paused
      if (game.paused) {
        ui.notifications.warn(game.i18n.localize('GAME.PausedWarning'))
        return false
      }

      // make sure at least one token is selected
      if (selectedTokens.length === 0) {
        ui.notifications.info(game.i18n.localize('particleEmitters.ui.messages.no-token-selected'))
        return false
      }
    }

    // ensure the player meant to activate the particleEmitter
    if (game.settings.get(MODULE_ID, 'promptPlayer')) {
      const playerConfirmed = await Dialog.confirm({
        title: game.i18n.localize('particleEmitters.ui.prompt.title'),
        content: game.i18n.localize('particleEmitters.ui.prompt.content')
      })

      if (!playerConfirmed) {
        return false
      }
    }

    // target particleEmitter + scene
    const { targetScene, targetData } = this.particleEmitter.target

    // make sure we have a counter part of the particleEmitter
    if (!targetData) {
      ui.notifications.error(game.i18n.localize('particleEmitters.ui.messages.no-partner'))
      return false
    }

    // collect required data for a teleport request
    const sourceData = this.particleEmitter.document
    const sourceSceneId = canvas.scene.id
    const selectedTokenIds = selectedTokens.map((token) => token.id)
    const targetSceneId = targetScene ? targetScene.id : null
    const data = { sourceSceneId, sourceData, selectedTokenIds, targetSceneId, targetData, userId: game.userId }

    // PreHook (can abort teleport)
    if (Hooks.call('PreParticleEmitterTeleport', data) === false) {
      return false
    }

    // teleport tokens across scenes
    if (targetSceneId !== null) {
      // preload target scene
      game.scenes.preload(targetSceneId)

      if (game.user.isGM) {
        if (selectedTokens.length > 0) {
          // do the teleport ourself
          await handleTeleportRequestGM(data)
          return false
        }
      } else {
        // missing GM for teleport
        if (GMs().length === 0) {
          ui.notifications.error(game.i18n.localize('particleEmitters.ui.messages.no-gm'))
          return false
        }

        // request teleport from a GM
        game.socket.emit('module.particleEmitters', { eventName: 'teleportRequestGM', data })
      }
    } else {
      // teleport/move tokens within scene (update position)
      const animate = this.particleEmitter.document.animate === true
      const tokenData = selectedTokens.map(token => {
        return {
          _id: token.id,
          x: Math.round(targetData.x - token.w / 2),
          y: Math.round(targetData.y - token.h / 2)
        }
      })
      await canvas.scene.updateEmbeddedDocuments(Token.embeddedName, tokenData, { animate })

      // Hook
      Hooks.call('ParticleEmitterTeleport', data)
    }

    // GM pan to target
    if (selectedTokens.length === 0) {
      if (targetSceneId !== null) {
        await targetScene.view()
      }

      canvas.pan({ x: targetData.x, y: targetData.y })
    }

    // event handled
    return false
  }

  /* -------------------------------------------- */

  /**
   * Handle right mouse down events on the door control icon
   * This should toggle whether the door is LOCKED or CLOSED
   * @param event
   * @private
   */
  _onRightDown (event) {
    event.stopPropagation()
    console.log("Right Click Control");
    if (!game.user.isGM) return

    const { originalEvent } = event

    // disabled (right click)
    let attribute = 'disabled'
    if (originalEvent.altKey) {
      // hidden (alt + right click)
      attribute = 'hidden'
    }

    // toggle attribute state
    this.particleEmitter.document.update({ [attribute]: !(this.particleEmitter.document[attribute] === true) })
  }
}
