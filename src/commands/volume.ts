import {ChatInputCommandInteraction} from 'discord.js';
import {TYPES} from '../types.js';
import {inject, injectable} from 'inversify';
import PlayerManager from '../managers/player.js';
import Command from './index.js';
import {SlashCommandBuilder} from '@discordjs/builders';

@injectable()
export default class implements Command {
  public readonly slashCommand = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set current player volume level')
    .addIntegerOption(option =>
      option.setName('level')
        .setDescription('Volume percentage (0 is muted, 100 is max & default)')
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true),
    );

  public requiresVC = true;

  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const player = this.playerManager.get(interaction.guild!.id);

    const currentSong = player.getCurrent();

    if (!currentSong) {
      throw new Error('Nothing is playing');
    }

    const level = interaction.options.getInteger('level') ?? 100;
    player.setVolume(level);
    await interaction.reply(`Volume set to ${level}%`);
  }
}
