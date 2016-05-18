!function(){var e=angular.module("uxdpv",[]);e.directive("practiceVerticals",function(){return{restrict:"E",templateUrl:"practiceVerticals.html"}}),e.directive("customMessages",function(){return{restrict:"E",templateUrl:"customMessages.html"}}),e.service("selectionData",function(){var e=0,t=null;return{getSelectedCount:function(){return e},incrementSelectedCount:function(){e++},decrementSelectedCount:function(){0!=e?e--:e},isSelected:function(){return e>0},setSelectedCount:function(t){e=t},getSelectedData:function(){return t},setSelectedData:function(e){t=e}}}),e.service("userState",function(){var e="s1";return{getCurrentState:function(){return e},setStateTo:function(t){switch(e=t,t){case"s1":$(".card-default").addClass("fadein");break;case"s2":$(".card-default").removeClass("fadein"),$(".card-save").addClass("fadein");break;case"s3":$(".card-save").removeClass("fadein"),$(".card-confirmation").addClass("fadein");break;case"s4":$(".card-confirmation").removeClass("fadein"),$(".card-user").addClass("fadein");break;case"s5":$(".card-user").removeClass("fadein"),$(".card-authenticate").addClass("fadein");break;case"s6":$(".card-authenticate").removeClass("fadein"),$(".card-modify").addClass("fadein")}}}}),generatePassword=function(){for(var e=8,t="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",s="",a=0,r=t.length;e>a;++a)s+=t.charAt(Math.floor(Math.random()*r));return s},e.controller("setCustomMessages",["$rootScope","selectionData","userState",function(e,t,s){var a=this;a.current_state="s2",s.setStateTo(a.current_state),e.$on("updateCustomMessages",function(){t.isSelected()&&"s1"==a.current_state&&(a.goToState("s2"),e.$destroy("updateCustomMessages"))}),a.goToState=function(e){a.current_state=e,s.setStateTo(e)},a.createUserLink=function(){var e=new Firebase("https://torrid-inferno-2523.firebaseio.com/");e.createUser({email:"zhengsan@gmail.com",password:"helloworld"},function(s,a){if(s)$(".card-confirmation .error .msg").html("<strong>"+s+"</strong>"),$(".card-confirmation .success").hide(),$(".card-confirmation .error").show();else{var r=t.getSelectedData();angular.fromJson(angular.toJson(r)),e.child(a.uid).set(r,function(e){e?($(".card-confirmation .error .msg").html("<strong>"+e+"</strong>"),$(".card-confirmation .success").hide(),$(".card-confirmation .error").show()):($(".card-confirmation .success").show(),$(".card-confirmation .error").hide())}),e.resetPassword({email:"zhengsan@gmail.com"},function(e){null===e?console.log("Password reset email sent successfully"):console.log("Error sending password reset email:",e)})}}),a.goToState("s3")},a.authenticateUser=function(){var e=new Firebase("https://torrid-inferno-2523.firebaseio.com/");ref.authWithPassword({email:"bobtony@firebase.com",password:"correcthorsebatterystaple"},function(e,t){e?console.log("Login Failed!",e):console.log("Authenticated successfully with payload:",t)})}}]),e.controller("getPracticeVertical",["$rootScope","$http","selectionData","userState",function(e,t,s,r){var n=this;n.pv1=[],n.pv2=[],n.select=[],t.get("/./assets/js/uxd-practice-verticals.json").success(function(e){n.pv1=e.slice(0,4),n.pv2=e.slice(4,8)}).error(function(){n.pv1=void 0,n.pv2=void 0}),t.get("/./assets/js/default-selection.json").success(function(e){var t=0;n.select=e;for(pv in n.select)if("Owner"!=pv)for(a in n.select[pv])n.select[pv][a]&&t++;s.setSelectedCount(t)}).error(function(){n.select=void 0}),n.toggleSelected=function(t,a,r){var o,c,i,l,d,u;o=document.querySelector("."+r.ClassName),u=o.getBoundingClientRect(),c=t.clientX-u.left,i=t.clientY-u.top,l=$("."+r.ClassName+" .ripple").width(),d=$("."+r.ClassName+" .ripple").height(),c-=l/2,i-=d/2,$("."+r.ClassName+" .ripple").css({top:i+"px",left:c+"px"}),$("."+r.ClassName+" .ripple").removeClass("selected").width(),$("."+r.ClassName+" .ripple").addClass("selected"),n.select[a.ClassName][r.ClassName]=!n.select[a.ClassName][r.ClassName],n.select[a.ClassName][r.ClassName]?s.incrementSelectedCount():s.decrementSelectedCount(),s.setSelectedData(n.select),e.$emit("updateCustomMessages")}}])}();