import { LightningElement, track } from 'lwc';

export default class ballGameChatgpt extends LightningElement {
    @track paddleX = 100;
    @track ballX = 120;
    @track ballY = 0;
    ballDX = 0;
    ballDY = 3;
    gameInterval;

    get paddleStyle() {
        return `left: ${this.paddleX}px;`;
    }

    get ballStyle() {
        return `left: ${this.ballX}px; top: ${this.ballY}px;`;
    }

    connectedCallback() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.startGame();
    }

    disconnectedCallback() {
        clearInterval(this.gameInterval);
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        if (event.key === 'ArrowLeft' && this.paddleX > 0) {
            this.paddleX -= 20;
        } else if (event.key === 'ArrowRight' && this.paddleX < 240) {
            this.paddleX += 20;
        }
    }

    startGame() {
        this.ballX = 120;
        this.ballY = 0;
        this.ballDX = 2;
        this.gameInterval = setInterval(() => {
            this.ballX += this.ballDX;
            this.ballY += this.ballDY;

            // Bounce off walls
            if (this.ballX <= 0 || this.ballX >= 290) {
                this.ballDX *= -1;
            }

            // Check for paddle hit
            if (
                this.ballY >= 270 &&
                this.ballX >= this.paddleX &&
                this.ballX <= this.paddleX + 60
            ) {
                this.ballDY *= -1;
                this.ballY = 269; // Avoid sticking
            }

            // Game over
            if (this.ballY > 300) {
                clearInterval(this.gameInterval);
                alert('Game Over');
            }
        }, 30);
    }
}
