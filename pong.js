$(document).ready(function() {

    // set up pong 

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var gameOver = true;

    const PI = Math.PI
    const HEIGHT = canvas.height
    const WIDTH = canvas.width 
    const upKey = 38, downKey = 40

    var keyPressed = null

    // set up objects

    var player = {
        x: null,
        y: null,
        width: 20,
        height: 100,
        update: function() {
            if (keyPressed == upKey && this.y > 0) { this.y -= 10}
            if (keyPressed == downKey && this.y < HEIGHT - this.height) { this.y += 10}
        },
        draw: function() {ctx.fillRect(this.x, this.y, this.width, this.height)}
    }
    var ai = {
        x: null,
        y: null,
        width: 20,
        height: 100,
        update: function() {
        	this.y += this.y < ball.y? 7: -7
        	//if(this.y < ball.y){this.y += 10}

        },
        draw: function() {ctx.fillRect(this.x, this.y, this.width, this.height)}
    }

    var ball = {
        x: null,
        y: null,
        size: 20,
        speedx: null,
        speedy: null,
        speed: 10,
        update: function() {

            // moving ball
            this.x += this.speedx
            this.y += this.speedy

            // bounce off top and bottom borders
            if (this.y + this.size >= HEIGHT || this.y < 0) {
                this.speedy *= -1
            }

            let other = this.speedx < 0? player: ai;
            let collided = checkCollision(ball, other)
    
            if (collided) {
                let n = (this.y + this.size - other.y) / (other.height + this.size);
                let phi = .25*PI*(2*n-1)
                this.speedx = this.speed * Math.cos(phi)
                this.speedy = this.speed * Math.sin(phi)
                if (other == ai) this.speedx *= -1
            }
            if (this.x + this.size < 0 || this.x > WIDTH) {
                gameOver = true;
                $("button").fadeIn();
                if (this.x + this.size < 0) {
                    $("h1").html('You lose!')
                } else {
                    $("h1").html('You win!')
                }
            }

        },
        draw: function (){ctx.fillRect(this.x, this.y, this.size, this.size)}
    }

    function checkCollision(a,b) {
        // TRUE IF ball collides with something else
        // a - ball
        // b - player/ai
        return (
            a.x < b.x + b.width && 
            a.y < b.y + b.height && 
            b.x < a.x + a.size && 
            b.y < a.y + a.size
        )
    }
    function main() {
        init()

        var loop = function(){
            update()
            draw()
            window.requestAnimationFrame(loop, canvas)
        }
        window.requestAnimationFrame(loop, canvas)

    }

    function init() {
        gameOver = false;
        $('h1').html('Pong')

        // move player and ai to middle

        player.x = 20;
        player.y = (HEIGHT - player.height) / 2
        ai.x = (WIDTH - ai.width - 20)
        ai.y = (HEIGHT - ai.height ) / 2

        // set up ball in middle

        ball.x = (WIDTH - ball.size) / 2
        ball.y = (HEIGHT - ball.size) / 2

        // serve the ball (start game)
        ball.speedx = ball.speed

        // random direction (which player starts first)
        if (Math.round(Math.random())) {
            ball.speedx *= -1
        }

        ball.speedy = 0;

    }

    function update() {
        if (!gameOver) { 
            ball.update()
        }
        ai.update()
        player.update()
    }
    
    function draw() {
        ctx.fillRect(0,0, WIDTH, HEIGHT);
        ctx.save()
        ctx.fillStyle = 'white'
        ball.draw()
        ai.draw()
        player.draw()

        let w = 4;
        let x = (WIDTH - w) / 2;
        let y = 0;
        let step = HEIGHT/15;
        while (y < HEIGHT) {
            ctx.fillRect(x,y+step*.25, w, step*.5)
            y += step;
        }

        ctx.restore()
    }

    $(document).on('keyup', function() { keyPressed = null; });
    $(document).on('keydown', function(e) { keyPressed = e.which; });

    $("button").on('click', function() {
        $(this).hide();
        init()
    })
    main();

});