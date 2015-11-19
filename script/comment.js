// 记录分页起始数量
var comment_public_counts = 0;
//请求服务地址
var comment_public_url = comment_url;
//当前页面地址
var comment_public_curWwwPath=window.document.location.href;
//资源路径
var comment_public_urlstatic = comment_public_url+"/static/img/";
//图片资源地址
//评星数量
var comment_public_scopeNo = 5;
//未选中图标地址
var comment_public_unselectedImg = comment_public_urlstatic + "xx2.png";
//选中图标地址
var comment_public_selectedImg = comment_public_urlstatic + "xx1.png";

//匹配非法数据的格式
var comment_public_reg=/<script[^>]*>.*(?=<\/script>)<\/script>/gi;
//将非法数据替换为内容
var comment_public_regmsg="***";
var comment_public_commcounts=0;

(function(window, undefined) {

    // 校验基本配置参数
    if (!validate())
        return;
    //初始化显示条 需要查询当前模块评论数量，点击评论后显示评论框和内容
    //commcount();

    if(getCookie("seerkey_coo_username")){
        initComment(3,1,getCookie("seerkey_coo_is_score"),getCookie("seerkey_coo_is_title"),getCookie("seerkey_coo_is_name"));
    }else{
        //检查用户的认证方式
        validateAuthway();
    }
})(window);

//查询评论记录请求方法
function list(arg, arg1) {
    $.ajax({
        dataType : "jsonp",
        jsonp : "jsonpcallbackq",
        type : "get",
        url : comment_public_url+"/comment/i/queryComment",
        data : "module=" + comment_module
            + "&status=0&auditStatus=2&bodyId=" + comment_bodyId
            + "&pagesize=" + arg + "&count=" + arg1,
        success : function(msg) {
        }
    });
}
//查询评论数量请求方法
function commcount() {
    $.ajax({
        dataType : "jsonp",
        jsonp : "jsonpcallbackcommcount",
        type : "get",
        url : comment_public_url+"/comment/i/getCommentCount4Module",
        data : "module=" + comment_module+"&bodyId=" + comment_bodyId,
        success : function(msg) {
        }
    });
}

//返回评论数量和评论数显示处理方法
function jsonpcallbackcommcount(datas) {
    var directions="";
    if (datas.resultCode == 1) {
        if ("undefined" === typeof comment_directions) {
            directions = "当前有"+datas.resultObj+"条评论";
        }else{
            directions = comment_directions.replace("$count$",datas.resultObj);
        }
        //查询评论成功
        var rootdiv = document.getElementById(comment_divid);
        var comm_div = $(document.createElement("div"));
        comm_div.attr("id", "comm_div");
        comm_div.attr("class", "content_form");
        comm_div.html(directions);
        comm_div.click(function() {
            comm_div.unbind("click");
            if(getCookie("seerkey_coo_username")){
                initComment(3,1,getCookie("seerkey_coo_is_score"),getCookie("seerkey_coo_is_title"),getCookie("seerkey_coo_is_name"));
            }else{
                //检查用户的认证方式
                validateAuthway();
            }
        });
        rootdiv.appendChild(comm_div[0]);
        comment_public_commcounts=datas.resultObj;
    } else {
        var rootdiv = document.getElementById(comment_divid);
        var comm_div = $(document.createElement("div"));
        comm_div.attr("id", "comm_div");
        comm_div.attr("class", "content_form");
        comm_div.html("评论");
        comm_div.click(function() {
            comm_div.unbind("click");
            if(getCookie("seerkey_coo_username")){
                initComment(3,1,getCookie("seerkey_coo_is_score"),getCookie("seerkey_coo_is_title"),getCookie("seerkey_coo_is_name"));
            }else{
                //检查用户的认证方式
                validateAuthway();
            }
        });
        rootdiv.appendChild(comm_div[0]);
    }
}

