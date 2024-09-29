export const MODULE_ID = 'particleEmitter'

export const injectControls = (controls) => {
  // ParticleEmitter Layer Tools
  const particleEmitterControl = {
    name: 'particleEmitter',
    title: 'Particle Emitters Controls',
    layer: 'particleEmitters',
    icon: 'far fa-cauldron',
    visible: game.user.isGM,
    tools: [
      {
        name: MODULE_ID,
        title: 'Create Particle Emitter',
        icon: 'fas fa-cauldron'
      },
      {
        name: 'clear',
        title: 'Clear Particle Emitters',
        icon: 'fas fa-trash',
        onClick: () => canvas.particleEmitters.deleteAll(),
        button: true
      }
    ],
    activeTool: 'particleEmitter'
  }

  controls.splice(controls.findIndex(e => e.name === 'walls') + 1, 0, particleEmitterControl)
}
