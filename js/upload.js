$("#J-uploadNow").on("click", function () {
    var commentPoster = $.trim($("#J_CommentPoster").val());
    if (commentPoster.replace("/[^/x00-/xff]/g", "**").length > 140) {
        notification.flash("评论不得超出140个字").show();
        return;
    }
    var data = {"pics":$("#J-fileIds").val(),
        "ratedUid":$("#J-ratedUid").val(),
        "parentTradeId":$("#J-parentTradeId").val(),
        "tradeId":$("#J-tradeId").val(),
        "aucNumId":$("#J-aucNumId").val(), //商品id
        "feedback":_.escape(commentPoster)
    };


    app.mtopH5Api.getApi('mtop.gene.feedCenter.createItemFeed', '1.0', data, {}, function (result) {
        if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
            console.log(result);
            //  window.location.href = window.location.href.toString().replace("uploader.html","index.html#my/p1");
        }
    });
});

$("#J_CommentPoster").keyup(function () {
    var val = $.trim($(this).val()),
        valCount = val.replace("/[^/x00-/xff]/g", "**").length;
    $("#J-num").text(valCount);
    if (valCount >= 140) {
        $(this).val(val.substr(0, 140));
    }
});