//验证审核级别请求方法
function validateAuthway() {
    $.ajax({
        dataType : "jsonp",
        jsonp : "jsonpcallbackAuthway",
        type : "get",
        url : comment_public_url+"/comment/i/qauthway",
        data : "module=" + comment_module,
        success : function(msg) {
        }
    });
}

//初始化元素方法
//data 状态1.表示不进行第三方验证2.需要进行第三方验证3.表示已经完成第三方验证
//is_login 表示是否登录1.表示已经成功登录
//is_score 表示是否显示评分1.表示需要显示评分
//is_title 表示是否显示标题1.表示需要显示标题
//is_name 表示是否显示昵称1.表示需要显示昵称
function initComment(data,is_login,is_score,is_title,is_name) {
    // 获取根div
    var rootdiv = document.getElementById(comment_divid);
    var root_one_div = $(document.createElement("div"));
    root_one_div.attr("class", "content_form");
    root_one_div.attr("id", "root_div");
    var root_dl = $(document.createElement("dl"));
    //如果data等于3表示已经成功登录
    if(parseInt(data)==3){
        var login_div = $(document.createElement("div"));
        login_div.attr("id", "login_div");
        login_div.html("<dt id=\"login_dt_suname\"><a href=\"#\" class=\"userName\">"+getCookie("seerkey_coo_username")+"</a></dt><dd id=\"login_dd_re\" class=\"outlog\"><a href='#' class=\"outLogin\" onclick='logout()'>退出</a></dd>");
        root_dl.append(login_div);
    }
    //如果data等于2表示需要第三方验证 需要显示登录框
    if(parseInt(data)==2){
        //如果需要第三方验证则需要进行登录
        root_dl.append(creatLogin());
    }
    // 创建标题文字
    var title_Span = $(document.createElement("dt"));
    var dd_title = $(document.createElement("dd"));
    var it_title = $(document.createElement("input"));

    //如果模块定义显示标题才进行显示
    if(parseInt(is_title)==1){
        title_Span.text("标题");
        root_dl.append(title_Span[0]);
        // 创建标题输入框

        it_title.attr("type", "text").attr("id", "i_ti").attr("name", "i_ti");
        it_title.attr("class", "form_text");
        dd_title.append(it_title[0]);
        root_dl.append(dd_title[0]);
    }

    var name_Span = $(document.createElement("dt"));
    var it_name = $(document.createElement("input"));
    var dd_name = $(document.createElement("dd"));
    //当不进行第三方验证的时候 并且需要填写昵称 则进行显示昵称填写框
    if(parseInt(data)==1&&parseInt(is_name)==1){
        // 创建名称文字
        name_Span.text("昵称");
        root_dl.append(name_Span[0]);
        // 创建名称输入框
        it_name.attr("id", "i_na").attr("type", "text").attr("name", "i_na");
        it_name.attr("class", "form_text");
        dd_name.append(it_name[0]);
        root_dl.append(dd_name[0]);
    }
    var it_score = $(document.createElement("input"));
    if(parseInt(is_score)==1){
        // 创建评分文字
        var score_Span = $(document.createElement("dt"));
        score_Span.text("评分");
        root_dl.append(score_Span[0]);
        // 创建评分选择区域
        var dd_img = $(document.createElement("dd"));
        //显示资源图片的选择
        var selectedBoolean = true;
        //初始化评分图标的显示
        for(var i=1;i<=comment_public_scopeNo;i++){
            var it_img = $(document.createElement("img"));
            it_img.attr("src",selectedBoolean?comment_public_selectedImg:comment_public_unselectedImg);
            it_img.attr("onclick","score("+i+")");
            it_img.attr("id","score_"+i);
            it_img.css("margin-right","5px");
            dd_img.append(it_img[0]);
            selectedBoolean=false;
        }

        //创建隐藏域
        it_score.attr("id","i_sc").attr("type","hidden").attr("value","1");
        dd_img.append(it_score[0]);
        root_dl.append(dd_img[0]);
    }
    //如果没有标题和昵称的情况下不显示内容文字
    var ta_content = $(document.createElement("textarea"));
    if(parseInt(is_name)==1||parseInt(is_title)==1){
        // 创建内容文字
        var content_Span = $(document.createElement("dt"));
        content_Span.text("内容");
        root_dl.append(content_Span[0]);
        // 创建内容输入框
        var ta_dd = $(document.createElement("dd"));
        ta_content.attr("cols", "30").attr("rows", "3").attr("name", "i_co").attr(
            "id", "i_co").attr("class","form_text");
        ta_dd.append(ta_content[0]);
        root_dl.append(ta_dd[0]);
    }else{
        // 创建内容输入框
        ta_content.attr("cols", "30").attr("rows", "3").attr("name", "i_co").attr(
            "id", "i_co").attr("class","form_text");
        ta_content.css("width","100%");
        root_dl.append(ta_content[0]);
    }

    // 创建提交按钮
    var bt_dd = $(document.createElement("dd"));
    bt_dd.css("text-align","center");
    var bt_done = $(document.createElement("input"));
    bt_done.attr("type", "button");
    bt_done.attr("class", "btn btn-default");
    bt_done.val(" 提 交 ");
    bt_dd.append(bt_done[0]);
    root_dl.append(bt_dd[0]);

    //创建信息提示区
    var msg_Span = $(document.createElement("dt"));
    msg_Span.attr("id", "msg_alert");
    msg_Span.attr("class", "msgalert");
    root_dl.append(msg_Span[0]);

    root_one_div.append(root_dl[0]);
    rootdiv.appendChild(root_one_div[0]);
    if(parseInt(is_login)==1){
        var myDate = new Date();
        bt_done.unbind("click");
        bt_done.click(function() {
            $.ajax({
                dataType : "jsonp",
                jsonp : "jsonpcallbacka",
                type : "get",
                url : comment_public_url+"/comment/i/addComment",
                data : "module=" + comment_module + "&bodyId="
                    + comment_bodyId + "&refid="
                    + comment_refid + "&orignalurl="
                    + comment_public_curWwwPath + "&title=" + it_title.val().replace(comment_public_reg,comment_public_regmsg)
                    + "&content=" + ta_content.val().replace(comment_public_reg,comment_public_regmsg) + "&name=" + (getCookie("seerkey_coo_username")?getCookie("seerkey_coo_username"):it_name.val().replace(comment_public_reg,comment_public_regmsg))
                    + "&score=" + it_score.val() + "&time=" + myDate.getTime()
                    + "&userid=" + comment_userid,
                success : function(msg) {
                }
            });
        });
    }else{
        bt_done.click(function() {
            $('#msg_alert').html("请进行登录！");
        });
    }
    if ("undefined" !== typeof comment_count) {
        if (parseInt(comment_count) > 0)
            list(0, comment_count);
    }
}

