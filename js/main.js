$(function(){
	Game.init($('#div1'));//开始游戏

})

var Game={
	stage:[
	
	{
		map:[
		1,1,2,2,2,1,1,1,
		1,2,2,3,3,2,1,1,
		1,2,0,0,0,0,2,1,
		1,2,0,0,0,0,2,1,
		1,2,0,0,0,0,2,1,
		1,2,0,0,0,0,2,1,
		1,2,0,0,0,0,2,1,            
		1,2,2,2,2,2,2,1 
		],
		box:[
		{x:3,y:2},
		{x:4,y:2},
		],
		person:{x:2,y:2}
	},

	{
		map:[
            1,2,2,2,2,2,1,1,             
            1,2,0,0,2,2,2,1,             
            1,2,0,0,0,0,2,1,             
            2,2,2,0,2,0,2,2,             
            2,3,2,0,2,0,0,2,             
            2,3,0,0,0,2,0,2,             
            2,3,0,0,0,0,0,2,            
            2,2,2,2,2,2,2,2 
		],
		box: [
		{x:3,y:2},
		{x:2,y:5},
		{x:5,y:6}
		],
		person:{x:2,y:2}
	},
	{


	//地图坐标


		map:[
		1,1,2,2,2,2,1,1,
		1,1,2,3,3,2,1,1,
		1,2,2,0,3,2,2,1,
		1,2,0,0,0,3,2,1,
		2,2,0,0,0,0,2,2,
		2,0,0,2,0,0,0,2,
		2,0,0,0,0,0,0,2,
		2,2,2,2,2,2,2,2
		],



    //箱子坐标


		box:[
		{x:4,y:3},
		{x:3,y:4},
		{x:4,y:5},
		{x:5,y:5}
		],



    //人物坐标


		person:{x:3,y:6}
	},

	{
			map : [
				1,1,1,1,2,2,2,2,2,2,2,1,
				1,1,1,1,2,0,0,2,0,0,2,1,
				1,1,1,1,2,0,0,0,0,0,2,1,
				2,2,2,2,2,0,0,2,0,0,2,1,
				3,3,3,2,2,2,0,2,0,0,2,2,
				3,0,0,2,0,0,0,0,2,0,0,2,
				3,0,0,0,0,0,0,0,0,0,0,2,
				3,0,0,2,0,0,0,0,2,0,0,2,
				3,3,0,2,2,2,0,2,0,0,2,2,
				2,2,2,2,2,0,0,0,0,0,2,1,
				1,1,1,1,2,0,0,2,0,0,2,1,
				1,1,1,1,2,2,2,2,2,2,2,1
			],
			box : [
				{x:5,y:6},
				{x:6,y:3},
				{x:6,y:5},
				{x:6,y:7},
				{x:6,y:9},
				{x:7,y:2},
				{x:8,y:2},
				{x:9,y:6},
			],
			person : {x:5,y:9}
		}

	],


	//初始化地图函数


	init:function(oParent){
		this.oParent=oParent;
		this.creatMap(0);
	},


    //创建地图


	creatMap:function(iNow){

		this.oParent.empty();
		document.title='小乌龟推箱子第'+iNow+'关';

		this.nowJson=this.stage[iNow];
		this.oParent.css('width',Math.sqrt(this.nowJson.map.length)*50);
		$.each(this.nowJson.map,$.proxy(function(i,elem){
			this.oParent.append('<div class="bg'+elem+'"></div>');

		},this));
		this.creatBox();
		this.creatPerson();
	},


    //创建箱子


	creatBox:function(){
		$.each(this.nowJson.box,$.proxy(function(i,elem){
			var oBox=$('<div class="box"></div>');
			oBox.css('left',elem.x*50);
			oBox.css('top',elem.y*50);
			this.oParent.append(oBox);

		},this));
	},

     
     //创建人物


	creatPerson:function(){
		var oP=$('<div class="person"></div>');
		oP.css('left',this.nowJson.person.x*50);
		oP.css('top',this.nowJson.person.y*50);
		oP.data('x', this.nowJson.person.x);
		oP.data('y', this.nowJson.person.y);

		this.oParent.append(oP);
		this.bindPerson(oP);
	},


    //对人物的操作


	bindPerson:function(oP){
		$(document).keydown($.proxy(function(ev) {
			switch(ev.which){
				case 37:
					this.runPerson(oP,{x:-1});
					oP.css('backgroundPosition','-150px 0');
				break;
				case 38:
					this.runPerson(oP,{y:-1});
					oP.css('backgroundPosition','0 0');
				break;
				case 39:
					this.runPerson(oP,{x:1});
					oP.css('backgroundPosition','-50px 0');
				break;
				case 40:
				    this.runPerson(oP,{y:1});
				    oP.css('backgroundPosition','-100px 0');
				break;
			}
		},this));
	},


    //人物移动

	runPerson:function(oP,option){
		var stepX=option.x||0;
		var stepY=option.y||0;
		if (this.nowJson.map[(oP.data('y')+stepY)*Math.sqrt(this.nowJson.map.length)+(oP.data('x')+stepX)]!=2) {
			oP.data('y', oP.data('y')+stepY);
			oP.data('x', oP.data('x')+stepX);
			oP.css('top',oP.data('y')*50);
			oP.css('left',oP.data('x')*50);

			//遍历箱子，检测碰撞

			$('.box').each($.proxy(function(i,elem){
				if(this.collision(oP,$(elem))&&
					this.nowJson.map[(oP.data('y')+stepY)*
					Math.sqrt(this.nowJson.map.length)+(oP.data('x')+stepX)]!=2){


					$(elem).css('left',(oP.data('x')+stepX)*50);
				    $(elem).css('top',(oP.data('y')+stepY)*50);


				    //如果两个箱子碰撞，还原箱子和乌龟的位置

				    $('.box').each($.proxy(function(j,elem2){
				    	if(this.collision($(elem),$(elem2))&&elem!=elem2){
						    $(elem).css('left',(oP.data('x'))*50);
						    $(elem).css('top',(oP.data('y'))*50);
							oP.data('y', oP.data('y')-stepY);
							oP.data('x', oP.data('x')-stepX);
							oP.css('top',oP.data('y')*50);
							oP.css('left',oP.data('x')*50);

				    	}

				    },this));
				}else if(this.collision(oP,$(elem))){


				//箱子碰到墙壁，还原小乌龟的位置

					oP.data('y', oP.data('y')-stepY);
					oP.data('x', oP.data('x')-stepX);
					oP.css('top',oP.data('y')*50);
					oP.css('left',oP.data('x')*50);
				}
			},this));
		}

		this.nextShow();

	},


	//判断进入下一关
	

	nextShow:function(){
		var iNum=0;
		

		$('.bg3').each($.proxy(function(i,elem){
			$('.box').each($.proxy(function(j,elem2){
				if(this.collision($(elem),$(elem2))){
					iNum++;
				}
			},this));
		},this));


		if(iNum==$('.box').length){
			
			iNum++;
			this.creatMap(Math.floor(Math.random()*4));

		}
	},


    //碰撞检测

	collision:function(obj1,obj2){
		var Left1=obj1.offset().left;
		var Right1=obj1.offset().left+obj1.width();
		var Top1=obj1.offset().top;
		var Bottom1=obj1.offset().top+obj1.height();


		var Left2=obj2.offset().left;
		var Right2=obj2.offset().left+obj2.width();
		var Top2=obj2.offset().top;
		var Bottom2=obj2.offset().top+obj2.height();

		if(Left1>=Right2||Right1<=Left2 || Top1>=Bottom2||Bottom1<=Top2){
			return false;
		}else{
			return true;
		}

	}
};