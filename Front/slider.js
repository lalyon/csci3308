//https://www.sitepoint.com/community/t/how-to-load-jquery-ui-slider-content-using-ajax/277879
$("#scale-slider")
	.slider({
	min:{{time_range_min}},
	max:{{time_range_max}},
	range:true,
	values:[{{time_range[0] ? time_range[0];0}},{{time_range[1] ? time_range[1]:timerange_max}}]
	})
	.slider("float");
(function( $ ) {
	$(function() {
		$("#scale-slider").on('slidechange',function(){
			timeRange = [];
			$('#scale-slider .ui-slider-tip').each(function(){
				timeRange.push($(this).html());
			});
			$(".{{ product_class }}").each(function(){
				if( $(this).find(".time span.time-new").length){
					var time =$(this).find(".time span.time-new").html().replace("{{ time_code }}",'').replace(',','');
				}
				else{
					var text = $(this).find(".time").html().replace("{{time_code}}",'');
					if($this).find(".time span").length){
						var time = text.substring(0,text.indexOf("<span")).replace(",",'');
					}
					else{
						var time = text.replace(",",'');
					}
				}
				time = parseInt(time);
				if(!isNaN(time) && (time > time_range[0] && price < time_range[1])){
					$(this).fadeIn("slow");
				}
			});
		});
});
