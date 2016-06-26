/**
 * Created by iun007 on 2016/4/21.
 */
(function () {
    var $urlHost = ['http://www.shouzi.ren/index.php?g=Api&m=Web&a=getLunbo&datatype=jsonp', 'http://138.128.203.57/wasai/api.php',"http://wasai.wenyuhai.com/front"];
    var initialDataModel = {
        queryURLParameter:function(url){
            var obj = {};
            var reg = /([^?=&]+)=([^?=&]+)/g;
            url.replace(reg, function () {
                obj[arguments[1]] = arguments[2];
            });
            return obj;
        },
        addZero: function (val) {
            return val < 10 ? "0" + val : val;
        },
        judgeClear:function(){
            if(obj.orderby||obj.status||obj.state||obj.city||obj.groupid||obj.start_date||obj.end_date){
                $('.btn-clear').show();
            }
        },
        week:function(num){
            var str;
            switch (num){
                case 0:str='\u65e5';
                    break;
                case 1:str='\u4e00';
                    break;
                case 2:str='\u4e8c';
                    break;
                case 3:str='\u4e09';
                    break;
                case 4:str='\u56db';
                    break;
                case 5:str='\u4e94';
                     break;
                default :
                    str='\u516d';
            }
            return str

        },
        showTime: function (Time) {
            var _this = this;
            var time;
            switch (typeof Time) {
                case 'string':
                    time = new Date(Time);
                    break;
                case 'object':
                    time = Time;
                    break;
            }
            var year = time.getFullYear()||time.getYear();
            var month = time.getMonth() + 1;
            var day = time.getDate();
            var week = time.getDay();
            //var aryStr = '日一二三四五六';
            return typeof Time == 'string' ? month + '\u6708' + day + '\u65e5\u5468'+_this.week(week): year + '-' + _this.addZero(month) + '-' + _this.addZero(day);
        },
        windowScroll:function(){
            var _this=this;
            lockpage=true;
            $(window).on('scroll',function(e){
                if($(window).scrollTop()+10>$(document).height()-$(window).height()){
                    if(lockpage){
                        lockpage=false;
                        _this.repeatedMethod();
                    }
                }
            })
        },
        repeatedMethod: function () {
            var _this = this;
            $.ajax({
                url: $urlHost[1],
                type: 'post',
                dataType: 'json',
                data:{"input":JSON.stringify(obj)},
                success: function (data) {
                    console.log(data);
                  //  alert('我就呵呵了');
                    if(data.err==1998){
                           window.location.href="http://wasai.wenyuhai.com/wasai/callback.php?cmd=wechat&subcmd=regist&referer="+encodeURIComponent($urlHost[2]);
                        return
                    }
                    _this.callback1(arguments[0]);
                },error:function(e){
                    console.log(e);
                }
            })
        },
        callback1: function (jsonData) {
            if (jsonData.val == "") {
                return;
            }
            var _this = this;
                //lockpage=true;
            _this.bindIndex(jsonData);

        },
        bindLunbo: function (obj) {
            var lunbo_data = obj.dataList;
            var str = '';
            str += '<div id="focus" class="focus"><div class="hd"><ul></ul></div><div class="bd"><ul>';
            for (var i = 0; i < lunbo_data.length; i++) {
                str += '<li><a href="' + lunbo_data[i].slide_url + '"><img _src="' + lunbo_data[i].slide_pic + '"/></a></li>'
            }
            str += '</ul></div></div>';
            $('.race-banner-box').html(str);
            TouchSlide({
                slideCell: "#focus",
                titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell: ".bd ul",
                effect: "left",
                autoPlay: true, //自动播放
                autoPage: true, //自动分页
                switchLoad: "_src" //切换加载，真实图片路径为"_src"
            });
            var typeStr = '';
            typeStr += '<ul>';
            for (var key in obj.group) {
                typeStr += '<li id="' + key + '">' + obj.group[key].groupname + '</li>'
            }
            typeStr += '</ul>';
            $('.type-list').html(typeStr);
        },
        bindIndex: function (ob) {
            var _this = this;
            var str;
            var DataList = '';
            var Index_data = ob.val.list;
            $('.num').text(ob.val.sum);
            if(Index_data!==null){
                $('.no-match').hide();
                for (var i = 0; i < Index_data.length; i++) {
                    var status = '';
                    var statuStr;
                    switch (Index_data[i].status) {
                        case "0":
                       status="status3";
                       statuStr="\u672a\u542f\u52a8";
                            break;
                        case '1':
                            status = 'status1';
                            statuStr="\u51c6\u5907\u62a5\u540d";
                            break;
                        case '2':
                            status = 'status2';
                            statuStr='\u62a5\u540d\u4e2d';
                            break;
                        case '3':
                            status='status3';
                            statuStr='\u62a5\u540d\u7ed3\u675f';
                            break;
                        case '4':
                            status='status3';
                            statuStr='\u5df2\u62a5\u6ee1';
                    }
                    str='<div class="race-idx-type">';
                    //if(Index_data[i].group_name.indexOf('|')>0){
                    //    var ary=Index_data[i].group_name.split('|');
                    //    for(var j=0;j<ary.length;j++){
                    //        var icon=ary[j].split(',')[0];
                    //        str+='<span>' + icon + '</span> ';
                    //    }
                    //}else{
                    //        icon=Index_data[i].group_name.split(',')[0];
                    //        iconColor=Index_data[i].group_name.split(',')[1];
                    //        str+='<span>' + icon + '</span> ';
                    //}
                    str+='</div></div></a></li>';

                    //var IndexData=Index_data[i].race_time.replace(/-/g,'/');
                    //此处删去详解下个页面的图片id
                    DataList += '<li>' +
                        '<a href="detail.html?ID='+Index_data[i].ID+'">' +
                        '<div class="race-idx-img">' +
                            //此处去掉了img链接的图片，数据里还没有
                        '<img src="' + Index_data[i].image + '" alt="" width="100%">' +
                        '<span class="figcaption">' + Index_data[i].subtitle + '</span>' +
                        '</div>' +
                        '<div class="race-idx-header">' +
                        '<span class="status ' + status + '">' + statuStr + '</span>' +
                        '<h2>' + Index_data[i].name + '</h2>' +
                        '<div class="race-idx-ps">' +
                        '<span class="race-idx-date">' +
                        '<i class="ws-ico ico-time2"></i>' + _this.showTime(new Date(Index_data[i].start_time*1000)) + '</span>' +
                        '<span class="race-idx-location">' +
                        '<span class="ws-ico ico-location2">' +
                        '</span>' + Index_data[i].place+ '</span>'+str;
                }
                $('.race-section ul').append(DataList);
                //obj.page++;

                //$('.race-section ul li').bind('click',function(){
                //    var id=$(this).attr('data-id');
                //    window.location.href='http:\/\/www.shouzi.ren\/index.php?g=Race&m=RaceData&a=detail&id='+id;
                //});
                //_this.windowScroll();

            }else{
                $('.loading').hide();
                $('.no-match').show();
            }

        },
        callback: function (jsonData) {
            if (jsonData.data.code != 200) {
                return;
            }
            var _this = this;
            _this.bindLunbo(jsonData);

        },
        init: function () {
            var _this = this;
            $.ajax({
                url: $urlHost[0],
                type: 'get',
                dataType: 'jsonp',
                jsonp: "callback",
                success: function () {
                    _this.callback(arguments[0]);
                    _this.repeatedMethod();
                    //类型的异步加载
                    $('.type-list ul li').bind('click', function () {
                        var Num=$('.race-fiter>div').index($(this).parent().parent());
                        $($('.race-fiter-list li')[Num]).siblings().removeClass('change');
                        $('.race-section ul').empty();
                        $('.bg').removeClass('shelter');
                        $(this).parent().parent().addClass('hide');
                        //obj.page=1;
                        obj.groupid = $(this).attr('id');
                        initialDataModel.judgeClear();
                        $('.race-fiter-list li[data-render=type-list]').removeClass('selected');
                        _this.repeatedMethod()

                    })
                }
            });
        }
    };
    //obj.page=1;
    //obj.pagesize=8;
    var url = window.location.href;
    var userid =initialDataModel.queryURLParameter(url)["userid"];
    var ck=initialDataModel.queryURLParameter(url)["val"];
    if(localStorage.getItem("user_name")&&localStorage.getItem("ck")){
        if(ck!=localStorage.getItem("ck")){
            var obj={cmd:"mrace",subcmd:"list",userid:localStorage.getItem("user_name"),ck:ck,val:{status:1}};
            console.log(obj);
            alert(obj);
            localStorage.setItem("ck",ck);
        }
         obj = {cmd:"mrace",subcmd:"list",userid:localStorage.getItem("user_name"),ck:localStorage.getItem("ck"),val:{status:1}};
    }else{
        if(userid&&ck){
            obj={cmd:"mrace",subcmd:"list",userid:userid,ck:ck,val:{status:1}};
            localStorage.setItem("user_name",userid);
            localStorage.setItem("ck",ck);
        }else{
            obj={cmd:"mrace",subcmd:"list",userid:"",ck:"",val:{status:1}};
        }
    }
    console.log(obj);

    initialDataModel.init();

    $('.bg').bind('click',function(){
        $('.race-fiter-list li').removeClass('selected').siblings().removeClass('change');
        $(this).removeClass('shelter');
        $('.filter-detail-list').addClass('hide');
    });
    $('.btn-clear').bind('click', function () {
        $(this).hide();
    //    obj = {};
        //obj.page=1;
        //obj.pagezize=8;
        $('.race-section ul').empty();
       initialDataModel.repeatedMethod();
        //此处为完成清除完后还需要异步加载默认数据；
    });
    $('.race-fiter-list li').on('click', function (event) {
        var idx = $(this).index();
        if (!$(this).hasClass('selected')) {
            $(this).addClass('selected').siblings().removeClass('selected');
            $(this).siblings().removeClass('change');
            $(this).prev().addClass('change');
            $('.filter-detail-list').addClass('hide');
            $('.bg').addClass('shelter');
            var curList = $(this).attr('data-render');
            $('.' + curList).removeClass('hide').addClass('fadeInDown animated');
        } else {
            $(this).removeClass('selected').siblings().removeClass('change');
            $('.bg').removeClass('shelter');
            $('.filter-detail-list').addClass('hide');
        }
    });

    var $l = $('.zone-l ul li'), $r = $('.zone-r ul');
    $.extend({
        tabChange: function (n, a, b) {
            a.removeClass('selected');
            b.removeClass('selected');
            $(a).eq(n).addClass('selected');
            $(b).eq(n).addClass('selected')
        }
    });
    $l.bind('click', function () {
        var i = $(this).index();
        $.tabChange(i, $l, $r);
        if($r[i]){
            console.log($r[i]);
            return;
        }else{
            $(this).parent().parent().parent().addClass('hide');
            $('.race-fiter-list li[data-render=zone-list]').removeClass('selected');
            obj.state=$(this).text();
            initialDataModel.repeatedMethod()
        }
    });
    $('#calendar').datepick({
        rangeSelect: true,
        showOtherMonths: true,
        showButtonPanel: true
    });
    $('.clearDate').bind('click', function () {
        $('#calendar').datepick('setDate', null);
    });
    $('.btn').bind('click', function () {
        var $calendar=$('#calendar');
        //var dates = $calendar.datepick('getDate');
        //日历的异步加载
        //obj.start_date = initialDataModel.showTime(dates[0]);
        //obj.end_date = initialDataModel.showTime(dates[1]);
        //initialDataModel.judgeClear();
        //$('.bg').removeClass('shelter');
        //$('.race-section ul').empty();
        //obj.page=1;
        //$('.calendar-list').addClass('hide');
        //initialDataModel.repeatedMethod();
        $calendar.datepick('setDate', null);
        var Num=$('.race-fiter>div').index($(this).parent().parent());
        $($('.race-fiter-list li')[Num]).siblings().removeClass('change');
        $('.race-fiter-list li[data-render=calendar-list]').removeClass('selected');
    });
    //排序的异步加载，排序已删除

    //状态的异步加载
    //$('.status-list ul li').bind('click', function () {
    //    var Num=$('.race-fiter div').index($(this).parent().parent());
    //    $($('.race-fiter-list li')[Num]).siblings().removeClass('change');
    //    $(this).parent().parent().addClass('hide');
    //    $('.bg').removeClass('shelter');
    //    $('.race-fiter-list li[data-render=status-list]').removeClass('selected');
    //    $('.race-section ul').empty();
    //    obj.page=1;
    //    obj.status = $(this).attr('estate');
    //    initialDataModel.judgeClear();
    //    initialDataModel.repeatedMethod()
    //
    //});
    //地区的异步加载
    //$('.zone-r ul li').bind('click', function () {
    //    var Num;
    //    $(this).parent().parent().parent().addClass('hide');
    //    $('.bg').removeClass('shelter');
    //    $('.race-fiter-list li[data-render=zone-list]').removeClass('selected');
    //    $('.race-section ul').empty();
    //    obj.page=1;
    //    num=$('.zone-r ul').index($(this).parent());
    //    Num=$('.race-fiter div').index($(this).parent().parent().parent());
    //    $($('.race-fiter-list li')[Num]).siblings().removeClass('change');
    //    obj.state=$('.zone-l ul li')[num].innerText;
    //    initialDataModel.judgeClear();
    //    if($(this).text()!=='\u5168\u90e8'){
    //        obj.city= $(this).text();
    //    }
    //    initialDataModel.repeatedMethod()
    //});


    //slide_name --- 轮播图标题。slide_pic ---- 轮播图图片地址。slide_url ---- 轮播图跳转链接。
    //http://demo.jb51.net/js/2015/js-province-city-cho-menu-codes/
})();