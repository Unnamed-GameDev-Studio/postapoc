import { log } from '../utilities';
import { Action } from './actionSystem';
import config from '../../config/config.json' assert { type: 'json' };
import { EventBus } from '@src/systems';
import { Debuggable } from '@systems/debuggable';

export class PlayerControl extends Debuggable {
    protected debug = false;
    private keyMap: Map<string, string>;
    private universeEventBus: EventBus;

    constructor(eventBus: EventBus) {
        super();
        const { controls } = config;
        this.keyMap = new Map(Object.entries(controls));
        this.universeEventBus = eventBus;
    }

    loadKeyEvents(scene: Phaser.Scene) {
        scene.input.removeAllListeners();
        if (this.debug) log.debug('Loading key events');
        scene.input.keyboard.on('keydown', (input: KeyboardEvent) => {
            if (!input.repeat) {
                this.handleKeyDownEvent(input);
            }
        });
        scene.input.keyboard.on('keyup', (input: KeyboardEvent) => {
            this.handleKeyUpEvent(input);
        });
    }

    public handleKeyDownEvent(input: KeyboardEvent) {
        const action = this.getActionFromKeyCode(input.code);
        if (action) {
            if (this.debug) log.debug(`KeyDown Action: ${action}`);
            this.universeEventBus.publish('actionEvent', {
                action: action,
                interactableId: 'player'
            });
        } else {
            if (this.debug)
                log.debug(`Unconfigured key pressed: ${input.code}`);
        }
    }

    public handleKeyUpEvent(input: KeyboardEvent) {
        const action = this.getActionFromKeyCode(input.code);
        if (action) {
            if (this.debug) log.debug(`KeyUp Action: ${action}`);
            this.universeEventBus.publish('resetEvent', {
                action: action,
                interactableId: 'player'
            });
        } else {
            if (this.debug)
                log.debug(`Unconfigured key pressed: ${input.code}`);
        }
    }

    private getActionFromKeyCode(input: string) {
        const action = this.keyMap.get(input);
        if (action) {
            return action as Action;
        }
        if (this.debug) log.debug(`No action mapped to key: ${input}`);
        return null;
    }
}
