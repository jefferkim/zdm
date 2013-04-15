/**
* @Module : URI_MODULE
* @Desc	  : generate url in html(for <a/>), contains two parts:
*			 - common uri, used for generate normal url, just like login, logout ,register eg.
*			 - tool uri, used for generate url with parameters, can be used for generating any url. 
* 
*		  - configure exp.uri{} , set sysType (m or wapa or wpatest) from SYS_MODULE_CONFIG.sysType, 
			  it will be used for generate url sub domain.
*			  like : m.taobao.com or wapa.taobao.com or waptest.taobao.com
*		  - encode : if your value need be encoded , use encode(value) method.
* @author : yanyuan
* @date	  : 2012-03-16
*/


function h5Uri(){


		
		var config = Config();
		var tbh5   = h5_base();
		var exports = {};
	
		// configure options for M\WAPA\WAPTEST
		exports.uri = {
			protocol		: 'http://',
			sysType			: config.sysType || 'm',
			defaultDomain	: 'taobao'
		};
		
		var _domainWhiteList = ['taobao', 'tmall', 'etao', 'alibaba', 'alipay'];
		var _Domainholder = '${_serverDomain}';
		var _appendParams =['ttid','sprefer']; //续传参数key
		// waptest/wapa/m/wap.${_serverDomain}.com
		exports._serverHost	 = exports.uri.sysType + '.' + _Domainholder + '.com';
		
		// sub uri , can be extended
		exports.subUri = {
			index : exports.uri.protocol + exports._serverHost,
			// you can add ur uri here
		};
		
		// sid & tt & default url query str
		exports.ttQueryStr = "";
		
		// load 
		try {
		//	var defaultParams = JSON.parse(tbh5.get(tbh5.userInfoKey) || '{}') || {};
		//	var sid = defaultParams.sid;
		//	if (null != sid && '' != sid)
		//	{
		//		exports.ttQueryStr += ('sid=' + sid);
		//	}
		
		    //兼容老的代码保留
			var paramKeyValues = JSON.parse(tbh5.get(tbh5.paramKey) || '{}') || {};
			if (paramKeyValues.ttid && '' != paramKeyValues.ttid)
			{
				exports.ttQueryStr += ("&ttid=" + paramKeyValues.ttid);
			}
			//add ttid、sprefer
			for(i in _appendParams)
			{
			    var key = _appendParams[i];
			    var value =  tbh5.getQueryString(key);
			    if(value && value !='')
			    {
			     exports.ttQueryStr += ("&"+key+"=" + value);   
			    }
			}

	//		console.log(exports.ttQueryStr);
		} catch (e) {
			// do nothing
		}

		// ~~~ exportsort function begin ~~~
		
		/**
		* render tool: sub uri
		* @uri		[must]exports.subUri, you can add new configuration or extends this module to define new subUri
		* @target	[optional]pageName, just like 'index.htm'
		* @param	[optional]json value, url param, just like {param1:'value1', param2:'value2'}
		* @path		[optional]url path, no need the first and the last '/', just like 'subPath1/subPath2/subPath3' 
		* @domain	[optional]domainName, just like 'tmall', default is ${exports.uri.defaultDomain}
		*
		* you can use like :
			- URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm', {'shopId':1688},'shop','tmall');
			- URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm', {'shopId':1688},'shop');
			- URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm', {'shopId':1688});
			- URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm');
			- URI_MODULE.renderURI(URI_MODULE.subUri.shopHost);
		*
		* error : URI_MODULE.renderURI();
		*/
		exports.renderURI = function (uri, target, param, path, domain) {
			return _render(buildUrl(_getServerHost(uri, domain), target, param, path));
		}
		
		/**
		* render tool: domain
		* @target	[optional]pageName, just like 'index.htm'
		* @param	[optional]json value, url param, just like {param1:'value1', param2:'value2'}
		* @path		[optional]url path, no need the first and the last '/', just like 'subPath1/subPath2/subPath3' 
		* @domain	[optional]domainName, just like 'tmall', default is ${exports.uri.defaultDomain}
		*
		* you can use like :
			- URI_MODULE.renderDomain('a.htm',{'a':3},'subPath','etao');
			- URI_MODULE.renderDomain('a.htm',{'a':3},'subPath');
			- URI_MODULE.renderDomain('a.htm',{'a':3});
			- URI_MODULE.renderDomain('a.htm'));
			- URI_MODULE.renderDomain();
		*/
		exports.renderDomain = function(target, param, path, domain) {
			return _render(buildUrl(_getServerHost(exports.subUri.index, domain), target, param, path));
		}
		
		/**
		* render tool: server
		* @target	[optional]pageName, just like 'index.htm'
		* @param	[optional]json value, url param, just like {param1:'value1', param2:'value2'}
		* @path		[optional]url path, no need the first and the last '/', just like 'subPath1/subPath2/subPath3' 
		* @server	[must]base url, like 'http://www.taobao.com/juhuasuan'
		* 
		* you can use like :
			- URI_MODULE.renderServer('detail.htm',{'id':3},'s1/s2','http://m.etao.com');
			- URI_MODULE.renderServer('detail.htm',{'id':3},'','http://m.etao.com/s1/s2');
			- URI_MODULE.renderServer('detail.htm',{},'','http://m.etao.com');
			- URI_MODULE.renderServer('',{},'','http://m.etao.com');
		*
		* error : URI_MODULE.renderServer('detail.htm',{'id':3},'s1/s2');
		*/
		exports.renderServer = function(target, param, path, server) {
			return _render(buildUrl(server, target, param, path));
		}
		
		// encode
		exports.encode = function(v) { return encodeURI(v); }
		
		// getStrParamFromJson
		exports.getStrParamFromJson = function (j) { return _getJsonStr(j); }
		
		// createURI for extends
		exports.createURI = function(name) {
			if (name === 'home') {
				return exports.uri.protocol + exports._serverHost;
			}else{
				return exports.uri.protocol + name + '.' + exports._serverHost;
			}
		}

		// ~~~ exportsort function end ~~~ //

		// --- private _method begin ---

		// add default queryString to url
		function _render (url) {
			if (null != exports.ttQueryStr && '' != exports.ttQueryStr)
			{
				var m = url.match("\\.[a-zA-Z]+\\?");
				if (null != m && 0 < m.length)
				{
					if (url.indexOf('?') == (url.length-1))
					{	
						url = url + exports.ttQueryStr;
					} else {
						url = url + '&' + exports.ttQueryStr;
					}
				} else {
					url = url + '?' + exports.ttQueryStr;
				}

				//console.log("render:",url);
			}

			return url;
		}

		// build url
		function buildUrl (base, target, param, folder) {
			if (!_checkIsBlank(folder)) {
				base += ('/' + folder);
			}
			
			if (!_checkIsBlank(target))
			{
				base += ('/' + target);
			}
			
			var havParam = false;
			if (null != param)
			{
				for (var k in param)
				{
					if (null != param[k])
					{
						havParam = true;
						break;
					}
				}
			}

			if (havParam)
			{
				base += ('?' + _getJsonStr(param));
			}
			return base;
		}

		// check domain is ok or not
		function _checkDomain (domain) {
			if (_checkIsBlank(domain))
			{
				return false;
			}

			for (var i=0;i<_domainWhiteList.length;i++)
			{
				if (_domainWhiteList[i].toLowerCase() == domain.toLowerCase())
				{
					return true;
				}
			}

			return false;
		}

		function _checkIsBlank(s) {
			return tbh5.checkIsBlank(s);
		}

		// get server host, replace ${PlaceHolder} with domain
		function _getServerHost(host, domain) {
			return host.replace(_Domainholder, function(){
				if (!_checkDomain(domain))
				{
					return exports.uri.defaultDomain;
				} else {
					return domain;
				}
			});
		}
		
		// change json object to json string
		function _getJsonStr (j) {
			var s = '';
			if (null == j)
			{
				return s;
			}

			for (var k in j)
			{
				if (null !=j[k] && ''!= j[k])
				{
					s += (k + '=' + encodeURIComponent(j[k]) + '&');
				}
			}
			
			if (''!=s && (s.length-1) == s.lastIndexOf('&'))
			{
				s = s.substr(0, s.length-1);
			}

			return s;
		}
		
		// --- private method end --- //

        return exports;

}
