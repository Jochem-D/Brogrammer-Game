import Button from '../../Props/Button.js';
import Prop from '../../Props/Prop.js';
import Scene from '../../Scene.js';
import UserData from '../../UserData.js';
import MenuScene from './MenuScene.js';
import QuestionScene from './QuestionScene.js';

export default class MistakeScene extends Scene {
  private props: Prop[];

  private nextScene: Scene;

  private questions: {question: string, answers: {answer: string, correct: boolean}[], questionInfo: string}[];

  public constructor(canvas: HTMLCanvasElement, userData: UserData) {
    super(canvas, userData)

    this.props = [new Button(10, 10, 100, 50, 'blue', 'red', 'back', 20, 'backBtn')];
    this.questions = this.userData.getQuestions();
    this.questions.forEach((question, questionIndex) => {
      this.props.push(new Button(this.canvas.width / 2 - (100 / 2), 300 +  (50 * questionIndex), 125, 50, 'white', 'red', `Vraag ${questionIndex + 1}`, 25, `${questionIndex}`));
    })
    
    this.nextScene = this

    const clickFunction = (event: MouseEvent) => {
      let originalNextScene = this.nextScene
      this.props.forEach((prop) => {
        if (prop instanceof Button) {
          if (prop.isHovered({x: event.x, y: event.y})) {
            if(prop.getId() === 'backBtn') this.nextScene = new MenuScene(this.canvas, this.userData)
            else this.nextScene = new QuestionScene(this.canvas, this.userData, this.questions[Number(prop.getId())])
          }
        }
      })

      if (originalNextScene !== this.nextScene) {
        this.canvas.removeEventListener('click', clickFunction)
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

    this.canvas.addEventListener('click', clickFunction)
    this.canvas.addEventListener('mousemove', hoverFunction)
  }

  public draw(): void {
    this.ctx.fillStyle = "#454443";
    this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
    this.props.forEach((prop) => {
      prop.draw(this.ctx)
    })
    this.userData.getQuestions();

    Scene.writeTextToCanvas(
      this.ctx,
      'Vragen',
      this.canvas.width / 2,
      100,
      50,
      'white',
    )

    Scene.writeTextToCanvas(
      this.ctx,
      `Hier zijn de antwoorden voor de vragen die je hebt beantwoord`,
      this.canvas.width / 2,
      250,
      30,
      'white',
    )
  }

  public processInput(): void {

  }

  public update = (elapsed: number): Scene => {
    return this.nextScene
  }
}
