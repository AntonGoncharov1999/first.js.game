let game = {
	ctx: undefined,
	width: 640,
	height: 360,
	rows: 4,
	cols: 8,
	blocks: [],

	platform: undefined,
	ball: undefined,
	raning: true,
	score: 0,

	sprites:{
		background: undefined,
		platform: undefined,
		bols: undefined
	},
	init: function(){
		let canvas = document.getElementById("mycanvas");
		this.ctx = canvas.getContext("2d");

		window.addEventListener("keydown", function(e){
			if(e.keyCode == 37){
				game.platform.dx = -game.platform.velocity;
			} 
			else if(e.keyCode == 39){
				game.platform.dx = game.platform.velocity;
			}
			else if(e.keyCode == 32){
				game.platform.releasBall();
			}		
		});
		window.addEventListener("keyup", function(e){
				game.platform.stop();
		});

	},

	load: function(){
		this.sprites.background = new Image();
		this.sprites.background.src = "images/background.jpeg";

		this.sprites.platform = new Image();
		this.sprites.platform.src = "images/Platform-1.png";

		this.sprites.bols = new Image();
		this.sprites.bols.src = "images/boll-1.png";

		this.sprites.block = new Image();
		this.sprites.block.src = "images/block.png";
	},

	create: function(){
		for(let row = 0; row < this.rows; row++){
			for (let col = 0; col < this.cols; col++) {
				this.blocks.push({
					x: 80 * col + 5,
					y: 40 * row + 20,
					width: 70,
					height: 30,
					isAlive: true
				});
			}
		}
	},

	start: function(){
		this.init();
		this.load();
		this.create();
		this.run(); 
	},

	render: function(){
		this.ctx.clearRect(0, 0, this.width, this.height);

		this.ctx.drawImage(this.sprites.background, 0, 0);
		this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
		this.ctx.drawImage(this.sprites.bols, this.ball.x, this.ball.y);

		this.blocks.forEach(function(element){
			if(element.isAlive){
				this.ctx.drawImage(this.sprites.block, element.x, element.y);
			}
		},this);
	},
	update: function(){
		if(this.ball.colide(this.platform)){
					this.ball.bumpPlatform(this.platform);
		}
		if(this.platform.dx){
			this.platform.move();
		}
		if(this.ball.dx || this.ball.dy){
			this.ball.move();
		}

		this.blocks.forEach(function(element){
			if(element.isAlive){
				if(this.ball.colide(element)){
					this.ball.bumpBlock(element);
				}
			}
		},this);

		this.ball.checBounds();
		this.platform.checPlatform();
	},
	run: function(){
		this.update();
		this.render();

		if(this.raning){
			window.requestAnimationFrame(function(){
				game.run();
			});
		}
	},
	over: function(){
		this.raning = false;
		console.log(`game over`);
	},
	viner: function(){
		game.ball.dx = 0;
		game.ball.dy = 0;
		console.log(`vin`);
	}
};

game.ball = {
	width: 20,
	height: 20,
	x: 320,
	y: 280,
	dx: 0,
	dy: 0,
	velocity: 3,
	jump: function(){
		this.dx = -this.velocity;
		this.dy = -this.velocity;
	},
	move: function(){
		this.x += this.dx;
		this.y += this.dy;
	},
	colide: function(element){
		let x = this.x + this.dx;
		let y = this.y + this.dy;

		if(x + this.width > element.x &&
			 x < element.x + element.width &&
			 y + this.height > element.y &&
			 y < element.y + element.height){
			return true;
		}
		return false;
	},
	bumpBlock: function(block){
		this.dy *= -1;
		block.isAlive = false;
		++game.score;
		if(game.score == 32){
			game.viner();
		}
	},
	onTheLeft: function(platform){
		return ( this.x + this.width / 2 ) < ( platform.x + platform.width / 2 );
	},
	bumpPlatform: function(platform){
		this.dy = -this.velocity;
		this.dx = this.onTheLeft(platform) ? -this.velocity : this.velocity;
	},
	checBounds: function(){
		let x = this.x + this.dx;
		let y = this.y + this.dy;

		if(x < 0){
			this.x = 0;
			this.dx = this.velocity;
		}
		else if( x + this.width > game.width){
			this.x = game.width - this.width;
			this.dx = -this.velocity; 
		}
		else if(y < 0){
			this.y = 0;
			this.dy = this.velocity;
		}
		else if(y + this.height > game.height){
			game.over();
		}
	}
};

game.platform = {
	width: 100,
	height: 50,
	x: 280,
	y: 300,
	velocity: 6, //максимально возможная скорость
	dx: 0, // текущая скорость
	ball:game.ball,
	checPlatform: function(){
		let x = this.x + this.dx;
		let y = this.y + this.dy;
		if(x < 0){
			this.x = 0;
			this.dx = 0;
		}
		else if( x + this.width > game.width){
			this.x = game.width - this.width;
			this.dx = 0; 
		}
	},
	move: function(){
		this.x += this.dx;

		if(this.ball){
			this.ball.x += this.dx;
		}
	},
	stop: function(){
		this.dx = 0;
	},
	releasBall: function(){
		if(this.ball){
			this.ball.jump();
			this.ball = false;
		}
	}
};

window.addEventListener("load", function(){
	game.start();
});