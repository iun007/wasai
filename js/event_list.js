//分页加载star
_page=0;
var _pageNum=8;
_registerStatus="-1";//报名状态
_country="-1";//国家
_city="-1";//城市
_cityId="-1";//城市id
_raceType="-1";//赛事类型
_startTime="-1";//开始日期
_smart="6";//智能默认值
_endTime="-1";//结束日期
$(window).resize(function(){
    w=$(window).width();
    if(w>640){
        w=640;
    }
    // for(i=0;i<4;i++){
    //     $("#screening .nav li").eq(i).css({"width":((w*0.22)-1)});    //计算筛选li宽度
    // }
    var _h=$(window).height();
    bodyWitdth=$("body").width();
    listItemW=(bodyWitdth*0.92)-87;
    $("#event_list").css({"min-height":_h-126});
});
holydays = [{'date':'4/17/2015 12:00',"info":"gn"},
    {'date':'4/18/2015',"info":"g2"},
    {'date':'4/19/2015',"info":"g3"},
    {'date':'4/27/2015',"info":"g4"},
    {'date':'5/17/2015',"info":"g6"}];
//日历
function datePicker(){
    $('#rangeInlinePicker2').datepick({
        firstDay:1,
        onDate: showDayOfYear,
        rangeSelect:true,
        showOtherMonths: true,
//      monthsToShow: [2, 3]
        onSelect:reformatDate,
        showTrigger: '#calImg'

    });
}
  
function reformatDate() { 
 var dates = $('#rangeInlinePicker2').datepick('getDate'); 
    var value = ''; 
    for (var i = 0; i < dates.length; i++) { 
        value += (i == 0 ? '' : ',') + $.datepick.formatDate(dates[i]); 
    } 
    // $('#rangeInlinePicker2').val(value || 'none');
    var st=value.split(',')[0]+" 0:00";
    var et=value.split(',')[1]+" 23:59";
    _startTime=new Date(st).getTime();
    _endTime=new Date(et).getTime();
    // console.log(_startTime)
}
function showDayOfYear(date) {
    for(i=0;i<holydays.length;i++) {
//                console.log(new Date(holydays[i]).toString())
        if (new Date(holydays[i].date).toLocaleDateString() == date.toLocaleDateString()){
            return {
                content: date.getDate() + '<br><span class="addMark">'+ holydays[i].count+'</span>', dateClass: 'showDoY'
            }
        }
        // console.log(holydays[i].count)
    }
    return {
        content: date.getDate() + '<span class="addMark1"></span>', dateClass: 'showDoY'
    }
}


