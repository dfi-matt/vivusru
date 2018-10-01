

$(function(){
	$('.nav-icon').click(function(){
		$("header").toggleClass("open");
		$('.nav-icon').toggleClass('open');
		//Open menu
		$("#mobile-menu").toggleClass("mobile-nav-show");
	});

	$(".scrollto").on("click", function(){
		var pos = "#" + $(this).data("scrolltarget");
		$(this).blur();
		pos = $(pos).position().top;
		$('html, body').stop().animate({scrollTop: pos}, 1000);
		return false;
	});

	$(".chkbox").on("click", function(e){
		var chkbox = $(this);
		var targetChk = chkbox.parent().children('input[type=checkbox]');

		if(chkbox.hasClass("unchecked")){
			chkbox.removeClass("unchecked");
			targetChk.prop("checked", true);
		} else {
			chkbox.addClass("unchecked");
			targetChk.prop("checked", false);
		}

		targetChk.validate();

	});

	$('.question-title').click(function(){
		$(this).toggleClass("active");
	});

	$('.question-large-title').click(function(){
		$(this).toggleClass("active");
	});


	$("#lightSlider").lightSlider({
		slideMargin: 30,
		item: 3,
		slideMove: 3,
		loop: false,
		controls: false,
		responsive : [
			{
				breakpoint:992,
				settings: {
					item:1,
					loop: true,
					slideMove: 1,
				}
			},
			{
				breakpoint:480,
				settings: {
					item:1,
					loop: true,
					slideMove: 1,
				}
			}
		]
	});

});