import Button from '../../Props/Button.js';
import Scene from '../../Scene.js';
import MenuScene from './MenuScene.js';
import QuestionScene from './QuestionScene.js';
export default class MistakeScene extends Scene {
    props;
    nextScene;
    questions;
    constructor(canvas, userData) {
        super(canvas, userData);
        this.props = [new Button(10, 10, 100, 50, 'blue', 'back', 20, 'backBtn')];
        this.questions = this.userData.getQuestions();
        this.questions.forEach((question, questionIndex) => {
            this.props.push(new Button(this.canvas.width / 2 - (200 / 2), 300 + (100 * questionIndex), 250, 100, 'white', `Vraag ${questionIndex + 1}`, 50, `${questionIndex}`));
        });
        this.nextScene = this;
        this.canvas.addEventListener('click', (event) => {
            this.props.forEach((prop) => {
                if (prop instanceof Button) {
                    if (prop.isHovered({ x: event.x, y: event.y })) {
                        if (prop.getId() === 'backBtn')
                            this.nextScene = new MenuScene(this.canvas, this.userData);
                        else
                            this.nextScene = new QuestionScene(this.canvas, this.userData, this.questions[Number(prop.getId())]);
                    }
                }
            });
        });
        this.canvas.addEventListener('mousemove', (event) => {
            this.props.forEach((prop) => {
                if (prop instanceof Button) {
                    prop.doHover({ x: event.x, y: event.y }, 'red');
                }
            });
        });
    }
    draw() {
        this.ctx.fillStyle = "#454443";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.props.forEach((prop) => {
            prop.draw(this.ctx);
        });
        this.userData.getQuestions();
        Scene.writeTextToCanvas(this.ctx, 'Vragen', this.canvas.width / 2, 100, 50, 'white');
        Scene.writeTextToCanvas(this.ctx, `Hier zijn de antwoorden voor de vragen die je hebt beantwoord`, this.canvas.width / 2, 250, 30, 'white');
    }
    processInput() {
    }
    update = (elapsed) => {
        return this.nextScene;
    };
}
//# sourceMappingURL=MistakesScene.js.map