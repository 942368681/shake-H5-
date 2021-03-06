$(function() {
   //运动事件监听
   if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', deviceMotionHandler, false);
   }
})

//获取加速度信息
//通过监听上一步获取到的x, y, z 值在一定时间范围内的变化率，进行设备是否有进行晃动的判断。
//而为了防止正常移动的误判，需要给该变化率设置一个合适的临界值。
var SHAKE_THRESHOLD = 20000;  //越低越灵敏
var last_update = 0;
var x,
   y,
   z,
   last_x = 0,
   last_y = 0,
   last_z = 0;

var timer = null;

function deviceMotionHandler(eventData) {
   var acceleration = eventData.accelerationIncludingGravity;
   var curTime = new Date().getTime();
   if ((curTime - last_update) > 10) {
      var diffTime = curTime - last_update;
      last_update = curTime;
      x = acceleration.x;
      y = acceleration.y;
      z = acceleration.z;
      var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
      if (speed > SHAKE_THRESHOLD) {
		 //获取Token
		 $.get("http://10.3.13.7:8899/moli/load?teamToken=ZW1t", function(data) {
			var userToken = JSON.parse(data).userToken;

			//摇手机计数
			$.get("http://10.3.13.7:8899/moli/commit?teamToken=ZW1t&userToken=" + userToken, function(data) {
				var audio = document.getElementById("bgMusic");
				audio.play();
				if (data == '0') {
					$(".message").eq(0).text("你成功啦！");
				} else {
					$(".message").eq(0).text("你已经参与过啦！");
				}
			});
		 });
      }
      last_x = x;
      last_y = y;
      last_z = z;
   }
}

//获取摇手机人数
function getCount(){
	$.get("http://10.3.13.7:8899/moli/count?teamToken=ZW1t", function(data) {
		$(".num").eq(0).text(data);
	});
}
getCount();
// 全局开启定时器监听摇手机人数
timer = setInterval(function (){
	getCount();
},500);

document.addEventListener('touchstart', function(){
   var audio = document.getElementById("bgMusic");
   audio.load();
}, false);