//初始化登录框方法
function creatLogin() {
    var login_div = $(document.createElement("dl"));
    login_div.attr("id", "login_div");
    // 创建登录文字
    var login_Span = $(document.createElement("dt"));
    login_Span.text("登录名");
    login_Span.attr("id","lo_sp_te_na");
    login_div.append(login_Span[0]);
    // 创建登录输入框
    var dd_login = $(document.createElement("dd"));
    var it_login = $(document.createElement("input"));
    it_login.attr("id", "i_lo").attr("type", "text").attr("name", "i_lo").attr("value",getCookie("seerkey_coo_userlogin"));
    it_login.attr("class", "form_text");
    dd_login.append(it_login[0]);
    login_div.append(dd_login[0]);
    //创建登录密码文字
    var pw_Span = $(document.createElement("dt"));
    pw_Span.text("密码");
    pw_Span.attr("id","lo_sp_te_pw");
    login_div.append(pw_Span[0]);
    // 创建登录密码输入框
    var dd_pw = $(document.createElement("dd"));
    var it_pw = $(document.createElement("input"));
    it_pw.attr("id", "i_pw").attr("type", "password").attr("name", "i_pw");
    it_pw.attr("class", "form_text");
    dd_pw.append(it_pw[0]);
    login_div.append(dd_pw[0]);

    var pw_Span = $(document.createElement("dt"));
    pw_Span.html("&nbsp;");
    login_div.append(pw_Span[0]);

    // 创建提交按钮
    var bt_dd = $(document.createElement("dd"));
    var bt_re = $(document.createElement("input"));
    bt_re.attr("type", "button").attr("id","lo_in_bu").attr("class","btn btn-default");
    bt_re.val(" 登 录 ");
    bt_dd.append(bt_re[0]);
    login_div.append(bt_dd[0]);
    bt_re.click(function() {
        $.ajax({
            dataType : "jsonp",
            jsonp : "jsonpcallbacktpc",
            type : "get",
            url : comment_public_url+"/comment/i/thirdPartyCertification",
            data : "module=" + comment_module + "&name="
                + it_login.val() + "&pw="
                + it_pw.val(),
            success : function(msg) {
            }
        });
    });
    return login_div;
}

