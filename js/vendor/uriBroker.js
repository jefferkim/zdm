function uriBroker(){

	var uri =  h5Uri();
	var tbh5 = h5_base();

	var uriBroker1 = {};

	uriBroker1.URL_CONSTANTS = URL_CONSTANTS = {
		//可以继续定义一些通用的规则...
		path: {
			home: 'index.htm',
			home_wuliu: 'trade/bought_item_lists.htm',
			home_kehu: 'channel/act/other/kehufuwu.xhtml',
			home_anquan: 'channel/act/other/jiaoyianquan.xhtml',
			home_tiantiantejia: 'channel/act/sale/tiantiantejia.html',
			home_taojinbi: 'channel/act/taojinbi.html',
			home_help: 'channel/act/other/help.xhtml',
			home_msg: 'index_header_ajax.htm',
			my: 'myTaobao.htm',
			my_deliver: 'deliver/wap_deliver_address_list.htm',
			my_alipay: 'myAlipay.htm',
			my_bindalipay : 'alipay_modify.htm',
			my_viewitems:'view_items.htm',
			a: 'iITEM_ID.htm',
			a_td:'tdORDER_ID.htm',
			s: 'search.htm',
			s_history: 'history.htm',
			im: 'ww/ad_ww_lately_contacts.htm',
			im_icon:'ww/status.do',
			shop: 'shop/shop_index.htm',
			shop_search: 'shop/shop_auction_search.htm',
			login: 'login.htm',
			login_out: 'logout.htm',
			u_reg: 'reg/newUser.htm',
			fav: 'h5proxy-mid_fav.htm',
			auction1_cart: 'cart/my_cart.htm',

			info_jianyi: 'help/report.htm',
			h5_ww :'ww/index.htm',
			h5_myhome :'my/index.htm',
            h5_allspark :'we/index.htm',
            h5_mycart :'cart/index.htm',
			d:'my_bag.htm',
			triph5_order : 'myorder.html',
			caipiao_order : 'lottery/wap/user/my_lottery.htm',
			tm_pay:'order/baobeiPay.htm',
			auction1_refund:'refund/fill_refund.htm',
			tm_cancelOrder:'order/order_cancel.htm'
		},
		dps: {},
		app_param_key: tbh5.paramKey
	}

	/**
	 * module：对应于 URL_CONSTANTS 中的key，如果一个模块下面有多个功能名，那么module为模块名 + 功能名。
	 *   模块名的取名规则很简单
	 *     如 http://shop.m.taobao.com/shop/shop_index.htm?shop_id=****
	 *    那么模块名就位 shop , 对应与域名 shop.m.taobao.com.
	 *
	 *     如果店铺下面有2个功能模块，比如： http://shop.m.taobao.com/shop/shop_auction_search.htm
	 *    host依然为shop，但是为了区分各自不同的path，对应于URL_CONSTANTS.path , 我们可以把module定义为 shop_search
	 *
	 * param对应于对象，用于各个业务链接的参数
	 *    如：详情的 : {itemId:123456}
	 *        店铺的 : {shopId:123456}
     *
	 *       指向tmall域名的 {domain:'tmall'}
	 *       api 参数的 ：{
	 'method'		: 'queryColPromoGood',
	 'currentPage'	: currentPage,
	 'pageSize'		: pageSize,
	 'startRow'		: startRow
	 }
	 *
	 */
	uriBroker1.getUrl = function(module, param) {
		module = module.toLowerCase();
		param = param || {};
		var domain = param.domain;
		if (domain) {
			delete param.domain;
		} else {
			domain = "taobao";
		}

		var _modules = module.split("_");
		var host = uri.createURI(_modules[0]);
		if (!host) {
			throw "module param is not current,can't match any host";
		};

		var path = '';
		var dps = _getDps(module, param);
		switch (_modules[0]) {
		case "api":
			var _param = {};
			_param.data = JSON.stringify(param);
			//TODO  可以在此细分api的名字
			_.extend(_param, this.defaultMtopParam);
			param = _param;
			path = _getPath(module);
			break;
		default:
			//TODO multi path
			path = _getPath(module);
			path = _rebuildPath(path, param);
		}
		dps && (param['pds'] = dps);
		//encode url参数
		// for(key in param){
		// param[key] = encodeURIComponent(param[key]);
		// }
		return uri.renderURI(host, '', param, path, domain);

	}

	function _getPath(module) {
		if (URL_CONSTANTS.path[module]) {
			return URL_CONSTANTS.path[module];
		}
		var lastIndex_ = module.lastIndexOf('_');
		if (lastIndex_ < 0) {
			return "";
		};
		return _getPath(module.substring(0, lastIndex_));
	}

	//do special path


	function _rebuildPath(path, params) {
		//detail相关
		if (path == URL_CONSTANTS.path['a']) {
			path = path.replace("ITEM_ID", function() {
				var itemId = params.itemId;
				delete params.itemId;
				return itemId;
			});
		};
		if (path == URL_CONSTANTS.path['a_td']) {
			path = path.replace("ORDER_ID", function() {				
				var tradeId = params.tradeId;			
				delete params.tradeId;
				return tradeId;
			});
		};
		return (path || '');
	}

	uriBroker1.getDps = _getDps = function(module, param) {
		if (param['dps']) {
			return param['dps'];
		}

		var dps_key = module;
		var method = param.method;

		if (method) {
			dps_key += ("_" + method.toLowerCase());
		}
		//3级
		if (param._3th) {
			dps_key += "_3th";
			delete param._3th;
		}
		if (param.trigerType) {
			dps_key += ("_" + param.trigerType);
			delete param.trigerType;
		};

		return _getDpsParam(dps_key);
	}

	function _getDpsParam(module) {
		var dps = URL_CONSTANTS.dps[module];
		if (_.isString(dps)) {
			return dps;
		}
		//对象
		if (_.isObject(dps)) {
			var cacheName = dps.cache;
			if (dps.dps) {
				URL_CONSTANTS[cacheName] = dps.dps;
				return dps.dps;
			} else {
				if (cacheName) {
					return URL_CONSTANTS[cacheName];
				};
			}
		}
		if (!module || module.lastIndexOf("_") < 0) {
			return "";
		};
		module = module.substring(0, module.lastIndexOf("_"));
		return _getDpsParam(module);
	}

	return uriBroker1;

   
}
