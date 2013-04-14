(function (app, undef) {


    Object.extend(app.helper,{

        commentCreditToRank:function (credit) {
            var rank = 0;
            if (credit >= 4 && credit <= 10) {
                rank = 1;
            } else if (credit >= 11 && credit <= 40) {
                rank = 2;
            } else if (credit >= 41 && credit <= 90) {
                rank = 3;
            } else if (credit >= 91 && credit <= 150) {
                rank = 4;
            } else if (credit >= 151 && credit <= 250) {
                rank = 5;
            } else if (credit >= 251 && credit <= 500) {
                rank = 6;
            } else if (credit >= 501 && credit <= 1000) {
                rank = 7;
            } else if (credit >= 1001 && credit <= 2000) {
                rank = 8;
            } else if (credit >= 2001 && credit <= 5000) {
                rank = 9;
            } else if (credit >= 5001 && credit <= 10000) {
                rank = 10;
            } else if (credit >= 10001 && credit <= 20000) {
                rank = 11;
            } else if (credit >= 20001 && credit <= 50000) {
                rank = 12;
            } else if (credit >= 50001 && credit <= 100000) {
                rank = 13;
            } else if (credit >= 100001 && credit <= 200000) {
                rank = 14;
            } else if (credit >= 200001 && credit <= 500000) {
                rank = 15;
            } else if (credit >= 500001 && credit <= 1000000) {
                rank = 16;
            } else if (credit >= 1000001 && credit <= 2000000) {
                rank = 17;
            } else if (credit >= 2000001 && credit <= 5000000) {
                rank = 18;
            } else if (credit >= 5000001 && credit <= 10000000) {
                rank = 19;
            } else if (credit >= 10000001) {
                rank = 20;
            }
            return rank;
        },

        rank:function (credit) {
            var rank = this.commentCreditToRank(credit),
                ranks = [ '', '颗心', '颗黄钻', '金冠', '紫冠' ],
                r = Math.ceil(rank / 5),
                n = ( rank - 5 * ( r - 1 ) ) % 6;
            return rank ? ( n + ' ' + ranks[ r ] ) : "";
        }

    })


})(window['app']);