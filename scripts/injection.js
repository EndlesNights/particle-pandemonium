import { ParticleEmitterLayer } from './ParticleEmitterLayer.js'
import { ParticleEmitterDocument } from './ParticleEmitterDocument.js'
import { ParticleEmitter } from './ParticleEmitter.js'
// import { ParticleEmitterControl } from './ParticleEmitterControl.js'
import { ParticleEmitterConfig } from './ParticleEmitterConfig.js'
import { BaseParticleEmitter } from './BaseParticleEmitter.js'

const fields = foundry.data.fields

export const injectParticleEmitters = () => {
  // register particleEmitter classes
  CONFIG.ParticleEmitter = {
    documentClass: ParticleEmitterDocument,
    objectClass: ParticleEmitter,
    layerClass: ParticleEmitterLayer,
    sheetClasses: {}
  }

  const origDocumentTypesGetter = Object.getOwnPropertyDescriptor(Game.prototype, 'documentTypes').get
  Object.defineProperty(
    Game.prototype,
    'documentTypes',
    {
      get: function () {
        return {
          ...origDocumentTypesGetter.call(this),
          ParticleEmitter: ['base']
        }
      }
    }
  )

  DocumentSheetConfig.registerSheet(ParticleEmitterDocument, 'particleEmitters', ParticleEmitterConfig, {
    makeDefault: true,
    types: ['base']
  })

  hookCanvas()
  hookBaseScene()
  hookControlsLayer()
  // hookTokenLayer()

  // add particleEmitters as embedded document for existing scenes
  for (const scene of game.data.scenes) {
    if (!Array.isArray(scene.flags.particleEmitters)) {
      scene.flags.particleEmitters = []
    }
    scene.particleEmitters = foundry.utils.duplicate(scene.flags.particleEmitters || [])
  }
}

const hookCanvas = () => {
  // inject ParticleEmitterLayer into the canvas layers list
  const origLayers = CONFIG.Canvas.layers
  CONFIG.Canvas.layers = Object.keys(origLayers).reduce((layers, key, i) => {
    layers[key] = origLayers[key]

    // inject particleEmitters layer after walls
    if (key === 'walls') {
      layers.particleEmitters = {
        layerClass: ParticleEmitterLayer,
        group: 'interface'
      }
    }

    return layers
  }, {})

  // FIXME: workaround for #23
  if (!Object.is(Canvas.layers, CONFIG.Canvas.layers)) {
    console.error('Possible incomplete layer injection by other module detected! Trying workaround...')

    const layers = Canvas.layers
    Object.defineProperty(Canvas, 'layers', {
      get: function () {
        return foundry.utils.mergeObject(CONFIG.Canvas.layers, layers)
      }
    })
  }

  // Hook the Canvas.getLayerByEmbeddedName
  const origGetLayerByEmbeddedName = Canvas.prototype.getLayerByEmbeddedName
  Canvas.prototype.getLayerByEmbeddedName = function (embeddedName) {
    if (embeddedName === 'ParticleEmitter') {
      return this.particleEmitters
    } else {
      return origGetLayerByEmbeddedName.call(this, embeddedName)
    }
  }
}

const hookBaseScene = () => {
  // inject ParticleEmitter into scene metadata
  const BaseScene = foundry.documents.BaseScene

  Object.defineProperty(BaseScene.prototype.constructor, 'particleEmitters', { value: [] })

  const sceneMetadata = Object.getOwnPropertyDescriptor(BaseScene.prototype.constructor, 'metadata')
  // Hook the BaseScene#metadata getter
  Object.defineProperty(BaseScene.prototype.constructor, 'metadata', {
    value: Object.freeze(foundry.utils.mergeObject(sceneMetadata.value, {
      embedded: {
        ParticleEmitter: 'particleEmitters'
      }
    }, { inplace: false }))
  })

  // inject BaseParticleEmitter into BaseScene schema
  const defineSchema = BaseScene.prototype.constructor.defineSchema

  // Hook the BaseScene#defineSchema method
  // TODO: BaseScene#defineSchema may be called by another module before we are able to hook it
  // but we want to push out a fix for breaking changes in FoundryVTT 10, so ignore that for now
  // (see hookSceneData() in previous version)
  BaseScene.prototype.constructor.defineSchema = function () {
    const schema = defineSchema()

    // inject particleEmitters schema once
    if (!schema.particleEmitters) {
      schema.particleEmitters = new fields.EmbeddedCollectionField(BaseParticleEmitter)
    }

    return schema
  }
}

const hookControlsLayer = () => {
  // Hook ControlsLayer.draw
  const origDraw = ControlsLayer.prototype._draw
  ControlsLayer.prototype._draw = function () {
    this.drawParticleEmitters()
    origDraw.call(this)
  }
  ControlsLayer.prototype.drawParticleEmitters = function () {
    // Create the container
    if (this.particleEmitters) this.particleEmitters.destroy({ children: true })
    this.particleEmitters = this.addChild(new PIXI.Container())

    // Iterate over all particleEmitters
    // for (const particleEmitter of canvas.particleEmitters.placeables) {
    //   this.createParticleEmitterControl(particleEmitter)
    // }

    this.particleEmitters.visible = !canvas.particleEmitters.active
  }
  // ControlsLayer.prototype.createParticleEmitterControl = function (particleEmitter) {
  //   const sw = this.particleEmitters.addChild(new ParticleEmitterControl(particleEmitter))
  //   sw.visible = false
  //   sw.draw()
  // }
}

