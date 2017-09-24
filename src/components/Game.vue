<template>
	<div id="game-canvas" @keyup:left="left();" @keyup:right="right()" @keyup:up="up()" @keyup:down="down()">
		<div class="title">
			<h1>
				<span>2</span>
				<span>0</span>
				<span>4</span>
				<span>8</span>
			</h1>
			<div class="info"><h4>score</h4><p>{{ score }}</p></div>
			<div class="info"><h4>steps</h4><p>{{ steps }}</p></div>
		</div>
		<div class="game-canvas clearfix scroll">
			<div v-for="row in matrix" class="row">
				<div v-for="num in row" class="grid-cell" :class="'num-'+level.indexOf(num)">
					<span>{{ values[num] }}</span>
				</div>
			</div>
		</div>
		<button class="reset" @click="reset()">reset</button>
		<div class="shadow-block" v-bind:class="{'hidden':!haslost}">
			<div class="lost-tips">
				<h1>lose!!</h1>
				<button class="restart" @click="reset()">Restart</button>
			</div>
		</div>
		<span style="display:none">{{ status }}</span>
	</div>
</template>
<script>
	import AlloyFinger from 'alloyfinger'

	export default{
		data(){
			return {
				matrix:[],
				level:[0,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192],
				values:{
						0:'0',
						2:'2',
						4:'4',
						8:'8',
						16:'16',
						32:'32',
						64:'64',
						128:'128',
						256:'256',
						512:'512',
						1024:'1024',
						2048:'2048',
						4096:'4096',
						8192:'8192'
					  },
				score:0,				//分数
				steps:0,				//步数
				fourProbability:0.1,	//生成4的概率
				haslost:false,
				status:true				//vue的纯数组变化不能直接响应到页面上，需要一个辅助变量变化以改变页面状态			
			}
		},
		methods:{
			init:function(){
				this.steps = parseInt(localStorage.steps)||0;
				this.score = parseInt(localStorage.score)||0;
				if(this.haslost){
					this.haslost=!this.haslost;
				}
				if(window.localStorage&&localStorage.matrix){
					if(localStorage.matrix.length>0){
						this.matrix = JSON.parse(localStorage.matrix);
					}
				}else{
					for(var i = 0;i < 4;i++){
						if(this.matrix[i]){
							this.matrix[i].length = 0;
						}else{
							this.matrix[i] = [];
						}
						for(var j =0;j < 4;j++){
							this.matrix[i][j] = 0;
						}
					}
					this.random();
				}
			},
			left:function(){
				var ischanged = false;
				if(this.gatherleft() !== -1){
					ischanged = true;
				}
				for(var i = 0;i < 4;i++){
					for(var j = 1;j <4 ;j++){
						if(this.matrix[i][j] !== 0 && this.matrix[i][j] < 8192){
							if(this.matrix[i][j] == this.matrix[i][j-1]){
								this.matrix[i][j-1] += this.matrix[i][j];
								this.matrix[i][j] = 0;
								this.score+=this.matrix[i][j-1];
								this.gatherleft();
								if(!ischanged) ischanged = true;
							}
						}
					}
				}
				if(!this.nospace()&&ischanged){
					this.steps++;
					this.random();
				}
				this.lostcheck();
			},
			right:function(){
				var ischanged = false;
				if(this.gatherright() !== -1){
					ischanged = true;
				}
				for(var i = 0;i < 4;i++){
					for(var j = 2;j >= 0;j--){
						if(this.matrix[i][j] !== 0 && this.matrix[i][j] < 8192){
							if(this.matrix[i][j] == this.matrix[i][j+1]){
								this.matrix[i][j+1] += this.matrix[i][j];
								this.matrix[i][j] = 0; 
								this.score+=this.matrix[i][j+1];
								this.gatherright();
								if(!ischanged) ischanged = true;
							}
						}
					}
				}
				if(!this.nospace()&&ischanged){
					this.steps++;
					this.random();
				}
				this.lostcheck();
			},
			up:function(){
				var ischanged = false;
				if(this.gatherup() !== -1){
					ischanged = true;
				}
				for(var j = 0;j < 4;j++){
					for(var i = 1;i < 4;i++){
						if(this.matrix[i][j] !== 0 && this.matrix[i][j] < 8192){
							if(this.matrix[i][j] == this.matrix[i-1][j]){
								this.matrix[i-1][j] += this.matrix[i][j];
								this.matrix[i][j] = 0;
								this.score+=this.matrix[i-1][j];
								this.gatherup();
								if(!ischanged) ischanged = true;
							}
						}
					}
				}
				if(!this.nospace()&&ischanged){
					this.steps++;
					this.random();
				}
				this.lostcheck();
			},
			down:function(){
				var ischanged = false;
				if(this.gatherdown() !== -1){
					ischanged = true;
				}
				for(var j = 0;j < 4;j++){
					for(var i = 2;i >= 0;i--){
						if(this.matrix[i][j] !== 0 && this.matrix[i][j] < 8192){
							if(this.matrix[i][j] == this.matrix[i+1][j]){
								this.matrix[i+1][j] += this.matrix[i][j];
								this.matrix[i][j] = 0;
								this.score+=this.matrix[i+1][j];
								this.gatherdown();
								if(!ischanged) ischanged = true;
							}
						}
					}
				}
				if(!this.nospace()&&ischanged){
					this.steps++;
					this.random();
				}
				this.lostcheck();
			},
			gatherleft:function(){			//向左靠拢
				var temp = 0,k = 0,ischanged = -1;
				for(var i = 0;i<4;i++){
					for(var j = 1;j<4;j++){
						k=j;
						while(k-1>=0&&this.matrix[i][k-1]==0){
							if(this.matrix[i][k] !== 0){
								temp = this.matrix[i][k-1];
								this.matrix[i][k-1] = this.matrix[i][k];
								this.matrix[i][k] = temp;
								ischanged++;
							}
							k--;
						}
					}
				}
				return ischanged;
			},
			gatherright:function(){			//向右靠拢
				var temp = 0,k = 0,ischanged = -1;
				for(var i = 0;i<4;i++){
					for(var j = 2;j>=0;j--){
						k=j;
						while(k+1<=3&&this.matrix[i][k+1]==0){
							if(this.matrix[i][k] !== 0){
								temp = this.matrix[i][k+1];
								this.matrix[i][k+1] = this.matrix[i][k];
								this.matrix[i][k] = temp;
								ischanged++;
							}
							k++;
						}
					}
				}
				return ischanged;
			},
			gatherup:function(){			//向上靠拢
				var temp = 0,k = 0,ischanged = -1;
				for(var j = 0;j<4;j++){
					for(var i = 1;i<4;i++){
						k=i;
						while(k-1>=0&&this.matrix[k-1][j]==0){
							if(this.matrix[k][j] !== 0){
								temp = this.matrix[k-1][j];
								this.matrix[k-1][j] = this.matrix[k][j];
								this.matrix[k][j] = temp;
								ischanged++;
							}
							k--;
						}
					}
				}
				return ischanged;
			},
			gatherdown:function(){			//向下靠拢
				var temp = 0,k = 0,ischanged=-1;
				for(var j = 0;j<4;j++){
					for(var i = 2;i>=0;i--){
						k=i;
						while(k+1<=3&&this.matrix[k+1][j]==0){
							if(this.matrix[k][j] !== 0){
								temp = this.matrix[k+1][j];
								this.matrix[k+1][j] = this.matrix[k][j];
								this.matrix[k][j] = temp;
								ischanged++;
							}
							k++;
						}
					}
				}
				return ischanged;
			},
			nospace:function(){ //判斷區域是否有空格
				for(var i=0;i<4;i++){
					for(var j=0;j<4;j++){
						if(this.matrix[i][j] == 0){
							return false;
						}
					}
				}
				return true;
			},
			random:function(){ 	//随机在空白区域生成值为2或4的方块
				if(this. nospace()){
					return;
				}
				var posX = parseInt(Math.floor(Math.random()*4));
				var posY = parseInt(Math.floor(Math.random()*4));
				var val = Math.random()>this.fourProbability?2:4;

				while(true){
					if(!this.matrix[posY][posX]) break;
					posX = parseInt(Math.floor(Math.random()*4));
					posY = parseInt(Math.floor(Math.random()*4));
				}
				this.matrix[posY][posX] = val;
				posX = null;
				posY = null;
				this.save();
			},
			nomove:function(){	//判斷是否無法移動
				for(var i=0;i<3;i++){
					for(var j=0;j<3;j++){
						if(this.matrix[i][j] === this.matrix[i+1][j] || this.matrix[i][j] === this.matrix[i][j+1] || this.matrix[i][j] === 0){
							return false;
						}
					}
				}
				for(var i=0;i<3;i++){
					if(this.matrix[i][3] === this.matrix[i+1][3] || this.matrix[i][j] === 0 || this.matrix[i+1][j] === 0){
							return false;
						}
				}
				for(var j=0;j<3;j++){
					if(this.matrix[3][j] === this.matrix[3][j+1] || this.matrix[i][j] === 0){
							return false;
						}
				}
				return true;
			},
			handleKeyDown:function(event){
				(event.keyCode === 37&&this.left())||(event.keyCode === 38&&this.up())||(event.keyCode === 39&&this.right())||(event.keyCode === 40&&this.down());
			},
			lostcheck:function(){
				if(this.nomove()){
					this.haslost = true;
					if(window.localStorage){
						localStorage.score = 0;
						localStorage.matrix = [];
						localStorage.steps = 0;
					}
				}
			},
			reset:function(){
				if(window.localStorage){
					localStorage.score = 0;
					localStorage.matrix = [];
					localStorage.steps = 0;
				}

				this.init();
				this.status = !this.status;
			},
			save:function(){
				if(this.steps>0&&!this.haslost&&window.localStorage){
					localStorage.score = this.score;
					localStorage.matrix = JSON.stringify(this.matrix);
					localStorage.steps = this.steps;
				}
			}
		},
		created(){
			this.init();
		},
		mounted(){
			//为键盘上下左右添加监听器
			window.addEventListener("keydown",this.handleKeyDown.bind(this));
		    //AlloyFiner手势插件初始化
		    let swordEle = document.getElementById('game-canvas');
		    var vue = this;
		    var af = new AlloyFinger(swordEle, {
		      swipe: function (evt) {
		       (evt.direction === "Up"&&vue.up())||(evt.direction === "Down"&&vue.down())||(evt.direction === "Left"&&vue.left())||(evt.direction === "Right"&&vue.right())        
           		}
		    });
		    //禁止微信浏览器下拉显示域名功能，以免影响下划事件
		    var overscroll = function(el) {
				el.addEventListener('touchstart', function() {
				  var top = el.scrollTop
				    , totalScroll = el.scrollHeight
				    , currentScroll = top + el.offsetHeight;
				  if(top === 0) {
				    el.scrollTop = 1;
				  } else if(currentScroll === totalScroll) {
				    el.scrollTop = top - 1;
				  }
				});
				el.addEventListener('touchmove', function(evt) {
				if(el.offsetHeight < el.scrollHeight)
				    evt._isScroller = true;
				});
			}
			overscroll(document.querySelector('.scroll'));
			document.body.addEventListener('touchmove', function(evt) {
			  if(!evt._isScroller) {
			    evt.preventDefault();
			  }
			});
		},
		beforeDestroy(){
			window.removeEventListener("keydown",this.handleKeyDown.bind(this));
		}
	}
