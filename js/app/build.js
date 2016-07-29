"use strict"
define(["./app/functions/_easing"], function(_easing){

    (function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];

	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }

	    if (!window.requestAnimationFrame)
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };

	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	}());

    function unit() {
        var canvas = document.getElementById('field'),
			ctx = canvas.getContext("2d"),
			scaleFactor = 0.6,
			cW, cH, requestId;

	    //ctx.scale(scaleFactor,scaleFactor);

	    cW = ctx.canvas.width;
		cH = ctx.canvas.height;

	    cW = Math.floor(cW + cW / scaleFactor - cW);
	    cH = Math.floor(cH + cH / scaleFactor - cH);

		function ease(pos) {
			return (-0.5 * (Math.cos(Math.PI*pos) -1));
		};

		var register = (function(){
			var counter = 0,
				arr = [];
			return function(elem) {
				counter++;
				arr.push(elem.data.index);
				if (arr[2] != undefined) {
					if (counter == 3 && arr[0] == arr[1] && arr[1] == arr[2]) {
						$('.win__item').addClass('animation-win');
						counter = 0;
						arr = [];
					} else if (counter == 3 && arr[0] != arr[2] || arr[0] != arr[1]){
						$('.lose__item').addClass('animation-lose');
						counter = 0;
						arr = [];
					}
				}
			}
		})()

		function builder(road,item,data) {
			var data = data;
			for (var i=0; i<data.length; i++) {
				var rand = getRandomInt(0, data.length);
				var tmp = data[i];
				data[i] = data[rand];
				data[rand] = tmp;
			}
			for (var i=0; i<item.length; i++) {
				road.items[i].data = data[i];
				road.items[i].img.src = road.items[i].data.img;
			}
			road.items[item.length-1].img.onload = function() {
				requestId = window.requestAnimationFrame(animate);
			}
		};

		function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min)) + min;
		};

		function randomizer(arr, begin, length) {
			var count = begin,
				newArr = [];
			for (var j=count; j<arr.length; j++) {
				newArr.push(arr[j]);
			}
			for (var i=0; i<length-begin; i++) {
				var rand = getRandomInt(0,length);
				var tmp = newArr[i];
				newArr[i] = newArr[rand];
				newArr[rand] = tmp;
			}
			arr.splice(begin,length);
			var concat = arr.concat(newArr);
			return concat;
		};

		var data = [
			{
				'index': 3,
				'img': 'img/3.png'
			},
			{
				'index': 4,
				'img': 'img/4.png'
			},
			{
				'index': 3,
				'img': 'img/3.png'
			},
			{
				'index': 4,
				'img': 'img/4.png'
			},
			{
				'index': 7,
				'img': 'img/7.png'
			},
			{
				'index': 6,
				'img': 'img/6.png'
			},
			{
				'index': 7,
				'img': 'img/7.png'
			},
			{
				'index': 8,
				'img': 'img/8.png'
			},
			{
				'index': 9,
				'img': 'img/9.png'
			},
			{
				'index': 8,
				'img': 'img/8.png'
			}
		];

		function Item(x,y,width,height,context) {
			this.data = {
				'index': 0,
				'img': 0
			};
			this.img = new Image();
			this.sizes = {
				'width': width,
				'height': height
			};
			this.coords = {
				'x': x,
				'y': y
			};
			this.render = function() {
				context.beginPath();
				context.drawImage(this.img, this.coords.x, this.coords.y,150,114);
				context.fillStyle = "#000";
				context.strokeStyle = "#000";
				context.lineWidth = 1;
				context.moveTo(this.coords.x,this.coords.y);
				context.lineTo(this.coords.x + this.sizes.width,this.coords.y);
				context.lineTo(this.coords.x + this.sizes.width,this.coords.y + this.sizes.height);
				context.lineTo(this.coords.x,this.coords.y + this.sizes.height);
				context.lineTo(this.coords.x,this.coords.y);
				context.stroke();
				context.closePath();
			}
		}


		function Road(x, y, itemsLength, Item, target) {
			var that = this;
			this.coords = {
				'x': x,
				'y': y
			};
			this.go = false;
			this.items = [];
			this.interval = 0;
			this.total = 0;
			this.start = Date.now();
			this.target = target;
			this.constructor = function(){
				for (var i=0,interval = -114; i<itemsLength; i++,interval = interval + 114) {
					var item = new Item(this.coords.x ,interval,150,114,ctx);
					that.items.push(item);
				}
			};
		}

		Road.prototype.render = function(){
			for (var i=0; i<this.items.length; i++) {
				this.items[i].render();
			}
		}

		Road.prototype.animate = function(s) {

			if (!this.go) {
				this.start = Date.now();
				return;
			}

			var now = Date.now(),
				duration = this.target / s * 6.5,
				t = (now-this.start)/duration,
				speed = s* ease(t);

			if (this.interval + speed >= this.items[0].sizes.height) {
				speed = this.items[0].sizes.height - this.interval;
			}

			this.interval += speed;
			this.total += speed;


			if (this.interval >= this.items[0].sizes.height) {
				this.items[this.items.length-1].coords.y = this.items[0].coords.y - this.items[0].sizes.height ;
				this.items.unshift(this.items.splice(this.items.length-1,1)[0]);
				this.interval = 0;
			}

			if (this.total >= this.target) {
				for (var i=0; i<this.items.length; i++) {
					this.items[i].coords.y += this.target - this.total + speed;
					this.items[i].coords.y = this.items[i].coords.y;
				};
				this.interval = 0;
				this.total = 0;
				this.go = false;
				this.complete();
				return;
			}

			for (var i=0; i<this.items.length; i++) {
				this.items[i].coords.y += speed;
			}
		};

		Road.prototype.random = function(begin, length) {
			this.items = randomizer(this.items, begin, length);
			console.log(this.items);
		};

		Road.prototype.win = function() {
			for (var i=0; i<this.items.length; i++) {
				if (this.items[i].data.index == 8) {
					this.target = (9 * 114) - ((9 - (this.items.length - i)) * 114) + 228;
				}
			}
		};

		Road.prototype.run = function(hack) {
			if (!hack) {
				if (!this.go) {
					this.random(3,7);
					this.target = 2736;
					this.go = true;
				}
			} else {
				if (!this.go) {
					this.win();
					this.go = true;
				}
			}

		};

		Road.prototype.complete = function() {
			register(this.items[2]);
		};

		var road1 = new Road(0, 0, 10, Item, 1140);
		road1.constructor();
		builder(road1,road1.items,data);

		var road2 = new Road(150, 0, 10, Item, 2736);
		road2.constructor();
		builder(road2, road2.items, data);

		var road3 = new Road(300, 0, 10, Item, 2736);
		road3.constructor();
		builder(road3,road3.items,data);

		$('.normal').click(function(){
			$('.hack').css('display','table');
			$('.hack').animate({
				'opacity': 1
			},'slow');
			if (!road3.go) {
				road1.run();
				road2.run();
				road3.run();
				$('.win__item').removeClass('animation-win');
				$('.lose__item').removeClass('animation-lose');
			}
		});

		$('.hack').click(function(){
			if (!road3.go) {
				road1.run(true);
				road2.run(true);
				road3.run(true);
				$('.win__item').removeClass('animation-win');
				$('.lose__item').removeClass('animation-lose');
			}
		});

		function animate() {
			ctx.save();
			ctx.clearRect(0,0,cW,cH);
			road1.animate(16);
			road1.render();
			road2.animate(14);
			road2.render();
			road3.animate(12);
			road3.render();
			ctx.restore();
			requestId = requestAnimationFrame(animate);
		};
    }

    return {
       unit: unit,
    };
});
