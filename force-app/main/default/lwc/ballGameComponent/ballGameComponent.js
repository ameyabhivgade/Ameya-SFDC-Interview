// ballGameComponent.js
import { LightningElement, track, api } from 'lwc';

export default class BallGameComponent extends LightningElement {
    @track score = 0;
    @track gameOver = false;
    @track gameStarted = false;
    
    // Game state properties
    ballX = 250;
    ballY = 50;
    ballSpeedX = 3;
    ballSpeedY = 4;
    paddleX = 200;
    paddleWidth = 100;
    paddleHeight = 10;
    gameWidth = 500;
    gameHeight = 400;
    ballSize = 20;
    paddleSpeed = 15;
    
    // Animation frame reference
    animationId;
    
    // Lifecycle hooks
    connectedCallback() {
        // Add keyboard event listeners when component loads
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    
    disconnectedCallback() {
        // Clean up event listeners and stop animation
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('keyup', this.handleKeyUp.bind(this));
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    // Public API method for starting game
    @api
    startNewGame() {
        this.resetGame();
        this.startGame();
    }
    
    // Event handlers
    handleStartGame() {
        this.startGame();
    }
    
    handleResetGame() {
        this.resetGame();
    }
    
    // Keyboard controls
    handleKeyDown(event) {
        if (!this.gameStarted || this.gameOver) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.movePaddleLeft();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.movePaddleRight();
                break;
            case ' ': // Spacebar for pause/unpause
                event.preventDefault();
                this.togglePause();
                break;
        }
    }
    
    handleKeyUp(event) {
        // Handle key release if needed for smoother controls
    }
    
    // Game logic methods
    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        this.gameLoop();
    }
    
    resetGame() {
        this.ballX = 250;
        this.ballY = 50;
        this.ballSpeedX = 3;
        this.ballSpeedY = 4;
        this.paddleX = 200;
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.updateDisplay();
    }
    
    movePaddleLeft() {
        this.paddleX = Math.max(0, this.paddleX - this.paddleSpeed);
        this.updatePaddlePosition();
    }
    
    movePaddleRight() {
        this.paddleX = Math.min(this.gameWidth - this.paddleWidth, this.paddleX + this.paddleSpeed);
        this.updatePaddlePosition();
    }
    
    gameLoop() {
        if (!this.gameStarted || this.gameOver) return;
        
        // Update ball position
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;
        
        // Ball collision with walls
        if (this.ballX <= 0 || this.ballX >= this.gameWidth - this.ballSize) {
            this.ballSpeedX = -this.ballSpeedX;
        }
        
        if (this.ballY <= 0) {
            this.ballSpeedY = -this.ballSpeedY;
        }
        
        // Ball collision with paddle
        if (this.ballY + this.ballSize >= this.gameHeight - 30 && 
            this.ballY + this.ballSize <= this.gameHeight - 20 &&
            this.ballX + this.ballSize >= this.paddleX && 
            this.ballX <= this.paddleX + this.paddleWidth) {
            
            this.ballSpeedY = -Math.abs(this.ballSpeedY);
            this.score += 10;
            
            // Add some randomness to ball direction
            this.ballSpeedX += (Math.random() - 0.5) * 2;
            this.ballSpeedX = Math.max(-8, Math.min(8, this.ballSpeedX));
        }
        
        // Game over condition
        if (this.ballY >= this.gameHeight) {
            this.gameOver = true;
            this.gameStarted = false;
            this.showGameOverMessage();
            return;
        }
        
        // Update display
        this.updateDisplay();
        
        // Continue game loop
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    updateDisplay() {
        const ball = this.template.querySelector('.ball');
        const paddle = this.template.querySelector('.paddle');
        
        if (ball) {
            ball.style.left = this.ballX + 'px';
            ball.style.top = this.ballY + 'px';
        }
        
        if (paddle) {
            paddle.style.left = this.paddleX + 'px';
        }
    }
    
    updatePaddlePosition() {
        const paddle = this.template.querySelector('.paddle');
        if (paddle) {
            paddle.style.left = this.paddleX + 'px';
        }
    }
    
    showGameOverMessage() {
        // Using LWC's reactive properties to show game over state
        this.gameOver = true;
        
        // Could dispatch custom event to parent component
        const gameOverEvent = new CustomEvent('gameover', {
            detail: { score: this.score }
        });
        this.dispatchEvent(gameOverEvent);
    }
    
    // Getter for computed properties
    get gameAreaStyle() {
        return `width: ${this.gameWidth}px; height: ${this.gameHeight}px;`;
    }
    
    get ballStyle() {
        return `left: ${this.ballX}px; top: ${this.ballY}px; width: ${this.ballSize}px; height: ${this.ballSize}px;`;
    }
    
    get paddleStyle() {
        return `left: ${this.paddleX}px; width: ${this.paddleWidth}px; height: ${this.paddleHeight}px; bottom: 20px;`;
    }
    
    get isGameReady() {
        return !this.gameStarted && !this.gameOver;
    }
    
    get startButtonLabel() {
        return this.isGameReady ? 'Start Game' : 'New Game';
    }
    
    get isStartButtonDisabled() {
        return this.gameStarted && !this.gameOver;
    }
    
    get gameStatus() {
        return this.gameOver ? 'Game Over' : 'Playing';
    }
}