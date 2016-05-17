!function(){var e=angular.module("uxdpv",[]);e.directive("practiceVerticals",function(){return{restrict:"E",templateUrl:"practiceVerticals.html"}}),e.directive("customMessages",function(){return{restrict:"E",templateUrl:"customMessages.html"}}),e.service("selectionData",function(){var e=0;return{getSelectedCount:function(){return e},incrementSelectedCount:function(){e++},decrementSelectedCount:function(){0!=e?e--:e},isSelected:function(){return e>0},setSelectedCount:function(t){e=t}}}),e.controller("setCustomMessages",["$rootScope","selectionData",function(e,t){var s=this;s.current_state="s1",e.$on("updateCustomMessages",function(){t.isSelected()&&"s1"==s.current_state&&(s.current_state="s2",$(".card-save").addClass("fadein"),e.$destroy("updateCustomMessages"))}),s.generateLink=function(){var t=new Firebase("https://torrid-inferno-2523.firebaseio.com/");t.createUser({email:"bobtony@firebase.com",password:"correcthorsebatterystaple"},function(e,t){e?console.log("Error creating user:",e):console.log("Successfully created user account with uid:",t.uid)}),s.current_state="s3",$(".card-confirmation").addClass("fadein"),e.$emit("getUserPV")}}]),e.controller("getPracticeVertical",["$rootScope","$http","selectionData",function(e,t,s){var c=this;c.pv1=[],c.pv2=[],c.select=[],t.get("/./assets/js/uxd-practice-verticals.json").success(function(e){c.pv1=e.slice(0,4),c.pv2=e.slice(4,8)}).error(function(){c.pv1=void 0,c.pv2=void 0}),t.get("/./assets/js/default-selection.json").success(function(e){var t=0;c.select=e;for(pv in c.select)if("Owner"!=pv)for(a in c.select[pv])c.select[pv][a]&&t++;s.setSelectedCount(t)}).error(function(){c.select=void 0}),c.toggleSelected=function(t,r,n){var a,o,i,l,u,d;a=document.querySelector("."+n.ClassName),d=a.getBoundingClientRect(),o=t.clientX-d.left,i=t.clientY-d.top,l=$("."+n.ClassName+" .ripple").width(),u=$("."+n.ClassName+" .ripple").height(),o-=l/2,i-=u/2,$("."+n.ClassName+" .ripple").css({top:i+"px",left:o+"px"}),$("."+n.ClassName+" .ripple").removeClass("selected").width(),$("."+n.ClassName+" .ripple").addClass("selected"),c.select[r.ClassName][n.ClassName]=!c.select[r.ClassName][n.ClassName],c.select[r.ClassName][n.ClassName]?s.incrementSelectedCount():s.decrementSelectedCount(),e.$emit("updateCustomMessages")}}])}();