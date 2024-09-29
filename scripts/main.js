'use strict'

import { hookModifyDocument, handleModifyEmbeddedDocument } from './dataQuirks.js'
import { injectControls } from './toolbar.js'
import { injectParticleEmitters } from './injection.js'
import { performMigrations } from './migration.js'
import { registerSettings } from './settings.js'
import { ParticleEmitter } from './ParticleEmitter.js'
import { ParticleEmitterLayer } from './ParticleEmitterLayer.js'

Hooks.once('init', () => {
  // particleEmitter settings
  registerSettings()

  // inject particleEmitter layer / embedded document in hardcoded places
  injectParticleEmitters()
})

Hooks.on('setup', async () => {
  // redirect modifyDocument events for ParticleEmitter
  hookModifyDocument()

  // handle own events
  game.socket.on('module.particleEmitters', (message) => {
    const { eventName, data } = message

    if (eventName === 'modifyDocument') {
      handleModifyEmbeddedDocument(data)
    } else {
      console.error('unknown eventName:', eventName, data)
    }
  })
})

Hooks.once('ready', async () => {
  // migrate data and settings
  await performMigrations()
})

Hooks.on('getSceneControlButtons', (controls) => {
  if (!game.user.isGM) return
  injectControls(controls)
})

// Hooks.on('sightRefresh', (sightLayer) => {
//   // ParticleEmitter Icons
//   for (const sw of canvas.controls.particleEmitters.children) {
//     sw.visible = !sw.particleEmitter.document.hidden || game.user.isGM
//     if (sightLayer.tokenVision) {
//       sw.visible &&= sw.isVisible
//     }
//   }
// })

Hooks.on(`paste${ParticleEmitter.embeddedName}`, ParticleEmitterLayer.onPasteParticleEmitter)

Hooks.on('renderModuleManagement', async (moduleManagement, html) => {
  if (!game.modules.get('module-credits')?.active) {
    const tags = await renderTemplate('modules/particle-pandemonium/templates/module-management-tags.hbs')
    html.find('li[data-module-name="particleEmitters"] .package-overview .package-title').after(tags)
  }
})
