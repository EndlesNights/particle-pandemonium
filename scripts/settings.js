export const MODULE_ID = 'particleEmitters'

export function registerSettings () {
  game.settings.register(MODULE_ID, 'dataVersion', {
    scope: 'world',
    config: false,
    type: String,
    default: 'fresh install'
  })

  game.settings.register(MODULE_ID, 'promptPlayer', {
    name: 'particleEmitters.settings.prompt-player.name',
    hint: 'particleEmitters.settings.prompt-player.hint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  })
}
