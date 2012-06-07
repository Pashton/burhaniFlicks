/*jQuery mobile is required.
git page: https://github.com/Pashton/burhaniFlicks
License: You can use it the way you like, you may modify the code as well, however this license must be included.
Any damages this may cause, in any way, shape or form, the Author is free of the charges.
Created by Hasham Burhani.
*/
/*
Version: 0.2 - still a prototype. Use at your own risk.
*/

//BurhaniFlicks. global variables.
burhaniFlicks = new Object();

burhaniFlicks.startPosition; //position of object at start.
burhaniFlicks.lastPosition; //used in touchmove. maintains last pixel position of object.
burhaniFlicks.isSwipe; //used to see if user trigger a normal swipe (too quick for this lib)
//END
burhaniFlicks.startTime; //taken in touchstart.
burhaniFlicks.endTime; //taken in touchend.
burhaniFlicks.distance; //total distance travelled by move.
burhaniFlicks.velocity; //velocity over the whole run.
burhaniFlicks.prevTime; //Used in touchmove.
burhaniFlicks.varVelocity; //clean up later. should be local.
burhaniFlicks.velocityArr = []; //This stores the objects velocity as it moves.
burhaniFlicks.displacement; //This stores the pixels the object will move

/* PHYSICS LOTS OF HELP FROM LEO JWEDA */
var u_k = 0.3;
var g = 0.9;

