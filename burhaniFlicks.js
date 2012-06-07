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

burhaniFlicks.startPosition;
burhaniFlicks.lastPosition;
burhaniFlicks.isSwipe;
//END
burhaniFlicks.startTime;
burhaniFlicks.endTime;
burhaniFlicks.distance;
burhaniFlicks.velocity;
burhaniFlicks.prevTime;
burhaniFlicks.varVelocity;
burhaniFlicks.velocityArr = [];

$(document).on('pageshow','.ui-page',function(){
	$(this).attr('style','');
	var $currentPage = $(this);
	var $nextPage = $currentPage.next();
	var $prevPage = $currentPage.prev();

	$nextPage.css({
		left : '1024px',
		position: 'absolute'
	});
	$prevPage.css({
		left : '-1024px',
		position: 'absolute'
	});
	if($prevPage.attr('id')!=undefined)
		$prevPage.show();
	if($nextPage.attr('id')!=undefined)
		$nextPage.show();
	console.log('Pages loaded');

}).on('touchstart','.ui-page',function(e){
		burhaniFlicks.startPosition = e.originalEvent.touches[0].pageX;
		burhaniFlicks.isSwipe = true;
		burhaniFlicks.startTime = (new Date()).getTime();
		burhaniFlicks.prevTime = burhaniFlicks.startTime;
		burhaniFlicks.velocityArr = new Array();

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
}).on('touchend','.ui-page',function(){
	//initialize global variables.
	burhaniFlicks.endTime = (new Date()).getTime();
	burhaniFlicks.distance = Math.abs(burhaniFlicks.startPosition - burhaniFlicks.lastPosition);
	burhaniFlicks.velocity = burhaniFlicks.distance / (burhaniFlicks.endTime-burhaniFlicks.startTime);

	console.log('End velocity: ' + burhaniFlicks.velocityArr[burhaniFlicks.velocityArr.length - 2]);

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
		if($currentPage.attr('id')===$.mobile.firstPage)
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
		else if($currentPage.attr('id')===$('div[data-role="page"]:last')) //last page.
		{
			//we cannot move in the negative direction, snap back to place.
			if(positionOfPage<0)
			{
				$(this).css({
				'-webkit-transform' : '0px'
				});
				$(this).prev().css({
				'-webkit-transform' : '-1024px'
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
}).on('drag','.ui-page',function(){

	var displacement = burhaniFlicks.lastPosition - burhaniFlicks.startPosition;
	$(this).css({
		'-webkit-transform' : 'translateX('+displacement+'px)'
	});
	$(this).next().css({
		'-webkit-transform' : 'translateX('+displacement+'px)'
	});
	$(this).prev().css({
		'-webkit-transform' : 'translateX('+displacement+'px)'
	});
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