//评论评分点击处理方法
function score(datas) {
    for(var i=0;i<parseInt(datas);i++){
        $('#score_'+(i+1)).attr("src",comment_public_selectedImg);
    }
    for(var i=parseInt(datas)+1;i<=comment_public_scopeNo;i++){
        $('#score_'+i).attr("src",comment_public_unselectedImg);
    }
    $('#i_sc').attr("value",datas);
}

//登录成功后处理方法
function jsonpcallbacktpc(datas) {
    if (datas.resultCode == 1) {
        var name = datas.resultObj;
        //删除生成的
        $("#lo_sp_te_na").css("display","none");
        $("#lo_sp_te_na").val("");
        $("#i_lo").css("display","none");
        $("#lo_sp_te_pw").css("display","none");
        $("#lo_sp_te_pw").val("");
        $("#i_pw").css("display","none");
        $("#lo_in_bu").css("display","none");
        var login_div =$("#login_div");
        //需要退出功能
        login_div.html("<dt id=\"login_dt_suname\"><a href=\"#\" class=\"userName\">"+name+"</a></dt><dd class=\"outlog\" id=\"login_dd_re\"><a href='#' class=\"outLogin\" onclick='logout()'>退出</a></dd>");
        addCookie("seerkey_coo_username",name,0);
        addCookie("seerkey_coo_userlogin",datas.resultMessage,168);
        addCookie("seerkey_coo_is_score",datas.is_score,0);
        addCookie("seerkey_coo_is_title",datas.is_title,0);
        addCookie("seerkey_coo_is_name",datas.is_name,0);
    } else {
        $('#msg_alert').html(datas.resultMessage);
    }
}

//登出处理方法
function logout(datas) {
    $("#login_dt_suname").remove();
    $("#login_dd_re").remove();
    delCookie("seerkey_coo_username");
    $("#login_div").append(creatLogin());
}

