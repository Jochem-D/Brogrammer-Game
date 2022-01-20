import CutScene from "../../CutScene.js";
import KeyboardListener from "../../KeyboardListener.js";
import TextBox from "../../Props/TextBox.js";
import Text from '../../Props/Text.js';
import Scene from "../../Scene.js";
import UserData from "../../UserData.js";
import PokeEnemy from "./PokeEnemy.js";
import PokePlayer from "./PokePlayer.js";
import GameInfo from '../../GameInfo.js';
import Game from "../../Game.js";
import DoodleInfo from "../Doodle/Info/DoodleInfo.js";
import Button from "../../Props/Button.js";
import Prop from "../../Props/Prop.js";
import PokeTaleInfo from "./Info/PokeTaleInfo.js";
import HubScene from "../Hub/HubScene.js";
import ImageProp from "../../Props/ImageProp.js";
import RectProp from "../../Props/RectProp.js";
import PoketaleScene from "./PoketaleScene.js";


export default class BattleScene extends CutScene{
// no movement needed, just draw the enemy and the player. give them 4 options and if they choose correct one. score goes up by one
// verschillende types? als in: kan goed zijn 1 punt/ 0, je blijft op dat scherm, is helemaal goed 1 punt en door naar volgende, fout blijft ook op het scherm en -1, super fout blijf op scherm -2
  private player: PokePlayer;

  private playerHealth: number;

  private playerHealthBar: [RectProp, RectProp, Text];

  private enemy: PokeEnemy;

  private enemyHealth: number;

  private enemyHealthBar: [RectProp, RectProp, Text];

  private textBox: TextBox;

  private promptBox: TextBox;

  private props: Prop[];
  
  private prompt: number;

  private completed: boolean;

  private nextScene: Scene | null

  private points: number;

  public constructor(
    canvas: HTMLCanvasElement,
    userData: UserData,
    player: PokePlayer,
    enemy: PokeEnemy,
  ) {
    super(canvas, userData)
    const sentences = [
      "Je bent een wilde Gostleh tegengekomen!",
    ]

    this.player = player
    this.playerHealth = PokeTaleInfo.PLAYER_HEALTH

    this.enemy = enemy
    this.enemyHealth = PokeTaleInfo.ENEMY_HEALTH

    this.points = 1;
    
    this.generatePrompt(this.canvas)

    this.playerHealthBar = [
      new RectProp((this.canvas.width / 20) * (3/2), this.canvas.height / 2 - this.canvas.height / 12, this.canvas.width / 4, this.canvas.height / 12, 'gray', 'fill'),
      new RectProp((this.canvas.width / 20) * (3/2), this.canvas.height / 2 - this.canvas.height / 12, this.canvas.width / 4, this.canvas.height / 12, 'red', 'fill'),
      new Text((this.canvas.width / 20) * (3/2) + (this.canvas.width / 8), this.canvas.height / 2 - this.canvas.height / 24, this.canvas.width / 4, this.canvas.height / 12, 'Leven', 'white', this.canvas.height / 25),
    ]

    this.enemyHealthBar = [
      new RectProp((this.canvas.width / 2) + (this.canvas.width / 20), (this.canvas.height / 3) - (this.canvas.height / 12), (this.canvas.width / 4), (this.canvas.height / 12), 'gray', 'fill'),
      new RectProp((this.canvas.width / 2) + (this.canvas.width / 20), (this.canvas.height / 3) - (this.canvas.height / 12), (this.canvas.width / 4), (this.canvas.height / 12), 'red', 'fill'),
      new Text((this.canvas.width / 2) + (this.canvas.width / 20) + (this.canvas.width / 8), (this.canvas.height / 3) - (this.canvas.height / 24), (this.canvas.width / 4), (this.canvas.height / 12), 'Leven', 'white', this.canvas.height / 25),
    ]

    this.nextScene = null

    const questionClickFunction = (event: MouseEvent) => {
      let questionAnswered = false
      const question = PokeTaleInfo.PROMPTS[this.prompt]
      this.props.forEach((prop) => {
        if (prop instanceof Button) {
          if (prop.isHovered({x: event.x, y: event.y})) {
            for (let i = 0; i < question.moves.length; i++) {
              if (Number(prop.getId()) === i) {
                if (question.moves[i].correct) {
                  const correctSound = new Audio(GameInfo.SOUND_PATH + 'Correct.wav');
                  correctSound.volume = 0.6;
                  correctSound.play();
                  this.enemyHealth -= 10

                  this.enemyHealthBar[1].setWidth((this.canvas.width / 4) * (this.enemyHealth / PokeTaleInfo.ENEMY_HEALTH))
                } else {
                  const wrongSound = new Audio(GameInfo.SOUND_PATH + 'Wrong.mp3')
                  wrongSound.volume = 0.8;
                  wrongSound.play();
                  this.playerHealth -= 10

                  this.playerHealthBar[1].setWidth((this.canvas.width / 4) * (this.playerHealth / PokeTaleInfo.PLAYER_HEALTH))

                }
              }
            }
            questionAnswered = true
          }
        }
      })

      if (questionAnswered) {
        this.generatePrompt(this.canvas)
        if (this.playerHealth <= 0) {
          this.player.die()
          this.completed = true
        } else if (this.enemyHealth <= 0) {
          this
          
          this.completed = true
        }
      }

      if (this.completed) {
        this.canvas.removeEventListener('click', questionClickFunction)
        this.canvas.removeEventListener('mousemove', hoverFunction)
      }
    }

    const hoverFunction = (event: MouseEvent) => {
      this.props.forEach((prop) => {
        if (prop instanceof Button) {
          prop.doHover({x: event.x, y: event.y})
        }
      })
    }
    
    this.canvas.addEventListener('click', questionClickFunction)
    this.canvas.addEventListener('mousemove', hoverFunction)
  }


