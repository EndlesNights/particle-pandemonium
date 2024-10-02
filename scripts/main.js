'use strict'

import { hookModifyDocument, handleModifyEmbeddedDocument } from './dataQuirks.js'
import { injectControls } from './toolbar.js'
import { injectParticleEmitters } from './injection.js'
import { performMigrations } from './migration.js'
import { registerSettings, MODULE_ID } from './settings.js'
import { ParticleEmitter } from './ParticleEmitter.js'
import { ParticleEmitterLayer } from './ParticleEmitterLayer.js'
import { ExampleClass } from './particle-effects/example-dispersion.js';


Hooks.once('init', () => {
    // particleEmitter settings
    registerSettings()

    // inject particleEmitter layer / embedded document in hardcoded places
    injectParticleEmitters()

    if (!CONFIG[`${MODULE_ID}`]) {
        CONFIG[`${MODULE_ID}`] = {};
    }

    if (!CONFIG[`${MODULE_ID}`].particleFunctionTypes) {
        CONFIG[`${MODULE_ID}`].particleFunctionTypes = {};
    }

    CONFIG[`${MODULE_ID}`].particleFunctionTypes.example = {
        id: "example",
        label: "Example Function",
        effectClass: ExampleClass
    }
})

Hooks.on('setup', async () => {
    // redirect modifyDocument events for ParticleEmitter
    hookModifyDocument()

    // handle own events
    console.log(MODULE_ID)
    game.socket.on(`module.${MODULE_ID}`, (message) => {
        console.log("Socket")
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
    // await performMigrations();
})

Hooks.on('getSceneControlButtons', (controls) => {
    if (!game.user.isGM) return
    injectControls(controls)
})

// Hooks.on('sightRefresh', (sightLayer) => {
//     // ParticleEmitter Icons
//     for (const sw of canvas.controls.particleEmitters.children) {
//         sw.visible = !sw.particleEmitter.document.hidden || game.user.isGM
//         if (sightLayer.tokenVision) {
//             sw.visible &&= sw.isVisible
//         }
//     }
// })

Hooks.on(`paste${ParticleEmitter.embeddedName}`, ParticleEmitterLayer.onPasteParticleEmitter)

// Hooks.on('renderModuleManagement', async (moduleManagement, html) => {
//     if (!game.modules.get('module-credits')?.active) {
//         const tags = await renderTemplate('modules/particle-pandemonium/templates/module-management-tags.hbs')
//         html.find('li[data-module-name="particleEmitters"] .package-overview .package-title').after(tags)
//     }
// })