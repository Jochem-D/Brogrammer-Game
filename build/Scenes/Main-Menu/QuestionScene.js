import Button from "../../Props/Button.js";
import Scene from "../../Scene.js";
import MistakeScene from "./MistakesScene.js";
export default class QuestionScene extends Scene {
    question;
    backButton;
    nextScene;
    constructor(canvas, userData, question) {
        super(canvas, userData);
        this.question = question;
        this.backButton = new Button(10, 10, 100, 50, 'blue', 'red', 'back', 20, 'backBtn');
        this.nextScene = this;
        const clickFunction = (event) => {
            let originalNextScene = this.nextScene;
            if (this.backButton.isHovered({ x: event.x, y: event.y })) {
                this.nextScene = new MistakeScene(this.canvas, this.userData);
            }
            if (originalNextScene !== this.nextScene) {
                this.canvas.removeEventListener('click', clickFunction);
                this.canvas.removeEventListener('mousemove', hoverFunction);
            }
        };
        const hoverFunction = (event) => {
            this.backButton.doHover({ x: event.x, y: event.y });
        };
        this.canvas.addEventListener('click', clickFunction);
        this.canvas.addEventListener('mousemove', hoverFunction);
    }
    draw() {
        this.ctx.fillStyle = "#454443";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.backButton.draw(this.ctx);
        Scene.writeTextToCanvas(this.ctx, this.question.question, this.canvas.width / 2, 200, 25, 'white', 'center', 'middle', this.canvas.width / 2);
        this.question.answers.forEach((answer, answerIndex) => {
            let color;
            if (answer.correct)
                color = 'green';
            else
                color = 'red';
            Scene.writeTextToCanvas(this.ctx, answer.answer, this.canvas.width / 2, 300 + (100 * answerIndex), 25, color, 'center', 'middle', this.canvas.width / 3);
        });
        Scene.writeTextToCanvas(this.ctx, this.question.questionInfo, this.canvas.width / 2, 750, 25, 'white', 'center', 'middle', this.canvas.width / 3);
    }
    processInput() {
    }
    update(elapsed) {
        return this.nextScene;
    }
}
//# sourceMappingURL=QuestionScene.js.map