  public generatePrompt(canvas: HTMLCanvasElement): void {
    const chatBoxHeight = (canvas.height / 3)
    this.prompt = Game.randomNumber(0, PokeTaleInfo.PROMPTS.length - 1)

    const question = PokeTaleInfo.PROMPTS[this.prompt]
    this.props = []
    this.props.push(...[
      new ImageProp(0, (this.canvas.height / 3) * 2, GameInfo.IMG_PATH + 'PokeBox.png', this.canvas.width, this.canvas.height / 3),
      new ImageProp(0, 0, GameInfo.IMG_PATH + 'PokeBox.png', this.canvas.width, this.canvas.height / 10),
      new Text(canvas.width / 2, 50, canvas.width / 2, this.canvas.height, question.prompt, 'black', this.canvas.height / 25),
      new Button(canvas.width / 5 * 0.6 - this.canvas.width / 14, ((chatBoxHeight - (this.canvas.height / 5)) / 2) + (chatBoxHeight * 2), this.canvas.width / 2.5, this.canvas.height / 12, 'red', 'black', 'black', question.moves[0].move, this.canvas.height / 30, '0'),
      new Button((canvas.width / 5) * 3.1 - this.canvas.width / 14, ((chatBoxHeight - (this.canvas.height / 5)) / 2) + (chatBoxHeight * 2), this.canvas.width / 2.5, this.canvas.height / 12, 'purple', 'black', 'black', question.moves[1].move, this.canvas.height / 30, '1'),
      new Button((canvas.width / 5) * 0.6 - this.canvas.width / 14, ((chatBoxHeight - (this.canvas.height / 7))) + (chatBoxHeight * 2), this.canvas.width / 2.5, this.canvas.height / 12, 'blue', 'black', 'black', question.moves[2].move, this.canvas.height / 30, '2'),
      new Button((canvas.width / 5) * 3.1 - this.canvas.width / 14, ((chatBoxHeight - (this.canvas.height / 7))) + (chatBoxHeight * 2), this.canvas.width / 2.5, this.canvas.height / 12, 'green', 'black', 'black', question.moves[3].move, this.canvas.height / 30, '3'),
    ])
  }

  public draw(): void {
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(Game.loadNewImage(GameInfo.IMG_PATH + 'Battle-ground.png'), 0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.player.getImage(), (this.canvas.width / 20) * (3/2), this.canvas.height / 2, this.canvas.width / 4, this.canvas.height / 4)
    this.ctx.drawImage(this.enemy.getImage(), (this.canvas.width / 2) + (this.canvas.width / 20), this.canvas.height / 3, this.canvas.width / 4, this.canvas.height / 4)

    this.playerHealthBar.forEach((bar) => {
      bar.draw(this.ctx)
    })

    this.enemyHealthBar.forEach((bar) => {
      bar.draw(this.ctx)
    })
    this.props.forEach((prop) => {
      prop.draw(this.ctx)
    })
  }

  public processInput(): void {
    if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_SPACE)) {
      this.textBox.nextSentence()
    }
  }

  public update(elapsed: number): boolean {
    return this.completed
  }

  public getPoints(): number {
    return this.points;
  }

  public getOptionalScene(): Scene | null{
    return this.nextScene
  }
}
