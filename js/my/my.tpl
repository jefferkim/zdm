
    <div id="J-content" class="content">
       <ul id="J-list" class="list">

                 <% _.each(list, function(item) { %>
                 <li class="list-item">
                  <div class="hd <%if(item.allowRefresh){%>allow-refresh<%}%>"><h3><a href="<%= item.link%>"><%= item.title%></a></h3>
                       <%if(item.allowRefresh){%><a href="#" class="J-refresh"><s>刷新</s></a><%}%></div>
                   <div class="bd">
                       <div class="pic">
                           <a href="<%= item.link%>"><img src="<%= item.pic%>"/></a>
                           <%if(item.startTime){%><span class="start-time"><s></s><%= item.startTime%>开抢</span><%}%>
                       </div>
                       <div class="J-priceBar price-section">
                           <span class="origin-price">&yen;<%= item.maxPrice%></span>
                           <span class="lowest-price">&yen;<%= item.minPrice%></span>
                           <div class="price-bar"><span class="current-pos" style="top:<%= item.region%>px"><s></s></span></div>
                           <div class="dynamic" style="top:<%= item.region%>px">
                               <b class="current-price">&yen;<%= item.currentPrice %></b>
                               <%if(item.numOfJoiners){%><em><%= item.numOfJoiners%>人斗价</em><%}%>
                           </div>
                       </div>
                   </div>
                   <div class="ft">
                       <div class="desc"><%= item.desc%></div>
                       <div class="handler">
                           <%if(item.btnClass[1]){%>
                           <a href="<%= item.detailUrl%>" class="btn <%= item.btnClass[0]%>"><%= item.btnTxt%></a>
                           <%}else{%>
                             <span class="btn <%= item.btnClass[0]%>"><%= item.btnTxt%></span>
                           <%}%>
                       </div>
                   </div>
                  </li>

                  <% })%>

       </ul>
       <div id="J-pageNav" class="c-pnav-con"></div>
    </div>