//Preload images on both sides. 
//TODO: cleanup and make sure images that don't exist are not loaded!.
$(document).on('pageshow','.ui-page',function(){
	//modified jquery library that eliminates flickers. this next line is needed.
	$(this).attr('style','');
	//Local variables.
	var $currentPage = $(this);
	var $nextPage = $currentPage.next();
	var $prevPage = $currentPage.prev();

	
	
	if($prevPage.attr('id')!=undefined)
	{
		$prevPage.css({
			left : '-1024px',
			position: 'absolute'
		});
		$prevPage.show();
	}
	if($nextPage.attr('id')!=undefined)
	{
		$nextPage.css({
			left : '1024px',
			position: 'absolute'
		});
		$nextPage.show();
	}
	console.log('Pages loaded');
//touch begins here.
}).on('touchstart','.ui-page',function(e){
		burhaniFlicks.startPosition = e.originalEvent.touches[0].pageX;
		burhaniFlicks.isSwipe = true;
		burhaniFlicks.startTime = (new Date()).getTime();
		burhaniFlicks.prevTime = burhaniFlicks.startTime;
		burhaniFlicks.velocityArr = new Array();
//update variables on move.
}).on('touchmove','.ui-page',function(e){

	//keeps track of variable velocity.

	burhaniFlicks.varVelocity = (Math.abs(burhaniFlicks.lastPosition - e.originalEvent.touches[0].pageX))/((new Date()).getTime() -
	burhaniFlicks.prevTime);
	burhaniFlicks.velocityArr.push(burhaniFlicks.varVelocity);
	
	console.log('current velocity: ' + burhaniFlicks.velocityArr[burhaniFlicks.velocityArr.length -1]);

	setTimeout(function(){
		burhaniFlicks.isSwipe = false;
	},50);

	//END variable velocity.
	burhaniFlicks.prevTime = (new Date()).getTime();

	burhaniFlicks.lastPosition = e.originalEvent.touches[0].pageX;
	var displacement = burhaniFlicks.lastPosition - burhaniFlicks.startPosition;
	console.log('new position:'+burhaniFlicks.lastPosition);

	$(this).trigger('drag');
	// if(!burhaniFlicks.isSwipe)
	// {
	// 	$(this).trigger('drag');
	// }

//figure out what to do with touchend.
}).on('touchend','.ui-page',function(){
	//initialize global variables.
	burhaniFlicks.endTime = (new Date()).getTime();
	burhaniFlicks.distance = Math.abs(burhaniFlicks.startPosition - burhaniFlicks.lastPosition);
	burhaniFlicks.velocity = burhaniFlicks.distance / (burhaniFlicks.endTime-burhaniFlicks.startTime);
	var lastVelocity = burhaniFlicks.velocityArr[burhaniFlicks.velocityArr.length - 1];
	burhaniFlicks.displacement = Math.pow(lastVelocity,2)/(2*u_k*g);

	console.log('End velocity: ' + lastVelocity);
	console.log('Pixels to animate: '+burhaniFlicks.displacement);

	console.log(burhaniFlicks.velocity);
	console.log('duration: '+(new Date()).getTime());
	//involved pages.
	var $currentPage = $(this);
	var $nextPage = $currentPage.next();
	var $prevPage = $currentPage.prev();
	console.log('offset:'+burhaniFlicks.lastPosition);
	var positionOfPage = $(this).offset().left;
	var displacement;
	if(burhaniFlicks.isSwipe)
	{
		burhaniFlicks.startPosition > burhaniFlicks.lastPosition ? $currentPage.trigger('leftflick') : $currentPage.trigger('rightflick');
		return;
	}
	//Switch pages if we are past these points for the page itself and not the position of the touch.
	else if( positionOfPage < -512 || positionOfPage > 512 )
	{
		//Direction of movement.
		if(positionOfPage<0)
			displacement = -1024;
		else
			displacement = 1024;
		//END
		
		//if we are on the first page.
		if($currentPage.attr('id')===$.mobile.firstPage.attr('id'))
		{
			//we cannot move in the negative direction, snap back to place.
			console.log(burhaniFlicks.lastPosition);
			if(positionOfPage>0)
			{
				$(this).css({
				'-webkit-transform' : ''
				});
				$(this).next().css({
				'-webkit-transform' : ''
				});
				return; //leave method
			} //otherwise switch in positive direction.
			else
			{
				$(this).css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).next().css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).prev().css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).hide();
				$(this).prev().hide();
				$.mobile.changePage($nextPage, { transition: "fade", reverse: false});
				return; //leave method.
			}
		}
		else if($currentPage.attr('id')===$('div[data-role="page"]:last').attr('id')) //last page.
		{
			//we cannot move in the negative direction, snap back to place.
			if(positionOfPage<0)
			{
				$(this).css({
				'-webkit-transform' : ''
				});
				$(this).prev().css({
				'-webkit-transform' : ''
				});
				return; //leave method
			} //otherwise switch in positive direction.
			else
			{
				$(this).css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).prev().css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).hide();
				$(this).prev().hide();
				$.mobile.changePage($prevPage, { transition: "fade", reverse: true});
				return; //leave method.
			}
			console.log('we jumped out!');
		}
		else
		{
			if(positionOfPage>0)
			{
				$(this).css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).next().css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).prev().css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).hide();
				$(this).next().hide();
				$.mobile.changePage($prevPage, { transition: "fade", reverse: true});
				return;
			} //otherwise switch in positive direction.
			else
			{
				$(this).css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).next().css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).prev().css({
				'-webkit-transform' : 'translateX('+displacement+'px)',
				});
				$(this).hide();
				$(this).prev().hide();
				$.mobile.changePage($nextPage, { transition: "fade", reverse: false});
				return; //leave method.
			}
		}
	}
	else
	{
		console.log('DO NOT MOVE');
		$(this).css({
		'-webkit-transform' : ''
		});
		$(this).next().css({
		'-webkit-transform' : ''
		});
		$(this).prev().css({
		'-webkit-transform' : ''
		});
	}
	//this function makes object follow drag.
}).on('drag','.ui-page',function(){

	var displacement = burhaniFlicks.lastPosition - burhaniFlicks.startPosition;
	if($(this).attr('id')===$.mobile.firstPage.attr('id') && displacement>512)
		displacement = 510;

	if( $(this).attr('id') === $('div[data-role="page"]:last').attr('id') && displacement<-512)
		displacement = 510;

	$(this).css({
		'-webkit-transform' : 'translateX('+displacement+'px)'
	});
	$(this).next().css({
		'-webkit-transform' : 'translateX('+displacement+'px)'
	});
	$(this).prev().css({
		'-webkit-transform' : 'translateX('+displacement+'px)'
	});
	//if it's a simple flick - change page
	//TODO: take velocity and changepage according to velocity speed.
}).on('rightflick', '.ui-page', function(){
	console.log('right flick');
		$(this).css({
		'-webkit-transform' : ''
		});
		$(this).next().css({
		'-webkit-transform' : ''
		});
		$(this).prev().css({
		'-webkit-transform' : ''
		});

//if it's a simple flick - change page
//TODO: take velocity and changepage according to velocity speed.
}).on('leftflick', '.ui-page', function(){
	console.log('left flick');
		$(this).css({
		'-webkit-transform' : ''
		});
		$(this).next().css({
		'-webkit-transform' : ''
		});
		$(this).prev().css({
		'-webkit-transform' : ''
		});
});