$(function(){
    $(window).resize();

    var _nowYear=new Date().getFullYear();
    var _nowMonth=new Date().getMonth()+1;
    // 添加赛事link
    // $("#addEvent a").attr("href",path+"/races/new");    

    //获取日期赛事
    function dateJsonAjax(){
        $.ajax({
           url:path+"/races/groupByDate?year="+_nowYear+"&month="+_nowMonth+"",
           data:"",
           type:"get",
           datatype:"json",
           success:function(e){
               console.log(e);
               $("#wantRun .total").html(e.totalCount);
               var url= e.picUrl;
               $("#wantRun .img_list ul li").remove();
                holydays=e.data;
                datePicker();//日历初始化
                $(".datepick-cmd-nextDay").trigger("click");
                $(".datepick-cmd-prevDay").trigger("click");
           },
           error:function(e){
               console.log(e);
           }
        })
    }
    dateJsonAjax();
    $(".datepick-cmd-next,.datepick-cmd-prevJump").live('click',function(){
        _nowYear=$("#nowyear").html();
        _nowMonth=$("#nowmonth").html();
        dateJsonAjax();
    });
    $(".datepick-cmd-prev,.datepick-cmd-nextJump").live('click',function(){
        _nowYear=$("#nowyear").html();
        _nowMonth=$("#nowmonth").html();
        dateJsonAjax();
    });
    //获取国家
    // $.ajax({
    //    url:path+"/races/getCountrys",
    //    data:"",
    //    type:"get",
    //    datatype:"json",
    //    success:function(e){
    //         console.log(e)
    //    },
    //    error:function(e){
    //        console.log(e);
    //    }
    // })

    //导航下边筛选
    $("#screening ul.nav li").click(function(){
        var i=$(this).index();
        if($(this).hasClass("selected")){
            $("#screening>div.screening").eq(i).fadeOut().addClass("fadeOutUp");
            $(this).removeClass("selected");
            $("body,html").css({"height":"auto","overflow":"initial"});
            $("#screening .bg000").fadeOut();
            $("#backTop").fadeIn();

        }else{
            $("#screening>div.screening").eq(i).show().removeClass("fadeOutUp").addClass("fadeInDown").siblings("div.screening").removeClass("fadeInDown").hide();
            $(this).addClass("selected").siblings().removeClass("selected");
//            $("body").css({"height":"100%","min-height":"700px","overflow":"auto"})
//            $("html").css({"height":"100%",})
            $("#screening .bg000").fadeIn();
            $("#backTop").fadeOut();

        }
    });

    function closeNav(e){
        $("#screening>div.screening").eq(e).fadeOut().addClass("fadeOutUp");
        $("body,html").css({"height":"auto","overflow":"initial"});
        $("#screening .nav li").removeClass("selected");
        $("#screening .bg000").fadeOut();
        $("#backTop").fadeIn();

    }

    //导航下边筛选滚动条
    $("#screening_address .five_continents").niceScroll({cursorcolor:"#7f7f7f"});
    $("#screening_address .country").niceScroll({cursorcolor:"#7f7f7f"});
    //状态筛选
    $("#screening_status li").click(function(){
        $("#ajaxloading").show();
        $(".comment").hide();
        _page=0;
        $("#event_list").find('.list_list').html('');//清除默认数据
        $(".event_list .no_match ").hide();
        _smart="-1";//智能默认值
        $("#total_num .num").html("");
        $(".comment a").html("正在加载...");

        $(this).addClass("selected").siblings().removeClass("selected");
        $("#screening .nav li").eq(1).find("span.txt em").html($(this).html());
        var i=$(this).index();
        if(i==0){
            _registerStatus="-1";
        }else{
            _registerStatus=i-1;
        }
        $("#screening ul.nav li").eq(1).find(".icon").hide().end().find(".txt em").addClass("blue");

        runsFriends(); 
        var navNum=$("#screening .nav li.selected").index();
        setTimeout(function(){
            closeNav(navNum)
        },500);
        // history.pushState({state:1}, "State 1", "?smart=-1&country=-1&city=-1&registerStatus="+_registerStatus+"&raceType=-1&startTime=-1&endTime=-1");
        history.pushState({state:1}, "State 1", "?smart="+_smart+"&country="+_country+"&city="+_city+"&registerStatus="+_registerStatus+"&raceType="+_raceType+"&startTime="+_startTime+"&endTime="+_endTime+"");
    });
    //地区筛选
    $("#screening_address .five_continents li").click(function(){
        $(this).addClass("selected").siblings().removeClass("selected");
        var i=$(this).index();
        var ajaxUrl;
        _countryId=$(this).attr("data-id");
        _country=$(this).attr("data-id");
        _countryType=$(this).attr("data-id");
        _city=-1;
        five_continents=$(this).index();
        $("#screening_address ul.country").html('');
//        if(i==1){
//            ajaxUrl=path+"/races?getCitys&countryId="+_countryId;
//            _country=$(this).attr("data-id");
//        }else{
            ajaxUrl=path+"/races?getCountrys&areaId="+_countryId;
            _country="-1";
//        };
        if(i==0){
            $("#ajaxloading").show();
            $(".comment").hide();
            $(".event_list .no_match ").hide();
            $("#event_list").find('.list_list').html('');//清除默认数据
            //$("#screening ul.nav li").eq(1).addClass("font24").removeClass("font20");
            _smart="-1";//智能默认值
            $("#total_num .num").html("");
            $(".comment a").html("正在加载...");

            runsFriends();  
            var navNum=$("#screening .nav li.selected").index();
            setTimeout(function(){
                closeNav(navNum)
            },500);
            $("#screening ul.nav li").eq(2).find(".icon").hide().end().find(".txt em").addClass("blue").html("全部地区");
        };
        // runsFriends();  
        //根据国家获取城市
        if(i!==0){
            $("#screening_address ul.country").append('<li class="borderBottom_e0e0e0 selected">正在加载中...</li>');
            $.ajax({
               url:ajaxUrl, 
               data:"",
               type:"get",
               datatype:"json",
               success:function(e){
                   console.log(e);
                   $("#wantRun .total").html(e.totalCount);
                   var url= e.picUrl;
                    $("#screening_address ul.country").html('');
                   if(e.data.length!=0){
                       for(var _i=0;_i< e.data.length;_i++){
                           var html="";
                           html+=' <li class="borderBottom_e0e0e0 selected" data-id='+e.data[_i].id+'>'+e.data[_i].name+'</li>';
                           $("#screening_address ul.country").append(html);
                       }
                       if(i==1){
                        $('<li class="borderBottom_e0e0e0 selected" data-id="-1">全部</li>').prependTo($("#screening_address ul.country"));
                        }
                   }
               },
               error:function(e){
                   console.log(e);
               }
            })
        }


    });
    $("#screening_address .country li").live('click',function(){
        $("#ajaxloading").show();
        $(".comment").hide();
        $("#event_list").find('.list_list').html('');//清除默认数据
        $(".event_list .no_match ").hide();
        $(".comment a").html("正在加载...");
        _page=0;
        _smart="-1";//智能默认值
        $("#total_num .num").html("");

        $(this).addClass("selected").siblings().removeClass("selected");
        var i=$(this).index();
//        if(five_continents==1){
//            _city=$(this).html();
//            _cityId=$(this).attr("data-id");
//        }else{
            _city="-1";
            _cityId="-1"
            _country=$(this).attr("data-id");
//        }
        var html=$(this).html();
        if(html=="全部"){
            html="中国内地";
            _city="-1";
        }
        $("#screening ul.nav li").eq(2).find(".icon").hide().end().find(".txt em").addClass("blue").html(html);
        runsFriends();  
        var navNum=$("#screening .nav li.selected").index();
        setTimeout(function(){
            closeNav(navNum);
        },500);
        // history.pushState({state:1}, "State 1", "?smart=-1&country="+_country+"&city="+_city+"&registerStatus=-1&raceType=-1&startTime=-1&endTime=-1");
        history.pushState({state:1}, "State 1", "?smart="+_smart+"&country="+_country+"&countryType="+_countryType+"&city="+_cityId+"&registerStatus="+_registerStatus+"&raceType="+_raceType+"&startTime="+_startTime+"&endTime="+_endTime+"");

    });

    //类型筛选
    $("#screening_type li").on('click',function(){
        $("#ajaxloading").show();
        $(".comment").hide();
        $("#event_list").find('.list_list').html('');//清除默认数据
        $(".event_list .no_match ").hide();
        $(".comment a").html("正在加载...");
        _page=0;
        _smart="-1";//智能默认值
        $("#total_num .num").html("");
        $(this).addClass("selected").siblings().removeClass("selected");
        $("#screening .nav li").eq(3).find("span.txt em").html($(this).html());
        var i=$(this).index();
        if(i==0){
            _raceType="-1";
        }else{
            _raceType=$(this).html();
        }
        runsFriends();
        $("#screening ul.nav li").eq(3).find(".icon").hide().end().find(".txt em").addClass("blue");
        var navNum=$("#screening .nav li.selected").index();
        setTimeout(function(){
            closeNav(navNum)
        },500);
        // history.pushState({state:1}, "State 1", "?smart=-1&country=-1&city=-1&registerStatus=-1&raceType="+_raceType+"&startTime=-1&endTime=-1");
        history.pushState({state:1}, "State 1", "?smart="+_smart+"&country="+_country+"&city="+_cityId+"&registerStatus="+_registerStatus+"&raceType="+_raceType+"&startTime="+_startTime+"&endTime="+_endTime+"");

    });
    //智能筛选
    $("#screening_intelligence li").click(function(){
        $("#rangeInlinePicker2").datepick('clear');
        _registerStatus="-1";//报名状态
        _country="-1";//国家
        _city="-1";//城市
        _raceType="-1";//赛事类型
        _startTime="-1";//开始日期
        _endTime="-1";//结束日期
        _cityId="-1";
        $(".comment a").html("正在加载...");
        _page=0;
        $("#total_num .num").html("");
        $("#screening .nav li").eq(1).find(".txt em").html("状态").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(1).addClass("font20").removeClass("font20");
        $("#screening .nav li").eq(2).find(".txt em").html("地区").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(2).addClass("font20").removeClass("font20");
        $("#screening .nav li").eq(3).find(".txt em").html("类型").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(3).addClass("font20").removeClass("font20");
        $("#ajaxloading").show();
        $(".comment").hide();
        $(".event_list .no_match ").hide();        
        $("#event_list").find('.list_list').html('');//清除默认数据
        $(this).addClass("selected").siblings().removeClass("selected");
        $("#screening .nav li").eq(0).find("span.txt em").html($(this).html()).addClass("blue").siblings(".icon").hide();
        var i=$(this).index();
        _smart=i;
        $("#screening ul.nav li").eq(0).siblings(".icon").hide();

        runsFriends();  
        var navNum=$("#screening .nav li.selected").index();
        setTimeout(function(){
            closeNav(navNum)
        },500)
        // history.pushState({state:1}, "State 1", "?smart="+_smart+"&country=-1&city=-1&registerStatus=-1&raceType=-1&startTime=-1&endTime=-1");
        history.pushState({state:1}, "State 1", "?smart="+_smart+"&country="+_country+"&city="+_cityId+"&registerStatus="+_registerStatus+"&raceType="+_raceType+"&startTime="+_startTime+"&endTime="+_endTime+"");

    });

    // 日期筛选]
    $("#selectedDate a.bgblue").live("click",function(){
        _page=0;
        _registerStatus="-1";//报名状态
        _country="-1";//国家
        _city="-1";//城市
        _raceType="-1";//赛事类型
        _smart="-1";//智能默认值
        _cityId="-1";
        $("#ajaxloading").show();
        $(".comment").hide();
        $("#event_list").find('.list_list').html('');//清除默认数据
        $(".event_list .no_match ").hide();
        $("#total_num .num").html("");

        runsFriends();  
        closeNav(4);
    //    初始化筛选
        $("#screening .nav li").eq(1).find(".txt em").html("状态").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(1).addClass("font20").removeClass("font20");
        $("#screening .nav li").eq(2).find(".txt em").html("地区").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(2).addClass("font20").removeClass("font20");
        $("#screening .nav li").eq(3).find(".txt em").html("类型").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(3).addClass("font20").removeClass("font20");
        $("#screening .nav li").eq(0).find(".txt em").html("推荐").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(0).addClass("font20").removeClass("font20");
        // history.pushState({state:1}, "State 1", "?smart=-1&country=-1&city=-1&registerStatus=-1&raceType=-1&startTime="+_startTime+"&endTime="+_endTime+"");
        history.pushState({state:1}, "State 1", "?smart="+_smart+"&country="+_country+"&city="+_cityId+"&registerStatus="+_registerStatus+"&raceType="+_raceType+"&startTime="+_startTime+"&endTime="+_endTime+"");

    });
    // 清除选中日期
    $("#selectedDate .clearDate ").click(function(){
        $("#rangeInlinePicker2").datepick('clear');
        $("#rangeInlinePicker2").datepick('setDate', '', '')
        _startTime="-1";//开始日期
        _endTime="-1";//开始日期
        // $(".datepick-month a").removeClass("datepick-selected");
    });
    // 清除筛选条件
    $("#total_num .clear").on("click",function(){
        _page=0;
        _registerStatus="-1";//报名状态
        _country="-1";//国家
        _city="-1";//城市
        _raceType="-1";//赛事类型
        _smart="0";//智能默认值
        $("#ajaxloading").show();
        $(".comment").hide();
        $("#event_list").find('.list_list').html('');//清除默认数据
        $(".event_list .no_match ").hide();
        $("#total_num .num").html("");
        runsFriends();  
    //    初始化筛选
        $("#screening .nav li").eq(1).find(".txt em").html("状态").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(1).addClass("font20").removeClass("font20");
        $("#screening .nav li").eq(2).find(".txt em").html("地区").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(2).addClass("font20").removeClass("font20");
        $("#screening .nav li").eq(3).find(".txt em").html("类型").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(3).addClass("font20").removeClass("font20");
        $("#screening .nav li").eq(0).find(".txt em").html("推荐").removeClass("blue").siblings(".icon").show()
        // $("#screening .nav li").eq(0).addClass("font20").removeClass("font20");
        history.pushState({state:1}, "State 1", "?smart=-1&country=-1&city=-1&registerStatus=-1&raceType=-1&startTime=-1&endTime=-1");
        // history.pushState({state:1}, "State 1", "?smart="+_smart+"&country="+_country+"&city="+_cityId+"&registerStatus="+_registerStatus+"&raceType="+_raceType+"&startTime="+_startTime+"&endTime="+_endTime+"");

    });


    windowScroll();//滚动加载

    $("#event_list").find('.list_list').html('');//清除默认数据
    var getQueryStringRegExp = function (name) {
        var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i");
        if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, " ")); return "";
    };
    var _registerStatusDefault = getQueryStringRegExp('registerStatus');
    var _countryDefault = getQueryStringRegExp('country');
    var _countryType = getQueryStringRegExp('countryType');
    var _cityDefault = getQueryStringRegExp('city');
    var _raceTypeDefault = getQueryStringRegExp('raceType');
    var _startTimeDefault = getQueryStringRegExp('startTime');
    var _endTimeDefault = getQueryStringRegExp('endTime');
    var _smartDefault = getQueryStringRegExp('smart');
    if(_smartDefault.trim() != ""){
        _smart = _smartDefault;
        if(_smartDefault!= "-1"){        
            var _html = $("#screening_intelligence li").eq(_smart).html();
            $("#screening .nav li").eq(0).find("span.txt em").addClass("blue").html(_html);
        }
    }
    if(_registerStatusDefault.trim() != ""){
        _registerStatus = _registerStatusDefault;
        if(_registerStatus!= "-1"){
            var _html = $("#screening_status li").eq(_registerStatus*1+1).html();
            $("#screening .nav li").eq(1).find("span.txt em").addClass("blue").html(_html);
        }
    }
    if(_countryDefault.trim() != ""){
        _country = _countryDefault;
    }
    if(_cityDefault.trim() != ""){
        _city = _cityDefault;
        var ajaxUrl;
        var _areaId;
        if(_country==156){
            ajaxUrl=path+"/races?getCitys&countryId="+_country;
            _areaId=_city;
        }else{
            ajaxUrl=path+"/races?getCountrys&areaId="+_countryType;
            _areaId=_country;
        };

        if(_country!="-1" && _startTime =="-1" && _endTime == "-1" && _smart =="-1"){
            $.ajax({
                url:ajaxUrl,
                type:"post",
                success:function(e){
                    console.log(e)
                    var _d=e.data;
                    for(var key in _d){
                            // console.log(_d[key].name +"........ "+_d[key].id)
                        if(Number(_d[key].id) == Number(_areaId)){
                            $("#screening .nav li").eq(2).find("span.txt em").addClass("blue").html(_d[key].name);
                        }
                    }
                }
            });            
        };
    }
    if(_raceTypeDefault.trim() != ""){
        _raceType = _raceTypeDefault;
        var _html = $("#screening_type li").eq(_raceType*1+1).html();
        if(_raceType == "-1"){
            _html = "全部类型" ; 
        }
        if(_raceType!= "-1"){
            $("#screening .nav li").eq(3).find("span.txt em").addClass("blue").html(_html);
        }

    }
    if(_startTimeDefault.trim() != "" && _endTimeDefault.trim() != "-1"){
        _smart = "-1";
        _city = "-1";
        _country = "-1";
        _registerStatus = "-1";
        _raceType = "-1";
        _startTime = _startTimeDefault;
    }
    console.log(_endTimeDefault);
    if(_endTimeDefault.trim() != "" && _endTimeDefault.trim() != "-1"){
        _smart = "-1";
        _city = "-1";
        _country = "-1";
        _registerStatus = "-1";
        _raceType = "-1";        
        _endTime = _endTimeDefault;
        // _defaultDate="06/21/2015,06/25/2015"
        // var dates = _defaultDate.split(',');
        // $('#rangeInlinePicker2').datepick('setDate', dates); 
    }


    function runsFriends(){
        // $(".swiper-container-runners .swiper-slide").html('');
        $.ajax({
           url:path+"/races/?ajaxLoad&registerStatus="+_registerStatus+"&country="+_country+"&city="+_city+"&smart="+_smart+"&raceType="+_raceType+"&startTime="+_startTime+"&endTime="+_endTime+"&page="+_page+"&limit="+_pageNum,
           data:"",
           type:"post",
           datatype:"json",
           success:function(e){
               console.log(e);
                $("#total_num .num").html(e.totalCount);
               lockpage=true;
               if(e.data.length==8){
                    $(".comment").show();
               }
               $("#ajaxloading").hide();
               if(e.data.length!=0){
                    $(".event_list .no_match ").hide();
                   for(var i=0;i< e.data.length;i++){
                        var dataTime=dateconversion(e.data[i].created);
                        var certIcon='';
                        var certifications=e.data[i].certifications;
                        for(var key in certifications){
                            certifications+='<a href=""> <img src="'+certifications[key]+'"> </a>';
                        }
                        // var average=Math.floor((((e.data[i].path)+(e.data[i].org)+(e.data[i].atmo))/3)*10);
                        var html="";
                            html+='<div class="listItem" data-id='+e.data[i].id+'>';
                            html+='<div class="left">';
                            html+='<a href='+path+"/races/"+e.data[i].id+'><img src="'+e.data[i].raceCover+'!80x80" alt="" class="img"/></a>';
                            html+='</div>';
                            html+='<div class="right">';
                            html+='<div class="title font24 c_blue">';
                            html+='<h3>'+e.data[i].cnName+'</h3>';
                            html+='<p class="certification">';
                            html+=certIcon;//认证图标list
                            html+='</p>';
                            html+='</div>';
                            html+='<div class="concise font16">'+e.data[i].enName+'';
                            html+='</div>';
                            html+='<div class="date_address font20">';
                            html+='<span class="address">'+e.data[i].countryName+'  '+e.data[i].cityName+'</span>';
                            if(null != e.data[i].raceTime){
                            	html+='<span class="date">'+e.data[i].raceTime+'</span>';
                            }
                            html+='</div>';
                            if(null != e.data[i].raceType && e.data[i].raceType.length!=0){
                                html+='<div class="distance font20">';
                                for(var _i=0;_i<e.data[i].raceType.length;_i++){
                                    html+='<span>'+e.data[i].raceType[_i]+'</span>';
                                }
                                html+='</div>';
                            }
                            
                            //1 没有报名信息；0即将报名（小于7天）；1正在报名；2报名截止；3下架；4即将截止（小于3天）；5正在预约；
                            if(e.data[i].raceSign != -1 && e.data[i].raceSign != 2 && e.data[i].raceSign != 3){
                            	var raceSignStatus = "";
                            	if(e.data[i].raceSign == 0){
                            		html += '<div class="regStatus font20 c_red">即将报名<a href="javascript:void();" class="applying">即将报名</a></div>';
                            	}else if(e.data[i].raceSign == 1){
                            		if(e.data[i].signType == 0){
                            			html += '<div class="regStatus font20 c_red">正在预约<a href="javascript:void();" class="applying">立即预约</a></div>';
                            		}else{
                            			html += '<div class="regStatus font20 c_red">正在报名<a href="javascript:void();" class="applying">立即报名</a></div>';
                            		}
                            	}else if(e.data[i].raceSign == 4){
                            		html += '<div class="regStatus font20 c_red">即将截止<a href="javascript:void();" class="applying">立即报名</a></div>';
                            	}else{
                            		html += '<div class="regStatus font20 c_red"></div>';
                            	}
//                            	var eventStatus=e.data[i].eventStatus;
//                                if(eventStatus=="正在报名"||eventStatus=="即将报名"){
//                                    html+='<div class="regStatus font20 c_red">'+eventStatus+raceSignStatus+'</div>';
//                                }else if(eventStatus=="比赛结束"||eventStatus=="报名信息未知"){
//                                    html+='<div class="regStatus font20 c_note">'+eventStatus+'</div>';
//                                }else if(eventStatus=="比赛日"||eventStatus=="报名截止"){
//                                    html+='<div class="regStatus font20 blue">'+eventStatus+'</div>';
//                                }else{
//                                    html+='<div class="regStatus font20 c_note">'+eventStatus+'</div>';
//                                }
                            }else{
                            	var eventStatus=e.data[i].eventStatus;
                                if(eventStatus=="比赛结束"){
                                    html+='<div class="regStatus font20 c_note">'+eventStatus+'</div>';
                                }else if(eventStatus=="比赛日"){
                                    html+='<div class="regStatus font20 blue">'+eventStatus+'</div>';
                                }else{
                            		html += '<div class="regStatus font20 c_red"></div>';
                            	}
                            }
                            
                            html+='<div class="runners font17 borderTop_e5e5e5">';
                            html+='<span class="one">'+e.data[i].wantCount+'人想跑</span><span class="two">'+e.data[i].runCount+'人跑过</span>';
                            html+='<div class="assess">';
                            html+='<div class="star">';
                            html+='<span class="jd" style="width:'+e.data[i].totalScore+'%"></span>';
                            html+='</div>';
                            html+='</div>';
                            html+='</div></div>';
                            html+='<div class="clear"></div>';
                            html+='</div>';
                            html+='<div class="cuttoff"></div>';
                            html+='';
                            $("#event_list .list_list").append(html);
                       // $(html).prependTo($("#regRun .img_list ul"));

                   }
                   _page++;
                    $(".comment").hide();
                   windowScroll();
                   // 列表页点击跳转
                   $("#event_list .list_list .listItem").bind('click',function(){
                       var id=$(this).attr("data-id");
			if(id == "1446"){
				window.location.href="http://site.42trip.com/2016/budweiser/";
				return;
			}
                       window.location.href=path+"/races/"+id;
                   });

               }else{
                    $(".comment a").html("没有更多了");
                    lockpage=false;
                    if(_page==0){
                        $(".event_list .no_match ").show();
                    }
               }
           },
           error:function(e){
               console.log(e); 
           }
        })

    }
    runsFriends();
    function windowScroll(){
        lockpage=true;
        // $("body").css("height","1000px")
        // scroll(function(direction) {
        //     if(direction=="down"){
        //         $("#backTop").stop(true,true).fadeOut();
        //     }else{
        //         $("#backTop").fadeIn();
        //     }
        // });

        $(window).on("scroll",function(e){
            if($(window).scrollTop()+10>$(document).height()-$(window).height()){
                if(lockpage){
                    lockpage=false;
                    runsFriends();
                    if(_page!=0){
                        $(".comment").fadeIn();
                    }
                }
            }
        })
    }
    //分页加载end


});
