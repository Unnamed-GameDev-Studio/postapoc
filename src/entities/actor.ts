import { Scene } from 'phaser';
import PlayerInput from '../components/playerInput';
import Interactable from './interactable';

export default class Actor extends Interactable {
  private playerInput?: PlayerInput;
  private status: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.health = 5;
    this.play('idle-down');
    this.status = scene.add.text(0, -50, 'Focus: none');
  }

  setControlState(playerInput: PlayerInput) {
    this.playerInput = playerInput;
  }

  getFocus() {
    if (!this.playerInput) {
      return;
    }
    return this.playerInput.getFocus();
  }

  update() {
    if (!this.playerInput) {
      return;
    }
    this.playerInput.update(this);
    this.status.setText(`Focus: ${this.playerInput.getFocus() || 'none'}`);
  }

  setFocus(interactable: Interactable) {
    if (!this.playerInput) {
      return;
    }
    if (interactable.getId() === this.id) {
      this.playerInput.setFocus(undefined);
      this.status.setText('No focus');
    } else {
      this.playerInput.setFocus(interactable);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'actor',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string
  ) {
    const actor = new Actor(this.scene, x, y, texture);

    this.scene.add.existing(actor);
    this.scene.physics.add.existing(actor);

    return actor;
  }
);
