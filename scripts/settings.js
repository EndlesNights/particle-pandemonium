export const MODULE_ID = 'particle-pandemonium';

export function registerSettings () {
  game.settings.register(MODULE_ID, 'dataVersion', {
    scope: 'world',
    config: false,
    type: String,
    default: 'fresh install'
  })

  game.settings.register(MODULE_ID, 'promptPlayer', {
    name: 'particle-pandemonium.settings.prompt-player.name',
    hint: 'particle-pandemonium.settings.prompt-player.hint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  })
}
