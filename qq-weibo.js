function composePageCookiejs() {
    var a = PageManager.getCurrentPage();
    return a.cookiejs()
}
function composePageSuccessjs(a) {
    var b = PageManager.getCurrentPage();
    b.successjs(a)
}
function nameLengthCheck(a, b) {
    var c = "";
    c = a + b;
    return util.getByteLength(c) <= 16 ? !0 : !1
}
function renderAppGrade(a) {
    var b = [];
    b.push('<div class="app-rank t_grade">');
    for (var c = 0; c < 5; c++) c < a ? b.push('<span class="app-star"></span>') : b.push('<span class="app-star empty"></span>');
    b.push("</div>");
    return b.join("")
}
function renderAppPic(a) {
    var b = [];
    b.push('<div class="t_app_pic app-pic-slider">'),
    b.push('<div class="app-pic-list">'),
    b.push('<div class="t_mask SH_anim_mask pic_mask">'),
    b.push('<ul class="t_banner SH_anim_comp pic_comp">');
    if (a && a.length > 0) for (var c = 0, d = a.length; c < d; c++) b.push('<li><img src="' + a[c] + '" width="177" height="266"></li>');
    b.push("</ul>"),
    b.push("</div>"),
    b.push('<div class="app-pic-slide t_slide">');
    if (a && a.length > 0) for (var c = 0, d = a.length; c < d; c++) c == 0 ? b.push('<span class="current">●</span>') : b.push("<span>●</span>");
    b.push("</div>"),
    b.push("</div>"),
    b.push("</div>");
    return b.join("")
}
function renderAppRecommendUserList(a) {
    var b = [];
    b.push('<div class="st t_friends"> <div class="st-tit">你的这些好友也在玩： <div class="t_slide st-slide">');
    if (a && a.length > 0) {
        for (var c = 0, d = Math.ceil(a.length / 5); c < d; c++) c == 0 ? b.push('<span class="current">●</span>') : b.push("<span>●</span>");
        b.push('</div></div> <div class="SH_anim_mask user_mask"><ul class="user-list SH_anim_comp user_comp t_banner">');
        for (var c = 0, d = a.length; c < d; c++) b.push((new EJS({
            element: "ejs_recommend_user",
            type: "["
        })).render(a[c]))
    }
    return b.join("")
}
function renderRecommendUserList(a, b, c, d, e, f) {
    var g = [];
    f == "topic" ? g.push('<div class="st t_recommend"> <div class="st-tit">推荐收听： <div class="t_slide st-slide">') : !f && b ? g.push('<div class="st t_recommend"> <div class="st-tit">收听' + e + '的人也收听： <div class="t_slide st-slide">') : !f && !b && g.push('<div class="st t_recommend"> <div class="st-tit">你收听的人中，有' + d + "人也收听了" + e + '： <div class="t_slide st-slide">');
    if (a && a.length > 0) for (var h = 0, i = Math.ceil(a.length / (f == "topic" ? 2 : c == 2 ? 4 : 5)); h < i; h++) h == 0 ? g.push('<span class="current">●</span>') : g.push("<span>●</span>");
    if (f == "topic") {
        var j = Math.ceil(a.length / 2) * 300;
        g.push('</div></div> <div class="SH_anim_mask people_mask"><ul class="people-list SH_anim_comp people_comp t_banner" style="width:' + j + 'px;">')
    } else if (!f && c == 2) {
        var j = Math.ceil(a.length / 4) * 300;
        g.push('</div></div> <div class="SH_anim_mask people_mask"><ul class="people-list SH_anim_comp people_comp t_banner" style="width:' + j + 'px;">')
    } else ! f && c == 1 && g.push('</div></div> <div class="SH_anim_mask user_mask"><ul class="user-list SH_anim_comp user_comp t_banner">');
    if (a && a.length > 0) for (var h = 0, i = a.length; h < i; h++) g.push((new EJS({
        element: c == 2 ? "ejs_recommend_people": "ejs_recommend_user",
        type: "["
    })).render(a[h]));
    g.push("</ul></div></div>");
    return g.join("")
}
function renderHotUserForSearchPage(a) {
    var b = [],
    c = a.users;
    b.push('<ul mst="' + a.mst + '" class="t_hot people-list">');
    if (c && c.length > 0) {
        for (var d = 0, e = c.length; d < e; d++) b.push((new EJS({
            element: "ejs_people_msg",
            type: "["
        })).render(c[d]));
        b.push('<li class="more-link"><a href="#famous">更多</a></li>')
    } else b.push('<li class="people-list-item"><div class="search-result-inner"><p><strong>暂时没有找到相关用户</strong></p></div></li>');
    b.push("</ul>");
    return b.join("")
}
function renderMaybeUserForSearchPage(a, b) {
    var c = [],
    d = a.users;
    c.push('<ul mst="' + a.mst + '" class="t_maybe timeline-list">');
    if (d && d.length > 0) {
        for (var e = 0, f = d.length; e < f; e++) {
            for (var g in b) d[e][g] = b[g];
            c.push((new EJS({
                element: "ejs_user_list",
                type: "["
            })).render(d[e]))
        }
        c.push('<li class="more-link"><a href="#may_know">更多</a></li>')
    } else c.push('<li class="timeline-list-item"><div class="search-result-inner"><p><strong>暂时没有找到相关用户</strong></p></div></li>');
    c.push("</ul>");
    return c.join("")
}
function renderUserForSearchPage(a, b) {
    var c = [],
    d = a.users;
    c.push('<ul mst="' + a.mst + '" class="t_result timeline-list">');
    if (d && d.length > 0) {
        for (var e = 0, f = d.length; e < f; e++) {
            for (var g in b) d[e][g] = b[g];
            c.push((new EJS({
                element: "ejs_user_list",
                type: "["
            })).render(d[e]))
        }
        c.push("getMoreData" in a ? createUserListMore(a.getMoreData) : "")
    } else c.push('<li class="timeline-list-item"><div class="search-result-inner"><p><strong>暂时没有找到相关用户</strong></p></div></li>');
    c.push("</ul>");
    return c.join("")
}
function renderHotTopicForSearchPage(a, b) {
    var c = [],
    d = a.topics;
    c.push('<ul mst="' + a.mst + '" class="timeline-list">');
    if (d && d.length > 0) {
        for (var e = 0, f = d.length; e < f; e++) d[e].renderOptions = b,
        c.push((new EJS({
            element: "ejs_topic",
            type: "["
        })).render(d[e]));
        c.push('<p class="more-link"><a href="#hot">更多</a></p>')
    } else c.push('<li class="timeline-list-item"><div class="search-result-inner"><p><strong>暂时没有找到相关话题</strong></p></div></li>');
    c.push("</ul>");
    return c.join("")
}
function renderMessageForSearchPage(a) {
    var b = [],
    c = a.msgs;
    b.push('<ul mst="' + a.mst + '" class="t_result timeline-list">');
    if (c && c.length > 0) {
        for (var d = 0, e = c.length; d < e; d++) b.push(ejsCreateMsg(c[d]));
        b.push("getMoreData" in a ? createMsgSearchMore(a.getMoreData) : "")
    } else b.push('<li class="timeline-list-item"><div class="search-result-inner"><p><strong>暂时没有找到相关微博</strong></p></div></li>');
    b.push("</ul>");
    return b.join("")
}
function renderSubScriptionKeywordForSearchPage(a) {
    var b = [],
    c = a.topics;
    if (c && c.length > 0) {
        b.push('<p class="key-words-link">');
        for (var d = 0, e = c.length; d < e; d++) b.push((new EJS({
            element: "ejs_search_subscription_keyword",
            type: "["
        })).render(c[d]));
        b.push("</p>"),
        b.push('<p class="more-link"><a href="#subscription">更多</a></p>')
    } else b.push('<div class="t_mykeyword search-result-inner"><p><strong>暂时没有订阅关键词</strong></p></div>');
    return b.join("")
}
function renderHistoryKeywordForSearchPage(a) {
    var b = [];
    if (a && a.length > 0) for (var c = 0, d = a.length; c < d; c++) b.push('<a data-keyword="' + a[c].value + '" data-type="' + a[c].type + '">' + a[c].value + "</a>");
    else b.push('<div class="search-result-inner"><p><strong>暂时没有搜索历史</strong></p></div>');
    return b.join("")
}
function createDetailMore(a) {
    var b = "";
    a && (b = (new EJS({
        element: "ejs_detail_msg_more_button",
        type: "["
    })).render(a));
    return b
}
function renderDetailUl(a) {
    var b, c = "",
    d = a.msgs,
    e = a.total,
    f = "";
    if (d == undefined || d.length === 0) {
        var g = a.mst == g_mst.DETAIL_FWD_MSG ? "暂无评论": "暂无转播和评论";
        c = '<li class="timeline-list-item"><div class="wb-empty-msg">' + g + "</div></li>"
    } else {
        for (var h = 0, i = d.length; h < i; h++) c += (new EJS({
            element: "ejs_detail_page",
            type: "["
        })).render(d[h]);
        c += createDetailMore(a.getMoreData)
    }
    b = '<ul class="t_fwdList t_focusable-item" mst="' + a.mst + '">' + c + "</ul>";
    return b
}
function renderFamous(a) {
    var b = {},
    c = a.recommArray,
    d = a.famousSayArray,
    e = a.famousArray,
    f = a.mst,
    g = '<div class="module"><div class="module-t"><span class="zxht">推荐收听</span></div><div class="module-c"><ul class="people-list" mst=' + f + '>[%= recommend %]<li class="more-link"><a class="t_auth" href="#recommend">查看更多</a></li></ul></div>' + "</div>" + '<div class="module-c">' + '<div class="module-t"><span class="xght">分类名人</span></div>' + '<ul class="txt-link-list t_class"><li>' + '[% for(var i=0;i<classArray.length;i++){ %]<a [%if(i==0){%]class="active"[%}%] classid="[%=classArray[i].classid %]">[%=classArray[i].name%]</a>[% } %]' + "</li></ul>" + '<ul class="people-list t_sp" mst=' + f + '>[%= celebrity %]<li class="more-link"><a class="t_auth" href="#celebrity">查看更多</a></li></ul>' + "</div>" + '<div class="module">' + '<div class="module-t"><span class="xght">名人在说</span></div>' + '<div class="module-c"><ul class="timeline-list t_fsay" mst=' + f + '>[%= talking %]<li class="more-link"><a class="t_auth" href="#talking">查看更多</a></li></ul></div>' + "</div>";
    b.recommend = "";
    for (var h = 0, i = c.length; h < i; h++) b.recommend += (new EJS({
        element: "ejs_people_msg",
        type: "["
    })).render(c[h]);
    b.celebrity = "";
    for (var j = 0, i = e.length; j < i; j++) b.celebrity += (new EJS({
        element: "ejs_people_msg",
        type: "["
    })).render(e[j]);
    b.talking = "";
    for (var k = 0, i = d.length; k < i; k++) b.talking += (new EJS({
        element: "ejs_famous_say",
        type: "["
    })).render(d[k]);
    b.classArray = a.classArray;
    return (new EJS({
        text: g,
        type: "["
    })).render(b)
}
function renderChannelDetail(a, b) {
    if (!b) return renderCommonMsgs(a);
    if (b.picType) {
        var c = '<ul class="t_pic_timeline" mst="' + a.mst + '" >',
        d = "",
        e = a.msgs;
        for (var f = 0, g = e.length; f < g; f++) {
            var h = e[f];
            h.cnId && util.getByteLength(h.cnId) > 14 && (h.cnId = util.getByteStr(h.cnId, 14) + "..."),
            h.username && util.getByteLength(h.username) > 14 && (h.username = util.getByteStr(h.username, 14) + "..."),
            h.remark && util.getByteLength(h.remark) > 14 && (h.remark = util.getByteStr(h.remark, 14) + "..."),
            h.forwardCount < 9999999 && h.forwardCount ? h.forwardCount = util.numNotation(h.forwardCount) : h.forwardCount > 9999999 ? h.forwardCount = "9,999,999+": h.forwardCount = "",
            d += (new EJS({
                element: "ejs_pictype_msg",
                type: "["
            })).render(e[f])
        }
        c += d + createCommonMsgMore(a.getMoreData) + "</ul>";
        return c
    }
}
function renderChannel(a) {
    var b = '<ul class="t_class" mst="' + a.mst + '" >',
    c = "",
    d = a.channels;
    for (var e = 0, f = d.length; e < f; e++) d[e].iconUrl && (c += (new EJS({
        element: "ejs_channel_list",
        type: "["
    })).render(d[e]));
    b += c + "</ul>";
    return b
}
function renderBlackList(a) {
    var b = a.users,
    c = '<ul class="follower-list focusable" mst="' + a.mst + '" >',
    d = "",
    e = a.users;
    if (b == undefined || b.length == 0) c += '<div class="search-result-inner"><p><strong>暂无数据。</strong></p></div>';
    else {
        for (var f = 0, g = e.length; f < g; f++) d += (new EJS({
            element: "ejs_black_list",
            type: "["
        })).render(e[f]);
        c += d + createUserListMore(a.getMoreData) + "</ul>"
    }
    return c
}
function renderRecommendList(a, b) {
    var c = '<ul class="follower-list focusable" mst="' + a.mst + '" >',
    d = "",
    e = "users" in a ? a.users: [],
    f = "getMoreData" in a ? a.getMoreData: null,
    d = "";
    for (var g = 0, h = e.length; g < h; g++) {
        var i = e[g];
        for (var j in b) i[j] = b[j];
        d += (new EJS({
            element: "ejs_user_list",
            type: "["
        })).render(i)
    }
    c += d + "<li class='timeline-list-item wb-more'><a class='t_refresh'>换一批</a></li></ul>";
    return c
}
function renderUserList(a, b) {
    if (a.mst == g_mst.NEARBY_USER_LIST && a.locate && (a.locate == "-1" || a.locate == "-2" || a.locate == "-3")) return ! 1;
    var c = '<ul class="follower-list focusable" mst="' + a.mst + '" >',
    d = "",
    e = "users" in a ? a.users: [],
    f = "getMoreData" in a ? a.getMoreData: null;
    if (e.length == 0) b.defaultText ? d += '<li class="timeline-list-item"><div class="search-result-inner"><p><strong>' + b.defaultText + "</strong></p></div></li>": a.mst == g_mst.USER_FOLLOWER ? d += '<li class="timeline-list-item"><div class="search-result-inner"><p><strong>您还没有听众。<a href="#famous">增加更多收听</a>，可以吸引听众哦。</strong></p></div></li>': a.mst == g_mst.USER_FOLLOWING ? d += '<li class="timeline-list-item"><div class="search-result-inner"><p><strong>您还没有收听的人，去<a href="#famous">名人页</a>看看吧。</strong></p></div></li>': a.mst == g_mst.CLOSE_FRIEND ? d += '<li class="timeline-list-item"><div class="search-result-inner"><p><strong>暂无数据。</strong></p></div></li>': a.mst == g_mst.JOINTFOLLOW && (d += '<li class="timeline-list-item"><div class="search-result-inner"><p><strong><a href="#famous">增加更多收听</a>，才可以帮您推荐可能认识的人哦。</strong></p></div></li>'),
    c += d;
    else {
        for (var g = 0, h = e.length; g < h; g++) {
            var i = e[g];
            for (var j in b) i[j] = b[j];
            d += (new EJS({
                element: "ejs_user_list",
                type: "["
            })).render(i)
        }
        c += d + createUserListMore(f, a.mst) + "</ul>"
    }
    return c
}
function renderNoDataHotTopic(a, b) {
    var c;
    "hot" == b ? c = '<ul class="t_hot ht-list" >': "related" == b ? c = '<ul class="t_related cont-list">': "activities" == b && (c = '<ul class="t_activities acti-list">'),
    c += "<div class='search-result-inner'><p><strong>暂无数据，请尝试<a class=\"t_nodata_refresh\">刷新</a></strong></p></div></ul>";
    return c
}
function renderHotTopic(a, b) {
    var c = "",
    d = "",
    e = "",
    f = a.topics;
    "hot" == b ? (c = "<ul mst='" + g_mst.KEYWORD_LIST + '\' class="t_hot ht-list">', e = "ejs_hot_topic_msg") : "related" == b ? (c = "<ul mst='" + g_mst.KEYWORD_LIST + '\'  class="t_related cont-list">', e = "ejs_related_topic_msg") : "activities" == b ? (c = "<ul mst='" + g_mst.KEYWORD_LIST + '\'  class="t_activities ht-list">', e = "ejs_activities_topic_msg") : "banner" == b && (c = "<ul mst='" + g_mst.KEYWORD_LIST + '\'  class="t_banner SH_anim_comp banner_comp topic-swipe">', e = "ejs_banner_topic_msg");
    for (var g = 0, h = f.length; g < h; g++) d += (new EJS({
        element: e,
        type: "["
    })).render(f[g]);
    return c + d + "</ul>"
}
function renderTopic(a, b) {
    var c = '<ul class="timeline-list" mst="' + a.mst + '">',
    d = "",
    e = a.topics,
    f = a.mst;
    for (var g = 0, h = e.length; g < h; g++) e[g].type = f == g_mst.KEYWORD_LIST ? "keyword": "",
    e[g].renderOptions = b,
    d += (new EJS({
        element: "ejs_topic",
        type: "["
    })).render(e[g]);
    b.noResultData ? c += d + '<li class="more-link"><a href="#hot">更多</a></li></ul>': c += d + createSubscriptionMore(a.getMoreData) + "</ul>";
    return c
}
function renderPrivateMsg(a) {
    var b, c = "",
    d = a.msgs;
    if (d == undefined || d.length === 0) return "";
    for (var e = 0, f = d.length; e < f; e++) if (!d[e] || !d[e].msgId) console.log("empty msg, index: " + e);
    else {
        var g = d[e];
        g.username && g.username.length > 11 && (g.username = g.username.substring(0, 11)),
        c += (new EJS({
            element: "ejs_private_msg_detail",
            type: "["
        })).render(g)
    }
    b = '<ul class="timeline-list" mst="' + a.mst + '">' + c + createCommonMsgMore(a.getMoreData) + "</ul>";
    return b
}
function renderPrivateList(a) {
    var b, c = "",
    d = a.msgs;
    if (d == undefined || d.length === 0) return "";
    for (var e = 0, f = d.length; e < f; e++) if (!d[e] || !d[e].msgId) console.log("empty msg, index: " + e);
    else if (d[e].replyToUserName) {
        var g = d[e];
        g.replyToUserName.length > 11 && (g.replyToUserName = g.replyToUserName.substring(0, 11)),
        c += (new EJS({
            element: "ejs_private_msg",
            type: "["
        })).render(g)
    }
    b = '<ul class="timeline-list" mst="' + a.mst + '">' + c + createCommonMsgMore(a.getMoreData) + "</ul>";
    return b
}
function renderMsgFwd(a) {
    return (new EJS({
        element: "ejs_history_fwd_msg",
        type: "["
    })).render(a)
}
function renderMsgCommentList(a, b) {
    var c, d = "",
    e = a.msgs;
    if (e == undefined || e.length === 0) return "";
    for (var f = 0, g = e.length; f < g; f++) d += renderMsgFwd(e[f]);
    a.hasNext && a.getMoreData && (d += ejsCommentCreateMoreBtn(a.getMoreData));
    if (b) {
        c = '<ul class="t_fwdList t_focusable-item deletable-item" style="display: block; " mst="' + a.mst + '">' + d + "</ul>";
        return c
    }
    c = d;
    return c
}
function ejsNoSpecialFollowing() {
    var a = (new EJS({
        element: "ejs_no_special_following",
        type: "["
    })).render({});
    return a
}
function ejsNoPubSpecialFollowing() {
    var a = (new EJS({
        element: "ejs_no_pub_special_following",
        type: "["
    })).render({});
    return a
}
function ejsCommentCreateMoreBtn(a) {
    var b = (new EJS({
        element: "ejs_comment_more_button",
        type: "["
    })).render(a);
    return b
}
function createMsgSearchMore(a) {
    var b = (new EJS({
        element: "ejs_msg_search_more_button",
        type: "["
    })).render(a);
    return b
}
function ejsUserCreateMoreBtn(a) {
    var b = (new EJS({
        element: "ejs_user_list_more_button",
        type: "["
    })).render(a);
    return b
}
function createSubscriptionMore(a) {
    if (!a) return "";
    var b = (new EJS({
        element: "ejs_subscript_more_button",
        type: "["
    })).render(a);
    return b
}
function createTopicSearchMore(a) {
    if (!a) return "";
    var b = (new EJS({
        element: "ejs_topic_list_more_button",
        type: "["
    })).render(a);
    return b
}
function createUserListMore(a, b) {
    var c = "";
    a ? c = (new EJS({
        element: "ejs_user_list_more_button",
        type: "["
    })).render(a) : b == g_mst.JOINTFOLLOW ? c = '<li class="timeline-list-item wb-more t_btn-getmore"> <a>换一批</a></li>': c = "<li class='t_btn-getmore'><div class='talkfooter' ><span></span></div></li>";
    return c
}
function createNearByMsgMore(a) {
    var b = "";
    a && (b = (new EJS({
        element: "ejs_nearby_msg_more_button",
        type: "["
    })).render(a));
    return b
}
function createHotMsgMore(a) {
    var b = "";
    a && (b = (new EJS({
        element: "ejs_hot_msg_more_button",
        type: "["
    })).render(a));
    return b
}
function createCommonMsgMore(a) {
    var b = "";
    a && (b = (new EJS({
        element: "ejs_msg_more_button",
        type: "["
    })).render(a));
    return b
}
function ejsCreateTopicAction(a) {
    var b = '<div class="t_action wb-ht-pubinfo editfield-wrap"><span class="wb-ht-num">已有<span class="t_count new-tz">' + a.msgCount + "</span>条微博参与</span> ";
    a.isTopicKept ? b += ['<a class="t_auth add-dy t_follow-operation" data-iskeyword="', a.iskeyword, '" data-topic-id="', a.topicId, '" data-keyword="', a.keyword, '" data-ac="', a.iskeyword ? g_ac.AC_KEYWORD_DROP: g_ac.AC_TOPIC_DROP, '">取消订阅</a>'].join("") : b += ['<a class="t_auth add-dy t_follow-operation" data-iskeyword="', a.iskeyword, '" data-topic-id="', a.topicId, '" data-keyword="', a.keyword, '" data-ac="', a.iskeyword ? g_ac.AC_KEYWORD_KEEP: g_ac.AC_TOPIC_KEEP, '">添加订阅</a>'].join(""),
    b += "</div>";
    return b
}
function ejsCreateTopicDetailMsg(a, b) {
    b || (b = "ejs_topic_detail_message");
    var c = (new EJS({
        element: b,
        type: "["
    })).render(a);
    return c
}
function ejsCreateDetailMsg(a, b) {
    b || (b = "ejs_detail_message");
    var c = (new EJS({
        element: b,
        type: "["
    })).render(a);
    return c
}
function ejsCreateMsg(a, b) {
    b || (b = "ejs_common_msg"),
    a && a.authorImgUrl && (a.authorImgUrl = a.authorImgUrl.replace(/40$/, "50")),
    a.sourceMsg && (a.forwardCount = a.sourceMsg.forwardCount),
    a.forwardCount < 9999999 && a.forwardCount > 0 ? a.forwardCount = util.numNotation(a.forwardCount) : a.forwardCount > 9999999 ? a.forwardCount = "9,999,999+": a.forwardCount = "",
    (a.msgType == 4 || a.msgType == 5) && !nameLengthCheck(a.username, a.replyToUserName) && (a.replyToUserName = "");
    var c = (new EJS({
        element: b,
        type: "["
    })).render(a);
    return c
}
function ejsCreateFollowingConf(a) {
    var b = (new EJS({
        element: "ejs_user_following_conf",
        type: "["
    })).render(a);
    return b
}
function ejsCreateGuestFollowingUser(a) {
    var b = (new EJS({
        element: "ejs_guest_following",
        type: "["
    })).render(a);
    return b
}
function ejsCreateSpecialFollowingUser(a) {
    var b = (new EJS({
        element: "ejs_user_special_following",
        type: "["
    })).render(a);
    return b
}
function renderCommonMsgs(a) {
    var b = "",
    c = a.msgs;
    if (a.mst == g_mst.SPECIAL_MSG) {
        if (c == undefined || c.length === 0) {
            var d = (new EJS({
                element: "ejs_empty_special_following",
                type: "["
            })).render({});
            return d
        }
    } else if (a.mst == g_mst.NEARBY_MSG_LIST && a.locate && (a.locate == "-1" || a.locate == "-2" || a.locate == "-3")) return ! 1;
    b += '<ul class="t_fwdList timeline-list t_focusable"  mst="' + a.mst + '" >';
    if (c == undefined || c.length == 0) b += '<div class="search-result-inner"><p><strong>暂无数据。</strong></p></div>';
    else if (c != undefined && c.length > 0) {
        var e = a.refMsgCount;
        for (var f = 0, g = c.length; f < g; f++) c[f].isRelatedMsg = a.isRelatedMsg,
        e && (c[f].isRelatedMsg = !0, e--),
        b += ejsCreateMsg(c[f])
    }
    if (a.getMoreData) {
        var h;
        switch (parseInt(a.getMoreData.ac, 10)) {
        case g_ac.AC_TOPIC_SEARCH:
            h = createTopicSearchMore;
            break;
        case g_ac.AC_MSG_SEARCH:
            h = createMsgSearchMore;
            break;
        case g_ac.AC_HOT_MSG:
            h = createHotMsgMore;
            break;
        case g_ac.AC_NEARBYMSG:
            h = createNearByMsgMore;
            break;
        default:
            h = createCommonMsgMore
        }
        b += h(a.getMoreData)
    }
    b += "</ul>";
    return b
}
function renderRelatedMessageForTopic(a) {
    var b = '<ul class="t_relatedList timeline-list">';
    if (a == undefined || a.length == 0) b += '<div class="search-result-inner"><p><strong>暂无数据。</strong></p></div>';
    else if (a != undefined && a.length > 0) for (var c = 0, d = a.length; c < d; c++) b += ejsCreateMsg(a[c]);
    b += "</ul>";
    return b
}
function renderSpecialFollowUsers(a) {
    var b = "",
    c = a.users,
    d;
    b += '<ul class="follower-list focusable" mst="' + a.mst + '" >';
    switch (a.mst) {
    case g_mst.USER_SPECIAL_FOLLOWING:
        d = ejsCreateGuestFollowingUser;
        break;
    case g_mst.HOST_SPECIAL_FOLLOWING:
        d = ejsCreateSpecialFollowingUser;
        break;
    case g_mst.USER_FOLLOWING_CONF:
        d = ejsCreateFollowingConf;
        break;
    default:
        d = null
    }
    if (!d) return "";
    for (var e = 0, f = c.length; e < f; e++) b += d(c[e]);
    typeof a.getMoreData != "undefined" && (b += ejsUserCreateMoreBtn(a.getMoreData)),
    b += "</ul>";
    return b
}
function ejsSpecialRender(a, b) {
    switch (a) {
    case "no_pub_special_following":
        return ejsNoPubSpecialFollowing();
    case "no_special_following":
        return ejsNoSpecialFollowing();
    default:
        return ""
    }
}
function ejsRender(a, b) {
    if (a.special_render) return ejsSpecialRender(a.special_render, a);
    var c = Number(a.mst);
    switch (c) {
    case g_mst.DETAIL_ALL_MSG:
    case g_mst.DETAIL_FWD_MSG:
        return renderDetailUl(a);
    case g_mst.HOME_MSG:
    case g_mst.TIMELINE_ORIGINAL_MSG:
    case g_mst.SPECIAL_MSG:
    case g_mst.IMETION_MSG:
    case g_mst.IMETION_MSG_FOLLOWING:
    case g_mst.USER_TIMELINE:
    case g_mst.SEARCH_TOPIC_LIST:
    case g_mst.SEARCH_TOPIC_JX_LIST:
    case g_mst.SEARCH_TOPIC_ALL_LIST:
    case g_mst.IPOST_MSG:
    case g_mst.ORIGINAL_MSG:
    case g_mst.WITH_IMAGE_MSG:
    case g_mst.TIMELINE_WITH_IMAGE_MSG:
    case g_mst.FORWARD_MSG:
    case g_mst.REPLY_MSG:
    case g_mst.KEPT_MSG:
    case g_mst.SEARCH_MSG_LIST:
    case g_mst.HOT_MSG_LIST:
    case g_mst.RANDOM_MSG_LIST:
    case g_mst.NEARBY_MSG_LIST:
    case g_mst.QQ_FRIENDS_MSG:
    case g_mst.TOPIC_LIST_MYFOLLOW:
    case g_mst.FAMOUS_SAY:
    case g_mst.IMENTION_MSG_STAR:
    case g_mst.BIDIRECTION_FOLLOWS:
    case g_mst.LIST_MSG:
    case g_mst.TOPIC_LIST_GOOD:
    case g_mst.TOPIC_LIST_MYFOLLOW:
    case g_mst.TOPIC_LIST_ALL:
    case g_mst.TOPIC_DETAIL_IMAGE:
    case g_mst.TOPIC_DETAIL_NEW:
    case g_mst.TOPIC_DETAIL_ALL:
    case g_mst.TOPIC_DETAIL_DEFINE:
        return renderCommonMsgs(a);
    case g_mst.HOST_SPECIAL_FOLLOWING:
    case g_mst.USER_FOLLOWING_CONF:
        return renderSpecialFollowUsers(a);
    case g_mst.PRIVATEMSGHOME:
        return renderPrivateList(a);
    case g_mst.DIALOGHISTORY:
        return renderPrivateMsg(a);
    case g_mst.TOPIC_LIST:
    case g_mst.HOT_TOPIC_LIST:
    case g_mst.KEYWORD_LIST:
        return renderTopic(a, b);
    case g_mst.USER_FOLLOWER:
    case g_mst.USER_FOLLOWING:
    case g_mst.SEARCH_USER_LIST:
    case g_mst.FAMOUS_USER_LIST:
    case g_mst.HOT_USER_LIST:
    case g_mst.NEARBY_USER_LIST:
    case g_mst.CLOSE_FRIEND:
    case g_mst.MAYBE_KNOW:
    case g_mst.JOINTFOLLOW:
    case g_mst.USER_SPECIAL_FOLLOWING:
    case g_mst.SEARCH_USER_FOLLOWER:
    case g_mst.SEARCH_USER_FOLLOW:
        return renderUserList(a, b);
    case g_mst.RECOMMEND_FAMOUS:
        return renderRecommendList(a, b);
    case g_mst.BLACK_USER_LIST:
        return renderBlackList(a);
    case g_mst.CHANNEL:
        return renderChannel(a);
    case g_mst.CHANNEL_DETAIL:
        return renderChannelDetail(a, b);
    case g_mst.FAMOUS_INDEX:
        return renderFamous(a);
    default:
        return ""
    }
    return ""
}
function MbDetailMessage(a, b) {
    this.jObj = $(a),
    this.sourceElement = $(b),
    this.historyLoadId = "",
    this.bindAction()
}
function PrivateMessage(a) {
    this.jObj = $(a),
    this.bindAction()
}
function MbMessage(a, b, c) { ! a || (this.jObj = $(a), this.cfg = c, this.historyLoadId = "", this.bindAction())
}
function MessagePage() {}
function Page() {}
function Topic(a) {
    this.init(a),
    this.bindAction()
}
function MBUser(a, b) {
    this.initCfg = b,
    this.init(a),
    this.bindAction()
}
function Message() {}
function generateSubClass(a) {
    function b() {
        this.init(),
        this.bindAction()
    }
    b.prototype = new a,
    b.prototype.constructor = b;
    return b
}
function generatePage(a, b) {
    b = b ? b: MessagePage;
    var c = generateSubClass(b);
    PageManager.register(a, c);
    return c
}
function MessageContainer(a, b) {
    this.mst = a,
    this.pageObj = b,
    this.getMoreParam = null,
    this.getMoreData = null,
    this.refreshData = this.getRefreshData()
}
function Layer() {
    this.blackLayer = $("#t_dialog_pop")
}
function UserInfoLayer() {
    var a = this,
    b = '<div class="t_pop_info pop-userinfo" style="display:none;">    <a class="t_close_pop_info pop-userinfo-close">关闭</a><div class="wb-interact-avatar"><a onclick="" class="wb-user-headimg t_home_avatar t_listen_class" clickid="249" style="background:url(http://t1.qlogo.cn/mbloghead/default/40) no-repeat;-webkit-background-size:34px auto;"></a></div>    <div class="pop-userinfo-head">        <div class="wb-summary">            <div class="wb-user">                <strong class="t_username wb-username">...</strong>                <span class="t_vip vip"></span>                <a href="#level"><span class="t_level user-level">...</span></a>            </div>            <div class="wb-user-link">                <a href="#personal_info">个人资料</a>                <a href="#setting_entrance">设置</a>            </div>        </div>    </div>    <div class="pop-userinfo-main">        <div class="followers"><div><a style="width:100%;height:40px;display:block;" class="t_user-follower_target" href="#follower"><span>听众</span><span class="t_user-followerNum">...</span></a></div><div><a style="width:100%;height:40px;display:block;" class="t_user-following_target" href="#following"><span>收听</span><span class="t_user-followingNum">...</span></a></div><div><a style="width:100%;height:40px;display:block;" class="t_user-postNum_target" href="#mine"><span>广播</span><span class="t_user-postNum">...</span></a></div></div>        <div class="wb-member">            <div class="wb-member-tit">经验值等级</div>            <p><a href="#level">今日经验值：<em class="t_todayExp">...</em></a><a class="t_daily" href="#daily">每日任务</a></p>        </div>        <div class="wb-member">            <div class="wb-member-tit">管理</div>            <p><a href="#my_favorite">收藏</a>            <a href="#subscription">订阅</a>            <a href="#black_list">黑名单</a></p>        </div>        <div class="wb-member">            <div class="wb-member-tit">我的</div>            <p><a href="#special_following">特别收听</a>            <a href="#may_know">可能认识的人</a>            <a href="#intimate_friend">微博密友</a></p>        </div>    </div></div>';
    this.jObj = $(b),
    $("body").append(this.jObj),
    this.bindAction(),
    this.isPosting = !1
}
function PrivateLayer() {
    var a = '<div class="wb-dialog-wrap" id="privateLayer" style="display:none"><div class="wb-dialog"> <div class="wb-dialog-head"><a class="wb-dialog-close t_close" >×</a><h2 class="wb-dialog-title">发私信</h2></div><div class="wb-dialog-cont"><div class="choose-user"><label for="">收信人：</label><input type="text" class="wb-text-input"><a class="more-user-link t_list">选择用户</a></div><div class="wb-input-area"><div class="wb-textarea"> <textarea></textarea> </div> </div><div class="wb-dialog-bar"><a class="ico-bq current t_facebtn"></a><a class="t_clear">清空</a><span class="wb-dialog-num t_num">140</span><a class="btn send-btn t_send">发送</a></div><div class="wb-info t_last" style="display:none"></div></div></div>';
    this.jObj = $(a),
    $("body").append(this.jObj),
    this.wrapper = this.jObj[0],
    this.last = this.jObj.find(".t_last"),
    this.listBtn = this.jObj.find(".t_list"),
    this.faceBtn = this.jObj.find(".t_facebtn"),
    this.userInput = this.wrapper.querySelector("input"),
    this.textarea = this.wrapper.querySelector("textarea"),
    this.disNum = this.wrapper.querySelector(".t_num"),
    this.clearBtn = this.wrapper.querySelector(".t_clear"),
    this.closeBtn = this.wrapper.querySelector(".t_close"),
    this.postBtn = this.wrapper.querySelector(".t_send"),
    this.bindAction()
}
function WritePopLayer() {
    this.jObj = $('<div id="writeoperation" class="wb-dialog-wrap" style="display:none"> <div class="wb-dialog"> <div class="wb-dialog-head"> <a  class="wb-dialog-close" action-data=\'close\'>×</a> <h2 class="wb-dialog-title t_wirte_wb-dialog-title"></h2> </div> <div class="wb-dialog-cont"> <div class="wb-input-area"> <div class="wb-textarea"> <textarea id="t_wirte_textarea"></textarea> </div> </div> <div class="wb-dialog-bar"> <a  class="ico-bq t_writepop_ico-bq"></a> <a  class="ico-at t_writepop_ico-at"></a> <a class="t_writepop_clear">清空</a> <span class="wb-dialog-num t_wirte_wb-dialog-num">140</span> <a  class="btn send-btn t_wirte_send-btn">转播</a> </div> <div class="wb-info t_wirte_wb-info"></div> </div> </div> </div>'),
    $("body").append(this.jObj),
    this.writeTextArea = this.jObj.find("#t_wirte_textarea")[0],
    this.numTip = this.jObj.find("span.t_wirte_wb-dialog-num")[0],
    this.writeParams = null,
    this.page = null,
    this.atPage = null,
    this.facePage = null,
    this.isPosting = !1
}
function PicMorePopLayer() {
    this.jObj = $('<div id="picmoreoperation" class="wb-dialog-wrap" style="display:none;"> <div class="wb-dialog"> <div class="wb-dialog-head"> <a  class="wb-dialog-close" action-data=\'close\'>×</a> <h2 class="wb-dialog-title">更多操作</h2> </div> <div class="wb-dialog-list"> <a  class="t_modify_pic" >更改图片</a> <a  class="t_delete_pic">删除</a> </div> </div> </div>'),
    $("body").append(this.jObj)
}
function MorePopLayer() {
    var a = this,
    b = '<div id="moreoperation" class="wb-dialog-wrap" style="display:none;"> <div class="wb-dialog"><div class="wb-dialog-head"><a  class="wb-dialog-close" action-data="close">×</a> <h2 class="wb-dialog-title">更多</h2></div><div class="wb-dialog-list t_wb-dialog-list"> </div></div></div>';
    this.jObj = $(b),
    $("body").append(this.jObj)
}
function ShareLayer() {
    var a = this,
    b = '<div id="shareopration" class="wb-dialog-wrap" style="display:none;"><div class="wb-dialog wb-dialog-share"><div class="wb-dialog-head"><a class="wb-dialog-close" action-data="close">×</a><h2 class="wb-dialog-title">分享到腾讯微博</h2></div><div class="wb-dialog-cont"><div class="wb-input-area"><div class="wb-textarea"><textarea id="t_wirte_textarea"></textarea></div>\t</div><div class="wb-dialog-bar"><a class="t_writepop_clear">清空</a><span class="wb-dialog-num t_wirte_wb-dialog-num">140</span><a class="btn send-btn t_wirte_send-btn">发布</a></div></div></div></div>';
    this.jObj = $(b),
    $("body").append(this.jObj),
    this.writeTextArea = this.jObj.find("#t_wirte_textarea")[0],
    this.numTip = this.jObj.find("span.t_wirte_wb-dialog-num")[0],
    this.isPosting = !1
}
function MessageLayer() {
    var a = this,
    b = '<div id="shareopration" class="wb-dialog-wrap" style="display:none;"><div class="wb-dialog wb-dialog-share"><div class="wb-dialog-head"><a class="wb-dialog-close" action-data="close">×</a><h2 class="wb-dialog-title">腾讯微博</h2></div><div class="wb-dialog-cont"><div class="wb-input-area"><p id="t_msg_content"></p></div><div class="wb-dialog-bar"><a class="btn send-btn t_go_superqq">前往超Q官网</a><a class="btn send-btn t_cancel">取消</a></div></div></div></div>';
    this.jObj = $(b),
    $("body").append(this.jObj)
}
function noReferer(a, b) {
    var c = window.location.pathname,
    d = c.replace(/\w+\.jsp/, "noreferer.html");
    if (b.indexOf("qq.com") != -1 || b[0] == "#") window.location.assign(b);
    else {
        var e = window.location.protocol + "//" + window.location.hostname + d + "?" + encodeURIComponent(b);
        window.open(e, "_blank")
    }
}
function imgLoader(a, b) {
    var b = b || "img",
    c = a.find(b);
    if (typeof g_from_android != "undefined" && g_from_android) {
        var d = c.length,
        e = 0,
        f = (new Date).getTime(),
        g = function() {
            if (!c[e].getAttribute("data-src")) e++,
            g();
            else {
                c[e].src = c[e].getAttribute("data-src"),
                e++;
                if (e == d) return;
                var a = new Image;
                f = (new Date).getTime(),
                a.src = c[e].getAttribute("data-src"),
                a.onload = g,
                a.onerror = g,
                a.onabort = g
            }
        };
        d > 0 && g()
    } else c.each(function(a, b) {
        var c = new Image;
        c.src = b.getAttribute("data-src"),
        c.onload = function() {
            b.src = c.src
        }
    })
}
function geoRequestAddr(a) {
    var b = $.ajax({
        url: g_action,
        data: {
            ac: g_ac.AC_LBS_QUERY_ADDR_TEXT,
            latitude: a.latitude,
            longitude: a.longitude
        },
        async: !1
    }).responseText,
    c = $.parseJSON(b);
    return $.trim(c.msg)
}
function filterContent(a, b) {
    var c = "<p>" + a + "</p>",
    d = "",
    e = b;
    $(c).contents().each(function(a, b) {
        if (e > 0) {
            var c = $(b);
            b.localName != "a" ? d += c.text().substr(0, e) : d += '<a href="' + c.attr("href") + '">' + c.text().substr(0, e) + "</a>",
            e -= c.text().length
        }
    });
    return d
}
function countTotal(a) {
    var b = "<p>" + a + "</p>",
    c = 0;
    $(b).contents().each(function(a, b) {
        c += $(b).text().length
    });
    return c
}
function hideURLbar() {
    setTimeout(scrollTo, 100, 0, 37)
}
function onGetMore() {
    return
}
function doSearchTopics(a) {
    location.hash = "#detailTopic/keyword=" + encodeURIComponent(a)
}
function showPersonIndex(a) {
    location.hash = "#guest_home/u=" + a
}
function tStrLength(a) {
    var b = 0;
    for (var c = a.length; c--;) a.charCodeAt(c) > 128 ? b += 1 : b += .5;
    return Math.ceil(b)
}
function Canvas(a, b) {
    return
}
function LocalStorageObj() {
    this.set = function(a, b) {
        var c = util.isArray(b) || util.isObject(b) ? util.jsonStringfy(b) : b;
        try {
            localStorage.setItem(a, c)
        } catch(d) {
            return ! 1
        }
    },
    this.get = function(a) {
        var b;
        try {
            b = util.parseJSON(localStorage.getItem(a))
        } catch(c) {
            b = undefined
        }
        return b
    },
    this.remove = function(a) {
        if ("localStorage" in window) try {
            return localStorage.removeItem(a)
        } catch(b) {}
    };
    return this
}
function CookieObj() {
    this.path = "/",
    this.domain = ".3g.qq.com",
    this.days = 30,
    this.set = function(a, b) {
        var c = new Date;
        c.setTime(c.getTime() + this.days * 24 * 60 * 60 * 1e3);
        var d = "";
        d += a + "=" + escape(b),
        d += ";expires=" + c.toGMTString(),
        this.path != "" && (d += ";path=" + this.path),
        this.domain != "" && (d += ";domain=" + this.domain),
        d += ";",
        document.cookie = d
    },
    this.setExpiresCookie = function(a, b, c) {
        var d = new Date;
        d.setTime(d.getTime() + c * 1e3);
        var e = "";
        e += a + "=" + escape(b),
        e += ";expires=" + d.toGMTString(),
        this.path != "" && (e += ";path=" + this.path),
        this.domain != "" && (e += ";domain=" + this.domain),
        e += ";",
        document.cookie = e
    },
    this.get = function(a) {
        var b = document.cookie.match(new RegExp("(^| )" + a + "=([^;]*)(;|$)"));
        return b != null ? unescape(b[2]) : null
    },
    this.del = function(a) {
        var b = new Date;
        b.setTime(b.getTime() - 1);
        var c = "";
        c += a + "=",
        c += ";expires=" + b.toGMTString(),
        this.path != "" && (c += ";path=" + this.path),
        this.domain != "" && (c += ";domain=" + this.domain),
        c += ";",
        document.cookie = c
    };
    return this
}
if (!window.jq || typeof jq != "function") {
    var jq = function(a) {
        function J(a) {
            var b = q.extend({
                originalEvent: a
            },
            a);
            q.each(I,
            function(c, d) {
                b[c] = function() {
                    this[d] = G;
                    return a[c].apply(a, arguments)
                },
                b[d] = H
            });
            return b
        }
        function F(a, b, c, d) {
            var e = z(a);
            D(b || "", c,
            function(b, c) {
                A(a, b, c, d).forEach(function(b) {
                    delete w[e][b.i],
                    a.removeEventListener(b.e, b.proxy, !1)
                })
            })
        }
        function E(a, b, c, d, e) {
            var f = z(a),
            g = w[f] || (w[f] = []);
            D(b, c,
            function(b, c) {
                var f = e && e(c, b),
                h = f || c,
                i = function(b) {
                    var c = h.apply(a, [b].concat(b.data));
                    c === !1 && b.preventDefault();
                    return c
                },
                j = q.extend(B(b), {
                    fn: c,
                    proxy: i,
                    sel: d,
                    del: f,
                    i: g.length
                });
                g.push(j),
                a.addEventListener(j.e, i, !1)
            })
        }
        function D(a, b, c) {
            q.isObject(a) ? q.each(a, c) : a.split(/\s/).forEach(function(a) {
                c(a, b)
            })
        }
        function C(a) {
            return new RegExp("(?:^| )" + a.replace(" ", " .* ?") + "(?: |$)")
        }
        function B(a) {
            var b = ("" + a).split(".");
            return {
                e: b[0],
                ns: b.slice(1).sort().join(" ")
            }
        }
        function A(a, b, c, d) {
            b = B(b);
            if (b.ns) var e = C(b.ns);
            return (w[z(a)] || []).filter(function(a) {
                return a && (!b.e || a.e == b.e) && (!b.ns || e.test(a.ns)) && (!c || a.fn == c || typeof a.fn == "function" && typeof c == "function" && "" + a.fn == "" + c) && (!d || a.sel == d)
            })
        }
        function z(a) {
            return a._jqmid || (a._jqmid = x++)
        }
        function u(a, b) {
            a.os = {},
            a.os.webkit = b.match(/WebKit\/([\d.]+)/) ? !0 : !1,
            a.os.android = b.match(/(Android)\s+([\d.]+)/) || b.match(/Silk-Accelerated/) ? !0 : !1,
            a.os.ipad = b.match(/(iPad).*OS\s([\d_]+)/) ? !0 : !1,
            a.os.iphone = !a.os.ipad && b.match(/(iPhone\sOS)\s([\d_]+)/) ? !0 : !1,
            a.os.webos = b.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? !0 : !1,
            a.os.touchpad = a.os.webos && b.match(/TouchPad/) ? !0 : !1,
            a.os.ios = a.os.ipad || a.os.iphone,
            a.os.blackberry = b.match(/BlackBerry/) || b.match(/PlayBook/) ? !0 : !1,
            a.os.opera = b.match(/Opera Mobi/) ? !0 : !1,
            a.os.fennec = b.match(/fennec/i) ? !0 : !1,
            a.os.desktop = !(a.os.ios || a.os.android || a.os.blackberry || a.os.opera || a.os.fennec)
        }
        function s() {}
        function r(a, b) {
            var d;
            try {
                a = a.trim();
                if (a[0] === "#" && a.indexOf(" ") === -1 && a.indexOf(">") === -1) b == c ? d = b.getElementById(a.replace("#", "")) : d = [].slice.call(b.querySelectorAll(a));
                else if (a[0] === "<" && a[a.length - 1] === ">") {
                    var e = c.createElement("div");
                    e.innerHTML = a.trim(),
                    d = [].slice.call(e.childNodes)
                } else d = [].slice.call(b.querySelectorAll(a))
            } catch(f) {}
            return d
        }
        function o(a, c) {
            var d = [];
            if (a == b) return d;
            for (; a; a = a.nextSibling) a.nodeType == 1 && a !== c && d.push(a);
            return d
        }
        function n(a) {
            for (var b = 0; b < a.length; b++) a.indexOf(a[b]) != b && (a.splice(b, 1), b--);
            return a
        }
        function m(a) {
            return a in f ? f[a] : f[a] = new RegExp("(^|\\s)" + a + "(\\s|$)")
        }
        "use strict";
        var b, c = a.document,
        d = [],
        e = d.slice,
        f = [],
        g = [],
        h = 1,
        i = [],
        j = 1,
        k = /^\s*<(\w+)[^>]*>/,
        l = {},
        p = function(a, d) {
            this.length = 0;
            if (!a) return this;
            if (a instanceof p && d == b) return a;
            if (q.isFunction(a)) return q(c).ready(a);
            if (q.isArray(a) && a.length != b) {
                for (var e = 0; e < a.length; e++) this[this.length++] = a[e];
                return this
            }
            if (q.isObject(a) && q.isObject(d)) {
                if (a.length == b) a.parentNode == d && (this[this.length++] = a);
                else for (var e = 0; e < a.length; e++) a[e].parentNode == d && (this[this.length++] = a[e]);
                return this
            }
            if (q.isObject(a) && d == b) {
                this[this.length++] = a;
                return this
            }
            if (d !== b) {
                if (d instanceof p) return d.find(a)
            } else d = c;
            var f = this.selector(a, d);
            if (!f) return this;
            if (!q.isArray(f)) {
                this[this.length++] = f;
                return this
            }
            for (var g = 0; g < f.length; g++) this[this.length++] = f[g];
            return this
        },
        q = function(a, b) {
            return new p(a, b)
        };
        q.map = function(a, c) {
            var d, e = [],
            f,
            g;
            if (q.isArray(a)) for (f = 0; f < a.length; f++) d = c(a[f], f),
            d !== b && e.push(d);
            else if (q.isObject(a)) for (g in a) {
                if (!a.hasOwnProperty(g)) continue;
                d = c(a[g], g),
                d !== b && e.push(d)
            }
            return q([e])
        },
        q.each = function(a, b) {
            var c, d;
            if (q.isArray(a)) {
                for (c = 0; c < a.length; c++) if (b(c, a[c]) === !1) return a
            } else if (q.isObject(a)) for (d in a) {
                if (!a.hasOwnProperty(d)) continue;
                if (b(d, a[d]) === !1) return a
            }
            return a
        },
        q.extend = function(a) {
            a == b && (a = this);
            if (arguments.length === 1) {
                for (var c in a) this[c] = a[c];
                return this
            }
            e.call(arguments, 1).forEach(function(b) {
                for (var c in b) a[c] = b[c]
            });
            return a
        },
        q.isArray = function(a) {
            return a instanceof Array && a.push != b
        },
        q.isFunction = function(a) {
            return {}.toString.call(a) == "[object Function]"
        },
        q.isObject = function(a) {
            return typeof a == "object"
        },
        q.fn = p.prototype = {
            constructor: p,
            forEach: d.forEach,
            reduce: d.reduce,
            push: d.push,
            indexOf: d.indexOf,
            concat: d.concat,
            selector: r,
            oldElement: b,
            slice: d.slice,
            setupOld: function(a) {
                if (a == b) return q();
                a.oldElement = this;
                return a
            },
            map: function(a) {
                return q.map(this,
                function(b, c) {
                    return a.call(b, c, b)
                })
            },
            each: function(a) {
                this.forEach(function(b, c) {
                    a.call(b, c, b)
                });
                return this
            },
            ready: function(a) { (c.readyState === "complete" || c.readyState === "loaded") && a(),
                c.addEventListener("DOMContentLoaded", a, !1);
                return this
            },
            find: function(a) {
                if (this.length === 0) return q([]);
                var b = [],
                c;
                for (var d = 0; d < this.length; d++) {
                    c = q(a, this[d]);
                    for (var e = 0; e < c.length; e++) b.push(c[e])
                }
                return q(n(b))
            },
            html: function(a) {
                if (this.length === 0) return b;
                if (a === b) return this[0].innerHTML;
                for (var c = 0; c < this.length; c++) this[c].innerHTML = a;
                return this
            },
            text: function(a) {
                if (this.length === 0) return b;
                if (a === b) return this[0].textContent;
                for (var c = 0; c < this.length; c++) this[c].textContent = a;
                return this
            },
            css: function(c, d, e) {
                var f = e != b ? e: this[0];
                if (this.length === 0) return this;
                if (d == b && typeof c == "string") {
                    var g = a.getComputedStyle(f);
                    return f.style[c] ? f.style[c] : a.getComputedStyle(f)[c]
                }
                for (var h = 0; h < this.length; h++) if (q.isObject(c)) for (var i in c) this[h].style[i] = c[i];
                else this[h].style[c] = d;
                return this
            },
            empty: function() {
                for (var a = 0; a < this.length; a++) this[a].innerHTML = "";
                return this
            },
            hide: function() {
                if (this.length === 0) return this;
                for (var a = 0; a < this.length; a++) this.css("display", null, this[a]) != "none" && (this[a].setAttribute("jqmOldStyle", this.css("display", null, this[a])), this[a].style.display = "none");
                return this
            },
            show: function() {
                if (this.length === 0) return this;
                for (var a = 0; a < this.length; a++) this.css("display", null, this[a]) == "none" && (this[a].style.display = this[a].getAttribute("jqmOldStyle") ? this[a].getAttribute("jqmOldStyle") : "block", this[a].removeAttribute("jqmOldStyle"));
                return this
            },
            toggle: function(c) {
                var d = c === !0 ? !0 : !1;
                for (var e = 0; e < this.length; e++) a.getComputedStyle(this[e]).display !== "none" || c !== b && d === !1 ? (this[e].setAttribute("jqmOldStyle", this[e].style.display), this[e].style.display = "none") : (this[e].style.display = this[e].getAttribute("jqmOldStyle") != b ? this[e].getAttribute("jqmOldStyle") : "block", this[e].removeAttribute("jqmOldStyle"));
                return this
            },
            val: function(a) {
                if (this.length === 0) return b;
                if (a == b) return this[0].value;
                for (var c = 0; c < this.length; c++) this[c].value = a;
                return this
            },
            attr: function(a, c) {
                if (this.length === 0) return b;
                if (c === b && !q.isObject(a)) {
                    var d = this[0].jqmCacheId && l[this[0].jqmCacheId][a] ? this[0].jqmCacheId && l[this[0].jqmCacheId][a] : this[0].getAttribute(a);
                    return d
                }
                for (var e = 0; e < this.length; e++) if (q.isObject(a)) for (var f in a) q(this[e]).attr(f, a[f]);
                else q.isArray(c) || q.isObject(c) || q.isFunction(c) ? (this[e].jqmCacheId || (this[e].jqmCacheId = q.uuid()), l[this[e].jqmCacheId] || (l[this[e].jqmCacheId] = {}), l[this[e].jqmCacheId][a] = c) : c == null && c !== b ? (this[e].removeAttribute(a), this[e].jqmCacheId && l[this[e].jqmCacheId][a] && delete l[this[e].jqmCacheId][a]) : this[e].setAttribute(a, c);
                return this
            },
            removeAttr: function(a) {
                var b = this;
                for (var c = 0; c < this.length; c++) a.split(/\s+/g).forEach(function(d) {
                    b[c].removeAttribute(d),
                    b[c].jqmCacheId && l[b[c].jqmCacheId][a] && delete l[b[c].jqmCacheId][a]
                });
                return this
            },
            remove: function(a) {
                var c = q(this).filter(a);
                if (c == b) return this;
                for (var d = 0; d < c.length; d++) c[d].parentNode && c[d].parentNode.removeChild(c[d]);
                return this
            },
            addClass: function(a) {
                for (var b = 0; b < this.length; b++) {
                    var c = this[b].className,
                    d = [],
                    e = this;
                    a.split(/\s+/g).forEach(function(a) {
                        e.hasClass(a, e[b]) || d.push(a)
                    }),
                    this[b].className += (c ? " ": "") + d.join(" "),
                    this[b].className = this[b].className.trim()
                }
                return this
            },
            removeClass: function(a) {
                for (var c = 0; c < this.length; c++) {
                    if (a == b) {
                        this[c].className = "";
                        return this
                    }
                    var d = this[c].className;
                    a.split(/\s+/g).forEach(function(a) {
                        d = d.replace(m(a), " ")
                    }),
                    d.length > 0 ? this[c].className = d.trim() : this[c].className = ""
                }
                return this
            },
            hasClass: function(a, b) {
                if (this.length === 0) return ! 1;
                b || (b = this[0]);
                return m(a).test(b.className)
            },
            append: function(d, e) {
                if (d && d.length != b && d.length === 0) return this;
                if (q.isArray(d) || q.isObject(d)) d = q(d);
                var f;
                for (f = 0; f < this.length; f++) if (d.length && typeof d != "string") {
                    d = q(d);
                    for (var g = 0; g < d.length; g++) e != b ? this[f].insertBefore(d[g], this[f].firstChild) : this[f].appendChild(d[g])
                } else {
                    var h = k.test(d) ? q(d) : b;
                    if (h == b || h.length == 0) h = c.createTextNode(d);
                    if (h.nodeName == b || h.nodeName.toLowerCase() != "script" || !!h.type && h.type.toLowerCase() !== "text/javascript") if (h instanceof p) for (var i = 0; i < h.length; i++) e != b ? this[f].insertBefore(h[i], this[f].firstChild) : this[f].appendChild(h[i]);
                    else e != b ? this[f].insertBefore(h, this[f].firstChild) : this[f].appendChild(h);
                    else a.eval(h.innerHTML)
                }
                return this
            },
            prepend: function(a) {
                return this.append(a, 1)
            },
            insertBefore: function(a, b) {
                if (this.length == 0) return this;
                a = q(a).get(0);
                if (!a || a.length == 0) return this;
                for (var c = 0; c < this.length; c++) b ? a.parentNode.insertBefore(this[c], a.nextSibling) : a.parentNode.insertBefore(this[c], a);
                return this
            },
            insertAfter: function(a) {
                this.insertBefore(a, !0)
            },
            get: function(a) {
                a = a == b ? 0 : a,
                a < 0 && (a += this.length);
                return this[a] ? this[a] : b
            },
            offset: function() {
                if (this.length === 0) return b;
                var c = this[0].getBoundingClientRect();
                return {
                    left: c.left + a.pageXOffset,
                    top: c.top + a.pageYOffset,
                    width: parseInt(this[0].style.width),
                    height: parseInt(this[0].style.height)
                }
            },
            parent: function(a) {
                if (this.length == 0) return b;
                var c = [];
                for (var d = 0; d < this.length; d++) this[d].parentNode && c.push(this[d].parentNode);
                return this.setupOld(q(n(c)).filter(a))
            },
            children: function(a) {
                if (this.length == 0) return this;
                var b = [];
                for (var c = 0; c < this.length; c++) b = b.concat(o(this[c].firstChild));
                return this.setupOld(q(b).filter(a))
            },
            siblings: function(a) {
                if (this.length == 0) return b;
                var c = [];
                for (var d = 0; d < this.length; d++) this[d].parentNode && (c = c.concat(o(this[d].parentNode.firstChild, this[d])));
                return this.setupOld(q(c).filter(a))
            },
            closest: function(a, d) {
                if (this.length == 0) return b;
                var e = [],
                f = this[0],
                g = q(a, d);
                if (g.length == 0) return q();
                while (f && g.indexOf(f) == -1) f = f !== d && f !== c && f.parentNode;
                return q(f)
            },
            filter: function(a) {
                if (this.length == 0) return b;
                if (a == b) return this;
                var c = [];
                for (var d = 0; d < this.length; d++) {
                    var e = this[d];
                    e.parentNode && q(a, e.parentNode).indexOf(e) >= 0 && c.push(e)
                }
                return this.setupOld(q(n(c)))
            },
            not: function(a) {
                if (this.length == 0) return q([]);
                var b = [];
                for (var c = 0; c < this.length; c++) {
                    var d = this[c];
                    d.parentNode && q(a, d.parentNode).indexOf(d) == -1 && b.push(d)
                }
                return this.setupOld(q(n(b)))
            },
            data: function(a, b) {
                return this.attr("data-" + a, b)
            },
            end: function() {
                return this.oldElement != b ? this.oldElement: q()
            },
            clone: function(a) {
                a = a === !1 ? !1 : !0;
                if (this.length == 0) return b;
                var c = [];
                for (var d = 0; d < this.length; d++) c.push(this[d].cloneNode(a));
                return q(c)
            },
            size: function() {
                return this.length
            },
            serialize: function(a) {
                if (this.length == 0) return "";
                var b = {};
                for (var c = 0; c < this.length; c++) this.slice.call(this[c].elements).forEach(function(a) {
                    var c = a.getAttribute("type");
                    a.nodeName.toLowerCase() != "fieldset" && !a.disabled && c != "submit" && c != "reset" && c != "button" && (c != "radio" && c != "checkbox" || a.checked) && (b[a.getAttribute("name")] = a.value)
                });
                return q.param(b, a)
            }
        };
        var t = {
            type: "GET",
            beforeSend: s,
            success: s,
            error: s,
            complete: s,
            context: b,
            timeout: 0,
            crossDomain: !1
        };
        q.jsonP = function(b) {
            var d = "jsonp_callback" + ++j,
            e = "",
            f, g = c.createElement("script"),
            h = function() {
                q(g).remove(),
                a[d] && (a[d] = s)
            };
            a[d] = function(c) {
                clearTimeout(e),
                q(g).remove(),
                delete a[d],
                b.success.call(f, c)
            },
            g.src = b.url.replace(/=\?/, "=" + d),
            b.error && (g.onerror = function() {
                clearTimeout(e),
                b.error.call(f, "", "error")
            }),
            q("head").append(g),
            b.timeout > 0 && (e = setTimeout(function() {
                b.error.call(f, "", "timeout")
            },
            b.timeout));
            return {}
        },
        q.ajax = function(b) {
            var c;
            try {
                c = new a.XMLHttpRequest;
                var d = b || {};
                for (var e in t) d[e] || (d[e] = t[e]);
                d.url || (d.url = a.location),
                d.contentType || (d.contentType = "application/x-www-form-urlencoded"),
                d.headers || (d.headers = {});
                if (!d.dataType) d.dataType = "text/html";
                else switch (d.dataType) {
                case "script":
                    d.dataType = "text/javascript, application/javascript";
                    break;
                case "json":
                    d.dataType = "application/json";
                    break;
                case "xml":
                    d.dataType = "application/xml, text/xml";
                    break;
                case "html":
                    d.dataType = "text/html";
                    break;
                case "text":
                    d.dataType = "text/plain";
                    break;
                default:
                    d.dataType = "text/html";
                    break;
                case "jsonp":
                    return q.jsonP(b)
                }
                q.isObject(d.data) && (d.data = q.param(d.data)),
                d.type.toLowerCase() === "get" && d.data && (d.url.indexOf("?") === -1 ? d.url += "?" + d.data: d.url += "&" + d.data);
                if (/=\?/.test(d.url)) return q.jsonP(d);
                d.crossDomain || (d.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(d.url) && RegExp.$2 != a.location.host),
                d.crossDomain || (d.headers = q.extend({
                    "X-Requested-With": "XMLHttpRequest"
                },
                d.headers));
                var f, g = d.context,
                h = /^([\w-]+:)\/\//.test(d.url) ? RegExp.$1: a.location.protocol;
                c.onreadystatechange = function() {
                    var a = d.dataType;
                    if (c.readyState === 4) {
                        clearTimeout(f);
                        var b, e = !1;
                        if (c.status >= 200 && c.status < 300 || c.status === 0 && h == "file:") {
                            if (a === "application/json" && !/^\s*$/.test(c.responseText)) try {
                                b = JSON.parse(c.responseText)
                            } catch(i) {
                                e = i
                            } else b = c.responseText;
                            c.status === 0 && b.length === 0 && (e = !0),
                            e ? d.error.call(g, c, "parsererror", e) : d.success.call(g, b, "success", c)
                        } else e = !0,
                        d.error.call(g, c, "error");
                        d.complete.call(g, c, e ? "error": "success"),
                        c.onreadystatechange = function() {}
                    }
                },
                c.open(d.type, d.url, !0),
                d.contentType && (d.headers["Content-Type"] = d.contentType);
                for (var i in d.headers) c.setRequestHeader(i, d.headers[i]);
                if (d.beforeSend.call(g, c, d) === !1) {
                    c.abort();
                    return ! 1
                }
                d.timeout > 0 && (f = setTimeout(function() {
                    c.onreadystatechange = s,
                    c.abort(),
                    d.error.call(g, c, "timeout")
                },
                d.timeout)),
                c.send(d.data)
            } catch(j) {
                console.log(j)
            }
            return c
        },
        q.get = function(a, b) {
            return this.ajax({
                url: a,
                success: b
            })
        },
        q.post = function(a, c, d, e) {
            typeof c == "function" && (d = c, c = {}),
            e === b && (e = "html");
            return this.ajax({
                url: a,
                type: "POST",
                data: c,
                dataType: e,
                success: d
            })
        },
        q.getJSON = function(a, b, c) {
            typeof b == "function" && (c = b, b = {});
            return this.ajax({
                url: a,
                data: b,
                success: c,
                dataType: "json"
            })
        },
        q.param = function(a, b) {
            var c = [];
            if (a instanceof p) a.each(function() {
                var a = b ? b + "[]": this.id,
                d = this.value;
                c.push(a + "=" + encodeURIComponent(d))
            });
            else for (var d in a) {
                var e = b ? b + "[" + d + "]": d,
                f = a[d];
                c.push(q.isObject(f) ? q.param(f, e) : e + "=" + encodeURIComponent(f))
            }
            return c.join("&")
        },
        q.parseJSON = function(a) {
            return JSON.parse(a)
        },
        q.parseXML = function(a) {
            return (new DOMParser).parseFromString(a, "text/xml")
        },
        u(q, navigator.userAgent),
        q.__detectUA = u,
        typeof String.prototype.trim != "function" && (String.prototype.trim = function() {
            this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/, "");
            return this
        }),
        q.uuid = function() {
            var a = function() {
                return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1)
            };
            return a() + a() + "-" + a() + "-" + a() + "-" + a() + "-" + a() + a() + a()
        };
        var v = q.qsa,
        w = {},
        x = 1,
        y = {};
        q.event = {
            add: E,
            remove: F
        },
        q.fn.bind = function(a, b) {
            for (var c = 0; c < this.length; c++) E(this[c], a, b);
            return this
        },
        q.fn.unbind = function(a, b) {
            for (var c = 0; c < this.length; c++) F(this[c], a, b);
            return this
        },
        q.fn.one = function(a, b) {
            return this.each(function(c, d) {
                E(this, a, b, null,
                function(a, b) {
                    return function() {
                        var c = a.apply(d, arguments);
                        F(d, b, a);
                        return c
                    }
                })
            })
        };
        var G = function() {
            return ! 0
        },
        H = function() {
            return ! 1
        },
        I = {
            preventDefault: "isDefaultPrevented",
            stopImmediatePropagation: "isImmediatePropagationStopped",
            stopPropagation: "isPropagationStopped"
        };
        q.fn.delegate = function(a, b, c) {
            for (var d = 0; d < this.length; d++) {
                var e = this[d];
                E(e, b, c, a,
                function(b) {
                    return function(c) {
                        var d, f = q(c.target).closest(a, e).get(0);
                        if (f) {
                            d = q.extend(J(c), {
                                currentTarget: f,
                                liveFired: e
                            });
                            return b.apply(f, [d].concat([].slice.call(arguments, 1)))
                        }
                    }
                })
            }
            return this
        },
        q.fn.undelegate = function(a, b, c) {
            for (var d = 0; d < this.length; d++) F(this[d], b, c, a);
            return this
        },
        q.fn.on = function(a, c, d) {
            return c === b || q.isFunction(c) ? this.bind(a, c) : this.delegate(c, a, d)
        },
        q.fn.off = function(a, c, d) {
            return c === b || q.isFunction(c) ? this.unbind(a, c) : this.undelegate(c, a, d)
        },
        q.fn.trigger = function(a, b) {
            typeof a == "string" && (a = q.Event(a)),
            a.data = b;
            for (var c = 0; c < this.length; c++) this[c].dispatchEvent(a);
            return this
        },
        q.Event = function(a, b) {
            var d = c.createEvent(y[a] || "Events"),
            e = !0;
            if (b) for (var f in b) f == "bubbles" ? e = !!b[f] : d[f] = b[f];
            d.initEvent(a, e, !0, null, null, null, null, null, null, null, null, null, null, null, null);
            return d
        },
        q.proxy = function(a, b) {
            var c = function(c) {
                return a.call(b, c)
            };
            return c
        };
        return q
    } (window);
    "$" in window || (window.$ = jq),
    window.numOnly || (window.numOnly = function(a) {
        isNaN(parseFloat(a)) && (a = a.replace(/[^0-9.-]/, ""));
        return parseFloat(a)
    })
} (function(a, b) {
    function C(a) {
        return a.length > 0 ? [].concat.apply([], a) : a
    }
    function B(a) {
        return typeof a.length == "number"
    }
    function A(c, d) {
        return d === b ? a(c) : a(c).filter(d)
    }
    function z(a) {
        var b, d;
        y[a] || (b = c.createElement(a), c.body.appendChild(b), d = getComputedStyle(b, "").getPropertyValue("display"), b.parentNode.removeChild(b), d == "none" && (d = "block"), y[a] = d);
        return y[a]
    }
    function x(b) {
        var c, d = a('<div style="visible:hidden; position:absolute;"></div>');
        a("body").append(d),
        b.css("visibility", "hidden"),
        b.show(),
        c = b[0].getBoundingClientRect(),
        b.hide(),
        b.css("visibility", "visible"),
        d.remove();
        return {
            height: c.height,
            width: c.width
        }
    }
    function w(b, c, d, e) {
        return a.isFunction(c) ? c.call(b, d, e) : c
    }
    function v() {
        var a, b = c.createElement("div"),
        e = c.createElement("div"),
        f = "@media (-webkit-transform-3d){#zeptotest{left:9px;position:absolute}}",
        g = ["&shy;", "<style>", f, "</style>"].join("");
        b.innerHTML += g,
        e.id = "zeptotest",
        b.appendChild(e),
        d.appendChild(b),
        a = e.offsetLeft === 9,
        b.parentNode.removeChild(b);
        return a
    }
    function u(a) {
        a.css({
            visibility: "hidden",
            height: ""
        }),
        a.show(),
        a.originHeight = a.height(),
        a.css("visibility", "visible");
        return a.originHeight
    }
    function t(b, c, d, e) {
        return s(b, c, 0, d,
        function() {
            f.call(a(this)),
            e && e.call(this)
        })
    }
    function s(c, d, e, f, g) {
        typeof d == "function" && !g && (g = d, d = b);
        var h = {
            opacity: e
        };
        f && (a.fx.transforms3d ? h.scale3d = f + ",1": h.scale = f, c.css(a.fx.cssPrefix + "transform-origin", "0 0"));
        return c.anim(h, r(d) / 1e3, null, g)
    }
    function r(a) {
        return typeof a == "number" ? a: h[a] || h._default
    }
    function q(a) {
        return j ? j + a: p(a)
    }
    function p(a) {
        return a.toLowerCase()
    }
    var c = window.document,
    d = c.documentElement,
    e = a.fn.show,
    f = a.fn.hide,
    g = a.fn.toggle,
    h = {
        _default: 400,
        fast: 200,
        slow: 600
    },
    i = "",
    j,
    k,
    l,
    m = {
        Webkit: "webkit",
        Moz: "",
        O: "o",
        ms: "MS"
    },
    c = window.document,
    n = c.createElement("div"),
    o = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
    a.each(m,
    function(a, c) {
        if (n.style[a + "TransitionProperty"] !== b) {
            i = "-" + p(a) + "-",
            j = c;
            return ! 1
        }
    }),
    a.fx = {
        off: j === b && n.style.transitionProperty === b,
        cssPrefix: i,
        transitionEnd: q("TransitionEnd"),
        animationEnd: q("AnimationEnd")
    },
    a.fn.animate = function(b, c, d, e) {
        a.isObject(c) && (d = c.easing, e = c.complete, c = c.duration),
        c && (c = c / 1e3);
        return this.anim(b, c, d, e)
    },
    a.fn.anim = function(c, d, e, f) {
        var g, h = {},
        j, k = this,
        l, m = a.fx.transitionEnd;
        d === b && (d = .4),
        a.fx.off && (d = 0);
        if (typeof c == "string") h[i + "animation-name"] = c,
        h[i + "animation-duration"] = d + "s",
        m = a.fx.animationEnd;
        else {
            for (j in c) o.test(j) ? (g || (g = []), g.push(j + "(" + c[j] + ")")) : h[j] = c[j];
            g && (h[i + "transform"] = g.join(" ")),
            a.fx.off || (h[i + "transition"] = "all " + d + "s " + (e || ""))
        }
        l = function() {
            var b = {};
            b[i + "transition"] = b[i + "animation-name"] = "none",
            a(this).css(b),
            f && f.call(this)
        },
        d > 0 && this.one(m, l),
        setTimeout(function() {
            k.css(h),
            d <= 0 && setTimeout(function() {
                k.each(function() {
                    l.call(this)
                })
            },
            0)
        },
        0);
        return this
    },
    n = null,
    a.fn.slideDown = function(a) {
        var b = u(this),
        c = this;
        this.css({
            opacity: "1",
            height: 0,
            overflow: "hidden",
            visibility: "visible"
        }).show(),
        this.animate({
            height: b + "px"
        },
        200, "ease",
        function() {
            c.css("overflow", ""),
            c.show(),
            a && a()
        })
    },
    a.fn.slideUp = function(a) {
        var b = this;
        this.css({
            opacity: "1",
            height: u(this) + "px",
            overflow: "hidden",
            visibility: "visible"
        }).show(),
        this.animate({
            height: "0px",
            opacity: 0
        },
        200, "ease",
        function() {
            b.css("overflow", ""),
            b.css("visibility", "hidden"),
            setTimeout(function() {
                b.hide(),
                b.css("opacity", "1")
            },
            0),
            a && a()
        })
    },
    a.fn.toggle = function(a, c) {
        return a === b || typeof a == "boolean" ? g.call(this, a) : this[this.css("display") == "none" ? "show": "hide"](a, c)
    },
    a.fn.fadeTo = function(a, b, c) {
        return s(this, a, b, null, c)
    },
    a.fn.fadeIn = function(a, b) {
        var c = this.css("opacity");
        c > 0 ? this.css("opacity", 0) : c = 1;
        return e.call(this).fadeTo(a, c, b)
    },
    a.fn.fadeOut = function(a, b) {
        return t(this, a, null, b)
    },
    a.fn.fadeToggle = function(a) {
        var b = this.css("opacity") == 0 || this.css("display") == "none";
        return this[b ? "fadeIn": "fadeOut"](a)
    },
    a.extend(a.fx, {
        speeds: h,
        transforms3d: function(c) {
            var e = !1;
            a.each(c,
            function(a, c) {
                if (d.style[c] !== b) {
                    e = a != 1 || v();
                    return ! 1
                }
            });
            return e
        } ("perspectiveProperty WebkitPerspective MozPerspective OPerspective msPerspective".split(" "))
    }),
    a.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),
    function(b, c) {
        a.fn[c] = function(a, b) {
            b == null && (b = a, a = null);
            return arguments.length > 0 ? this.bind(c, b) : this.trigger(c)
        }
    }),
    a.isEmptyObject = function(a) {
        for (var b in a) return ! 1;
        return ! 0
    },
    a(["width", "height"]).each(function(d, e) {
        a.fn[e] = function(d) {
            var f, g = e.replace(/./,
            function(a) {
                return a[0].toUpperCase()
            });
            return d === b ? this[0] == window ? window["inner" + g] : this[0] == c ? c.documentElement["offset" + g] : this.getComputedStyle("display") != "none" ? (f = this.offset()) && f[e] : x(this)[e] : this.each(function(b) {
                var c = a(this);
                c.css(e, w(this, d, b, c[e]()))
            })
        }
    }),
    a.fn.offset = function() {
        if (this.length == 0) return null;
        var a = this[0].getBoundingClientRect();
        return {
            left: a.left + window.pageXOffset,
            top: a.top + window.pageYOffset,
            width: a.width,
            height: a.height
        }
    },
    a.fn.scrollTop = function(a) {
        if (a) c.body.scrollTop = a;
        else return c.body.scrollTop
    },
    a.fn.eq = function(a) {
        return a === -1 ? this.slice(a) : this.slice(a, +a + 1)
    },
    a.fn.slice = function() {
        return a([].slice.apply(this, arguments))
    },
    a.fn.replaceWith = function(b) {
        return this.each(function() {
            a(b).insertBefore(a(this)),
            a(this).remove()
        })
    },
    a.fn.contents = function() {
        var b = [],
        c = this[0].childNodes;
        for (var d = 0; d < c.length; d++) b.push(c[d]);
        return a(b)
    },
    a.fn.text = function(a) {
        if (this.length === 0) return b;
        if (a === b) return this[0].textContent;
        for (var c = 0; c < this.length; c++) this[c].textContent = a;
        return this
    },
    a.trim = function(a) {
        return String.prototype.trim.call(a)
    };
    var y = {};
    a.fn.show = function() {
        return this.each(function() {
            this.style.display == "none" && (this.style.display = null),
            getComputedStyle(this, "").getPropertyValue("display") == "none" && (this.style.display = z(this.nodeName))
        })
    },
    a.fn.getComputedStyle = function(a) {
        return c.defaultView.getComputedStyle(this[0])[a]
    },
    a.fn.parents = function(b) {
        var d = [],
        e = this;
        while (e.length > 0) e = a.map(e,
        function(a) {
            if ((a = a.parentNode) && a !== c && d.indexOf(a) < 0) {
                d.push(a);
                return a
            }
        });
        return A(d, b)
    },
    a.map = function(a, b) {
        var c, d = [],
        e,
        f;
        if (B(a)) for (e = 0; e < a.length; e++) c = b(a[e], e),
        c != null && d.push(c);
        else for (f in a) c = b(a[f], f),
        c != null && d.push(c);
        return C(d)
    },
    a.scrollToElem = function(b) {
        b = a(b),
        b.length != 0 && (c.body.scrollTop = b.offset().top)
    }
})(jq);
if ("undefined" == typeof T5Kit) {
    var T5Kit = {
        commandQueue: [],
        commandQueueFlushing: !1,
        resources: {
            base: !0
        }
    };
    T5Kit.hasResource = function(a) {
        return T5Kit.resources[a]
    },
    T5Kit.addResource = function(a) {
        T5Kit.resources[a] = !0
    },
    T5Kit.Channel = function(a) {
        this.type = a,
        this.handlers = {},
        this.guid = 0,
        this.fired = !1,
        this.enabled = !0
    },
    T5Kit.Channel.prototype.subscribe = function(a, b, c) {
        if (null !== a) {
            var d = a;
            "object" == typeof b && "function" == typeof a && (d = T5Kit.close(b, a)),
            c = c || d.observer_guid || a.observer_guid || this.guid++,
            d.observer_guid = c,
            a.observer_guid = c,
            this.handlers[c] = d;
            return c
        }
    },
    T5Kit.Channel.prototype.subscribeOnce = function(a, b) {
        var c = null,
        d = this,
        e = function() {
            a.apply(b || null, arguments),
            d.unsubscribe(c)
        };
        this.fired ? ("object" == typeof b && "function" == typeof a && (a = T5Kit.close(b, a)), a.apply(this, this.fireArgs)) : c = this.subscribe(e);
        return c
    },
    T5Kit.Channel.prototype.unsubscribe = function(a) {
        "function" == typeof a && (a = a.observer_guid),
        this.handlers[a] = null,
        delete this.handlers[a]
    },
    T5Kit.Channel.prototype.fire = function(a) {
        if (this.enabled) {
            var b = !1,
            c, d;
            for (c in this.handlers) this.handlers.hasOwnProperty(c) && (d = this.handlers[c], "function" == typeof d && (d = !1 === d.apply(this, arguments), b = b || d));
            this.fired = !0,
            this.fireArgs = arguments;
            return ! b
        }
        return ! 0
    },
    T5Kit.addConstructor = function(a) {
        T5Kit.onT5KitInit.subscribeOnce(function() {
            try {
                a()
            } catch(b) {
                console.log("Failed to run constructor: " + b)
            }
        })
    },
    T5Kit.onT5KitInit = new T5Kit.Channel("onT5KitInit"),
    T5Kit.stringify = function(a) {
        if ("undefined" == typeof JSON) {
            var b = "[",
            c, d, e;
            for (c = 0; c < a.length; c++) if (null !== a[c]) if (0 < c && (b += ","), d = typeof a[c], "number" === d || "boolean" === d) b += a[c];
            else if (a[c] instanceof Array) b = b + "[" + a[c] + "]";
            else if (a[c] instanceof Object) {
                d = !0,
                b += "{";
                for (e in a[c]) null !== a[c][e] && (d || (b += ","), b = b + '"' + e + '":', d = typeof a[c][e], b = "number" === d || "boolean" === d ? b + a[c][e] : "function" == typeof a[c][e] ? b + '""': a[c][e] instanceof Object ? b + T5Kit.stringify(a[c][e]) : b + '"' + a[c][e] + '"', d = !1);
                b += "}"
            } else d = a[c].replace(/\\/g, "\\\\"),
            d = d.replace(/"/g, '\\"'),
            b = b + '"' + d + '"';
            return b + "]"
        }
        return JSON.stringify(a)
    },
    T5Kit.clone = function(a) {
        var b, c;
        if (!a) return a;
        if (a instanceof Array) {
            c = [];
            for (b = 0; b < a.length; ++b) c.push(T5Kit.clone(a[b]));
            return c
        }
        if ("function" == typeof a || !(a instanceof Object) || a instanceof Date) return a;
        c = {};
        for (b in a) if (! (b in c) || c[b] !== a[b]) c[b] = T5Kit.clone(a[b]);
        return c
    },
    T5Kit.close = function(a, b, c) {
        return "undefined" == typeof c ?
        function() {
            return b.apply(a, arguments)
        }: function() {
            return b.apply(a, c)
        }
    },
    T5Kit.includeJavascript = function(a, b) {
        var c = document.getElementsByTagName("head")[0],
        d = document.createElement("script");
        d.type = "text/javascript",
        "function" == typeof b && (d.onload = b),
        d.src = a,
        c.appendChild(d)
    },
    T5Kit.createUUID = function() {
        return T5Kit.UUIDcreatePart(4) + "-" + T5Kit.UUIDcreatePart(2) + "-" + T5Kit.UUIDcreatePart(2) + "-" + T5Kit.UUIDcreatePart(2) + "-" + T5Kit.UUIDcreatePart(6)
    },
    T5Kit.UUIDcreatePart = function(a) {
        var b = "",
        c, d;
        for (c = 0; c < a; c++) d = parseInt(256 * Math.random(), 0).toString(16),
        1 === d.length && (d = "0" + d),
        b += d;
        return b
    },
    T5Kit.callbackId = 0,
    T5Kit.callbacks = {},
    T5Kit.callbackStatus = {
        NO_RESULT: 0,
        OK: 1,
        CLASS_NOT_FOUND_EXCEPTION: 2,
        ILLEGAL_ACCESS_EXCEPTION: 3,
        INSTANTIATION_EXCEPTION: 4,
        MALFORMED_URL_EXCEPTION: 5,
        IO_EXCEPTION: 6,
        INVALID_ACTION: 7,
        JSON_EXCEPTION: 8,
        ERROR: 9
    },
    T5Kit.createMttT5Kit = function() {
        mttT5Kit = document.createElement("iframe"),
        mttT5Kit.setAttribute("style", "display:none;"),
        mttT5Kit.setAttribute("height", "0px"),
        mttT5Kit.setAttribute("width", "0px"),
        mttT5Kit.setAttribute("frameborder", "0"),
        document.documentElement.appendChild(mttT5Kit);
        return mttT5Kit
    },
    T5Kit.exec = function(a, b, c, d, e) {
        var f = null,
        g = {
            className: c,
            methodName: d,
            options: {},
            arguments: []
        };
        if (a || b) f = c + T5Kit.callbackId++,
        T5Kit.callbacks[f] = {
            success: a,
            fail: b
        };
        null != f && g.arguments.push(f);
        for (a = 0; a < e.length; ++a) if (b = e[a], void 0 != b && null != b)"object" == typeof b ? g.options = b: g.arguments.push(b);
        T5Kit.commandQueue.push(T5Kit.stringify(g)),
        1 == T5Kit.commandQueue.length && !T5Kit.commandQueueFlushing && (T5Kit.mttT5Kit || (T5Kit.mttT5Kit = T5Kit.createMttT5Kit()), T5Kit.mttT5Kit.src = "mtt:" + c + ":" + d)
    },
    T5Kit.getAndClearQueuedCommands = function() {
        json = JSON.stringify(T5Kit.commandQueue),
        T5Kit.commandQueue = [];
        return json
    },
    T5Kit.callbackSuccess = function(a, b) {
        if (T5Kit.callbacks[a]) {
            if (b.status === T5Kit.callbackStatus.OK) try {
                T5Kit.callbacks[a].success && T5Kit.callbacks[a].success(b.message)
            } catch(c) {
                alert("callbacks4 | " + c),
                console.log("Error in success callback: " + a + " = " + c)
            }
            b.keepCallback || delete T5Kit.callbacks[a]
        }
    },
    T5Kit.callbackError = function(a, b) {
        if (T5Kit.callbacks[a]) {
            try {
                T5Kit.callbacks[a].fail && T5Kit.callbacks[a].fail(b.message)
            } catch(c) {
                console.log("Error in error callback: " + a + " = " + c)
            }
            b.keepCallback || delete T5Kit.callbacks[a]
        }
    }
}
if (!T5Kit.hasResource("user")) {
    T5Kit.addResource("user");
    var User = function() {};
    User.prototype.setUserInfo = function(a, b, c) {
        "function" != typeof a ? console.log("User::setUserInfo Error: successCallback is not a function") : "function" != typeof b ? console.log("User::setUserInfo Error: errorCallback is not a function") : T5Kit.exec(a, b, "login", "setUinAndSidInfo", [c])
    },
    User.prototype.getUserInfo = function(a, b) {
        "function" != typeof a ? console.log("User::getUserInfo Error: successCallback is not a function") : "function" != typeof b ? console.log("User::getUserInfo Error: errorCallback is not a function") : T5Kit.exec(a, b, "login", "getUinAndSidInfo", [])
    },
    User.prototype.setQCookie = function(a, b, c) {
        if (typeof a != "function") console.log("User::setQCookie Error: successCallback is not a function");
        else {
            if (typeof b != "function") {
                console.log("User::setQCookie Error: errorCallback is not a function");
                return
            }
            T5Kit.exec(a, b, "login", "setQCookie", [c])
        }
    },
    User.prototype.getQCookie = function(a, b) {
        "function" != typeof a ? console.log("User::getQCookie Error: successCallback is not a function") : "function" != typeof b ? console.log("User::getQCookie Error: errorCallback is not a function") : T5Kit.exec(a, b, "login", "getQCookie", [])
    },
    T5Kit.addConstructor(function() {
        "undefined" == typeof T5Kit.user && (T5Kit.user = new User)
    })
}
T5Kit.onT5KitInit.fire(),
util = {
    strToObj: function(a, b) {
        var c = [],
        d = {},
        e,
        f,
        g;
        c = a.split("&"),
        g = c.length;
        for (e = 0; e < g; e++) {
            if (c[e].indexOf("=") < 0) continue;
            f = c[e].split("="),
            d[f[0]] = b ? decodeURIComponent(f[1]) : f[1]
        }
        return d
    },
    objToStr: function(a, b) {
        var c = "",
        d, e;
        for (d in a) {
            if (typeof a[d] == "undefined") continue;
            e = b ? encodeURIComponent(a[d]) : a[d],
            c += d + "=" + e + "&"
        }
        return c.slice(0, c.length - 1)
    },
    getUrlParams: function(a) {
        var b = location.search.substr(1, location.search.length),
        c = util.strToObj(decodeURIComponent(b));
        return a ? c[a] : c
    },
    getHashParams: function(a) {
        var b = a ? a: decodeURIComponent(location.hash),
        c = [],
        d = {};
        b.replace(/[\.\?'"><:;,\[\]\{\}]/ig, ""),
        c = b.split("/"),
        c.length > 0 && (d.pageId = c.splice(0, 1)[0].substring(1), d.urlParams = c.length > 0 ? util.strToObj(c.join("/"), !0) : {});
        return d
    },
    pushHashParams: function(a) {
        location.hash = util.objToHash(a)
    },
    objToHash: function(a) {
        var b = a.pageId,
        c = util.objToStr(a.urlParams, !0);
        return c.length > 0 ? b + "/" + c: b
    },
    isArray: function(a) {
        return Object.prototype.toString.call(a) == "[object Array]"
    },
    isObject: function(a) {
        return Object.prototype.toString.call(a) == "[object Object]"
    },
    jsonStringfy: function(a) {
        return "JSON" in window ? JSON.stringify(a) : function(a) {
            var b;
            if (util.isArray(a)) {
                b = "[";
                for (var c = 0; c < a.length; c++) util.isObject(a[c]) || util.isArray(a[c]) ? b += util.jsonStringfy(a[c]) + ",": b += a[c] + ",";
                b = b.substring(0, b.length - 1),
                b += "]"
            } else if (util.isObject(a)) {
                b = "{";
                for (var d in a) util.isObject(a[d]) || util.isArray(a[d]) ? b += d + ":" + util.jsonStringfy(a[d]) + ",": b += d + ":" + a[d] + ",";
                b = b.substring(0, b.length - 1),
                b += "}"
            } else b = "";
            return b
        }
    },
    parseJSON: function(a) {
        var b;
        try {
            b = $.parseJSON(a)
        } catch(c) {
            b = a
        }
        return b
    },
    reverseString: function(a) {
        return typeof a == "string" ? a.split("").reverse().join("") : a
    },
    numNotation: function(a) {
        var b = typeof a != "string" ? a.toString() : a,
        c,
        d,
        e,
        f = [];
        b = util.reverseString(b),
        d = b.length,
        e = Math.ceil(d / 3);
        for (var g = 0; g < e; g++) f.push(b.substr(g * 3, 3));
        c = f.join(","),
        c = util.reverseString(c);
        return c
    },
    getByteLength: function(a) {
        var b = a.length,
        c = 0;
        for (var d = 0; d < b; d++) a.charCodeAt(d) > 0 && a.charCodeAt(d) <= 128 ? c++:c += 2;
        return c
    },
    getByteStr: function(a, b) {
        var c = 0;
        for (var d = 0; d < a.length; d++) {
            a.charCodeAt(d) > 128 ? c += 2 : c++;
            if (c > b) return a.substr(0, d)
        }
        return a
    },
    scriptLoader: function(a, b) {
        var c = document.getElementsByTagName("head")[0] || document.documentElement,
        d = document.createElement("script");
        d.src = a,
        d.onload = d.onerror = function() {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") c && d.parentNode && c.removeChild(d),
            b()
        },
        c.insertBefore(d, c.firstChild)
    }
},
function() {
    var rsplit = function(a, b) {
        var c = b.exec(a),
        d = [],
        e,
        f,
        g;
        while (c != null) e = c.index,
        f = b.lastIndex,
        e != 0 && (g = a.substring(0, e), d.push(a.substring(0, e)), a = a.slice(e)),
        d.push(c[0]),
        a = a.slice(c[0].length),
        c = b.exec(a); ! a == "" && d.push(a);
        return d
    },
    chop = function(a) {
        return a.substr(0, a.length - 1)
    },
    extend = function(a, b) {
        for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c])
    };
    EJS = function(a) {
        a = typeof a == "string" ? {
            view: a
        }: a,
        this.set_options(a);
        if (a.precompiled) this.template = {},
        this.template.process = a.precompiled,
        EJS.update(this.name, this);
        else {
            if (a.element) {
                if (typeof a.element == "string") {
                    var b = a.element;
                    a.element = document.getElementById(a.element);
                    if (a.element == null) throw b + "does not exist!"
                }
                a.element.value ? this.text = a.element.value: this.text = a.element.innerHTML,
                this.name = a.element.id,
                this.type = a.type || "["
            } else if (a.url) {
                a.url = EJS.endExt(a.url, this.extMatch),
                this.name = this.name ? this.name: a.url;
                var c = a.url,
                d = EJS.get(this.name, this.cache);
                if (d) return d;
                if (d == EJS.INVALID_PATH) return null;
                try {
                    this.text = EJS.request(c + (this.cache ? "": "?" + Math.random()))
                } catch(e) {}
                if (this.text == null) throw {
                    type: "EJS",
                    message: "There is no template at " + c
                }
            }
            var d = new EJS.Compiler(this.text, this.type);
            d.compile(a, this.name),
            EJS.update(this.name, this),
            this.template = d
        }
    },
    EJS.prototype = {
        render: function(a, b) {
            a = a || {},
            this._extra_helpers = b;
            var c = new EJS.Helpers(a, b || {}),
            d;
            try {
                d = this.template.process.call(a, a, c)
            } catch(e) {
                console.error(e),
                d = ""
            } finally {
                return d
            }
        },
        update: function(element, options) {
            typeof element == "string" && (element = document.getElementById(element));
            if (options == null) {
                _template = this;
                return function(a) {
                    EJS.prototype.update.call(_template, element, a)
                }
            }
            typeof options == "string" ? (params = {},
            params.url = options, _template = this, params.onComplete = function(request) {
                var object = eval(request.responseText);
                EJS.prototype.update.call(_template, element, object)
            },
            EJS.ajax_request(params)) : element.innerHTML = this.render(options)
        },
        out: function() {
            return this.template.out
        },
        set_options: function(a) {
            this.type = a.type || EJS.type,
            this.cache = a.cache != null ? a.cache: EJS.cache,
            this.text = a.text || null,
            this.name = a.name || null,
            this.ext = a.ext || EJS.ext,
            this.extMatch = new RegExp(this.ext.replace(/\./, "."))
        }
    },
    EJS.endExt = function(a, b) {
        if (!a) return null;
        b.lastIndex = 0;
        return a + (b.test(a) ? "": this.ext)
    },
    EJS.Scanner = function(a, b, c) {
        extend(this, {
            left_delimiter: b + "%",
            right_delimiter: "%" + c,
            double_left: b + "%%",
            double_right: "%%" + c,
            left_equal: b + "%=",
            left_comment: b + "%#"
        }),
        this.SplitRegexp = b == "[" ? /(\[%%)|(%%\])|(\[%=)|(\[%#)|(\[%)|(%\]\n)|(%\])|(\n)/: new RegExp("(" + this.double_left + ")|(%%" + this.double_right + ")|(" + this.left_equal + ")|(" + this.left_comment + ")|(" + this.left_delimiter + ")|(" + this.right_delimiter + "\n)|(" + this.right_delimiter + ")|(\n)"),
        this.source = a,
        this.stag = null,
        this.lines = 0
    },
    EJS.Scanner.to_text = function(a) {
        return a == null || a === undefined ? "": a instanceof Date ? a.toDateString() : a.toString ? a.toString() : ""
    },
    EJS.Scanner.prototype = {
        scan: function(a) {
            scanline = this.scanline,
            regex = this.SplitRegexp;
            if (!this.source == "") {
                var b = rsplit(this.source, /\n/);
                for (var c = 0; c < b.length; c++) {
                    var d = b[c];
                    this.scanline(d, regex, a)
                }
            }
        },
        scanline: function(a, b, c) {
            this.lines++;
            var d = rsplit(a, b);
            for (var e = 0; e < d.length; e++) {
                var f = d[e];
                if (f != null) try {
                    c(f, this)
                } catch(g) {
                    throw {
                        type: "EJS.Scanner",
                        line: this.lines
                    }
                }
            }
        }
    },
    EJS.Buffer = function(a, b) {
        this.line = [],
        this.script = "",
        this.pre_cmd = a,
        this.post_cmd = b;
        for (var c = 0; c < this.pre_cmd.length; c++) this.push(a[c])
    },
    EJS.Buffer.prototype = {
        push: function(a) {
            this.line.push(a)
        },
        cr: function() {
            this.script = this.script + this.line.join("; "),
            this.line = [],
            this.script = this.script + "\n"
        },
        close: function() {
            if (this.line.length > 0) {
                for (var a = 0; a < this.post_cmd.length; a++) this.push(pre_cmd[a]);
                this.script = this.script + this.line.join("; "),
                line = null
            }
        }
    },
    EJS.Compiler = function(a, b) {
        this.pre_cmd = ["var ___ViewO = [];"],
        this.post_cmd = [],
        this.source = " ",
        a != null && (typeof a == "string" ? (a = a.replace(/\r\n/g, "\n"), a = a.replace(/\r/g, "\n"), this.source = a) : a.innerHTML && (this.source = a.innerHTML), typeof this.source != "string" && (this.source = "")),
        b = b || "<";
        var c = ">";
        switch (b) {
        case "[":
            c = "]";
            break;
        case "<":
            break;
        default:
            throw b + " is not a supported deliminator"
        }
        this.scanner = new EJS.Scanner(this.source, b, c),
        this.out = ""
    },
    EJS.Compiler.prototype = {
        compile: function(options, name) {
            options = options || {},
            this.out = "";
            var put_cmd = "___ViewO.push(",
            insert_cmd = put_cmd,
            buff = new EJS.Buffer(this.pre_cmd, this.post_cmd),
            content = "",
            clean = function(a) {
                a = a.replace(/\\/g, "\\\\"),
                a = a.replace(/\n/g, "\\n"),
                a = a.replace(/"/g, '\\"');
                return a
            };
            this.scanner.scan(function(a, b) {
                if (b.stag == null) switch (a) {
                case "\n":
                    content = content + "\n",
                    buff.push(put_cmd + '"' + clean(content) + '");'),
                    buff.cr(),
                    content = "";
                    break;
                case b.left_delimiter:
                case b.left_equal:
                case b.left_comment:
                    b.stag = a,
                    content.length > 0 && buff.push(put_cmd + '"' + clean(content) + '")'),
                    content = "";
                    break;
                case b.double_left:
                    content = content + b.left_delimiter;
                    break;
                default:
                    content = content + a
                } else switch (a) {
                case b.right_delimiter:
                    switch (b.stag) {
                    case b.left_delimiter:
                        content[content.length - 1] == "\n" ? (content = chop(content), buff.push(content), buff.cr()) : buff.push(content);
                        break;
                    case b.left_equal:
                        buff.push(insert_cmd + "(EJS.Scanner.to_text(" + content + ")))")
                    }
                    b.stag = null,
                    content = "";
                    break;
                case b.double_right:
                    content = content + b.right_delimiter;
                    break;
                default:
                    content = content + a
                }
            }),
            content.length > 0 && buff.push(put_cmd + '"' + clean(content) + '")'),
            buff.close(),
            this.out = buff.script + ";";
            var to_be_evaled = "/*" + name + "*/this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {" + this.out + " return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}};";
            try {
                eval(to_be_evaled)
            } catch(e) {
                if (typeof JSLINT == "undefined") throw e;
                JSLINT(this.out);
                for (var i = 0; i < JSLINT.errors.length; i++) {
                    var error = JSLINT.errors[i];
                    if (error.reason != "Unnecessary semicolon.") {
                        error.line++;
                        var e = new Error;
                        e.lineNumber = error.line,
                        e.message = error.reason,
                        options.view && (e.fileName = options.view);
                        throw e
                    }
                }
            }
        }
    },
    EJS.config = function(a) {
        EJS.cache = a.cache != null ? a.cache: EJS.cache,
        EJS.type = a.type != null ? a.type: EJS.type,
        EJS.ext = a.ext != null ? a.ext: EJS.ext;
        var b = EJS.templates_directory || {};
        EJS.templates_directory = b,
        EJS.get = function(a, c) {
            return c == !1 ? null: b[a] ? b[a] : null
        },
        EJS.update = function(a, c) {
            a != null && (b[a] = c)
        },
        EJS.INVALID_PATH = -1
    },
    EJS.config({
        cache: !0,
        type: "<",
        ext: ".ejs"
    }),
    EJS.Helpers = function(a, b) {
        this._data = a,
        this._extras = b,
        extend(this, b)
    },
    EJS.Helpers.prototype = {
        view: function(a, b, c) {
            c || (c = this._extras),
            b || (b = this._data);
            return (new EJS(a)).render(b, c)
        },
        to_text: function(a, b) {
            return a == null || a === undefined ? b || "": a instanceof Date ? a.toDateString() : a.toString ? a.toString().replace(/\n/g, "<br />").replace(/''/g, "'") : ""
        }
    },
    EJS.newRequest = function() {
        var a = [function() {
            return new ActiveXObject("Msxml2.XMLHTTP")
        },
        function() {
            return new XMLHttpRequest
        },
        function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }];
        for (var b = 0; b < a.length; b++) try {
            var c = a[b]();
            if (c != null) return c
        } catch(d) {
            continue
        }
    },
    EJS.request = function(a) {
        var b = new EJS.newRequest;
        b.open("GET", a, !1);
        try {
            b.send(null)
        } catch(c) {
            return null
        }
        return b.status == 404 || b.status == 2 || b.status == 0 && b.responseText == "" ? null: b.responseText
    },
    EJS.ajax_request = function(a) {
        a.method = a.method ? a.method: "GET";
        var b = new EJS.newRequest;
        b.onreadystatechange = function() {
            b.readyState == 4 && (b.status == 200 ? a.onComplete(b) : a.onComplete(b))
        },
        b.open(a.method, a.url),
        b.send(null)
    }
} ();
var cookieObj = new CookieObj,
global = {},
localStorageObj = new LocalStorageObj;
Canvas.g_loadings = [],
Canvas.prototype.rotation = 0,
Canvas.prototype.draw = function() {
    var a = this.height,
    b = this.ctx,
    c = a / 10,
    d = a / 5,
    e = -Math.PI * 2 / 8;
    b.save(),
    b.clearRect(0, 0, a, a),
    b.translate(a / 2, a / 2);
    for (var f = 0; f < 8; f++) b.save(),
    b.rotate(f * e),
    b.fillStyle = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + "," + (8 - (f + this.rotation) % 8) / 8 + ")",
    b.fillRect( - c / 2, d, c, d),
    b.restore();
    b.restore(),
    this.rotation++,
    this.rotation %= 8
},
Canvas.initCanvas = function(a, b, c) {
    if (a && (!a.firstChild || a.firstChild && a.firstChild._id != "sp")) {
        var d = new Canvas(b, c);
        d.obj._id = "sp",
        Canvas.g_loadings.push(d),
        a.insertBefore(d.obj, a.firstChild),
        d.running || (d.running = window.setInterval(function() {
            d.draw()
        },
        125), d.draw())
    }
},
Canvas.removeCanvas = function(a) {
    a.removeAttribute("selected");
    if (a && a.firstChild && a.firstChild._id == "sp") for (var b = Canvas.g_loadings.length; --b >= 0;) {
        var c = Canvas.g_loadings[b];
        if (c.obj == a.firstChild) {
            a.removeChild(a.firstChild),
            window.clearInterval(c.running),
            c.running = null,
            Canvas.g_loadings.splice(b, 1);
            return 1
        }
    }
    return 0
},
Canvas.loading = function(a, b, c) {
    return
},
Canvas.unloading = function(a) {
    return ! 1;
    var b = jQuery("body>.preloader"),
    c
};
var g_mst = {
    SEARCH_USER_FOLLOWER: 51,
    SEARCH_USER_FOLLOW: 52,
    CLOSE_FRIEND: 50,
    MAYBE_KNOW: 49,
    DETAIL_ALL_MSG: 66,
    DETAIL_FWD_MSG: 64,
    HOME_MSG: 0,
    IPOST_MSG: 1,
    IMETION_MSG: 2,
    DIRECT_IN_MSG: 3,
    DIRECT_OUT_MSG: 4,
    RANDOM_MSG: 5,
    ORIGINAL_MSG: 6,
    FORWARD_MSG: 7,
    REPLY_MSG: 8,
    KEPT_MSG: 9,
    TIMELINE_MSG: 10,
    SPECIAL_MSG: 11,
    TIMELINE_ORIGINAL_MSG: 12,
    IMETION_MSG_FOLLOWING: 13,
    IMENTION_MSG_STAR: 15,
    WITH_IMAGE_MSG: 14,
    USER_TIMELINE: 16,
    COMMENT_MSG: 17,
    TIMELINE_WITH_IMAGE_MSG: 18,
    BIDIRECTION_FOLLOWS: 19,
    USER_FOLLOWER: 20,
    USER_FOLLOWING: 21,
    USER_SPECIAL_FOLLOWING: 22,
    USER_FOLLOWING_CONF: 23,
    HOST_FOLLOWING: 24,
    HOST_SPECIAL_FOLLOWING: 25,
    TOPIC_LIST: 30,
    SEARCH_TOPIC_LIST: 31,
    SEARCH_USER_LIST: 32,
    SEARCH_MSG_LIST: 33,
    RANDOM_MSG_LIST: 34,
    HOT_USER_LIST: 35,
    HOT_MSG_LIST: 36,
    HOT_TOPIC_LIST: 37,
    FAMOUS_USER_LIST: 38,
    FWD_MESSAGE_LIST: 39,
    BLACK_USER_LIST: 40,
    SEARCH_TOPIC_JX_LIST: 41,
    SEARCH_TOPIC_ALL_LIST: 42,
    TOPIC_LIST_MYFOLLOW: 55,
    TOPIC_LIST_GOOD: 41,
    TOPIC_LIST_ALL: 42,
    NEARBY_USER_LIST: 43,
    NEARBY_MSG_LIST: 44,
    KEYWORD_LIST: 45,
    DIALOGHISTORY: 46,
    PRIVATEMSGHOME: 47,
    CHANNEL: 53,
    CHANNEL_DETAIL: 54,
    FAMOUS_SAY: 56,
    FAMOUS_INDEX: 57,
    RECOMMEND_FAMOUS: 58,
    JOINTFOLLOW: 60,
    APPLIST: 61,
    QQ_FRIENDS_MSG: 99,
    LIST_MSG: 100,
    APPOPENID: 62,
    TOPIC_DETAIL_ALL: 67,
    TOPIC_DETAIL_NEW: 68,
    TOPIC_DETAIL_IMAGE: 69,
    TOPIC_DETAIL_DEFINE: 70
},
g_ac = {
    AC_SINGLEMSG: 213,
    AC_CLOSEFRIEND: 225,
    AC_HOT_INDEX: 232,
    AC_RECOMMENDUSER: 217,
    AC_NO_ACTION: 0,
    AC_USER_FOLLOW: 11,
    AC_USER_UNFOLLOW: 12,
    AC_USER_SEARCH: 13,
    AC_USER_UPDATE: 14,
    AC_MSG_AT: 50,
    AC_MSG_POST: 51,
    AC_MSG_DEL: 52,
    AC_MSG_REPLY: 53,
    AC_MSG_FORWARD: 54,
    AC_MSG_DIRECT: 55,
    AC_MSG_DIRECT_REPLY: 56,
    AC_MSG_DIRECT_MANUAL: 57,
    AC_MSG_KEEP: 58,
    AC_MSG_DROP: 59,
    AC_MSG_SEARCH: 60,
    AC_MSG_COMMENT: 61,
    AC_TOPIC_SEARCH: 81,
    AC_TOPIC_KEEP: 82,
    AC_TOPIC_DROP: 83,
    AC_KEYWORD_KEEP: 84,
    AC_KEYWORD_DROP: 85,
    AC_FEEDBACK: 99,
    AC_LOGOUT: 100,
    AC_MORE_HOME_MSG: 101,
    AC_NEW_DATA: 102,
    AC_FOLLOWER_LIST: 103,
    AC_FOLLOWING_LIST: 104,
    AC_HOME_DATA: 105,
    AC_MORE_MSG: 106,
    AC_INBOX: 107,
    AC_OUTBOX: 108,
    AC_GET_MORE_ACTION: 109,
    AC_GET_FOLLOWER: 110,
    AC_GET_KEPT_MSG: 111,
    AC_GET_PROVINCE: 112,
    AC_GET_CITY: 113,
    AC_GET_KEPT_TOPIC: 114,
    AC_LOOK_AROUND: 115,
    AC_USER_INFO: 116,
    AC_CLEAR_MENTIONED: 117,
    AC_CLEAR_DIRECT: 118,
    AC_CLEAR_FOLLOWER: 119,
    AC_CLEAR_UNREAD: 120,
    AC_QUERY_SHORT_URL: 121,
    AC_HOT_USER: 122,
    AC_HOT_MSG: 123,
    AC_HOT_TOPIC: 124,
    AC_FAMOUS_USER_CLASS: 125,
    AC_FAMOUS_USER_LIST: 126,
    AC_MSG_FORWARD_HISTORY: 127,
    AC_GET_BLACK_USER_LIST: 128,
    AC_ADD_BLACK_USER_LIST: 129,
    AC_REMOVE_BLACK_USER_LIST: 130,
    AC_GET_USER_SETTING_PAGE_NUM: 131,
    AC_GET_USER_GROUP_LIST: 132,
    AC_ADD_USER_GROUP_LIST: 133,
    AC_REMOVE_USER_GROUP_LIST: 134,
    AC_USER_UPDATE_PRIVACY: 135,
    AC_GET_USER_PRIVACY: 136,
    AC_LBS_QUERY_ADDR_TEXT: 137,
    AC_IMAGE_BASE64_PROXY: 138,
    AC_ID_AUTO_COMPLETE: 139,
    AC_GET_VERIFY_IMG: 140,
    AC_DO_VERIFY: 141,
    AC_GET_COUNTRY: 142,
    AC_TELECOM: 214,
    AC_CHANNEL: 215,
    AC_CHANNEL_DETAIL: 216,
    AC_NEARBYMSG: 220,
    AC_HEADNAVFLAG: 221,
    AC_FAMOUSSAY: 218,
    AC_NEARBYUSER: 219,
    AC_GET_KEPT_KEYWORD: 222,
    AC_PRIVATEMSG_LIST: 223,
    AC_DIALOGHISTORY: 224,
    AC_CLOSEFRIEND: 225,
    AC_GET_PRIVATEMSG_PERMISSION: 226,
    AC_SET_PRIVATEMSG_PERMISSION: 227,
    AC_BIDIRECTION_FOLLOWS: 228,
    AC_FAMOUS_INDEX: 229,
    AC_RECOMMEND_FAMOUS: 230,
    AC_JOINTFOLLOW: 231,
    AC_APPLIST: 233,
    AC_FAMOUS_USERANDSAY: 235,
    AC_CLICKCOUNT: 236,
    AC_APPOPENID: 234,
    AC_GET_PRIVATESET: 239,
    AC_SET_PRIVATESET: 240,
    AC_GET_MSGSET: 241,
    AC_SET_MSGSET: 242,
    AC_GETVOTE: 237,
    AC_VOTE: 238,
    AC_OLYMPIC_HOME: 260,
    AC_SCHEDULES_BY_PAGE: 261,
    AC_SCHEDULES: 262,
    AC_SUBSCRIBE: 267,
    AC_UNSUBSCRIBE: 268,
    AC_LIST_SUBSCRIPTIONS: 270,
    AC_OLYMPIC_FIRST_PAGE: 271,
    AC_OLYMPIC_LAST_PAGE: 272,
    AC_OLYMPIC_SPORTS: 273,
    AC_LIST_GAME_INFO: 274,
    AC_LIST_GAME_INFO_PAGE: 275,
    AC_LIST_COMMENT_PAGE: 276,
    AC_LIST_OLYMPIC_ACROSS: 279,
    AC_OLYMPICCOUNTDOUNT: 250,
    AC_SKINSET: 251,
    AC_SKINGET: 252,
    AC_BETTING_INDEX_PAGE: 277,
    AC_ACTIVITY_HOME: 280,
    AC_ACTIVITY_PAGE: 281,
    AC_USER_AVATAR_SYNC: 288,
    AC_USER_INFO_EDU_WORK: 289,
    AC_GET_SCHOOL_DEPART_NAME: 290,
    AC_ADD_EDUCATION: 291,
    AC_ADD_WORK: 292,
    AC_DELETE_WORK: 293,
    AC_DELETE_EDUCATION: 294,
    AC_GET_USER_INFO: 295,
    AC_ACTIVITY_BIND: 296,
    AC_ACTIVITY_QUERY_BIND: 298,
    AC_ADD_USER_TAG: 300,
    AC_DEL_USER_TAG: 301,
    AC_LIST_USER_TAG: 302,
    AC_LIST_HOT_TAG: 303,
    AC_LIST_TAG: 304,
    AC_HOME_HEAD: 305,
    AC_HOME_PROMOTION_ADV: 309
},
g_search_type = {
    COMMENT: 64,
    RT: 2
},
g_msgtype = {
    POST: 1,
    FORWARD: 2,
    DIRECT: 3,
    REPLY: 4,
    COMMENT: 7
},
g_loadings = [],
g_imgtip_shown = 0,
g_text_editing,
g_text_check_interval = 300;
g_from_android && (g_text_check_interval = 3e3);
var g_overlay, g_backwards = !1;
g_bigImgDeg = 0,
function() {
    $(document).ready(function() {
        var a = $("#rotImg");
        $("#rotLeft").bind("click",
        function() {
            g_bigImgDeg = g_bigImgDeg - 90,
            a.css("-webkit-transform", "rotate(" + g_bigImgDeg + "deg)")
        }),
        $("#rotRight").bind("click",
        function() {
            g_bigImgDeg = g_bigImgDeg + 90,
            a.css("-webkit-transform", "rotate(" + g_bigImgDeg + "deg)")
        })
    })
} (),
function(a) {
    var b = function(a) {
        var b = this;
        for (var c in a) b[c] = a[c]
    };
    b.prototype = {
        __tid: null,
        __link: null,
        __counter: 0,
        __createLinkElement: function() {
            var a = this;
            a.__link = document.createElement("link"),
            a.__link.type = "text/css",
            a.__link.rel = "stylesheet",
            a.__link.id = a.id,
            a.__link.href = a.href
        },
        __appendLinkToHead: function() {
            var a = this,
            b = document.querySelector("head link[id]");
            document.getElementsByTagName("head")[0].insertBefore(a.__link, b)
        },
        __check: function() {
            var a = this,
            b = document.styleSheets;
            for (var c = 0, d = b.length; c < d; c++) {
                var e = b[c],
                f = e.ownerNode || e.owningElement;
                if (f && f.id == a.id) {
                    a.onReady && a.onReady.call(this),
                    clearTimeout(a.__tid);
                    return
                }
            }
            a.__counter >= a.timeout ? (a.onError && a.onError.call(this), clearTimeout(a.__tid)) : (a.__counter += 400, a.__tid && clearTimeout(a.__tid), a.__tid = setTimeout(function() {
                a.__check.call(a)
            },
            400))
        },
        id: ["css", "preloader", (new Date).getTime()].join("-"),
        href: null,
        timeout: 4e3,
        onError: null,
        onReady: null,
        start: function() {
            var a = this;
            a.__createLinkElement(),
            a.__appendLinkToHead(),
            a.__check()
        }
    },
    a.cssPreloader = b
} (window),
function() {
    function a() {
        loginPop.setIsFromClick(!0),
        window.g_isLogin && localStorageObj.set("sid", window.g_sid),
        $("footer a#t_top").bind("click",
        function() {
            MoveableNav.scrollToTop()
        }),
        $("#footer_suggestion").bind("click",
        function() {
            util.pushHashParams({
                pageId: "compose",
                urlParams: {
                    sendType: "post",
                    topic: "手机微博触屏版"
                }
            })
        }),
        cookieObj.domain = ".3g.qq.com",
        cookieObj.get("mb_imgshow") || cookieObj.set("mb_imgshow", "show"),
        cookieObj.get("mblog_listimg") || cookieObj.set("mblog_listimg", "true"),
        isGrayOlyView && $("#t_navlast").attr("href", "#olympic_view"),
        $(".logowrapper > a[href], .main-nav > a[href]").each(function(a, b) {
            var c = $(b);
            c.bind("click",
            function() {
                window.location.hash = c.attr("href");
                return ! 1
            })
        }),
        loginPop.setIsFromClick(!1),
        window.g_f && window.g_f == 18106 && redirectLayer.show(),
        NavControl.init(),
        loginPop.init();
        if (DeviceFeature.isSupportFixed()) {
            var a = 1,
            b = {
                ac: g_ac.AC_HOME_PROMOTION_ADV
            },
            c = localStorageObj.get("btTime") * 1,
            d = new Date * 1,
            e = $("#t_bm_banner"); ! c || (d - c) / 3600 / 1e3 / 24 >= a ? NetWork.commonRequest(null, b,
            function(a) {
                a.result == 0 && a.jsonDump.adText && (e.find(".t_bt_link").attr("href", a.jsonDump.adLink), e.find(".t_bt_img").attr("src", a.jsonDump.imageUrl), e.show(), e.find(".t_bt_close").bind("click",
                function() {
                    localStorageObj.set("btTime", (new Date * 1).toString()),
                    e.remove()
                }))
            }) : e.remove()
        }
    }
    g_isqqbrowser37 ? $(document).ready(function() {
        function c() {
            loginPop.goToLogin()
        }
        function b(a) {
            function c(a) {
                var b = window.location.href;
                b.indexOf("?") == -1 ? window.location.href = b + "?sid=" + a: (/sid=\w+&/gi.test(b) && (b = b.replace(/sid=\w+&/g, "")), /sid=\w+/gi.test(b) && (b = b.replace(/sid=\w+/g, "")), b = b.replace(/.jsp\?/gi, ".jsp?sid=" + a + "&"), b.lastIndexOf("&") == b.length - 1 && (b = b.substr(0, b.length - 2)), window.location.href = b)
            }
            function b(a) {
                var b = a.substring(a.indexOf("sid=") + 4);
                return b.substring(0, b.indexOf(";"))
            }
            var d = a,
            e = b(d.sid);
            e ? c(e) : loginPop.goToLogin()
        }
        g_sid ? a() : T5Kit.user.getQCookie(b, c)
    }) : $(document).ready(a)
} ();
var FaceMapping = {
    texts: ["/调皮", "/呲牙", "/惊讶", "/难过", "/酷", "/冷汗", "/抓狂", "/吐", "/偷笑", "/可爱", "/白眼", "/傲慢", "/微笑", "/撇嘴", "/色", "/发呆", "/得意", "/流泪", "/害羞", "/嘘", "/困", "/尴尬", "/发怒", "/大哭", "/流汗", "/再见", "/敲打", "/擦汗", "/委屈", "/疑问", "/睡", "/亲亲", "/憨笑", "/衰", "/阴险", "/奋斗", "/右哼哼", "/拥抱", "/坏笑", "/鄙视", "/晕", "/大兵", "/可怜", "/饥饿", "/咒骂", "/抠鼻", "/鼓掌", "/糗大了", "/左哼哼", "/哈欠", "/快哭了", "/吓", "/闭嘴", "/惊恐", "/折磨", "/示爱", "/爱心", "/心碎", "/蛋糕", "/闪电", "/炸弹", "/刀", "/足球", "/瓢虫", "/便便", "/咖啡", "/饭", "/猪头", "/玫瑰", "/凋谢", "/月亮", "/太阳", "/礼物", "/强", "/弱", "/握手", "/胜利", "/抱拳", "/勾引", "/拳头", "/差劲", "/爱你", "/NO", "/OK", "/爱情", "/飞吻", "/跳跳", "/发抖", "/怄火", "/转圈", "/磕头", "/回头", "/跳绳", "/挥手", "/激动", "/街舞", "/献吻", "/左太极", "/右太极", "/菜刀", "/西瓜", "/啤酒", "/骷髅", "/篮球", "/兵乓"],
    getText: function(a) {
        return FaceMapping.texts[a]
    }
};
(function() {
    var a = Math,
    b = function(a) {
        return a >> 0
    },
    c = /webkit/i.test(navigator.appVersion) ? "webkit": /firefox/i.test(navigator.userAgent) ? "Moz": "opera" in window ? "O": "",
    d = /android/gi.test(navigator.appVersion),
    e = /iphone|ipad/gi.test(navigator.appVersion),
    f = /playbook/gi.test(navigator.appVersion),
    g = /hp-tablet/gi.test(navigator.appVersion),
    h = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix,
    i = "ontouchstart" in window && !g,
    j = c + "Transform" in document.documentElement.style,
    k = e || f,
    l = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(a) {
            return setTimeout(a, 1)
        }
    } (),
    m = function() {
        return window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
    } (),
    n = "onorientationchange" in window ? "orientationchange": "resize",
    o = i ? "touchstart": "mousedown",
    p = i ? "touchmove": "mousemove",
    q = i ? "touchend": "mouseup",
    r = i ? "touchcancel": "mouseup",
    s = c == "Moz" ? "DOMMouseScroll": "mousewheel",
    t = "translate" + (h ? "3d(": "("),
    u = h ? ",0)": ")",
    v = function(a, b) {
        var f = this,
        g = document,
        l;
        f.wrapper = typeof a == "object" ? a: g.getElementById(a),
        f.wrapper.style.overflow = "hidden",
        f.scroller = f.wrapper.children[0],
        f.options = {
            hScroll: !0,
            vScroll: !0,
            x: 0,
            y: 0,
            bounce: !0,
            bounceLock: !1,
            momentum: !0,
            lockDirection: !0,
            useTransform: !0,
            useTransition: !1,
            topOffset: 0,
            checkDOMChanges: !1,
            hScrollbar: !0,
            vScrollbar: !0,
            fixedScrollbar: d,
            hideScrollbar: e,
            fadeScrollbar: e && h,
            scrollbarClass: "",
            zoom: !1,
            zoomMin: 1,
            zoomMax: 4,
            doubleTapZoom: 2,
            wheelAction: "scroll",
            snap: !1,
            snapThreshold: 1,
            onRefresh: null,
            onBeforeScrollStart: function(a) {
                var b = a.target;
                while (b.nodeType != 1) b = b.parentNode;
                b.tagName == "SELECT" || b.tagName == "INPUT" || b.tagName == "TEXTAREA",
                a.preventDefault()
            },
            onScrollStart: null,
            onBeforeScrollMove: null,
            onScrollMove: null,
            onBeforeScrollEnd: null,
            onScrollEnd: null,
            onTouchEnd: null,
            onDestroy: null,
            onZoomStart: null,
            onZoom: null,
            onZoomEnd: null
        },
        f.zoom && d && (t = "translate(", u = ")");
        for (l in b) f.options[l] = b[l];
        f.x = f.options.x,
        f.y = f.options.y,
        f.options.useTransform = j ? f.options.useTransform: !1,
        f.options.hScrollbar = f.options.hScroll && f.options.hScrollbar,
        f.options.vScrollbar = f.options.vScroll && f.options.vScrollbar,
        f.options.zoom = f.options.useTransform && f.options.zoom,
        f.options.useTransition = k && f.options.useTransition,
        f.scroller.style[c + "TransitionProperty"] = f.options.useTransform ? "-" + c.toLowerCase() + "-transform": "top left",
        f.scroller.style[c + "TransitionDuration"] = "0",
        f.scroller.style[c + "TransformOrigin"] = "0 0",
        f.options.useTransition && (f.scroller.style[c + "TransitionTimingFunction"] = "cubic-bezier(0.33,0.66,0.66,1)"),
        f.options.useTransform ? f.scroller.style[c + "Transform"] = t + f.x + "px," + f.y + "px" + u: f.scroller.style.cssText += ";position:absolute;top:" + f.y + "px;left:" + f.x + "px",
        f.options.useTransition && (f.options.fixedScrollbar = !0),
        f.refresh(),
        f._bind(n, window),
        f._bind(o),
        i || (f._bind("mouseout", f.wrapper), f.options.wheelAction != "none" && f._bind(s)),
        f.options.checkDOMChanges && (f.checkDOMTime = setInterval(function() {
            f._checkDOMChanges()
        },
        500))
    };
    v.prototype = {
        enabled: !0,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0,
        currPageY: 0,
        pagesX: [],
        pagesY: [],
        aniTime: null,
        wheelZoomCount: 0,
        handleEvent: function(a) {
            var b = this;
            switch (a.type) {
            case o:
                if (!i && a.button !== 0) return;
                b._start(a);
                break;
            case p:
                b._move(a);
                break;
            case q:
            case r:
                b._end(a);
                break;
            case n:
                b._resize();
                break;
            case s:
                b._wheel(a);
                break;
            case "mouseout":
                b._mouseout(a);
                break;
            case "webkitTransitionEnd":
                b._transitionEnd(a)
            }
        },
        _checkDOMChanges: function() {
            this.moved || this.zoomed || this.animating || this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale || this.refresh()
        },
        _scrollbar: function(d) {
            var e = this,
            f = document,
            g;
            e[d + "Scrollbar"] ? (e[d + "ScrollbarWrapper"] || (g = f.createElement("div"), e.options.scrollbarClass ? g.className = e.options.scrollbarClass + d.toUpperCase() : g.style.cssText = "position:absolute;z-index:100;" + (d == "h" ? "height:7px;bottom:1px;left:2px;right:" + (e.vScrollbar ? "7": "2") + "px": "width:7px;bottom:" + (e.hScrollbar ? "7": "2") + "px;top:2px;right:1px"), g.style.cssText += ";pointer-events:none;-" + c + "-transition-property:opacity;-" + c + "-transition-duration:" + (e.options.fadeScrollbar ? "350ms": "0") + ";overflow:hidden;opacity:" + (e.options.hideScrollbar ? "0": "1"), e.wrapper.appendChild(g), e[d + "ScrollbarWrapper"] = g, g = f.createElement("div"), e.options.scrollbarClass || (g.style.cssText = "position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-" + c + "-background-clip:padding-box;-" + c + "-box-sizing:border-box;" + (d == "h" ? "height:100%": "width:100%") + ";-" + c + "-border-radius:3px;border-radius:3px"), g.style.cssText += ";pointer-events:none;-" + c + "-transition-property:-" + c + "-transform;-" + c + "-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-" + c + "-transition-duration:0;-" + c + "-transform:" + t + "0,0" + u, e.options.useTransition && (g.style.cssText += ";-" + c + "-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)"), e[d + "ScrollbarWrapper"].appendChild(g), e[d + "ScrollbarIndicator"] = g), d == "h" ? (e.hScrollbarSize = e.hScrollbarWrapper.clientWidth, e.hScrollbarIndicatorSize = a.max(b(e.hScrollbarSize * e.hScrollbarSize / e.scrollerW), 8), e.hScrollbarIndicator.style.width = e.hScrollbarIndicatorSize + "px", e.hScrollbarMaxScroll = e.hScrollbarSize - e.hScrollbarIndicatorSize, e.hScrollbarProp = e.hScrollbarMaxScroll / e.maxScrollX) : (e.vScrollbarSize = e.vScrollbarWrapper.clientHeight, e.vScrollbarIndicatorSize = a.max(b(e.vScrollbarSize * e.vScrollbarSize / e.scrollerH), 8), e.vScrollbarIndicator.style.height = e.vScrollbarIndicatorSize + "px", e.vScrollbarMaxScroll = e.vScrollbarSize - e.vScrollbarIndicatorSize, e.vScrollbarProp = e.vScrollbarMaxScroll / e.maxScrollY), e._scrollbarPos(d, !0)) : e[d + "ScrollbarWrapper"] && (j && (e[d + "ScrollbarIndicator"].style[c + "Transform"] = ""), e[d + "ScrollbarWrapper"].parentNode.removeChild(e[d + "ScrollbarWrapper"]), e[d + "ScrollbarWrapper"] = null, e[d + "ScrollbarIndicator"] = null)
        },
        _resize: function() {
            var a = this;
            setTimeout(function() {
                a.refresh()
            },
            d ? 200 : 0)
        },
        _pos: function(a, d) {
            a = this.hScroll ? a: 0,
            d = this.vScroll ? d: 0,
            this.options.useTransform ? this.scroller.style[c + "Transform"] = t + a + "px," + d + "px" + u + " scale(" + this.scale + ")": (a = b(a), d = b(d), this.scroller.style.left = a + "px", this.scroller.style.top = d + "px"),
            this.x = a,
            this.y = d,
            this._scrollbarPos("h"),
            this._scrollbarPos("v")
        },
        _scrollbarPos: function(a, d) {
            var e = this,
            f = a == "h" ? e.x: e.y,
            g; ! e[a + "Scrollbar"] || (f = e[a + "ScrollbarProp"] * f, f < 0 ? (e.options.fixedScrollbar || (g = e[a + "ScrollbarIndicatorSize"] + b(f * 3), g < 8 && (g = 8), e[a + "ScrollbarIndicator"].style[a == "h" ? "width": "height"] = g + "px"), f = 0) : f > e[a + "ScrollbarMaxScroll"] && (e.options.fixedScrollbar ? f = e[a + "ScrollbarMaxScroll"] : (g = e[a + "ScrollbarIndicatorSize"] - b((f - e[a + "ScrollbarMaxScroll"]) * 3), g < 8 && (g = 8), e[a + "ScrollbarIndicator"].style[a == "h" ? "width": "height"] = g + "px", f = e[a + "ScrollbarMaxScroll"] + (e[a + "ScrollbarIndicatorSize"] - g))), e[a + "ScrollbarWrapper"].style[c + "TransitionDelay"] = "0", e[a + "ScrollbarWrapper"].style.opacity = d && e.options.hideScrollbar ? "0": "1", e[a + "ScrollbarIndicator"].style[c + "Transform"] = t + (a == "h" ? f + "px,0": "0," + f + "px") + u)
        },
        _start: function(b) {
            var d = this,
            e = i ? b.touches[0] : b,
            f,
            g,
            h,
            j,
            k;
            if ( !! d.enabled) {
                d.options.onBeforeScrollStart && d.options.onBeforeScrollStart.call(d, b),
                (d.options.useTransition || d.options.zoom) && d._transitionTime(0),
                d.moved = !1,
                d.animating = !1,
                d.zoomed = !1,
                d.distX = 0,
                d.distY = 0,
                d.absDistX = 0,
                d.absDistY = 0,
                d.dirX = 0,
                d.dirY = 0,
                d.options.zoom && i && b.touches.length > 1 && (j = a.abs(b.touches[0].pageX - b.touches[1].pageX), k = a.abs(b.touches[0].pageY - b.touches[1].pageY), d.touchesDistStart = a.sqrt(j * j + k * k), d.originX = a.abs(b.touches[0].pageX + b.touches[1].pageX - d.wrapperOffsetLeft * 2) / 2 - d.x, d.originY = a.abs(b.touches[0].pageY + b.touches[1].pageY - d.wrapperOffsetTop * 2) / 2 - d.y, d.options.onZoomStart && d.options.onZoomStart.call(d, b));
                if (d.options.momentum) {
                    d.options.useTransform ? (f = getComputedStyle(d.scroller, null)[c + "Transform"].replace(/[^0-9-.,]/g, "").split(","), g = f[4] * 1, h = f[5] * 1) : (g = getComputedStyle(d.scroller, null).left.replace(/[^0-9-]/g, "") * 1, h = getComputedStyle(d.scroller, null).top.replace(/[^0-9-]/g, "") * 1);
                    if (g != d.x || h != d.y) d.options.useTransition ? d._unbind("webkitTransitionEnd") : m(d.aniTime),
                    d.steps = [],
                    d._pos(g, h)
                }
                d.absStartX = d.x,
                d.absStartY = d.y,
                d.startX = d.x,
                d.startY = d.y,
                d.pointX = e.pageX,
                d.pointY = e.pageY,
                d.startTime = b.timeStamp || Date.now(),
                d.options.onScrollStart && d.options.onScrollStart.call(d, b),
                d._bind(p),
                d._bind(q),
                d._bind(r)
            }
        },
        _move: function(b) {
            var d = this,
            e = i ? b.touches[0] : b,
            f = e.pageX - d.pointX,
            g = e.pageY - d.pointY,
            h = d.x + f,
            j = d.y + g,
            k,
            l,
            m,
            n = b.timeStamp || Date.now();
            d.options.onBeforeScrollMove && d.options.onBeforeScrollMove.call(d, b);
            if (d.options.zoom && i && b.touches.length > 1) k = a.abs(b.touches[0].pageX - b.touches[1].pageX),
            l = a.abs(b.touches[0].pageY - b.touches[1].pageY),
            d.touchesDist = a.sqrt(k * k + l * l),
            d.zoomed = !0,
            m = 1 / d.touchesDistStart * d.touchesDist * this.scale,
            m < d.options.zoomMin ? m = .5 * d.options.zoomMin * Math.pow(2, m / d.options.zoomMin) : m > d.options.zoomMax && (m = 2 * d.options.zoomMax * Math.pow(.5, d.options.zoomMax / m)),
            d.lastScale = m / this.scale,
            h = this.originX - this.originX * d.lastScale + this.x,
            j = this.originY - this.originY * d.lastScale + this.y,
            this.scroller.style[c + "Transform"] = t + h + "px," + j + "px" + u + " scale(" + m + ")",
            d.options.onZoom && d.options.onZoom.call(d, b);
            else {
                d.pointX = e.pageX,
                d.pointY = e.pageY;
                if (h > 0 || h < d.maxScrollX) h = d.options.bounce ? d.x + f / 2 : h >= 0 || d.maxScrollX >= 0 ? 0 : d.maxScrollX;
                if (j > d.minScrollY || j < d.maxScrollY) j = d.options.bounce ? d.y + g / 2 : j >= d.minScrollY || d.maxScrollY >= 0 ? d.minScrollY: d.maxScrollY;
                if (d.absDistX < 6 && d.absDistY < 6) {
                    d.distX += f,
                    d.distY += g,
                    d.absDistX = a.abs(d.distX),
                    d.absDistY = a.abs(d.distY);
                    return
                }
                d.options.lockDirection && (d.absDistX > d.absDistY + 5 ? (j = d.y, g = 0) : d.absDistY > d.absDistX + 5 && (h = d.x, f = 0)),
                d.moved = !0,
                d._pos(h, j),
                d.dirX = f > 0 ? -1 : f < 0 ? 1 : 0,
                d.dirY = g > 0 ? -1 : g < 0 ? 1 : 0,
                n - d.startTime > 300 && (d.startTime = n, d.startX = d.x, d.startY = d.y),
                d.options.onScrollMove && d.options.onScrollMove.call(d, b)
            }
        },
        _end: function(d) {
            if (!i || d.touches.length == 0) {
                var e = this,
                f = i ? d.changedTouches[0] : d,
                g,
                h,
                j = {
                    dist: 0,
                    time: 0
                },
                k = {
                    dist: 0,
                    time: 0
                },
                l = (d.timeStamp || Date.now()) - e.startTime,
                m = e.x,
                n = e.y,
                o,
                s,
                v,
                w,
                x;
                e._unbind(p),
                e._unbind(q),
                e._unbind(r),
                e.options.onBeforeScrollEnd && e.options.onBeforeScrollEnd.call(e, d);
                if (e.zoomed) {
                    x = e.scale * e.lastScale,
                    x = Math.max(e.options.zoomMin, x),
                    x = Math.min(e.options.zoomMax, x),
                    e.lastScale = x / e.scale,
                    e.scale = x,
                    e.x = e.originX - e.originX * e.lastScale + e.x,
                    e.y = e.originY - e.originY * e.lastScale + e.y,
                    e.scroller.style[c + "TransitionDuration"] = "200ms",
                    e.scroller.style[c + "Transform"] = t + e.x + "px," + e.y + "px" + u + " scale(" + e.scale + ")",
                    e.zoomed = !1,
                    e.refresh(),
                    e.options.onZoomEnd && e.options.onZoomEnd.call(e, d);
                    return
                }
                if (!e.moved) {
                    i && (e.doubleTapTimer && e.options.zoom ? (clearTimeout(e.doubleTapTimer), e.doubleTapTimer = null, e.options.onZoomStart && e.options.onZoomStart.call(e, d), e.zoom(e.pointX, e.pointY, e.scale == 1 ? e.options.doubleTapZoom: 1), e.options.onZoomEnd && setTimeout(function() {
                        e.options.onZoomEnd.call(e, d)
                    },
                    200)) : e.doubleTapTimer = setTimeout(function() {
                        e.doubleTapTimer = null,
                        g = f.target;
                        while (g.nodeType != 1) g = g.parentNode;
                        g.tagName != "SELECT" && g.tagName != "INPUT" && g.tagName != "TEXTAREA" && (h = document.createEvent("MouseEvents"), h.initMouseEvent("click", !0, !0, d.view, 1, f.screenX, f.screenY, f.clientX, f.clientY, d.ctrlKey, d.altKey, d.shiftKey, d.metaKey, 0, null), h._fake = !0, g.dispatchEvent(h))
                    },
                    e.options.zoom ? 250 : 0)),
                    e._resetPos(200),
                    e.options.onTouchEnd && e.options.onTouchEnd.call(e, d);
                    return
                }
                if (l < 300 && e.options.momentum) {
                    j = m ? e._momentum(m - e.startX, l, -e.x, e.scrollerW - e.wrapperW + e.x, e.options.bounce ? e.wrapperW: 0) : j,
                    k = n ? e._momentum(n - e.startY, l, -e.y, e.maxScrollY < 0 ? e.scrollerH - e.wrapperH + e.y - e.minScrollY: 0, e.options.bounce ? e.wrapperH: 0) : k,
                    m = e.x + j.dist,
                    n = e.y + k.dist;
                    if (e.x > 0 && m > 0 || e.x < e.maxScrollX && m < e.maxScrollX) j = {
                        dist: 0,
                        time: 0
                    };
                    if (e.y > e.minScrollY && n > e.minScrollY || e.y < e.maxScrollY && n < e.maxScrollY) k = {
                        dist: 0,
                        time: 0
                    }
                }
                if (j.dist || k.dist) {
                    v = a.max(a.max(j.time, k.time), 10),
                    e.options.snap && (o = m - e.absStartX, s = n - e.absStartY, a.abs(o) < e.options.snapThreshold && a.abs(s) < e.options.snapThreshold ? e.scrollTo(e.absStartX, e.absStartY, 200) : (w = e._snap(m, n), m = w.x, n = w.y, v = a.max(w.time, v))),
                    e.scrollTo(b(m), b(n), v),
                    e.options.onTouchEnd && e.options.onTouchEnd.call(e, d);
                    return
                }
                if (e.options.snap) {
                    o = m - e.absStartX,
                    s = n - e.absStartY,
                    a.abs(o) < e.options.snapThreshold && a.abs(s) < e.options.snapThreshold ? e.scrollTo(e.absStartX, e.absStartY, 200) : (w = e._snap(e.x, e.y), (w.x != e.x || w.y != e.y) && e.scrollTo(w.x, w.y, w.time)),
                    e.options.onTouchEnd && e.options.onTouchEnd.call(e, d);
                    return
                }
                e._resetPos(200),
                e.options.onTouchEnd && e.options.onTouchEnd.call(e, d)
            }
        },
        _resetPos: function(a) {
            var b = this,
            d = b.x >= 0 ? 0 : b.x < b.maxScrollX ? b.maxScrollX: b.x,
            e = b.y >= b.minScrollY || b.maxScrollY > 0 ? b.minScrollY: b.y < b.maxScrollY ? b.maxScrollY: b.y;
            d == b.x && e == b.y ? (b.moved && (b.moved = !1, b.options.onScrollEnd && b.options.onScrollEnd.call(b)), b.hScrollbar && b.options.hideScrollbar && (c == "webkit" && (b.hScrollbarWrapper.style[c + "TransitionDelay"] = "300ms"), b.hScrollbarWrapper.style.opacity = "0"), b.vScrollbar && b.options.hideScrollbar && (c == "webkit" && (b.vScrollbarWrapper.style[c + "TransitionDelay"] = "300ms"), b.vScrollbarWrapper.style.opacity = "0")) : b.scrollTo(d, e, a || 0)
        },
        _wheel: function(a) {
            var b = this,
            c, d, e, f, g;
            "wheelDeltaX" in a ? (c = a.wheelDeltaX / 12, d = a.wheelDeltaY / 12) : "detail" in a ? c = d = -a.detail * 3 : c = d = -a.wheelDelta;
            b.options.wheelAction == "zoom" ? (g = b.scale * Math.pow(2, 1 / 3 * (d ? d / Math.abs(d) : 0)), g < b.options.zoomMin && (g = b.options.zoomMin), g > b.options.zoomMax && (g = b.options.zoomMax), g != b.scale && (!b.wheelZoomCount && b.options.onZoomStart && b.options.onZoomStart.call(b, a), b.wheelZoomCount++, b.zoom(a.pageX, a.pageY, g, 400), setTimeout(function() {
                b.wheelZoomCount--,
                !b.wheelZoomCount && b.options.onZoomEnd && b.options.onZoomEnd.call(b, a)
            },
            400))) : (e = b.x + c, f = b.y + d, e > 0 ? e = 0 : e < b.maxScrollX && (e = b.maxScrollX), f > b.minScrollY ? f = b.minScrollY: f < b.maxScrollY && (f = b.maxScrollY), b.scrollTo(e, f, 0))
        },
        _mouseout: function(a) {
            var b = a.relatedTarget;
            if (!b) this._end(a);
            else {
                while (b = b.parentNode) if (b == this.wrapper) return;
                this._end(a)
            }
        },
        _transitionEnd: function(a) {
            var b = this;
            a.target == b.scroller && (b._unbind("webkitTransitionEnd"), b._startAni())
        },
        _startAni: function() {
            var b = this,
            c = b.x,
            d = b.y,
            e = Date.now(),
            f,
            g,
            h;
            if (!b.animating) {
                if (!b.steps.length) {
                    b._resetPos(400);
                    return
                }
                f = b.steps.shift(),
                f.x == c && f.y == d && (f.time = 0),
                b.animating = !0,
                b.moved = !0;
                if (b.options.useTransition) {
                    b._transitionTime(f.time),
                    b._pos(f.x, f.y),
                    b.animating = !1,
                    f.time ? b._bind("webkitTransitionEnd") : b._resetPos(0);
                    return
                }
                h = function() {
                    var i = Date.now(),
                    j,
                    k;
                    i >= e + f.time ? (b._pos(f.x, f.y), b.animating = !1, b.options.onAnimationEnd && b.options.onAnimationEnd.call(b), b._startAni()) : (i = (i - e) / f.time - 1, g = a.sqrt(1 - i * i), j = (f.x - c) * g + c, k = (f.y - d) * g + d, b._pos(j, k), b.animating && (b.aniTime = l(h)))
                },
                h()
            }
        },
        _transitionTime: function(a) {
            a += "ms",
            this.scroller.style[c + "TransitionDuration"] = a,
            this.hScrollbar && (this.hScrollbarIndicator.style[c + "TransitionDuration"] = a),
            this.vScrollbar && (this.vScrollbarIndicator.style[c + "TransitionDuration"] = a)
        },
        _momentum: function(c, d, e, f, g) {
            var h = 6e-4,
            i = a.abs(c) / d,
            j = i * i / (2 * h),
            k = 0,
            l = 0;
            c > 0 && j > e ? (l = g / (6 / (j / i * h)), e = e + l, i = i * e / j, j = e) : c < 0 && j > f && (l = g / (6 / (j / i * h)), f = f + l, i = i * f / j, j = f),
            j = j * (c < 0 ? -1 : 1),
            k = i / h;
            return {
                dist: j,
                time: b(k)
            }
        },
        _offset: function(a) {
            var b = -a.offsetLeft,
            c = -a.offsetTop;
            while (a = a.offsetParent) b -= a.offsetLeft,
            c -= a.offsetTop;
            a != this.wrapper && (b *= this.scale, c *= this.scale);
            return {
                left: b,
                top: c
            }
        },
        _snap: function(c, d) {
            var e = this,
            f, g, h, i, j, k;
            h = e.pagesX.length - 1;
            for (f = 0, g = e.pagesX.length; f < g; f++) if (c >= e.pagesX[f]) {
                h = f;
                break
            }
            h == e.currPageX && h > 0 && e.dirX < 0 && h--,
            c = e.pagesX[h],
            j = a.abs(c - e.pagesX[e.currPageX]),
            j = j ? a.abs(e.x - c) / j * 500 : 0,
            e.currPageX = h,
            h = e.pagesY.length - 1;
            for (f = 0; f < h; f++) if (d >= e.pagesY[f]) {
                h = f;
                break
            }
            h == e.currPageY && h > 0 && e.dirY < 0 && h--,
            d = e.pagesY[h],
            k = a.abs(d - e.pagesY[e.currPageY]),
            k = k ? a.abs(e.y - d) / k * 500 : 0,
            e.currPageY = h,
            i = b(a.max(j, k)) || 200;
            return {
                x: c,
                y: d,
                time: i
            }
        },
        _bind: function(a, b, c) { (b || this.scroller).addEventListener(a, this, !!c)
        },
        _unbind: function(a, b, c) { (b || this.scroller).removeEventListener(a, this, !!c)
        },
        destroy: function() {
            var a = this;
            a.scroller.style[c + "Transform"] = "",
            a.hScrollbar = !1,
            a.vScrollbar = !1,
            a._scrollbar("h"),
            a._scrollbar("v"),
            a._unbind(n, window),
            a._unbind(o),
            a._unbind(p),
            a._unbind(q),
            a._unbind(r),
            a.options.hasTouch && (a._unbind("mouseout", a.wrapper), a._unbind(s)),
            a.options.useTransition && a._unbind("webkitTransitionEnd"),
            a.options.checkDOMChanges && clearInterval(a.checkDOMTime),
            a.options.onDestroy && a.options.onDestroy.call(a)
        },
        refresh: function() {
            var a = this,
            d, e, f, g, h = 0,
            i = 0;
            a.scale < a.options.zoomMin && (a.scale = a.options.zoomMin),
            a.wrapperW = a.wrapper.clientWidth || 1,
            a.wrapperH = a.wrapper.clientHeight || 1,
            a.minScrollY = -a.options.topOffset || 0,
            a.scrollerW = b(a.scroller.offsetWidth * a.scale),
            a.scrollerH = b((a.scroller.offsetHeight + a.minScrollY) * a.scale),
            a.maxScrollX = a.wrapperW - a.scrollerW,
            a.maxScrollY = a.wrapperH - a.scrollerH + a.minScrollY,
            a.dirX = 0,
            a.dirY = 0,
            a.options.onRefresh && a.options.onRefresh.call(a),
            a.hScroll = a.options.hScroll && a.maxScrollX < 0,
            a.vScroll = a.options.vScroll && (!a.options.bounceLock && !a.hScroll || a.scrollerH > a.wrapperH),
            a.hScrollbar = a.hScroll && a.options.hScrollbar,
            a.vScrollbar = a.vScroll && a.options.vScrollbar && a.scrollerH > a.wrapperH,
            d = a._offset(a.wrapper),
            a.wrapperOffsetLeft = -d.left,
            a.wrapperOffsetTop = -d.top;
            if (typeof a.options.snap == "string") {
                a.pagesX = [],
                a.pagesY = [],
                g = a.scroller.querySelectorAll(a.options.snap);
                for (e = 0, f = g.length; e < f; e++) h = a._offset(g[e]),
                h.left += a.wrapperOffsetLeft,
                h.top += a.wrapperOffsetTop,
                a.pagesX[e] = h.left < a.maxScrollX ? a.maxScrollX: h.left * a.scale,
                a.pagesY[e] = h.top < a.maxScrollY ? a.maxScrollY: h.top * a.scale
            } else if (a.options.snap) {
                a.pagesX = [];
                while (h >= a.maxScrollX) a.pagesX[i] = h,
                h = h - a.wrapperW,
                i++;
                a.maxScrollX % a.wrapperW && (a.pagesX[a.pagesX.length] = a.maxScrollX - a.pagesX[a.pagesX.length - 1] + a.pagesX[a.pagesX.length - 1]),
                h = 0,
                i = 0,
                a.pagesY = [];
                while (h >= a.maxScrollY) a.pagesY[i] = h,
                h = h - a.wrapperH,
                i++;
                a.maxScrollY % a.wrapperH && (a.pagesY[a.pagesY.length] = a.maxScrollY - a.pagesY[a.pagesY.length - 1] + a.pagesY[a.pagesY.length - 1])
            }
            a._scrollbar("h"),
            a._scrollbar("v"),
            a.zoomed || (a.scroller.style[c + "TransitionDuration"] = "0", a._resetPos(200))
        },
        scrollTo: function(a, b, c, d) {
            var e = this,
            f = a,
            g, h;
            e.stop(),
            f.length || (f = [{
                x: a,
                y: b,
                time: c,
                relative: d
            }]);
            for (g = 0, h = f.length; g < h; g++) f[g].relative && (f[g].x = e.x - f[g].x, f[g].y = e.y - f[g].y),
            e.steps.push({
                x: f[g].x,
                y: f[g].y,
                time: f[g].time || 0
            });
            e._startAni()
        },
        scrollToElement: function(b, c) {
            var d = this,
            e;
            b = b.nodeType ? b: d.scroller.querySelector(b); ! b || (e = d._offset(b), e.left += d.wrapperOffsetLeft, e.top += d.wrapperOffsetTop, e.left = e.left > 0 ? 0 : e.left < d.maxScrollX ? d.maxScrollX: e.left, e.top = e.top > d.minScrollY ? d.minScrollY: e.top < d.maxScrollY ? d.maxScrollY: e.top, c = c === undefined ? a.max(a.abs(e.left) * 2, a.abs(e.top) * 2) : c, d.scrollTo(e.left, e.top, c))
        },
        scrollToPage: function(a, b, c) {
            var d = this,
            e, f;
            d.options.onScrollStart && d.options.onScrollStart.call(d),
            d.options.snap ? (a = a == "next" ? d.currPageX + 1 : a == "prev" ? d.currPageX - 1 : a, b = b == "next" ? d.currPageY + 1 : b == "prev" ? d.currPageY - 1 : b, a = a < 0 ? 0 : a > d.pagesX.length - 1 ? d.pagesX.length - 1 : a, b = b < 0 ? 0 : b > d.pagesY.length - 1 ? d.pagesY.length - 1 : b, d.currPageX = a, d.currPageY = b, e = d.pagesX[a], f = d.pagesY[b]) : (e = -d.wrapperW * a, f = -d.wrapperH * b, e < d.maxScrollX && (e = d.maxScrollX), f < d.maxScrollY && (f = d.maxScrollY)),
            d.scrollTo(e, f, c || 400)
        },
        disable: function() {
            this.stop(),
            this._resetPos(0),
            this.enabled = !1,
            this._unbind(p),
            this._unbind(q),
            this._unbind(r)
        },
        enable: function() {
            this.enabled = !0
        },
        stop: function() {
            this.options.useTransition ? this._unbind("webkitTransitionEnd") : m(this.aniTime),
            this.steps = [],
            this.moved = !1,
            this.animating = !1
        },
        zoom: function(a, b, d, e) {
            var f = this,
            g = d / f.scale; ! f.options.useTransform || (f.zoomed = !0, e = e === undefined ? 200 : e, a = a - f.wrapperOffsetLeft - f.x, b = b - f.wrapperOffsetTop - f.y, f.x = a - a * g + f.x, f.y = b - b * g + f.y, f.scale = d, f.refresh(), f.x = f.x > 0 ? 0 : f.x < f.maxScrollX ? f.maxScrollX: f.x, f.y = f.y > f.minScrollY ? f.minScrollY: f.y < f.maxScrollY ? f.maxScrollY: f.y, f.scroller.style[c + "TransitionDuration"] = e + "ms", f.scroller.style[c + "Transform"] = t + f.x + "px," + f.y + "px" + u + " scale(" + d + ")", f.zoomed = !1)
        },
        isReady: function() {
            return ! this.moved && !this.zoomed && !this.animating
        }
    },
    typeof exports != "undefined" ? exports.iScroll = v: window.iScroll = v
})(),
function(a) {
    var b = "ontouchstart" in a,
    c = b ? "touchstart": "mousedown",
    d = b ? "touchmove": "mousemove",
    e = b ? "touchend": "mouseup",
    f = b ? "touchcancel": "mouseup";
    avatarScroll = function(a) {
        var b = this;
        for (var c in a) b[c] = a[c]
    },
    avatarScroll.prototype = {
        handleEvent: function(a) {
            var g = this;
            switch (a.type) {
            case c:
                if (!b && a.button !== 0) return;
                g.__start(a);
                break;
            case d:
                g.__move(a);
                break;
            case e:
            case f:
                g.__end(a)
            }
        },
        VALID_DISTANCE: 50,
        __validation: !0,
        __reference: {
            dom: null,
            x: null,
            y: null
        },
        __current: {
            avatar: null,
            tool: null
        },
        __bind: function(a, b, c) {
            var d = this,
            e = document;
            e.addEventListener(a, d, !!c)
        },
        __unbind: function(a, b, c) {
            var d = this,
            e = document;
            e.removeEventListener(a, d, !!c)
        },
        __start: function(a) {
            var b = this;
            b.__reference = b.__getReference(a),
            b.__validation = b.__valid(b.__reference.dom)
        },
        __move: function(a) {
            var c = this;
            if (c.__validation) {
                var d = {
                    x: b ? a.touches[0].pageX: a.pageX,
                    y: b ? a.touches[0].pageY: a.pageY
                };
                c.__validation = Math.abs(c.__reference.x - d.x) > c.VALID_DISTANCE || Math.abs(c.__reference.y - d.y) > c.VALID_DISTANCE ? !1 : !0
            }
        },
        __end: function(a) {
            var b = this;
            if (b.__validation) b.__open();
            else if (b.__current.tool && b.__reference.dom) {
                var c = !0;
                b.__current.tool.each(function(a, d) {
                    d !== b.__reference.dom && (c = !1, $(d).children().each(function(a, d) {
                        d === b.__reference.dom && !$(d).hasClass("headimg-scroll-ctrl") && (c = !0)
                    }))
                }),
                c || (b.__close(), a.preventDefault())
            }
        },
        __getReference: function(a) {
            var c = this,
            d = {};
            d.dom = a.target,
            d.x = b ? a.touches[0].pageX: a.pageX,
            d.y = b ? a.touches[0].pageY: a.pageY;
            return d
        },
        __getCurrent: function() {
            var a = this,
            b = {};
            b.avatar = a.__reference.dom,
            b.tool = a.__getTool();
            return b
        },
        __getTool: function() {
            var a = this,
            b = null,
            c = $(a.__reference.dom);
            while ((b = c.find("." + a.toolCls)).length === 0 && c.get(0).tagName.toUpperCase() !== "UL") c = c.parent();
            return b && b.length > 0 && b.get(0).tagName.toUpperCase() !== "UL" ? b: null
        },
        __valid: function(a) {
            var b = this;
            return $(a).hasClass(b.avatarCls) ? !0 : !1
        },
        __open: function() {
            var a = this,
            b = a.__reference.dom !== a.__current.avatar;
            a.__actived && a.__close();
            if (b) {
                a.__current = a.__getCurrent();
                if (!a.__current.tool) return;
                var c = $(a.__current.tool);
                c.removeClass(a.closeCls),
                c.addClass(a.openCls),
                c.attr("selected", !0),
                a.__actived = !0
            }
        },
        __close: function() {
            var a = this;
            if (a.__actived) {
                var b = $(a.__current.tool);
                b.removeClass(a.openCls),
                b.addClass(a.closeCls),
                b.removeAttr("selected")
            }
            a.__actived = !1,
            a.__validation = !0,
            a.__current = {
                avatar: null,
                tool: null
            }
        },
        avatarCls: "t_avatar",
        toolCls: "t_tool",
        openCls: "t_open",
        closeCls: "t_close",
        startup: function() {
            var a = this;
            a.__bind(c),
            a.__bind(d),
            a.__bind(e),
            a.__bind(f)
        },
        destroy: function() {
            var a = this;
            a.__close(),
            a.__reference = {
                dom: null,
                x: null,
                y: null
            },
            a.__unbind(c),
            a.__unbind(d),
            a.__unbind(e),
            a.__unbind(f)
        }
    },
    a.avatarScroll = avatarScroll
} (window),
document.addEventListener("DOMContentLoaded",
function() {
    var a = new avatarScroll({
        openCls: "headimg-scroll-tool-open",
        closeCls: "headimg-scroll-tool-close"
    });
    g_isLogin && a.startup()
},
!1),
function(a) {
    var b = "ontouchstart" in a,
    c = b ? "touchstart": "mousedown",
    d = b ? "touchmove": "mousemove",
    e = b ? "touchend": "mouseup",
    f = b ? "touchcancel": "mouseup";
    bannerScroll = function(a) {
        var b = this;
        for (var c in a) b[c] = a[c]
    },
    bannerScroll.prototype = {
        handleEvent: function(a) {
            var g = this;
            switch (a.type) {
            case c:
                if (!b && a.button !== 0) return;
                g.__start(a);
                break;
            case d:
                g.__move(a);
                break;
            case e:
            case f:
                g.__end(a)
            }
        },
        VALID_DISTANCE: 50,
        DEFAULT_DURATION: 400,
        DIRECTION_CLICK: "click",
        DIRECTION_LEFT: "left",
        DIRECTION_RIGHT: "right",
        __validation: !0,
        __startPoint: null,
        __startTransformPoint: null,
        __currentIndex: null,
        __banner: null,
        __sliding: !1,
        __bind: function(a, b, c) {
            var d = this,
            e = b || document;
            e.addEventListener(a, d, !!c)
        },
        __unbind: function(a, b, c) {
            var d = this,
            e = b || document;
            e.removeEventListener(a, d, !!c)
        },
        __start: function(a) {
            var c = this;
            c.__startPointTime = (new Date).getTime(),
            c.__startPoint = {
                x: b ? a.touches[0].pageX: event.pageX,
                y: b ? a.touches[0].pageY: event.pageY
            },
            c.__startTransformPoint = c.__getTransformPosition(),
            c.__bind(d, c.banner),
            c.__bind(e, c.banner),
            c.__bind(f, c.banner)
        },
        __move: function(a) {
            var c = this,
            d = {
                x: b ? a.touches[0].pageX: event.pageX,
                y: b ? a.touches[0].pageY: event.pageY
            };
            c.__sliding = c.__isSlide(d, c.__startPoint),
            c.__sliding && (c.__setTransformPosition(c.banner, {
                x: d.x - c.__startPoint.x + c.__startTransformPoint.x,
                y: 0,
                z: 0
            },
            0), a.preventDefault())
        },
        __end: function(a) {
            var c = this,
            g = (new Date).getTime(),
            h = {
                x: b ? a.changedTouches[0].pageX: event.pageX,
                y: b ? a.changedTouches[0].pageY: event.pageY
            },
            i = c.__startPoint.x - h.x,
            j = c.__getDirection(c.__startPoint.x - h.x);
            c.__timeDistance = g - c.__startPointTime,
            c.isPaging && Math.abs(i) <= c.VALID_DISTANCE && j != c.DIRECTION_CLICK ? c.__setTransformPosition(c.banner, c.__startTransformPoint, c.DEFAULT_DURATION) : j == c.DIRECTION_CLICK ? c.onClick && c.onClick.call(this, a) : j == c.DIRECTION_LEFT ? c.next() : j == c.DIRECTION_RIGHT && c.previous(),
            c.__startPoint = null,
            c.__startTransformPoint = null,
            c.__unbind(d, c.banner),
            c.__unbind(e, c.banner),
            c.__unbind(f, c.banner),
            c.__sliding = !1
        },
        __isSlide: function(a, b) {
            return Math.abs(b.x - a.x) > Math.abs(b.y - a.y) ? !0 : !1
        },
        __getDirection: function(a) {
            var b = this;
            if (a == 0 || a > 0 && a < 5) return b.DIRECTION_CLICK;
            if (a > 0) return b.DIRECTION_LEFT;
            if (a < 0) return b.DIRECTION_RIGHT
        },
        __getTransformPosition: function() {
            var a = this,
            b = a.banner.style.webkitTransform;
            b = b.replace("translate3d(", ""),
            b = b.substr(0, b.indexOf(")")),
            b = b.split(",");
            return {
                x: b[0] ? parseInt(b[0]) : 0,
                y: b[1] ? parseInt(b[1]) : 0,
                z: b[2] ? parseInt(b[2]) : 0
            }
        },
        __setTransformPosition: function(a, b, c) {
            a && (a.style.webkitTransform = "translate3d(" + b.x + "px, " + b.y + "px, " + b.z + "px)", a.style.webkitTransitionDuration = c + "ms")
        },
        unit: 320,
        initPosition: {
            x: 0,
            y: 0,
            z: 0
        },
        number: 0,
        width: 0,
        isPaging: !0,
        banner: null,
        onClick: null,
        onPrevious: null,
        onNext: null,
        onLoad: null,
        getCurrentIndex: function() {
            var a = this;
            return a.__currentIndex
        },
        next: function() {
            var a = this,
            b = a.__getTransformPosition(),
            c,
            d,
            e = a.DEFAULT_DURATION;
            a.isPaging ? (d = (a.number - 1) * a.unit * -1, c = b.x <= d ? d: b.x % a.unit != 0 ? Math.floor(b.x / a.unit) * a.unit: b.x - a.unit, a.__currentIndex = Math.abs(c / a.unit)) : (d = a.width * -1, c = b.x <= d ? d: b.x, c = a.__timeDistance <= 300 ? c - 200 : c, c = c <= d ? d: c),
            a.__setTransformPosition(a.banner, {
                x: c,
                y: 0,
                z: 0
            },
            e),
            a.onNext && a.onNext.call(this, a.__currentIndex)
        },
        previous: function() {
            var a = this,
            b = a.__getTransformPosition(),
            c = 0,
            d = a.DEFAULT_DURATION;
            a.isPaging ? (x = b.x >= c ? c: b.x % a.unit != 0 ? Math.ceil(b.x / a.unit) * a.unit: b.x + a.unit, a.__currentIndex = Math.abs(x / a.unit)) : (x = b.x >= c ? c: b.x, x = a.__timeDistance <= 300 ? x + 200 : x, x = x >= c ? c: x),
            a.__setTransformPosition(a.banner, {
                x: x,
                y: 0,
                z: 0
            },
            d),
            a.onPrevious && a.onPrevious.call(this, a.__currentIndex)
        },
        startup: function() {
            var a = this;
            a.__setTransformPosition(a.banner, a.initPosition, a.DEFAULT_DURATION),
            a.__bind(c, a.banner),
            a.onLoad && a.onLoad.call(this)
        },
        destroy: function() {
            var a = this;
            a.__startPoint = {
                x: null,
                y: null
            },
            a.__unbind(c, a.banner),
            a.__unbind(d, a.banner),
            a.__unbind(e, a.banner),
            a.__unbind(f, a.banner),
            a.banner = null,
            a.onClick = null,
            a.onPrevious = null,
            a.onNext = null
        }
    },
    a.bannerScroll = bannerScroll
} (window),
DeviceFeature = function() {
    function c() {
        var b = a();
        return b.match(/android\s+4\./i) != null ? !0 : !1
    }
    function b() {
        var b = a();
        return b.match(/webkit.+chrome/i) != null ? !0 : b.match(/os\s+5_.+mac os/i) != null ? !0 : b.match(/os\s+6_.+mac os/i) != null ? !0 : b.match(/Android 2.3/i) != null ? !0 : b.match(/Android 4./i) != null ? !0 : !1
    }
    function a() {
        return navigator.userAgent
    }
    return {
        isSupportFixed: b,
        isAndroid4: c
    }
} (),
function(a) {
    var b = "ontouchstart" in a,
    c = b ? "touchstart": "mousedown",
    d = b ? "touchmove": "mousemove",
    e = b ? "touchend": "mouseup",
    f = b ? "touchcancel": "mouseup",
    g = [];
    ClickCount = function(a) {
        var b = this;
        for (var c in a) b[c] = a[c]
    },
    ClickCount.prototype = {
        handleEvent: function(a) {
            var b = this;
            switch (a.type) {
            case e:
                b.__end(a)
            }
        },
        __bind: function(a, b, c) {
            var d = this,
            e = document;
            e.addEventListener(a, d, !!c)
        },
        __end: function(a) {
            var b = this,
            c = localStorageObj.get("writehis"),
            d = b.__getReference(a),
            e = $(d.dom),
            f = e.attr("href"),
            g,
            h = null,
            i = null,
            j = null;
            if (e.hasClass("t_listen_class")) {
                var k = e.attr("clickid");
                e.hasClass("t_tab_listen_class") ? localStorageObj.remove("writehis") : (h = 0, i = k, j = 0);
                var l = null;
                l = localStorageObj.get("clickhis"),
                l ? (l.num += 1, l.clickid = l.clickid + "|" + k) : (l = {},
                l.num = 1, l.clickid = k),
                localStorageObj.set("clickhis", l)
            } else if (e.data("advid")) h = e.data("advid"),
            i = e.data("posid"),
            j = e.data("type");
            else if (f) {
                g = util.strToObj(f);
                for (var m in g) switch (m) {
                case "advid":
                    h = g[m];
                    break;
                case "posid":
                    i = g[m];
                    break;
                case "adtype":
                    j = g[m];
                    break;
                default:
                }
            }
            h !== null && i !== null && (c = i + "," + h + ",1," + j + ",0", localStorageObj.set("writehis", c))
        },
        __getReference: function(a) {
            var b = this,
            c = {};
            c.dom = a.target;
            return c
        },
        init: function() {
            var a = this;
            a.__bind(e)
        },
        destroy: function() {
            var a = this;
            a.__unbind(e)
        }
    }
} (window),
document.addEventListener("DOMContentLoaded",
function() {
    var a = new ClickCount({
        listenCls: "t_listen_class"
    });
    a.init()
},
!1),
function(a) {
    WriteFromCount = function() {
        this.hashChangeCount = 0,
        this.advId = null,
        this.navPageArray = ["myhome", "notification", "hot", "channels", "app", "famous"]
    },
    WriteFromCount.prototype = {
        getWriteFrom: function() {
            return this.hashChangeCount < 5 && this.advId != null ? this.advId: null
        },
        resetWriteFrom: function() {
            this.hashChangeCount = 0,
            this.advId = null
        },
        setFWCount: function(a, b) {
            for (var c = 0; c < this.navPageArray.length; c++) if (b == this.navPageArray[c]) {
                this.hashChangeCount = 0,
                this.advId = null;
                return
            }
            a == null ? this.advId != null && this.hashChangeCount++:a == this.advId ? this.hashChangeCount++:(this.hashChangeCount = 0, this.advId = a)
        },
        getParams: function(a, b) {
            var c = this;
            if (a == g_ac.AC_MSG_POST || a == g_ac.AC_MSG_REPLY || a == g_ac.AC_MSG_FORWARD || a == g_ac.AC_MSG_DIRECT || a == g_ac.AC_MSG_DIRECT_REPLY || a == g_ac.AC_MSG_DIRECT_MANUAL) {
                var d = c.getWriteFrom();
                d != null && (b.advid = d, c.resetWriteFrom())
            }
            return b
        }
    }
} (window);
var wfCount = new WriteFromCount,
NavControl = function() {
    function x() {
        r(),
        v(),
        w()
    }
    function w() {
        var a = $("nav.main-nav > span");
        $("nav.main-nav a").each(function(b) {
            var c = b * a.width();
            $(this).tap(function(b) {
                var d = b.target,
                e;
                while (d.tagName != "A") d = d.parentNode;
                $("nav.main-nav a").removeClass("main-nav-current"),
                $(d).addClass("main-nav-current"),
                e = d.getAttribute("href"),
                e && (a.css("display") == "none" ? (a.css("top", "0"), a.css("-webkit-transform", "translate3d(" + c + "px, 0, 0)"), a.css("-webkit-transition-duration", "0"), setTimeout(function() {
                    a.css("display", "block"),
                    a.css("-webkit-transition-duration", "400ms")
                },
                0)) : (a.css("display", "block"), a.css("-webkit-transform", "translate3d(" + c + "px, 0, 0)")), location.hash = e)
            })
        })
    }
    function v() {
        if (!loginPop.isSupportNotLogin() && !g_isLogin && !loginPop.getIsFromClick()) loginPop.goToLogin();
        else {
            var b = util.getHashParams(),
            c = b.pageId,
            f = b.urlParams ? b.urlParams: {},
            g,
            i = util.getUrlParams().coid;
            i && cookieObj.set("coid", i),
            wfCount.setFWCount(f.advid, c),
            m[i] ? m[i].nav1.hidepages.indexOf(c) != -1 || m[i].nav1.hidepages.indexOf("all") != -1 ? (NavControl.navConf = m[i].nav1.navconf, NavControl.isSpecial = !0) : (NavControl.navConf = m[i].nav2.navconf, NavControl.isSpecial = !0) : NavControl.isSpecial = !1,
            d !== undefined ? g = {
                urlParams: f,
                forceRefresh: d
            }: g = {
                urlParams: f
            },
            c = c == "" ? "myhome": c,
            PageManager.require(c,
            function() {
                var a;
                touch_console_log && console.log((new Date).getTime() - window.startTime + "nav enter " + b.pageId);
                if (j) if (k.indexOf(j) == -1) a = PageManager.getObj(util.getHashParams(j).pageId);
                else {
                    var d = h.indexOf(j) + 1;
                    a = PageManager.getObj(util.getHashParams(h[d]).pageId)
                }
                a && a.leave && a.leave();
                var e = PageManager.getObj(c);
                e.lastHash && e.lastHash != location.hash && (g.forceRefresh = !0, e.forceRefresh = !0),
                e.enter(g),
                MoveableNav.shift()
            },
            this,
            function() {
                location.hash = e
            }),
            d = undefined,
            a++
        }
    }
    function u() {
        if (NavControl.prevHash != location.hash) {
            for (var a = 0, b = f.length; a < b; a++) f[a](),
            f.unshift(a);
            v()
        }
        setTimeout(u, 500)
    }
    function t(a, b) {
        var c = $.isEmptyObject(b) ? "#" + a: "#" + a + "/" + util.objToStr(b);
        if (a == "spam") {
            var d = util.getHashParams(j),
            f = util.getHashParams(i);
            if (d.pageId == f.pageId) return
        }
        decodeURIComponent(c) != decodeURIComponent(location.hash) && a != e && util.pushHashParams({
            pageId: a,
            urlParams: b
        })
    }
    function s() {
        var a = util.getHashParams(j),
        b = util.getHashParams(i);
        d = a.pageId == b.pageId,
        history.back()
    }
    function r() {
        c = "onhashchange" in window,
        g.unshift(location.hash),
        c ? $(window).bind("hashchange", q) : u(),
        location.hash && (g.unshift(location.hash), h.unshift(location.hash))
    }
    function q() {
        i = location.hash,
        j = h[0],
        h.unshift(i),
        h.length = b * 2,
        k.indexOf(i) < 0 && i != g[0] && g.unshift(i ? i: e),
        g.length = b;
        if (k.indexOf(i) >= 0) {
            if (!f[i]) {
                history.go( - 1);
                return
            }
        } else {
            if (f[i] && f[i].In) {
                var a = f[i].In;
                if (k.indexOf(i) >= 0) {
                    for (var c = 0; c < a.length; c++) a[c](),
                    o(i, "In", a[c]);
                    return
                }
                for (var c = 0; c < a.length; c++) a[c]()
            }
            if (f[j] && f[j].Out) {
                var a = f[j].Out;
                if (k.indexOf(j) >= 0) for (var c = 0; c < a.length; c++) a[c](),
                o(j, "Out", a[c]);
                else for (var c = 0; c < a.length; c++) a[c]()
            }
            v()
        }
    }
    function p(a, b, c) {
        k.indexOf(a) < 0 && k.push(a),
        n(a, b, c)
    }
    function o(a, b, c) {
        var d;
        f[a] && f[a][b] && (d = f[a][b].indexOf(c), f[a][b].splice(d, 1), f[a][b].length || delete f[a][b], $.isEmptyObject(f[a]) && delete f[a])
    }
    function n(a, b, c) {
        f[a] = f[a] || {},
        f[a][b] = f[a][b] || [],
        f[a][b].push(c)
    }
    var a = 0,
    b = 6,
    c, d, e = window.g_isLogin ? "myhome": "hot",
    f = {},
    g = [],
    h = [],
    i,
    j,
    k = [],
    l = ["compose"],
    m = window.fromCfgNew;
    return {
        assignHash: t,
        init: x,
        back: s,
        hashList: g,
        addHashListener: n,
        addException: p
    }
} ();
window.firstload = !0,
window.animationlock = !1,
window.lastshowDom = {};
var pageQueue = [];
window.transition = {
    slide: {
        sin: {
            forward: {
                start: "translate(100%,0%)",
                end: "translate(0%,0%)"
            },
            reverse: {
                start: "translate(-100%,0%)",
                end: "translate(0%,0%)"
            }
        },
        out: {
            forward: {
                start: "translate(0%,0%)",
                end: "translate(-100%,0%)"
            },
            reverse: {
                start: "translate(0%,0%)",
                end: "translate(100%,0%)"
            }
        }
    },
    slideup: {
        sin: {
            forward: {
                start: "translate(0%,100%)",
                end: "translate(0%,0%)"
            },
            reverse: {
                start: "translate(0%,-100%)",
                end: "translate(0%,100%)"
            }
        },
        out: {
            forward: {
                start: "translate(0%,0%)",
                end: "translate(0%,0%)"
            },
            reverse: {
                start: "translate(0%,0%)",
                end: "translate(0%,0%)"
            }
        }
    }
};
var PageManager = function() {
    function s(b, c, d, e) {
        c = c ? c: function() {},
        d = d ? d: this;
        if (!a[b]) {
            Canvas.loading();
            var f = lazy_load_module_path + b + module_postfix;
            util.scriptLoader(f,
            function() {
                Canvas.unloading(),
                a[b] ? c.call(d) : e.call(d)
            })
        } else c.call(d)
    }
    function r() {
        return PageManager.getObj(util.getHashParams(NavControl.prevHash).pageId)
    }
    function q() {
        var a = util.getHashParams().pageId ? util.getHashParams().pageId: f,
        b = NavControl.hashList.length,
        c = NavControl.hashList[b - 2];
        return PageManager.getObj(a) ? PageManager.getObj(a) : PageManager.getObj(c)
    }
    function p(a, b) {
        var c = k(a) ? k(a) : k("myhome");
        NavControl.assignHash(a, b);
        var f = o(),
        g = $(document).scrollTop();
        m(f, g);
        var i = a + (b ? util.objToStr(b, !0) : ""),
        j = c.scrollTop ? c.scrollTop: n(i);
        h(a),
        d && a != d.id && (PageManager.scrollTimer = setTimeout(function() {
            c.isRefresh ? (document.body.scrollTop = 0, c.isRefresh = !1) : $(document).scrollTop(j)
        },
        200)),
        d = c,
        e = b
    }
    function o() {
        var a = d ? d.id: "myhome",
        b = e ? util.objToStr(e, !0) : "";
        return a + b
    }
    function n(a) {
        var b = c[a];
        return b ? b: 0
    }
    function m(a, b) {
        c[a] = b
    }
    function l(b) {
        if (a[b]) return a[b]["class"]
    }
    function k(c) {
        var d;
        if (b[c]) return b[c];
        if (!a[c]) return null;
        d = j(c),
        b[c] = d;
        return d
    }
    function j(b) {
        function f() {
            this.id = b;
            return c.apply(this, d)
        }
        var c = a[b]["class"],
        d = a[b].args,
        e;
        f.prototype = c.prototype,
        e = new f;
        return e
    }
    function i(a) {
        var b = (new Date).getTime();
        for (;;) if ((new Date).getTime() - b > a) break
    }
    function h(a) {
        var b = util.getUrlParams("coid"),
        c = {
            foot1: $("#t_foot1"),
            foot2: $("#t_foot2"),
            head1: $("#t_head1"),
            head2: $("#t_head2")
        };
        $("#placeholder").length && $("#placeholder").remove(),
        d && d.jObj && (d.jObj.attr("selected", ""), d.jObjSubNav && d.jObjSubNav.attr("selected", ""));
        var e = k(a);
        e.jObj.attr("selected", "true"),
        e.jObjSubNav && e.jObjSubNav[0] && e.jObjSubNav.attr("selected", "true");
        if (NavControl.isSpecial) {
            setTimeout(function() {
                MoveableNav.revoke()
            },
            200);
            if (NavControl.navConf) for (var f in NavControl.navConf) {
                var g = NavControl.navConf[f];
                g == "hide" ? c[f].hide() : c[f].show()
            }
        } else for (var h in c) c[h].show()
    }
    function g(b, c, d) {
        $.isArray(d) || (d = [d]),
        c.prototype instanceof Page ? a[b] = {
            "class": c,
            args: d
        }: console.error("must register with Page subclass")
    }
    var a = {},
    b = {},
    c = {},
    d = null,
    e = null,
    f = window.g_isLogin ? "myhome": "hot";
    return {
        setPagePosition: m,
        getPagePosition: n,
        getLastPage: r,
        register: g,
        getObj: k,
        go: p,
        showDOM: h,
        getCurrentPage: q,
        getClass: l,
        require: s
    }
} (),
loginPop = function() {
    function w(a, b) {
        if (!loginPop.isLogin() || !!g_userUnReg) {
            b || (b = $(document.documentElement)),
            b.data("loginCheckItems") || b.data("loginCheckItems", []);
            var c = b.data("loginCheckItems");
            if (!b.get(0) || !c) return;
            $.isArray(a) ? c = c.concat(a) : c.push(a),
            b.data("loginCheckItems", c);
            var d = "ontouchstart" in window;
            $(b).bind("touchstart mousedown click",
            function(a) {
                var b = $(a.currentTarget).data("loginCheckItems"),
                c = $(a.target),
                d = b.join(","); ! window.g_isLogin && (c.filter(d) && c.filter(d).length > 0 || c.parents(d) && c.parents(d).length > 0) && (a.preventDefault(), a.stopImmediatePropagation ? a.stopImmediatePropagation() : a.stopPropagation(), loginPop.show())
            },
            !0)
        }
    }
    function v() {
        g = event.srcElement.href || event.srcElement.parentElement.href,
        Mqq.util.commLogin.init({
            bidCode: "microblogLogin",
            callback: p
        }),
        setTimeout(function() {
            $("#ptlogin-lock").height(document.body.scrollHeight + "px")
        },
        200)
    }
    function u() {
        return window.g_isLogin
    }
    function t() {
        e.hide(),
        f.hide()
    }
    function s() {
        var a = ($(window).height() - e.height()) / 2;
        e.css("top", a + $(window).scrollTop() + "px")
    }
    function r(a) {
        h = a
    }
    function q() {
        return h
    }
    function p(a) {
        function i() {
            var a = PageManager.getCurrentPage(),
            e = cssFormal ? cssPath + "wb-" + currentSkin + ".min.css": cssPath + "wb-" + currentSkin + ".css";
            window.g_userUnReg ? n() : (localStorageObj.set("sid", f), $("footer #t_user-name").text(window.g_usrName), a.refresh()),
            getText(e,
            function(a) {
                localStorageObj.get("touchCssText" + currentSkin, a),
                localStorageObj.get("touchCssVersion", currentVersion);
                if (bManifest) $("#cssskin")[0].href = e;
                else {
                    var b = $('<style id="cssskin" data-src="' + e + '">' + localStorageObj.get("touchCssText" + currentSkin) + "</style>")[0];
                    $("head")[0].replaceChild(b, $("#cssskin")[0])
                }
            }),
            b.length > 0 && b.unbind("click").attr("href", "#myhome").text("主页"),
            c.length > 0 && c.unbind("click").text("消息").attr("href", "#notification"),
            $("footer .auth_only").show(),
            $("#t_exit").text("退出").removeClass("login");
            for (var i = 0; i < d.length; i++) d[i].href = d[i].href.replace(/sid=\w*&/, "sid=" + f + "&");
            var j = new avatarScroll({
                openCls: "headimg-scroll-tool-open",
                closeCls: "headimg-scroll-tool-close"
            });
            j.startup(),
            g && !window.g_userUnReg && (h = !0, window.location.href = g, g = "")
        }
        var b = $("#t_nav1"),
        c = $("#t_nav2"),
        d = $("a[href*='sid']"),
        e,
        f = a.info.sid;
        e = "/touch/iphone/jsvariable.jsp?msgid=null&sid=" + f + "&tmstp=-1&jto=-1&g_f=&allow=true",
        util.scriptLoader(e, i)
    }
    function o() {
        var a = $("#t_nav1"),
        b = $("#t_nav2"),
        c = $("#t_exit");
        a.bind("click",
        function() {
            if (a.hasClass("t_login")) m();
            else return ! 1
        }),
        b.bind("click",
        function() {
            if (b.hasClass("t_reg")) n();
            else return ! 1
        }),
        c.bind("click",
        function() {
            c.hasClass("t_login") ? m() : k()
        })
    }
    function n() {
        window.location.assign(c)
    }
    function m() {
        var a = "",
        c = "",
        d = util.getUrlParams(),
        e = location.protocol + "//" + location.host + location.pathname;
        d.sid = "00",
        a = "?" + util.objToStr(d),
        c = encodeURIComponent(e + a + location.hash),
        window.location.href = b + c
    }
    function l() {
        if (g_isqqbrowser37) {
            function a(a, b, c, d, e) {
                var f = e.split(" ");
                f = f[0] + " " + f[1] + "-" + f[2] + "-" + f[3] + " " + f[4] + " " + f[5];
                return [a + "=" + b, "domain=" + c, "path=" + d, "expires=" + f].join("; ")
            }
            T5Kit.user.setQCookie(function() {},
            function() {},
            {
                QCookie: a("sid", g_sid, ".qq.com", "/", (new Date).toGMTString())
            })
        }
        localStorageObj.remove("sid")
    }
    function k() {
        var a = location.search,
        b = location.hash,
        c = util.getHashParams(),
        e = location.protocol + "//" + location.host + location.pathname,
        f;
        l();
        if (g_from_qqbrowser && !g_from_qqbrowser_ios) {
            var g = encodeURIComponent("http://ti.3g.qq.com/touch/iphone/index.jsp"),
            h = encodeURIComponent("http://pt.3g.qq.com/s?aid=touchLogin&t=weibo&bid_code=microblogLogin&g_ut=3&go_url=" + g);
            window.location.href = d.replace("{SID}", g_sid) + h
        } else j() ? (loginPop.haveShowExit = !1, f = a, a = a.replace("sid=" + g_sid, ""), c.urlParams.logout = 1, b = "#" + util.objToHash(c), window.location.href = a + b, setTimeout(function() {
            f == a && window.location.reload()
        },
        25)) : m()
    }
    function j() {
        var a = window.publicPage,
        b = util.getHashParams().pageId;
        return a.indexOf(b) != -1
    }
    function i() {
        var a = $("#t_nav1"),
        b = $("#t_nav2"),
        c = $("#t_exit"); ! loginPop.isLogin() || g_userUnReg ? (a.length > 0 && a.text("登录").addClass("t_login").removeAttr("href"), b.length > 0 && b.text("注册").addClass("t_reg").removeAttr("href"), c.text("登录").addClass("t_login"), $("footer .auth_only").hide(), $("#t_user-name").text("腾讯微博触屏版"), loginPop.registerLoginCheck(".t_auth")) : $("footer #t_user-name").text(window.g_usrName),
        o()
    }
    var a = "http://ti.3g.qq.com/touch/iphone/index.jsp",
    b = "http://pt.3g.qq.com/s?aid=touchLogin&t=weibo&bid_code=microblogLogin&g_ut=3&go_url=",
    c = "http://pt.3g.qq.com/s?g_ut=2&aid=nLoginmb&cd_f=-&q_from=weiboreg&g_f=6859",
    d = "http://pt.3g.qq.com/s?sid={SID}&aid=nLogout&redir_url=",
    e = null,
    f = null,
    g = null,
    h = !1;
    return {
        init: i,
        isSupportNotLogin: j,
        isLogin: u,
        getIsFromClick: q,
        setIsFromClick: r,
        registerLoginCheck: w,
        goToReg: n,
        goToLogin: m,
        logout: k,
        show: v,
        close: t
    }
} ();
MessageLayer.prototype = new Layer,
MessageLayer.prototype.constructor = MessageLayer,
$.extend(MessageLayer.prototype, {
    init: function(a) {
        function c(a) {
            b.opts = a
        }
        var b = this;
        this.opts = a,
        this.bindAction(),
        this.init = c
    },
    bindAction: function() {
        var a = this,
        b = a.jObj;
        b.delegate("a[action-data='close']", "click",
        function() {
            a.hide()
        }),
        b.delegate("a.t_go_superqq", "click",
        function() {
            location.href = "http://kf.3g.qq.com/g/s?sid=" + g_sid + "&aid=kftemplate&tid=faqlist&pid=2&fid=3"
        }),
        b.delegate("a.t_cancel", "click",
        function() {
            a.hide()
        })
    },
    setContent: function(a) {
        this.jObj.find("#t_msg_content").text(a)
    },
    show: function(a) {
        Layer.prototype.show.call(this, a),
        window.activedLayObj = this
    },
    setCenter: function(a) {
        var b;
        window.navigator.userAgent.indexOf("MQQBrowser") != "-1" ? b = 0 : b = window.navigator.standalone == !0 ? 0 : 30;
        var c = this;
        if (!a) {
            var d = ($(window).height() - c.jObj.height()) / 2,
            e = d + $(window).scrollTop() + b - 140;
            window.navigator.userAgent.indexOf("MQQBrowser") != "-1" && (e += 80),
            c.jObj.css("top", e < 0 ? 0 : e + 80 + "px")
        }
        c.jObj.css("visibility", "visible")
    }
});
var messageLayer = null;
$(document).ready(function() {
    messageLayer = new MessageLayer
}),
ShareLayer.prototype = new Layer,
ShareLayer.prototype.constructor = ShareLayer,
$.extend(ShareLayer.prototype, {
    isLayer: !1,
    init: function(a) {
        function c(a) {
            b.opts = a
        }
        var b = this;
        this.opts = a,
        this.bindAction(),
        this.init = c
    },
    bindAction: function() {
        var a = this,
        b = a.jObj;
        a.count = new WritePlus.Count(a.writeTextArea, a.numTip),
        this.jObj.find("a.t_writepop_clear").click(function(c) {
            b.find("#t_wirte_textarea").val(""),
            a.count.updateDisplay(140)
        }),
        b.delegate("a[action-data='close']", "click",
        function() {
            a.hide()
        }),
        this.jObj.find("a.t_wirte_send-btn").click(function(b) {
            if (!a.isPosting) {
                if (a.count.getNum() < 0) {
                    Tips.blink("fail", "字数超过140字限制");
                    return
                }
                a.isPosting = !0;
                var c = {
                    msg: a.jObj.find("#t_wirte_textarea").val(),
                    ac: g_ac.AC_MSG_POST
                };
                a.submit(c)
            }
        })
    },
    submit: function(a) {
        var b = a.ac;
        LoadingController.pubLoading();
        $.trim(a.msg) == "" && b != g_ac.AC_MSG_FORWARD ? (LoadingController.unloading(), Tips.blink("fail", "请输入内容"), this.isPosting = !1) : NetWork.sendMsg(this, a)
    },
    setContent: function(a) {
        this.jObj.find("#t_wirte_textarea").val(a)
    },
    show: function(a) {
        Layer.prototype.show.call(this, a),
        shareLayer.writeTextArea.focus(),
        window.activedLayObj = this
    },
    errorReaction: function(a) {
        shareLayer.isPosting = !1,
        LoadingController.unloading(),
        shareLayer.hide()
    },
    sendReaction: function(a) {
        this.isPosting = !1;
        var b = this.jObj,
        c = $("#d_myhome");
        LoadingController.unloading(),
        a.result == 0 ? (shareLayer.hide(), Tips.blink("success", "分享成功"), Page.prototype.insertNewMessage.call(this, c, a)) : Tips.blink("fail")
    }
});
var shareLayer = null;
$(document).ready(function() {
    shareLayer = new ShareLayer
}),
MorePopLayer.prototype = new Layer,
MorePopLayer.prototype.constructor = MorePopLayer,
$.extend(MorePopLayer.prototype, {
    isLayer: !1,
    init: function(a) {
        function c(a) {
            b.opts = a,
            b.changeOptions()
        }
        var b = this;
        this.opts = a,
        this.bindAction(),
        this.changeOptions(),
        this.init = c
    },
    bindAction: function() {
        var a = this,
        b = a.jObj,
        c = {
            reply: {
                ac: g_ac.AC_MSG_REPLY
            },
            delmsg: {
                ac: g_ac.AC_MSG_DEL
            },
            addblack: {
                ac: g_ac.AC_ADD_BLACK_USER_LIST
            },
            forward: {
                ac: g_ac.AC_MSG_FORWARD
            },
            addfav: {
                ac: g_ac.AC_MSG_KEEP,
                params: g_ac.AC_MSG_KEEP
            },
            delfav: {
                ac: g_ac.AC_MSG_DROP,
                params: g_ac.AC_MSG_DROP
            }
        };
        for (var d in c) b.delegate("[data-ac='" + c[d].ac + "']", "click",
        function(b) {
            return function() {
                var d = a.opts;
                a.hide(),
                d.point = d.point ? d.point: d.optsObj,
                d.point && d.optsObj[b].call(d.point, c[b].params)
            }
        } (d));
        b.delegate("a[action-data='close']", "click",
        function() {
            a.hide()
        })
    },
    changeOptions: function() {
        var a = {
            addfav: '<a data-ac="' + g_ac.AC_MSG_KEEP + '">收藏</a>',
            delfav: '<li><a data-ac="' + g_ac.AC_MSG_DROP + '">取消收藏</a></li>',
            reply: '<a data-ac="' + g_ac.AC_MSG_REPLY + '">对话</a>',
            delmsg: '<a data-ac="' + g_ac.AC_MSG_DEL + '">删除</a>'
        },
        b = this.opts,
        c = b.optsObj,
        d,
        e = [];
        for (d in c) e.push(a[d]);
        this.jObj.find("div.t_wb-dialog-list").html(e.join(""))
    }
});
var morePopLayer = null;
$(document).ready(function() {
    morePopLayer = new MorePopLayer
}),
PicMorePopLayer.prototype = new Layer,
PicMorePopLayer.prototype.constructor = PicMorePopLayer,
$.extend(PicMorePopLayer.prototype, {
    isLayer: !1,
    init: function() {
        var a = this;
        this.bindAction()
    },
    bindAction: function() {
        var a = PageManager.getCurrentPage(),
        b = a.jObj,
        c = this,
        d = c.jObj;
        this.jObj.find("a.t_modify_pic").click(function(d) {
            a.tabOne(3, d),
            b.find("div.t_wb-upload-pic").show(),
            b.find("div.t_wb-input-cont").hide(),
            c.hide()
        }),
        this.jObj.find("a.t_delete_pic").click(function(a) {
            g_msgImage = "",
            b.find("div.t_img-display").hide(),
            b.find("img.t_ico-img")[0].src = "",
            c.hide()
        }),
        d.delegate("a[action-data='close']", "click",
        function() {
            c.hide()
        })
    }
});
var picMorePopLayer = null;
$(document).ready(function() {
    picMorePopLayer = new PicMorePopLayer
}),
WritePopLayer.prototype = new Layer,
WritePopLayer.prototype.constructor = WritePopLayer,
$.extend(WritePopLayer.prototype, {
    isLayer: !1,
    init: function() {
        var a = this;
        this.bindAction()
    },
    bindAction: function() {
        var a = this,
        b = a.jObj;
        a.count = new WritePlus.Count(a.writeTextArea, a.numTip),
        this.jObj.find("a.t_writepop_clear").click(function(c) {
            b.find("#t_wirte_textarea").val(""),
            a.count.updateDisplay(140)
        }),
        this.jObj.find("a.t_writepop_ico-bq").click(function(b) {
            a.hide(),
            a.page = PageManager.getCurrentPage(),
            a.showFace()
        }),
        this.jObj.find("a.t_writepop_ico-at").click(function(b) {
            a.hide(),
            a.page = PageManager.getCurrentPage(),
            a.showAt()
        }),
        this.jObj.find("a.t_wirte_send-btn").click(function(b) {
            if (!a.isPosting) {
                if (a.count.getNum() < 0) {
                    Tips.blink("fail", "字数超过140字限制");
                    return
                }
                a.isPosting = !0;
                var c = a.writeParams,
                d = c.uid ? c.uid: c.msg.jObj.attr("usrid"),
                e = "";
                c.msg && (e = c.msgid || c.msg.jObj.attr("msgid"));
                var f = {
                    msg: a.jObj.find("#t_wirte_textarea").val(),
                    ac: c.ac,
                    onlyComment: c.onlyComment,
                    mid: e,
                    fu: d,
                    tu: d
                };
                c.msg ? a.writeParams.msg.submit(f) : (f.msg = "@" + d + " " + f.msg, a.submit(f))
            }
        }),
        b.delegate("a[action-data='close']", "click",
        function() {
            NavControl.isSpecial || MoveableNav.show(),
            a.hide()
        })
    },
    submit: function(a) {
        var b = a.ac;
        LoadingController.pubLoading();
        $.trim(a.msg) == "" && b != g_ac.AC_MSG_FORWARD ? (LoadingController.unloading(), Tips.blink("fail", "请输入内容"), this.isPosting = !1) : NetWork.sendMsg(this, a)
    },
    errorReaction: function(a) {
        writePopLayer.isPosting = !1,
        LoadingController.unloading(),
        writePopLayer.hide()
    },
    sendReaction: function(a) {
        this.isPosting = !1;
        var b = this.jObj,
        c = $("#d_myhome");
        LoadingController.unloading(),
        writePopLayer.hide(),
        a.result == 0 ? (Tips.blink("success", "已发布"), Page.prototype.insertNewMessage.call(this, c, a)) : Tips.blink("fail")
    },
    hideCurrentPageDom: function() {
        var a = writePopLayer.page;
        a && a.jObj && (a.jObj.removeAttr("selected"), a.jObjSubNav && a.jObjSubNav.removeAttr("selected"))
    },
    showCurrentPageDom: function() {
        var a = writePopLayer.page;
        a && a.jObj.attr("selected", "true"),
        a && a.jObjSubNav && a.jObjSubNav[0] && a.jObjSubNav.attr("selected", "true")
    },
    show: function(a) {
        Layer.prototype.show.call(this, a),
        writePopLayer.writeTextArea.focus(),
        writePopLayer.writeTextArea.setSelectionRange(0, 0),
        window.activedLayObj = this
    },
    showAt: function() {
        MoveableNav.hide();
        var a = $("#forward_at"),
        b = $("#forward_face"),
        c = this;
        b.hide();
        var d = writePopLayer.jObj.css("top"),
        e = $(document).scrollTop(),
        f = writePopLayer.writeTextArea.selectionStart;
        c.lastPos = f,
        c.topValue = d,
        c.scrollValue = e,
        writePopLayer.hideCurrentPageDom(),
        window.activedLayer = a,
        a.show();
        var g = a.find("input.t_text-input-forwardAt")[0],
        h = a.find("div.t_wrapper_input-cont")[0],
        i = {
            type: "at",
            elInput: writePopLayer.writeTextArea,
            elWrapper: h,
            lastPostion: c.lastPos,
            onInputEnd: function(d) {
                NavControl.isSpecial || MoveableNav.show(),
                b.hide(),
                a.hide(),
                MoveableNav.show(),
                writePopLayer.showCurrentPageDom(),
                writePopLayer.show(!0),
                writePopLayer.writeTextArea.focus(),
                writePopLayer.writeTextArea.setSelectionRange(c.lastPos + d, c.lastPos + d)
            },
            onCancel: function() {
                NavControl.isSpecial || MoveableNav.show(),
                MoveableNav.show(),
                b.hide(),
                a.hide(),
                writePopLayer.showCurrentPageDom(),
                writePopLayer.show(!0),
                writePopLayer.writeTextArea.focus(),
                writePopLayer.writeTextArea.setSelectionRange(c.lastPos, c.lastPos)
            }
        };
        g.value = "",
        this.atPage == null ? this.atPage = new WritePlus.UserList(i) : this.atPage.refreshData(),
        a.find("button.t_forwardAt_enter").click(function(c) {
            b.hide(),
            a.hide(),
            writePopLayer.showCurrentPageDom(),
            writePopLayer.showLast(),
            writePopLayer.writeTextArea.focus()
        }),
        setTimeout(function() {
            window.scrollTo(0, 1)
        },
        0)
    },
    showFace: function() {
        MoveableNav.hide();
        var a = $("#forward_face"),
        b = $("#forward_at"),
        c = this;
        b.hide();
        var d = writePopLayer.jObj.css("top"),
        e = $(document).scrollTop();
        c.topValue = d,
        c.scrollValue = e,
        writePopLayer.hideCurrentPageDom(),
        window.activedLayer = a,
        a.show();
        var f = function() {
            NavControl.isSpecial || MoveableNav.show(),
            a.hide(),
            b.hide(),
            writePopLayer.showCurrentPageDom(),
            writePopLayer.showLast(),
            writePopLayer.writeTextArea.focus(),
            MoveableNav.show()
        };
        a.find("a.t_forwardFace_back").click(function(a) {
            f()
        }),
        this.facePage == null && (this.facePage = new WritePlus.Face({
            elemTextArea: writePopLayer.writeTextArea,
            elemWrapper: a.find("div.t_input_faces_div")[0],
            onInputEnd: f
        })),
        setTimeout(function() {
            window.scrollTo(0, 1)
        },
        0)
    },
    dialogOpen: function(a, b) {
        this.init();
        var c = "对" + b + "说:",
        d = {
            srcContent: "",
            fContent: "",
            strTip: c,
            buttonTxt: "发送",
            ac: g_ac.AC_MSG_AT,
            onlyComment: 0,
            image: !1,
            uid: a
        },
        e = this;
        this.jObj.find("h2.t_wirte_wb-dialog-title").html(d.strTip),
        this.jObj.find("#t_wirte_textarea").val(d.fContent),
        this.jObj.find("div.t_wirte_wb-info").hide(),
        this.jObj.find("a.t_wirte_send-btn").html(d.buttonTxt),
        this.writeParams = d,
        setTimeout(function() {
            e.writeTextArea.focus()
        },
        200),
        this.show()
    },
    setParams: function(a) {
        this.jObj.find("div.t_wirte_wb-info").show();
        var b = this;
        this.jObj.find("h2.t_wirte_wb-dialog-title").html(a.strTip),
        this.jObj.find("#t_wirte_textarea").val(a.fContent),
        this.jObj.find("div.t_wirte_wb-info").html(a.srcContent),
        this.jObj.find("a.t_wirte_send-btn").html(a.buttonTxt),
        this.writeParams = a,
        setTimeout(function() {
            b.writeTextArea.focus()
        },
        200)
    }
});
var writePopLayer = null,
privateLayer = null;
$(document).ready(function() {
    writePopLayer = new WritePopLayer,
    privateLayer = new PrivateLayer
}),
PrivateLayer.prototype = new Layer,
PrivateLayer.prototype.constructor = PrivateLayer,
$.extend(PrivateLayer.prototype, {
    isLayer: !1,
    open: function(a) {
        a = a ? a: {},
        this.currentPage = PageManager.getCurrentPage(),
        a.lastContent && (this.last.html(a.lastContent), this.last.show()),
        a.toUser && (this.userInput.value = a.toUser),
        this.sendReaction = a.sendReaction ? a.sendReaction: this.sendReaction,
        window.activedLayObj = this,
        Layer.prototype.show.call(this)
    },
    close: function() {
        this.last.hide(),
        this.userInput.value = "",
        this.textarea.value = "",
        Layer.prototype.hide.call(this)
    },
    send: function() {
        var a = this.textarea.value.replace(/\s/ig, ""),
        b = this.userInput.value,
        c = {};
        if (!b) {
            alert("您还没有输入用户id");
            return ! 1
        }
        if (!a) {
            alert("您还没有输入内容");
            return ! 1
        }
        c.tu = b,
        c.msg = a,
        c.ac = g_ac.AC_MSG_DIRECT,
        LoadingController.pubLoading(),
        NetWork.sendMsg(this, c)
    },
    tagglePage: function() {
        var a = this.currentPage,
        b;
        this.taggle ? (b = "true", this.taggle = !1) : (b = "", this.taggle = !0),
        a && a.jObj && a.jObj.attr("selected", b),
        a && a.jObjSubNav && a.jObjSubNav.attr("selected", b)
    },
    bindAction: function() {
        var a = this,
        b = function() {
            MoveableNav.hide(),
            window.activedLayer = $(a.faceLayer),
            a.faceLayer.style.display = "",
            a.face.scroller.refresh(),
            a.hide(),
            a.tagglePage(),
            a.topValue = writePopLayer.jObj.css("top"),
            a.scrollValue = $(document).scrollTop()
        },
        c = function() {
            MoveableNav.show(),
            a.faceLayer.style.display = "none",
            a.tagglePage(),
            a.showLast(),
            NavControl.isSpecial || MoveableNav.show()
        },
        d = function() {
            MoveableNav.show(),
            a.privateToLayer.style.display = "none",
            a.tagglePage(),
            a.showLast(),
            NavControl.isSpecial || MoveableNav.show()
        },
        e = function() {
            MoveableNav.hide(),
            window.activedLayer = $(a.privateToLayer),
            a.privateToLayer.style.display = "",
            a.hide(),
            a.tagglePage(),
            a.topValue = writePopLayer.jObj.css("top"),
            a.scrollValue = $(document).scrollTop(),
            a.privateTo ? a.privateTo.scroller.refresh.call(a.privateTo.scroller) : a.privateTo = new WritePlus.UserList({
                type: "pri",
                elInput: a.userInput,
                elWrapper: a.privateToLayer,
                onCancel: d,
                onInputEnd: d
            })
        };
        a.faceLayer = document.getElementById("private_face"),
        a.privateToLayer = document.getElementById("private_t_list");
        var f = a.faceLayer.querySelector(".t_forwardFace_back");
        new WritePlus.Count(this.textarea, this.disNum),
        this.face = new WritePlus.Face({
            elemTextArea: this.textarea,
            elemWrapper: a.faceLayer.querySelector("div.t_input_faces_div"),
            onInputEnd: c
        }),
        f.addEventListener("click", c),
        a.closeBtn.addEventListener("click",
        function() {
            a.close()
        }),
        a.postBtn.addEventListener("click",
        function() {
            a.send()
        }),
        a.clearBtn.addEventListener("click",
        function() {
            a.textarea.value = "",
            setTimeout(function() {
                a.textarea.focus()
            },
            0)
        }),
        a.faceBtn.bind("click", b),
        a.listBtn.bind("click", e)
    },
    sendReaction: function(a) {
        LoadingController.unloading(),
        a.result == "0" ? (Tips.blink("success", "已发送"), this.close(), setTimeout(function() {
            PageManager.require("notification",
            function() {
                PageManager.getObj("notification").refreshPri = !0
            }),
            PageManager.getCurrentPage().refresh()
        },
        500)) : Tips.blink("fail", "发送失败")
    }
}),
UserInfoLayer.prototype = new Layer,
UserInfoLayer.prototype.constructor = UserInfoLayer,
$.extend(UserInfoLayer.prototype, {
    isLayer: !1,
    init: function(a) {
        function c(a) {
            b.opts = a
        }
        var b = this;
        this.opts = a,
        this.bindAction(),
        this.init = c
    },
    bindAction: function() {
        var a = this;
        a.jObj.find(".t_close_pop_info").click(function(b) {
            a.hide()
        }),
        a.jObj.find(".t_home_avatar").click(function(b) {
            b.stopPropagation(),
            a.hide()
        })
    },
    hide: function() {
        Layer.prototype.hide.call(this)
    },
    setCenter: function(a) {
        var b;
        window.navigator.userAgent.indexOf("MQQBrowser") != "-1" ? b = 0 : b = window.navigator.standalone == !0 ? 0 : 30;
        var c = this;
        if (!a && c.jObj) {
            var d = 0;
            MoveableNav.isDisplayed() ? d = $(window).scrollTop() + 95 : d = 95,
            currentSkin == 1 && (d = d - 4),
            c.jObj.css("top", (d < 0 ? 0 : d) + "px")
        }
        c.jObj && c.jObj.css("visibility", "visible")
    },
    show: function(a) {
        Layer.prototype.show.call(this, a);
        var b = this,
        c = b.jObj;
        c.show(),
        NetWork.commonRequest(b, {
            ac: g_ac.AC_HOME_HEAD
        },
        function(a) {
            a.result == 0 && (window.activedLayObj = this, c.find(".t_home_avatar").css("background", "url(" + g_usrimg + ")"), c.find(".t_username").text(a.jsonDump.nickName), g_isVip ? c.find(".t_vip").show() : c.find(".t_vip").hide(), c.find(".t_level").text(a.jsonDump.level), a.jsonDump.isNewMission ? c.find(".t_daily").addClass("day-task-link") : c.find(".t_daily").removeClass("day-task-link"), c.find(".t_user-followerNum").text(a.jsonDump.followerAmount), c.find(".t_user-followingNum").text(a.jsonDump.followingAmount), c.find(".t_user-postNum").text(a.jsonDump.publishAmount), c.find(".t_todayExp").text(a.jsonDump.todayExp))
        })
    }
});
var userInfoLayer = null;
$(document).ready(function() {
    userInfoLayer = new UserInfoLayer
}),
$.extend(Layer.prototype, {
    isLayer: !0,
    hide: function() {
        this.scrollPosAtShow = null,
        this.jObj && this.jObj.hide(),
        this.scroll && this.scrollunBind(),
        this.blackLayer.hide()
    },
    show: function(a) {
        var b = this;
        g_from_android && (b.scrollPosAtShow = $(document).scrollTop(), $(document).bind("scroll",
        function() {
            var a = function() {
                $(document).scrollTop(b.scrollPosAtShow),
                $(document).unbind("touchend", a)
            };
            $(document).bind("touchend", a)
        })),
        this.blackLayer.css("height", document.body.scrollHeight + "px"),
        this.blackLayer.show(),
        this.jObj && (this.jObj.show(), this.jObj.css("visibility", "visible")),
        !a && b.setCenter(a),
        setTimeout(function() {
            a && $(document).scrollTop(b.scrollValue)
        },
        400)
    },
    showLast: function() {
        this.show(this.topValue)
    },
    setCenter: function(a) {
        var b;
        window.navigator.userAgent.indexOf("MQQBrowser") != "-1" ? b = 0 : b = window.navigator.standalone == !0 ? 0 : 30;
        var c = this;
        if (!a && c.jObj) {
            var d = ($(window).height() - c.jObj.height()) / 2,
            e = d + $(window).scrollTop() + b - 140;
            window.navigator.userAgent.indexOf("MQQBrowser") != "-1" && (e += 80),
            c.jObj.css("top", (e < 0 ? 0 : e) + "px")
        }
        c.jObj && c.jObj.css("visibility", "visible")
    }
});
var redirectLayer = function() {
    var a = {},
    b = '<div class="url-jump" id="url-jump" style="bottom:auto;display:none"><p>我们为您适配了更适合您手机屏幕并更节省流量的手机版，若您依然想访问PC版，请点击进入。</p><p><a href="http://t.qq.com?touch">进入PC版</a><a class="t_noPop" onclick="">不再提示</a></p></div>',
    c = function() {
        a.jObj.hide()
    };
    a.jObj = $(b),
    $(document.body).append(a.jObj),
    a.show = function() {
        var b = cookieObj.get("nojump");
        setTimeout(function() {
            var b = $(window).scrollTop() + window.innerHeight - 20 - a.jObj.height();
            a.jObj.css("top", b + "px")
        },
        100),
        b != "false" ? a.jObj.show() : a.jObj.hide(),
        a.jObj.delegate("a.t_noPop", "click", a.hide),
        $(document).bind("touchmove", c)
    },
    a.hide = function() {
        cookieObj.set("nojump", "false"),
        a.jObj.hide(),
        $(document).unbind("touchmove", c)
    };
    return a
} ();
MessageContainer.prototype = function() {
    function g() {
        var a = e.call(this);
        return localStorageObj.get(a)
    }
    function f(a) {
        var b = e.call(this)
    }
    function e() {
        var a = this.pageObj.id,
        b = this.mst;
        if (typeof a == "undefined") console.error("pageId or mst undefined");
        else {
            var c = "last_refresh_data_" + a + "_" + b;
            return c
        }
    }
    function d(a) {
        var b = this.getMoreParam = c.call(this, a);
        NetWork.commonRequest(this, b,
        function(a) {
            this.getMoreData = a
        })
    }
    function c(a) {
        var b = a.find(".t_btn-getmore");
        if (b.length < 1) console.error("can't find getMore Btn");
        else {
            var c = b.attr("data-mid"),
            d = b.attr("data-mrt");
            if (typeof c == "undefined" || typeof d == "undefined") {
                console.error("get more btn havn't mid or mrt");
                return
            }
            if (!this.pageObj.updateArgument) {
                console.error("this.pageObj.updateArgument no exist!");
                return
            }
            var e = {
                mid: c,
                mrt: d
            };
            e = $.extend({
                more: 1
            },
            this.pageObj.updateArgument, e);
            return e
        }
    }
    function b(a) {
        var b = a.jsonDump.mst,
        c = this.pageObj.jObj.find("ul[mst='" + b + "'] > li.wb-more");
        if (!c || c.length < 1) console.error("error, can't find get more li");
        else {
            var e = this.pageObj,
            f = "renderOptions" in e ? e.renderOptions: null,
            g = ejsRender(a.jsonDump, f),
            h = $(g);
            this.pageObj.instanceListContent(h, this.mst),
            this.pageObj.bindGetMore(h),
            h.get(0).nodeName === "UL" ? c.replaceWith(h.children("li")) : c.replaceWith(h),
            h = this.pageObj.jObj.find("ul[mst='" + b + "']"),
            !0 === this.pageObj.prefetchGetMoreData && d.call(this, h)
        }
    }
    function a(a) {
        var b = this.pageObj,
        c = "renderOptions" in b ? b.renderOptions: null,
        d = MessagePage.refreshRenderProxy(a, c);
        d.addClass("t_open"),
        b.instanceListContent(d, this.mst),
        b.bindGetMore(d);
        var e = b.jObj.find('ul[mst="' + this.mst + '"]');
        if (e.length > 0) e.replaceWith(d);
        else {
            b.jObj.find("ul[mst]").removeClass("t_open").hide();
            var g = b.jObj.find("div[content]");
            g.length > 0 ? g.append(d) : b.jObj.append(d)
        } ! 0 === this.pageObj.saveLastRefreshData && f.call(this, a)
    }
    return {
        refreshWithData: a,
        showMoreWithData: b,
        getRefreshData: g
    }
} ();
var NotifiStatus = function() {
    function q() {
        var a = f + e * f * 2;
        clearTimeout(g),
        g = setTimeout(function() {
            m()
        },
        a)
    }
    function p() {
        var a = [h.unread, h.mention + h.follower + h.direct],
        b = [$("nav > a.t_status_myhome > span"), $("nav > a.t_status_notification > span")],
        c = {
            1 : "tips-1",
            2 : "tips-2",
            3 : "tips-more"
        },
        d = function(a) {
            var b = a.toString().length;
            return b >= 3 ? c[3] : c[b]
        };
        for (var e = 0; e < a.length; e++) a[e] > 0 ? b[e].length && (a[e] > 99 && (a[e] = "99+"), b[e][0].outerHTML = '<span class="' + d(a[e]) + '">' + a[e] + "</span>") : b[e].length && b[e].hide();
        if (location.hash.indexOf("notification") != -1) {
            var f = $("#d_notification li a > span");
            f[0].innerHTML = h.direct ? h.direct: "",
            f[1].innerHTML = h.mention ? h.mention: "",
            f[2].innerHTML = h.follower ? h.follower: ""
        }
    }
    function o(a) {
        var b = a.info;
        d = 0;
        if (a.result !== 0) console.error("can not get new unread data");
        else {
            for (var c in b) {
                if (i[c]) continue;
                h[c] = b[c],
                d += b[c]
            }
            p(),
            e = d == 0 ? 0 : e,
            MoveableNav.setMentionStatus(d > 0)
        }
    }
    function n(a) {
        var c = l[a].ac; ! b || (i[a] = !0, d -= h[a], h[a] = 0, e = 0, p(), q(), MoveableNav.setMentionStatus(d > 0))
    }
    function m() {
        i = {},
        c({
            url: a,
            dataType: "json",
            data: {
                ac: g_ac.AC_NEW_DATA,
                nocache: new Date * 1
            },
            success: function(a) {
                e++,
                o(a),
                q()
            },
            error: q
        })
    }
    var a = g_action,
    b = g_isLogin | !1,
    c = $.ajax,
    d = 0,
    e = 0,
    f = 3e4,
    g, h = {},
    i = {},
    j = $("nav > a.t_status_myhome > span"),
    k = $("nav > a.t_status_notification > span"),
    l = {
        unread: {
            ac: g_ac.AC_CLEAR_UNREAD,
            jObj: j
        },
        direct: {
            ac: g_ac.AC_CLEAR_DIRECT,
            jObj: k
        },
        mention: {
            ac: g_ac.AC_CLEAR_MENTIONED,
            jObj: k
        },
        follower: {
            ac: g_ac.AC_CLEAR_FOLLOWER,
            jObj: k
        }
    };
    b && setTimeout(m, 3e3);
    return {
        clearData: n,
        getData: function() {
            return h
        },
        getMemStatus: function() {
            var a = h;
            a.myhome = h.unread,
            a["private"] = h.direct,
            a.follower = h.follower,
            a.mentioned = h.mention;
            return a
        }
    }
} (),
Tips = function() {
    var a = 2e3,
    b = 700,
    c = 36,
    d = "touchstart" in window ? "touchstart": "click",
    e = function(a) {
        this.DOM = a,
        this._ajustDefaultPos(),
        this._BindtouchAction(),
        this._BindDefaultAction()
    };
    e.prototype._ajustDefaultPos = function() {
        var a = $("body").scrollTop(),
        b = window.navigator.userAgent.indexOf("MQQBrowser") != "-1" && a != 0 && !g_from_android ? 45 : 0;
        this.DOM.css("position", "absolute").css("display", "block").css("top", a - c - b + "px")
    },
    e.prototype._BindtouchAction = function() {
        var a = this,
        b = function() {
            $(document).unbind(d, b).unbind("scroll", b),
            a.remove()
        };
        $(document).bind(d, b).bind("scroll", b),
        event && (event.preventDefault(), event.stopPropagation())
    },
    e.prototype._BindDefaultAction = function() {
        var b = this;
        if (this.DOM) setTimeout(function() {
            b.hide.call(b)
        },
        a);
        else return ! 1
    },
    e.prototype.show = function() {
        var a = this.DOM;
        $(document.body).append(a),
        setTimeout(function() {
            a.css("-webkit-transform", "translate(0px, " + c + "px)"),
            a.css("-webkit-transition", "-webkit-transform 0.3s ease-in-out")
        },
        0)
    },
    e.prototype.remove = function() {
        var a = this.DOM;
        a.fadeOut(b,
        function() {
            a.remove()
        })
    },
    e.prototype.hide = function() {
        var a = this.DOM;
        a.bind("webkitTransitionEnd",
        function() {
            a.remove()
        }),
        a.css("-webkit-transform", "")
    };
    var f = function(a, b) {
        var c = {
            success: '<div class="txt-tips"><div class="seccess-tips"><span>发送成功</span></div></div>',
            fail: '<div class="txt-tips"><div class="error-tips"><span>发送失败</span></div></div>',
            offline: '<div class="txt-tips"><div class="error-tips"><span>无法连接 请检查网络</span></div></div>'
        },
        d = $(c[a]),
        f = new e(d);
        b && d.find("span").text(b),
        f.show()
    };
    return {
        blink: f
    }
} (),
MoveableNav = function() {
    function T() {
        return h
    }
    function S() {
        document.body.scrollTop = 0
    }
    function R() {
        a.show(),
        x()
    }
    function Q() {
        $("#t_moveable_bar > header > #t_head1").show(),
        x()
    }
    function P() {
        $("#t_moveable_bar > header > #t_head1").hide(),
        y()
    }
    function O() {
        a.hide(),
        y()
    }
    function N() {
        b.click(function() {
            e ? J() : K()
        }),
        $(window).bind("hashchange",
        function(a) {
            M()
        }),
        $(document).delegate("header > nav > a", "click",
        function() {
            p && p.remove(),
            M()
        }),
        $(document).delegate("header > nav > a", "click",
        function(a) {
            var b = a.target,
            c = PageManager.getCurrentPage(),
            d;
            while (b.tagName != "A") b = b.parentNode; ! c || (b.href.indexOf(c.id) != -1 && (NotifiStatus.getMemStatus().tempPageId > 0 && (d = c.forceRefresh, c.forceRefresh = !0), c.enter({}), c.forceRefresh = d), window.scrollTo(0, 0))
        })
    }
    function M() {
        B(b),
        b.hide(),
        b.css({
            "-webkit-transition-duration": "0",
            "-webkit-transform": "translate3d(0,0,0)"
        }),
        l.append(b),
        p && p.remove(),
        c = !1,
        d = !1,
        e = !1,
        f = !1
    }
    function L() {
        c = !1;
        var a = util.getHashParams().pageId;
        q.indexOf(a) != -1 ? y() : x()
    }
    function G(a) {
        a ? b.children("a").attr("class", "topbar-newtips-btn") : b.children("a").attr("class", "topbar-btn")
    }
    function F() {
        v();
        if (i) {
            var a = u() ? 0 : m;
            b.css({
                top: -m + "px",
                "-webkit-transition-duration": "0",
                "-webkit-transform": "translate3d(0," + a + "px,0)"
            })
        } else b.css("top", document.body.scrollTop + "px");
        b.hide(),
        l.append(b),
        u() ? I() : b.show()
    }
    function E() {
        p.append(b),
        b.css("position", "absolute"),
        b.css("top", "auto"),
        b.css("-webkit-transform", "translate3d(0,0,0)"),
        n = p.height()
    }
    function D() {
        f = !1,
        p.unbind("webkitTransitionEnd", C),
        p[0].style["-webkit-transform"].indexOf(n) == -1 && (p.hide(), B(p), F())
    }
    function C() {
        b.unbind("webkitTransitionEnd", C),
        b[0].style["-webkit-transform"].indexOf(m) == -1 && (b.hide(), B(b))
    }
    function B(a) {
        a.css("-webkit-transition-duration", "0")
    }
    function A(a) {
        a.css({
            "-webkit-transition-property": "top,-webkit-transform",
            "-webkit-transition-timing-function": "ease-in-out",
            "-webkit-transform-style": "preserve-3d",
            "-webkit-backface-visibility": "hidden"
        })
    }
    function z(a, b, c) {
        a.hide(),
        c != undefined && a.css({
            "-webkit-transform": "translate3d(0," + c + "px,0)"
        }),
        a.show(),
        a.css({
            "-webkit-transform": "translate3d(0," + b + "px,0)",
            "-webkit-transition-duration": "0.3s"
        })
    }
    function y() {
        M(),
        g = !1,
        window.removeEventListener("touchmove", w, !1),
        window.removeEventListener("scroll", w, !1)
    }
    function x() { ! j && !g && (g = !0, window.addEventListener("touchmove", w, !1), window.addEventListener("scroll", w, !1))
    }
    function w(a) {
        a.stopImmediatePropagation(),
        d = !0,
        e && J(),
        c || t(),
        i ? f || (u() ? I() : H()) : u() ? I() : H()
    }
    function v() {
        p && p.css("position", k),
        b.css("position", k)
    }
    function u() {
        return document.body.scrollTop < n
    }
    function t() {
        M(),
        a.find("script").remove(),
        p = a.clone(!0),
        m = b.height(),
        n = a.height(),
        p.css({
            "z-index": 100,
            display: "none"
        }),
        b.css("top", -m + "px"),
        v(),
        l.append(p),
        A(b),
        A(p),
        c = !0
    }
    function s(a) {
        clearTimeout(o),
        o = setTimeout(function() {
            d = !1,
            a()
        },
        250)
    }
    var a = $("#t_moveable_bar > header"),
    b = $("#t_bar"),
    c = !1,
    d = !1,
    e = !1,
    f = !1,
    g = !1,
    h = !1,
    i = DeviceFeature.isSupportFixed(),
    j = window.navigator.userAgent.indexOf("MQQBrowser") != "-1",
    k = i ? "fixed": "absolute",
    l = $("body"),
    m,
    n,
    o,
    p,
    q = ["compose", "setting_entrance", "setting_msg", "privacy_modify", "display_setting", "profile_modify", "personal_info", "olympic_guest_home", "channels", "zoom_img"];
    g_isqqbrowser37 && (j = !1),
    g_from_android && g_from_qqbrowser && (j = !1);
    var r = {
        HOME: "myhome",
        NOTIFICATION: "notification",
        HOT: "hot",
        CHANNELS: "channels",
        APP: "app",
        NONE: "none",
        KEEP: "keep"
    },
    H = function() {
        return i ?
        function() {
            c || t(),
            b.hide(),
            z(b, m),
            b.bind("webkitTransitionEnd", C)
        }: function() {
            c || t(),
            b.hide(),
            A(b),
            s(function() {
                b.css("top", document.body.scrollTop - m + "px"),
                z(b, m, 0),
                b.bind("webkitTransitionEnd", C)
            })
        }
    } (),
    I = function() {
        return i ?
        function() {
            b[0].style["-webkit-transform"].indexOf(m) != -1 && b.css("display") != "none" && (z(b, 0), b.bind("webkitTransitionEnd", C))
        }: function() {
            clearTimeout(o),
            B(b),
            b.hide(),
            b.css("-webkit-transform", "translate3d(0,0,0)")
        }
    } (),
    J = function() {
        return i ?
        function() {
            h = !1,
            e = !1,
            f = !0,
            z(p, 0),
            p.bind("webkitTransitionEnd", D)
        }: function() {
            h = !1,
            e = !1,
            d ? (p.hide(), F()) : (z(p, 0), p.bind("webkitTransitionEnd", D))
        }
    } (),
    K = function() {
        return i ?
        function() {
            h = !0,
            e = !0,
            f = !0,
            E(),
            p.css("top", -n + "px"),
            z(p, n),
            p.bind("webkitTransitionEnd", D)
        }: function() {
            h = !0,
            e = !0,
            f = !0,
            E(),
            p.css("top", document.body.scrollTop - n + "px"),
            z(p, n, 0),
            p.bind("webkitTransitionEnd", D)
        }
    } ();
    N();
    return {
        navTabs: r,
        isDisplayed: T,
        shift: L,
        activate: x,
        revoke: y,
        hide: O,
        hideMainNav: P,
        showMainNav: Q,
        show: R,
        scrollToTop: S,
        setMentionStatus: G,
        disalowMove: function() {},
        allowMove: function() {},
        destoryDummy: function() {}
    }
} ();
(function(a) {
    var b = "ontouchstart" in window,
    c = b ? "touchstart": "mousedown",
    d = b ? "touchmove": "mousemove",
    e = b ? "touchend": "mouseup";
    a.fn.tap = function(f, g, h) {
        function r(a) {
            h && n.removeClass(h),
            i || (a.data = g, f(a))
        }
        function q(a) {
            l = b ? a.touches[0].clientX: a.pageX,
            m = b ? a.touches[0].clientY: a.pageY;
            if (Math.abs(l - j) > 10 || Math.abs(l - k) > 10) i = !0;
            a.preventDefault()
        }
        function p(c) {
            i = !1,
            n = a(c.target),
            h && n.addClass(h),
            j = b ? c.touches[0].clientX: c.pageX,
            k = b ? c.touches[0].clientY: c.pageY
        }
        var i = !1,
        j, k, l, m, n, o = this[0]; ! o || (o.addEventListener(c, p), o.addEventListener(d, q), o.addEventListener(e, r))
    }
})($);
var WritePlus = {};
(function() {
    var $ = jq,
    tStrLength = function(a) {
        var b = 0;
        for (var c = a.length; c--;) a.charCodeAt(c) > 128 ? b += 1 : b += .5;
        return Math.ceil(b)
    },
    doInput = function(a, b, c) {
        var d = a.value,
        e = a.selectionStart,
        f = b.length; ! b || (c ? a.value = b: a.value = d.substring(0, e) + b + d.substring(e, d.length), a.selectionStart = e + f)
    },
    UserList = function(a) {
        this.type = a.type,
        this.input = a.elInput,
        this.wrapper = a.elWrapper,
        this.onCancel = a.onCancel,
        this.onInputEnd = a.onInputEnd,
        this.sure = this.wrapper.querySelector("button.t_sure_input"),
        this.cancel = this.wrapper.querySelector("button.t_cancel_input"),
        this.search = this.wrapper.querySelector(".t_search_input") || this.wrapper.querySelector("input"),
        this.sWrapper = this.wrapper.querySelector(".t_scroll_wrapper"),
        this.screen = this.sWrapper.getElementsByTagName("div")[0],
        this.ac = a.type == "at" ? g_ac.AC_ID_AUTO_COMPLETE: g_ac.AC_BIDIRECTION_FOLLOWS,
        this.type == "at" ? this.tpl = '[% for(var i=0;i<msg.length;i++) { %]<a data-content="@[%if(typeof msg[i][3] != "undefined" && msg[i][3]!=""){%][%=msg[i][3] %][%}else{%][%= msg[i][0] %][%}%]"><img src="http://t1.qlogo.cn/mbloghead/default/30" data-src="[%= msg[i][2] %]/30" height="20" width="20">[%= msg[i][1] %](@[%if(typeof msg[i][3] != "undefined" && msg[i][3]!=""){%][%= msg[i][3] %][%}else{%][%= msg[i][0] %][%}%])</a>[% } %]': this.tpl = '[% for(var i=0;i<msg.length;i++) { %]<a data-content="[%if(typeof msg[i][3] != "undefined" && msg[i][3]!=""){%][%=msg[i][3] %][%}else{%][%= msg[i][0] %][%}%]"><img src="http://t1.qlogo.cn/mbloghead/default/30" data-src="[%= msg[i][2] %]/30" height="20" width="20">[%= msg[i][1] %](@[%if(typeof msg[i][3] != "undefined" && msg[i][3]!=""){%][%= msg[i][3] %][%}else{%][%= msg[i][0] %][%}%])</a>[% } %]',
        this.sWrapper.style.position = "relative",
        this.listn = 1,
        this.pageNums = 40,
        this.arrAllData = [],
        this.bindMethod(),
        this.getData()
    };
    UserList.prototype = function() {
        var bindMethod = function() {
            var a = this,
            b = a.input,
            c = a.search,
            d = a.sure,
            e = a.cancel,
            f = a.sWrapper,
            g = function() {
                c.value = "",
                a.renderList()
            };
            a.scroller = new iScroll(f, {
                onScrollStart: function() {
                    c.blur()
                },
                onScrollEnd: function() {
                    Math.abs(a.scroller.y - a.scroller.maxScrollY) < 20 && !a.userInput && a.renderList()
                },
                bounce: !1
            }),
            $(d).click(function(d) {
                d.preventDefault();
                var e = "",
                f = 0;
                c.value && (a.type == "at" ? (e = "@" + c.value + " ", doInput(b, "@" + c.value + " ")) : (e = c.value, doInput(b, c.value, !0)), f = e.length),
                g(),
                a.onInputEnd && a.onInputEnd(f)
            }),
            $(f).tap(function(c) {
                var d = c.target;
                while (d.tagName != "A") d = d.parentNode;
                var e = $(d),
                f = "",
                h = 0;
                a.type == "at" ? (f = $(e).data("content") + " ", h = f.length, doInput(b, f)) : (f = $(e).data("content"), h = f.length, doInput(b, f, !0)),
                g(),
                a.onInputEnd && a.onInputEnd(h)
            },
            null, "active"),
            $(e).bind("ontouchstart" in window ? "touchstart": "mousedown",
            function(b) {
                b.preventDefault(),
                g(),
                a.onCancel && a.onCancel()
            }),
            c.addEventListener("focus",
            function() {
                window.scrollTo(0, $(a.wrapper).offset().top)
            }),
            c.addEventListener("input",
            function() {
                clearTimeout(a.timer),
                this.timer = setTimeout(function() {
                    a.userInput = c.value.replace(/['\\\/"\{\}\[\]:\., ]/ig, ""),
                    a.listn = 1,
                    a.userInput === "" ? a.renderList() : a.renderSearch(a.userInput),
                    a.scroller.scrollTo(0, 0, 200)
                },
                20)
            })
        },
        getData = function() {
            var self = this,
            screen = self.screen,
            type = self.type,
            params = {
                ac: this.ac,
                touch: 1
            },
            updateScale = 6048e5,
            localData = {};
            try {
                localData = localStorageObj.get(type)
            } catch(e) {}
            g_isLogin && (!localData || localData.sid != g_sid || localData.msg.length === 0 || (new Date).getTime() - localData.timestamp > updateScale || !localData.info.value) ? (screen.innerHTML = "<div>loading...</div>", $.ajax({
                url: g_action,
                data: params,
                dataType: "json",
                success: function(data) {
                    data.sid = g_sid,
                    data.timestamp = (new Date).getTime(),
                    data.msg = eval(data.msg);
                    if (data && data.info && data.info.value && params.md5 !== data.info.value) {
                        console.log("get new " + type + " data from server!");
                        try {
                            localStorageObj.set(type, data)
                        } catch(e) {}
                    }
                    self.arrAllData = eval(data.msg),
                    self.renderList()
                }
            })) : localData && (self.arrAllData = eval(localData.msg), this.renderList())
        },
        refreshData = function() {
            var a = localStorageObj.get("at");
            this.arrAllData = a ? a.msg: null,
            this.listn = 1,
            this.arrAllData && this.renderList()
        },
        renderList = function() {
            var a = this,
            b = a.listn,
            c = a.pageNums,
            d = a.arrAllData,
            e = a.screen,
            f = this.tpl,
            g = b * c,
            h = g - c,
            i = d.slice(h, g),
            j = g <= d.length,
            k = (new EJS({
                text: f,
                type: "["
            })).render({
                msg: i
            });
            if (b !== 1) {
                var l = e.querySelector("a.t_at_holder");
                l && l.parentNode.removeChild(l),
                e.innerHTML += k
            } else e.innerHTML = k;
            j ? (e.innerHTML += '<a class="t_at_holder">正在加载...</a>', a.scroller.options.bounce = !1) : a.scroller.options.bounce = !0,
            imgLoader($(e)),
            a.scroller.refresh(),
            a.listn++
        },
        renderSearch = function(a) {
            var b = this,
            c = b.pageNums,
            d = b.arrAllData,
            e = b.userInput,
            f = b.screen,
            g = b.scroller,
            h = "http://t1.qlogo.cn/mbloghead/default/30",
            i = "",
            j = b.arrAllData.length,
            k = j > c ? c: j,
            l = new RegExp(a, "i"),
            m = "",
            n = [];
            this.type == "at" ? i = '[% for(var i=0;i<msg.length;i++) { %]<a data-content="@[%if(typeof msg[i][3] != "undefined" && msg[i][3]!=""){%][%=msg[i][3]%][%}else{%][%= msg[i][0] %][%}%]"><img src="http://t1.qlogo.cn/mbloghead/default/30" data-src="[%= msg[i][2] %]/30" height="20" width="20">[%= msg[i][1] %]</a>[% } %]': i = '[% for(var i=0;i<msg.length;i++) { %]<a data-content="[%if(typeof msg[i][3] != "undefined" && msg[i][3]!=""){%][%=msg[i][3]%][%}else{%][%= msg[i][0] %][%}%]"><img src="http://t1.qlogo.cn/mbloghead/default/30" data-src="[%= msg[i][2] %]/30" height="20" width="20">[%= msg[i][1] %]</a>[% } %]';
            for (var o = 0; o < j; o++) {
                var p = d[o][1],
                q = d[o][0];
                d[o][3] != null && d[o][3] != "" && (q = d[o][3]),
                l.test(p) ? n.push([q, p.replace(l, '<span class="wb-highlight-text">$&</span>') + "(@" + q + ")", d[o][2]]) : l.test(q) && n.push([q, p + "(@" + q.replace(l, '<span class="wb-highlight-text">$&</span>') + ")", d[o][2]]);
                if (n.length === k) break
            }
            e !== "" && n.length === 0 && (b.type == "at" ? n.push([e, "@<span>" + e + "</span>", h]) : n.push([e, "<span>" + e + "</span>", h])),
            m = (new EJS({
                text: i,
                type: "["
            })).render({
                msg: n
            }),
            f.innerHTML = m,
            imgLoader($(f)),
            b.scroller.options.bounce = !0,
            g && g.refresh()
        };
        return {
            renderSearch: renderSearch,
            renderList: renderList,
            getData: getData,
            bindMethod: bindMethod,
            refreshData: refreshData
        }
    } ();
    var Topic = function(a) {
        this.textarea = a.elemTextArea,
        this.input = a.elemInput,
        this.wrapper = a.elemWrapper,
        this.cancelcb = a.cancelCallBack,
        this.onInputEnd = a.onInputEnd,
        this.sWrapper = this.wrapper.querySelector(".t_scroll_wrapper"),
        this.sure = this.wrapper.querySelector(".t_sure_input"),
        this.cancel = this.wrapper.querySelector(".t_cancel_input"),
        this.screen = this.sWrapper.getElementsByTagName("div")[0],
        this.scroller = null,
        this.sWrapper.style.position = "relative",
        this.getData()
    };
    Topic.prototype = function() {
        var a = function() {
            var a = this;
            a.screen.innerHTML = "<div>loading...</div>",
            $.ajax({
                url: g_action,
                data: {
                    ac: g_ac.AC_HOT_TOPIC,
                    mst: g_mst.HOT_TOPIC_LIST
                },
                dataType: "json",
                success: function(b) {
                    a.data = b,
                    a.arrAllData = b.jsonDump.topics,
                    a.renderList(),
                    a.bindMethod()
                }
            })
        },
        b = function() {
            var a = this,
            b = $(a.input),
            c = a.sWrapper,
            d = a.textarea;
            a.scroller = new iScroll(c, {
                onScrollStart: function() {
                    b[0].blur()
                }
            }),
            a.sure.addEventListener("click",
            function(c) {
                c.preventDefault(); ! b[0].value || (doInput(d, "#" + b[0].value + "#"), a.input.value = "", a.renderList(), a.onInputEnd && a.onInputEnd(), d.focus())
            }),
            $(a.cancel).bind("ontouchstart" in window ? "touchstart": "mousedown",
            function(b) {
                b.preventDefault(),
                window.scrollTo(0, 0),
                a.input.value = "",
                a.renderList(),
                a.cancelcb()
            }),
            $(c).tap(function(b) {
                var c = b.target;
                while (c.tagName != "A") c = c.parentNode;
                var e = $(c);
                doInput(d, $(e).data("content") + " "),
                a.input.value = "",
                a.renderList(),
                a.onInputEnd && a.onInputEnd()
            },
            null, "active"),
            b.bind("focus",
            function() {
                window.scrollTo(0, $(a.wrapper).offset().top)
            }),
            b.bind("input",
            function() {
                clearTimeout(a.timer),
                a.timer = setTimeout(function() {
                    a.userInput = b.val().replace(/['\\\/"\{\}\[\]:\., ]/ig, ""),
                    a.userInput === "" ? a.renderList() : a.renderSearch(a.userInput)
                },
                20)
            })
        },
        c = function() {
            var a = this,
            b = '[% for(var i=0;i<topics.length;i++) { %]<a data-content="#[%= topics[i].keyword %]#">#[%= topics[i].keyword %]#</a>[% } %]',
            c = a.data.jsonDump,
            d = (new EJS({
                text: b,
                type: "["
            })).render(c);
            a.screen.innerHTML = d
        },
        d = function(a) {
            var b = this.arrAllData,
            c = this.userInput,
            d = this.screen,
            e = b.length,
            f = new RegExp(a, "i"),
            g = '[% for(var i=0;i<data.length;i++) { %]<a data-content="#[%= data[i][0] %]#">#[%= data[i][1] %]#</a>[% } %]',
            h = "",
            i = "",
            j = [];
            for (var k = 0; k < e; k++) h = b[k].keyword,
            h.indexOf(a) > -1 && j.push([h, h.replace(f, '<span class="wb-highlight-text">' + a + "</span>")]);
            c !== "" && j.length === 0 && j.push([c, '<span class="wb-highlight-text">' + c + "</span>"]),
            i = (new EJS({
                text: g,
                type: "["
            })).render({
                data: j
            }),
            d.innerHTML = i,
            this.scroller && this.scroller.scrollTo(0, 0, 100)
        };
        return {
            renderSearch: d,
            renderList: c,
            bindMethod: b,
            getData: a
        }
    } ();
    var Face = function(a) {
        var b = this;
        this.textArea = a.elemTextArea,
        this.wrapper = a.elemWrapper,
        this.screen = a.elemWrapper.getElementsByTagName("div")[0],
        this.onInputEnd = a.onInputEnd,
        this.scale = 40,
        this.listn = 8,
        this.wrapper.style.position = "relative",
        this.wrapper.style.height = "202px",
        this.scroller = new iScroll(this.wrapper),
        $(this.wrapper).click(function(a) {
            b.chooseFace.call(b, a)
        });
        return b
    };
    Face.prototype = function() {
        var a = ["/调皮", "/呲牙", "/惊讶", "/难过", "/酷", "/冷汗", "/抓狂", "/吐", "/偷笑", "/可爱", "/白眼", "/傲慢", "/微笑", "/撇嘴", "/色", "/发呆", "/得意", "/流泪", "/害羞", "/嘘", "/困", "/尴尬", "/发怒", "/大哭", "/流汗", "/再见", "/敲打", "/擦汗", "/委屈", "/疑问", "/睡", "/亲亲", "/憨笑", "/衰", "/阴险", "/奋斗", "/右哼哼", "/拥抱", "/坏笑", "/鄙视", "/晕", "/大兵", "/可怜", "/饥饿", "/咒骂", "/抠鼻", "/鼓掌", "/糗大了", "/左哼哼", "/哈欠", "/快哭了", "/吓", "/闭嘴", "/惊恐", "/折磨", "/示爱", "/爱心", "/心碎", "/蛋糕", "/闪电", "/炸弹", "/刀", "/足球", "/瓢虫", "/便便", "/咖啡", "/饭", "/猪头", "/玫瑰", "/凋谢", "/月亮", "/太阳", "/礼物", "/强", "/弱", "/握手", "/胜利", "/抱拳", "/勾引", "/拳头", "/差劲", "/爱你", "/NO", "/OK", "/爱情", "/飞吻", "/跳跳", "/发抖", "/怄火", "/转圈", "/磕头", "/回头", "/跳绳", "/挥手", "/激动", "/街舞", "/献吻", "/左太极", "/右太极", "/菜刀", "/西瓜", "/啤酒", "/骷髅", "/篮球", "/兵乓"],
        b = function(a) {
            var b = this,
            c = a.target,
            d = function(a, c) {
                var d = b.scale,
                e = b.listn;
                return a % d != 0 && c % d != 0 ? b.EMOCODE[Math.floor(c / d) * e + Math.floor(a / d)] : ""
            };
            if (c.className == "wb-input-faces") {
                var e = a.offsetX,
                f = a.offsetY;
                doInput(b.textArea, d(e, f)),
                b.onInputEnd && b.onInputEnd()
            }
        };
        return {
            EMOCODE: a,
            chooseFace: b
        }
    } ();
    var Count = function(a, b) {
        this.checktime = 300,
        this.textArea = a,
        this.display = b,
        this.bindMethod()
    };
    Count.prototype = function() {
        var a = function() {
            var a = this,
            b = a.textArea;
            b.addEventListener("focus",
            function() {
                a.timer = setInterval(function() {
                    var b = a.textArea,
                    c = tStrLength(b.value);
                    a.num = 140 - c,
                    a.updateDisplay(a.num)
                },
                a.checktime)
            },
            !1),
            b.addEventListener("blur",
            function() {
                clearInterval(a.timer)
            },
            !1)
        },
        b = function(a) {
            var b = this.display;
            b.innerHTML = a,
            a > 0 ? $(b).removeClass("wb-num-mis") : $(b).addClass("wb-num-mis")
        },
        c = function() {
            return this.num
        };
        return {
            bindMethod: a,
            updateDisplay: b,
            getNum: c
        }
    } ();
    var LBS = function(a, b, c) {
        this.triger = a,
        this.textArea = b,
        this.display = c,
        this.bindMethod()
    };
    LBS.prototype = function() {
        var a = function(a, b) {
            var c = $.ajax({
                url: g_action,
                dataType: "json",
                data: {
                    ac: g_ac.AC_LBS_QUERY_ADDR_TEXT,
                    latitude: a.latitude,
                    longitude: a.longitude
                },
                async: !1,
                success: function(a) {
                    b(a)
                }
            })
        },
        b = function() {
            var b = this,
            d = b.display,
            e = b.textArea;
            d.style.display = "none",
            d.innerHTML = '<em class="ico-area"></em><span class="t_ct"></span><em class="ico-del t_del" id="lbs-ico-del"></em>',
            this.content = d.querySelector(".t_ct"),
            this.deleteBtn = d.querySelector(".t_del");
            var f = function(c) {
                LoadingController.unloading();
                var f = {
                    latitude: c.coords.latitude,
                    longitude: c.coords.longitude,
                    accuracy: c.coords.accuracy,
                    timestamp: c.timestamp
                },
                g = function(a) {
                    var c = a.msg;
                    c.length > 0 ? (e.setAttribute("latitude", f.latitude), e.setAttribute("longitude", f.longitude), e.setAttribute("geoAddr", c), b.content.innerHTML = c, d.style.display = "") : Tips.blink("fail", "获取地址失败")
                };
                a(f, g)
            },
            g = function(a) {
                LoadingController.unloading();
                switch (a.code) {
                case a.PERMISSION_DENIED:
                    alert("您已关闭此网页获取您的位置，请到设置的定位服务中更改设置");
                    break;
                case a.TIMEOUT:
                case a.POSITION_UNAVAILABLE:
                    b.updateArgument.lat = -2,
                    b.updateArgument.lon = -2,
                    alert("获取位置超时或位置不可用");
                    break;
                default:
                }
                d.style.display = "",
                b.content.innerHTML = "获取位置失败..",
                e.setAttribute("geoAddr", "")
            };
            $(this.triger).tap(function() {
                LoadingController.getLoading(),
                b.display.style.display = "",
                b.content.innerHTML = "正在获取位置信息..";
                var a = navigator.geolocation,
                c = {
                    enableHighAccuracy: !0,
                    timeout: 3e4,
                    maximumAge: 0
                };
                a && setTimeout(function() {
                    a.getCurrentPosition(f, g, c)
                },
                25)
            }),
            this.deleteBtn.addEventListener("click",
            function() {
                c.call(b)
            })
        },
        c = function() {
            var a = this,
            b = a.display,
            c = a.textArea;
            c.setAttribute("latitude", ""),
            c.setAttribute("longitude", ""),
            c.setAttribute("geoAddr", ""),
            a.content.innerHTML = "",
            b.style.display = "none"
        };
        return {
            bindMethod: b,
            clear: c
        }
    } (),
    WritePlus.UserList = UserList,
    WritePlus.LBS = LBS,
    WritePlus.Face = Face,
    WritePlus.Topic = Topic,
    WritePlus.Count = Count
})(),
function(a) {
    function o(a) {
        c || i(a)
    }
    function n(a) {
        f = b ? a.touches[0].clientX: a.pageX,
        g = b ? a.touches[0].clientY: a.pageY;
        if (Math.abs(f - d) > 10 || Math.abs(f - e) > 10) c = !0
    }
    function m(f) {
        f.preventDefault(),
        f.stopPropagation(),
        c = !1,
        h = a(f.target),
        d = b ? f.touches[0].clientX: f.pageX,
        e = b ? f.touches[0].clientY: f.pageY
    }
    var b = "ontouchstart" in window,
    c = !1,
    d, e, f, g, h, i = null,
    j = b ? "touchstart": "mousedown",
    k = b ? "touchmove": "mousemove",
    l = b ? "touchend": "mouseup";
    a.fn.unImgTap = function() {
        var a = this[0]; ! a || (a.removeEventListener(j, m), a.removeEventListener(k, n), a.removeEventListener(l, o))
    },
    a.fn.imgTap = function(a) {
        var b = this[0];
        i = a; ! b || (b.addEventListener(j, m), b.addEventListener(k, n), b.addEventListener(l, o))
    }
} ($);
var ImageLayerController = function() {
    function s() {
        i || (i = new loadingBar),
        d = $("#t_image_show"),
        f = d.find("img.big-pic"),
        f.css("max-height", window.innerHeight + "px").css("max-width", window.innerWidth + "px"),
        p()
    }
    function r(a, b) {
        if (g == "gif") return ! 1;
        f.css("-webkit-transform", "scale(" + (b ? 0 : 1) + ")"),
        setTimeout(function() {
            f.css("-webkit-transition", "-webkit-transform 0.7s ease-in-out"),
            f.css("-webkit-transform", "scale(" + (b ? 1 : a) + ")")
        },
        0)
    }
    function q(a) {
        var b = f.width(),
        c = d.find("div.wb-picview").width(),
        e = d.find("div.wb-pic-tool").width();
        if (b > e && b < c) {
            var g = (c - b) / 2;
            d.find("div.wb-pic-tool").css("right", g + "px")
        }
        d.find("div.wb-pic-tool").css("right", "10px"),
        d.find("div.wb-pic-tool").css("top", a - 30 + "px"),
        d.find("div.wb-pic-tool").css("height", "35px")
    }
    function p() {
        d.find("a.rotation-btn").click(function(b) {
            b.stopPropagation(),
            e = e + 90,
            f.css("-webkit-transform", "rotate(" + e + "deg) scale(" + a + ")")
        }),
        d.find("a.zoom-btn").click(function(a) {
            a.stopPropagation(),
            util.pushHashParams({
                pageId: "zoom_img",
                urlParams: {
                    src: f.attr("src")
                }
            })
        })
    }
    function o(a) {
        var b = (window.innerHeight - a) / 2;
        d.css("top", b + $(window).scrollTop() + "px")
    }
    function n() {
        f.attr("src", ""),
        d.hide(),
        b.hide(),
        b.unImgTap(),
        j && j.html(""),
        d.find(".zoom-btn").show()
    }
    function m(l, m) {
        var p = PageManager.getCurrentPage(),
        l = $(l),
        t = l.height(),
        u = l.width(),
        v = l.attr("src"),
        w = m.isLink,
        x = m.picType,
        y = m.displayDes,
        z = m.displayBig,
        A = l.attr("dataaccount"),
        B = l.attr("datausername"),
        C = l.attr("datacontent"),
        D = l.attr("datamsgId"),
        E = '<a href="#guest_home/u=' + A + '">' + B + "</a> ：" + C + '<a href="#detail/msgid=' + D + '">  详情</a>';
        NavControl.addException("#showImg", "Out", n),
        location.hash = "showImg",
        e = 0,
        g = x,
        b ? b.imgTap(h) : b = $("#t_dialog_pop"),
        c || (c = $("#t_image_show"), c.bind("click", h)),
        b.css("height", document.body.scrollHeight + "px"),
        b.show(),
        d || s();
        if (v) {
            var F = /\/320$/.test(v),
            G = v.replace(/\/[0-9]+$/, "/320");
            f.removeAttr("width").removeAttr("height"),
            w ? F && f.attr("width", u).attr("height", t) : f.attr("src", v),
            w ? f.hide() : f.show(),
            $("#t_img_loading").show(),
            i.startup(),
            k(G,
            function() {
                w = g == "gif" ? !0 : w,
                f.attr("src", G),
                i.stop(),
                $("#t_img_loading").hide(),
                w && f.show();
                var b = f.height(),
                c = f.width();
                w || f.attr("width", u).attr("height", t),
                a = w ? 1 : (c / u).toFixed(1);
                var e = w ? b: (t * a - t) / 2 + t;
                q(e),
                d.find("div.wb-pic-tool").show();
                if (y) {
                    j || (j = $('<div class="pic-des t_des"></div>'), d.append(j)),
                    d.find(".wb-picview").height(t * (a / 2 + .5) + "px"),
                    j.html(E),
                    j.find("a").bind("click",
                    function(a) {
                        a.stopPropagation()
                    });
                    var h = j.find(".pic-des");
                    j.bind("click",
                    function(a) {
                        a.stopPropagation()
                    })
                }
                z || d.find(".zoom-btn").hide(),
                o(t),
                r(a, w)
            })
        }
        d.show(),
        o(t),
        d.find("div.wb-pic-tool").hide(),
        f.css("-webkit-transform", "rotate(0deg)").css("-webkit-transition", ""),
        p.forceRefresh = !1
    }
    function l(j, l, m, p, t) {
        var u = PageManager.getCurrentPage();
        u.forceRefresh = !1,
        NavControl.addException("#showImg", "Out", n),
        location.hash = "showImg",
        e = 0,
        g = l,
        b || (b = $("#t_dialog_pop")),
        b && b.imgTap(h),
        c || (c = $("#t_image_show"), c.bind("click", h)),
        b.css("height", document.body.scrollHeight + "px"),
        b.show(),
        d || s();
        if (j) {
            var v = /\/320$/.test(j),
            w = j.replace(/\/[0-9]+$/, "/320");
            f.removeAttr("width").removeAttr("height"),
            t ? v && f.attr("width", p).attr("height", m) : f.attr("src", j),
            t ? f.hide() : f.show(),
            $("#t_img_loading").show(),
            i.startup(),
            k(w,
            function() {
                t = g == "gif" ? !0 : t,
                f.attr("src", w),
                i.stop(),
                $("#t_img_loading").hide(),
                t && f.show();
                var b = f.height(),
                c = f.width();
                t || f.attr("width", p).attr("height", m),
                a = t ? 1 : (c / p).toFixed(1);
                var e = t ? b: (m * a - m) / 2 + m;
                q(e),
                d.find("div.wb-pic-tool").show(),
                o(m),
                r(a, t)
            })
        }
        d.show(),
        o(m),
        d.find("div.wb-pic-tool").hide(),
        f.css("-webkit-transform", "rotate(0deg)").css("-webkit-transition", "")
    }
    function k(a, b) {
        var c = new Image;
        c.src = a,
        c.onload = b
    }
    var a = null,
    b = null,
    c = null,
    d = null,
    e = 0,
    f = null,
    g = null,
    h = function(a) {
        n(),
        history.back()
    },
    i = null,
    j;
    return {
        show: l,
        display: m,
        close: n
    }
} (),
LoadingController = function() {
    function l() {
        var a = PageManager.getCurrentPage(),
        b = a.jObj.find(".t_btn-getmore");
        b.remove()
    }
    function k() {
        setTimeout(function() {
            b && (b.find("li.loading").remove(), b = null),
            $("ul li.loading").remove(),
            c && (c.hide(), c = null)
        },
        0)
    }
    function j(a) {
        h(d),
        d.show(),
        c = d
    }
    function i() {
        var a = PageManager.getCurrentPage(),
        e = a.jObj.find('ul[mst="' + a.updateArgument.mst + '"]');
        e.length > 0 && e.hasClass("t_fwdList") && e.children("li").length > 0 ? e.each(function() {
            var a = $(this);
            a.children("li.loading").length || a.children("li").length > 0 && (a.prepend('<li class="timeline-list-item loading">正在加载<span class="loading_point">...</span></li>'), f(), b = a)
        }) : (h(d), d.show(), c = d)
    }
    function h(a) {
        var b;
        window.navigator.userAgent.indexOf("MQQBrowser") != "-1" ? b = 0 : b = window.navigator.standalone == !0 ? 0 : 30;
        var c = ($(window).height() - a.height()) / 2,
        d = c + $(window).scrollTop() + b;
        window.navigator.userAgent.indexOf("MQQBrowser") != "-1" && (d += 40),
        e || (d = 200),
        a.css("top", d < 0 ? 0 : d + "px"),
        a.css("visibility", "visible")
    }
    function g() {
        var a = PageManager.getCurrentPage(),
        b = a.jObj.find(".t_btn-getmore"),
        c;
        b.each(function(a, b) {
            var d = $(b);
            d.getComputedStyle("display") == "block" && (c = d)
        }),
        c && c.html('正在加载<span class="loading_point">...</span>')
    }
    function f() {
        var a = $(".loading_point:visible"),
        b = 1;
        pointAnimationMark = setInterval(function() {
            a.text(Array(++b).join(".")),
            b >= 4 && (b = 1)
        },
        500)
    }
    var a = !1,
    b = null,
    c = null,
    d, e = !/Android 2.3.*/.test(navigator.userAgent);
    d = e ? $('<div id="loading" class="newloading" style="display:none;"><div class="loading_under"></div><div class="loading_ani"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="loading_bg"></div><div class="loading_hack"></div></div>') : $('<div class="andriodLoading" style="display:none;"></div>'),
    $("body").append(d);
    return {
        saveLoading: function() {
            j("save")
        },
        pubLoading: function() {
            j("pub")
        },
        getLoading: function() {
            j("get")
        },
        popLoading: j,
        loading: i,
        unloading: k,
        getMoreIng: g,
        removeGetMore: l
    }
} ();
(function(a) {
    var b, c = 0,
    d = !1;
    loadingBar = function(a) {
        var b = this;
        for (var c in a) b[c] = a[c]
    },
    loadingBar.prototype = {
        blockId: "wb-load",
        animationCls: "wb-load-anim",
        originalCls: "wb-load",
        isPlaying: function() {
            return d
        },
        startup: function() {
            var a = this;
            b = setInterval(function() {
                if (d) {
                    if (c == 400) for (var b = 1; b <= 5; b++) $("#" + a.blockId + "-" + b).addClass(a.originalCls + "-" + b).removeClass(a.animationCls + "-" + b);
                    else c == 1400 && (d = !1, c = -100);
                    c += 100
                } else {
                    for (var b = 1; b <= 5; b++) $("#" + a.blockId + "-" + b).addClass(a.animationCls + "-" + b).removeClass(a.originalCls + "-" + b);
                    d = !0
                }
            },
            100)
        },
        stop: function() {
            var a = this;
            clearInterval(b);
            for (var e = 1; e <= 5; e++) $("#" + a.blockId + "-" + e).removeClass(a.animationCls + "-" + e).removeClass(a.originalCls + "-" + e);
            d = !1,
            c = 0
        }
    },
    a.loadingBar = loadingBar
})(window);
var cesuTongJi = {
    isOpen: 1,
    isLog: 0,
    log: function(a) {
        this.isLog && console.log(a)
    },
    pageId: "",
    pageTime: "",
    xhrTime: 1,
    isFirstEnter: 1,
    netStatus: navigator.type || 0,
    step1: function() {
        if ( !! this.isOpen) {
            var a = this,
            b = PageManager.getCurrentPage();
            a.xhrTime = (new Date).getTime(),
            a.isFirstEnter ? (a.pageTime = pageStartTime, a.log("这是第一次进入，以index.jsp进入为页面时间开始点。pageStartTime=" + a.pageTime)) : (a.pageTime = a.xhrTime, a.log("不是第一次进入，以enter进入为页面时间开始点。pageStartTime=" + a.pageTime));
            if (PageManager.getCurrentPage().updateArgument.ac == g_ac.AC_MORE_HOME_MSG) a.isFirstEnter = 0;
            else {
                var c = localStorageObj.get("l_cesuTongJi");
                c && (b.updateArgument.ulps = c, a.log("发送上一次测速统计记录 : " + c), localStorageObj.remove("l_cesuTongJi"))
            }
        }
    },
    step2: function() {
        if ( !! this.isOpen) {
            var a = this,
            b = (new Date).getTime(),
            c = "",
            d = PageManager.getCurrentPage().id,
            e = b - a.pageTime,
            f = b - a.xhrTime;
            c = [d, e, f, a.isFirstEnter, a.netStatus].join(","),
            a.log("页面结束时间：pageEndTime=" + b + "; 保存本次测速统计记录: " + c),
            localStorageObj.set("l_cesuTongJi", c),
            a.isFirstEnter = 0
        }
    }
},
pvTongJi = {
    isOpen: 1,
    isLog: 0,
    log: function(a) {
        this.isLog && console.log(a)
    },
    pageId: "",
    num: 0,
    isFirstEnter: 1,
    count: function(a) {
        function f() {
            var a = "",
            d = localStorageObj.get("l_pvTongJi");
            d ? a = d + "|" + c.id + "," + (b.num + 1) : a = c.id + "," + (b.num + 1),
            localStorageObj.set("l_pvTongJi", a)
        }
        function e() {
            var a = localStorageObj.get("l_pvTongJi");
            a && (c.updateArgument.up = a, b.log("发送上次pv统计记录 : " + a), localStorageObj.remove("l_pvTongJi"))
        }
        if ( !! this.isOpen) {
            var b = this,
            c = PageManager.getCurrentPage(),
            d = Boolean(a && c.updateArgument.ac);
            c.updateArgument.ac == g_ac.AC_MORE_HOME_MSG && (b.isFirstEnter ? (d = !1, b.isFirstEnter = 0) : (a = !0, d = !0)),
            this.log("isGoRefresh:" + a),
            b.log("isSendRequest:" + d),
            d ? (e(), f()) : f()
        }
    }
},
adTongJi = {
    isOpen: 1,
    isLog: 0,
    log: function(a) {
        this.isLog && console.log(a)
    },
    send: function(a) {
        function e() {
            var a = localStorageObj.get("l_adTongJi");
            a && (c.updateArgument.clickid = a, b.log("发送上次广告统计记录 : " + a), localStorageObj.remove("l_adTongJi"))
        }
        if ( !! this.isOpen) {
            var b = this,
            c = PageManager.getCurrentPage(),
            d = Boolean(a && c.updateArgument.ac);
            d && e()
        }
    },
    count: function(a) {
        var b = "",
        c = localStorageObj.get("l_adTongJi");
        c ? b = c + "|" + a: b = a,
        localStorageObj.set("l_adTongJi", b)
    }
};
Message.prototype = function() {
    function b() {
        var b = this;
        this.jObj.click(function(c) {
            c.target.localName != "a" && c.target.localName != "textarea" && a.call(b)
        })
    }
    function a() {
        var a = this.jObj.attr("selected");
        if (a) {
            var b = this.jObj.attr("edited");
            if (b) return;
            this.jObj.removeAttr("selected")
        } else {
            var c = this.jObj.parent();
            c.find("li[selected='true']").each(function(a, b) {
                $(b).removeAttr("selected")
            }),
            this.jObj.attr("selected", !0)
        }
    }
    return {
        bindAction: b
    }
} (),
MBUser.prototype = function() {
    function e(a, b) {
        var c = parseInt(b.ac, 10),
        d = this.jObj.find(".t_follow-operation"),
        e = localStorageObj.get("at"),
        f = e ? e.msg: null;
        LoadingController.unloading();
        if (parseInt(a.result, 10) === 0) switch (c) {
        case g_ac.AC_USER_FOLLOW:
            Tips.blink("success", "已收听");
            if (f) {
                var g = a.jsonDump.userInfo;
                f.unshift([g.id, g.name, g.faceUrl, g.cnId]),
                localStorageObj.set("at", e)
            }
            var h = PageManager.getCurrentPage().id;
            h != "nearbyuser" && this.jObj.find(".t_followeach").show(),
            d.text(this.initCfg && this.initCfg.cancelText ? this.initCfg.cancelText: "取消收听").attr("data-ac", g_ac.AC_USER_UNFOLLOW).removeClass("follow-btn").addClass("unfollow-btn");
            break;
        case g_ac.AC_USER_UNFOLLOW:
            Tips.blink("success", "已取消收听");
            if (f) {
                for (var i = 0; i < f.length; i++) if (f[i][0] == this.target_user_id) {
                    f.splice(i, 1);
                    break
                }
                localStorageObj.set("at", e)
            }
            this.jObj.find(".t_followeach").hide(),
            d.text("收听").attr("data-ac", g_ac.AC_USER_FOLLOW).removeClass("unfollow-btn").addClass("follow-btn");
            break;
        case g_ac.AC_ADD_USER_GROUP_LIST:
            Tips.blink("success", "已特别收听"),
            $("#specialFollowingTab").show(),
            d.html("取消特别").attr("data-ac", g_ac.AC_REMOVE_USER_GROUP_LIST).removeClass("follow-btn").addClass("unfollow-btn");
            break;
        case g_ac.AC_REMOVE_USER_GROUP_LIST:
            Tips.blink("success", "已取消特别收听"),
            d.html("特别收听").attr("data-ac", g_ac.AC_ADD_USER_GROUP_LIST).removeClass("unfollow-btn").addClass("follow-btn");
            break;
        default:
            console.error("shouldn't be here")
        } else switch (c) {
        case g_ac.AC_USER_FOLLOW:
            Tips.blink("fail", "收听失败");
            break;
        case g_ac.AC_USER_UNFOLLOW:
            Tips.blink("fail", "已取消收听失败");
            break;
        case g_ac.AC_ADD_USER_GROUP_LIST:
            Tips.blink("fail", "特别收听失败");
            break;
        case g_ac.AC_REMOVE_USER_GROUP_LIST:
            Tips.blink("fail", "取消特别收听失败")
        }
    }
    function d(a, b) {
        if ( !! b) {
            var c = {
                remove: "你确定将" + a + "移出黑名单?\n移出黑名单之后,你会重新收到来自他的私信和其它通知.",
                add: "你确定将" + a + "加入黑名单?\n加入黑名单之后,你将取消收听他的所有广播,不再收到来自他的私信与任何通知,如果你哪天原谅了他,可以将他移出黑名单."
            },
            d = b == g_ac.AC_REMOVE_BLACK_USER_LIST ? "remove": "add";
            confirm(c[d]) && (LoadingController.saveLoading(), NetWork.commonRequest(this, {
                ac: b,
                tu: a
            },
            function(a) {
                LoadingController.unloading(),
                parseInt(a.result, 10) === 0 ? (b == g_ac.AC_REMOVE_BLACK_USER_LIST ? (Tips.blink("success", "已取消拉黑"), $("#d_guest_home a[data-action='black']").text("拉黑").attr("data-ac", g_ac.AC_ADD_BLACK_USER_LIST), $("#d_guest_home a[data-action='follow']").html("<span>收听</span>").attr("data-ac", g_ac.AC_USER_FOLLOW).removeClass("unfollow-btn").addClass("follow-btn").show()) : (Tips.blink("success", "已拉黑"), $("#d_guest_home a[data-action='black']").text("取消拉黑").attr("data-ac", g_ac.AC_REMOVE_BLACK_USER_LIST), $("#d_guest_home a[data-action='follow']").hide(), $("#d_guest_home a[data-action='special_follow']").hide()), location.hash.indexOf("blackList") > 0 && b == g_ac.AC_REMOVE_BLACK_USER_LIST && $(btnObj).closest("li").remove()) : b == g_ac.AC_REMOVE_BLACK_USER_LIST ? Tips.blink("fail", "取消拉黑失败") : Tips.blink("fail", "拉黑失败")
            }))
        }
    }
    function c() {
        var a = this;
        this.jObj.find(".t_follow-operation").click(function(b) {
            if (!loginPop.isLogin()) loginPop.show();
            else {
                LoadingController.saveLoading();
                var c = b.currentTarget.getAttribute("data-ac");
                a.followManage(c)
            }
        })
    }
    function b(a) {
        var b = {
            tu: this.target_user_id,
            ac: a
        };
        NetWork.commonRequest(this, b, this.followReaction, !0)
    }
    function a(a) {
        this.jObj = $(a),
        this.target_user_id = this.jObj.attr("data-uid"),
        this.name = this.jObj.data("name"),
        this.img = this.jObj.find("img.t_head").data("src")
    }
    return {
        init: a,
        followManage: b,
        bindAction: c,
        followReaction: e,
        handleBlackList: d
    }
} (),
MBUser.initjObj = function(a, b) {
    a.length > 1 && a[0].tagName == "li" ? a.filter("li[data-uid]").not(".t_getmore").each(function(a, c) {
        new MBUser(c, b)
    }) : a.find("li[data-uid]").not(".t_getmore").each(function(a, c) {
        new MBUser(c, b)
    })
},
Topic.prototype = function() {
    function e(a) {
        var b = this.jObj.find("a.t_follow-operation");
        LoadingController.unloading(),
        parseInt(a.result, 10) === 0 ? this.jObj.remove() : console.error("drop kept topic error")
    }
    function d() {
        var a = this;
        this.jObj.find("a.t_join").click(function(a) {
            var b = $(a.target).data("topic");
            PageManager.require("compose",
            function() {
                var a = PageManager.getObj("compose");
                a.enter({
                    urlParams: {
                        topic: b
                    }
                })
            },
            this)
        }),
        this.jObj.find("a.t_follow-operation").click(function(b) {
            var c = $(b.target);
            a.followManageForTopic({
                ac: c.attr("data-ac"),
                keyword: c.attr("data-keyword"),
                iskeyword: c.attr("data-iskeyword"),
                tid: c.attr("data-topic-id")
            })
        }),
        this.jObj.find("a.t_unsub").click(function(b) {
            var c = $(this);
            if (c.attr("type") === "keyword") {
                if (confirm("您要取消订阅该关键字?")) {
                    LoadingController.saveLoading();
                    var d = {
                        ac: g_ac.AC_KEYWORD_DROP,
                        keyword: a.keyword
                    };
                    NetWork.commonRequest(a, d, a.followReaction)
                }
            } else if (confirm("您要取消订阅该话题?")) {
                LoadingController.saveLoading();
                var d = {
                    ac: g_ac.AC_TOPIC_DROP,
                    tid: a.id
                };
                NetWork.commonRequest(a, d, a.followReaction)
            }
        }),
        this.jObj.find("a.t_topic-page-entrance").click(function(b) {
            var c = "detailTopic";
            a.iskeyword == "1" && (c = "searchTopic"),
            PageManager.require(c,
            function() {
                var b = PageManager.getObj(c),
                d = a.keyword;
                a.iskeyword == "1" && (b = PageManager.getObj(c)),
                b.enter({
                    urlParams: {
                        keyword: d
                    }
                })
            },
            this)
        })
    }
    function c(a) {
        var b = this.jObj.find("a.t_follow-operation");
        if (a.result == "0") {
            console.log(b.attr("data-ac"));
            var c = b.attr("data-ac") == g_ac.AC_TOPIC_KEEP || b.attr("data-ac") == g_ac.AC_KEYWORD_KEEP ? !0 : !1,
            d = b.attr("data-iskeyword") == "0" ? !1 : !0,
            e;
            d ? c ? e = g_ac.AC_KEYWORD_DROP: e = g_ac.AC_KEYWORD_KEEP: c ? e = g_ac.AC_TOPIC_DROP: e = g_ac.AC_TOPIC_KEEP,
            c ? b.removeClass("follow-btn").addClass("unfollow-btn") : b.removeClass("unfollow-btn").addClass("follow-btn"),
            b.text(c ? "取消订阅": "添加订阅").removeAttr("data-ac").attr("data-ac", e),
            Tips.blink("success", a.msg)
        } else a ? Tips.blink("fail", a.msg) : Tips.blink("offline")
    }
    function b(a) {
        NetWork.commonRequest(this, a, this.followReactionForTopic)
    }
    function a(a) {
        this.jObj = $(a),
        this.id = this.jObj.attr("data-topic_id"),
        this.topic_text = this.jObj.attr("data-topic_text"),
        this.keyword = this.jObj.attr("data-topic_keyword"),
        this.iskeyword = this.jObj.attr("data-topic_iskeyword"),
        this.msg_count = this.jObj.attr("data-msg_count")
    }
    return {
        init: a,
        bindAction: d,
        followReaction: e,
        followManageForTopic: b,
        followReactionForTopic: c
    }
} (),
Topic.initjObj = function(a) {
    a.length > 1 ? a.filter("li[data-topic_id]").not(".t_getmore").each(function(a, b) {
        new Topic(b)
    }) : a.children("li[data-topic_id]").not(".t_getmore").each(function(a, b) {
        new Topic(b)
    })
},
Page.prototype = function() {
    function j() {
        NavControl.back()
    }
    function i(a) {
        self.forceRefresh = a
    }
    function h(a, b) {
        var c = a.find("ul[mst='0']");
        if (c.length > 0) {
            var d = ejsCreateMsg(b.jsonDump);
            c.prepend(d),
            new MbMessage(c.children("li")[0]),
            imgLoader(c.children("li").eq(0), "img.t_avatar"),
            imgLoader(c.children("li").eq(0), "img.t_load")
        }
    }
    function g() {
        window.inited || ($(document.body).delegate("a.t_btn-back", "click",
        function() {
            var a = PageManager.getCurrentPage();
            a && typeof a.backAction == "function" && a.backAction()
        }), $(document.body).delegate("a.t_refresh", "click",
        function(a) {
            var b = PageManager.getCurrentPage();
            b.isRefresh = !0,
            clearTimeout(PageManager.scrollTimer),
            MoveableNav.scrollToTop(),
            b.refresh()
        }), window.inited = !0)
    }
    function f() {
        this.forceRefresh = !1,
        this.id != "qixi_2" && this.id != "qixi_1" && LoadingController.unloading()
    }
    function e() {
        this.preFresh(),
        this.updateArgument && this.updateArgument.ac ? NetWork.refreshPage(this, this.updateArgument) : this.refreshReaction && this.refreshReaction()
    }
    function d() {
        this.lockPos || setTimeout(function() {
            util.getHashParams().urlParams.scroll || MoveableNav.scrollToTop()
        },
        200),
        this.id != "qixi_2" && this.id != "qixi_1" && this.id != "qixi_3" && LoadingController.loading(),
        this.loaded = !0,
        PageManager.scrollTimer && clearTimeout(PageManager.scrollTimer)
    }
    function c() {
        var a = {
            myhome: 0,
            notification: 1,
            hot: 2,
            channels: 3,
            app: 4
        },
        b = $("nav.main-nav > a"),
        c = $("nav.main-nav > span");
        if (this.activeTabName != "keep") {
            if (!c.length) return;
            var d = a[this.activeTabName] * c.width();
            b.removeClass("main-nav-current"),
            b.eq(a[this.activeTabName]).addClass("main-nav-current"),
            this.activeTabName in a ? c.css("display") == "none" ? (c.css("visibility", "hidden"), c.css("display", "block"), d = a[this.activeTabName] * c.width(), c.css("visibility", "visible"), c.css("display", "none"), c.css("top", "0"), c.css("-webkit-transform", "translate3d(" + d + "px, 0, 0)"), c.css("-webkit-transition-duration", "0"), setTimeout(function() {
                c.css("display", "block"),
                c.css("-webkit-transition-duration", "400ms")
            },
            0)) : (c.css("top", "0"), c.css("-webkit-transform", "translate3d(" + d + "px, 0, 0)")) : (c.css("display", "none"), c.css("-webkit-transition-duration", "0"))
        }
    }
    function b(a) {
        cesuTongJi.step1(),
        this.lastHash = location.hash,
        window.activedLayer && window.activedLayer.hide(),
        window.activedLayObj && window.activedLayObj.hide(),
        $("nav a.t_open").removeClass("t_open"),
        a = a ? a: {};
        var b = a.urlParams ? a.urlParams: {},
        d = this.id,
        e = this,
        f,
        g,
        h = this.jObj.find("ul[mst='" + this.updateArgument.mst + "'] li").length;
        f = PageManager.getCurrentPage(),
        g = f ? f: PageManager.getObj("myhome");
        var i = a.forceRefresh != undefined ? a.forceRefresh: f.forceRefresh,
        j = !this.loaded || !1 !== i && i != undefined;
        pvTongJi.count(j),
        adTongJi.send(j),
        PageManager.go(d, b),
        c.call(this);
        if (this.loaded) {
            if (!1 === i) return ! 1; ! 0 === i && (clearTimeout(PageManager.scrollTimer), b.scroll || MoveableNav.scrollToTop(), e.refresh())
        } else b.scroll || MoveableNav.scrollToTop(),
        this.refresh()
    }
    function a() {
        this.updateArgument = {},
        this.jObj = $(this.jObjDom),
        this.jObj.insertAfter($("#t_moveable_bar")),
        this.jObjSubNavDom && (this.jObjSubNav = $(this.jObjSubNavDom), $("#t_head2").append(this.jObjSubNav));
        if (this.jObjSubNav && this.jObjSubNav.find("a.t_refresh").length > 0) {
            this.refresh_button = this.jObjSubNav.find("a.t_refresh"),
            this.updateArgument.mst = this.refresh_button.attr("mst"),
            this.updateArgument.ac = this.refresh_button.attr("ac");
            var a = this.refresh_button.attr("shinforen");
            a && (this.updateArgument.shinforen = a);
            var b = this.refresh_button.attr("shinfo");
            b && (this.updateArgument.shinfo = b);
            var c = this.refresh_button.attr("eid");
            c && (this.updateArgument.eid = c)
        }
    }
    return {
        setForceRefresh: i,
        init: a,
        enter: b,
        bindAction: g,
        refresh: e,
        preFresh: d,
        refreshReaction: f,
        insertNewMessage: h,
        backAction: j
    }
} (),
MessagePage.prototype = new Page,
MessagePage.prototype.constructor = MessagePage,
$.extend(MessagePage.prototype, {
    init: function() {
        Page.prototype.init.call(this),
        this.tabs = this.jObj.find(".t_tab-container a[mst]")
    },
    bindAction: function() {
        Page.prototype.bindAction.call(this);
        var a = this;
        this.tabs && this.tabs.click(function(b) {
            if (a.currentTab == this) a.refresh(!0);
            else {
                var c = this.getAttribute("mst");
                a.tabSwitch(c, b),
                a.currentTab = this
            }
        }),
        this.bindGetMore(this.jObj)
    },
    doGetMore: function() {
        var a = PageManager.getCurrentPage(),
        b = a.jObj.find(".t_btn-getmore")[0],
        c;
        a.gettingMore = !0,
        a.moreList = a.moreList || {};
        if (a.moreList[a.currentMst] != undefined) c = a.moreList[a.currentMst];
        else {
            if (!b) return;
            var d = b.getAttribute("data-mid"),
            e = b.getAttribute("data-mrt"),
            f = b.getAttribute("data-pid");
            c = {
                mid: d,
                mrt: e
            },
            f && (c.pid = f)
        }
        LoadingController.getMoreIng(),
        a.getMore(c)
    },
    bindGetMore: function(a) {
        var b = this;
        a.find(".t_btn-getmore").click(b.doGetMore)
    },
    instanceListContent: function(a, b) {
        switch (Number(b)) {
        case g_mst.SEARCH_USER_LIST:
        case g_mst.FAMOUS_USER_LIST:
        case g_mst.HOT_USER_LIST:
        case g_mst.NEARBY_USER_LIST:
        case g_mst.CLOSE_FRIEND:
        case g_mst.MAYBE_KNOW:
        case g_mst.JOINTFOLLOW:
        case g_mst.SEARCH_USER_FOLLOWER:
        case g_mst.SEARCH_USER_FOLLOW:
        case g_mst.USER_FOLLOWER:
        case g_mst.USER_FOLLOWING:
        case g_mst.USER_SPECIAL_FOLLOWING:
        case g_mst.USER_FOLLOWING_CONF:
        case g_mst.RECOMMEND_FAMOUS:
        case g_mst.FAMOUS_INDEX:
            MBUser.initjObj(a);
            break;
        case g_mst.TOPIC_LIST:
        case g_mst.HOT_TOPIC_LIST:
        case g_mst.KEYWORD_LIST:
            Topic.initjObj(a);
            break;
        case g_mst.PRIVATEMSGHOME:
            PrivateMessage.initMessage(a);
            break;
        case g_mst.KEPT_MSG:
            a.find("li").attr("isfav", "true").attr("favpage", "true"),
            MbMessage.initMessage(a);
            break;
        default:
            MbMessage.initMessage(a)
        }
    },
    initMsgContainerMap: function() {
        this.msgContainerMap = {};
        var a = this;
        this.msgContainerMap.getOrCreate = function(b) {
            var c;
            this[b] ? c = this[b] : (c = new MessageContainer(b, a), this[b] = c);
            return c
        }
    },
    refresh: function() {
        this.jObj.find("ul[mst='" + this.updateArgument.mst + "']").length < 1 && window.homeMsgJson != undefined && this.updateArgument.ac == g_ac.AC_MORE_HOME_MSG ? (Page.prototype.preFresh.call(this), this.refreshReaction(window.homeMsgJson, !1), window.homeMsgJson = undefined) : Page.prototype.refresh.call(this)
    },
    refreshReaction: function(a, b) {
        Page.prototype.refreshReaction.call(this, a, b),
        this.currentMst = a.jsonDump.mst,
        this.moreList = this.moreList || {},
        this.moreList[this.currentMst] = a.jsonDump.getMoreData;
        var c = this,
        d = this.jObj.find("div.t_pageloading");
        if (a.result != "0" && a.jsonDump && a.jsonDump.mst != g_mst.NEARBY_MSG_LIST && a.jsonDump.mst != g_mst.NEARBY_USER_LIST) console.error("json return result not 0");
        else {
            if (a.jsonDump && typeof a.jsonDump.mst != "undefined") {
                var e = this,
                f = "renderOptions" in e ? e.renderOptions: null,
                g = MessagePage.refreshRenderProxy(a, f);
                g.addClass("t_open"),
                e.instanceListContent(g, a.jsonDump.mst),
                e.bindGetMore(g);
                var h = e.jObj.find('ul[mst="' + a.jsonDump.mst + '"]');
                if (h.length > 0) h.replaceWith(g);
                else {
                    e.jObj.find("ul[mst]").removeClass("t_open").hide();
                    var i = e.jObj.find("div[content]");
                    i.length > 0 ? i.append(g) : e.jObj.append(g)
                }
            }
            this.afterRefresh && typeof this.afterRefresh == "function" && this.afterRefresh(),
            this.bindScroll(),
            setTimeout(function() {
                imgLoader(c.jObj, "img.t_head"),
                imgLoader(c.jObj, "img.t_avatar"),
                imgLoader(c.jObj, "img.t_load"),
                b || c.loadHeadNav(a)
            },
            500)
        }
    },
    afterRefresh: function() {},
    bindScroll: function() {
        window.scrollDetect || ($(document).bind("scroll", this.scrollAct), window.scrollDetect = !0),
        this.jObj.find('ul[mst="' + this.updateArgument.mst + '"]').attr("times", "1")
    },
    scrollAct: function() {
        var a = [g_mst.HOME_MSG, g_mst.CHANNEL_DETAIL, g_mst.TIMELINE_ORIGINAL_MSG, g_mst.SPECIAL_MSG, g_mst.IMETION_MSG, g_mst.IMETION_MSG_FOLLOWING, g_mst.USER_TIMELINE, g_mst.SEARCH_TOPIC_LIST, g_mst.SEARCH_TOPIC_JX_LIST, g_mst.SEARCH_TOPIC_ALL_LIST, g_mst.IPOST_MSG, g_mst.ORIGINAL_MSG, g_mst.WITH_IMAGE_MSG, g_mst.TIMELINE_WITH_IMAGE_MSG, g_mst.FORWARD_MSG, g_mst.REPLY_MSG, g_mst.KEPT_MSG, g_mst.SEARCH_MSG_LIST, g_mst.HOT_MSG_LIST, g_mst.RANDOM_MSG_LIST, g_mst.NEARBY_MSG_LIST, g_mst.QQ_FRIENDS_MSG, g_mst.TOPIC_LIST_MYFOLLOW, g_mst.FAMOUS_SAY, g_mst.IMENTION_MSG_STAR, g_mst.BIDIRECTION_FOLLOWS, g_mst.LIST_MSG, g_mst.TOPIC_LIST_GOOD, g_mst.TOPIC_LIST_MYFOLLOW, g_mst.TOPIC_LIST_ALL, g_mst.TOPIC_DETAIL_ALL, g_mst.TOPIC_DETAIL_IMAGE, g_mst.TOPIC_DETAIL_NEW, g_mst.TOPIC_DETAIL_DEFINE],
        b = PageManager.getCurrentPage(),
        c = $(document).scrollTop(),
        d = window.innerHeight,
        e = document.body.scrollHeight,
        f,
        g,
        h,
        i;
        if (!b.gettingMore) {
            b ? (f = b.updateArgument.mst != undefined ? Number(b.updateArgument.mst) : null, g = b.jObj.find('ul[mst="' + f + '"]'), h = a.indexOf(f) != -1, i = g.attr("times")) : (h = !1, i = 0),
            i = parseInt(i);
            if (i % 2 != 0 && h && e - (c + d) < 1920 && document.body.scrollHeight > d * 2) {
                var j = PageManager.getCurrentPage();
                j.doGetMore && j.doGetMore()
            }
        }
    },
    loadHeadNav: function(a) {
        if (this.headNavLoad && a.jsonDump.msgs) {
            var b = "";
            for (var c = 0; c < a.jsonDump.msgs.length; c++) {
                var d = a.jsonDump.msgs[c];
                b += d.authorId + "|"
            }
            var e = {
                ac: g_ac.AC_HEADNAVFLAG,
                ids: b
            };
            NetWork.commonRequest(this, e, this.loadNavHtml)
        }
    },
    loadNavHtml: function(a) {
        var b = this;
        for (var c = 0; c < a.jsonDump.msgs.length; c++) {
            var d = a.jsonDump.msgs[c];
            if (d.id != g_usrId) {
                if (!this.jObj) return;
                this.jObj.find("div.t_" + d.id + "_headNav").each(function() {
                    var a = $(this);
                    a.attr("navLoad") || (a.attr("navLoad", !0), d.follow == 1 ? a.find("a.t_unfollow_nav").show() : a.find("a.t_follow_nav").show(), (d.pmSet == 2 || d.pmSet == 0 && d.follower == 1 || d.pmSet == 1 && (d.follower == 1 || g_isVip)) && a.find("a.t_privatemsg_nav").show())
                })
            }
        }
    },
    getMore: function(a) {
        pvTongJi.count(),
        NetWork.pageGetMore(this, $.extend({
            more: 1
        },
        this.updateArgument, a))
    },
    errorReaction: function(a) {
        this.gettingMore = !1
    },
    getMoreReaction: function(a) {
        var b = this,
        c = b.jObj.find('ul[mst="' + b.updateArgument.mst + '"]'),
        d = c.attr("times"),
        e;
        d == "12" && (c.html('<li class="timeline-list-item wb-more"><a class="t_auth t_btn-getmore" data-mid="157599074015604" data-mrt="1344482942">查看更多</a></li>'), d = 0, MoveableNav.scrollToTop()),
        a || Tips.blink("offline"),
        this.moreList[this.currentMst] = a.jsonDump.getMoreData;
        if (parseInt(a.result, 10) === 0) {
            var f = Number(a.jsonDump.mst),
            g = this.jObj.find("ul[mst='" + f + "'] > li.wb-more");
            if (!g || g.length < 1) {
                console.error("error, can't find get more li");
                return
            }
            var h = this,
            i = "renderOptions" in h ? h.renderOptions: null,
            j = ejsRender(a.jsonDump, i),
            k = $(j);
            h.instanceListContent(k, f),
            h.bindGetMore(k),
            k.get(0).nodeName === "UL" ? g.replaceWith(k.children("li")) : g.replaceWith(k)
        } else console.error("get more json result error"),
        LoadingController.removeGetMore();
        if (this.headNavLoad) {
            var l = "";
            if (a.jsonDump.msgs) {
                for (var m = 0; m < a.jsonDump.msgs.length; m++) {
                    var n = a.jsonDump.msgs[m];
                    l += n.authorId + "|"
                }
                var o = {
                    ac: g_ac.AC_HEADNAVFLAG,
                    ids: l
                };
                NetWork.commonRequest(this, o, this.loadNavHtml)
            }
        }
        d++,
        c.attr("times", d),
        b.gettingMore = !1,
        imgLoader(this.jObj, "img.t_avatar"),
        imgLoader(this.jObj, "img.t_load"),
        imgLoader(this.jObj, "img.t_head")
    },
    tabSwitch: function(a) {
        this.tabs.each(function(b, c) {
            var d = $(c);
            a == d.attr("mst") ? d.parent("li.timeline-nav-item").addClass("timeline-nav-active") : d.parent("li.timeline-nav-item").removeClass("timeline-nav-active")
        }),
        this.updateArgument.mst = a;
        var b = this.jObj.find("ul[mst='" + a + "']");
        b.length > 0 ? (this.tabrefresh && this.refresh(), this.jObj.find("ul[mst]").removeClass("t_open").hide(), b.addClass("t_open").show()) : this.refresh()
    },
    _showMsgContainer: function(a, b) {
        var c = this.jObj.find("ul[mst='" + a + "']");
        if (c.length > 0) c.replaceWith(b);
        else {
            this.jObj.find("ul[mst]").removeClass("t_open").hide();
            var d = this.jObj.find("div[content]");
            d.length > 0 ? d.append(b) : this.jObj.append(b)
        }
    }
}),
MessagePage.refreshRenderProxy = function(a, b) {
    var c;
    if (a) {
        if (parseInt(a.result, 10) === 0) if (a.info && a.info.value && a.info.value.length > 0 || a.jsonDump) if (a.jsonDump) {
            var d = ejsRender(a.jsonDump, b);
            c = $(d)
        } else c = $(a.info.value)
    } else Tips.blink("offline");
    if (!c) {
        console.log("bad refresh res");
        return null
    }
    return c
};
var firstajax = !0,
NetWork = function() {
    function i(a, b, c, f) {
        e(a, b, d, c)
    }
    function h(a, b) {
        e(a, b, c)
    }
    function g(a, c) {
        e(a, c, b)
    }
    function f(b, c) {
        e(b, c, a)
    }
    function e(e, f, g) {
        var h = util.getHashParams(),
        i = "",
        j = localStorageObj.get("clickhis");
        j != null && j.num > 0 && (f.clickid = j.clickid, localStorageObj.remove("clickhis"));
        var k = f.ac,
        l = localStorageObj.get("writehis");
        (k == g_ac.AC_MSG_POST || k == g_ac.AC_MSG_REPLY || k == g_ac.AC_MSG_FORWARD || k == g_ac.AC_MSG_DIRECT || k == g_ac.AC_MSG_DIRECT_REPLY || k == g_ac.AC_MSG_DIRECT_MANUAL) && l !== null && (f.lp = l, localStorageObj.remove("writehis")),
        f.dl2 = 1,
        f.dumpJSON = 1,
        f.pageid = h.pageId;
        var m = util.getUrlParams().g_f;
        m && (f.g_f = m),
        firstajax && (firstajax = !1);
        if (!$.isEmptyObject(h.urlParams)) {
            for (var n in h.urlParams) i += n + "," + h.urlParams[n] + "|";
            i = i.replace(/\|$/, ""),
            f.params = i
        }
        var o = arguments,
        p = function(h) {
            switch (g) {
            case a:
                e && touch_console_log && console.log(e.id + " refresh ajax end:" + ((new Date).getTime() - window.startTime)),
                e.refreshReaction(h),
                cesuTongJi.step2();
                break;
            case b:
                e.getMoreReaction(h);
                break;
            case c:
                if (h.result == -2) {
                    PageManager.require("spam",
                    function() {
                        var a = PageManager.getObj("spam");
                        a.succFn || (a.succFn = p),
                        a.requestArgs = f,
                        util.pushHashParams({
                            pageId: "spam",
                            urlParams: {
                                imgUrl: h.jsonDump.imgUrl,
                                imgSid: h.jsonDump.imgSid
                            }
                        })
                    });
                    return
                }
                e.sendReaction(h);
                break;
            case d:
                if (o.length != 4) {
                    console.log("error, common action must specify reaction function");
                    return
                }
                o[3].call(e, h, f);
                break;
            default:
                console.error("never shouldn't be here")
            }
        },
        q = function(a) {
            e && e.errorReaction && e.errorReaction(a)
        };
        f = wfCount.getParams(f.ac, f),
        e && g == a && touch_console_log && console.log(e.id + " refresh ajax start:" + ((new Date).getTime() - window.startTime)),
        $.ajax({
            url: g_action,
            data: f,
            dataType: "json",
            timeout: 3e4,
            success: function() {
                try {
                    p.apply(this, arguments)
                } catch(a) {
                    q.apply(this, arguments)
                }
                LoadingController.unloading()
            },
            error: function(a, b) {
                b === "error" && a.status === 0 && (console.log(f), e && e.id != "myhome" && g_isLogin && Tips.blink("offline")),
                q.apply(this, arguments),
                LoadingController.unloading()
            }
        })
    }
    var a = "REFRESH",
    b = "MORE",
    c = "SEND",
    d = "COMMON";
    return {
        refreshPage: f,
        pageGetMore: g,
        sendMsg: h,
        commonRequest: i
    }
} ();
MbMessage.prototype = new Message,
MbMessage.prototype.constructor = MbMessage,
$.extend(MbMessage.prototype, {
    bindAction: function() {
        Message.prototype.bindAction.call(this);
        var a = this;
        loginPop.registerLoginCheck(["a[data-ac]", "a.t_comment-msg", "a.t_show-map", "a.t_more", "a.t_privatemsg_nav", "a.t_dialog_nav"], this.jObj),
        this.jObj.find("a.t_comment-msg").each(function(b, c) {
            var d = $(c);
            d.click(function(b) {
                g_isLogin && a.showActionForm(d.data("ac"))
            })
        }),
        this.jObj.find("a.t_forward-msg").each(function(b, c) {
            var d = $(c);
            d.click(function(b) {
                g_isLogin && a.showActionForm(d.data("ac"))
            })
        }),
        this.jObj.find("a.t_privatemsg_nav").click(function(a) {
            var b = $(this),
            c = "";
            privateLayer.open({
                toUser: b.attr("data-uid"),
                lastContent: c
            })
        }),
        this.jObj.find("a.t_dialog_nav").click(function(b) {
            a.showActionForm(g_ac.AC_MSG_REPLY)
        }),
        this.jObj.find("a.t_follow_nav").click(function(b) {
            a.followManage(g_ac.AC_USER_FOLLOW, $(this).attr("data-uid"))
        }),
        this.jObj.find("a.t_unfollow_nav").click(function(b) {
            a.followManage(g_ac.AC_USER_UNFOLLOW, $(this).attr("data-uid"))
        }),
        this.jObj.find("span.t_num").click(function(b) {
            PageManager.require("detail",
            function() {
                var b = a.jObj.attr("msgid");
                util.pushHashParams({
                    pageId: "detail",
                    urlParams: {
                        msgid: b
                    }
                })
            },
            this)
        }),
        this.jObj.find("a.t_show-map").click(function(b) {
            a.toggleLbsMap()
        }),
        this.jObj.find("a.t_more").click(function(b) {
            if (g_isLogin) {
                var c = {},
                d = a.jObj.attr("isfav") == "true" ? "delfav": "addfav";
                c.point = a,
                c.optsObj = {},
                c.optsObj[d] = a.favManager,
                a.jObj.attr("allowdelete") != 1 && (c.optsObj.reply = a.reply),
                a.jObj.attr("allowDelete") == "1" && (c.optsObj.delmsg = a.delSelf),
                morePopLayer.init(c),
                morePopLayer.show()
            }
        }),
        this.jObj.find("a.t_topic_name").click(function(a) {
            var b = a.currentTarget.textContent.replace(/#/g, "");
            util.pushHashParams({
                pageId: "topic_detail",
                urlParams: {
                    title: b,
                    keyword: b,
                    iskeyword: 0
                }
            })
        }),
        this.jObj.find("a.t_mb_image").click(function(a) {
            var b = $(a.currentTarget).children("[src]"),
            c = b.height(),
            d = b.width(),
            e = $(a.currentTarget).children("[src]").attr("src"),
            f = $(a.currentTarget).children("[img-type]").attr("img-type");
            ImageLayerController.show(e, f, c, d, b && b.get(0).tagName.toUpperCase() == "SPAN" ? !0 : !1)
        })
    },
    followManage: function(a, b) {
        var c = {
            tu: b,
            ac: a
        };
        LoadingController.saveLoading(),
        NetWork.commonRequest(this, c, this.followReaction)
    },
    followReaction: function(a, b) {
        LoadingController.unloading();
        var c = parseInt(b.ac, 10),
        d = localStorageObj.get("at"),
        e = this.jObj.attr("usrid"),
        f = d ? d.msg: null;
        if (parseInt(a.result, 10) === 0) switch (c) {
        case g_ac.AC_USER_FOLLOW:
            Tips.blink("success", "已收听"),
            this.jObj.find("a.t_unfollow_nav").show(),
            this.jObj.find("a.t_follow_nav").hide();
            if (f) {
                var g = a.jsonDump.userInfo;
                f.unshift([g.id, g.name, g.faceUrl, g.cnId]),
                localStorageObj.set("at", d)
            }
            this.cfg && this.cfg.followSuccess && this.cfg.followSuccess.call(this, a, b);
            break;
        case g_ac.AC_USER_UNFOLLOW:
            Tips.blink("success", "已取消收听"),
            this.jObj.find("a.t_follow_nav").show(),
            this.jObj.find("a.t_unfollow_nav").hide();
            if (f) {
                for (var h = 0; h < f.length; h++) if (f[h][0] == e) {
                    f.splice(h, 1);
                    break
                }
                localStorageObj.set("at", d)
            }
            this.cfg && this.cfg.unfollowSuccess && this.cfg.unfollowSuccess.call(this, a, b);
            break;
        default:
            console.error("shouldn't be here")
        } else c == g_ac.AC_USER_FOLLOW ? Tips.blink("fail", "收听失败") : Tips.blink("fail", "取消收听失败")
    },
    toggleLbsMap: function() {
        var a = this.jObj.find("a.t_show-map").data("lat"),
        b = this.jObj.find("a.t_show-map").data("lon");
        if (!a || !b) console.error("must have lbs link");
        else if (this.jObj.find("div.t_lbs-img").length < 1) {
            Canvas.loading();
            var c = "ABQIAAAAs2arCx3Ebp9iHtN3drjDuxRLr8XrmgYli4bJkXrC4b8DPKrv-hSp7h2ix1LQy_lS5s_aX2S8-rgHIQ",
            d = "http://ditu.google.cn/maps/api/staticmap?center=" + a + "," + b + "&zoom=13&size=265x150&mobile=true&language=zh-CN&markers=color:blue|size:S|" + a + "," + b + "&sensor=false&key=" + c,
            e = "http://ditu.google.com/maps?q=" + a + "," + b,
            f = '<div class="wb-media t_lbs-img"><a target="gmaps" href="' + e + '" ><img class="t_lbs-img" src=' + d + ' width="265" height="150"></a></div>';
            this.jObj.find("div.t_wb-area-info").append(f),
            this.jObj.find("div.t_lbs-img").show();
            var g = this;
            this.jObj.find("img.t_lbs-img").load(function() {
                Canvas.unloading(),
                g.jObj.find("a.t_show-map").text("隐藏地图")
            })
        } else this.jObj.find("img.t_lbs-img").unbind("load"),
        this.jObj.find("div.t_lbs-img").remove(),
        this.jObj.find("a.t_show-map").text("显示地图")
    },
    reply: function() {
        this.showActionForm(g_ac.AC_MSG_REPLY)
    },
    delSelf: function() {
        var a = {
            ac: g_ac.AC_MSG_DEL,
            mid: this.jObj.attr("msgid")
        },
        b = this,
        c = confirm("您要删除信息");
        c && NetWork.commonRequest(this, a,
        function(a) {
            a.result == 0 ? (Tips.blink("success", "已删除"), b.onDelete ? b.onDelete() : b.jObj.remove()) : Tips.blink("fail", "删除失败")
        })
    },
    favManager: function(a, b) {
        var c = this,
        d = b ? $(b) : c.jObj,
        e = d.attr("msgid"),
        f = {
            ac: a,
            mid: e
        };
        LoadingController.saveLoading(),
        NetWork.commonRequest(this, f,
        function(b) {
            LoadingController.unloading(),
            b.result == 0 ? a == g_ac.AC_MSG_KEEP ? (d.attr("isfav", "true"), Tips.blink("success", "已收藏")) : (d.attr("isfav", "false"), Tips.blink("success", "已取消收藏"), d.attr("favpage") == "true" && d.fadeOut(1e3)) : Tips.blink("fail", b.msg)
        })
    },
    showActionForm: function(a, b) {
        writePopLayer.init(),
        this.setPopContent(a, writePopLayer),
        writePopLayer.show()
    },
    setPopContent: function(a, b) {
        function q(a, b) {
            var c = $(b),
            d = c.text();
            c.children().length > 0 ? c.contents().each(m) : b.localName != "a" || d.indexOf("#") == 0 ? p.push(d) : b.localName == "a" && b.getAttribute("data-uid") != null ? b.getAttribute("data-cnid") != null && b.getAttribute("data-cnid") != "" ? p.push("@" + b.getAttribute("data-cnid")) : p.push("@" + b.getAttribute("data-uid")) : p.push(d)
        }
        var c = "",
        d = "发送",
        e = "",
        f = !1,
        g = this.jObj,
        h = g.attr("type") ? parseInt(g.attr("type")) : -1,
        i = g.attr("usrname"),
        j = "",
        k = 0;
        a == g_ac.AC_MSG_REPLY || a == g_ac.AC_MSG_DIRECT_REPLY ? j = "对" + i + "说:": a == g_ac.AC_MSG_FORWARD ? (j = "转播", d = "转播") : a == g_ac.AC_MSG_COMMENT && (j = "评论", d = "评论", k = 1);
        if ((a == g_ac.AC_MSG_FORWARD || a == g_ac.AC_MSG_COMMENT) && (h == g_msgtype.FORWARD || h == g_msgtype.COMMENT)) {
            var l = [];
            function m(a, b) {
                var c = $(b),
                d = c.text();
                if (c[0].nodeType == 3 || c.css("display") != "none") if (c.children().length > 0) c.contents().each(m);
                else if (b.localName == "img" || b.localName == "a" && d.indexOf("#") != 0) {
                    if (b.localName == "a" && b.getAttribute("data-uid") != null) b.getAttribute("data-cnid") != null && b.getAttribute("data-cnid") != "" ? l && l.push("@" + b.getAttribute("data-cnid")) : l && l.push("@" + b.getAttribute("data-uid"));
                    else if (b.localName == "img" && !c.hasClass("t_load")) {
                        var e = b.getAttribute("src");
                        e = e.substring(e.lastIndexOf("f") + 1),
                        e = e.substring(0, e.lastIndexOf("."));
                        var f = parseInt(e, 10),
                        g = FaceMapping.getText(f);
                        l && l.push(g)
                    }
                } else l && l.push(d)
            }
            g.find(".t_fwd_content").contents().each(m);
            var n = g.attr("usrid");
            g.attr("cnid") != null && g.attr("cnid") != "" && (n = g.attr("cnid")),
            c = "|| @" + n + ":" + l.join("").replace(/\(|\)/g, "")
        }
        var o;
        h != g_msgtype.FORWARD ? (o = g.find(".t_source_msg"), o.length == 0 && (o = g.find(".t_fwd_content"))) : o = g.find(".t_source_msg"),
        o.length <= 0 && this.getSourceDom && (o = this.getSourceDom().find(".t_fwd_content"));
        var p = [];
        o.contents().each(q);
        var r = p.join("").replace(/\(|\)/g, "");
        e = "原文：<br>" + (r.length > 48 ? r.substr(0, 48) + "...": r);
        if (g.find("a.t_mb_image").length > 0 || this.getSourceDom && this.getSourceDom().find("a.t_mb_image").length > 0) e = e + '&nbsp;<span class="ico-image"></span>';
        var s = {
            srcContent: e,
            fContent: c,
            strTip: j,
            buttonTxt: d,
            ac: a,
            onlyComment: k,
            msg: this,
            image: f
        };
        b.setParams(s)
    },
    removeActionForm: function(a) {
        a = a ? a: this.jObj,
        a.children(".t_msg-op-form").remove(),
        a.children(".t_dialog").show(),
        a.find("a.t_comment-msg").show(),
        a.find(".t_mail-operation").show(),
        a.removeClass("t_edit")
    },
    submit: function(a) {
        var b = a.ac;
        Canvas.loading(this.jObj.find("a.t_wirte_send-btn").get(0));
        $.trim(a.msg) == "" && b != g_ac.AC_MSG_FORWARD ? (Canvas.unloading(), writePopLayer.isPosting = !1, Tips.blink("fail", "请输入内容")) : (LoadingController.pubLoading(), NetWork.sendMsg(this, a))
    },
    errorReaction: function(a) {
        writePopLayer.isPosting = !1,
        LoadingController.unloading(),
        writePopLayer.hide()
    },
    sendReaction: function(a) {
        writePopLayer.isPosting = !1;
        var b = this.jObj,
        c = $("#d_myhome");
        LoadingController.unloading(),
        Canvas.unloading(b.find("a.t_send").get(0)),
        writePopLayer.hide(),
        a.result == 0 ? (writePopLayer.writeParams.successTxt ? Tips.blink("success", writePopLayer.writeParams.successTxt) : writePopLayer.writeParams.ac == g_ac.AC_MSG_FORWARD ? (Tips.blink("success", "已转播"), Page.prototype.insertNewMessage.call(this, c, a)) : writePopLayer.writeParams.ac == g_ac.AC_MSG_COMMENT ? Tips.blink("success", "已评论") : Tips.blink("success", "已发布"), writePopLayer.writeParams.afterSuccess && writePopLayer.writeParams.afterSuccess.call(this)) : writePopLayer.writeParams.ac == g_ac.AC_MSG_FORWARD ? (Tips.blink("fail", "转播失败"), Page.prototype.insertNewMessage.call(this, c, a)) : writePopLayer.writeParams.ac == g_ac.AC_MSG_COMMENT ? Tips.blink("fail", "评论失败") : Tips.blink("fail", "发布失败")
    }
}),
MbMessage.initMessage = function(a, b, c) {
    a.length > 1 ? a.filter("li[msgid]").not(".t_getmore").each(function(a, d) {
        new MbMessage(d, b, c)
    }) : a.children("li[msgid]").not(".t_getmore").each(function(a, d) {
        new MbMessage(d, b, c)
    })
},
PrivateMessage.prototype = new MbMessage,
PrivateMessage.prototype.constructor = PrivateMessage,
$.extend(PrivateMessage.prototype, {
    bindAction: function() {
        var a = this;
        this.jObj.find(".t_reply").click(function() {
            var a = $(this),
            b = "上一条：" + a.parents("li").find(".t_content").html(),
            c = a.data("to");
            privateLayer.open({
                toUser: c,
                lastContent: b
            })
        })
    }
}),
PrivateMessage.initMessage = function(a) {
    a.find("li").each(function(a, b) {
        new PrivateMessage(b)
    })
},
MbDetailMessage.prototype = new MbMessage,
MbDetailMessage.prototype.constructor = MbDetailMessage,
$.extend(MbDetailMessage.prototype, {
    onDelete: function() {
        PageManager.require("myhome",
        function() {
            var a = PageManager.getObj("myhome");
            a.enter({
                forceRefresh: !0
            })
        },
        this)
    },
    getSourceDom: function() {
        return this.sourceElement
    }
}),
EJS.Helpers.prototype.renderFaceProxyImg = function(a, b) {},
EJS.Helpers.prototype.renderFwdSource = function(a) {
    if (typeof a == "undefined" || typeof a == "string" && a.length === 0) return "";
    var b = "writer",
    c = "",
    d = "",
    e = "",
    f = "",
    g = "",
    h = "",
    i = "",
    j = "",
    k, l = "";
    a.msgAuthorIsVIP && (b = "auth writer", c = '<span class="vip"></span>');
    if (a.imgSrc && a.imgSrc.length > 0 || a.videoImageUrl && a.videoImageUrl.length > 0) a.imgSrc && a.imgSrc.length > 0 && (a.hideImg ? d = '<a class="t_mb_image" ><span img-type="' + a.imgType + '"   src="' + a.imgSrc + '/120" >查看图片</span></a>': d = '<a class="t_mb_image" ><img class=\'t_load\' img-type="' + a.imgType + '"  data-src="' + a.imgSrc + '/120" src="http://3gimg.qq.com/microblog/touch/img/default.png" alt=""  /></a>'),
    a.videoImageUrl && a.videoImageUrl.length > 0 && (a.hideImg ? (d = d + '<a href="' + a.videoLink + '" class="mb-video" target="_blank">', d = d + "<span  >查看视频</span>") : (d = d + '<a href="' + a.videoLink + '" class="wb-video" target="_blank">', d = d + '<img src="' + a.videoImageUrl + '" alt="" width="100" height="80">'), d = d + "</a>"),
    e = '<div class="wb-media">' + d + "</div>";
    a.showLink && (f = "href='#guest_home/u=" + a.authorId + "'"),
    k = a.forwardCount > 9999999 ? "9,999,999+": util.numNotation(a.forwardCount);
    if (a.msgType == 4 || a.msgType == 5) j = "href='#guest_home/u=" + a.replyToUserId + "'",
    i = ' 对<strong class="wb-username"><a ' + j + '  class="' + b + '"> ' + a.replyToUserName + " </a></strong>说 ";
    a && a.lbsInfo && (l = renderMsgLBSArea(a.lbsInfo)),
    h = '<div class="wb-reply"><div class="wb-msg t_blockquote"><a ' + f + '">' + a.username + " </a>" + c + i + " : <span class='t_source_msg'>" + a.content + "</span></div>" + e + l + "</div>";
    return h
},
EJS.Helpers.prototype.renderFwdSourcePad = function(a) {
    if (typeof a == "undefined" || typeof a == "string" && a.length === 0) return "";
    var b = "",
    c = "",
    d = "",
    e = "",
    f;
    a.msgAuthorIsVIP && (b = "vip"),
    a.imgSrc.length > 0 && (a.hideImg ? c = '<a class="imgview" relimg="' + a.imgSrc + '">查看图片</a>': c = '<img class="illu"  src="' + a.imgSrc + '/120" >'),
    a.showLink && (d = "href='#guest_home/u=" + a.authorId + "'"),
    f = '<div class="replybox"><strong class="username"><a ' + d + '  class="' + b + '">' + a.username + "</a>:</strong>" + a.content + "",
    a.imgSrc && a.imgSrc.length > 0 && (f += '<div class="showimg"><span><img class="msg-img" src="' + a.imgSrc + '/160" alt="microblog img" ></span></div>'),
    f += "</div>";
    return f
},
renderMsgLBSArea = EJS.Helpers.prototype.renderMsgLBSArea = function(a) {
    if (typeof a == "undefined" || typeof a == "string" && a.length === 0) return "";
    var b = a.addr,
    c = a.lat,
    d = a.lon,
    e = "";
    a.sDis ? e = '<div class="wb-area-info t_wb-area-info"><address><em class="ico-area"></em>' + a.dis + " - " + b + " - " + '<a class="t_show-map" data-lat="' + c + '" data-lon="' + d + '" >显示地图</a></address></div>': e = '<div class="wb-area-info t_wb-area-info"><address><em class="ico-area"></em>' + b + " - " + '<a class="t_show-map" data-lat="' + c + '" data-lon="' + d + '" >显示地图</a></address></div>';
    return e
},
HomePage = generatePage("myhome"),
$.extend(HomePage.prototype, {
    jObjDom: '<div id="d_myhome" class="lay-main t_page" ><div class="timeline"><nav class="timeline-nav home-timeline-nav"><ul class="t_tab-container"><li class="timeline-nav-item timeline-nav-active"><a mst="' + g_mst.HOME_MSG + '" class="t_listen_class" clickid="254">全部</a>' + "</li>" + '<li class="timeline-nav-item">' + '<a class="t_uncascade t_listen_class" mst="' + g_mst.SPECIAL_MSG + '" clickid="255">特别收听</a>' + '<a id="t_timeline_type_selector_btn"  class="select t_listen_class" clickid="256"></a>' + '<div id="t_timeline_type_selector" class="timeline-type-tips" style="display:none"><div><div></div></div></div>' + "</li>" + '<li class="timeline-nav-item">' + '<a href="#nearbymsg" class="t_listen_class" clickid="257">附近</a>' + "</li>" + "</ul>" + "</nav>" + '<div class="wb-client-tips t_topBanner" style="display:none">' + '<a class="t_banner_text"><img height="40" width="320" src=""/></a>' + '<span class="ad-tips-close t_close_banner"></span>' + "</div>" + '<div class="t_ad ad-tips" style="display:none;">' + '<a class="t_ad_text"></a>' + '<a class="ad-tips-close t_close_ad">关闭</a>' + "</div>" + '<div class="last-year-today t_listen_class" clickid = "425" style="display:none">' + '<div class="wb-lyt-summary t_listen_class" clickid = "425"></div>' + "</div>" + '<div class="timeline-inner" content="content" style="min-height:340px"></div>' + "</div>" + "</div>",
    jObjSubNavDom: '<div id="myhome_subnav" class="wb-interact t_subnav"><div class="wb-interact-avatar"><a onclick="" class="breath-light wb-user-headimg t_home_avatar t_listen_class" clickid="249" style="background:url(http://t1.qlogo.cn/mbloghead/default/40) no-repeat;-webkit-background-size:34px auto;"></a></div><div onclick="" class="wb-interact-textarea t_towrite t_listen_class" clickid="248">说说你在做什么，想什么</div></div>',
    checkAdExpire: function() {
        var a = localStorageObj.get("home_ad_expire");
        if (!a) localStorageObj.set("home_ad_expire", (new Date).getTime());
        else {
            var b = new Date(parseInt(a)),
            c = new Date,
            d = (c.getTime() - b.getTime()) / 1e3 / 60 / 60 / 24;
            Math.ceil(d) >= 7 && (localStorageObj.remove("home_ad"), localStorageObj.set("home_ad_expire", c.getTime()))
        }
    },
    bindLastYear: function() {
        var a = this,
        b = function() {
            location.hash.indexOf("notification") == -1 && location.hash.indexOf("myhome") == -1 ? (localStorageObj.set("hideLastYear", "true"), $(window).unbind("hashchange", b)) : location.hash.indexOf("notification") > 0 && (a.fromNoti = a.fromNoti ? a.fromNoti + 1 : 1, a.fromNoti > 1 && (localStorageObj.set("hideLastYear", "true"), $(window).unbind("hashchange", b)))
        };
        $(window).bind("hashchange", b)
    },
    refresh: function() {
        var a = (new Date).toDateString(),
        b = localStorageObj.get("lastyearSavedTime"),
        c = localStorageObj.get("hideLastYear") ? localStorageObj.get("hideLastYear") : "false";
        (new Date(b)).toDateString() != (new Date).toDateString() && (c = "false"),
        localStorageObj.set("hideLastYear", c),
        c == "false" ? this.updateArgument.lastyear = 1 : this.updateArgument.lastyear = 0,
        MessagePage.prototype.refresh.call(this)
    },
    displayNewMission: function(a) {
        a.jsonDump.isNewMission ? this.jObjSubNav.find(".t_home_avatar").addClass("wb-user-gsign") : this.jObjSubNav.find(".t_home_avatar").removeClass("wb-user-gsign")
    },
    enter: function(a) {
        touch_console_log && console.log((new Date).getTime() - window.startTime + " enter " + this.id),
        this.checkAdExpire(),
        MessagePage.prototype.enter.call(this, a),
        $("nav a.t_status_myhome").addClass("t_open"),
        this.currentTab = this.jObj.find("nav li.timeline-nav-active a")[0],
        localStorageObj.get("myhome_head_hide") == "1" && $(".t_home_avatar").removeClass("breath-light")
    },
    leave: function() {
        userInfoLayer.hide()
    },
    init: function() {
        MessagePage.prototype.init.call(this),
        this.lastyearTpl = '<span class="wb-lyt-username t_listen_class" clickid = "425">[%=data[0]%]</span>[% if(window.g_isVip){ %]&nbsp;<span class="vip"></span>[% } %]<p class="wb-lyt-msg t_listen_class" clickid = "425">[%=data[1].content%][% if(data[1].imageUrl){ %]&nbsp;<img  class="t_listen_class" clickid = "425" src="[%=data[1].imageUrl%]/60">[% } %][% if(data[1].lbsInfo){ %]&nbsp;<em class="ico-area t_listen_class" clickid = "425"></em>[% } %]</p>',
        this.updateArgument = {},
        this.updateArgument.mst = g_mst.HOME_MSG,
        this.updateArgument.ac = g_ac.AC_MORE_HOME_MSG,
        this.selectorBtn = this.jObj.find("#t_timeline_type_selector_btn"),
        this.selector = this.jObj.find("#t_timeline_type_selector"),
        this.topBanner = this.jObj.find(".t_topBanner"),
        g_isLogin && g_usrimg && this.jObjSubNav.find(".t_home_avatar").css("background", "url(" + g_usrimg + ")"),
        this.prefetchGetMoreData = !1,
        this.saveLastRefreshData = !0,
        this.activeTabName = MoveableNav.navTabs.HOME,
        this.headNavLoad = !0,
        this.initList(),
        this.tabs = this.jObj.find(".t_tab-container a[mst]")
    },
    initList: function() {
        var a = $("#t_timeline_type_selector > div > div"),
        b = "",
        c;
        if (g_groupJson && g_groupJson.lists && g_groupJson.lists.length) for (var d = 0, e = g_groupJson.lists.length; d < e; d++) {
            var f = g_groupJson.lists[d].name,
            g = util.getByteLength(f) > 12 ? util.getByteStr(f, 10) + "...": f;
            d == e - 1 ? b += '<a class="type-separa" mst="' + g_mst.LIST_MSG + '" listid="' + g_groupJson.lists[d].id + '">' + g + "</a>": b += '<a mst="' + g_mst.LIST_MSG + '" listid="' + g_groupJson.lists[d].id + '">' + g + "</a>"
        }
        c = '<a href="javascript:void(0)" mst="' + g_mst.SPECIAL_MSG + '">特别收听</a>' + '<a href="javascript:void(0)" mst="' + g_mst.BIDIRECTION_FOLLOWS + '">相互收听</a>' + '<a href="javascript:void(0)" mst="' + g_mst.QQ_FRIENDS_MSG + '" class="type-separa">QQ好友</a>' + b + '<a href="javascript:void(0)" mst="' + g_mst.TIMELINE_ORIGINAL_MSG + '">原创</a>' + '<a href="javascript:void(0)" mst="' + g_mst.TIMELINE_WITH_IMAGE_MSG + '">图片</a>',
        a.append($(c)),
        a.css({
            overflow: "hidden"
        })
    },
    setAd: function(a) {
        var b = localStorageObj.get("home_ad");
        localStorageObj.set("home_ad", b ? b + "," + a: a)
    },
    bindAction: function() {
        var a = this;
        MessagePage.prototype.bindAction.call(this),
        a.bindLastYear(),
        $(document).delegate(".t_towrite", "click",
        function(a) {
            location.href = "#compose"
        }),
        this.topBanner.find(".t_banner_text, .t_close_banner").click(function(b) {
            cookieObj.set("home_top_closed", a.topBanner.find(".t_banner_text").attr("advid")),
            a.topBanner.hide()
        }),
        this.jObj.find(".t_close_ad").click(function(b) {
            var c = $(b.target);
            a.setAd(c.attr("data-id")),
            a.jObj.find(".t_ad").hide()
        }),
        this.jObj.find(".last-year-today").click(function(a) {
            location.hash = "#lastyear"
        }),
        this.selectorBtn.click(function(b) {
            a.toggleTypeSelector()
        });
        var b = $("#t_timeline_type_selector > div");
        this.listScroller = new iScroll(b[0]),
        $(document.body).delegate(".t_home_avatar", "click",
        function(a) {
            localStorageObj.get("myhome_head_hide") || (localStorageObj.set("myhome_head_hide", "1"), $(".t_home_avatar").removeClass("breath-light")),
            userInfoLayer.show()
        }),
        this.jObj.find(".t_ad_text").click(function(b) {
            var c = $(b.target),
            d = {
                type: c.attr("data-type"),
                iskeyword: c.attr("data-iskeyword"),
                title: c.text(),
                keyword: c.attr("data-keyword"),
                advid: c.attr("data-advid"),
                link: c.attr("data-link"),
                id: c.attr("data-id"),
                posid: c.attr("data-posid")
            };
            d.type == 2 ? (a.setAd(d.id), util.pushHashParams({
                pageId: "topic_detail",
                urlParams: {
                    title: d.title,
                    keyword: d.keyword,
                    iskeyword: d.iskeyword,
                    advid: d.advid,
                    posid: d.posid,
                    type: d.type,
                    tid: d.id
                }
            })) : d.type == 3 ? (a.setAd(d.id), util.pushHashParams({
                pageId: "detail",
                urlParams: {
                    advid: d.advid,
                    posid: d.posid,
                    type: d.type,
                    msgid: d.id
                }
            })) : d.type == 4 ? (a.setAd(d.id), util.pushHashParams({
                pageId: "guest_home",
                urlParams: {
                    advid: d.advid,
                    posid: d.posid,
                    type: d.type,
                    u: d.id
                }
            })) : d.type == 5 && (a.setAd(d.id), location.href = d.link)
        })
    },
    afterRefresh: function() {
        MoveableNav.scrollToTop()
    },
    getAd: function(a) {
        var b = localStorageObj.get("home_ad");
        b = b ? b + "": "";
        var c = 5;
        if (!a.length) return ! 1;
        while (c > 0) {
            var c = parseInt(Math.random() * (c - 1 + 1) + 1),
            d = c - 1;
            if (!a[d]) break;
            if (!b || b.indexOf(a[d].id) < 0) return a[d];
            a.splice(d, d),
            c--
        }
    },
    showLastYear: function(a) {
        var b = this,
        c, d = "",
        e = [],
        f = (new Date).toDateString(),
        g = localStorageObj.get("lastyearSavedTime"),
        h = this.jObj.find(".last-year-today .wb-lyt-summary").eq(0);
        a.info.todayOfLastYear != undefined && a.info.todayOfLastYear != null && (d = util.getByteLength(a.info.todayOfLastYear.content), d > 74 && (a.info.todayOfLastYear.content = util.getByteStr(a.info.todayOfLastYear.content, 70) + "…")),
        h.html(""),
        a.info.todayOfLastYear != undefined && a.info.todayOfLastYear != null ? (localStorageObj.set("lastyearSavedTime", new Date * 1), e.push(g_usrName), e.push(a.info.todayOfLastYear), c = (new EJS({
            text: this.lastyearTpl,
            type: "["
        })).render({
            data: e
        }), h.append(c).parent().css("display", "block")) : (h.parent().css("display", "none"), b.lastYearOff = !0)
    },
    refreshReaction: function(a, b) {
        var c = this;
        c.displayNewMission(a),
        c.showLastYear(a);
        var d = a.jsonDump;
        MessagePage.prototype.refreshReaction.call(this, a, b),
        d.mst == 0 && !b && NotifiStatus.clearData("unread");
        if (a.result == 0 && d && !b) {
            if (d.adList && d.adList.topics && d.adList.topics.length > 0 && !b) {
                var e = this.getAd(d.adList.topics),
                f = function() {},
                c = this;
                e && !this.showOly ? (this.jObj.find(".t_ad_text").text(e.text), this.jObj.find(".t_ad_text").attr("data-type", e.type), this.jObj.find(".t_ad_text").attr("data-iskeyword", e.iskeyword), this.jObj.find(".t_ad_text").attr("data-title", e.title), this.jObj.find(".t_ad_text").attr("data-keyword", e.keyword), this.jObj.find(".t_ad_text").attr("data-posid", e.posid), this.jObj.find(".t_ad_text").attr("data-advid", e.advid), this.jObj.find(".t_ad_text").attr("data-link", e.link), this.jObj.find(".t_ad_text").attr("data-id", e.id), this.jObj.find(".t_ad").show(), this.jObj.find(".t_close_ad").attr("data-id", e.id)) : this.jObj.find(".t_ad").hide()
            }
            d.topBanner ? (this.topBanner.find("img").attr({
                src: d.topBanner.image
            }), this.topBanner.find("a.t_banner_text").attr({
                href: d.topBanner.link,
                advid: d.topBanner.advId
            }), this.topBanner.show()) : this.topBanner.hide()
        }
        this.selector.getComputedStyle("display") == "block" && this.toggleTypeSelector(),
        touch_console_log && console.log((new Date).getTime() - window.startTime + " afterrefresh " + this.id)
    },
    tabSwitch: function(a, b) {
        this.selector.css("display") == "block" && this.selector.slideUp();
        var c = this.jObj.find("ul.t_tab-container a.t_uncascade"),
        d = $(b.target),
        e = $(b.target);
        e.parents(".timeline-type-tips").length || c[0] == b.target ? (d.attr("listid") != "undefined" ? (c.attr("listid", d.attr("listid")), this.updateArgument.listid = d.attr("listid"), this.tabrefresh = !0) : (c.attr("listid", ""), delete this.updateArgument.listid, this.tabrefresh = !1), c.attr("mst", d.attr("mst")), c.text(d.text())) : this.tabrefresh = !1,
        MessagePage.prototype.tabSwitch.call(this, a)
    },
    toggleTypeSelector: function() {
        var a = this,
        b = $("#t_timeline_type_selector > div"),
        c,
        d;
        console.log(this.selector.getComputedStyle("display")),
        console.log(this.selector.getComputedStyle("opacity"));
        if (this.selector.getComputedStyle("display") == "block") this.selector.slideUp();
        else {
            this.selector.css({
                opacity: 1,
                display: "none"
            }),
            c = this.selector.height(),
            d = this.selector.width();
            var e = this.selectorBtn.get(0).getBoundingClientRect().left - this.selectorBtn.parent("li.timeline-nav-item").get(0).getBoundingClientRect().left;
            e = e - d / 2 + this.selectorBtn.width() / 2,
            e = e - 4,
            this.selector.css("left", e + "px"),
            this.selector.attr("computed") !== "true" && (b.css("height", c + "px"), this.selector.attr("computed", !0)),
            this.selector.slideDown(),
            setTimeout(function() {
                a.listScroller.refresh()
            },
            500)
        }
        a.contentListening || (this.jObj.find("div[content]").get(0).addEventListener("click",
        function(b) {
            a.selector.css("display") == "block" && a.selector.slideUp()
        },
        !0), a.contentListening = !0)
    }
}),
ComposePage = generatePage("compose", Page),
$.extend(ComposePage.prototype, {
    jObjDom: '<div id="d_compose" class="lay-main t_page"> <div class="timeline"> <nav class="toolbar"> <a class="back-btn t_btn-back" onclick="">返回</a><a  class="toolbar-title">发微博</a> <a  class="send-btn t_compose_send">发送</a></nav><div class="editfield-inner"> <div class="wb-input-area"> <div class="wb-textarea"> <textarea id="writeT" style="height:100px;"></textarea> <div class="wb-input-tips"> <div id="img-display" class="t_img-display" style="display:none"><a class="ico-img "><img class="t_ico-img" src="http://t1.qlogo.cn/mbloghead/default/100" height="18" width="18"></a></div><div id="geo-info-area"></div></div> </div> </div> <div class="wb-input-bar" id="trigerList"> <a class="ico-bq t_triface"></a><a class="ico-at t_triat"></a><a class="ico-ht t_tritopic"></a><a class="ico-pic t_triimg"></a><a class="ico-wz t_tripos"></a> <span class="wb-num-total wb-num-mis t_numtip">140</span> </div> <div id="displayList" style="min-height:350px"><div class="wb-input-cont wb-faces t_wrapper_input-cont" selected="false"><div style="height:560px;overflow:hidden"> <div class="wb-input-faces" style="height:560px"></div> </div></div> <div class="wb-input-cont t_wrapper_input-cont" selected="false"> <form action="" class="wb-at"><button type="reset" class="wb-qx-btn t_cancel_input">取消</button><input id="nameInput" type="text" class="wb-text-input t_search_input" autocomplete="off"> <button class="wb-at-submit t_sure_input"></button></form> <div class="wb-at-list t_scroll_wrapper"><div></div></div> </div> <div class="wb-input-cont t_wrapper_input-cont"  selected="false"> <form action="" class="wb-at"> <button type="reset" class="wb-qx-btn t_cancel_input">取消</button> <input type="text" class="wb-text-input" id="topicInput"><button class="wb-at-submit t_sure_input"></button> </form> <div class="wb-at-list t_scroll_wrapper"><div></div></div></div><div class="t_wrapper_input-cont"  selected="false"><div class="wb-upload-pic t_wb-upload-pic"> <form action="' + tupdomain + "/fileupload/upload/message/h5?backUrl=" + location.protocol + "//" + location.host + location.pathname + '" enctype="multipart/form-data" name="image_form" method="post">' + '<div class="fileinputs t_fileinputs">' + '<input id="image_form_file" type="file" name="image_file" class="file hidden">' + '<input type= "submit" value= "submit" style="display:none" /> ' + "</div> " + "</form>" + '<a  class="btn choose-img-btn t_choose-img-btn">选择图片</a>' + '<a class="btn cancel-btn t_cancel-btn" style="display:none">取消</a>' + '<a class="btn upload-btn t_upload-btn" style="display:none">上传</a> ' + "</div>" + '<div class="wb-upload" id="wb-upload-error" style="display:none">' + '<div class="wb-upload-error" id="wb-upload-error-text"> 上传失败，图片超过2M大小\t</div>' + "</div> " + '<div class="wb-upload" id="wb-upload-tips"> ' + '<p class="wb-upload-des" > Tips：<br>建议选择200K以内图片，最大不超过2M。支持gif、jpg、jpeg、png格式。 </p>' + "</div>" + "</div>" + "</div>",
    init: function() {
        Page.prototype.init.call(this),
        this.updateArgument.ac = g_ac.AC_MSG_POST,
        this.updateArgument.dumpJSON = 1,
        this.oTextArea = this.jObj.find("textarea"),
        this.activeTabName = MoveableNav.navTabs.NONE
    },
    tabOne: function(a, b) {
        var c = $("#trigerList a"),
        d = this.jObj.find(".t_wrapper_input-cont");
        c.removeClass("current"),
        d.attr("selected", "false"),
        d.hide(),
        this.oTextArea[0].blur(),
        this.lastIndex !== a ? (c.eq(a).addClass("current"), d.eq(a).attr("selected", "true"), d.eq(a).show(), this.lastIndex = a) : this.lastIndex = undefined,
        a == 3 && (this.jObj.find("#image_form_file").addClass("hidden"), this.jObj.find("a.t_choose-img-btn").show(), this.jObj.find("a.t_cancel-btn").hide(), this.jObj.find("a.t_upload-btn").hide())
    },
    bindAction: function() {
        var a = this,
        b = $("#trigerList a"),
        c = a.jObj.find(".t_wrapper_input-cont"),
        d = this.oTextArea[0],
        e = $("#nameInput")[0],
        f = $("#topicInput")[0],
        g = c[0],
        h = c[1],
        i = c[2],
        j = $("#geo-info-area")[0],
        k = this.jObj.find("span.t_numtip")[0],
        l = this.jObj.find(".t_wb-upload-pic form")[0],
        m = new WritePlus.Face({
            elemTextArea: d,
            elemWrapper: g,
            onInputEnd: function() {
                window.scrollTo(0, 0),
                d.focus()
            }
        });
        this.id == "compose" && this.oTextArea.bind("focus",
        function() {
            MoveableNav.scrollToTop()
        }),
        $("#trigerList a.t_triface").tap(function(b) {
            setTimeout(function() {
                m.scroller.refresh()
            },
            0),
            a.tabOne(0, b)
        });
        var n = new WritePlus.UserList({
            type: "at",
            elInput: d,
            elSearch: e,
            elWrapper: h,
            onCancel: function(b) {
                a.tabOne(1, b),
                d.focus()
            },
            onInputEnd: function() {
                window.scrollTo(0, 0),
                d.focus()
            }
        });
        $("#trigerList a.t_triat").tap(function(b) {
            a.tabOne(1, b),
            n.scroller.refresh()
        });
        var o = new WritePlus.Topic({
            elemTextArea: d,
            elemInput: f,
            elemWrapper: i,
            cancelCallBack: function() {
                a.tabOne(2, event),
                d.focus()
            },
            onInputEnd: function() {
                window.scrollTo(0, 0),
                d.focus()
            }
        });
        $("#trigerList a.t_tritopic").tap(function(b) {
            a.tabOne(2, b),
            o.scroller.refresh()
        }),
        this.at = n,
        this.count = new WritePlus.Count(d, k),
        this.objLBS = new WritePlus.LBS(b[4], d, j),
        $("#trigerList a.t_triimg").click(function(b) {
            var c = 0;
            if (navigator.userAgent.indexOf("OS") > -1) {
                var d = navigator.userAgent;
                c = d.charAt(d.indexOf("OS") + 3),
                c >= 6 && (a.jObj.find('.wb-upload-pic form[name="image_form"]').css("width", "272px"), 
                a.jObj.find("#image_form_file").css("width", "272px"), 
                a.jObj.find("a.t_choose-img-btn").css("width", "272px"))
            }
            g_canUpload ? (a.jObj.find("#wb-upload-tips").show(), a.jObj.find("#wb-upload-error").hide(), a.tabOne(3, b)) : alert("抱歉！您的手机浏览器暂不支持网页上传图片功能。")
        }),
        this.jObj.find("a.t_cancel-btn").click(function(b) {
            localStorageObj.remove("temp_upload_message"),
            a.tabOne(3, b)
        }),
        this.jObj.find("a.t_upload-btn").click(function(a) {
            var b = $(d),
            c = b.val(),
            e = b.attr("latitude"),
            f = b.attr("longitude"),
            g = b.attr("geoaddr");
            localStorageObj.set("temp_update_position", $(document).scrollTop()),
            localStorageObj.set("uploadBackHash", NavControl.prevHash ? NavControl.prevHash: "#myhome"),
            (c || e || f || g) && localStorageObj.set("temp_upload_message", [c, e, f, g].join("|"));
            var h = new Date;
            l.action = l.action + "&sid=" + g_sid + "&tmstp=" + h.getTime(),
            LoadingController.saveLoading(),
            l.submit()
        }),
        g_isqqbrowser ? (a.jObj.find('.wb-upload-pic form[name="image_form"]').css("width", "272px"), a.jObj.find('.wb-upload-pic form[name="image_form"]').css("display", "none"), a.jObj.find("a.t_choose-img-btn").css("width", "272px"), a.jObj.find("a.t_choose-img-btn").click(function(a) {
            var b = new Date;
            l.action.indexOf("wbupload") < 0 && (l.action = l.action.replace("http", "http://wbupload") + "&qqb=1&sid=" + g_sid + "&tmstp=" + b.getTime() + "&cookiejs=composePageCookiejs&successjs=composePageSuccessjs&positionjs=func3"),
            l.submit()
        })) : this.jObj.find("#image_form_file").change(function() {
            var b = a.jObj.find("#image_form_file").val();
            b != null && b != "" && (a.jObj.find("#image_form_file").removeClass("hidden"), a.jObj.find("a.t_choose-img-btn").hide(), a.jObj.find("a.t_cancel-btn").show(), a.jObj.find("a.t_upload-btn").show())
        }),
        this.jObj.find("a.t_send").click(function(b) {
            localStorageObj.remove("temp_upload_message"),
            a.submit()
        }),
        this.jObj.find(".t_compose_send").click(function(b) {
            a.submit()
        }),
        Page.prototype.bindAction.call(a)
    },
    enter: function(a) {
        var b = this.jObj.find("img.t_ico-img"),
        c = this.oTextArea[0],
        d = this.jObj.find(".t_ct"),
        e = $("#geo-info-area"),
        f = localStorageObj.get("temp_upload_message");
        this.afterPicUpload(g_uploadStatus, g_msgImage),
        a && a.urlParams.tu && (c.value = "@" + a.urlParams.tu + " "),
        a && a.urlParams.topic && (c.value = "#" + a.urlParams.topic + "# "),
        f && (f = f.split("|"), f[0] && $(c).val(f[0]), f[1] && $(c).attr("latitude", f[1]), f[2] && $(c).attr("longitude", f[2]), f[3] && $(c).attr("geoaddr", f[3]), f[3] && (d.text(f[3]), e.show()), localStorageObj.remove("temp_upload_message")),
        b.attr("init") == "true" ? b.attr("init", !1) : (this.jObj.find("div.t_img-display").hide(), b.attr("src", ""), window.g_msgImage = undefined),
        MoveableNav.hide(),
        $("footer").hide(),
        this.at.refreshData(),
        Page.prototype.enter.call(this, a),
        MoveableNav.scrollToTop(),
        c.focus()
    },
    afterPicUpload: function(a, b) {
        a == "SUCC" && b != null && b != "" ? (this.jObj.find("div.t_img-display").show(), this.jObj.find("img.t_ico-img")[0].src = b + "/60", this.jObj.find("img.t_ico-img").attr("init", !0), this.jObj.find("div.t_img-display")[0].addEventListener("click",
        function(a) {
            picMorePopLayer.init(),
            picMorePopLayer.show()
        }), Tips.blink("success", "图片已上传")) : a != "NO_UPLOAD" && a != "SUCC" && (this.tabOne(3), this.jObj.find("#wb-upload-tips").hide(), a == "FAIL" ? Tips.blink("fail", "网络繁忙，请稍后再试") : a == "INVALID_FORMAT" ? Tips.blink("fail", "上传失败，图片不是gif/jpg/jpeg/png格式") : a == "TOO_SMALL" ? Tips.blink("fail", "上传大小过小") : a == "TOO_LARGE" && Tips.blink("fail", "上传失败，图片超过2M大小!"))
    },
    clean: function() {
        var a = this.jObj;
        a.find("section > span.msg").text(this.defaultcfg.info),
        a.find("section").hide(),
        a.find("p[type]").hide(),
        a.find(".t_numtip").text("140字")
    },
    cookiejs: function() {
        return "cookie"
    },
    successjs: function(a) {
        var b = a;
        b.status == "SUCC" && b.image != null && b.image != "" && (window.g_msgImage = b.image),
        this.afterPicUpload(b.status, b.image),
        this.jObj.find("img.t_ico-img").attr("init", !1);
        var c = this.oTextArea[0];
        c.focus()
    },
    leave: function() {
        delete this.updateArgument.latitude,
        delete this.updateArgument.longitude,
        delete this.updateArgument.geoAddr;
        var a = this.jObj;
        g_uploadStatus = "NO_UPLOAD",
        this.lastIndex !== undefined && this.tabOne(this.lastIndex),
        a.find("input.t_input-search").val(""),
        a.find("textarea").val(""),
        a.find("section > span.msg").text(""),
        localStorageObj.set("uploadBackHash", ""),
        MoveableNav.show(),
        $("footer").show()
    },
    refresh: function() {
        return ! 1
    },
    submit: function() {
        var a = this.oTextArea.val(),
        b = this.count.getNum();
        if (!a) Tips.blink("fail", "请输入内容");
        else {
            if (b < 0) {
                Tips.blink("fail", "字数超过140字限制");
                return
            }
            var c = this.oTextArea.attr("latitude") ? this.oTextArea.attr("latitude") : null,
            d = this.oTextArea.attr("longitude") ? this.oTextArea.attr("longitude") : null,
            e = this.oTextArea.attr("geoAddr") ? this.oTextArea.attr("geoAddr") : null;
            c && d && (this.updateArgument.latitude = c, this.updateArgument.longitude = d, this.updateArgument.geoAddr = e),
            this.updateArgument.imgUrl = "",
            g_msgImage && (this.updateArgument.imgUrl = g_msgImage, window.g_msgImage = undefined),
            this.updateArgument.msg = a,
            LoadingController.pubLoading(),
            NetWork.sendMsg(this, this.updateArgument)
        }
    },
    sendReaction: function(a) {
        var b = this;
        LoadingController.unloading();
        if (a.result == 0) {
            Tips.blink("success", "已发布");
            var c = $("#d_myhome ul[mst='" + g_mst.HOME_MSG + "']");
            c.length > 0 && Page.prototype.insertNewMessage.call(this, $("#d_myhome"), a),
            this.oTextArea.val(""),
            $("#img-display").css("display", "none"),
            b.objLBS.clear(),
            b.backAction(),
            localStorageObj.set("uploadBackHash", "")
        } else a ? Tips.blink("fail", "发布失败") : Tips.blink("offline")
    },
    backAction: function() {
        var a = this,
        b = localStorageObj.get("uploadBackHash"),
        c = a.oTextArea.val().length,
        d = a.oTextArea.attr("geoAddr"),
        e = $("#img-display").css("display") != "none",
        f = function() {
            b ? location.href = b: NavControl.back()
        };
        c || d || e ? confirm("确定离开此页面？") && (a.oTextArea.val("").attr("latitude", null).attr("longitude", null).attr("geoAddr", null), a.objLBS.clear(), f()) : f()
    }
})