</script>
<style lang="scss">
	$base-color : #eee4da;
	// $cell-colors : #ccc0b2 #eee4da #faedc8 #f26179 #f59563 #f67c5f #edcf72 #edcc61 #9c0 #3365a5 #09c #a6b #93c;
	$cell-colors : #dcb #eee #eec #fb8 #f96 #f75 #f53 #ec7 #ec6 #ec5  #ec3 #ec2 #f4be26 #93c;
	$cell-fonts : #7a7067 #7a7067 #7a7067 #fff #fff #fff #fff #fff #fff #fff #fff #fff #fff #fff;
	@mixin cell-size{
		width: 80px;
		height: 80px;
		line-height: 80px;
		border-radius: 10px;
		font-size: 24px;
		margin-left: 5px;
		margin-top: 5px;
		@media screen and (max-width:400px) {
			width: 60px;
			height: 60px;
			line-height: 60px;
			border-radius: 8px;
			font-size: 20px;
			margin-left: 4px;
			margin-top: 4px;
		}
	}
	@mixin canvas-size{
		width: 345px;
		height: 345px;
		border-radius: 10px;
		@media screen and (max-width:400px) {
			width: 260px;
			height: 260px;
			border-radius: 8px;
		}
	}
	@mixin info-size{
		width: 120px;
		height: 60px;
		line-height: 25px;
		p{
			line-height: 35px;
			font-size: 1.8rem;
		}
		border-radius: 8px;
		@media screen and (max-width:400px) {
			width: 80px;
			height: 40px;
			line-height: 15px;
			padding-top: 5px;
			p{
				font-size: 1.2rem;
				line-height: 25px
			}
			border-radius: 6px;
		}
	}
	@mixin btn{
		border: none;
		margin-top: 10px;
		border-radius: 5px;
		padding: 5px 10px; 
		font-size: 25px;
		line-height: 30px;
		background: #fda85d;
		color: #fff;
		text-align: center;
	}
	*{margin: 0;padding: 0}
	@for $i from 0 through 13{
		.num-#{$i} {
			// background: darken($base-color,$i*9%);
			background: nth($cell-colors,$i+1);
			color: nth($cell-fonts,$i+1);
		}
	}
	.title{
		width: 345px;
		@media screen and (max-width:400px) {
			width: 260px
		}
		margin: 0px auto;
		h1{
			@for $j from 1 through 4{
				span:nth-child(#{$j}){
					color: nth($cell-colors,$j*2+3);
				}
			}
		}
		.info{
			margin: 20px auto;
			@include info-size;
			display: inline-block;
			text-align: center;
			background: #bbada0;
			color: #fff;
			h4{
				color: #eee;
			}
		}
	}
	.game-canvas{
		@include canvas-size;
		margin: 0 auto;
		background: #bbada0;
		.num-0{
			span{
				display: none;
			}
		}
		.grid-cell{
			@include cell-size;
			text-align: center;
			float: left;
			font-weight: bold;
			word-wrap:break-word;
		}
	}
	.reset{
		@include btn;
		margin-top: 35px;
	}
	.hidden{
		display: none;
	}
	.clearfix:before,
	.clearfix:after {
	    display: table;
	    content: " ";
	}
	.clearfix:after {
	    clear: both;
	}
	.clearfix{
	    *zoom: 1;
	}
	.shadow-block{
		z-index: 998;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		top:0;
		background: rgba(0,0,0,0.6);
		.lost-tips{
			position: absolute;
			top: 40%;
			width:160px;
			left:50%;
			margin-left: -80px;
			h1{			
				color: #fff;
				font-size: 50px;
			}
			.restart{
				@include btn;
			}
		}
	}
</style>