//增加cookie方法
function addCookie(objName,objValue,objHours){//添加cookie 
    var str = objName + "=" + escape(objValue);
    if(objHours > 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours*3600*1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}
//获取cookie方法
function getCookie(objName){//获取指定名称的cookie的值 
    var arrStr = document.cookie.split("; ");
    for(var i = 0;i < arrStr.length;i ++){
        var temp = arrStr[i].split("=");
        if(temp[0] == objName) return unescape(temp[1]);
    }
}
//删除cookie方法
function delCookie(name){//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间 
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + "=a; expires=" + date.toGMTString();
}

//验证初始化参数方法
function validate() {
    if ("undefined" === typeof comment_module) {
        alert("缺少模块配置,请参照标准配置!");
        return false;
    }
    if ("undefined" === typeof comment_bodyId) {
        alert("缺少资源主题id配置,请参照标准配置!");
        return false;
    }
    if ("undefined" === typeof comment_refid) {
        alert("缺少引用资源id配置,请参照标准配置!");
        return false;
    }
    if ("undefined" === typeof comment_url) {
        alert("缺少服务地址配置,请参照标准配置!");
        return false;
    }
    if ("undefined" === typeof comment_userid) {
        alert("缺少用户标识配置,请参照标准配置!");
        return false;
    }
    if ("undefined" === typeof comment_divid) {
        alert("缺少显示位置区域配置,请参照标准配置!");
        return false;
    }
    return true;
}

//查询返回和查询显示元素初始化方法
function jsonpcallbackq(datas) {
    $('#msg_alert').html("");
    if (datas.resultCode == 1) {
        var cl = datas.commentsList;
        var html = "";
        if (parseInt(comment_public_counts) == 0) {
            html = "<div id='list_div'><ul class=\"pl\" id='_ta_comm'>";
            for ( var i = 0; i < cl.length; i++) {
                html += "<li>";
                html += "<p><span class=\"pl_title\">"+ cl[i].title+"</span>";
                html += "<span class=\"pl_time\">"+ cl[i].timeDate +"</span><a class=\"pl_name\">"+cl[i].name+"</a></p><br/>";
                html += "<p >"+cl[i].content +"</p>";
                html += "<p></p></li>";
            }
            html += "</ul></div>";
            comment_public_counts = parseInt(comment_public_counts) + comment_count;
            if (parseInt(cl.length) < parseInt(comment_count)) {
                if (cl.length > 0)
                    $('#root_div').append(html);
            } else {
                html += "<div id='_div_more'><button type=\"button\" id=\"div_more_a\" class=\"getMore\">更多</button></div>";
                $('#root_div').append(html);
                // 创建更多链接
                $("#div_more_a").click(function() {
                    list(parseInt(comment_public_counts), comment_count);
                });
            }
        } else {
            for ( var i = 0; i < cl.length; i++) {
                html += "<li>";
                html += "<p><span class=\"pl_title\">"+ cl[i].title+"</span>";
                html += "<span class=\"pl_time\">"+ cl[i].timeDate +"</span><a class=\"pl_name\">"+cl[i].name+"</a></p><br/>";
                html += "<p>"+cl[i].content +"</p>";
                html += "<p></p></li>";
            }
            $('#_ta_comm').append(html);
            if (parseInt(cl.length) < parseInt(comment_count)) {
                $("#_div_more").html("");
            } else {
                var cancelBtndm = $("#div_more_a");
                cancelBtndm.unbind("click");
                cancelBtndm
                    .click(function() {
                        list(parseInt(comment_public_counts)
                            + parseInt(comment_count),
                            comment_count);
                        comment_public_counts = parseInt(comment_public_counts)
                            + parseInt(comment_count);
                    });
            }
        }
    } else {
        $('#msg_alert').html("查询失败！" + datas.resultMessage);
    }
}
//增加评论结果处理方法
function jsonpcallbacka(datas) {
    if (datas.resultCode == 1) {
        $('#msg_alert').html("");
        $('#i_ti').val('');
        $('#i_na').val('');
        $('#i_co').val('');
        $('#i_sc').val('1');
        $('#list_div').remove();
        $("#_div_more").remove();
        comment_public_commcounts = parseInt(comment_public_commcounts)+1;
        if ("undefined" === typeof comment_directions) {
            directions = "当前有"+comment_public_commcounts+"条评论";
        }else{
            directions = comment_directions.replace("$count$",comment_public_commcounts);
        }
        $("#comm_div").html(directions);
        comment_public_counts = 0;
        list(0, comment_count);
    } else {
        $('#msg_alert').html("评论失败！" + datas.resultMessage);
    }
}
//查询审核等级处理方法
function jsonpcallbackAuthway(datas) {
    if (datas.resultCode == 1) {
        //返回结果authway
        initComment(datas.authway,1,datas.is_score,datas.is_title,datas.is_name);
    } else {
        initComment(1,2,9,9,9);
    }
}