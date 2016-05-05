function change() {
	$("#bar").children().css("text-shadow","none");
	$(this).css("text-shadow","0 0 5px #0f0");
	var display = $(this).attr("display");
	var input = $(this).attr("input");
	$.get(display, function(data){
		$("#display").slideUp(50, function() {
			$("#display").html(data);
		}).slideDown(50);
	});
	$.get(input, function(data){
		$("#input").slideUp(50, function() {
			$("#input").html(data);
		}).slideDown(50);
	});
}
function update() {
	var url = $("#input").children().attr("action");
	var data = $("#input").children().serializeArray();
	$("#display").html("Waiting for response");
	$.get(url, data, function(data){
		$("#display").html(data);
	});
}
$(function(){
	$("#bar").children().on("click",change);
});
