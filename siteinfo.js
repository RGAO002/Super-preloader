var SITEINFO=[
    {name: 'Google搜索',                                                                                                                               //站点名字...(可选)
        url: '^https?://(?:(?:www|encrypted)\\.google(?:stable)?\\..{2,9}|wen\\.lu)/(?:webhp|search|#|$|\\?)',   // 站点正则...(~~必须~~)
        //url:'wildc;http://www.google.com.hk/search*',
        siteExample:'http://www.google.com',                                                                                                //站点实例...(可选)
        enable:true,                                                                                                                                            //启用.(总开关)(可选)
        useiframe:false,                                                                                                                                        //是否用iframe预读...(可选)
        viewcontent:false,
        nextLink: 'id("pnnext") | id("navbar navcnt nav")//td[span]/following-sibling::td[1]/a | id("nn")/parent::a',
                                                                                                                           //查看预读的内容,显示在页面的最下方.(可选)
        // nextLink:'auto;',
        //nextLink:'//table[@id="nav"]/descendant::a[last()][parent::td[@class="b"]]',              //下一页链接 xpath 或者 CSS选择器 或者 函数返回值(此函数必须使用第一个传入的参数作为document对象) (~~必选~~)
        //nextLink:'css;table#nav>tbody>tr>td.b:last-child>a',
        //nextLink:function(D,W){return D.evaluate('//table[@id="nav"]/descendant::a[last()][parent::td[@class="b"]]',D,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;},
        // 新增 Array 的格式，依次查找

        // preLink:'auto;',
        preLink: '//a[@id="pnprev"]',
        //preLink:'//table[@id="nav"]/descendant::a[1][parent::td[@class="b"]]',            //上一页链接 xpath 或者 CSS选择器 或者 函数返回值 (可选)
        autopager:{
            enable:true ,                                                                                               //启用(自动翻页)(可选)
            useiframe:false,                                                                                        //是否使用iframe翻页(可选)
            iloaded:false,                                                                                      //是否在iframe完全load之后操作..否则在DOM完成后操作.
            itimeout:0,                                                                                             //延时多少毫秒后,在操作..
            newIframe: false,  // 下一页使用新的 iframe，能解决按钮无法点击的问题
            pageElement: '//div[@id="ires"]',                                          //主体内容 xpath 或 CSS选择器 或函数返回值(~~必须~~)
            // pageElement:'css;div#ires',
            //pageElement:function(doc,win){return doc.getElementById('ires')},
            //filter:'//li[@class="g"]',                                                                        //(此项功能未完成)xpath 或 CSS选择器从匹配到的节点里面过滤掉符合的节点.
            remain: 1/3,                                                                                                 //剩余页面的高度..是显示高度的 remain 倍开始翻页(可选)
            relatedObj: ['css;div#navcnt','bottom'],                                                         //以这个元素当做最底的元素,计算页面总高度的计算.(可选)
            replaceE: '//div[@id="navcnt"]',                 //需要替换的部分 xpat h或 CSS选择器 一般是页面的本来的翻页导航(可选);
            //replaceE:'css;div#navcnt',
            ipages: [false,2],                               //立即翻页,第一项是控制是否在js加载的时候立即翻第二项(必须小于maxpage)的页数,比如[true,3].就是说JS加载后.立即翻3页.(可选)
            separator: true,                                 //是否显示翻页导航(可选)
            separatorReal: true,
            maxpage: 66,                                     //最多翻页数量(可选)
            manualA: false,                                  //是否使用手动翻页.
            HT_insert: ['//div[@id="res"]',2],               //插入方式此项为一个数组: [节点xpath或CSS选择器,插入方式(1：插入到给定节点之前;2：附加到给定节点的里面;)](可选);
            //HT_insert:['css;div#res',2],
            lazyImgSrc: 'imgsrc',
            // 新增的自定义样式。下面这个是调整 Google 下一页可能出现的图片排列问题。
            stylish: 'hr.rgsep{display:none;}' +
            '.rg_meta{display:none}.bili{display:inline-block;margin:0 6px 6px 0;overflow:hidden;position:relative;vertical-align:top}._HG{margin-bottom:2px;margin-right:2px}',
            documentFilter: function(doc){
                // 修正下一页的图片
                var x = doc.evaluate('//script/text()[contains(self::text(), "data:image/")]', doc, null, 9, null).singleNodeValue;
                if (x) {
                    try {
                        new Function('document, window, google', x.nodeValue)(doc, unsafeWindow, unsafeWindow.google);
                    } catch (e) {}
                }

                // 修正可能出现的 小箭头更多按钮 排版不正确的情况（2014-7-29）
                var oClassName = window.document.querySelector('#ires .ab_button').className;
                [].forEach.call(doc.querySelectorAll('#ires .ab_button'), function(elem){
                    if (elem.className != oClassName)
                        elem.className = oClassName;
                });
            },
            filter: function() {  // 在添加内容到页面后运行

            },
            startFilter: function(win, doc) {  // 只作用一次
                // 移除 Google 重定向
                var script = doc.createElement('script');
                script.type = 'text/javascript';
                script.textContent = '\
                Object.defineProperty(window, "rwt", {\
                    configurable: false,\
                    enumerable: true,\
                    get: function () {\
                        return function() {};\
                    },\
                });\
                ';
                doc.documentElement.appendChild(script);
                doc.documentElement.removeChild(script);

                // 移动相关搜索到第一页
                var brs = doc.getElementById('brs'),
                    ins = doc.getElementById('ires');
                if (brs && ins) {
                    ins.appendChild(brs);
                }
            }
        }
    },
    {name: '百度搜索',
        // 由于 Super_preloader 默认去掉了 # 后面部分
        // url: "^https?://www\\.baidu\\.com/(s|baidu|#wd=)",
        url: "^https?://www\\.baidu\\.com/",
        enable:true,
        nextLink:'//div[@id="page"]/a[contains(text(),"下一页")][@href]',
        preLink:'//div[@id="page"]/a[contains(text(),"上一页")][@href]',
        autopager: {
            pageElement: 'css;div#content_left > *',
            HT_insert:['css;div#content_left',2],
            replaceE: 'css;#page',
            stylish: '.autopagerize_page_info, div.sp-separator {margin-bottom: 10px !important;}',
            startFilter: function(win) {
                // 设置百度搜索类型为 s?wd=
                try {
                    win.document.cookie = "ISSW=1";
                } catch (ex) {}
            }
        }
    },
    {name: '百度搜索 - baidulocal',
        url: '^https?://www\\.baidu\\.com/s.*&tn=baidulocal',
        nextLink: '//a[font[text()="下一页"]]',
        pageElement: '//table[@width="100%" and @border="0"]/tbody/tr/td/ol',
        exampleUrl: 'http://www.baidu.com/s?wd=firefox&rsv_spt=1&issp=1&rsv_bp=0&ie=utf-8&tn=baidulocal&inputT=1364',
    },
    {name: '360搜索',
        url: "http://www\\.so\\.com/s",
        nextLink:'//div[@id="page"]/a[text()="下一页>"] | id("snext")',
        autopager:{
            pageElement:'//div[@id="container"]',
            stylish: '.autopagerize_page_info, div.sp-separator { margin-bottom: 20px !important; }'
        }
    },
    {name: '搜狗搜索',
        url:/^https?:\/\/www\.sogou\.com\/(?:web|sogou)/i,
        siteExample:'http://www.sogou.com',
        enable:true,
        nextLink:'//div[@id="pagebar_container"]/a[@id="sogou_next"]',
        autopager:{
            pageElement:'//div[@class="results"]',
            replaceE: 'id("pagebar_container")'
        }
    },
    {name: 'Bing网页搜索',
        url: '^https?://(?:www|cnweb)\.bing\.com/(?:[^/]+/)*?(?:results\.aspx|search)',
        siteExample:'bing.com/search?q=',
        nextLink:"//a[contains(@class,\"sb_pagN\")]",
        autopager:{
            pageElement: 'id("b_results")/li[@class="b_algo"]',
            replaceE: '//nav[@role="navigation"]',
            HT_insert: ['id("b_results")/li[@class="b_pag"]',1],
            startFilter: function(win, doc) {// 移动相关搜索到第一页
                var brs = doc.evaluate('id("b_results")/li[@class="b_ans"]').iterateNext();
                debug(brs);
                ins = doc.getElementsByClassName('b_algo');
                ins = ins[ins.length-1];
                debug(ins);
                if (brs && ins) {
                    ins.appendChild(brs);
                }
            }
        }
    },
    {name: 'AOL 搜索',
        url: /^https?:\/\/(www\.)?aolsearch.com\/search\?q=/i,
        siteExample: 'https://www.aolsearch.com/search?q=test',
        nextLink: '//div[@class="compPagination"]/a[@class="next"]',
        autopager: {
            pageElement: '//ol[contains(@class,"searchCenterMiddle")]'
        }
    },
    {name: 'Yahoo.com Search',
        url: '^https?://(.+\.)?(news\.)?(search|chiebukuro)?\.yahoo\.co(m|\.jp)/(yhs/)?search',
        nextLink: '//div[contains(@class,"Pagination")]/a[contains(@class,"next")]|//a[contains(span[2],">")]|//li[@class="nex"]/a',
        autopager:{
            pageElement: 'id("web resultsWrapper")/ol|//div[@class="searchCenterMiddle"]/div|id("WS2m NSm")/*|//ol[@class="cl"]/*|//div[contains(concat(" ", normalize-space(@class), " "), " cmm ") and @data-pos]',
            stylish: ' @-moz-document domain("yahoo.com") {     img.s-img {         display: inline-block !important;     };     .layoutleft a{padding:0;} ; }',
        },
        created_by: 'tokumeisan',
        resource_url: 'http://wedata.net/items/62707',
    },
    // ====== 目前 Super_preloaderPlus_one 还有问题的 ========
    {name: '水木社区',
        url: '^http://www\\.newsmth\\.net/nForum',
        nextLink: '//a[@title="下一页"]',
        pageElement: '//div[@class="b-content"] | //div[@class="b-content corner"]',
        exampleUrl: 'http://www.newsmth.net/nForum/#!board/TouHou'
    },

    // =============== baidu 其它 ===========
//     {name: '百度贴吧列表',
//         url: /^https?:\/\/tieba\.baidu\.com\/f/i,
//         nextLink: '//div[@id="frs_list_pager"]/a[last()-1]',
//         preLink: '//a[@class="pre pagination-item "]',
//         autopager: {
//             enable: false,
//             pageElement: '//ul[@id="thread_list"]',
//             replaceE: '//div[@id="frs_list_pager"]',
//             useiframe: true,
//                 // newIframe: true,
//                 iloaded: false,
//             // lazyImgSrc: "bpic",
//         }
//     },
    {name: '百度贴吧帖子',
        url:/^https?:\/\/tieba\.baidu\.com\/p/i,
        siteExample:'https://tieba.baidu.com/p/918674650',
        nextLink:'(//ul[@class="l_posts_num"])[2]/li/a[text()="下一页"]',
        preLink:'(//ul[@class="l_posts_num"])[2]/li/a[text()="上一页"]',
        autopager:{
            enable: true,
            pageElement: "id('j_p_postlist')",  // "css;.l_post"
            replaceE: "css;.l_posts_num > .l_pager",
          //  useiframe: true,
                // newIframe: true,
            //    iloaded: false
            // filter: function(pages){
            //     var pb = unsafeWindow.pb;
            //     pb.ForumListV3.initial();
            // }
        }
    },
    {name: '百度吧内搜索',
        url: /^http:\/\/tieba\.baidu\.com\/f\/search/i,
        siteExample: 'http://tieba.baidu.com/f/search/',
        nextLink: 'auto;',
        pageElement: 'css;.s_post'
    },
    {name: '百度新闻搜索',
        url: '^http://news\\.baidu\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/ns',
        nextLink: 'id("page")/a[text()="下一页>"]',
        pageElement: 'id("content_left")',
    },
    {name: '百度知道',
        url:/^https?:\/\/zhidao\.baidu\.com\/search\?/i,
        siteExample:'http://zhidao.baidu.com/search?pn=0&&rn=10&word=%BD%AD%C4%CFstyle',
        nextLink:'auto;',
        pageElement:'css;#wgt-list',
    },
    {name: '百度空间',
        url: '^http://hi\\.baidu\\.com',
        nextLink: 'id("pagerBar")/div/a[@class="next"]',
        autopager: {
            useiframe: true,
            pageElement: '//div[@class="mod-realcontent mod-cs-contentblock"]',
        },
        exampleUrl: 'http://hi.baidu.com/gelida',
    },
    {name: '百度文库搜索',
        url: /^https?:\/\/wenku\.baidu\.com\/search\?/i,
        exampleUrl: 'http://wenku.baidu.com/search?word=firefox&lm=0&od=0&fr=top_home',
        nextLink: '//div[@class="page-content"]/a[@class="next"]',
        autopager: {
            pageElement: '//div[@class="search-result"]/dl',
        }
    },
    {name: '小众软件',
        url: /^https?:\/\/www.appinn\.com/i,
        exampleUrl: 'https://www.appinn.com/',
        nextLink: '//a[@class="nextpostslink"]',
        prevLink: '//a[@class="previouspostslink"]',
        autopager: {
            pageElement: '//div[@id="spost"]/div',
        }
    },
    {name: '好人卡',
        url: /^https?:\/\/www.haorenka\.net/i,
        exampleUrl: 'https://www.haorenka.net/page/3',
        prevLink: '//a[@class="prev page-numbers"]',
        nextLink: '//a[@class="next page-numbers"]',
        autopager: {
            pageElement: '//div[contains(@class, "block5_widget_content block5_list loop-rows posts-loop-rows")]',
        }
    },
    {name: 'v2ex',
        url: /^https?:\/\/www.v2ex\.com\/(recent|go)/i,
        exampleUrl: 'https://www.v2ex.com/recent?p=3',
        nextLink: '//link[@rel="next"]',
        prevLink: '//link[@rel="prev"]',
        autopager: {
            pageElement: '//div[@class="cell item"]|//div[contains(@class, "cell from")]',
        }
    },
    {name: 'smzdm-search',
        url: /^https?:\/\/search\.smzdm\.com/i,
        exampleUrl: 'http://search.smzdm.com/?c=post&s=%E7%A9%BA%E8%B0%83&v=b',
        nextLink: '//li/a[text()="下一页"]',
        prevLink: '//li/a[text()="上一页"]',
        autopager: {
            pageElement: '//li[@class="feed-row-wide"]',
        }
    },
    {name: 'smzdm-comment',
        url: /^https?:\/\/post\.smzdm\.com\/p\/\d+/i,
        exampleUrl: 'https://post.smzdm.com/p/559992/',
        nextLink: '//ul[@class="pagination"]/li[@class="pagedown"]/a',
        pageElement: '(//ul[@class="comment_listBox"])[1]',
    },
    // ================ news、Reading ===========================
    {name: '新浪新闻',
        url: /^http:\/\/[a-z]+\.sina\.com\.cn\//i,
        exampleUrl: 'http://news.sina.com.cn/c/sd/2013-11-08/165728658916.shtml',
        nextLink: '//p[@class="page"]/a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@id="artibody"]',
            relatedObj: true,
        }
    },
    {name: '搜狐新闻',
        // not work
        url: /^https?:\/\/news\.sohu\.com\/.*\.shtml/i,
        exampleUrl: 'http://news.sohu.com/20120901/n352071543.shtml',
        nextLink: '//a[text()="下一页"]',
        autopager: {
            useiframe: true,
            pageElement: 'id("contentText")',
        }
    },
    {name: '新华网新闻页面',
        url: /https?:\/\/www\.xinhuanet\.com\/(\w+\/)?\d{4}-\d{2}\/\d{2}\/.+\.html?/i,
        siteExample:'http://www.xinhuanet.com/2018-04/07/c_1122646152.htm',
        nextLink: 'auto;',
        autopager:{
            remain:2,
            pageElement:'//div[@id="p-detail"]/p'
        }
    },
    {name: '中国新闻网',
        url:/https?:\/\/www\.chinanews\.com\/[a-z]+\/.+\.shtml/i,
        siteExample:'http://www.chinanews.com/英文/年/日期/编号.shtml',
        nextLink: '//div[@id="function_code_page"]/a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@class="left_zw"] | //div[@class="hd_photo"]',
            relatedObj: true,
            HT_insert:['//div[@id="function_code_page"]',1],
            filter:'//div[@id="function_code_page"]',
        }
    },
    {name: '人民网新闻',
        url: /^https?:\/\/[a-z]+\.people\.com\.cn\/.*\.html/i,
        exampleUrl: 'http://cpc.people.com.cn/xuexi/n/2015/0527/c387492-27065648-25.html',
        nextLink: 'auto;',
        autopager: {
            pageElement: '//div[@class="text_img"] | //div[@id="p_content"]|//dl[@class="clearfix"]',
            relatedObj: true
        }
    },
    {name: '中关村在线新闻页面',
        url:/https?:\/\/(?:[^\.]+\.)?zol\.com\.cn\/\d+\/\d+/i,
        siteExample:'http://lcd.zol.com.cn/187/1875145.html',
        nextLink: '//div[@class="page"]/a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="cotent_idd" or @id="article-content"]',
            relatedObj: true,
            replaceE: 'css;.page'
        }
    },
    {name: 'FT中文网',
        url: /^http:\/\/www\.ftchinese\.com\/story\//i,
        exampleUrl: 'http://www.ftchinese.com/story/001053472',
        nextLink: '//div[@class="pagination"]/a[text()="余下全文"]',
        autopager: {
            pageElement: '//div[@id="bodytext"]',
            relatedObj: true,
            replaceE: '//div[@class="pagination"]'
        }
    },
    {name: 'Solidot: 奇客的资讯，重要的东西',
        url: /^https?:\/\/www\.solidot\.org\//i,
        exampleUrl: 'http://www.solidot.org/?issue=20131205',
        nextLink: 'id("center")/div[@class="page"]/a[last()]',
        autopager: {
            pageElement: 'id("center")/div[@class="block_m"]',
            separatorReal: false
        }
    },
    // Fix till here
    {name: 'IT 之家',
        url: /^http:\/\/\w+\.ithome\.com\//i,
        nextLink: 'id("Pager")/div[@class="pagenew"]/a[text()=">"]',
        autopager: {
            pageElement: 'id("wrapper")/div[@class="content fl"]/div[@class="cate_list" or @class="post_list"]/ul[@class="ulcl"]',
            replaceE: 'id("Pager")/div[@class="pagenew"]'
        }
    },
    {name: '虎嗅网',
        url: "^http://www\\.huxiu\\.com/",
        nextLink: '//span[@class="next"]/a[text()=">"]',
        pageElement: '//div[@class="center-ctr-box"]'
    },
    {name: '36氪',
        url: "^http://www\\.36kr\\.com/.+",
        nextLink: '//a[@rel="next"]',
        pageElement: 'id("mainContainer")/descendant::div[contains(concat(" ", @class, ""),"krContent")]'
    },
    {name: '爱范儿 · Beats of Bits - 发现创新价值的科技媒体',
        url: "^http://www\\.ifanr\\.com/",
        nextLink: '//div[@class="content-nav"]/a[text()="下一页"]',
        pageElement: 'id("content")/div[contains(concat(" ", @class, ""), "main")]'
    },
    {name: '创业帮',
        url: /^http:\/\/www\.cyzone\.cn\//i,
        exampleUrl: 'http://www.cyzone.cn/',
        nextLink: 'id("pages")/*[@class="current"]/following-sibling::a[1]',
        autopager: {
            pageElement: '//div[@class="left"]/div[starts-with(@class, "intere")]/ul[@class="list clearfix"]',
        }
    },
    {name: '萝卜网',
        url: /^http:\/\/luo\.bo\//i,
        exampleUrl: 'http://luo.bo/',
        nextLink: '//div[@class="pagenavi"]/a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@class="homeposts"]/ul[contains(@class, "explist homelist")] | //div[@class="container"]/div[@class="content"]',
            replaceE: '//div[@class="pagenavi"]'
        }
    },
    {name: '爱活网 Evolife.cn_科技进化生活',
        url: /^http:\/\/[a-z]+\.evolife\.cn\//i,
        exampleUrl: 'http://go.evolife.cn/category/focus_121_1.html',
        nextLink: '//div[contains(@class, "pages")]/a[text()="下一页" or contains(text(), ">")]',
        autopager: {
            pageElement: '//div[@class="zuijingengxin"]/div[@class="zuijingengxin_box"] | //div[@class="zuijingengxin"]/div[@class="text"]',
            replaceE: 'css;.pages',
            relatedObj: true,
        }
    },
    {name: '凤凰网 - 凤凰汽车',
        url: /^http:\/\/auto\.ifeng\.com\/.*\.shtml/i,
        exampleUrl: 'http://auto.ifeng.com/youji/20131115/1003513.shtml',
        nextLink: '//div[@class="arl-pages"]/a[@class="next"]',
        autopager: {
            pageElement: '//div[starts-with(@class,"arl-mian")]/div/div[@class="arl-cont"]',
            relatedObj: true,
            replaceE: '//div[@class="arl-pages"]'
        }
    },
    {name: '凤凰网 - 新闻、财经',
        url: /^http:\/\/\w+\.ifeng\.com\//i,
        exampleUrl: 'http://finance.ifeng.com/a/20131115/11089994_1.shtml',
        nextLink: '//a[@id="pagenext"] | //div[@class="next" or @class="fy"]/a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@id="artical_real"] | //div[@class="content"]/div[@class="contentL"] | //div[@class="yib_left"]/div[@class="box_list"]',
            relatedObj: true,
            replaceE: 'id("artical")/div[@class="an"]/div[@class="next"] | //div[@class="yib_left"]/div[@class="fy"]'
        }
    },
    {name: '和讯财经微博',
        url: /^http:\/\/t\.hexun\.com\/.*\.html/i,
        exampleUrl: 'http://t.hexun.com/21210301/default.html',
        nextLink: '//li[contains(@class, "nextbtn2")]/a[text()="下一页 >"]',
        autopager: {
            pageElement: '//div[@id="listWeibo"]',
            replaceE: '//div[@id="page2"]'
        }
    },
    {name: '和讯博客',
        url: /^http:\/\/\w+\.blog\.hexun\.com\//i,
        exampleUrl: 'http://23802543.blog.hexun.com/',
        nextLink: function(doc) {
            var url = doc.querySelector('.PageSkip_1 a[title="下一页"]').getAttribute('href');
            url = url.replace(/(\/p\d+\/).*/, '$1default.html');
            return url;
        },
        autopager: {
            pageElement: 'id("DefaultContainer1_ArticleList_Panel1")'
        }
    },
    {name: '汽车之家',
        url: /^http:\/\/www\.autohome\.com\.cn\/.*\.html/i,
        exampleUrl: 'http://www.autohome.com.cn/culture/201310/643479-7.html',
        nextLink: 'id("articlewrap")/div[@class="page"]/a[@class="page-item-next"]',
        autopager: {
            pageElement: 'id("articleContent")',
            relatedObj: true,
            replaceE: 'id("articlewrap")/div[@class="page"]'
        }
    },
    {name: '汽车之家论坛帖子和列表',
        url:/^http:\/\/club\.autohome\.com\.cn\/bbs/i,
        siteExample:'http://club.autohome.com.cn/bbs/forum-c-2313-1.html',
        nextLink:'auto;',
        autopager:{
            pageElement:'//dl[@class="list_dl "][@lang] | //div[@class="conmain"]',
        }
    },
    {name: '爱卡汽车',
        url: /^http:\/\/yp\.xcar\.com\.cn\/.*\.html/i,
        exampleUrl: 'http://yp.xcar.com.cn/201311/news_1351064_1.html',
        nextLink: '//div[@class="article_page_bottom"]/a[@class="page_down"]',
        autopager: {
            pageElement: 'id("newsbody")',
            relatedObj: true,
            replaceE: '//div[@class="article_page_bottom"]'
        }
    },
    {name: '爱卡汽车论坛帖子',
        url:/^http:\/\/www\.xcar\.com\.cn\/bbs\/viewthread/i,
        siteExample:'http://www.xcar.com.cn/bbs/viewthread.php?tid=12474760',
        nextLink:'//a[text()="下一页＞"][@href]',
        autopager:{
            pageElement:'//form[@id="delpost"] | //div[@class="maintable"][@id="_img"]',
        }
    },
    {name: '新闻 - 加拿大华人网',
        url: /^http:\/\/www\.sinonet\.org\/.*\.html/i,
        exampleUrl: 'http://www.sinonet.org/news/society/2013-11-15/301940.html',
        nextLink: '//p[@class="pageLink"]/a[text()="下一页"]',
        autopager: {
            pageElement: 'id("zoom")',
            relatedObj: true
        }
    },
    {name: '美国中文网',
        url: /^http:\/\/news\.sinovision\.net\/.*\.htm/i,
        exampleUrl: 'http://news.sinovision.net/politics/201401/00279206.htm',
        nextLink: '//div[@class="pg"]/a[@class="nxt"]',
        autopager: {
            pageElement: '//div[@class="d"]/table[@class="vwtb"]',
            replaceE: '//div[@class="pg"]',
            relatedObj: true
        }
    },
    {name: '火星网－中国领先的数字艺术门户',
        url: /^http:\/\/news\.hxsd\.com\/.*\.html/i,
        exampleUrl: 'http://news.hxsd.com/CG-dynamic/201401/684528.html',
        nextLink: 'auto;',
        autopager: {
            pageElement: '//div[@class="news_content_left"]/div[@class="content"]',
        }
    },
    {name: '铁血网',
        url: /^http:\/\/bbs\.tiexue\.net\/post.*\.html/i,
        exampleUrl: 'http://bbs.tiexue.net/post2_7969883_3.html',
        nextLink: '//div[@class="page"]/a[text()="下一页"]',
        autopager: {
            pageElement: 'id("postContent")/div[@class="newconli2"]',
            relatedObj: true
        }
    },
    {name: '看天下',
        url: /^http:\/\/www\.vistastory\.com\/.*\.html/i,
        exampleUrl: 'http://www.vistastory.com/a/201408/5395.html',
        nextLink: '//a[@class="cpnext"]',
        autopager: {
            pageElement: 'css;.arc_body',
        }
    },
    {name: '参政消息',
        url: '^http://china\\.cankaoxiaoxi\\.com/.*\\.shtml',
        nextLink: 'id("next_page")',
        pageElement: 'id("ctrlfscont")',
        exampleUrl: 'http://china.cankaoxiaoxi.com/roll10/2014/0817/464381.shtml',
    },
    {name: '中国网山东频道',
        url: '^http://sd\\.china\\.com\\.cn/.*\\.html',
        autopager: {
            pageElement: 'css;.content',
                relatedObj: true,
        }
    },
    {name: '凯迪社区',
        url: '^http://club\\.kdnet\\.net/list\\.asp',
        nextLink: 'auto;',
        pageElement: '//div[@class="lf w840px"]/div[@class="list-table"]/table',
        exampleUrl: 'http://club.kdnet.net/list.asp?t=0&boardid=1&selTimeLimit=0&action=&topicmode=0&s=&page=1',
    },
    {name: '木木文摘',
        url: 'http://www\\.85nian\\.net/',
        nextLink: 'auto;',
        pageElement: 'css;.entry-content'
    },

    //--- 国外新闻
    {name: 'TouringCarTimes',
        url: /^http:\/\/www\.touringcartimes\.com\/category\//i,
        nextLink: '//li[@class="bpn-next-link"]/a',
        autopager: {
            pageElement: '//div[@id="archive_page_wrapper"]',
        }
    },
    {name: 'tomshardware',
        url: /^http:\/\/www\.tomshardware\.com\//i,
        exampleUrl: 'http://www.tomshardware.com/reviews/chrome-27-firefox-21-opera-next,3534-2.html',
        nextLink: '//li[@class="item icon active"]/following::a[1]',
        autopager: {
            pageElement: '//article[@id="news-content"]',
        }
    },

    // ========================= video =====================
    {name: '优酷视频',
        url: /^http:\/\/(?:www|u|i|tv)\.youku\.com\//i,
        nextLink: '//a[@title="下一页"] | //li[@class="next"]/a[text()="下一页"] | //a[em/@class="ico_next"] | //a[span/@class="ico__pagenext"]',
        autopager: {
            pageElement: '//div[@id="list" or @id="listofficial"] | id("getVideoList") | id("imgType") | //div[@class="YK_main" or @class="mainCol"]/descendant::div[@class="items"]',
        }
    },
    {name: "搜库-专找视频",
        url: "^http://www\\.soku\\.com/",
        nextLink: '//li[@class="next"]/a[@title="下一页"]',
        autopager: {
            pageElement: '//div[@class="sk_result"]',
            separatorReal: false,
        }
    },
    {name: '爱奇艺',
        url: /^http:\/\/(list|so)\.iqiyi\.com\//i,
        nextLink: '//div[@class="page"]/a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@class="list_content"]/div[@class="list0"] | //div[@class="s_main"]/descendant::div[@class="mod_sideright clearfix"]/ul',
        }
    },
    {name: '土豆网 - 全部视频',
        url: /^http:\/\/www\.tudou\.com\/cate\/.*\.html/i,
        exampleUrl: 'http://www.tudou.com/cate/ach30.html',
        nextLink: '//div[@class="page-nav-bar"]/a[text()="下一页>"]',
        autopager: {
            pageElement: '//div[@class="content"]',
        }
    },
    {name: '搜狐视频 搜索',
        url: /^http:\/\/so\.tv\.sohu\.com\/mts\?&wd=/i,
        exampleUrl: 'http://so.tv.sohu.com/mts?&wd=%u6211%u662F%u7279%u79CD%u5175%u4E4B%u706B%u51E4%u51F0',
        nextLink: '//div[@class="page"]/a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@class="listBox clear"]/div[@class="column picList"]',
        }
    },
    {name: '搜狐视频',
        url: /^http:\/\/so\.tv\.sohu\.com\/list/i,
        exampleUrl: 'http://so.tv.sohu.com/list_p1169_p2_u4E16_u754C_u676F_p3_p4_p5_p6_p7_p8_p9_p10_p11.html',
        nextLink: '//div[@class="page"]/a[@class="next"]',
        autopager: {
            pageElement: 'id("contentList")/div[@class="column-bd clear"]/ul[@class="cfix"]',
            replaceE: 'id("contentList")/div[@class="page"]',
        }
    },
    {name: 'bilibili',
        "url": "^http://(www\\.bilibili\\.tv/search|space\\.bilibili\\.tv/)",
        "nextLink": "//div[@class=\"pagelistbox\"]/a[@class=\"nextPage\"]|//ul[@class=\"page\"]/li[@class=\"current\"]/following-sibling::li[1]/a",
        "pageElement": "//div[@class=\"searchlist\"]/ul[@class=\"search_result\"]/li|//div[@class=\"main_list\"]/ul/li"
    },
    {name: 'douyu',
        "url": /^https?:\/\/www\.douyu\.com/i,
        "nextLink": "//a[@class='shark-pager-next']",
        "pageElement": "//div[@ic='live-list-content']"
    },
    {name: 'youtube 搜索列表',
        url: /^https?:\/\/www\.youtube\.com\/results/i,
        nextLink: '//div[contains(concat(" ", @class, " "), " yt-uix-pager ")]//a[last()][@href]',
        autopager: {
            pageElement: 'id("results")',
            lazyImgSrc: 'data-thumb'
        }
    },
    {name: 'imdb',
        url: /^http:\/\/www\.imdb\.com\/search/i,
        exampleUrl: 'http://www.imdb.com/search/title?count=100&title_type=feature,tv_series&ref_=nv_ch_mm_1',
        nextLink: '//span[@class="pagination"]/a[last()] | id("right")/a[last()]',
        autopager: {
            pageElement: 'id("main")/*',
        }
    },

    // ====================== shopping、生活 ===========================
    {name: '淘宝搜索',
        url: '^http://(?:list|s|search[^.]*)\\.taobao\\.com/search',
        nextLink: '//a[@class="page-next"]',
        autopager: {
            pageElement: '//div[@class="tb-content"]',
            lazyImgSrc: 'data-lazyload-src|data-ks-lazyload',
        }
    },
    {name: "淘宝",
        url: /^http:\/\/(?!bbs).*\.taobao\.com\//i,
        nextLink: 'auto;',
        autopager: {
            pageElement: '//div[@id="J_ShopSearchResult"]/div/div[contains(@class, "shop-hesper-bd")] | id("J_ItemListsContainer")/ul[@class="item-lists"]',
            lazyImgSrc: 'data-lazyload-src|data-ks-lazyload',
        }
    },
    {name: '天猫 - 搜索',
        url: '^http://list\\.tmall\\.com//?search_product\\.htm\\?',
        nextLink: '//a[@class="ui-page-next" and (text()="下一页>>")]',
        autopager: {
            pageElement: '//div[@id="J_ItemList"]',
            relatedObj: true,
            replaceE: '//div[@class="ui-page-wrap"]',
            lazyImgSrc: 'data-lazyload-src|data-ks-lazyload',
        },
    },
    {name: '店内搜索页-淘宝网',
        url: /^http:\/\/[^.]+\.taobao\.com\/search\.htm\?/i,
        exampleUrl: 'http://jiaqibaihou.taobao.com/search.htm?spm=a1z10.3.w4002-1381691988.18.GgWBry&mid=w-1381691988-0&search=y&keyword=%BC%AA%C1%D0&pageNo=1',
        nextLink: '//a[(text()="下一页")][not(@class="disable")]',
        autopager: {
            pageElement: '//div[@id="J_ShopSearchResult"]/div/div[contains(@class, "shop-hesper-bd")]',
            lazyImgSrc: 'data-lazyload-src|data-ks-lazyload',
        }
    },
    {name: '淘宝论坛 ',
        url: /^http:\/\/bbs\.taobao\.com\//i,
        exampleUrl: 'http://bbs.taobao.com/catalog/thread/647133-264959947.htm?spm=0.0.0.0.Ji1u2u',
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("detail")/div[@class="bbd"] | //div[@class="main-wrap"]//div[@class="bd"]/table[@class="posts"]',
            replaceE: '//div[@class="pagination"]'
        }
    },
    {name: '京东商城',
        url: /^http:\/\/.*\.jd\.com\//i,
        exampleUrl: 'http://list.jd.com/670-686-690-0-0-0-0-0-0-0-1-1-1-1-18-1574-29455-0.html',
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("plist")',
            useiframe: true,
            lazyImgSrc: 'data-lazyload',
        }
    },
    {name: '京东读书',
        url: /^http:\/\/read\.jd\.com\/.*\/.*\.html/i,
        exampleUrl: 'http://read.jd.com/16171/778043.html',
        nextLink: 'auto;',
        autopager: {
            pageElement: '//div[@class="mc clearfix"]',
        }
    },
    {name: '亚马逊',
        url: /^http:\/\/www\.amazon\.cn\/gp\/search\//i,
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("mainResults") | id("btfResults")',
        }
    },
    {name: '易迅网',
        url: /^http:\/\/searchex\.yixun\.com\//i,
        exampleUrl: 'http://searchex.yixun.com/705798t706810-1001-/?YTAG=3.706810246020',
        nextLink: '//div[@class="sort_page_num"]/a[@title="下一页"]',
        autopager: {
            pageElement: '//UL[@id="itemList"]',
            lazyImgSrc: 'init_src'
        }
    },
    {name: '前程无忧 - 搜索',
        url: /^http:\/\/search\.51job\.com\/jobsearch\/search_result/i,
        nextLink: '//table[@class="searchPageNav"]//td[@class="currPage"]/following-sibling::td[1]/a',
        autopager: {
            pageElement: 'id("resultList")',
        }
    },
    {name: '抢了个便宜 | 高性价比正品低价商品推荐网',
        url: /^http:\/\/www\.qlgpy\.com\//i,
        nextLink: '//div[@class="wpagenavi"]/a[text()="下页"]',
        autopager: {
            pageElement: 'id("wrapmain")//ul[starts-with(@id, "post-")]',
        }
    },
    {name: '秒便宜论坛',
        url: /^http:\/\/bbs\.miaopy\.com\//i,
        exampleUrl: 'http://bbs.miaopy.com/activity/list-3.aspx',
        nextLink: 'auto;',
        autopager: {
            pageElement: 'css;.forumtopics-list',
            stylish: 'div.sp-separator { width: 800px !important;}'
        }
    },
    {name: '露天拍賣',
        url: /^http:\/\/[a-z]+\.ruten\.com\.tw\//i,
        exampleUrl: 'http://class.ruten.com.tw/category/sub00.php?c=0019000800010001',
        nextLink: 'auto;',
        autopager: {
            pageElement: '//div[@class="searchResult"]',
        }
    },
    {name: 'Yahoo!奇摩拍賣',
        url: /^https:\/\/tw\.bid\.yahoo\.com\//i,
        exampleUrl: 'https://tw.bid.yahoo.com/tw/2092076277-category-leaf.html?.r=1408853888',
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("srp_sl_result")',
        }
    },
    // 手机评测等
    {name: '杀价帮3C导购网—真实 客观 独立 自由',
        url: /^http:\/\/www\.shajia\.cn\/article/i,
        exampleUrl: 'http://www.shajia.cn/article_list.php',
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("agreement")',
        }
    },
    {name: '机锋网',
        url: /^http:\/\/www\.gfan\.com\/review\/\w+\.html/,
        exampleUrl: 'http://www.gfan.com/review/2014091557751.html',
        nextLink: 'auto;',
        autopager: {
            pageElement: '//div[@class="news-content"]',
            relatedObj: true
        }
    },

    // ========================= 知识、阅读 ============================
    {name: '豆瓣-书影音评论',
        url: '^http://.*\\.douban\\.com/subject',
        nextLink: '//div[@class="paginator"]/span[@class="next"]/a[contains(text(),"后页>")]',
        autopager: {
            pageElement: '//ul[contains(@class,"topic-reply")] | //div[@class="article"]/table | //div[@id="comments" or @class="post-comments"]'
        }
    },
    {name: '我的小组话题 - 豆瓣',
        url: /^http:\/\/www\.douban\.com\/group\//i,
        exampleUrl: 'http://www.douban.com/group/',
        nextLink: '//div[@class="paginator"]/span[@class="next"]/a[text()="后页>"]',
        autopager: {
            pageElement: 'id("content")/div/div[@class="article"]',
        }
    },
    {name: '豆瓣全站',
        url: '^http://.*\\.douban\\.com/.*',
        nextLink: '//div[@class="paginator"]/span[@class="next"]/a[contains(text(),"后页>")]',
        autopager: {
            pageElement: 'id("miniblog") | //*[@class="photolst clearfix" or @class="photolst clearbox" or @class="event-photo-list" or @class="poster-col4 clearfix"] | \
            //div[@id="comment-section"] | //table[@class="olt" or @class="list-b"]/tbody | //div[contains(@class,"clearfix")]/div[@class="article"]'
        }
    },
    {name: '知乎',
        url: /^http:\/\/www\.zhihu\.com\/collection/i,
        exampleUrl: 'http://www.zhihu.com/collection/19561986',
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("zh-list-answer-wrap")/div[@class="zm-item"]',
            useiframe: true,
                newIframe: true
        }
    },
    {name: '译言网 | 译文库和原文库',
        url: /^http:\/\/(?:article|source)\.yeeyan\.org\//i,
        nextLink: '//ul[contains(concat(" ",normalize-space(@class)," "), " y_page") ]/li/a[text()="下一页"]',
        autopager: {
            pageElement: '//div[contains(concat(" ",normalize-space(@class)," "), "content_box")] | //div[@class="y_l"]/div[@class="y_s_list"]',
            replaceE: '//ul[contains(concat(" ",normalize-space(@class)," "), " y_page") ]'
        }
    },
    {name: '译言精选',
        url: /^http:\/\/select\.yeeyan\.org\//i,
        nextLink: '//ul[contains(@class, "s_page_n")]/li/a[text()="下一页"]',
        autopager: {
            pageElement: 'id("article_list")',
            replaceE: '//ul[contains(@class, "s_page_n")]'
        }
    },
    {name: ' 译言小组',
        url: /^http:\/\/group\.yeeyan\.org\//i,
        nextLink: '//div[@class="paginator"]/a[@class="next"]',
        autopager: {
            pageElement: '//div[contains(@class, "column-main")]/div[contains(@class, "stream")]',
            replaceE: '//div[@class="paginator"]',
        }
    },
    {name: '主题站 | 果壳网 ',
        url: '^http://www\\.guokr\\.com/(?:site|group|ask|event)/',
        nextLink: '//ul[@class="gpages"]/li/a[contains(.,"下一页")]',
        pageElement: '//div[@class="article-list"] | //ul[@class="titles"] | //ul[@class="ask-list"] | //ul[@class="event_list gclear"]',
    },
    {name: '大众点评网',
        url: '^http://www\\.dianping\\.com/.*',
        nextLink: '//a[@class="NextPage" and @title="下一页" and (text()="下一页")]',
        pageElement: '//div[@id="searchList"]',
    },
    {name: '我们一起成长 | 幸福进化俱乐部共同成长博客圈',
        url: /^http:\/\/upwith\.me\//i,
        exampleUrl: 'http://upwith.me/',
        nextLink: '//div[@class="pagination"]/descendant::a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@class="content"]',
        }
    },
    {name: '知乎日报',
        url: '^http://zhihudaily\\.jd-app\\.com/',
        nextLink: '//h3/a[text()="<<< 前一天"]',
        autopager: {
            pageElement: 'css;body > *',
            separatorReal: false,
        },
        exampleUrl: 'http://zhihudaily.jd-app.com/',
    },

    // ========================= download ===========================
    {name: 'VeryCD搜索页面',
        url: /http:\/\/www\.verycd\.com\/search\/folders.+/i,
        siteExample: 'http://www.verycd.com/search/folders/',
        nextLink: '//ul[@class="page"]//a[contains(text(),"下一页")][@href]',
        autopager: {
            pageElement: '//ul[@id="resultsContainer"]',
            replaceE: 'id("page_html")/ul[@class="page"]',
            lazyImgSrc: '_src'
        }
    },
    {name: "VeryCD分类资源页",
        url: /^http:\/\/www\.verycd\.com\/sto\/.+/i,
        exampleUrl: "http://www.verycd.com/sto/music/page1",
        nextLink: '//div[@class="pages-nav"]/a[text()="下一页 ?"]',
        autopager: {
            pageElement: '//div[@id="content"]/ul',
            lazyImgSrc: 'load-src',
            replaceE: '//div[@class="pages-nav"]'
        }
    },
    {name: 'SimpleCD | 让被墙变得简单',
        url: /^http:\/\/www\.simplecd\.me\//i,
        exampleUrl: 'http://www.simplecd.me/search/entry/?query=%E7%81%8C%E7%AF%AE%E9%AB%98%E6%89%8B',
        nextLink: '//td[@class="next"]/a[@class="enabled"]',
        autopager: {
            pageElement: '//div[@class="result-list" or @class="sub-recommend"]/div[@class="content"]',
        }
    },
    {name: '电驴站 爱磁力 iCiLi - 电驴下载站',
        url: /^http:\/\/www\.icili\.com\/emule/i,
        exampleUrl: 'http://www.icili.com/emule',
        nextLink: 'id("main")/div[@class="pager"]/descendant::a[text()=" > "]',
        autopager: {
            pageElement: 'id("main")/ul',
            replaceE: 'id("main")/div[@class="pager"]'
        }
    },
    {name: '伪射手网',
        url: /^https?:\/\/(?:www\.)?assrt\.net\/sub\/\?searchword/i,
        exampleUrl: 'http://assrt.net/sub/?searchword=fight+club',
        preLink:{
            startAfter:'&page=',
            inc:-1,
            min:1,
        },
        nextLink:{
            startAfter:'&page=',
            mFails:[/^https?:\/\/(?:www\.)?assrt\.net\/sub\/\?searchword=[^\/]+/i,'&page=1'],
            //mFails: if we don't get a match of startAfter in url, use the combination of mFails
            inc:1,
        },
        autopager: {
            pageElement: '//div[@id="resultsdiv"]/div[@class="subitem"]',
        }
    },
    {name: '豆瓣people',
        url: '^https?://.*\\.douban\\.com/people/',
        nextLink: '//div[@class="paginator"]/span[@class="next"]/a[contains(text(),"后页>")]',
        autopager: {
            pageElement: '//ul[@class="interest-list"]'
        }
    },
    {name: '多看阅读',
        url: 'http://www.duokan.com/',
        pageElement: 'css;ul.u-list, ul.j-list'
    },
    {name: 'kindle114',
        url: /http:\/\/www\.kindle114\.com\/thread-.*?\.html/i,
        autopager: {
            pageElement: 'css;#postlist',
            filter: 'css;#sidebar',
        }
    },
    {name: '传送门 -- 微信公众账号和文章的导航及推荐',
        url: 'http://chuansong\\.me/account/',
        nextLink: 'auto;',
        pageElement: 'css;.pagedlist_item',
        ntimeout: 1*1000,
    },
    {name: 'TTmeiju.Com 您的高清美剧片源下载中心',
        url: /^http:\/\/www\.ttmeiju\.com\//i,
        exampleUrl: 'http://www.ttmeiju.com/meiju/Person.of.Interest.html?page=1',
        nextLink: 'auto;',
        autopager: {
            pageElement: '//div[@class="seedlistdiv" or @class="contentbox"]/table[@class="seedtable"]',
        }
    },
    {name: '电影天堂',
        url: /^http:\/\/www\.dy2018\.com\//i,
        exampleUrl: 'http://www.dy2018.com/html/gndy/dyzz/index.html',
        nextLink: '//div[@class="x"]/descendant::a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@class="co_area2"]/div[@class="co_content8"]',
        }
    },
    {name: '最新电影 | 龙部落',
        url: /^http:\/\/www\.longbuluo\.com\//i,
        exampleUrl: 'http://www.longbuluo.com/category/movie',
        nextLink: '//div[@class="pagebar"]/a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@class="postlist"]',
            replaceE: "css;.pagebar"
        }
    },
    {name: '高清连续剧 | 一起下载吧',
        url: /^http:\/\/17down\.net\/category/i,
        exampleUrl: 'http://17down.net/category/tv',
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("content")/div[starts-with(@class, "entry_box")]',
            replaceE: '//div[@class="pagination"]'
        }
    },
    {name: 'Go下载',
        url: /^http:\/\/goxiazai\.cc\//i,
        exampleUrl: 'http://goxiazai.cc/',
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("main")/div[@class="post"]',
            replaceE: 'id("pagenavi")'
        }
    },
    {name: '720P电影下载,1080P电影下载,bt蓝光电影下载,BT原盘电影下载：BT之家老牌电影下载网站，百万用户选择了这里',
        url: /^http:\/\/bbs\.1lou\.com\//i,
        exampleUrl: 'http://bbs.1lou.com/forum-index-fid-1183.htm',
        nextLink: '//div[@class="page"]/a[text()="?"]',
        autopager: {
            pageElement: 'id("threadlist") | id("body")/div/table[@class="post_table"]',
        }
    },
    {name: '很BT电影联盟',
        url: /^http:\/\/henbt\.com\//i,
        exampleUrl: 'http://henbt.com/',
        nextLink: '//div[@class="pages clear"]/a[@class="nextprev"]',
        autopager: {
            pageElement: 'id("btm")/div[@class="main"]/div[@class="box clear"]',
            separatorReal: false,
        }
    },
    // ================== PT ==============================
    {name: '光华，cmct，chd，皇后，hd86，khdbits，hdsky，hdvnbits，hd-sportbits，tccf，皇后mv，mt，hd4fans，hdhc，发烧友，tlfbits，joyhd，蚂蚁pt，清影pt，北邮人，u2',
        url: /^https?:\/\/(?:bt\.upc\.edu|hdcmct|chdbits|open|hd86|khdbits|hdsky|hdvnbits|hd-sportbits|et8|mv\.open|tp\.m-team|www\.hd4fans|www\.hdhc|www\.pt|pt\.eastgame|www\.joyhd|ipv6\.antsoul|ipv4\.antsoul|pt\.hit\.edu|bt\.byr|u2\.dmhy)\.(net|cn|org|com|cd|cc|me|cm)\//i,
        exampleUrl: 'http://hdcmct.org/torrents.php',
        nextLink: '//b[@title="Alt+Pagedown"]/parent::a',
        autopager: {
            pageElement: '//table[@class="torrents"]',
        }
    },
    {name: '葡萄 :: 种子',
        url: /^https:\/\/pt\.sjtu\.edu\.cn\/torrents\.php/i,
        exampleUrl: 'https://pt.sjtu.edu.cn/torrents.php',
        nextLink: '//b[contains(text(), "下一页")]/parent::a',
        autopager: {
            pageElement: '//table[@class="torrents"]',
        }
    },
    {name: '- hdchina 高清影音人士的分享乐园',
        url: /^https?:\/\/hdchina\.org/i,
        exampleUrl: 'http://hdchina.org',
        nextLink: '//b[contains(text(), "下一页")]/parent::a',
        autopager: {
            pageElement: '//table[@class="torrent_list"]',
        }
    },
    {name: 'TTG',
        url: /^http:\/\/ttg\.im\/browse\.php/i,
        exampleUrl: 'http://ttg.im/browse.php',
        nextLink: '//b[contains(text(), "下页")]/parent::a',
        autopager: {
        pageElement: 'id("torrent_table")',
        }
    },
    {name: '麦田',
        url: /^http:\/\/pt\.nwsuaf6\.edu\.cn\/torrents\.php/i,
        exampleUrl: 'http://hdcmct.org/torrents.php',
        nextLink: '//b[contains(text(), "下一页")]/parent::a[@class="next"]',
        autopager: {
            pageElement: '//table[@class="torrents"]',
        }
    },
    {name: '乐乎网-有乐乎！',
        url: '^http://www\\.ulehu\\.com/',
        nextLink: '//a[@class="a1" and (text()="下一页")]',
        pageElement: '//body/div[@class="container mt20"]/div[@class="content"]/div[@class="colMain"]/div',
        exampleUrl: 'http://www.ulehu.com/',
    },
    {name: 'HDRoad - 资源区',
        url: /^http:\/\/hdroad\.org\/browse\.php/i,
        exampleUrl: 'http://hdroad.org/browse.php',
        nextLink: '//a[contains(text(), "下一页")]',
        autopager: {
            pageElement: '//div[@id="torrent-list"]',
        }
    },
    {name: '种子列表-北京交通大学知行PT',
        url: '^http://pt\\.zhixing\\.bjtu\\.edu\\.cn/search/',
        nextLink: '//a[@class="next"]',
        pageElement: '//table[@class="torrenttable"]',
        exampleUrl: 'http://pt.zhixing.bjtu.edu.cn/search/',
    },
    {name: '紫荆站 | ZiJingBT v2 | 种子页',
        url: /^http:\/\/zijingbt\.njuftp\.org\//i,
        exampleUrl: 'http://zijingbt.njuftp.org/index.html',
        nextLink: '//a[contains(text(), "下一页")]',
        autopager: {
            pageElement: '//table[@class="torrent_table"]',
        }
    },

    // ========================= bbs、blog ======================
    {name: '天涯论坛_帖子列表',
        url: '^http://bbs\\.tianya\\.cn/list',
        nextLink: '//a[text()="下一页"]',
        pageElement: '//div[@class="mt5"]',
    },
    {name: '天涯论坛帖子',
        url:/http:\/\/bbs\.tianya\.cn\/.+\.shtml/i,
        siteExample:'http://bbs.tianya.cn/post-feeling-2792523-1.shtml',
        nextLink:'//div[@class="atl-pages"]/descendant::a[text()="下页"][@href]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@class="atl-main"]',
            lazyImgSrc: 'original',
            filter: function(pages){
                var see_only_uname = unsafeWindow.see_only_uname;
                var setOnlyUser = unsafeWindow.setOnlyUser;
                if(see_only_uname){
                    setOnlyUser(see_only_uname);
                }
            }
        }
    },
    {name: 'mozest社区',
        url: /^https?:\/\/g\.mozest\.com/i,
        nextLink: '//div[@class="pages"]//a[@class="next"]',
        autopager: {
            pageElement: '//div[@id="threadlist"] | //div[@id="postlist"]',
            useiframe: true,
            replaceE: 'css;.pages_btns > .pages'
        }
    },
    {name: 'Firefox中文社区 - 列表',
        url: '^https?://www\\.firefox\\.net\\.cn/thread',
        nextLink: '//div[@class="pages"]/a[contains(text(), "下一页")]',
        autopager: {
            pageElement: 'id("J_posts_list")',
            replaceE: 'css;.pages',
            documentFilter: function(doc) {
                // 头像载入出错的修正
                [].forEach.call(doc.querySelectorAll('img.J_avatar'), function(img){
                    img.setAttribute('onerror', 'this.src="http://www.firefox.net.cn/res/images/face/face_small.jpg";');
                });
            }
        }
    },
    {name: 'Firefox中文社区 - 帖子',
        url: '^https?://www\\.firefox\\.net\\.cn/read',
        nextLink: '//div[@class="pages"]/a[contains(text(), "下一页")]',
        autopager: {
            pageElement: 'id("J_posts_list")/*',
            useiframe: true,
                newIframe: true
        }
    },
    {name: 'Mozilla Addons - 用户信息',
        url: /^https:\/\/addons\.mozilla\.org\/zh-CN\/[^\/]+\/user\//i,
        exampleUrl: 'https://addons.mozilla.org/zh-CN/firefox/user/Vasiliy_Temnikov/',
        nextLink: '//p[@class="rel"]/a[@class="button next"]',
        autopager: {
            pageElement: 'id("my-addons")',
            relatedObj: true,
        }
    },
    {name: 'Mozilla Addons',
        url: /^https?:\/\/addons\.mozilla\.org\/[^\/]+\/firefox/i,
        siteExample: 'https://addons.mozilla.org/zh-CN/firefox/',
        nextLink: '//p[@class="rel"]/a[@class="button next"][@href] | //ol[@class="pagination"]/li/a[@rel="next"][@href]',
        autopager: {

            pageElement: '//div[@id="pjax-results" or @class="separated-listing"]/div[@class="items"] | //section[@class="primary"]/div/div[@class="items"] | //ul[@class="personas-grid"] | //div[@id="my-addons"] | //div[@id="reviews"]',
            relatedObj: true,
            replaceE: 'css;.paginator'
        }
    },
    {name: '搜索 | Mozilla 技术支持',
        url: '^https://support\\.mozilla\\.org/zh-CN/search\\?',
        exampleUrl: 'https://support.mozilla.org/zh-CN/search?esab=a&product=firefox&q=%E7%BE%A4%E7%BB%84',
        nextLink: '//a[@class="btn-page btn-page-next" and contains(text(),"下一个")]',
        autopager: {
            pageElement: '//div[@id="search-results"]/div[@class="grid_9"]/div[@class="content-box"]',
        }
    },
    {name: '傲游浏览器-插件中心',
        url: "^http://extension\\.maxthon\\.cn/",
        nextLink: '//div[@class="pages page-right"]/a[text()=">"]',
        pageElement: '//ul[@id="delegate-all"]'
    },
    {name: "小米手机官方论坛",
        url: "^http://bbs\\.xiaomi\\.cn/",
        nextLink: "//a[@class='nxt' and (text()='下一页')]",
        autopager: {
            pageElement: "id('postlist') | id('threadlist')",
            replaceE: '//div[@class="pg"][child::a[@class="nxt"]]',
            documentFilter: function(doc) {
                var firstDiv = doc.querySelector("div[id^='post_']");
                if (firstDiv) {
                    firstDiv.parentNode.removeChild(firstDiv);
                }
            }
        }
    },
    {name: '棋友家园',
        url: /^http:\/\/www\.weiqitv\.com\/home\/forum/i,
        exampleUrl: 'http://www.weiqitv.com/home/forum.php?mod=viewthread&tid=1623&extra=&page=1',
        nextLink: '//div[@class="pg"]/a[@class="nxt"]',
        autopager: {
            pageElement: 'id("threadlisttableid") | id("postlist")',
            useiframe: true,
        }
    },
    {name: 'Discuz X2.5修复',
        url:/^http?:\/\/(bbs.gfan|bbs.xda|bbs.weiphone|bbs.feng|www.weiqitv|www.diypda|f.ppxclub|bbs.sd001|bbs.itiankong)\.(com|cn)/i,
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@id="threadlist"] | //div[@id="postlist"]',
            replaceE: '//div[@class="pg"][child::a[@class="nxt"]]',
        }
    },
    {name: '威锋论坛搜索',
        url: /^http:\/\/s\.feng\.com\/f\?srchtxt=/i,
        nextLink: '//div[@class="pages"]/a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@id="searchresult"]',
            replaceE: '//div[@class="pages"]'
        }
    },
    {name: 'Discuz 页面跳转修复',
        url:/^http:\/\/(bbs.pcbeta|bbs.besgold|www.pt80)\.(com|net)/i,
        nextLink:'//div[@class="pg"]/descendant::a[@class="nxt"]',
        autopager:{
            pageElement:'//div[@id="postlist"] | //form[@id="moderate"]',
            replaceE: '//div[@class="pg"][child::a[@class="nxt"]]',
        }
    },
    {name: 'vBulletin论坛 加加/看雪/XDA',
        url:/http:\/\/(bbs|forum)\.(jjol|pediy|xda-developers)\.(cn|com)\/(forumdisplay|showthread)/i,
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@id="posts"]/div[@align="center"] | //table[@class="tborder"][@id="threadslist"]',
        }
    },
    {name: 'xda-developers',
        url: "^http://forum\\.xda-developers\\.com/",
        nextLink: "//td[@class='alt1']/a[@rel='next']",
        autopager: {
            pageElement: "//table[@id='threadslist'] | //div[@id='posts']",
            replaceE: "//div[@class='pagenav']/table[@class='pagenavControls']",
            separatorReal: false
        }
    },
    {name: '玩机圈',
        url: /^http:\/\/www\.wanjiquan\.com\//i,
        exampleUrl: 'http://www.wanjiquan.com/forum-169-1.html',
        nextLink: 'css;.ma_tiezi_list_page > .next',
        autopager: {
            pageElement: '//form[@id="moderate"] | id("postlist")',
        }
    },
    {name: '极限社区',
        url: '^http://bbs\\.themex\\.net/',
        nextLink: '//a[@rel="next"]',
        pageElement: 'id("threadslist posts")',
    },
    {name: '天坛',
        url:/http:\/\/bbs\.waptw\.com/i,
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@id="content"]',
        }
    },
    {name: '铁血社区',
        url:/^http:\/\/bbs\.tiexue\.net\/.*\.html$/i,
        nextLink:'//div[@class="pages"]/span/a[text()=">>"]',
        autopager:{
            pageElement:'//div[@class="posts_list"]',
        }
    },
    {name: '铁血网',
        url:/http:\/\/[a-z]+\.tiexue\.net/i,
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@class="fontListBox"]',
        }
    },
    {name: '霏凡论坛 - 帖子列表',
        url:/http:\/\/bbs\.crsky\.com\/read\.php/i,
        nextLink:'//div[@class="pages"]//a[text()=">"]',
        autopager:{
            // useiframe:true,
            pageElement:'//div[@class="t5 t2"]',
        }
    },
    {name: '虎扑篮球论坛',
        url: /^https?:\/\/bbs\.hupu\.com\/.*\.html/i,
        exampleUrl: "https://bbs.hupu.com/22125719.html",
        nextLink: "//a[@class='nextPage']",
        autopager: {
            pageElement: '//div[div[@class="floor-show  "]]',
          //  useiframe:f,
          //  iloaded: true,
            replaceE: 'css;.page'
        }
    },
    {name: '虎扑篮球论坛',
        url: /^https?:\/\/bbs\.hupu\.com\/\w+/i,
        exampleUrl: "https://bbs.hupu.com/bxj",
        nextLink: "//a[@class='nextPage']",
        autopager: {
            pageElement: '//li[div[@class="titlelink box"]]',
            useiframe:true,
          //  iloaded: true,
            replaceE: 'css;.page'
        }
    },
    {name: '人大经济论坛',
        url:/http:\/\/bbs\.pinggu\.org\/thread/i,
        siteExample:'http://bbs.pinggu.org/thread-1562552-3-1.html',
        nextLink:'//div[@id="pgt"]/descendant::a[@class="nxt"]',
        autopager:{
            pageElement:'//div[@class="floor"]',
        }
    },
    {name: '九尾网',
        url:/joowii\.com\/arc/i,
        siteExample:'http://www.joowii.com/arc/ysyl/ssgx/2012/0905/125571.html',
        nextLink:'auto;',
        autopager:{
            useiframe:true,
            pageElement:'//div[@class="article"]',
        }
    },
    {name: '17173.com中国游戏第一门户站',
        url: '^http://news\\.17173\\.com/content/.*\\.shtml',
        nextLink: '//a[@class="page-next"]',
        pageElement: '//div[@id="matterc"]',
    },
    {name: '游侠网',
        url: /^http:\/\/(?:www|down)\.ali213\.net\//i,
        exampleUrl: 'http://www.ali213.net/news/html/2013-12/91377.html',
        nextLink: 'auto;',
        // nextLink: '//a[@id="after_this_page"][@href] | //div[@class="p_bar"]/a[text()="下页"] | //div[@class="list_body_page"]/a[@title="下一页"]',
        autopager: {
            pageElement: '//div[@id="Content" or @id="game_content" or @id="rqjxhb"]',
            relatedObj: true,
            lazyImgSrc: 'data-original'
        }
    },
    {name: '游民星空',
        url:/http:\/\/www\.gamersky\.com/i,
        siteExample:'http://www.gamersky.com/news/201207/206490.shtml',
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@class="act mid"]',
            relatedObj: true
        }
    },
    {name: '3DMGAME',
        url:/http:\/\/www\.3dmgame\.com\/.*\.html/i,
        siteExample:'http://www.3dmgame.com/news/201312/2310792.html',
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@class="QZmainL"]/div/div[contains(@class, "con")]',
            relatedObj: true,
        }
    },
    {name: '猴岛论坛',
        url:/^http:\/\/bbs\.houdao\.com/i,
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@class="z threadCommon"] | //div[@class="mb10 bodd"]',
        }
    },
    {name: '巴哈姆特',
        url:/^https?:\/\/(?:acg|forum|webbbs|mbox)\.gamer\.com\.tw\/(?:B|C|board|index)\.php\?\w+=[^&]+(?:&\w+=[^&]+)*/i,
        nextLink:'auto;',
        autopager:{
            pageElement: "//div[@id='BH-master']/form/div/table//tr[td/@class='b-list__summary']",
            useiframe: true,
            newIframe: true
        }
    },
    {name: '178 魔兽世界、178动漫频道',
        url: /^http:\/\/[a-z]+\.178\.com\/.*\.html/i,
        exampleUrl: 'http://wow.178.com/201308/170546277543.html',
        nextLink: 'id("cms_page_next")',
        autopager: {
            pageElement: '//div[@id="text"]',
            replaceE: '//div[@class="page"]',
            relatedObj: true
        }
    },
    {name: '阡陌居',
        url:/http:\/\/www\.1000qm\.com\/(?:thread\.php\?fid\-\d+|read\.php\?tid\-\d+)\.html/i,
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@class="z threadCommon"] | //div[@id="pw_content"][@class="mb10"]',
        }
    },
    {name: '煎蛋首页',
        url:/https?:\/\/jandan\.net\/(?:page)?/i,
        siteExample:'http://jandan.net/',
        useiframe:true,
        prevLink:'//a[contains(text(),"上一页")]',
        nextLink:'//a[contains(text(),"下一页")]|//a[contains(text(),"更多文章")]',
        autopager:{
           pageElement:'//div[@class="post f list-post"] | //ol[@class="commentlist"]',
        }
    },
    {name: '蜂鸟网',
        url:/http:\/\/qicai\.fengniao\.com\/\d+\/\d+.html/i,
        siteExample:'http://qicai.fengniao.com/370/3705137.html',
        useiframe:true,
        nextLink:'auto;',
        autopager:{
            remain:1/3,
            relatedObj:['css;div.page_num','bottom'],
            pageElement:'//div[@class="article"]',
        }
    },
    {name: '55188论坛',
        url:/http:\/\/www\.55188\.com/i,
        siteExample:'http://www.55188.com/forum-8-1.html',
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@class="mainbox threadlist"] | //div[@class="mainbox viewthread"]',
        }
    },
    {name: 'pcdvd论坛',
        url:/^https?:\/\/(?:www|forum)\.pcdvd\.com\.tw\/showthread\.php\?/i,
        siteExample:'https://www.pcdvd.com.tw/showthread.php?t=1144412',
        nextLink:'(//div[@class="pagenav"]//a[text()="下一頁"])[1]',
        autopager:{
            pageElement:'id("posts") | id("posts")/following-sibling::div[@align="center"][position() < last()]',
        }
    },
    {name: 'pcdvd论坛_thread_list',
        url:/^^https?:\/\/(?:www|forum)\.pcdvd\.com\.tw\/forumdisplay\.php\?/i,
        siteExample:'https://www.pcdvd.com.tw/forumdisplay.php?f=34&page=4&sort=lastpost&order=&pp=18&daysprune=-1',
        nextLink:'//div[@class="pagenav"]//a[text()="下一頁"]',
        autopager:{
            pageElement:'//td[@width="100%"][@valign="top"]/table[@class="tborder"]/tbody/tr[td[@class="alt1Active"]]',
        }
    },
    {name: 'PCHOME 社区',
        url:/http:\/\/club\.pchome\.net/i,
        siteExample:'http://club.pchome.net/forum_1_15.html#',
        nextLink:'auto;',
        autopager:{
             pageElement:'//form[@id="mytopics"] | //div[@id="weibo_app"]',
        }
    },
    {name: 'pconline',
        url: '^http://[a-z]+\\.pconline\\.com\\.cn/',
        nextLink: '//div[contains(@class, "pconline_page") or contains(@class, "pager")]/a[@class="next"]',
        autopager: {
            pageElement: '//div[@id="article"]//div[@class="content"] | //ul[@id="ulHoverPic"] | //table[@class="posts"] | id("post_list") | id("topicList")',
            relatedObj: true,
            replaceE: 'css;.pconline_page',
        },
        exampleUrl: 'http://diy.pconline.com.cn/377/3774616.html',
    },
    {name: 'Chiphell',
        url: /^http:\/\/www\.chiphell\.com\/(?!forum)/i,
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("ct")/div[@class="mn"]/div[@class="bm"]/div[@class="bm_c xld"] | id("article_content")/../..',
            replaceE: '//div[@class="pg"]',
        }
    },
    {name: '糗事百科',
        url: '^http://www\\.qiushibaike\\.com/',
        nextLink: '//a[@class="next" and @title="下一页"]',
        autopager: {
            pageElement: '//div[@class="main"]/div[contains(@class, "content-block")]/div[@class="col1"]',
            stylish: '.sp-separator { width: 620px !important; }'
        }
    },
    {name: '抽屉新热榜',
        url: /^http:\/\/dig\.chouti\.com\//i,
        nextLink: '//a[@class="ct_page_edge" and (text()="下一页")]',
        autopager: {
            pageElement: '//div[@id="content-list"]',
            lazyImgSrc: 'original',
            filter: function(pages){
                var chouti = unsafeWindow.chouti;
                var NS_links_comment_top = unsafeWindow.NS_links_comment_top;
                chouti.vote();
                chouti.addCollect();
                chouti.shareweibo();
                chouti.playVido();
                NS_links_comment_top.init();
            }
        }
    },
    {name: '猫扑大杂烩帖子',
        url:/http:\/\/dzh\.mop\.com\/topic\/readSub/i,
        nextLink:'//a[contains(text(),"下一页")][@href]',
        autopager:{
            pageElement:'//div[@class="huitie"]',
        }
    },
    {name: '猫扑数码、猫扑汽车等',
        url: /^http:\/\/(?!dzh).*\.mop\.com\/.*\.shtml/i,
        exampleUrl: 'http://digi.mop.com/sjsj/140522002176016.shtml',
        nextLink: 'id("nextp") | id("page_use")/a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@id="article"] | //div[@class="content"]/div[@class="inner"]/div[@class="nr_con"]',
                replaceE: '//div[@class="page"]',
            relatedObj: true,
        }
    },
    {name: '色影无忌帖子',
        url:/http:\/\/forum\.xitek\.com\/showthread/i,
        siteExample:'http://forum.xitek.com/showthread.php?threadid=571986',
        nextLink:'//font[@size="2"]/font[@class="thtcolor"]/following-sibling::a[@href]',
        autopager:{
            pageElement:'//body/table[position()>2 and position()<(last()-2)]',
        }
    },
    {name: '19楼帖子',
        url:/^http:\/\/www\.19lou\.com/i,
        siteExample:'http://www.19lou.com/forum-1502-thread-29762777-1-1.html',
        nextLink:'auto;',
        useiframe:true,
        autopager:{
            useiframe:true,
            pageElement:'//form[@name="postForm"] | //form[@name="manageForm"]',
        }
    },
    {name: 'blogspot',
        url: '^http://[^./]+\\.(blogspot|playpcesor)(?:\\.[^./]{2,3}){1,2}/(?!\\d{4}/)',
        exampleUrl: 'http://program-think.blogspot.com/  http://www.playpcesor.com/',
        nextLink: '//a[contains(concat(" ", @class, " "), " blog-pager-older-link ")]',
        autopager: {
            pageElement: '//div[contains(concat(" ", @class, " "), " hfeed ") or contains(concat(" ", @class, " "), " blog-posts ")] | id("Blog1")/div[contains(concat(" ", @class, " "), " entry ")]',
            relatedObj: true,
            replaceE: "css;#blog-pager"            }
    },
    {name: '北海365网',
        url: /^http:\/\/[a-z]+\.beihai365\.com\//i,
        exampleUrl: 'http://kj.beihai365.com/',
        nextLink: '//div[@class="pages"]/*[contains(concat(" ",normalize-space(@class)," "), " active ")]/following-sibling::a[1]',
        autopager: {
            pageElement: 'id("threadlist")/tr[@class="tr3"] | id("pw_content")//form[@method="post" and @name="delatc"]',
            replaceE: '//div[@class="pages"]',
        }
    },
    {name: 'gelbooru, safebooru etc',
        url: '^http://(?:www\\.)?\\w{3,4}booru\\.(?:com|org)',
        nextLink: 'id("paginator")//b/following-sibling::a[1]',
        pageElement: 'id("post-list")/div[@class="content"]//span[contains(@class,"thumb")]|id("content")/table',
        exampleUrl: 'http://gelbooru.com/index.php?page=post&s=list http://safebooru.org/index.php?page=post&s=list&tags=all http://safebooru.org/index.php?page=tags&s=list'
    },
    {name: '耳机大家坛 全球最大中文耳机论坛',
        url: /^http:\/\/www\.erji\.net\//i,
        exampleUrl: 'http://www.erji.net/thread.php?fid=138',
        nextLink: '//div[starts-with(@class,"pages")]/b[1]/following-sibling::a[1][not(@class)]',
        autopager: {
            pageElement: '//table[@id="ajaxtable"] | //div[@id="main"]/form[@method="post"]',
            replaceE: '//div[@class="pages"]'
        }
    },
    {name: '艾泽拉斯国家地理论坛',
        url: /^http:\/\/(?:bbs\.ngacn\.cc|nga\.178\.com)\//i,
        exampleUrl: 'http://bbs.ngacn.cc/thread.php?fid=390&rand=183',
        nextLink: '//a[@title="下一页"][@href]',
        autopager: {
            pageElement: 'id("topicrows") | id("m_posts_c")',
            useiframe: true,
            separatorReal: false,
        }
    },
    {name: 'Final Fantasy Shrine Forums',
        url: /^http:\/\/forums\.ffshrine\.org\//i,
        exampleUrl: 'http://forums.ffshrine.org/general-discussion/',
        nextLink: '//a[@rel="next"][@href]',
        autopager: {
            pageElement: 'id("thread_inlinemod_form") | id("postlist")',
        }
    },
    {name: '天猫魔盒论坛',
        url: '^http://www\\.znds\\.com/*',
        nextLink: '//a[contains(text(), "下一页")]',
        pageElement: 'id("threadlist")/div[@class="bm_c"]',
        exampleUrl: 'http://www.znds.com/bbs-172-3.html',
    },
    {name: 'Mobile01',
        url: /^http:\/\/www\.mobile01\.com\/topicdetail\.php.*$/i,
        exampleUrl: 'http://www.mobile01.com/topicdetail.php?f=254&t=3966939',
        nextLink: '//a[contains(text(), "下一頁")]',
        autopager: {
            pageElement: 'id("section")/div[@class="main"]/div[@class="forum-content"]',
        }
    },
    {name: '昆侖 - 资源/连载',
        url: '^http://bbs\\.ikunlun\\.net/forum\\.php.*$',
        nextLink: '//a[@class="now"]/following-sibling::a[1][not(@class="last") ]',
        pageElement: '//tr[@class="topic_list_row"]',
    },

    // ========================= picture ================================================
    {name: 'Flickr搜索',
        url:/http:\/\/www\.flickr\.com\/search\/\?q=/i,
        siteExample:'http://www.flickr.com/search/?q=opera',
        nextLink:'//div[@class="Paginator"]/a[@class="Next"][@href]',
        autopager:{
            pageElement:'//div[@id="ResultsThumbsDiv"]',
            replaceE:'//div[@class="Paginator"]',
        }
    },
    {name: 'Flickr photos',
        "url": "^http://www\\.flickr\\.com/photos/[^/]+/favorites(?:[/?#]|$)",
        "nextLink": "id(\"paginator-module\")/descendant::a[contains(concat(\" \", @class, \" \"), \" Next \")]",
        "pageElement": "id(\"faves\")",
        "insertBefore": "//div[@class=\"Pages\"]"
    },
    // {name: 'pixiv search',
        // url: "^https?://www\\.pixiv\\.net/search\\.php",
        // nextLink: '//a[@rel="next"]',
        // pageElement: '//*[@id="js-react-search-mid"]',
    // },
//     {name: 'pixiv',
//         url: "^https?://(www\.)?pixiv\.net.+",
//         siteExample:'https://www.pixiv.net/novel/search.php?s_mode=s_tag&word=%E5%86%86%E7%92%B0',
//         nextLink:"//a[@rel='next' or contains(concat(' ',@class,' '),' next ')]|(//nav[@class='column-menu']/ul/li[contains(concat(' ',@class,' '),' after ')]|//span[@class='stacc_more_link']|//div[@class='spotlight-items']/p[@class='more'])/a|/ul[@class='page-list']/li[@class='current']/following-sibling::*[1]/a",
//         autopager:{
//             pageElement:"//*[not(@class='popular-introduction' or (contains(@class,'_unit') and //li/@class='bookmark-item'))]/ul[(contains(@class,'_image-items') and not(id('js-react-search-mid js-mount-point-latest-following'))) or contains(@class,'novel-items') or contains(@class,'tag-list inline-') or @class='bookmark-items' or @class='type_entrylist' or @class='member-items' or @class='thu' or @class='user-recommendation-items' or parent::node()[@class='members' or contains(@class,'search_a2_result')]]/li[not(//div/@class='_unit _work-detail-unit')]|//div[@class='event-information' or starts-with(@class,'stacc_status ') or contains(@class,'work-detail-unit') or ../@class='spotlight-items']|id('js-react-search-mid js-mount-point-latest-following')[not(//noscript/*)]/*",
//             stylish: '@-moz-document url-prefix("http://www.pixiv.net/info.php?") { .autopagerize_page_info { display: inline !important; } .autopagerize_page_separator{ padding-top: 0px !important; margin-bottom: 0px !important; border-bottom:none !important; } }',
//             useiframe: true,
//             iloaded: true,
//             itimeout: 0,
//             newIframe: false,
//         }
//     },
    {name: '照片处理网',
        url:/http:\/\/www\.photops\.com\/Article\/.+/i,
        siteExample:'http://www.photops.com/Article/xsjc/20100728172116.html',
        nextLink:'//a[text()="下一页"][@href]',
        autopager:{
            pageElement:'//body/table[last()-2]',
            useiframe:true,
        }
    },
    {name: '扑家汉化平台',
        url:/^http:\/\/www\.pujiahh\.com\/library/i,
        siteExample:'http://www.pujiahh.com/library/',
        nextLink:'//div[@class="pagination"]/ul/li[@class="next-posts"]/a',
        autopager:{
            pageElement:'//div[@class="gametable"]/parent::div',
            replaceE: '//div[@class="pagination"]'
        }
    },
    // === art
    {name: 'deviantART Gallery',
        url: /^https?:\/\/\w+\.deviantart\.com\/gallery\//i,
        exampleUrl: 'https://razielmb.deviantart.com/gallery/',
        nextLink: '//li[@class="next"]/a',
        autopager: {
            pageElement: 'css;#gmi-ResourceStream',
            relatedObj: true
        }
    },
    // === mm ===
    {name: 'Beautyleg腿模写真图片网',
        url:/^http:\/\/www\.beautylegmm\.com\/\w+\/beautyleg-\d+.html/i,
        siteExample:'http://www.beautylegmm.com/x/beautyleg-x.html',
        nextLink:'auto;',
        autopager:{
            pageElement:'id("contents_post")/div[@class="post"]',
        }
    },
    {name: 'sasaone.com',
        url: /^https?:\/\/(\w*\.)?sasaone\.com\/\w+\/\d+\/\d+(_\d+)?\.html/i,
        nextLink: function(doc, win, cplink) {
            var m = cplink.match(/\d+_(\d+)\.html/);
            if (!m) {
                return cplink.replace(".html","_2.html");
            } else {
                var current = Number(m[1]);
                var next = current + 1;
                var url = cplink.replace(m[1]+'.html', next+'.html');
                return url;
            }
        },
        autopager:{
            enable:true,
            pageElement: '//div[@id="disappear"]',
            ipages: [true,30],
        },
    },
    {name: 'sasaone.com',
        url: /^https?:\/\/(\w*\.)?sasaone\.com\/\w+(\/list.*\.html|\/index.*\.html)?/i,
        nextLink: '//a[text()="下一页"]',
        autopager:{
            enable:true,
            pageElement: '//ul[@id="need"]/li',
        },
    },
    {name: '24fa',
        url: /^https?:\/\/(\w*\.)?24fa\.top\/.*\.html/,
        nextLink: 'auto;',
        autopager:{
            enable:true ,
            pageElement: '//div[@id="content"]',
            ipages: [true,30],
        },
        exampleUrl: 'https://www.24fa.top/MeiNv/2017-10/50531p4.html',
    },
    {name: '美女86',
        url: '^http://www\\.17786\\.com\\/\\d+_\\d+\\.html',
        nextLink: '(//div/div/div/a[@class="next-page-a"])[last()]',
        autopager:{
            pageElement: '//div[@class="img_box"]',
            ipages: [true,30],
        },
        exampleUrl: 'http://www.17786.com/8104_2.html',
    },
     {name: '宅男女神',
        url: '^https?://www\\.nvshens\\.com\\/.\\/\\d+\\/',
        nextLink: '//div[@id="pages"]/span/following::a[not(@class) and not(@id)]',
        exampleUrl: 'http://www.nvshens.com/g/17951/',
        autopager:{
            enable:true,
            pageElement: '//ul[@id="hgallery"]',
            ipages: [true,30],
        },
    },
    {name: '爱套图',
        url: '^https://www\\.aitaotu\\.com/[a-z]+/\\d+(_\\d)*\\.html',
        nextLink: '//a[text()="上一页"]',
        prevLink: '//a[text()="下一页"]',
        autopager:{
            enable:true ,
            pageElement: 'id("big-pic")/p/a',
            ipages: [true,30],
        },
        exampleUrl: 'https://www.aitaotu.com/guonei/1081_4.html',
    },
    {name: '秀美眉',
        url: '^https?://www\\.(xiumeim|xmeim)\\.com/photos/.*\\.html',
        nextLink: '//a[@id="nextPageHref"]',
        autopager:{
            enable:true ,
            pageElement: '//div[@class="gallary_item"]',
            ipages: [true,30],
        },
        exampleUrl: 'http://www.xiumeim.com/photos/YOUMI-189522.html',
    },
    {name: '秀美眉2',
        url: /^https?:\/\/www\.(xiumeim|xmeim)\.com(\/albums\/[^\/]+\.html)?/,
        nextLink: '//a[text()="后页>"]',
        autopager:{
            enable:true,
            pageElement: '//div[@class="gallary_wrap"]',
            ipages: [true,2],
        },
        exampleUrl: 'http://www.xiumeim.com/',
    },
    {name: '美图录',
        url: '^https?://www\\.meitulu\\.com/item/\\d+(_\\d+)?\\.html',
        nextLink: '//a[text()="下一页"]',
        autopager:{
            ipages: [true,30],
            pageElement: '//div[@class="content"]/center',
        },
        exampleUrl: 'https://www.meitulu.com/item/3225_2.html',
    },
    {name: 'meituri',
        url: '^https?://www\\.meituri\\.com',
        nextLink: '//a[text()="下一页"]',
        autopager:{
            pageElement: '//div[@class="content"]',
            ipages: [true,30],
        },
        exampleUrl: 'https://www.meitulu.com/item/3225_2.html',
    },
    {name: 'mimifuli',
        url: /^https?:\/\/(www\.)?(mimifuli|bbt01|yxpjw|yxpjwnet|tangniaobingyinshi)\.(info|club|net|com)/i,
        nextLink: '//li[@class="next-page"]/a | //div[@class="article-paging"]/span/following-sibling::a[1]',
        autopager:{
            enable:true,
            pageElement: '//article[@class="article-content"]|//article[@class="excerpt excerpt-one"]',
            ipages: [true,30],
            replaceE: '//blockquote',
        },
        exampleUrl: 'http://zhaofuli.mobi/luyilu/2016/0224/1990.html',
    },
    {name: '192tt-gallery',
        url: /^https?:\/\/www\.192tt\.com\/\w+\/\w+\/[a-zA-Z]+\d+\.html?/i,
        preLink:{
            startAfter:'_',
            inc:-1,
            min:1,
        },
        nextLink:{
            startAfter:'_',
            mFails:[/^https?:\/\/www\.192tt\.com\/\w+\/\w+\/[^\/]+(?=\.html)/,'_1\.html'],
            inc:1,
        },
        autopager:{
            enable:true ,
            pageElement: '//div[@class="picsbox picsboxcenter"]/center',
            ipages: [true,30],
        },
    },
    {name: '192tt',
        url: /^https?:\/\/www\.192tt\.com/i,
        nextLink: '//div[@class="page"]/a[@class="next"]',
        pageElement: '//ul[@class="clearfix"]',
        exampleUrl:'https://www.192tt.com/gq/',
    },
    {name: '凹凸吧,欲女8',
        url: /^https?:\/\/(www\.)?(tuao8|tuitu8)\.(com|top)\/(?:post)?/,
        nextLink: '//li[@class="next-page"]/a | //span[text()="›"]/parent::a',
        autopager:{
            enable:true ,
            pageElement: '//div[@class="entry"]/p|//article[contains(@class,"post-box")]',
            ipages: [true,30],
        },
        exampleUrl: 'https://www.tuao8.com/post/95.html?pagenum=7;https://www.yunu8.com/web/295.html',
    },
    {name: '17see',
        url: /^https?:\/\/www\.17see\.net/i,
        nextLink: 'auto;',
        autopager:{
            enable:true ,
            pageElement: '//div[@id="ad_content_main"]/following-sibling::img|//div[@id="ad_content_main"]/following-sibling::p/img|//div[@class="m-list-main"]/ul[not(//div[@id="ad_content_main"]/following-sibling::img)]',
            ipages: [true,30],
        },
        exampleUrl: 'https://www.17see.net/qingchun/5542_44.html',
    },
    {name: '悠悠美图',
        url: /^https?:\/\/www\.youyourentiyishu\.com/i,
        nextLink: function(doc, win, cplink) {
            var m = cplink.match(/\d+-(\d+)\.html/);
            if (!m) {
                return cplink.replace(".html","-2.html");
            } else {
                var current = Number(m[1]);
                var next = current + 1;
                var url = cplink.replace(m[1]+'.html', next+'.html');
                var url2 = doc.querySelector('a.next').getAttribute("href");
                if (url != url2)
                    return undefined;
                else
                    return url;
            }
        },
        autopager:{
            enable:true ,
            pageElement: '//div[@class="showimg"]/a',
            ipages: [true,30],
        },
        exampleUrl: 'http://www.youyourentiyishu.com/rentiyishuzhaopian/20180506225810.html',
    },
    {name: 'ppzix',
        url: /^https?:\/\/www\.ppzix\.com/i,
        nextLink: '(//div[@class="neiye_page"]/span|//div[@class="neiye_page"]/strong)/following-sibling::a',
        autopager:{
            pageElement: '//div[@class="nr_cons"]/a|//ul[@class="tpboxul"]/li',
            ipages: [true,30],
        },
        exampleUrl: 'http://www.ppzix.com/tyjr/1915.html',
    },
    {name: '性感尤物',
        url: /^https?:\/\/www\.xgyw\.cc\/[^\/]*\/[^\/]*\.html/,
        nextLink: '//div[@class="page"]/a[text()="后"]',
        autopager:{
            pageElement: '//div[@class="img"]/p',
            ipages: [true,30],
        },
        exampleUrl: 'http://www.xgyw.cc/Xgyw/Xgyw6874.html',
    },
    {name: 'sytaotu',
        url: /^https?:\/\/www\.sytaotu\.com/,
        nextLink: 'auto;',
        autopager:{
            pageElement: '//div[@id="picg"]',                                          //主体内容 xpath 或 CSS选择器 或函数返回值(~~必须~~)
            ipages: [true,30],                               //立即翻页,第一项是控制是否在js加载的时候立即翻第二项(必须小于maxpage)的页数,比如[true,3].就是说JS加载后.立即翻3页.(可选)
        },
        exampleUrl: 'http://www.sytaotu.com/seying/meinvmote/20200608/85252.html',
    },
    {name: '性感尤物2',
        url: /^https?:\/\/www\.xgyw\.cc\/[^\/]*/,
        nextLink: '//div[@class="page"]/a[text()="下页"]',
        autopager:{
            enable:true ,                                                                                               //启用(自动翻页)(可选)
            pageElement: '//tr[./td[@class="td6"]]',
            ipages: [true,10],                               //立即翻页,第一项是控制是否在js加载的时候立即翻第二项(必须小于maxpage)的页数,比如[true,3].就是说JS加载后.立即翻3页.(可选)
        },
        exampleUrl: 'http://www.xgyw.cc/Xgyw',
    },
    {name: '7160美女图片',
        url: '^http://www\\.7160\\.com/*/*/',
        nextLink: '//a[text()="下一页"]',
        pageElement: 'id("arc")/div/div/div/a/img',
        exampleUrl: 'http://www.7160.com/meinv/11988/',
    },
    {name: '七丽丽图库|7lili.com',
        url: '^http://www\\.7lili\\.com/.+/.+/.+/.+\\.html',
        nextLink: '//a[text()="下一页"]',
        pageElement: '//div/div/div/a/img',
        exampleUrl: 'http://www.7lili.com/p/xinggan/201403/30333.html',
    },
    {name: '明星网',
        url: /^https?:\/\/www\.mingxing\.com/,
        nextLink: '(//a[@title="下一页"])[last()]',
        pageElement: '//ul[@class="pbl "]',
        exampleUrl: 'http://www.mingxing.com/tuku/index.html',
    },
    // === 壁纸、素材、icon
    {name: '桌酷壁纸',
        url: /^http:\/\/www\.zhuoku\.com\/.*\.htm/i,
        exampleUrl: 'http://www.zhuoku.com/zhuomianbizhi/computer-kuan/20140107052306.htm',
        nextLink: '//div[@class="turn"]/a[text()="下一页"]',
        autopager: {
            pageElement: 'id("liebiao")',
        }
    },
    {name: '统一壁纸站',
        url: '^http://www\\.3987\\.com/desk/wall/*',
        nextLink: '//a[@hidefocus="true" and @target="_self" and @title="下一页"]',
        pageElement: 'id("Article")/div[@class="big-pic"]',
        exampleUrl: 'http://www.3987.com/desk/wall/31420.html',
    },
    {name: '素材天下',
        url: /^http:\/\/www\.sucaitianxia\.com\//i,
        exampleUrl: 'http://www.sucaitianxia.com/psd/Index.html',
        nextLink: 'auto;',
        autopager: {
            pageElement: '//div[@class="home_19"]/div[@class="left"]/div[@class="mid"]',
        }
    },
    {name: '昵图网',
        url: /^http:\/\/[a-z]+\.nipic\.com\//i,
        exampleUrl: 'http://soso.nipic.com/search.aspx?t=tk&q=%B7%E2%C3%E6',
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("bd") | //ul[@class="search-result-box clearfix"] | //center/table[@width="900" and @cellspacing="0" and @cellpadding="0" and @border="0"]',
            lazyImgSrc: "data-original",
            stylish: '.lazy { display: block; }'
        }
    },
    {name: 'easyicon.net',
        url: '^http://www\\.easyicon\\.net/iconsearch/',
        nextLink: '//div[@class="pages_all"]/a[text()="下一页>"]',
        pageElement: 'id("result_right_layout")',
        exampleUrl: 'http://www.easyicon.net/iconsearch/feed/&color=black',
    },
    {name: 'iconarchive',
        url: '^http://www\\.iconarchive\\.com/search\\?q=*',
        nextLink: '//div[@class="pagination"]/a[@class="next"]',
        pageElement: 'id("layout-search-content")',
        exampleUrl: 'http://www.iconarchive.com/search?q=pin',
    },
    {name: 'Find Icons',
        url: '^http://findicons\\.com/search/',
        nextLink: '//div[@class="pages"]/a[contains(text(), "Next") or contains(text(), "下一页")]',
        pageElement: 'id("search_con")/div[@class="icon_list icon_list_165"]',
        exampleUrl: 'http://findicons.com/search/earth',
    },

    // ========================= software ================================
    {name: '善用佳软',
        url: /^http:\/\/xbeta\.info\/page\//i,
        exampleUrl: 'http://xbeta.info/page/2',
        nextLink: '//div[@class="wp-pagenavi"]/a[@class="nextpostslink"]',
        autopager: {
            pageElement: 'id("entries-in")/div[@class="post"]',
            replaceE: "css;#entries-in > .wp-pagenavi"
        }
    },
    {name: '异次元软件世界',
        url: /^http:\/\/www\.iplaysoft\.com\//i,
        exampleUrl: 'http://www.iplaysoft.com/tag/%E5%90%8C%E6%AD%A5',
        nextLink: '//span[@class="pagenavi_c"]/a[text()="下一页"]',
        autopager: {
            pageElement: 'id("postlist")/div[@class="entry"]',
            replaceE: '//div[@class="pagenavi"]/span[@class="pagenavi_c"]'
        }
    },
    {name: 'PlayNext - 低调的异次元',
        url: '^http://www\\.playnext\\.cn/',
        nextLink: '//div[@class="pagenavi"]/a[contains(text(), "下一页")]',
        pageElement: '//div[@id="container"]/div[@class="content"]/div[@class="post-list"]',
    },
    {name: 'iPc.me - 与你分享互联网的精彩！',
        url: '^http://www\\.ipc\\.me/',
        nextLink: '//div[@class="pagenavi"]/a[contains(text(), "下一页")]',
        pageElement: 'id("posts-list")',
    },
    {name: '独木成林',
        url: '^http://www\\.guofs\\.com/',
        nextLink: '//a[@class="nextpostslink"]',
        pageElement: 'id("content")',
        exampleUrl: 'http://www.guofs.com/',
    },
    {name: '软件淘',
        url: '^http://www\\.65052424\\.com/',
        nextLink: '//a[@class="next"]',
        pageElement: '//div[@id="content"]',
        exampleUrl: 'http://www.65052424.com/page/7',
    },
    {name: 'portableapps',
        url: '^http://portableapps\\.com/(?:forums|node)/',
        nextLink: '//li[@class="pager-next"]/a',
        pageElement: 'id("forum")/table|id("comments")/*[not(@class="item-list")]'
    },
    {name: 'PortableAppC - 有中国特色的便携软件',
        url: /^http:\/\/www\.portableappc\.com\//i,
        exampleUrl: 'http://www.portableappc.com/',
        nextLink: '//a[@class="nextpostslink"]',
        autopager: {
            pageElement: 'id("main")/div[@class="box"]',
            replaceE: '//div[@class="wp-pagenavi"]'
        }
    },
    {name: '精品绿色便携软件',
        url: '^http://www\\.portablesoft\\.org/',
        nextLink: '//div[@class="pagination"]/a[text()="下页 ?"]',
        pageElement: 'id("main")/div[@class="post-entry"]'
    },
    {name: 'zd423',
        url: /^http:\/\/www\.zdfans\.com\//i,
        exampleUrl: 'http://www.zdfans.com/',
        nextLink: '//div[@class="paging"]/a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@class="wrapper"]/div[@class="content-wrap"]/div[@class="content column2"]/ul[@class="excerpt"]',
        }
    },
    {name: '软件阁 - 原创绿色软件更新,精品软件共享',
        url: /^http:\/\/www\.lite6\.com\//i,
        exampleUrl: 'http://www.lite6.com/',
        nextLink: '//li[@class="next"]/a',
        autopager: {
            pageElement: '//div[@class="main"]/div[@class="left"]',
        }
    },
    {name: 'Yanu | 分享优秀、纯净、绿色、实用的精品软件',
        url: '^http://www\\.ccav1\\.com/*',
        nextLink: 'id("content-list")/div[@class="pagination"]/a[text()="下页"]',
        pageElement: '//div[@id="content-list"]',
        exampleUrl: 'http://www.ccav1.com/',
    },
    {name: '绿软家园(绿色下载站)',
        url: /^http:\/\/www\.downg\.com\/.*\.html/i,
        exampleUrl: 'http://www.downg.com/list/r_1_1.html',
        nextLink: 'auto;',
        autopager: {
            pageElement: '//div[@class="cp top-list" or @class="cp software-list"]/div[@class="cp-main"]',
        }
    },
    {name: '绿色下载吧',
        url: /^http:\/\/www\.xiazaiba\.com\//,
        exampleUrl: 'http://www.xiazaiba.com/newsoft.html',
        nextLink: '//div[@class="page-num" or @class="ylmf-page"]/a[@class="nextprev"]',
        autopager: {
            pageElement: 'id("j_soft_list") | //ul[@class="list-soft list-soft-title j-hover"]',
        }
    },
    {name: '下载银行',
        url: /^http:\/\/www\.downbank\.cn\/.*\.htm/i,
        exampleUrl: 'http://www.downbank.cn/soft/html/newlist-1.htm',
        nextLink: '//p[@class="list_page"]/a[text()="下一页"] | id("NextPageText")//a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@id="topiclistzone"] | id("content")/div[@class="listitem"]/div[@class="cp-main"]',
        }
    },
    {name: '小路工作室',
        url: /^http:\/\/www\.wzlu\.cc\/.*\.html/i,
        exampleUrl: 'http://www.wzlu.cc/soft/html/newlist-1.html',
        nextLink: '//p[@class="list_page"]/a[text()="下一页"] | id("NextPageText")//a[text()="下一页"]',
        autopager: {
            pageElement: 'id("topiclistzone") | id("listbox")',
        }
    },
    {name: '心海e站',
        url: /^http:\/\/hrtsea\.com\//i,
        exampleUrl: 'http://hrtsea.com/',
        nextLink: 'id("pagenavi")/span[@class="older"]/a[text()="下一页"]',
        autopager: {
            pageElement: 'id("main")',
        }
    },
    {name: '天天资源网',
        url: /^http:\/\/www\.ttrar\.com\//i,
        exampleUrl: 'http://www.ttrar.com/',
        nextLink: '//div[@id="page"]/a[text()="..."] | //div[@class="page"]/a[text()="下一页"]',
        autopager: {
            pageElement: '//ul[@class="articlelist-ul"]',
            replaceE: "css;#page, .page"
        }
    },
    {name: '重灌狂人',
        url: /^http:\/\/briian\.com\//i,
        exampleUrl: 'http://briian.com/category/android/android-photos-draw',
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("content")',
        }
    },
    {name: '天天软件',
        url: /^http:\/\/www\.tt7z\.com\//i,
        nextLink: 'auto;',
        autopager: {
            pageElement: '//ul[@class="articlelist-ul"]',
            replaceE: '//div[@id="left_content_list"]/div[@class="page"]'
        }
    },
    {name: 'Sublime text - Packages',
        url: '^https://sublime\\.wbond\\.net/browse',
        nextLink: '//nav[@class="pagination"]/a[@class="selected"]/following::a[1]',
        pageElement: '//div[@id="content"]/div[@class="results"]/ul[@class="packages results"]',
    },

    // ========================= dev =================================
    {name: 'User Scripts',
        url: /^https?:\/\/userscripts-mirror\.org/i,
        nextLink: 'auto;',
        autopager: {
            pageElement: 'id("review-list") | //tr[starts-with(@id, "scripts-")] | //tr[starts-with(@id, "posts-")]',
            replaceE: '//div[@class="pagination"]'
        }
    },
    {name: 'UserStyles, GreasyFork',
        url: '^https?://(forum\.userstyles|greasyfork)\.org',
        nextLink: '//a[@rel="next" or div/@id="right-arrow"] | id("PagerMore")/a',
        siteExample: 'https://forum.userstyles.org;https://forum.userstyles.org/discussion/40694/;https://forum.userstyles.org/search?Page=p3&Search=xml;https://greasyfork.org/scripts?page=2;https://greasyfork.org/forum/categories/script-discussions/p2;https://greasyfork.org/forum/dashboard/log/edits;https://greasyfork.org/forum/profile/comments/1/JasonBarnabe',
        pageElement: '//div[@class="styles boxes"] | id("browse-script-list")/li | id("Content")//ul[contains(@class,"DataList")]/li | id("Log") | //div[@class="styles"]/div[@class="style_card overrideHref"] | id("search-results")/li | id("main-article")/article',
        resource_url: 'http://wedata.net/items/74978',
    },
    {name: '博客园',
        url: '^http://www\\.cnblogs\\.com/.*$',
        nextLink: '//a[(text()="Next >")]',
        pageElement: '//div[@id="post_list"]',
        exampleUrl: 'http://www.cnblogs.com/cate/javascript/',
    },
    {name: '开源中国',
        url: '^http://\\w+\\.oschina\\.net/',
        nextLink: '//li[@class="page next"]/a',
        pageElement: '//div[@class="code_list"]/ul | //div[@class="ProjectList"]/ul[@class="List"] | id("OSC_Content")/div[@class="SpaceList BlogList"]/ul | \
        id("OSC_Content")/div[@class="QuestionList"]/ul/li[@class="question"]',
    },
    {name: 'CSDN博客',
        url:/http:\/\/blog\.csdn\.net/i,
        siteExample:'http://blog.csdn.net/wangjieest?viewmode=list',
        nextLink:'//div[@id="papelist"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="article_list"]'
        }
    },
    {name: 'CSDN论坛',
        url:/^http:\/\/bbs\.csdn\.net\/forums\//i,
        siteExample:'http://bbs.csdn.net/forums/Qt',
        nextLink:'//div[@class="page_nav"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//body/div/div[@class="content"]/table',
            replaceE:'//div[@class="page_nav"]',
        }
    },
    {name: 'CSDN话题',
        url:/^http:\/\/bbs\.csdn\.net\/topics\//i,
        siteExample:'http://bbs.csdn.net/topics/390244325',
        nextLink:'//div[@class="control_area"]/descendant::a[@class="next"]',
        autopager:{
            pageElement:'//div[@class="detailed"]',
            replaceE:'//div[@class="control_area"]',
        }
    },
    {name: '51CTO',
        url:/^http:\/\/\w+\.51cto\.com\/\w+\/\d+\/\w+\.htm/i,
        siteExample:'http://developer.51cto.com/art/201007/214478.htm',
        nextLink:'auto;',
        autopager:{
            useiframe:false,
            relatedObj:['css;#content','bottom'],
            pageElement:'css;#content>p'
        }
    },
    {name: '图灵社区 : 图书',
        url: '^http://www\\.ituring\\.com\\.cn/article/',
        nextLink: 'auto;',
        pageElement: '//div[@id="question-header"]/h1 | //div[@class="post-text"]',
        separatorReal: false
    },
    {name: "Stack Overflow, Super User, Server Fault, Stack Apps",
        url: "^http://(?:meta\\.)?(?:s(?:erverfault|tackoverflow|uperuser|tackapps)|\\w+\\.stackexchange|askubuntu)\\.com/",
        nextLink: '//a[@rel="next"]',
        pageElement: "id(\"mainbar questions\")//div[contains(concat(\" \",@class,\" \"),\" question-summary \")]|id(\"answers\")/div[@class=\"pager-answers\"][1]/following-sibling::*[./following-sibling::div[@class=\"pager-answers\"]]",
    },

    // ========================= novel =============================
    {name: '起点文学',
        url:/^http:\/\/(www|read)\.(qidian|qdmm|qdwenxue)\.com\/BookReader\/\d+,\d+/i,
        siteExample:'http://www.qidian.com/BookReader/1545376,27301383.aspx',
        useiframe:true,
        nextLink:'//a[@id="NextLink"]',
        autopager:{
            enable:true,
            useiframe:true,
            pageElement:'//div[@id="maincontent"]/div[@class="booktitle"] | //div[@id="maincontent"]/div[@id="content"]'
        }
    },
    {name: '逐浪小说',
        url:/^http:\/\/book\.zhulang\.com\/.+\.html/i,
        siteExample:'http://book.zhulang.com/153319/62230.html',
        nextLink:'//div[@class="readpage_leftnfy"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@class="readpage_leftntxt"]',
        }
    },
    {name: '烟雨红尘',
        url:/^http:\/\/www\.cc222\.com\/chapter\/.+\.html/i,
        siteExample:'http://www.cc222.com/chapter/558139.html',
        nextLink:'//div[@id="paging"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="aContainer"]',
            remain:1/5,
        }
    },
    {name: '17k',
        url:/^http:\/\/(mm.17k|www.17k)\.com\/chapter\/.+\.html/i,
        siteExample:'http://www.17k.com/chapter/143095/3714822.html',
        nextLink:'//div[@class="read_bottom"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@class="readAreaBox"]'
        }
    },
    {name: '纵横书库',
        url:/^http:\/\/book\.zongheng\.com\/chapter\/.+\.html/i,
        siteExample:'http://book.zongheng.com/chapter/239553/4380340.html',
        nextLink:'//div[@class="tc quickkey"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@class="readcon"]'
        }
    },
    {name: '纵横女生',
        url:/^http:\/\/www\.mmzh\.com\/chapter\/.+\.html/i,
        siteExample:'http://www.mmzh.com/chapter/182074/3287355.html',
        nextLink:'//div[@class="tc key"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@class="book_con"]'
        }
    },
    {name: '新小说吧',
        url:/http:\/\/book\.xxs8\.com\/.+\.html/i,
        siteExample:'http://book.xxs8.com/165779/859903.html',
        nextLink:'//div[@class="page"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="midbody"]',
            maxpage:10,
        }
    },
    {name: '书迷楼',
        url:/http:\/\/www\.shumilou\.com\/.+\.html/i,
        siteExample:'http://www.shumilou.com/tiandilonghun/698520.html',
        nextLink:'//div[@class="content"]/div[@id="content"]/div[@class="title"]/a[text()="下一页(→)"]',
        autopager:{
            pageElement:'//div[@class="content"]/div[@id="content"]',
        }
    },
    {name: '玄幻小说网',
        url:/^http:\/\/www\.xhxsw\.com\/books\/.+\.htm/i,
        siteExample:'http://www.xhxsw.com/books/1063/1063066/10579171.htm',
        nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '新浪读书',
        url:/^http:\/\/vip\.book\.sina\.com\.cn\/book\/.+\.html/i,
        siteExample:'http://vip.book.sina.com.cn/book/chapter_212356_210018.html',
        nextLink:'//p[@class="pages"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@class="mainContent"]'
        }
    },
    {name: '搜狐原创',
        url:/^http:\/\/vip\.book\.sohu\.com\/content/i,
        siteExample:'http://vip.book.sohu.com/content/124852/3902398/',
        nextLink:'//div[@class="artical_btn"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="bgdiv"]'
        }
    },
    {name: '红袖添香',
        url:/^http:\/\/novel\.hongxiu\.com\/a\/.+\.shtml/i,
        siteExample:'http://novel.hongxiu.com/a/303084/3543064.shtml',
        nextLink:'//div[@class="papgbutton"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@class="wrapper_main"]'
        }
    },
    {name: '言情小说吧',
        url:/^http:\/\/www\.xs8\.cn\/book\/.+\.html/i,
        siteExample:'http://www.xs8.cn/book/132368/86157.html',
        nextLink:'//div[@class="chapter_Turnpage"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@class="chapter_content"]'
        }
    },
    {name: '来书小说网',
        url:/^http:\/\/www\.laishu\.com\/book\/.+\.shtml/i,
        siteExample:'http://www.laishu.com/book/8/8891/5488036.shtml',
        nextLink:'auto;',
        autopager:{
            pageElement:'//table[@class="tabkuan"]'
        }
    },
    {name: '小说阅读网',
        url:/^http:\/\/www\.readnovel\.com\/novel\/.+/i,
        siteExample:'http://www.readnovel.com/novel/142947.html',
        nextLink:'//div[@class="bottomTools1"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@class="newContentBody "]'
        }
    },
    {name: '凤鸣轩',
        url:/^http:\/\/read\.fmx\.cn\/files\/article\/html\/.+\.html/i,
        siteExample:'http://read.fmx.cn/files/article/html/5/7/0/4/8/5/70485/1339404.html',
        nextLink:'//div[@class="newread_fy"]/descendant::a[text()="下一章>>"]',
        autopager:{
            pageElement:'//div[@class="newbodybox"]'
        }
    },
    {name: '红薯网',
        url:/http:\/\/www\.hongshu\.com\/content\/.+\.html/i,
        siteExample:'http://www.hongshu.com/content/38591/49531-1193339.html',
        nextLink:'//div[@class="ann"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="readtext"]'
        }
    },
    {name: '百书斋',
        url:/^http:\/\/baishuzhai\.com/i,
        siteExample:'http://baishuzhai.com/shancunqirenchuan/683763.html',
        nextLink:'//div[@class="page"]/descendant::a[text()="下一章(快捷键:→)"]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@id="booktext"]'
        }
    },
    {name: '百书库',
        url:/^http:\/\/baishuku\.com\/html\/.+\.html/i,
        siteExample:'http://baishuku.com/html/40/40514/8778339.html',
        nextLink:'//div[@id="footlink"]/a[text()="下一页(快捷键:→)"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '顶点小说',
        url: '^http://www\\.23us\\.com/html/.+\\.html',
        siteExample: 'http://www.23us.com/html/26/26627/16952316.html',
        nextLink: ' //dd[@id="footlink"]/descendant::a[text()="下一页"]',
        pageElement: 'id("amain")/dl/dd/h1 | id("contents")'
    },
    {name: '快眼文学网',
        url:/^http:\/\/www\.kywxw\.com\/.+\.html/i,
        siteExample:'http://www.kywxw.com/0/12/3792643.html',
        nextLink:'//div[@id="thumb"]/descendant::a[text()="下一章"]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '就爱文学',
        url:/^http:\/\/www\.92wx\.org\/html\/.+\.html/i,
        siteExample:'http://www.92wx.org/html/0/807/220709.html',
        nextLink:'//div[@id="page_bar"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="chapter_content"]'
        }
    },
    {name: '亲亲小说网',
        url:/^http:\/\/www\.77shu\.com\/view\/.+\.html/i,
        siteExample:'http://www.77shu.com/view/0/20/2062418.html',
        nextLink:'auto;',
        autopager:{
            useiframe:true,
            pageElement:'//div[@id="chapter_content"] | //div[@id="content"]'
        }
    },
    {name: '七味书屋',
        url:/^http:\/\/www\.7wsw\.net\/html\/.+\.html/i,
        siteExample:'http://www.7wsw.net/html/shifangtianshi/719412.html',
        nextLink:'//div[@id="chapter_pager"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@class="book_middle_article"]'
        }
    },
    {name: '天天中文',
        url:/^http:\/\/www\.360118\.com\/html\/.+\.html/i,
        siteExample:'http://www.360118.com/html/21/21951/5416831.html',
        nextLink:'//div[@id="FootLink"]/descendant::a[text()="下一页（快捷键→）"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '言情后花园',
        url:/^http:\/\/www\.yqhhy\.org\/novel\/.+\.html/i,
        siteExample:'http://www.yqhhy.org/novel/0/761/38769.html',
        nextLink:'//div[@id="link"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '平南文学',
        url:/^http:\/\/www\.pnxs\.com\/book\/.+\.html/i,
        siteExample:'http://www.pnxs.com/book/zhongshengyantaizidan/2164438.html',
        nextLink:'//div[@class="book_middle_text_next"]/descendant::a[text()="下一章"]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@class="book_middle_text"]'
        }
    },
    {name: '一流小说',
        url:/^http:\/\/www\.1lxs\.com\/novel\/.+\.html/i,
        siteExample:'http://www.1lxs.com/novel/80341/9055036.html',
        nextLink:'//div[@id="chapter_nav"]/descendant::a[text()="下一章"]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '一一小说',
        url:/^http:\/\/www\.11xs\.com\/.+\.htm/i,
        siteExample:'http://www.11xs.com/xs/213/119908.htm',
        nextLink:'//div[@id="LinkMenu"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="Content"]'
        }
    },
    {name: '六九中文',
        url:/^http:\/\/www\.69zw\.com\/xiaoshuo\/.+\.html/i,
        siteExample:'http://www.69zw.com/xiaoshuo/21/21943/4461482.html',
        nextLink:'//div[@class="chapter_Turnpage"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@class="novel_content"]'
        }
    },
    {name: '华夏书库',
        url:/^http:\/\/www\.hxsk\.net\/files\/article\/html\/.+\.html/i,
        siteExample:'http://www.hxsk.net/files/article/html/67/67509/12704488.html',
        nextLink:'//td[@class="link_14"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//table[@class="border_l_r"]'
        }
    },
    {name: '书路/3K',
        url:/^http:\/\/www\.(shuluxs|kkkxs)\.com\/files\/article\/html\/.+\.html/i,
        siteExample:'http://www.shuluxs.com/files/article/html/22/22306/8727879.html',
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '书山路',
        url:/^http:\/\/www\.shu36\.com\/book\/.+\.html/i,
        siteExample:'http://www.shu36.com/book/0/1/3.html',
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '落秋',
        url:/^http:\/\/www\.luoqiu\.com\/html\/.+\.html/i,
        siteExample:'http://www.luoqiu.com/html/18/18505/1385765.html',
        nextLink:'//div[@id="bgdiv"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//table[@class="border_l_r"]',
        }
    },
    {name: '君子网',
        url:/^http:\/\/www\.junziwang\.com\/.+\.html/i,
        siteExample:'http://www.junziwang.com/0/155/25137.html',
        nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '哈罗小说网',
        url:/^http:\/\/www\.hellodba\.net\/files\/article\/html\/.+\.html/i,
        siteExample:'http://www.hellodba.net/files/article/html/0/46/21565.html',
        nextLink:'//div[@class="papgbutton"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="htmlContent"]'
        }
    },
    {name: '百书楼',
        url:/^http:\/\/baishulou\.com\/read\/.+\.html/i,
        siteExample:'http://baishulou.com/read/10/10647/2536085.html',
        nextLink:'//a[text()="下一页(快捷键:→)"][@href]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '万书楼',
        url:/^http:\/\/www\.wanshulou\.com\/xiaoshuo\/.+\.shtml/i,
        siteExample:'http://www.wanshulou.com/xiaoshuo/29/29091/2062593.shtml',
        nextLink:'//div[@id="LinkMenu"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="BookText"]'
        }
    },
    {name: '万卷书屋',
        url:/^http:\/\/www\.wjsw\.com\/html\/.+\.shtml/i,
        siteExample:'http://www.wjsw.com/html/35/35404/2887335.shtml',
        nextLink:'//div[@id="bookreadbottom"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="maincontent"]'
        }
    },
    {name: '书书网',
        url:/^http:\/\/www\.shushuw\.cn\/shu\/.+\.html/i,
        siteExample:'http://www.shushuw.cn/shu/28560/4509794.html',
        nextLink:'//div[@align="center"]/a[text()="下页"][@href]',
        autopager:{
            pageElement:'//div[@class="cendiv"]'
        }
    },
    {name: '飞卢小说',
        url:/^http:\/\/b\.faloo\.com\/p\/.+\.html/i,
        siteExample:'http://b.faloo.com/p/247559/1.html',
        nextLink:'//div[@id="pager"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@class="main0"]'
        }
    },
    {name: '青帝文学网',
        url:/^http:\/\/www\.qingdi\.com\/files\/article\/html\/.+\.html/i,
        siteExample:'http://www.qingdi.com/files/article/html/0/27/13314.html',
        nextLink:'//div[@class="readerFooterPage"]/descendant::a[text()="下一页"]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@class="readerTitle"]'
        }
    },
    {name: '笔下文学',
        url:/^http:\/\/www\.bxwx\.org\/b\/.+\.html/i,
        siteExample:'http://www.bxwx.org/b/56/56907/9020932.html',
        nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页[→]"]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '笔趣阁',
        url:/^http:\/\/www\.biquge\.com\/.+\.html/i,
        siteExample:'http://www.biquge.com/0_67/471472.html',
        nextLink:'//div[@class="bottem2"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '小说客栈',
        url:/^http:\/\/www\.xskz\.com\/xiaoshuo\/.+\.shtml/i,
        siteExample:'http://www.xskz.com/xiaoshuo/29/29091/2062593.shtml',
        nextLink:'//div[@id="LinkMenu"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="BookText"]'
        }
    },
    {name: '翠微居',
        url:/^http:\/\/www\.cuiweiju\.com\/html\/.+\.html/i,
        siteExample:'http://www.cuiweiju.com/html/124/124362/6468025.html',
        nextLink:'//p[@class="cz_bar"]/descendant::a[text()="下一章 》"]',
        autopager:{
            pageElement:'//div[@class="book_wrap"]'
        }
    },
    {name: '在线书吧',
        url:/^http:\/\/www\.bookba\.net\/Html\/Book\/.+\.html/i,
        siteExample:'http://www.bookba.net/Html/Book/15/15995/2030251.html',
        nextLink:'//td[@id="thumb"]/descendant::a[text()="下一章"]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '文学迷',
        url:/^http:\/\/www\.wenxuemi\.net\/files\/article\/html\/.+\.html/i,
        siteExample:'http://www.wenxuemi.net/files/article/html/10/10884/4852125.html',
        nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '爱尚文学网',
        url:/^http:\/\/www\.kenshu\.cc\/files\/article\/html\/.+\.html/i,
        siteExample:'http://www.kenshu.cc/files/article/html/5/5379/6389640.html',
        nextLink:'//dd[@id="footlink"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@class="bdsub"]'
        }
    },
    {name: 'E品中文网',
        url:/^http:\/\/www\.epzw\.com\/files\/article\/html\/.+\.html/i,
        siteExample:'http://www.epzw.com/files/article/html/50/50244/3271485.html',
        nextLink:'//div[@id="link"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '大家读书院',
        url:/^http:\/\/www\.dajiadu\.net\/files\/article\/html\/.+\.html/i,
        siteExample:'http://www.dajiadu.net/files/article/html/14/14436/3337407.html',
        nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="center"]'
        }
    },
    {name: '北京爱书',
        url:/^http:\/\/www\.bj-ibook\.cn\/book\/.+\.htm/i,
        siteExample:'http://www.bj-ibook.cn/book/17/t10409k/12.htm',
        nextLink:'//div[@class="zhtop"]/a[text()="下一页（快捷键→）"][@href]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@id="bmsy_content"]'
        }
    },
    {name: '小说570',
        url:/^http:\/\/www\.xiaoshuo570\.com/i,
        siteExample:'http://www.xiaoshuo570.com/11/11844/2678383.html',
        nextLink:'//div[@id="thumb"]/a[text()="下一页"][@href]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@class="fonts_big"]',
        }
    },
    {name: '看书',
        url:/^http:\/\/www\.kanshu\.com\/files\/article\/html\/.+\.html/i,
        siteExample:'http://www.kanshu.com/files/article/html/30997/935806.html',
        nextLink:'//div[@class="yd_linebot"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//table[@class="yd_table"]'
        }
    },
    {name: '全本小说网',
        url:/^http:\/\/www\.quanben\.com\/xiaoshuo\/.+\.html/i,
        siteExample:'http://www.quanben.com/xiaoshuo/10/10412/2095098.html',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '晋江原创',
        url:/^http:\/\/www\.jjwxc\.net\/onebook\.php\?novelid=/i,
        siteExample:'http://www.jjwxc.net/onebook.php?novelid=862877&chapterid=6',
        nextLink: {
            startAfter:'&chapterid=',
            inc:1,
        },
        autopager:{
            pageElement:'//div[@class="noveltext"]',
        }
    },
    {name: '奇书屋',
        url:/^http:\/\/www\.qishuwu\.com\/.+/i,
        siteExample:'http://www.qishuwu.com/a_zhijian/314815/',
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@id="bgdiv"]'
        }
    },
    {name: 'lu5小说网',
        url:/^http:\/\/www\.lu5\.com\/.+\.html/i,
        siteExample:'http://www.lu5.com/b/5/5442/9575830.html',
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '飞库',
        url:/^http:\/\/www\.feiku\.com\/\/html\/book\/.+\.shtm/i,
        siteExample:'http://www.feiku.com//html/book/130/164016/4891625.shtm',
        nextLink:'//div[@class="prenext"]/descendant::a[text()="下一页→"]',
        autopager:{
            pageElement:'//div[@id="chcontent"]'
        }
    },
    {name: '幻侠小说网',
        url:/http:\/\/www\.huanxia\.com\/book\w+\.html/i,
        siteExample:'http://www.huanxia.com/book548761_6041285.html',
        nextLink:'//a[@href][@id="htmlxiazhang"]',
        autopager:{
            pageElement:'//div[@class="h1title"] | //div[@id="htmlContent"][@class="contentbox"]',
            HT_insert:['//div[@id="htmlContent"]',2],
        }
    },
    {name: '潇湘书院',
        url:/^http:\/\/www\.xxsy\.net\/books\/.*\.html/i,
        siteExample:'http://www.xxsy.net/books/485034/5259176.html',
        nextLink:'//div[@id="detailsubsbox"]/span/a[@href][@title="阅读下一章节"]',
        autopager:{
            pageElement:'//div[@id="detail_title"] | //div[@id="zjcontentdiv"]',
            HT_insert:['//div[@id="zjcontentdiv"]',2],
        }
    },
    {name: '书海',
        url:/^http:\/\/www\.shuhai\.com\/read\/.+\.html/i,
        siteExample:'http://www.shuhai.com/read/4014/371553.html',
        nextLink:'//div[@class="page_operate font_blue"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="txt"]'
        }
    },
    {name: 'yi-see',
        url:/^http:\/\/www\.yi-see\.com/i,
        siteExample:'http://www.yi-see.com/read_266768_15501.html',
        nextLink:'//div[@class="B2"]/descendant::a[text()="下一节"]',
        autopager:{
            pageElement:'//table[@width="900px"][@align="CENTER"]',
        }
    },
    {name: '天下书盟',
        url:/^http:\/\/www\.fbook\.net\/book\/.+\.htm/i,
        siteExample:'http://www.fbook.net/book/35793/2656834.htm',
        nextLink:'//div[@id="pages"]/descendant::a[text()="下一章"]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@id="bookbody"]'
        }
    },
    {name: '涂鸦小说网',
        url:/^http:\/\/www\.tooya\.net\/.+\.html/i,
        siteExample:'http://www.tooya.net/tooya/2/2094/820902.html',
        nextLink:'//div[@class="novel_bottom"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '百晓生/谷粒',
        url:/^http:\/\/www\.(bxs|guli)\.cc\/.+/i,
        siteExample:'http://www.bxs.cc/26758/7708992.html',
        enable:true,
        nextLink:'//div[@id="papgbutton"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="main"]/h1 | //div[@id="readbox"]/div[@id="content"] | //div[@id="readbox"]/div[@id="papgbutton"]',
            HT_insert:['//div[@id="weekhot"]',1],
        }
    },
    {name: '熬夜看书',
        url:/^http:\/\/www\.aoye\.cc\/.+\.html/i,
        siteExample:'http://www.aoye.cc/843/5.html',
        nextLink:'//div[@id="pagebottom"]/descendant::a[@id="nextpage"]',
        autopager:{
            pageElement:'//pre[@id="content"]'
        }
    },
    {name: '塔读文学',
        url:/^http:\/\/www\.tadu\.com\/book\/\d+\/\d+/i,
        siteExample:'http://www.tadu.com/book',
        nextLink:'//div[@class="container_center"]/div[@class="left"]/div[@class="jump"]/a[@href][text()="下一章>>"]',
        autopager:{
            useiframe:true,
            pageElement:'//div[@class="container_center"]/div[@class="left"]/div[@class="content"][@id="partContent"]',
        }
    },
    {name: '无错小说网',
        url:/^http:\/\/www\.wcxiaoshuo\.com\/wcxs\-\d+\-\d+/i,
        siteExample:'http://www.wcxiaoshuo.com/wcxs-*-*/',
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@class="wrapper_main"][@id="jsreadbox"]/h1 | //div[@class="wrapper_main"][@id="jsreadbox"]/div[@id="htmlContent"][@class="contentbox"]',
        }
    },
    {name: '燃文',
        url:/^http:\/\/www\.ranwen\.cc\/.+\.html/i,
        siteExample:'http://www.ranwen.cc/A/9/9818/3505060.html',
        nextLink:'//div[@class="pageTools"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="oldtext"]'
        }
    },
    {name: '书河',
        url:/^http:\/\/www\.shuhe\.cc\/.+/i,
        siteExample:'http://www.shuhe.cc/30976/4401025/',
        nextLink:'//div[@class="bottem"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="TXT"]'
        }
    },
    {name: '89文学',
        url:/^http:\/\/89wx\.com\/.+\.htm/i,
        siteExample:'http://89wx.com/html/book/70/70732/6641331.htm',
        nextLink:'//dd[@id="footlink"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//dd[@id="contents"]'
        }
    },
    {name: '极速小说网',
        url:/^http:\/\/www\.186s\.cn\/files\/article\/html\/.+\.html/i,
        siteExample:'http://www.186s.cn/files/article/html/0/304/4528937.html',
        nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '手打8',
        url:/^http:\/\/shouda8\.com\/.+\.html/i,
        siteExample:'http://shouda8.com/zhangyuxingchen/85649.html',
        nextLink:'//div[@id="papgbutton"]/descendant::a[text()="下一章（快捷键 →）"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: '闪文书库',
        url:/^http:\/\/read\.shanwen\.com\/.+\.html/i,
        siteExample:'http://read.shanwen.com/14/14616/1011063.html',
        nextLink:'//td[@class="tb0"]/descendant::a[text()="下一页"]',
        autopager:{
            pageElement:'//div[@id="content"]'
        }
    },
    {name: 'PaiTxt',
        url:/^http:\/\/paitxt\.com\/.+\.html/i,
        siteExample:'http://paitxt.com/24/24596/4507312.html',
        nextLink:'//div[@class="book_middle_text_next"]/descendant::a[text()="下一章(快捷键:→)"]',
        autopager:{
            pageElement:'//div[@id="booktext"]'
        }
    },
    {name: '好书楼',
        url:/^http:\/\/www\.haoshulou\.com\/.+\.html/i,
        siteExample:'http://www.haoshulou.com/Hao/6/60238.html',
        nextLink:'//div[@class="movenext"]/descendant::a[text()="下一章"]',
        autopager:{
            pageElement:'//div[@id="booktext"]'
        }
    },
    {name: 'BookLink.Me:最有爱的小说搜索引擎',
        url: '^http://booklink\\.me/',
        nextLink: '//a[text()="下一页"] | //a[font[text()="下一页"]]',
        pageElement: '//table[@width="100%"][@cellspacing="0"][@cellpadding="2"]',
        scroll_only: true
    },

    // =============================== manhua ========================
    {name: '天极动漫频道新闻',
        url:/https?:\/\/comic\.yesky\.com\/\d+\/.+\.shtml/i,
        siteExample:'http://comic.yesky.com/249/11335749_5.shtml',
        nextLink:'auto;',
        autopager:{
            pageElement:'//div[@class="article"]/p[1]',
            remain:1.4,
            replaceE:'//div[@id="numpage"]',
        }
    },
    {name: '动漫之家漫画网',
        url: /^https?:\/\/(www|manhua)\.(dmzj|178)\.com\/\w+\/\d+\.shtml/,
        siteExample:'https://manhua.dmzj.com/yuanlian/36944.shtml#@page=1',
        nextLink: function(doc, win, cplink) {
            var current = Number(getElementByXpath('//*[@id="page_select"]/option[@selected][1]',doc).text.match(/(\d+)/)[1]);
            var xpath_last = '//*[@id="page_select"]/option[last()]';
            var end_num = Number(getElementByXpath(xpath_last,doc).text.match(/(\d+)/)[1]);
            var next = current +1;
            if (next > end_num )
                return undefined;
            else
                return cplink.replace(/\.shtml(?:#@page=\d+)?/, '.shtml#@page='+next);
        },
        autopager:{
            useiframe:true,
            reload: true, // do not create new iframe but reload
            ipages: [true,20],
            pageElement:'//div[@id="center_box"]/img',
        },
    },
    {name: "看漫画",
        url: /^https?:\/\/www\.manhuagui\.com\/comic\/.+/i,
        // this is a set which uses hash to change page
        // we need to manually add hash
        nextLink: function(doc, win, cplink) {
            var current = Number(getElementByXpath('//*[@id="page"]',doc).innerHTML);
            var xpath_last = '//div[@id="pagination"]/a[contains(@href,"javascript") and not(@class)][last()]';
            var end_num = Number(getElementByXpath(xpath_last,doc).text);
            var next = current +1;
            if (next > end_num )
                return undefined;
            else
                return cplink.replace(/\.html(?:#p=\d+)?/, '.html#p='+next);
        },
        autopager: {
            useiframe: true,
            newIframe: false,
            reload: true, // do not create new iframe but reload
            pageElement: '//div[@class="clearfix"]',
            ipages: [true,20],
        },
        exampleUrl: "https://www.manhuagui.com/comic/17332/372862.html"
    },
    {name: 'CC漫画网',
        url: "^http://www\\.tuku\\.cc/comic/\\d+/\\d+/",
        siteExample:'http://www.tuku.cc/comic/6123/1/',
        nextLink:'auto;',
        autopager:{
            pageElement:'//img[@id="cp_image"]',
            useiframe:true,
        }
    },
    //已失效
    //     {name: '爱漫画',
    //         url: /^http:\/\/www\.iimanhua\.com\/comic\/.+/i,
    //         siteExample:'http://www.iimanhua.com/comic/55/list_39448.html',
    //         useiframe:true,
    //         preLink:{
    //             startAfter:'?p=',
    //             inc:-1,
    //             min:1,
    //         },
    //         nextLink:{
    //             startAfter:'?p=',
    //             mFails:[/^http:\/\/www\.iimanhua\.com\/comic\/.+\.html/i,'?p=1'],
    //             inc:1,
    //             isLast:function(doc,win,lhref){
    //                 var pageSelect=doc.getElementById('pageSelect');
    //                 if(pageSelect){
    //                     var s2os=pageSelect.options;
    //                     var s2osl=s2os.length;
    //                     //alert(s2.selectedIndex);
    //                     if(pageSelect.selectedIndex==s2osl-1)return true;
    //                 }
    //             },
    //         },
    //         autopager:{
    //             useiframe:true,
    //             remain:1/2,
    //             pageElement:'//img[@id="comic"]',
    //         }
    //     },
    //     {name: '新动漫',
    //         url:/http:\/\/www\.xindm\.cn\/mh\/.+/i,
    //         siteExample:'http://www.xindm.cn/mh/shishangzuiqiangdizi/58784.html?p=2',
    //         preLink:{
    //             startAfter:'?p=',
    //             inc:-1,
    //             min:1,
    //         },
    //         nextLink:{
    //             startAfter:'?p=',
    //             mFails:[/http:\/\/www\.xindm\.cn\/mh\/.+\.html/i,'?p=1'],
    //             inc:1,
    //             isLast:function(doc,win,lhref){
    //                 var topSelect=doc.getElementById('topSelect');
    //                 if(topSelect){
    //                     var s2os=topSelect.options;
    //                     var s2osl=s2os.length;
    //                     if(topSelect.selectedIndex==s2osl-1)return true;
    //                 }
    //             },
    //         },
    //         autopager:{
    //             pageElement:'//div[@class="photo"]',
    //             useiframe:true,
    //         }
    //     },
    {name: 'SF在线漫画',
        // only work in chrome
        url:/https?:\/\/manhua\.sfacg\.com\/mh\/.+/i,
        siteExample:'https://manhua.sfacg.com/mh/YULINGSHI/20087/#p=2',
        preLink:{
            startAfter:'#p=',
            inc:-1,
            min:1,
        },
        nextLink:{
            startAfter:'#p=',
            mFails:[/https?:\/\/manhua\.sfacg\.com\/mh\/.+/i,'#p=1'],
            inc:1,
            isLast:function(doc,win,lhref){
                var pageSel=doc.getElementById('pageSel');
                if(pageSel){
                    var s2os=pageSel.options;
                    var s2osl=s2os.length;
                    if(pageSel.selectedIndex==s2osl-1)return true;
                }
            },
        },
        autopager:{
            pageElement:'//img[@id="curPic"]',
            useiframe:true,
            reload: true,
            replaceE: 'id("Pages")'
        }
    },
    {name: '哦漫画',
        url: /^http:\/\/www\.omanhua\.com\/comic\//i,
        siteExample: 'http://www.omanhua.com/comic/2957/36463/index.html?p=2',
        nextLink: {
            startAfter: '?p=',
            mFails: [/^http:\/\/www\.omanhua\.com\/comic\/.+/i, '?p=1'],
            inc: 1,
            isLast: function(doc, win, lhref) {
                var select = doc.getElementById('pageSelect');
                if (select) {
                    var s2os = select.options;
                    var s2osl = s2os.length;
                    if (select.selectedIndex == s2osl - 1) return true;
                }
            },
        },
        autopager: {
            useiframe: true,
            pageElement: '//img[@id="mangaFile"]',
        }
    },
    {name: '汗汗漫画',
        url: /^https?:\/\/\w+\.(?:vs20|3gmanhua|hhcomic|huhudm|hhmmoo|hhimm)\.(?:com|net)\/\w+\/\d+\.html/i,
        siteExample: 'http://www.hhmmoo.com/page315224/1.html?s=1； http://www.hhmmoo.com/page315224/4.html?s=1&d=0',
        nextLink: function(doc, win, cplink) {
            // created based on http://www.hhmmoo.com/script/view.js
            var m = cplink.match(/(.*\d+\/)(\d+)(\.html\?s=\d+)((?:\?|&)d=.*)?/)
            var url_head = m[1];
            var current = Number(m[2]);
            var dID = m[4];
            if (!dID) dID = '&d=0';
            var next = current + 1;
            var xpath = '//div[@class="cH1"]/b[1]';
            var maxpage = document.getElementById("hdPageCount");
            if (maxpage)
                maxpage = Number(maxpage.value);
            else{
                maxpage = document.getElementById("spPageCount");
                if (maxpage)
                    maxpage = Number(maxpage.innerText);
                else
                    return undefined;
            }
            if (next == maxpage)
                return undefined;
            else
                return m[1]+next+m[3]+dID;
        },
        autopager: {
            useiframe: true,
            pageElement: '//div[@id="iBody"]',
            ipages: [true,20],
        }
    },
    {name: '99漫画',
        url: /^https?:\/\/(cococomic|dm.99manga|99manga|99comic|www.99comic|www.hhcomic)\.(com|cc)/i,
        siteExample: 'http://dm.99manga.com/comic/35416/316645/?p=2&s=0',
        nextLink: {
            startAfter: '?p=',
            inc: 1,
            mFails: [/^https?:\/\/(?:cococomic|dm.99manga|99manga|99comic|www.99comic|www.hhcomic)\.(?:com|cc)\/.+/i,'?p=1&s=0'],
            isLast: function(doc, win, lhref) {
                var maxpage = Number(doc.getElementById("spPageCount").innerText);
                var current = Number(doc.getElementById("spPageIndex").innerText);
                debug(current,maxpage);
                if (current == maxpage)  return true;
            },
        },
        autopager: {
            useiframe: true,
            pageElement: '//*[@id="iBody"]',
        }
    },
    {name: '动漫Fans',
        url: /http:\/\/www\.dm123\.cn\/bbs\/(thread\.php\?fid=|read\.php\?tid=)/i,
        siteExample: 'http://www.dm123.cn/bbs/read.php?tid=593645',
        nextLink: 'auto;',
        autopager: {
                pageElement: '//tbody[@id="threadlist"]|//div[@id="pw_content"]',
        }
    },
    {name: 'KuKu动漫',
        url:/http:\/\/comic\.kukudm\.com\/comiclist\/\d+\/\d+.*\.htm/i,
        siteExample:'http://comic.kukudm.com/comiclist/4/17099/3.htm',
        useiframe:true,
        nextLink:'//a[img[contains(@src,"images/d.gif")]]',
        autopager:{
            useiframe:true,
            pageElement:'//body/table[2]'
        }
    },
    {name: '52pk漫画',
        url:/http:\/\/(op|sishen|narutocn)\.52pk\.com\/manhua\/\d+\/\d+/i,
        siteExample:'http://op.52pk.com/manhua/2010/921364.html',
        nextLink:'//li[@id="page__next"]/a[1]',
        autopager:{
            relatedObj:['css;li#page__select','bottom'],
            pageElement:'//div[@id="pictureContent"]'
        }
    },
    {name: '动漫屋',
        url:/https?:\/\/(www|tel)\.dm5\.com\/.+/i,
        nextLink:'(//span[@class="current"])[1]/following-sibling::a[1]',
        autopager:{
            pageElement:'//img[@id="cp_image"]',
            useiframe:true,
            remain: 1/2,
        }
    },
    {name: '天使漫画网,TSDM漫画组',
        url:/^http:\/\/mh\.tsdm\.net\/comic\/.+/i,
        siteExample:'http://mh.tsdm.net/comic/4697/68059.html',
        useiframe:true,
        preLink:{
            startAfter:'?p=',
            inc:-1,
            min:1,
        },
        nextLink:{
            startAfter:'?p=',
            mFails:[/^http:\/\/mh\.tsdm\.net\/comic\/.+\.html/i,'?p=1'],
            inc:1,
            isLast:function(doc,win,lhref){
                console.log(lhref)
                var pageSelect=doc.getElementById('qTcms_select_i');
                if(pageSelect){
                    var s2os=pageSelect.options;
                    var s2osl=s2os.length;
                    //alert(s2.selectedIndex);
                    if(pageSelect.selectedIndex==s2osl-1)return true;
                }
            },
        },
        autopager:{
            useiframe:true,
            remain:1/2,
            pageElement:'//img[@id="qTcms_pic"]',
            ipages: [true,20],
        }
    },
    {name: '930mh',
        url:/https?:\/\/www\.930mh\.com\/manhua\/.+/i,
        siteExample:'http://www.930mh.com/manhua/13355/500671.html?p=2',
        preLink:{
            startAfter:'?p=',
            inc:-1,
            min:1,
        },
        nextLink:{
            startAfter:'?p=',
            mFails:[/https?:\/\/www\.930mh\.com\/manhua\/.+\.html/i,'?p=1'],
            inc:1,
            isLast:function(doc,win,lhref){
                var index = doc.getElementById('images').children[1].innerText;
                var nums = index.match(/\d+/g);
                if(Number(nums[0]) >= Number(nums[1])){
                    return true;
                }
            },
        },
        autopager:{
            pageElement:'//div[@id="images"]/img',
            useiframe:true,
            ipages: [true,20],
        }
    },
    {name: '死神中文网',
        url:/http:\/\/(?:\w+\.)?bleachcn\.net\/manhua\/.+/i,
        siteExample:'http://naruto.bleachcn.net/manhua/6759.html',
        nextLink:'//div[@id="comic_pages"]/a[text()="下一页"][@href]',
        autopager:{
            pageElement:'//div[@id="comic_endtext"]',
        }
    },
    {name: 'iiikl论坛',
        url: '^http://bbs\\.iiikl\\.net/forum\\.php\\?forum_id=.*',
        nextLink: '//a[@class="next"]',
        pageElement: '//tr[@class="topic_list_row"]',
        exampleUrl: 'http://bbs.iiikl.net/forum.php?forum_id=82&class_id=0&page=2'
    },
    {name: 'sosg论坛帖子',
        url:/http:\/\/www\.sosg\.net\/read/i,
        siteExample:'http://www.sosg.net/read.php?tid=424833',
        nextLink:'//td[@align="left"]/b/following-sibling::a[@href]',
        autopager:{
            pageElement:'//div[@id="b5"]/form/a/table[1]',
        }
    },
    {name: '澄空贴子内容',
        url:/http:\/\/bbs\.sumisora\.org\/read\.php\?tid=/i,
        siteExample:'http://bbs.sumisora.org/read.php?tid=11015694',
        nextLink:'auto;',
        autopager:{
            pageElement:'css;.t.t2',
        }
    },
    {name: '9gal苍雪论坛',
        url:/http:\/\/bbs\.(9gal|9baka)\.com\/read\.php\?tid=/i,
        siteExample:'http://bbs.9gal.com/read.php?tid=299016',
        nextLink:'auto;',
        autopager:{
            pageElement:'//form[@method="post"]/a[@name]/following-sibling::div',
            replaceE:'//ul[@class="pages"]',
        },
    },
    {name: '和邪社|你的ACG生活 文不在长.内涵则明 图不在色.意淫则灵',
        url: /^http:\/\/www\.hexieshe\.com\//i,
        exampleUrl: 'http://www.hexieshe.com/',
        nextLink: '//div[@class="pagebar"]/a[text()="Next"]',
        autopager: {
            pageElement: 'id("centent")',
        }
    },
    {name: 'haruhichan',
        url: /^http:\/\/haruhichan\.com\//i,
        nextLink: '//a[@rel="next"]',
        autopager: {
            pageElement: '//div[@id="postlist"]',
        }
    },
    {name: 'exhentai',
        url: '^http://exhentai\\.org/s/.*$',
        nextLink: '//img[@src="http://st.exhentai.net/img/n.png"]/..',
        pageElement: '//body/div[@class="sni"]',
        exampleUrl: 'http://exhentai.org/s/0088446283/653117-4',
        useiframe: true
    },
    {name: 'exhentai gallery',
        url: /^http:\/\/exhentai\.org\/g\//i,
        exampleUrl: 'http://exhentai.org/g/514954/d4fcb4973e/?p=1',
        nextLink: '//table[@class="ptt"]//a[text()=">"]',
        autopager: {
            pageElement: '//div[@id="gdt"]',
            relatedObj: true
        }
    },
    {name: 'exhentai frontpage',
        url: /^http:\/\/exhentai\.org\/(\?[^\/]+)?$/i,
        exampleUrl: 'http://exhentai.org/?page=2',
        nextLink: '//table[@class="ptt"]//a[text()=">"]',
        autopager: {
            pageElement: '//table[@class="ptt"]/..',
            relatedObj: true
        }
    },
    {name: 'Hentai Manga|Read free hentai xxx manga online',
        url: /^http:\/\/hentai4manga\.com\//i,
        exampleUrl: 'http://hentai4manga.com/',
        nextLink: '//div[@class="pages"]/a[contains(text(), ">")]',
        autopager: {
            pageElement: 'id("innerContent")',
        }
    },
    {name: '1024社区',
        url: '^http://(www\\.)?t66y\\.com/|^http://cl\\.man\\.lv/',
        nextLink: '//div[@class="pages"]/b/following-sibling::a[1]',
        pageElement: 'id("ajaxtable") | id("main")',
        exampleUrl: 'http://t66y.com/thread0806.php?fid=15',
    },
    {name: 'DLsite 検索結果',
        url: /^http:\/\/(?:[^.]+\.)?dlsite\.com\//i,
        exampleUrl: 'http://www.dlsite.com/home/fsr/=/language/jp/keyword/kon/age_category%5B0%5D/general/per_page/30/show_type/n/page/2',
        nextLink: '//td[@class="page_no"]/ul/li/a[text()="次へ" or text()="Next"]',
        autopager: {
            pageElement: 'id("search_result_list")',
        }
    },
    {name: 'Gyutto.com｜の検索結果',
        url: /^http:\/\/gyutto\.com\/search\/search_list\.php/i,
        exampleUrl: 'http://gyutto.com/search/search_list.php?_adult_check=yes&action=perPage&search_keyword=lol&search_type=&mode=search&perPage=30&pageID=2&ref_path=%2Fsearch%2Fsearch_list.php',
        nextLink: '//a[text()="次の30件へ"]',
        autopager: {
            pageElement: 'id("struct_2ColRightIn")/div[@class="unit_ItemList"]/div[contains(@class, "parts_ItemBox")]',
            relatedObj: true
        }
    },
    {name: 'JAVLibrary',
        url: /^http:\/\/www\.javlibrary\.com\/cn\//i,
        exampleUrl: 'http://www.javlibrary.com/cn/vl_bestrated.php',
        nextLink: '//div[@class="page_selector"]/a[@class="page next"]',
        autopager: {
            pageElement: 'id("rightcolumn")/div[@class="videothumblist"] | id("rightcolumn")/div[@class="starbox"]',
        }
    },
    {name: 'NyaaTorrents',
        url: '^http://(?:(?:www|sukebei?)\\.)?nyaa\\.se/',
        nextLink: '//div[@class="pages"]/b/following-sibling::a[1]',
        pageElement: '//table[@class="tlist"]',
        exampleUrl: 'http://www.nyaa.se/',
    },
    {name: '极影动漫',
        url: 'http://bt.ktxp.com/.+[0-9]+-*',
        nextLink: '//span[@class="current"]/following-sibling::a[1]',
        pageElement: '//div[@class="item-box round-corner" and div/@class="title"]',
    },
    {name: 'BTDigg Search',
        url: '^https?://btdigg.org/search*',
        nextLink: '//a[contains(text(),"→")]',
        pageElement: '//body/div/div/center',
    },


    // ==================== 国外站点 ===================
    {name: 'AnandTech',
        url: '^http://anandtech\\.com/',
        nextLink: '//div[@class="pagination"]/ul/li[@class="arrow"]/a[text()="?"]',
        pageElement: '//section[@class="content"]/section[@class="main_cont"]/section[@class="main_cont"]',
        exampleUrl: 'http://anandtech.com/tag/mb',
    },
    {name: 'Android Police - Android News, Apps, Games, Phones, Tablets',
        url: '^http://www\\.androidpolice\\.com/',
        nextLink: '//div[@class="wp-pagenavi"]/a[text()="Next?"]',
        pageElement: '//div[@id="content"]',
        exampleUrl: 'http://www.androidpolice.com/',
    },
    {name: 'Anonymous speaks: the inside story of the HBGary hack | Ars Technica',
        url: '^http://arstechnica\\.com/',
        nextLink: '//a[span[contains(concat(" ", @class, " "), " next ")]]',
        pageElement: '//article[contains(concat(" ", @class, " "), " standalone ")]/section[@id="article-guts"]',
        exampleUrl: 'http://arstechnica.com/tech-policy/2011/02/anonymous-speaks-the-inside-story-of-the-hbgary-hack/',
    },
    {name: 'techPowerUp',
        url: '^http://www\\.techpowerup\\.com/',
        nextLink: '//a[@class="nextpage-top"] | //a[contains(text(),"Next")]',
        pageElement: '//div[@class="text"] | //section[@id="list"] | //form[@class="DiscussionList InlineModForm" or @class="InlineModForm section"]',
        exampleUrl: 'http://www.techpowerup.com/reviews/GSkill/F3-1600C7Q-32GTX/',
    },
    {name: 'Digital Photography Review',
        url: '^http://www\\.dpreview\\.com/',
        nextLink: '//a[@rel="nofollow"][contains(text(), "Next")]',
        pageElement: 'id("mainContent")/div[@class="news withDayIcons"]',
        exampleUrl: 'http://www.dpreview.com/previews/sony-cybershot-dsc-rx1r',
    },
    {name: 'Digital Photography Review 2',
        url: '^http://www\\.dpreview\\.com/',
        nextLink: '//div[@class="reviewPagesDropdown"]/a/img[@alt="Next page"]/..',
        insertBefore: 'id("amazonBuyboxContainer")',
        autopager: {
            pageElement: 'id("mainContent")',
            filter: 'css;.reviewNavigatorTop, #amazonBuyboxContainer, .ad, #comments, .buyboxOld.amazon',
                relatedObj: ['css;div.reviewNavigatorBottom','bottom'],
                HT_insert: ['id("amazonBuyboxContainer")',1],
        }
    },

    //-================ 手机网站 ========================
    {name: '手机百度百科',
        url: /^http:\/\/wapbaike\.baidu\.com\//i,
        exampleUrl: 'http://wapbaike.baidu.com/goodlist?uid=F381CCCD6FD2F58151EFFB4A63BFA4FF&ssid=0&pu=sz%401321_1004&bd_page_type=1&from=844b&st=4&step=2&net=1&bk_fr=bk_more_glist',
        nextLink: '//div[@class="pages"]/a[text()="下一页"] | //div[@class="page"]/p[@class="next"]/a[text()="下页"] | //table[@class="table next"]//a[text()="下页"] | //a[@class="m-rm-5" and text()="余下全文"]',
        autopager: {
            pageElement: '//div[@class="bd"] | //div[@class="list"] | id("lemma-content")',
            separatorReal: false,
            replaceE: 'css;.page > .p-num'
        }
    },
    {name: '手机豆瓣',
        url: /^http:\/\/m\.douban\.com\/.*/i,
        exampleUrl: 'http://m.douban.com/book/subject/1088065/reviews?session=c0ea1419',
        nextLink: '//div[@class="pg" or @class="paginator"]/a[text()="下一页"]',
        autopager: {
            pageElement: 'id("bd")/div[@class="itm"] | //div[@class="bd"]/div[@class="list"]',
            separatorReal: false
        }
    },
    {name: '手机新浪新闻',
        url: /^http:\/\/[a-z]+\.sina\.cn\/\?sa=/i,
        exampleUrl: 'http://news.sina.cn/?sa=t124d10608655v71&pos=108&vt=4&clicktime=1386267238910&userid=user138626723891024077253801575993',
        nextLink: 'id("j_loadingBtn")',
        autopager: {
            pageElement: 'id("j_articleContent")',
            relatedObj: true
        }
    },
    {name: '手机网易网',
        url: '^http://3g\\.163\\.com/[a-z]+/.*\\.html',
        exampleUrl: 'http://3g.163.com/news/13/0914/04/98N4CSHI0001124J.html',
        nextLink: ['//a[text()="余下全文"]', '//a[text()="下页"]'],
        autopager: {
            pageElement: '//div[@class="content"]',
            // separator: false,
            replaceE: '//div[@class="reset marTop10 cBlue"][child::a[text()="下页"]] | //div[child::form[@class="reset"]]',
            relatedObj: true,
        }
    },
    {name: '手机凤凰网',
        url: '^http://3g\\.ifeng\\.com/[a-z]+/',
        exampleUrl: 'http://3g.163.com/news/13/0914/04/98N4CSHI0001124J.html',
        nextLink: ['//a[text()="余下全文"]', '//a[text()="下一页"]'],
        autopager: {
            pageElement: '//div[@class="zwword"]',
            // separator: false,
            relatedObj: true,
        }
    },
    {name: '手机环球网',
        url: '^http://wap\\.huanqiu\\.com/',
        nextLink: ['//a[text()="余下全文"]', '//a[text()="下一页"]'],
        autopager: {
            pageElement: '//div[@class="newscont"]',
            // separator: false,
            separatorReal: false,
            relatedObj: true,
        }
    },
    {name: 'cnBeta.COM - 移动版',
        url: /^http:\/\/m\.cnbeta\.com\//i,
        exampleUrl: 'http://m.cnbeta.com/',
        nextLink: 'id("yw0")/a[@class="page-next"]',
        autopager: {
            pageElement: '//div/div/div[@class="list"]',
        }
    },
    {name: '手机版M.BookLink.Me',
        url: /^http:\/\/m\.booklink\.me\//i,
        exampleUrl: 'http://m.booklink.me/charpter.php?site_id=2&book_id=69507',
        nextLink: '//div[@class="sec nav"]/form/a[text()="下一页"]',
        autopager: {
            pageElement: 'id("m_main")/ul[@class="list sec"]',
        }
    },
    {name: '开源中国(OSChina.NET)',
        url: /^http:\/\/m\.oschina\.net\//i,
        exampleUrl: 'http://m.oschina.net/',
        nextLink: 'auto;',
        autopager: {
            pageElement: '//ul[@class="ui-listview"]',
            useiframe: true
        }
    },
    {name: '博客园博客手机版',
        url: /^http:\/\/m\.cnblogs\.com\/blog\//i,
        exampleUrl: 'http://m.cnblogs.com/blog/',
        nextLink: '//a[text()="下一页"]',
        autopager: {
            pageElement: '//div[@class="list_item"]',
        }
    },

    // ============== google 其它======================
    {name: "Google Bookmarks",
        "url": "^https?://www\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/bookmarks/",
        "nextLink": "//div[contains(concat(\" \", @class, \" \"), \" kd-buttonbar \")]//tr/td[last()-1 or last]/a[img[contains(@src,\"right.png\")]]",
        "pageElement": "id(\"search\")"
    },
    {name: "Google Code List",
        url: "^https?://code\\.google\\.com/[pr]/(?:[^/]+/){2}list",
        nextLink: "id(\"colcontrol\")//div[contains(concat(\" \", @class, \" \"), \" pagination \")]/a[contains(., \"?\")]",
        pageElement: "id(\"resultstable\")//tr"
    },
    {
        "url": "^https?://code\\.google\\.com/hosting/search\\?",
        "nextLink": "id(\"serp\")/following::a[contains(., \"Next\")][1]",
        "pageElement": "id(\"serp\")/*"
    },
    {
        "url": "^http://[^.]+\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/codesearch",
        "nextLink": "(id(\"navbar\")//td[@class=\"b\"]/a)[last()]",
        "pageElement": "//*[self::div[@class=\"h\"] or self::pre[@class=\"j\"] or self::div[@class=\"f\"]]",
        "insertBefore": "id(\"navbar\")"
    },
    {
        "url": "^https?://groups\\.google(?:\\.[^./]{2,3}){1,2}/groups/search",
        "nextLink": "id(\"navbar\")//td[last()][@class=\"b\"]/a",
        "pageElement": "id(\"res\")/*[self::div or self::br]"
    },
    {
        "url": "^http://scholar\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/scholar",
        "nextLink": "//div[contains(concat(\" \", @class, \" \"), \" n \")]/table/tbody/tr/td[last()]/a|id(\"gs_n\")//table/tbody/tr/td[span and b]/following-sibling::td/a",
        "pageElement": "//form[@name=\"gs\"]/following-sibling::node()[ following::div[contains(concat(\" \", @class, \" \"), \" n \")] ]|id(\"gs_ccl\")/div[@class=\"gs_r\"]"
    },
    {
        "url": "^http://(?:[^.]+\\.)?google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/news",
        "nextLink": "id(\"end-next\")/..",
        "pageElement": "id(\"search-stories story-articles\")"
    },
    {
        "url": "^https?://www\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/history/",
        "nextLink": "//td[@class=\"bl\"][last()-1]/a|//div[@class=\"nn\"]/parent::a",
        "pageElement": "//table[@class=\"res\"]"
    },
    {
        "url": "^http://www\\.google\\.[^./]{2,3}(?:\\.[^./]{2,3})?/logos/",
        "nextLink": "//div[@class=\"base-nav\"]//a[contains(., \"?\")]",
        "pageElement": "id(\"doodles\")|//div[contains(concat(\" \", @class, \" \"), \" title \")]"
    },
    {
        "url": "^http://books\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/books",
        "nextLink": "id(\"navbar\")//span[@class=\"navlink\"]/parent::a",
        "pageElement": "id(\"main_content\")/*"
    },
    {
        "url": "^https?://appengine\\.google\\.com/datastore/explorer\\?.",
        "nextLink": "id(\"ae-datastore-explorer\")//a[@class=\"ae-paginate-next\"]",
        "pageElement": "id(\"ae-datastore-explorer-entities\")"
    },
    {
        "url": "^https?://(?:[^/]+\\.)?google(?:\\.\\w{2,3}){1,2}/movies",
        "nextLink": "id(\"pnnext\")|id(\"navbar navcnt nav\")//td[span]/following-sibling::td[1]/a|id(\"nn\")/parent::a",
        "pageElement": "id(\"movie_results\")/*"
    },
    {
        "url": "^https://chrome\\.google\\.com/webstore/(?:list|search)",
        "nextLink": "//table[@class=\"paginator\"]//td[last()]/a",
        "pageElement": "//div[@class=\"mod-fullpage\"]/div[@class=\"mod-body\"]"
    },
    {
        "url": "^http://www\\.google\\.com/intl/ja/googlebooks/chrome/",
        "nextLink": "id(\"info\")/p[contains(concat(\" \",@class,\" \"),\"nav\")]/a[img[@src=\"images/arrowright.gif\"]]",
        "pageElement": "id(\"page\")/div[a[img] or img]"
    },
    {
        "url": "^http://desktop\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/",
        "nextLink": "id(\"content\")/table[@class=\"header\"]//a[contains(., \"?\")]",
        "pageElement": "id(\"content\")/*[(self::table and @class=\"gadget\") or (self::br and @style=\"clear: both;\")]"
    },
    {
        "url": "^http://sketchup\\.google\\.com/3dwarehouse/search\\?",
        "nextLink": "//div[@class=\"pager_next\"]/parent::a",
        "pageElement": "//div[@class=\"searchresult\"]/ancestor::tr[1]"
    },
    {
        "url": "^https://www\\.google\\.com/a/cpanel/[^/]+/",
        "nextLink": "//tr//ul[@class=\"inlinelist\"]//a[contains(text(),\"?\")]",
        "pageElement": "id(\"list\")"
    },
    {
        "url": "^http://www\\.google\\.com/support/forum/",
        "nextLink": "//div[@class=\"wppkrootCSS\"]/a[contains(text(), \">\")]",
        "pageElement": "//table[@class=\"lctCSS\"]"
    },
    {
        "url": "^http://www\\.google\\.com/products\\?",
        "nextLink": "id(\"nn\")/parent::a",
        "pageElement": "id(\"results\")|id(\"results\")/following-sibling::p[@class=\"clear\"]"
    },
    {
        "url": "^http://www\\.google\\.com/reviews/t",
        "nextLink": "//a[contains(text(), \"Next\")]",
        "pageElement": "id(\"allresults\")/table",
        "insertBefore": "//div[contains(concat(\" \", normalize-space(@class), \" \"), \" t_ftr \")]"
    },
    {
        "url": "^http://www\\.google\\.com/cse\\?cx=",
        "nextLink": "//div[@class='gsc-cursor-page gsc-cursor-current-page']/following-sibling::node()[1]",
        "pageElement": "//div[@class='gsc-webResult gsc-result']",
        "insertBefore": "//div[@class='gsc-cursor-box gs-bidi-start-align']"
    },
    {
        "url": "^http://www\\.google(?:\\.[^./]{2,3}){1,2}/m\\?.",
        "nextLink": "//*[starts-with(text(), \"Next page\") or starts-with(text(), \"次のページ\")]",
        "pageElement": "id(\"universal\")/div[not(@*)]",
        "insertBefore": "id(\"universal\")/*[@class][last()]"
    },
    {
        "url": "^http://followfinder\\.googlelabs\\.com/search",
        "nextLink": "//td[@class=\"more\"]//a[last()]",
        "pageElement": "//table//tr[//div]"
    },
    {
        "url": "^http://www\\.googlelabs\\.com/",
        "nextLink": "id(\"nav\")//td[@class=\"cur\"]/following-sibling::td[1]/a",
        "pageElement": "id(\"nav\")/preceding-sibling::ul"
    },

    // ========================= github ================================
    {name: "github mix",
        "url": "^https?://github\\.com/(?:dashboard|(?:timeline|[^/]+/[^/]+/(?:comments|network/feed)))",
        "nextLink": "//a[@hotkey=\"l\"]|//div[contains(concat(\" \",@class,\" \"),\" pagination \")]/a",
        "pageElement": "//div[@class=\"news\"]/div[contains(@class, \"alert\")]"
    },
    {name: "github 搜索",
        url: "^https?://github\\.com/search",
        nextLink: "//div[@class='pagination']/a[@rel='next']",
        autopager: {
            pageElement: "id('code_search_results issue_search_results')|//div[@class='sort-bar']/following-sibling::*[following-sibling::span[@class='search-foot-note']]",
            insertBefore: "//div[@class='pagination']",
            stylish: 'li.repo-list-item { text-align: left; }'
        }
    },
    {
        "url": "^https?://gist\\.github\\.com/",
        "nextLink": "//div[contains(concat(\" \", @class, \" \"), \" pagination \")]/a[contains(text(),\"Older\")]",
        "pageElement": "//div[contains(concat(\" \", @class, \" \"), \" gist-item \")]"
    },
        // 有点小问题，需要刷新下才有用
    {
        "url": "^https?://github\\.com/(?:changelog|[^/]+/[^/]+/commits)",
        "nextLink": "//a[contains(text(), \"Older\")]",
        "pageElement": "//*[starts-with(@class,\"commit-group\")]"
    },
    {
        "url": "^https?://github\\.com/[^/]+/[^/]+/watchers",
        "nextLink": "//div[@class=\"pagination\"]/span[@class=\"current\"]/following-sibling::a",
        "pageElement": "id(\"watchers\")"
    },
    {
        "url": "^https?://github\\.com/[^/]+/following",
        "nextLink": "//a[hotkey='l']",
        "pageElement": "id(\"watchers\")"
    },
    {
        "url": "^http://learn\\.github\\.com/p/",
        "nextLink": "//a[contains(text(), \"next\")]",
        "pageElement": "//div[@class=\"container\"]/div[@id=\"welcome\" or @class=\"content\"]"
    },
    {
        "url": "^http://github\\.com/blog",
        "nextLink": "//div[contains(concat(\" \",@class,\" \"),\" pagination \")]/a[contains(text(),\"Next\")]",
        "pageElement": "id(\"posts\")/div[contains(concat(\" \",@class,\" \"),\" list \")]/ul/li"
    },

    // ========= 很少用的 ================
    {name: 'bookcool-小说合集',
        url: '^http://www\\.bookcool\\.com/.*\\.htm',
        nextLink: '//div[@id="object1"]/descendant::a[last()][@href]',
        pageElement: '//div[@align="center"]/table[@width !="100%"]',
    },
    {name: 'Hachiya Makoto',
        url: '^http://g\\.e-hentai\\.org/s/.*$',
        nextLink: '//img[@src="http://ehgt.org/g/n.png"]/..',
        pageElement: '//body/div[@class="sni"]',
        exampleUrl: 'http://g.e-hentai.org/s/2221a78fe2/592744-3',
        useiframe: true
    },
    // === hentai image ====
    {name: 'ehentai',
        url: /^https:\/\/e[-x]hentai\.org\/s\/.*\/.*/,
        nextLink: '//a[@id="next"]',
        autopager:{
            enable:true ,                                                                                               //启用(自动翻页)(可选)
            pageElement: '//div[@id="i3"]',
            ipages: [true,30],                               //立即翻页,第一项是控制是否在js加载的时候立即翻第二项(必须小于maxpage)的页数,比如[true,3].就是说JS加载后.立即翻3页.(可选)
        },
        exampleUrl: 'https://e-hentai.org/s/f61cb59d07/1099124-3',
    },
    {name: 'ehentai gallary',
        url: /^https:\/\/e[x-]hentai\.org\/g\/[^\/]*\/[^\/]*(\/\?p=\d)?/,
        nextLink: '//table[@class="ptt"]/tbody/tr/td[last()]/a',
        pageElement: '//div[@id="gdt"]',
        exampleUrl: 'https://e-hentai.org/g/1109427/b827f866e1/?p=3',
    },
    {name: 'ehentai gallary front',
        url: /https:\/\/e[x-]hentai\.org(\/\?[fp].*)?/,
        nextLink: '//table[@class="ptt"]/tbody/tr/td[last()]/a',
        pageElement: '//div[@id="gdt"]',
        exampleUrl: 'https://e-hentai.org/g/1109427/b827f866e1/?p=3',
    },
    {name: 'nhentai',
        url: /^https:\/\/nhentai\.net/,
        nextLink: '//section[@class="pagination"]/a[@class="next"]',
        pageElement: '//div[@class="container index-container"]|//section[@id="image-container"]',
        exampleUrl: 'https://nhentai.net/tag/akigami-satoru/',
    },
    {name: '177pic',
        url: /^https?:\/\/(www\.)?177pic\.info\/html\/.*\.html/,
        nextLink: '//a[text()="下一页"]',
        autopager:{
            enable:true ,
            useiframe:false,
            pageElement: '//div[@class="entry-content"]',
            ipages: [true,30],
        },
        exampleUrl: 'http://www.177pic.info/html/2017/06/1409443.html',
    },
    {name: 'wnacg',
        url: '^https?://(www\\.)?wnacg\\.org/photos-view-id.*\\.html',
        nextLink: '//a[text()="下一頁"]',
        autopager:{
            enable:true ,
            useiframe:false,                                                                                        //是否使用iframe翻页(可选)
            pageElement: '//img[@id="picarea"]',
            ipages: [true,30],                               //立即翻页,第一项是控制是否在js加载的时候立即翻第二项(必须小于maxpage)的页数,比如[true,3].就是说JS加载后.立即翻3页.(可选)
        },
        exampleUrl: 'http://www.wnacg.org/photos-index-aid-42394.html',
    },
    {name: 'wnacglist',
        url: '^https?://(www\\.)?wnacg\\.org',
        nextLink: '//span[@class="next"]/a',
        pageElement: '//div[@class="gallary_wrap"]',
        exampleUrl: 'http://www.wnacg.org/photos-view-id-2132443.html',
    },
    // ==== NSFW ====
    {name: 'porn-image-xxx.com',
        url: /^https?:\/\/(\w*\.)?porn-image-xxx\.com\/image\/\.*/,
        nextLink: 'auto;',
        autopager:{
            enable:true,
            pageElement: '//div[@id="display_image_detail"]',
            ipages: [true,30],
        },
        exampleUrl: 'https://zh.porn-image-xxx.com/image/g-cup-beauty-big-breasts-image-intertwined-konno-anzu-minami-and-shore-sayaka/page/1/',
    },
    {name: 'namethatpornstar',
        url: /^https?:\/\/namethatpornstar.com/i,
        siteExample: 'http://namethatpornstar.com/all-requests.php?page=2',
        nextLink: {
            startAfter: '?page=',
            inc: 1,
            mFails:[/^https?:\/\/namethatpornstar.com\/.*\.php/i,'?page=1'],
        },
        autopager: {
            useiframe: true,
            pageElement: '//*[@id="newcontainer"]',
        }
    },
    {name: 'AV百科',
        url: '^http://www\\.avbaike\\.net/\\d+\\.html',
        nextLink: 'id("content")/div[@class="article_container row  box"]/div[@class="context"]/descendant::a[text()="下一页"]',
        autopager:{
            enable:true,
            pageElement: '//div[@id="post_content"]',
            ipages: [true,30],
        },
        exampleUrl: 'http://www.avbaike.net/17237.html',
    },
    {name: 'avgle',
        url: /^https:\/\/avgle\.com\/.*/,
        nextLink: '//a[@class="prevnext"]',
        pageElement: '//div[@id="wrapper"]/div[1]/div[@class="row"]/div[1]',
        exampleUrl: 'https://avgle.com/search/videos?search_query=%E5%A5%B3%E6%95%99%E5%B8%AB&search_type=videos&o=tr',
    },
    {name: "pornhub",
        url: "^https://[^.]+\.pornhub\.com/",
        nextLink: "//li[contains(concat(' ', @class, ' '), ' page_next ')]/a",
        autopager: {
            enable: false,           // 启用自动翻页...
            pageElement: "//li[contains(concat(' ', @class, ' '), ' videoblock ')] | //ul[contains(concat(' ', @class, ' '), ' box-nf-photo ')]",
        },
    },
    {name: "llss",
        url: "^https?://[^.]+\.liuli\.pw/",
        nextLink: "//div[@id='wp_page_numbers']/ul/li[last()]/a",
        autopager: {
            enable: true,           // 启用自动翻页...
            pageElement: "//div[@id='content']/article",
        },
    },
    {name: "qyule",
        url: "^https?://[^.]+\.qyule\.tv/",
        preLink: "(//a[@class='prevnext'])[1]/@href",
        nextLink: "(//a[@class='prevnext'])[last()]",
        autopager: {
            pageElement: "//li[div[@class='video']]",
        },
    },
    {name: "chaturbate",
        url: "^https?://([^.]+\.)?chaturbate\.com/",
        nextLink: 'auto;',
        pageElement: '//ul[@class="list"]',
    },
    // ==== English websites ====================
    {name: "reddit",
        url: "^https?://([^.]+\.)?reddit\.com/",
        nextLink: '//a[contains(@rel,"next")]',
        pageElement: 'id("siteTable")/*[not(@class="nav-buttons")]',
    },
    {name: "models",
        url: "^https?://([^.]+\.)?models\.com/models/",
        nextLink: '(//ul[@id="tabnavB"]/li)[last()]/a',
        pageElement: '//div[@class="work-div"]',
    },
    {name: "xkcd",
        url: "^https?://(?:www\.)?xkcd\.com",
        nextLink: function(doc, win, cplink) {
            var m = cplink.match(/\d+/);
            if (!m) {
                return cplink+'/2/';
            } else {
                var url = doc.querySelector('a[rel=next]').getAttribute('href');
                url = 'https://www.xkcd.com/'+url;
                return url;
            }
        },
        pageElement: 'id("middleContainer")',
    },
    // ===== obtained from http://wedata.net/databases/AutoPagerize =========
    // most sites are in japanese
    // update at: June 29, 2018
    {name: 'textream search',
        url: '^https://textream\.yahoo\.co\.jp/search\?',
        nextLink: '(//span[contains(@class,"btnNext")])[1]/a',
        siteExample: '',
        pageElement: 'id("trdlst")',
        created_by: 'ysakot',
        resource_url: 'http://wedata.net/items/81760',
    },
    {name: 'SEIYUドットコム',
        url: '^https?://www\.the-seiyu\.com/',
        nextLink: '//a[text()="次へ"]',
        siteExample: 'https://www.the-seiyu.com/front/app/catalog/list/init?searchWord=%E3%81%8A%E9%85%92&searchMethod=0&searchContextPath=%2Ffront&selectSlot=2203_2018%2F06%2F25_A_14%3A00_16%3A00_09%3A00_400_400&selectSlot2=0_400_400_5%2C000_0_0&wrt=y&mode=image&pageSize=49&currentPage=3&alignmentSequence=4&resultMessage=',
        pageElement: '//div[@id="searchList"]',
        created_by: 'acchan658',
        resource_url: 'http://wedata.net/items/81759',
    },
    {name: '毎日エロ漫画',
        url: '^https?://eromanga-everyday\.com',
        nextLink: '//div[@class="pagenavi"]/ul/li/a[contains(@class, "next")]',
        siteExample: 'http://eromanga-everyday.com/page/2/',
        pageElement: '//div[@class="main_col"]/div[@class="post"]',
        created_by: 'natuha03@hatena',
        resource_url: 'http://wedata.net/items/81758',
    },
    {name: 'Stencyl Forums',
        url: '^https?://community\.stencyl\.com/.',
        nextLink: '(//div[@class="pagelinks floatleft"]|//div[@class="pagesection"]/span)/strong/following-sibling::a[1]',
        siteExample: 'http://community.stencyl.com/index.php/board,2.0.html http://community.stencyl.com/index.php/topic,49229.0.html http://community.stencyl.com/index.php?action=profile;area=showposts;u=146900',
        pageElement: '//table[@class="table_grid"]/tbody/tr|id("quickModForm")/*|id("admin_content")/div[@class="topic"]',
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/81757',
    },
    {name: 'E! Online News',
        url: '^https://(www\.)?eonline\.com/news',
        nextLink: '//a[@rel="next"]',
        siteExample: 'https://www.eonline.com/news/;https://www.eonline.com/news/page/2',
        autopager:{
            pageElement: '//div[@class="category-landing__content-items"]/a',
            stylish: '@-moz-document domain("www.eonline.com") { #newsLanding{height: auto !important;};   .two-column{position: static !important;};   #HFooter{display:none;}; }',
        },
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/77018',
    },
    {name: 'DMM オンラインゲーム コミュニティ',
        url: '^http://www\.dmm\.co(?:m|\.jp)/netgame/community/-/topic/',
        nextLink: '//ul[@class="area-pager"]/li[span]/following-sibling::li/a',
        siteExample: 'http://www.dmm.com/netgame/community/-/topic/detail/=/cid=/tid=16660/',
        pageElement: '//div[contains(@class,"ntg-comment-list")]/ul/li',
        created_by: 't_f_m',
        resource_url: 'http://wedata.net/items/76461',
    },
    {name: 'Variety',
        url: '^https?://variety(latino)?\.com',
        nextLink: '//section[@class="l-river"]/footer/a[@class="c-more"]|//a[@class="c-arrows__next"]|//div[@class="pagination more-news"]/a|//li[@class="next"]/a|//a[@class="next page-numbers"]',
        siteExample: 'http://variety.com http://variety.com/v/tv/ http://varietylatino.com/',
        autopager:{
            pageElement: '//div[@class="l-river__content"]/ul[@class="l-list"]/li[article/figure]|//div[@class="col1"]/section[starts-with(@class,"module-blogroll")]',
            stylish: '@-moz-document domain("variety.com") { img.lazy { display: inline-block !important; }; .c-card__image a{padding:0;} }',
        },
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/76290',
    },
    {name: 'GoComics',
        url: '^https?://(www\.)?gocomics\.com/',
        nextLink: '//div[@class="gc-calendar-nav__next"]/a[last()-1][not(contains(@class,"disabled"))]|//span[contains(@class,"current")]/following-sibling::a[@rel="next"][1]',
        siteExample: 'http://www.gocomics.com/jumpstart/2010/01/01 http://www.gocomics.com/news/all http://www.gocomics.com/mycomics/1616440/edit',
        pageElement: '//div[@class="item-comic-vertical-wrapper" or @class="comic__wrapper" or contains(@class," gc-deck--has-ads gc-deck gc-deck--third") and //header/@class="gc-page-header  bg-news"]|//a[@class="gc-card-item"][not(id("js-item-start")/div)]|//div[@class="row content-section js-available-features"]/*',
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/74786',
    },
    {name: 'Game*Spark',
        url: '^https://(?:www\.)?gamespark\.jp/(?:article|category)/',
        nextLink: 'id("nextPageButton")//li[@class="next"]/a|//li[@class="item paging-next"]/a',
        siteExample: 'https://www.gamespark.jp/article/2016/06/01/66232.html https://www.gamespark.jp/article/?page=1;https://www.gamespark.jp/category/console/latest/?page=1;https://www.gamespark.jp/article/2014/03/13/47007/comment.html;https://www.gamespark.jp/article/2017/09/15/75817.html',
        pageElement: 'id("articlePaging")/preceding-sibling::node()[not(@id="nextPageButton")]|//ul[@class="newsItem" or @class="comment-list"]/li[not(id("articleItem"))]|//div[@class="news-list"]/*',
        created_by: 'myseni',
        resource_url: 'http://wedata.net/items/70183',
    },
    {name: 'ドラゴンクエストX 提案広場 提案一覧',
        url: '^http://hiroba\.dqx\.jp/sc/forum/pretop/',
        nextLink: '//a[@class="pagerNext"]',
        siteExample: 'http://hiroba.dqx.jp/sc/forum/pretop/',
        pageElement: '//div[@class="fm2roundbox--user__inner"]',
        created_by: 'haoyayoi@hatena',
        resource_url: 'http://wedata.net/items/70108',
    },
    {name: 'ナタリー 特集記事 ',
        url: '^https://natalie\.mu/(?:(?:(?:com|mus)ic|eiga|o(?:yatsu|warai)|stage)/)?pp/[^/]',
        nextLink: '//li[contains(concat(" ",@class," ")," sp-tab-next ")]/a',
        siteExample: 'http://natalie.mu/comic/pp/allyouneediskill;http://natalie.mu/comic/pp/akosan/page/4;http://natalie.mu/eiga/pp/drive_ninnin;http://natalie.mu/comic/pp/otoyomegatari02;http://natalie.mu/stage/pp/namuhamudahamu;http://natalie.mu/comic/pp/kudennoise_kanojyo;http://natalie.mu/comic/pp/beautyandbeast01/page/2;http://natalie.mu/comic/pp/rakuen02/page/8',
        pageElement: 'id("sp-left")/div[starts-with(@class,"sp-navigation")]/following-sibling::div[following-sibling::div[@class="sp-link-next" or @class="sp-navigation" or (contains(@class,"sp-footer-navigation") and not(//div/@class="sp-link-next"))]]|//div[contains(concat(" ",@class," ")," PP_main ")]/*[not(contains(concat(" ",@class," ")," PP_pager "))]',
        created_by: 't_f_m',
        resource_url: 'http://wedata.net/items/33439',
    },
    {name: 'ナタリー - 画像 ニュース 統合',
        url: '^https?://natalie\.mu/(?:(?:(?:com|mus)ic|eiga|o(?:yatsu|warai)|stage)/)?(?:news|gallery/news/\d+)/\d',
        nextLink: '//div[@class="NA_galleryNav"]/ul/li[last()]/a|//div[contains(concat(" ",@class," ")," NA_articleFigure ")]/figure/a|//a[@class="NA_more"]',
        siteExample: 'https://natalie.mu/music/gallery/news/19812/28317;https://natalie.mu/comic/gallery/news/18577/26375;http://natalie.mu/comic/news/18577;http://natalie.mu/music/news/120722;http://natalie.mu/eiga/news/156194;http://natalie.mu/stage/news/212854;https://natalie.mu/eiga/news/288207',
        pageElement: '//div[@class="NA_galleryBody" or @class = "NA_articleBanner" or @class="NA_articleFigure" or @class="NA_articleBody" or @class = "NA_articleSup"]',
        created_by: 'inucara',
        resource_url: 'http://wedata.net/items/29498',
    },
    {name: 'drawr新着|スレッド',
        url: '^http://drawr\.net/(new|thread)\.php',
        nextLink: '//p[@class="left-food-link"]/a[contains(.,"Older")]',
        siteExample: 'http://drawr.net/new.php http://drawr.net/thread.php?page=1',
        pageElement: '//div[@class="mgnTop10"]/div',
        created_by: 'fuba',
        resource_url: 'http://wedata.net/items/2713',
    },
    {name: 'Playstation Store',
        url: '^https://store\.playstation\.com/[^/]+/grid/',
        nextLink: '//a[contains(concat(" ",@class," ")," paginator-control__next ")]',
        siteExample: 'https://store.playstation.com/ja-jp/grid/PN.CH.JP-PN.CH.MIXED.JP-PS4GAMEADD/1',
        pageElement: '//div[@class="grid-cell-container"]/div[@id]',
        created_by: 't_f_m',
        resource_url: 'http://wedata.net/items/81756',
    },
    {name: 'アキバ総研 画像',
        url: '^https://akiba-souken\.com/article/\d+/picture/',
        nextLink: '//div[@class="next"]/a',
        siteExample: 'https://akiba-souken.com/article/34552/picture/763514/;https://akiba-souken.com/article/19903/picture/642729/',
        pageElement: '//div[contains(concat(" ",@class," ")," largeImgBox ") or @class="textBox"]',
        created_by: 't_f_m',
        resource_url: 'http://wedata.net/items/81755',
    },
    {name: 'pixiv series',
        url: /^https?:\/\/www\.pixiv\.net\/user\/\d+\/series/i,
        nextLink: '//a[@rel="next"]',
        siteExample: 'https://www.pixiv.net/user/10232794/series/12174',
        pageElement: '//div[@class="works"]/*',
        created_by: 't_f_m',
        resource_url: 'http://wedata.net/items/81754',
    },
    {name: 'ニコニコニュース 個別記事',
        url: '^https?://news\.nicovideo\.jp/watch/',
        nextLink: '//a[@rel="next"]',
        siteExample: 'http://news.nicovideo.jp/watch/nw3519966',
        pageElement: '//nav[@class="pagination"][1]/preceding-sibling::*',
        created_by: 't_f_m',
        resource_url: 'http://wedata.net/items/81744',
    },
    {name: 'Kambikuttan',
        url: '^https?://kambikuttan\.net/*/*',
        nextLink: '//div[@class="page-nav"]/span[2]/following::a[1]',
        siteExample: 'http://kambikuttan.net/chilanthivala-part-23/',
        pageElement: '//article/div/div/p',
        created_by: 'MrMallu',
        resource_url: 'http://wedata.net/items/81427',
    },
    {name: 'rarbg',
        url: '^https?://(proxy)?rarbg(mirror|proxy|to|2018)?\.(to|net|org)/',
        nextLink: '//a[@title="next page"]',
        siteExample: 'https://rarbg.to/torrents.php?category=movies',
        pageElement: '//table[@class="lista2t"]/tbody/tr[td/@class="lista"]',
        created_by: 'C2f56gyhtu75347u8i9i7uit4d4g58',
        resource_url: 'http://wedata.net/items/77608',
    },
    {name: 'Screen Rant',
        url: '^https?://screenrant\.com/.+',
        nextLink: '//*[@rel="next"]',
        siteExample: 'http://screenrant.com/most-powerful-dc-comic-superheroes http://screenrant.com/fantastic-four-movie-rights-fox-marvel-studios-2015/2/ https://screenrant.com/movies-didnt-know-had-post-credits-scenes/4/?view=lista',
        pageElement: '//div[@itemprop="articleBody"]/div[@class="wp-pagenavi"]/preceding-sibling::*[not(self::h3)]|//div[@class="art-body-content"]/div[@class="w-sharing sharing-bottom"]/preceding-sibling::*[not(@class="next-btn icon i-arrow-2")]',
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/77441',
    },
    {name: '麻雀ウォッチ　ネマタの戦術本レビュー',
        url: '^https?://mj-news\.net/column/nemata-review/',
        nextLink: '//li[@class="left"]/a[contains(text(),//meta[@name="keywords"]/@content)]',
        siteExample: 'https://mj-news.net/column/nemata-review/20180611102181',
        pageElement: '//div[@class="entry entry-content"]/h3[1]/preceding-sibling::*',
        created_by: 'jigendaddy_be',
        resource_url: 'http://wedata.net/items/77310',
    },
    {name: 'PMC Brands',
        url: '^https?://.*(?:bgr|bollywoodlife|deadline)\.com/',
        nextLink: '//a[@class="next page-numbers"]|//div[@class="alignright"]/a',
        siteExample: 'http://bgr.com/;https://www.deadline.com/;https://deadline.com/v/awards/page/2;http://www.bollywoodlife.com/',
        pageElement: '//div[starts-with(@class,"row content-section")][div//article]|//*[contains(@id,"content")]//*[(contains(@id,"post-") and not(//div[@class="hl-post"])) or self::div[@class="hl-post"]/div[contains(@id,"post-")]]',
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/74923',
    },
    {name: 'Cheat Sheet',
        url: '^https?://(www\.)?cheatsheet\.com/',
        nextLink: '//link[@rel="next"][//span/@class="next-btn__counter"]',
        siteExample: 'https://www.cheatsheet.com/entertainment/scarlett-johansson-pushes-her-limits-with-4-non-human-roles.html/;https://www.cheatsheet.com/entertainment/5-new-shows-fox-will-try.html/?ref=YF;https://www.cheatsheet.com/category/business-news/page/2/',
        pageElement: '//div[@class="main__content"]/section|//ul/li[@class="media-list__item"][.//a]',
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/74735',
    },
    {name: 'Cinemablend.com',
        url: '^https?://(www\.)?cinemablend\.com/',
        nextLink: '//a[@class="next" or @rel="next"]',
        siteExample: 'https://www.cinemablend.com/new/Top-25-Muppet-Characters-Ranked-28058.html;https://www.cinemablend.com/news/1523429/upcoming-pixar-movies-heres-whats-coming-in-the-next-few-years?story_page=2;https://www.cinemablend.com/news.php?cid=27;https://www.cinemablend.com/reviews/;https://www.cinemablend.com/news/2313241/the-8-funniest-moments-in-black-panther?story_page=1;https://www.cinemablend.com/television/2425292/who-is-the-flashs-thomas-our-5-best-theories?story_page=1',
        pageElement: '//div[@class="partial content_story_pages_html "]/node()|(id("slot_left slot_center")|id("slot_left")/div[starts-with(@class,"partial content_story_cb_related ") or @class="partial snippet "])/div[starts-with(normalize-space(@class),"story_item item") or @class="partial content_story_pages_text " or @class="partial content_story_pages_image "]|//div[@class="partial content_story_cb_related topics" or @class="partial content_story_cb_related reviews"]/*',
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/74662',
    },
    {name: 'Togetter 個別記事',
        url: '^https?://togetter\.com/li/',
        nextLink: '//link[@rel="next"]',
        siteExample: 'https://togetter.com/li/351535;https://togetter.com/li/1060348?page=38',
        pageElement: '//div[@class="tweet_box"]/div',
        created_by: 't_f_m',
        resource_url: 'http://wedata.net/items/62666',
    },
    {name: 'pixivrank.net',
        url: '^http://pixivrank\.net/',
        nextLink: '//b/following-sibling::a[1]',
        siteExample: 'http://pixivrank.net/ht/tag2/p1.html http://pixivrank.net/taglist1_1.html',
        pageElement: '//img[not(@alt)]/ancestor::table[1][not(@class="main_table")]//tr[./td]|//div[@class="tag_box"]',
        created_by: 'gorou',
        resource_url: 'http://wedata.net/items/32021',
    },
    {name: 'ダイヤモンド・オンライン',
        url: '^https?://diamond\.jp/articles/',
        nextLink: '//li[@class="next"]/a|//div[@class="next_p" or @class="next-p"]/a|//span[@class="next_p-top"]/a',
        siteExample: 'http://diamond.jp/articles/-/4654;http://diamond.jp/articles/-/9425;http://diamond.jp/articles/-/56364;http://diamond.jp/articles/-/61133;http://diamond.jp/articles/-/61359;http://diamond.jp/articles/-/61436;http://diamond.jp/articles/-/27195;http://diamond.jp/articles/-/61318;http://diamond.jp/articles/-/59516;http://diamond.jp/articles/-/28112;http://diamond.jp/articles/-/79610;http://diamond.jp/articles/amp/4654',
        pageElement: '//div[@class="article-body cf"]/*|//div[@id="mp-ie" or @id="multipage-top"][./preceding-sibling::p]/preceding-sibling::*[not(contains(@class,"smartparts-info") or @class="contents-info clearfix")]',
        created_by: 'hidebu',
        resource_url: 'http://wedata.net/items/31984',
    },
    {name: '[pixiv] ランキング',
        url: '^https?://www\.pixiv\.net/ranking_log\.php',
        nextLink: '//div[contains(concat(" ", @class, " "), " calendar-selector ")]//li[a[contains(concat(" ", @class, " "), " active ")]]/preceding::li[position()=1 and ancestor::div[contains(concat(" ", @class, " "), " calendar-selector ")]]/a',
        siteExample: 'http://www.pixiv.net/ranking_log.php',
        pageElement: '//table[contains(concat(" ", @class, " "), " calender_ranking ")]/..',
        created_by: 'deraw',
        resource_url: 'http://wedata.net/items/26720',
    },
    // update at: May 28, 2018
    {name: 'ツイキャス',
        url: '^https://twitcasting\.tv/',
        nextLink: '//div[@class="paging"][1]/a[@class="selected"]/following-sibling::a[1]',
        siteExample: 'https://twitcasting.tv/shop.php',
        pageElement: '//div[contains(@class,"recorded-movie-box")] | //table[contains(@class,"listtable")] | id("community-list")',
        created_by: 'phodra725',
        resource_url: 'http://wedata.net/items/81751',
    },
    {name: 'forumhouse.ru',
        url: '^https://www\.forumhouse\.ru/threads/\d+/print.*',
        nextLink: '//nav/a[text()="Вперёд >"]',
        siteExample: 'https://www.forumhouse.ru/threads/170982/print?pp=100',
        pageElement: '//ol[@class="messageList"]',
        created_by: 'Rom',
        resource_url: 'http://wedata.net/items/81750',
    },
    {name: 'Amazon Smile',
        url: '^https?://smile\.amazon\.(?:c(?:a|n|o(?:m|\.(?:jp|uk)))|de|fr)/(?:[^/]+/)?(?:[bes]|(?:gp|exec/obidos)/(search|aag))',
        nextLink: 'id("pagnNextLink")|//a[@class="next-button-link"]',
        siteExample: 'http://smile.amazon.co.jp/s/?field-keywords=windows http://smile.amazon.co.jp/s/?url=search-alias%3Dtoys&field-keywords=lego http://smile.amazon.co.jp/s/rh=n%3A13299531 http://smile.amazon.co.jp/exec/obidos/search-handle-url?_encoding=UTF8&search-type=ss&index=books-jp&field-author=%E6%9D%91%E4%B8%8A%20%E6%98%A5%E6%A8%B9 http://smile.amazon.co.jp/gp/search/rh=k%3A%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%2Ci%3Avideogames&keywords=%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3 http://smile.amazon.co.jp/b?ie=UTF8&node=2515445051 http://smile.amazon.co.jp/%E6%A9%99%E4%B9%83-%E3%81%BE%E3%81%BE%E3%82%8C/e/B006AIETUI/ http://smile.amazon.com/gp/aag/main?ie=UTF8&seller=AGHVE2KVOZA3D http://smile.amazon.co.jp/s/ref=lp_3452196051_pg_2?rh=n%3A2250738051%2Cn%3A!2275265051%2Cn%3A!2275277051%2Cn%3A3452196051&page=2&ie=UTF8&qid=1438764067',
        autopager:{
            pageElement: 'id("rightResults atfResults btfResults mainResults Results sparseWrapper")[not(//link[@rel="canonical"][contains(@href,"page")])]//*[starts-with(@id,"result_")]|//li[@class="shoveler-cell"]|id("resultsCol")[//link[@rel="canonical"][contains(@href,"page")]]',
            stylish: '@-moz-document url-prefix("http://www.amazon.co.jp/") { ul.s-result-list p.autopagerize_page_info{ letter-spacing:normal !important;} } @-moz-document url-prefix("http://www.amazon.co.jp/s/?rh"), url-prefix("http://www.amazon.co.jp/s/ref=sr_pg_1") { .autopagerize_page_separator~#resultsCol .s-result-item{ display: inline-block; border-top: 1px solid #DDD; padding-top:10px; } .autopagerize_page_separator~#resultsCol .a-fixed-left-grid-inner{ padding-left: 120px !important; } .autopagerize_page_separator~#resultsCol .a-fixed-left-grid-inner a h2{ font-weight:bold !important; font-size: 1.25em; } .autopagerize_page_separator~#resultsCol .med { font-size: 1.2em; } .autopagerize_page_separator~#resultsCol .a-icon-alt{ display:none; } }',
        },
        created_by: 'blacklcm2',
        resource_url: 'http://wedata.net/items/81749',
    },
    {name: 'Wine Application Database',
        url: '^https://appdb\.winehq\.org/',
        nextLink: '//div[@class="text-center"]/button/following-sibling::a[1]',
        siteExample: 'https://appdb.winehq.org/objectManager.php?sClass=application',
        pageElement: '//table[contains(@class, "whq-table-full")]/tbody/tr',
        created_by: 'Narju',
        resource_url: 'http://wedata.net/items/81748',
    },
    {name: 'FFXIV lodestone - Ranking',
        url: '^https?://(?:jp|na|eu|fr|de)\.finalfantasyxiv\.com/lodestone/ranking',
        nextLink: '//div[@class="pager"]//li[@class="next"]/a',
        siteExample: 'https://na.finalfantasyxiv.com/lodestone/ranking/fc/weekly/201820/?page=4&filter=1&gcid=1&worldname=Hades, https://jp.finalfantasyxiv.com/lodestone/ranking/gc/weekly/',
        pageElement: '//ol[@class="list_ranking"]/li',
        created_by: 'Narju',
        resource_url: 'http://wedata.net/items/81747',
    },
    {name: 'JavArchive.com',
        url: '^http://javarchive\.com/category/',
        nextLink: '//*[@id="post-navigator"]/div/strong[@class="current"]/following::a[1]',
        siteExample: 'http://javarchive.com/category/av-censored/',
        pageElement: '//*[@id="contentinner"]',
        created_by: 'tigerjanus',
        resource_url: 'http://wedata.net/items/81746',
    },
    {name: '51JAV.ORG',
        url: '^https?://51jav\.org/',
        nextLink: '//a[text()="Next page »"]',
        siteExample: 'http://51jav.org/',
        pageElement: '//div[@id="content"]',
        created_by: 'kissmekissu',
        resource_url: 'http://wedata.net/items/81745',
    },
    {name: 'ニコニコニュース 個別記事',
        url: '^https?://news\.nicovideo\.jp/watch/',
        nextLink: '//a[@rel="next"]',
        siteExample: 'http://news.nicovideo.jp/watch/nw3519966',
        pageElement: '//article[contains(concat(" ",@class," ")," news-article-body ")]',
        created_by: 't_f_m',
        resource_url: 'http://wedata.net/items/81744',
    },
    {name: 'JavStore',
        url: '^http://javstore\.net/',
        nextLink: '//a[(text()="[>]")]',
        siteExample: '',
        pageElement: '//div[@class="category_news news_1n"]',
        created_by: 'anthony44',
        resource_url: 'http://wedata.net/items/81743',
    },
    {name: 'Pornenergy.net',
        url: '^http://pornenergy\.net/',
        nextLink: '//a[text()="Forward"]',
        pageElement: '//div[@id="dle-content"]',
        created_by: 'kissmekissu',
        resource_url: 'http://wedata.net/items/81742',
    },
    {name: 'スポーツナビ 写真・動画・コラム一覧',
        url: '^https?://(soccer|baseball|sports)\.yahoo\.co\.jp/(video|column)|^https?://(soccer|baseball|sports)\.yahoo\.co\.jp/.+/photos',
        nextLink: '//a[(text()="次へ")]',
        siteExample: 'https://sports.yahoo.co.jp/boatrace/photos/list/ https://sports.yahoo.co.jp/video/list/?query=%E3%83%90%E3%82%B9%E3%82%B1%E3%83%83%E3%83%88　https://sports.yahoo.co.jp/column/list?category=/soccer&id=/japan',
        pageElement: '//ul[contains(@class,"glanceArticleBox")]',
        created_by: 'jigendaddy_be',
        resource_url: 'http://wedata.net/items/81741',
    },
    {name: '節約プリンスためるくん | マイナビニュース',
        url: '^https://news\.mynavi\.jp/article/tamerukun',
        nextLink: '//a[@rel="next"]|//tr[./th[contains(@class,"table__th--current")]]/preceding-sibling::tr[1]//a',
        siteExample: 'https://news.mynavi.jp/article/tamerukun-97/',
        pageElement: '//div[@class="article-header"]|//ul[@class="photo_table"][not(.//img[contains(@src,"/tameru.jpg")])]',
        created_by: 'jigendaddy_be',
        resource_url: 'http://wedata.net/items/81740',
    },
    {name: 'jser.info/',
        url: '^https://jser\.info/',
        nextLink: '//div[@class="pagination"]/a[@class="next"]',
        siteExample: 'https://jser.info/page/2/',
        pageElement: '//div[@class="home"]/section',
        created_by: 'Narju',
        resource_url: 'http://wedata.net/items/81739',
    },
    {name: 'SexyVideos',
        url: '^http://www\.sexyvideos\.co/',
        nextLink: '//a[text()="Next"]',
        siteExample: 'http://www.sexyvideos.co/',
        pageElement: '//div[@id="dle-content"]',
        created_by: 'kissmekissu',
        resource_url: 'http://wedata.net/items/81737',
    },
    {name: 'マイナビウーマン',
        url: '^https?://woman\.mynavi\.jp/',
        nextLink: '//link[@rel="next"]',
        siteExample: 'http://woman.mynavi.jp/tag/rensai_oikomi/ http://woman.mynavi.jp/renai/couple/ http://woman.mynavi.jp/kosodate/',
        pageElement: '//li[@class="new-articles-item"]|//div[@class="article-list"]|//div[@class="article-list"]/following-sibling::hr',
        created_by: 'jigendaddy_be',
        resource_url: 'http://wedata.net/items/77487',
    },
    {name: 'スポーツナビ　コラム本文',
        url: '^https://sports\.yahoo\.co.jp/(column|sports)',
        nextLink: '//a[(text()="次へ") or (text()="次 »")]',
        siteExample: 'http://sports.yahoo.co.jp/column/detail/201507310001-spnavi;http://sports.yahoo.co.jp/sports/soccer/eusoccer/1516/columndtl/201507310001-spnavi',
        pageElement: '//*[@class="mod-content" or @class="newsList" or @class="modBody"]',
        created_by: 'hohoho',
        resource_url: 'http://wedata.net/items/76259',
    },
    {name: 'TOCANA',
        url: '^https?://tocana\.jp/',
        nextLink: 'id("pageNav")/ul/li[@class="current"]/following-sibling::li/a',
        siteExample: 'http://tocana.jp/2014/04/post_4045_entry.html;http://tocana.jp/contribute/;http://tocana.jp/2015/06/;http://tocana.jp/2016/02/post_8987_entry.html',
        autopager:{
            pageElement: 'id("entryBody")/*[//meta[@property="og:url"][contains(@content,"post")]]|id("pageNav")/preceding-sibling::*[not(@id="categoryTitle")][//meta[@property="og:url"][not(contains(@content,"post"))]]',
            stylish: '@-moz-document url-prefix("http://tocana.jp/") { #archive{height:auto !important;}; }',
        },
        created_by: 'terepandasan',
        resource_url: 'http://wedata.net/items/74812',
    },
    {name: 'IMDB search',
        url: '^https://(www\.)?imdb\.com/search/',
        nextLink: '//a[@class="lister-page-next next-page"]',
        siteExample: 'https://www.imdb.com/search/title?genres=sci_fi&title_type=feature&num_votes=1000,&sort=user_rating,desc',
        pageElement: '//div[@class="lister-list"]/*',
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/74724',
    },
    {name: 'IMDB coming soon',
        url: '^https://(www\.)?imdb\.com/movies-coming-soon',
        nextLink: '//a[.="Next"]',
        siteExample: 'https://www.imdb.com/movies-coming-soon/',
        pageElement: '//div[@class="list detail"]',
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/74673',
    },
    {name: 'Cinemablend.com',
        url: '^https?://(www\.)?cinemablend\.com/',
        nextLink: '//a[@class="next" or @rel="next"]',
        siteExample: 'https://www.cinemablend.com/new/Top-25-Muppet-Characters-Ranked-28058.html;https://www.cinemablend.com/news/1523429/upcoming-pixar-movies-heres-whats-coming-in-the-next-few-years?story_page=2;https://www.cinemablend.com/news.php?cid=27;https://www.cinemablend.com/reviews/;https://www.cinemablend.com/news/2313241/the-8-funniest-moments-in-black-panther?story_page=1;https://www.cinemablend.com/television/2425292/who-is-the-flashs-thomas-our-5-best-theories?story_page=1',
        pageElement: '//div[@class="partial content_story_pages_html "]/node()|(id("slot_left slot_center")|id("slot_left")/div[starts-with(@class,"partial content_story_cb_related ") or @class="partial snippet "])/div[starts-with(normalize-space(@class),"story_item item") or @class="partial content_story_pages_text " or @class="partial content_story_pages_image "]',
        created_by: 'Tanookirby',
        resource_url: 'http://wedata.net/items/74662',
    },
    {name: 'ソフトバンク ビジネス+IT',
        url: '^https://www\.sbbit\.jp/article/',
        nextLink: '//a[contains(text(),"次へ")][contains(@href,"?page=")]',
        siteExample: 'http://www.sbbit.jp/article/7481/ http://www.sbbit.jp/article/cont1/21311 http://www.sbbit.jp/article/cont1/21311?page=2 http://www.sbbit.jp/article/cont1/30551',
        pageElement: '//div[@class="ar-title-sentence"]/descendant::br[1]/ancestor::div[1]/node()|//div[@class="ar-title-sentence"]/descendant::text()[string-length(normalize-space()) > 0][1]/ancestor::div[1][./p]',
        created_by: 'taizooo',
        resource_url: 'http://wedata.net/items/63821',
    },
    {name: 'NAVER',
        url: '^https?://(comic|search|movie)\.naver\.(jp|com)/',
        nextLink: '//a[@data-na="NC:next" or contains(@class,"Next") or (.|..)/@class="next" or @class="btn_next"]|//div[@data-na="NA:pager" or contains(@class,"Pagination")]/strong/following-sibling::a[1][not(@href="#")]',
        siteExample: 'https://search.naver.com/search.naver?where=post&sm=tab_jum&query=spring;https://search.naver.com/search.naver?where=kin&query=mc%20%EB%A7%A5%20%EC%9D%B4%EB%A6%84&ie=utf8&sm=tab_nmr;http://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=pnt&date=20150320&page=3;http://comic.naver.com/webtoon/detail.nhn?titleId=670150&no=5',
        pageElement: '//div[contains(@class,"mdMTMEnd01Wrap") or @class="wt_viewer" or @class="mdMTMEnd01Item02"]|//div[contains(@class,"MdMTMWidgetList01")]/*|id("elThumbnailResultArea")/li|//table[@class="list_ranking"]/tbody/tr|//ul[@class="MdMTMTtlList03" or @class="mdTopMTMList01List"]/li',
        created_by: 't_f_m',
        resource_url: 'http://wedata.net/items/60489',
    },
    {name: 'hermitage akihabara',
        url: '^http://www\.gdm\.or\.jp/.',
        nextLink: '//div[@class="nextArticle"]/a | //a[contains(concat(" ", normalize-space(@class), " "), " next ")]',
        siteExample: 'http://www.gdm.or.jp/review/2014/1219/95193;http://www.gdm.or.jp/pressrelease',
        pageElement: '//div[@class="articleArea"]  | //ul[contains(concat(" ", normalize-space(@class), " "), " archive ")]',
        created_by: 'aaaa9999',
        resource_url: 'http://wedata.net/items/38732',
    },
    {name: 'Ars Technica',
        url: '^https?://arstechnica\.com/',
        nextLink: '//a[span/@class="next" or @class="left"]',
        siteExample: 'https://arstechnica.com/page/2/;https://arstechnica.com/apple/2014/11/a-power-users-guide-to-os-x-server-yosemite-edition/1/;http://arstechnica.com/staff/2016/02/mcafee-will-break-iphone-crypto-for-fbi-in-3-weeks-or-eat-shoe-on-live-tv/',
        pageElement: '//div[@itemprop="articleBody"]/*|//article/header',
        created_by: 'ku',
        resource_url: 'http://wedata.net/items/1747',
    },

    {name: 'S-KOREA',
        url: '^http://s-korea\.jp/',
        siteExample: 'http://s-korea.jp/archives/34826',
        nextLink: '//li[@class="active_page"]/following-sibling::li[1]/a',
        pageElement: '//div[@class="wp_social_bookmarking_light"]/following-sibling::*[following::div[@class="wp_page_numbers"]]',
    },
    {name: 'SexyVideos',
        url: '^http://www\\.sexyvideos\\.co/',
        siteExample: 'http://www.sexyvideos.co/',
        nextLink: '//a[text()=\"Next\"]',
        pageElement: '//div[@id=\"dle-content\"]',
    },
    {name: '7mm.tv',
        url: '^https://7mm\.tv/',
        siteExample: 'https://7mm.tv/ja/censored_list/all/1.html',
        nextLink: '//a[(text()=" Next page » ")]',
        pageElement: '//div[@class="topic_area"]',
    },
    {name: 'Porn77.Info',
        url: 'https://porn77.info/',
        siteExample: 'https://porn77.info/',
        nextLink: '//li[@class="next"]/a',
        pageElement: '//div[@class="general-pagination group"]/preceding-sibling::node()',
    },
    {name: 'HPJAV',
        url: '^https://hpjav\.com/',
        siteExample: 'https://hpjav.com/category/censored',
        nextLink: '//li[@class="active"]/following-sibling::li[1]/a',
        pageElement: '//div[@class="category-count"]/following-sibling::*[following::div[@class="models-page-box"]]',
    },
    {name: 'YouFlix',
        url: '^http://youflix\.is/',
        siteExample: 'http://youflix.is/search?word=JK',
        nextLink: '//a[@class="icon_arrow_r"]',
        pageElement: '//section[@class="content_vlist"]/div[@class="itembox"]',
    },
    {name: 'hentai-comic.com',
        url: '^https://[^/]+\.hentai-comic\.com/image/',
        siteExample: 'https://ja.hentai-comic.com/image/fct-ane-tomo-sasex/',
        nextLink: 'id("paginator")//a[.="次へ>"]',
        pageElement: 'id("display_image_detail")',
    },
    {name: 'NAVERまとめ',
        url: '^https://matome\.naver\.jp/',
        siteExample: 'https://matome.naver.jp/ https://matome.naver.jp/odai/2152474584133964301',
        nextLink: '//div[contains(@class,"MdPagination0")]/strong/following-sibling::a[1][not(@href="#")]',
        pageElement: '//li[@class="mdTopMTMList01Item"]|//div[@class="MdMTMWidgetList01"]/div',
    },
    {name: 'Guru99',
        url: '^https://(www\.)guru99\.com/.',
        siteExample: 'https://www.guru99.com/informatica-architecture-tutorial.html https://www.guru99.com/blog/page-2.html',
        nextLink: '//a[@rel="next" or ../@class="pagination-next"]',
        pageElement: '//div[@class="item-page"]/*[not(@class="pager pagenav")]|//div[@class="blog"]/div[starts-with(@class,"items-row")]',
    },
    {name: 'books and apps',
        url: '^https://blog\.tinect\.jp/',
        siteExample: 'https://blog.tinect.jp/?p=42591',
        nextLink: '//link[@rel="next"]',
        pageElement: 'id("article")',
    },
    {name: 'まんがタイムWeb　芳文社　｜　新刊予定　｜　年別発売予定コミックス',
        url: '^http://www\.manga-time\.com/comics/',
        siteExample: 'http://www.manga-time.com/comics/li_2017_2.html',
        nextLink: '//*[@id="searchc"]/div[last()]/ul/li[./img]/preceding-sibling::li[1]/a',
        pageElement: '//div[@id="searchc"]/*[self::div[@class="rmid"] or self::div[@class="listc"]]',
    },
    {name: 'まんがタイムきらら - 既刊ラインナップ - まんがタイムきららWeb',
        url: '^http://www\.dokidokivisual\.com/comics/past/',
        siteExample: 'http://www.dokidokivisual.com/comics/past/?tp=release&pn=2',
        nextLink: '//*[@id="contents"]/div[last()]/div[@class="s-right"]/ul/li[./span]/following-sibling::li[1]/a',
        pageElement: '//div[@id="contents"]/*[self::h2[@class="date-title"] or self::div[contains(concat(" ", normalize-space(@class), " "), " lineup ")]]',
    },
    {name: 'ゲームかなー　個別エントリ',
        url: '^http://blog\.gamekana\.com/archives/',
        siteExample: 'http://blog.gamekana.com/archives/9088603.html',
        nextLink: '//li[@class="prev"]/a',
        pageElement: '//div[@class="article-header"]|//div[@class="article-body-more"]/preceding-sibling::node()|id("parent-iframe2")/preceding-sibling::node()',
    },
    {name: 'ゲームかなー',
        url: '^http://blog\.gamekana\.com/',
        siteExample: 'http://blog.gamekana.com/',
        nextLink: '//a[@rel="next"]',
        pageElement: '//div[@class="article-outer hentry"][not(.//blockquote)]',
    },
    {name: 'BuddyTV',
        url: '^https?://(www\.)?buddytv\.com/',
        siteExample: 'http://www.buddytv.com/ http://www.buddytv.com/news.aspx',
        nextLink: '//a[@rel="next"]|id("ctl00_MainContentPlaceHolder_blogNextLink")',
        pageElement: 'id("feed-container")/*|//div[@class="news-blog-unit"]',
    },
    {name: 'Mental Floss',
        url: '^https?://mentalfloss\.com/section/',
        siteExample: 'http://mentalfloss.com/section/lists?page=3',
        nextLink: 'id("next-button")',
        pageElement: '//div[@class="row section-page-top-articles" or @class="section-page-articles-list"]',
    },
    {name: 'Life Death Prizes',
        url: '^https?://(www\.)?lifedeathprizes\.com/.',
        siteExample: 'http://www.lifedeathprizes.com/reallife http://www.lifedeathprizes.com/lists',
        nextLink: '//a[@class="nextpostslink"]',
        pageElement: '//div[@class="main-loop-wraper"]/*',
    },
    {name: 'みんなのPython Webアプリ編',
        url: '^https://coreblog\.org/ats/stuff/minpy_web/',
        siteExample: 'https://coreblog.org/ats/stuff/minpy_web/01/',
        nextLink: '//div[@class="page_nav"]/span[@class="next"]/a',
        pageElement: 'id("content")/div',
    },
    {name: 'twilog ユーザー一覧',
        url: '^http://twilog\.org/user-list/',
        siteExample: 'http://twilog.org/user-list/221',
        nextLink: 'id("content")/ul/li[@class="current"]/following-sibling::li/a',
        pageElement: 'id("content")/section/ul/li',
    },
    {name: 'メンヘラ.jp',
        url: '^http://menhera\.jp/',
        siteExample: 'http://menhera.jp/',
        nextLink: '//a[@rel="next"]',
        pageElement: '//div[@class="media"]',
    },
    {name: 'GreenSnap（グリーンスナップ）',
        url: '^https://greensnap\.jp/category',
        siteExample: 'https://greensnap.jp/category2/11/post/list',
        nextLink: '//link[@rel="next"]',
        pageElement: '//section[contains(@class, "PostBox")]/div',
    },
    {name: 'GitHub releases next pages.',
        url: 'https?://github.com/.*/.*/releas.*?',
        siteExample: 'https://github.com/BladeMight/Mahou/releases',
        nextLink: '//div[@class="pagination"]/a[text()="Next"]',
        pageElement: '//div[@class="position-relative border-top"]',
    },
    {name: 'THE ZERO/ONE',
        url: '^https://the01\.jp/',
        siteExample: 'https://the01.jp/p0004056/',
        nextLink: '//link[@rel="next"]',
        pageElement: 'id("container")/section/article',
    },
    {name: 'Bells of Hermitage～エルミタージュの鐘～',
        url: '^http://hermitage-netaudio\.com/',
        siteExample: 'http://hermitage-netaudio.com/lan-category8/',
        nextLink: '//div[@class="page-link"]/span/following-sibling::a[1]',
        pageElement: 'id("widget-in-article")/preceding-sibling::*|id("widget-in-article")/following-sibling::*',
    },
    {name: 'Atom.io Package Search',
        url: '^https?://atom\.io/(?:(?:package|theme)s/)?search',
        siteExample: 'https://atom.io/search?commit=Search&page=2&q=highlight&utf8=✓',
        nextLink: '//a[@class="next_page"]',
        pageElement: '//div[@class="package-list"]/div/div[@class="grid-cell"]',
    },
    {name: 'エンタメステーション',
        url: '^https?://entertainmentstation\.jp/',
        siteExample: 'https://entertainmentstation.jp/157838',
        nextLink: '//link[@rel="next"]',
        pageElement: '//div[@class="media-content-detail"]/*',
    },
    {name: 'Deskgram',
        url: 'https?://deskgram.org/*',
        siteExample: 'http://deskgram.org/instagram',
        nextLink: '//div[@id="loadmoreimg"]/a',
        pageElement: '//div[@id="posts-container"]',
    },
    {name: 'HicceArs',
        url: '^https?://hiccears\.com/index\.php',
        siteExample: 'https://hiccears.com/index.php?page=1&tab=1',
        nextLink: '//ul[@class="pagination"]/li[@class="active"]/following-sibling::li/a',
        pageElement: '//div[@id="latest"]/div[@class="panel-body"]',
    },
    {name: 'Standard News',
        url: '^https?://standardnews\.com/.',
        siteExample: 'http://standardnews.com/characters-brought-save-tv-shows/1/',
        nextLink: '//a[contains(@class," pagin-next-post")]',
        pageElement: '//div[@class="js-template-render"]/*[not(@class="spine-pagination-block")]',
    },
    {name: 'ミッドナイトノベルズ 検索',
        url: '^https://mid\.syosetu\.com/search/',
        siteExample: 'https://mid.syosetu.com/search/search/?word=',
        nextLink: '//div[@class="pager"]/a[starts-with(.,"Next")]',
        pageElement: 'id("search_box")/following-sibling::article',
    },
    {name: 'ノクターンノベルズ ムーンライトノベルズ 検索',
        url: '^https://(?:mnlt|noc)\.syosetu\.com/search/',
        siteExample: 'https://noc.syosetu.com/search/search/;;https://mnlt.syosetu.com/search/search/',
        nextLink: '//a[@class="nextlink"]',
        pageElement: '//div[contains(concat(" ",@class," ")," searchkekka_box ")]',
    },
    {name: 'ニュートピ！',
        url: '^https://newstopics\.jp/',
        siteExample: 'https://newstopics.jp/categories/soft',
        nextLink: '//a[@rel="next"]',
        pageElement: '//div[@class="content_inner"]//div[@class="list_item"]',
    },
    {name: 'PLOS One scientific journal',
        url: '^https?://journals\.plos\.org/plosone/browse',
        siteExample: '',
        nextLink: 'id("nextPageLink")',
        pageElement: '//*[@class="article-block"]',
    },
    {name: 'Inkbunny',
        url: '^https://inkbunny\.net/',
        siteExample: 'https://inkbunny.net/submissionsviewall.php?mode=popular&page=1&random=yes&type=&sale=',
        nextLink: '//a[@title="next page"]',
        pageElement: '//div[@class="content"]/div[starts-with( @class, "widget_thumbnail" )]',
    },
    {name: 'MdN Design Interactive 特集記事',
        url: '^https://(www\.)?mdn\.co\.jp/di/articles/',
        siteExample: 'https://www.mdn.co.jp/di/articles/3150/',
        nextLink: '//li[@class="pageNext"]/a',
        pageElement: '//div[contains(@class,"detail_block_body")]',
    },
    {name: 'voicehentai(nhentai)',
        url: '^https://www\.voicehentai\.com/',
        siteExample: 'https://www.voicehentai.com/p-1.php?nid=12233373&part=9&id=cd20ad81-a600-11e7-a20b-52540037eb09;;https://www.voicehentai.com/search.php?tags=big%20breasts',
        nextLink: '//figure/a|id("page")/a[@class="cur"]/following-sibling::a',
        pageElement: '//figure|//div[@class="row products"]/div',
    },
    {name: 'AKIBA"S GATE',
        url: '^http://www\.akibasgate\.com/',
        siteExample: 'http://www.akibasgate.com/pickup/12692',
        nextLink: '//a[span/@class="pager_next"]',
        pageElement: '//div[contains(concat(" ",@class," ")," single_content_body ")]',
    },
    {name: 'ジャンププラス 特集',
        url: '^https://sp\.shonenjump\.com/p/sp/',
        siteExample: 'https://sp.shonenjump.com/p/sp/1706/fp_interview/index2.html',
        nextLink: '//section/p[last()]/a',
        pageElement: '//section[p]',
    },
    {name: 'TOEI Animation Europe',
        url: '^https?://(www\.)?toei-animation\.com/.',
        siteExample: 'http://www.toei-animation.com/en/news http://www.toei-animation.com/en/catalog/novelties',
        nextLink: '//a[@title="Go to next page"]',
        pageElement: '//div[@class="round_top_news" or @class="round_top_allseries"]',
    },
    {name: 'Pen Online',
        url: '^https://www\.pen-online\.jp/',
        siteExample: 'https://www.pen-online.jp/feature/culture/satoshi-ogawa/1/',
        nextLink: '//ul[@class="pager"]/li[@class="pager-current"]/following-sibling::li/a',
        pageElement: '//div[@class="article_body"]',
    },
    {name: 'Funimation',
        url: '^https://(www\.)?funimation\.com/.',
        siteExample: 'https://www.funimation.com/shop/whats-new/ https://www.funimation.com/forum/category/380/funimation-general https://www.funimation.com/forum/topic/4752/official-forum-spam-troll-reporting-thread https://www.funimation.com/shows/all-shows/ https://www.funimation.com/genre/actionadventure/ https://www.funimation.com/shows/popular/ https://www.funimation.com/shop/pre-orders/ https://www.funimation.com/shop/home-video/ https://www.funimation.com/shop/accessories/ https://www.funimation.com/shop/figures-collectibles/ https://www.funimation.com/shop/apparel/ https://www.funimation.com/shop/toys-games/ https://www.funimation.com/shop/home-decor/ https://www.funimation.com/shop/sale/',
        nextLink: '//li[@class="active" or @class="page active"]/following-sibling::li[1]/a',
        pageElement: '//div[@class="product-list row3 evenSpacedColumns"]|//ul[@class="topic-list" or @class="posts"]/li',
    },
    {name: 'ボードゲームリサイクルCUBE　ブログ',
        url: 'http://boardgamecube.com/blog/',
        siteExample: '',
        nextLink: '//span[@class="previous-entries"]/a',
        pageElement: 'id("content")/article',
    },
    {name: 'カナウ',
        url: '^https://www\.the-uranai\.jp/',
        siteExample: 'https://www.the-uranai.jp/column/marriage/ha-chu01/?pn=1',
        nextLink: '//span[@class="page-numbers current"]/following-sibling::a[1]',
        pageElement: '//div[@class="content"]/p',
    },
    {name: 'Danbooru posts',
        url: '^https?://danbooru\.donmai\.us/posts/[1-9]',
        siteExample: 'https://danbooru.donmai.us/posts/1276468?tags=namori https://danbooru.donmai.us/posts/1276468?pool_id=6127 https://danbooru.donmai.us/posts/2873461',
        nextLink: '//h1/a',
        pageElement: 'id("page-footer")/span',
    },
    {name: 'ORICON NEWS フォトギャラリー（画像まとめ）',
        url: '^http://www\.oricon\.co\.jp/photo/[0-9]+/[0-9]+/$',
        siteExample: 'http://www.oricon.co.jp/photo/2380/145854/',
        nextLink: '//a[contains(@class, "main_photo_next")]',
        pageElement: '//div[@class="main_photo_image"]',
    },
    {name: 'Danbooru',
        url: '^https?://danbooru\.donmai\.us',
        siteExample: 'https://danbooru.donmai.us/posts;;https://danbooru.donmai.us/posts?tags=namori;;https://danbooru.donmai.us/posts/1276468?tags=namori;;https://danbooru.donmai.us/posts/1276468?pool_id=6127;;https://danbooru.donmai.us/comments;;https://danbooru.donmai.us/comments?commit=Search&group_by=comment&search[post_tags_match]=namori;;https://danbooru.donmai.us/notes;;https://danbooru.donmai.us/notes?commit=Search&search[post_tags_match]=namori;;https://danbooru.donmai.us/note_versions;;https://danbooru.donmai.us/artists;;https://danbooru.donmai.us/tags;;https://danbooru.donmai.us/pools;;https://danbooru.donmai.us/pools/gallery;;https://danbooru.donmai.us/pools/3986;;https://danbooru.donmai.us/forum_topics;;https://danbooru.donmai.us/forum_topics/9127;;https://danbooru.donmai.us/forum_posts?search[body_matches]=foo',
        nextLink: '//a[contains(@*,"next")]',
        pageElement: '//div[@id="posts"] | //div[starts-with(@id,"a-")]/*[@class="striped" or (contains(@class,"post") and not(contains(@class,"posts"))) or self::section and count(@*)=0]',
    },
    {name: 'HawtCelebs',
        url: '^https?://(www\.)?hawtcelebs\.com/',
        siteExample: 'http://www.hawtcelebs.com/ http://www.hawtcelebs.com/category/eva-longoria/',
        nextLink: '//a[@rel="next"]',
        pageElement: 'id("content")/div[not(div/@class="breadcrumb")][following-sibling::div/div/@class="pagenavi"]',
    },
    {name: '不可解・不思議体験まとめサイト【エニグマ】',
        url: '^http://enigma2\.ahoseek\.com/categories/',
        siteExample: 'http://enigma2.ahoseek.com/categories/memory/4665/',
        nextLink: 'id("site-title")/a',
        pageElement: 'id("copyright")',
    },
    {name: 'Aging Style',
        url: '^http://www\.agingstyle\.com/',
        siteExample: 'http://www.agingstyle.com/medical/',
        nextLink: '//span[@class="current"]/following-sibling::a[1]',
        pageElement: '//ul[@class="category-entry-list"]/li',
    },
    {name: 'zerochan.net',
        url: '^https?://www\.zerochan\.net/',
        siteExample: 'https://www.zerochan.net/?s=fav;;https://www.zerochan.net/Mobile+Wallpaper',
        nextLink: '//a[@rel="next"]',
        pageElement: 'id("thumbs2")/li',
    },
    {name: 'eorzeacollection',
        url: '^https?://ffxiv\.eorzeacollection\.com/glamours',
        siteExample: 'https://ffxiv.eorzeacollection.com/glamours',
        nextLink: 'id("list-result")/div/a[last()]',
        pageElement: '//div[contains(@class, "gearset-grid")]/a',
    },
    {name: '漫画家 山田玲司 公式サイト',
        url: '^http://yamada-reiji\.com/',
        siteExample: 'http://yamada-reiji.com/news',
        nextLink: '//a[@rel="next"]',
        pageElement: '//div[@class="entrylist"]//li',
    },
    {name: 'Mirsoft.info',
        url: '^https?://(www\.)?mirsoft\.info/',
        siteExample: 'http://www.mirsoft.info/ http://www.mirsoft.info/index.php http://www.mirsoft.info/gamemods-archive.php?order=timestamp&order_desc=1 http://www.mirsoft.info/gamemods-archive.php',
        nextLink: '//div/a[i]/following-sibling::a[1]',
        pageElement: '//span[@class="normal"]/*[not(self::h1)][not(//table/@class="bordered")]|//tr[@class="whitetext"]/following-sibling::tr[td/@class]',
    },
    {name: 'Fundusze Europejskie - search engine',
        url: '^https?://www\.funduszeeuropejskie\.gov\.pl/wyszukiwarka/.*',
        siteExample: 'http://www.funduszeeuropejskie.gov.pl/wyszukiwarka/mikro-male-i-srednie-przedsiebiorstwa/#/strona=5/3756=Mikro,%20ma%C5%82e%20i%20%C5%9Brednie%20przedsi%C4%99biorstwa',
        nextLink: '//*[@id="nextPage"]',
        pageElement: '//*[@id="grants-list"]',
    },
    {name: 'white BBS',
        url: 'https://bbs.forestofbreast.com/*/*',
        siteExample: '',
        nextLink: '//a[(text()="Next>>")]',
        pageElement: '//main',
    },
    {name: '小説家になろう old format for web archive ( ~ 2017/08/21)',
        url: '^https?://web\.archive\.org/web/\d+/(?:https?://)?(?:mnlt|n(?:code|ovel18))\.syosetu\.com/',
        siteExample: 'http://web.archive.org/web/20160321184606/ncode.syosetu.com/n2251cd/29/',
        nextLink: '//div[@class="novel_bn"]/a[contains(.,"次の話")]',
        pageElement: 'id("novel_color")/*[@class="novel_subtitle" or @id="novel_p" or @id="novel_a" or @id="novel_honbun"]',
    },
    {name: 'nudecollect',
        url: 'http://www.nudecollect.com/*',
        siteExample: '',
        nextLink: '//a[@rel="next"]',
        pageElement: '//div[@id="the_page"]',
    },
    {name: 'Daily Haha',
        url: '^https?://(www\.)?dailyhaha\.com',
        siteExample: 'http://www.dailyhaha.com',
        nextLink: '//a[@class="pages next"]',
        pageElement: '//div[@class="grid"]/a',
    },
    {name: 'ahri8',
        url: 'http://www\.ahri8\.com/readOnline2\.php',
        siteExample: 'http://www.ahri8.com/readOnline2.php?ID=28303&host_id=0&page=2',
        nextLink: '//div[@id="next_page_btn_area2"]/div/input[@value="下一頁"]',
        pageElement: '//div[@id="show_image_area"]',
    },
    {name: 'Planetemu.net',
        url: '^http://(www\.)?planetemu\.net/roms/.*',
        siteExample: 'http://www.planetemu.net/roms/nintendo-nes?screenshots=true&page=0',
        nextLink: '(//a[@class="next"])[2]',
        pageElement: '//table[@class="screenshots"]',
    },
    {name: 'Wisdom NEC',
        url: /^https?:\/\/wisdom\.nec\.com\/ja\/\w+\/\d+/i,
        siteExample: 'https://wisdom.nec.com/ja/local/2017042701/index.html',
        nextLink: '//li[@class="linkNext"]/a',
        pageElement: 'id("main")/article/section',
    },
    {name: 'ペイント漫画保管庫',
        url: '^http://paintmanga\.web\.fc2\.com/',
        siteExample: 'http://paintmanga.web.fc2.com/original_manga/002free/f01.htm http://paintmanga.web.fc2.com/original_manga/002free/f201.html http://paintmanga.web.fc2.com/original_manga/003crime/cm01.htm',
        nextLink: '//a[contains(@href,concat(number(substring-after(//title,"日常"))+1,".htm"))][last()]',
        pageElement: 'descendant::table[1]//tr',
    },
    {name: 'ルビンの壺が割れた',
        url: '^http://www\.shinchosha\.co\.jp/rubin/text/',
        siteExample: 'http://www.shinchosha.co.jp/rubin/text/page_01.html',
        nextLink: '//a[contains(.,"次へ")]',
        pageElement: '//article/div[@class="fa-contents__inner"]',
    },
    {name: '株センサー',
        url: '^http://kabusensor\.com/',
        siteExample: 'http://kabusensor.com/signal/kai/?t_cd=9&s_cd=2&mk=3',
        nextLink: '//li[@class="active"]/following-sibling::li[1]/a',
        pageElement: 'id("cancel")/div',
    },
    {name: '同人誌まとめ',
        url: '^https?://(?:absoku072|(?:doujin-|kairaku)doujin|kichikuou|moeshunga|ore-nijigazo|dechamora|doujinland|eromanstation|hentaisokuhou)\.(?:com|net|info)',
        siteExample: 'http://absoku072.com/ http://kichikuou.com/ http://kairakudoujin.net/ http://moeshunga.com/ http://ore-nijigazo.com/ http://doujin-doujin.com/ http://dechamora.com/ http://doujinland.info/ http://eromanstation.com/?s=男の娘 http://hentaisokuhou.com/',
        nextLink: '//span[@class="current"]/following::a[1]',
        pageElement: '//div[@class="entry" or @class="entry-new" or @class="entryArchive" or @class="post"][not(iframe|ul|p[@class="entry_midashi"])]|//ul[@class="article--list"]/li',
    },
    {name: 'nyaa.si',
        url: '^https?://(?:sukebei\.)?nyaa\.si/',
        siteExample: 'https://nyaa.si https://sukebei.nyaa.si/',
        nextLink: '//li[@class="active"]/following-sibling::li[1]/a',
        pageElement: '//div[@class="table-responsive"]/table[contains(@class, torrent-list)]/tbody/tr',
    },
    {name: 'miyearnZZ Labo',
        url: '^http://miyearnzzlabo\.com/archives/',
        siteExample: 'http://miyearnzzlabo.com/archives/21457',
        nextLink: 'id("site-title")/a',
        pageElement: '//div[@class="credit"]',
    },
    {name: 'Tsundora.com',
        url: '^http://tsundora\.com/',
        siteExample: 'http://tsundora.com/ http://tsundora.com/pools',
        nextLink: '//link[@rel="next"]|//li[@class="active_page"]/following-sibling::li[1]/a',
        pageElement: '//div[@class="home_tall_box"]|//div[@class="pool-archive"]//li',
    },
    {name: 'diamondblog',
        url: '^https?://www\.diamondblog\.jp/',
        siteExample: '',
        nextLink: '//div[@class="index_paging"]/a[contains(.,"次の")]',
        pageElement: '//div[@class="post_list"]/ul/li[a]',
    },
    {name: '楽天ソーシャル ニュース',
        url: '^https://socialnews\.rakuten\.co\.jp/category/all',
        siteExample: 'https://socialnews.rakuten.co.jp/category/all',
        nextLink: '//span[@class="current"]/following-sibling::a[1]',
        pageElement: '//div[@class="itemList cf"]',
    },
    {name: 'あみあみ [キャラクター＆ホビー通販]',
        url: '^http://slist\.amiami\.jp/top/search/list\?',
        siteExample: 'http://slist.amiami.jp/top/search/list?s_seriestitle_id=10373&pagemax=40',
        nextLink: '//a[contains(text(), "次へ>>")]',
        pageElement: 'id("search_table")',
    },
    {name: 'Re:CREATORS NAKED',
        url: '^https://www\.sunday-webry\.com/events/re_creators_naked/',
        siteExample: 'https://www.sunday-webry.com/events/re_creators_naked/0409/;;https://www.sunday-webry.com/events/re_creators_naked/0430/;;https://www.sunday-webry.com/events/re_creators_naked/0501/',
        nextLink: '//li[contains(concat(" ",@class," ")," is-next ")]/a',
        pageElement: '//section[@class="novelMaincontent"]/div',
    },
    {name: 'LAURIER PRESS',
        url: '^https://laurier\.press/editor/writer/iota',
        siteExample: 'https://laurier.press/editor/writer/iota?page=2',
        nextLink: '//span[@class="pager-btn pager-next"]/a',
        pageElement: '//section[div/@class="pager"]/ul[@class="lr-news"]/li',
    },
    {name: '朝日新聞&',
        url: '^http://www\.asahi\.com/and_.*/gallery/.*\.html$',
        siteExample: 'http://www.asahi.com/and_travel/gallery/20170421_el-nido/cap1_r.html;;http://www.asahi.com/and_M/gallery/20170112_ebis/2017ebisu_001.html',
        nextLink: '//a[@class="next"]',
        pageElement: 'id("MainPhotoBox")|//p[@class="PhotoCaption"]',
    },
    {name: 'タグマ！',
        url: '^http://www\.targma\.jp/.+/post[0-9]+/',
        siteExample: 'http://www.targma.jp/tetsumaga/2017/04/26/post5367/',
        nextLink: '//i[contains(concat(" ", @class, " "), " fa-chevron-circle-right ")]/..',
        pageElement: '//section[@id="post"]/p[contains(concat(" ", @class, " "), " p1 ")]',
    },
    {name: 'とらのあな通信販売',
        url: '^http://www\.toranoana\.jp/(?:bl|mailorder)/[^/]{3}/(?:(?:m_)?pagekit|keyword)/',
        siteExample: 'http://www.toranoana.jp/bl/cot/pagekit/0000/00/04/000000045387/index.html;;http://www.toranoana.jp/mailorder/cot/m_pagekit/event/allseason/genre/4015.html;;http://www.toranoana.jp/mailorder/hob/pagekit/0000/00/04/000000045305/index-0_01.html',
        nextLink: '//div[@class="current"]/following-sibling::a',
        pageElement: '//ul[contains(concat(" ", @class, " "), " imgitem_list ")]',
    },
    {name: 'fastcut records',
        url: '^https?://fastcutrecords\.com/',
        siteExample: 'http://fastcutrecords.com/?mode=cate&cbid=90531&csid=0&sort=n',
        nextLink: '//ul[@class="page"]/li[last()]/a',
        pageElement: '//div[@class="itemlist-container"]',
    },
    {name: 'bugs.freepascal.org',
        url: '^https?://(?:mantis|bugs)\.freepascal\.org',
        siteExample: '',
        nextLink: '//table[@id="buglist"]/tbody/tr[1]//a[.="Next"]',
        pageElement: '//table[@id="buglist"]/tbody/tr[@valign="top"]',
    },
    {name: 'アトラス公式サイト',
        url: '^https://www\.atlus\.co\.jp/news/',
        siteExample: 'https://www.atlus.co.jp/news/',
        nextLink: '//li[@class="page-next"]/a',
        pageElement: '//ul[@class="news-list-box"]/li',
    },
    {name: 'masaladesi.com/search.php',
        url: 'masaladesi.com/search.php?',
        siteExample: '',
        nextLink: '/descendant::a[starts-with(@title,"Next Page - Results")][1]',
        pageElement: '//table[@id="threadslist"]',
    },
    {name: 'imgsrc2',
        url: 'http://imgsrc\.ru/',
        siteExample: '',
        nextLink: '/html/body/table/tbody/tr[3]/td/center/table/tbody/tr[14]/td/a[last()]',
        pageElement: '/html/body/table/tbody/tr[3]/td/center',
    },
    {name: '独習 Scalaz | learning Scalaz',
        url: '^http://eed3si9n\.com/learning-scalaz/',
        siteExample: 'http://eed3si9n.com/learning-scalaz/index.html;;http://eed3si9n.com/learning-scalaz/7.0/',
        nextLink: '//a[contains(concat(" ",@class," "), " next ")]',
        pageElement: '//div[contains(concat(" ",@class," ")," bottom ")]/preceding-sibling::*',
    },
    {name: '朝日新聞デジタル 記事画像',
        url: '^http://www\.asahi\.com/articles/photo/',
        siteExample: 'http://www.asahi.com/articles/photo/AS20170312001726.html',
        nextLink: '//ul[@class="Navi"]/li[@class="Next"]/a',
        pageElement: '//div[@class="Image"]',
    },
    {name: '２じげんけんさく',
        url: '^http://search\.pipa\.jp/.*',
        siteExample: 'http://search.pipa.jp/?PG=3&KWD=&SID=-1',
        nextLink: '//a[text()=">"]',
        pageElement: '//ul[@class="IllsutList"]',
    },
    {name: '中原淳のグローバル人材育成を科学する',
        url: '^https?://diamond\.jp/articles/-/11',
        siteExample: 'http://diamond.jp/articles/-/114877 http://diamond.jp/articles/-/118416',
        nextLink: '//li[@class="pager_next"]/a',
        pageElement: '//div[@class="sns_box"]/preceding-sibling::*',
    },
    {name: 'エッチテレビ',
        url: '^http://sextv\.tech/',
        siteExample: '',
        nextLink: '//a[i/@class="fa fa-chevron-right"]',
        pageElement: '//div[@class="item"]',
    },
    {name: 'javmin.com',
        url: '^http://javmin\.com/',
        siteExample: '',
        nextLink: '//a[(text()="Next »")]',
        pageElement: '//div[@class="loop-content switchable-view grid-small"]',
    },
    {name: 'Nathan Johnson',
        url: 'https://fetlife.com/cities/10970/kinksters?page=1',
        siteExample: '',
        nextLink: '//*[@id="spec-hack"]/body/div[3]/div[2]/div[1]/div[2]/div/a[6]',
        pageElement: '//*[@id="spec-hack"]/body/div[3]/div[2]/div[1]/div[2]/div/em',
    },
    {name: 'PC Gamer',
        url: '^https?://(www\.)?pcgamer\.com/',
        siteExample: 'http://www.pcgamer.com/best-minecraft-mods/ http://www.pcgamer.com/news/',
        nextLink: '//a[i/@class="icon icon-arrow-right" or @rel="next"]',
        pageElement: '//div[@class="listingResults"]/*|id("article-body")/*',
    },
    {name: 'WEB asta',
        url: '^http://www\.webasta\.jp/',
        siteExample: 'http://www.webasta.jp/serial/otousan/post-184.php http://www.webasta.jp/chiefeditor/2017/02/-1.php',
        nextLink: '//li[@class="pageEjection--next btn--round"]/a',
        pageElement: '//footer[@class="profile"]/preceding-sibling::*|//article[@class="diary"]',
    },
    {name: 'FirstShowing.net',
        url: '^https?://(www\.)?firstshowing\.net/',
        siteExample: 'http://www.firstshowing.net/',
        nextLink: '//div[@class="alignright"]/a[@class="bntext"]',
        pageElement: '//div[@class="article"]',
    },
    {name: 'レポート | ニッセイ基礎研究所',
        url: '^http://www\.nli-research.co\.jp/report/',
        siteExample: 'http://www.nli-research.co.jp/report/detail/id=53766',
        nextLink: 'id("contents")//div[@class="pager"]/p[@class="page_links"]/a[@class="page"][contains(.,"»")]',
        pageElement: 'id("contents")//div[@class="section"]',
    },
    {name: 'MinecraftSix',
        url: '^https?://minecraftsix.com/.',
        siteExample: 'http://minecraftsix.com/mc/minecraft-1-11-mods/ http://minecraftsix.com/category/minecraft-maps/page/2/',
        nextLink: '//link[@rel="next"]',
        pageElement: '//div[@class="td-ss-main-content"]/div[starts-with(@class,"td_module")]',
    },
    {name: '胎界主 スクロール版',
        url: '^http://www\.taikaisyu\.com/Scroll',
        siteExample: 'http://www.taikaisyu.com/Scroll%20%2002/index.html',
        nextLink: '//p/a[contains(.,"幕目へ")]',
        pageElement: '//div/*[self::p[a or img] or self::hr]',
    },
    {name: '〇〇を応援・支持するHP',
        url: '^http://oowoouensizi\.xsrv\.jp/',
        siteExample: 'http://oowoouensizi.xsrv.jp/01/02/07/02.html',
        nextLink: '//div[@class="page"]//td[@align="right"]/a',
        pageElement: 'id("main-left")/p',
    },
    {name: 'PornFromCZ.com',
        url: '^http://pornfromcz\.com/',
        siteExample: 'http://pornfromcz.com/category/amateur/',
        nextLink: '//a[@rel="next"]',
        pageElement: '//div[@id="videos"]',
    },
    {name: 'javpink',
        url: 'http://javpink\.com/',
        siteExample: 'http://javpink.com/?cat=46',
        nextLink: '//a[@class="next"]',
        pageElement: '//div[@class="items items-col-1"]',
    },
    {name: '楽天R-DATATOOL 顧客一覧',
        url: '^https://rdatatool.rms.rakuten.co.jp/rdreport/',
        siteExample: 'https://rdatatool.rms.rakuten.co.jp/rdreport/',
        nextLink: '//b/following-sibling::a',
        pageElement: '//font[contains(@color,"#006600") or contains(@color,"#006600")]/ancestor::table[1]',
    },
    {name: 'RaCoupon',
        url: '^https://racoupon\.rakuten\.co\.jp/',
        siteExample: 'https://racoupon.rakuten.co.jp/?page=2',
        nextLink: '//a[@class="pagination__next"]',
        pageElement: 'id("couponWall")/div[contains(@class,"coupon-wall-item")][.//@class="coupon-wall-item__link "]',
    },
    {name: 'The Opera blog',
        url: '^https?://blogs\.opera\.com/',
        siteExample: 'http://blogs.opera.com/news/',
        nextLink: '//a[@class="next page-numbers"]',
        pageElement: '//div[@class="entries-list"]',
    },
    {name: 'extrafabulouscomics',
        url: '^https?://extrafabulouscomics\.com',
        siteExample: 'http://extrafabulouscomics.com/',
        nextLink: '//a[contains(@class,"previous")]',
        pageElement: 'id("comic")/*[self::img or self::a or self::iframe]',
    },
    {name: 'JustJAVHD.com',
        url: '^http://justjavhd\.com/',
        siteExample: 'http://justjavhd.com/',
        nextLink: '//a[@class="next page-numbers"]',
        pageElement: '//main[@id="main"]',
    },
    {name: 'マイナビウーマン',
        url: '^https?://woman\.mynavi\.jp/',
        siteExample: 'http://woman.mynavi.jp/tag/rensai_oikomi/ http://woman.mynavi.jp/renai/couple/ http://woman.mynavi.jp/ranking/ http://woman.mynavi.jp/article/070401-003/',
        nextLink: '//div[@class="new-articles-button"]/a|//link[@rel="next"][not(//div[@class="new-articles-button"])]',
        pageElement: '//li[@class="new-articles-item"]|//ol[@class="ranking-general-list"]/li[./article[@class="article article-ranking"]]|//div[@class="entry-pager"]/preceding-sibling::*',
    },
    {name: 'クロワッサン倶楽部',
        url: '^https://croissantclub\.magazineworld\.jp/',
        siteExample: 'https://croissant-online.jp/news/',
        nextLink: '//div[@class="nav-next"]/a[not(@rel)]',
        pageElement: '//div[@class="article-list infinity"]/ul/li',
    },
    {name: 'TechFrag',
        url: '^https?://techfrag\.com/',
        siteExample: 'http://techfrag.com/',
        nextLink: '//link[@rel="next"]',
        pageElement: '//div[@class="post"]',
    },
    {name: 'UPI',
        url: '^https?://(www\.)?upi\.com/',
        siteExample: 'http://www.upi.com/Top_News/;;http://www.upi.com/search/?ss=tv&s_l=articles&offset=2187',
        nextLink: 'id("pn_arw")//td[last()]/a',
        pageElement: '//div[@class="upi_item"]',
    },
    {name: 'bootsnipp',
        url: '^https://bootsnipp\.com/',
        siteExample: 'https://bootsnipp.com/',
        nextLink: '//a[@rel="next"]',
        pageElement: '//div[@class="container"][last()]/div[@class="row"][1]/div',
    },
    {name: 'Milovana.com showtease',
        url: '^https://(www\.)?milovana\.com/webteases/showtease\.php\?id=',
        siteExample: 'https://www.milovana.com/webteases/showtease.php?id=12990',
        nextLink: 'id("continue")',
        pageElement: 'id("csl")',
    },
    {name: 'スポーツナビ　コラム本文・コラム一覧',
        url: '^https://sports\.yahoo\.co\.jp/(column|sports)',
        siteExample: 'http://sports.yahoo.co.jp/column/detail/201507310001-spnavi;;http://sports.yahoo.co.jp/sports/soccer/eusoccer/1516/columndtl/201507310001-spnavi;;http://sports.yahoo.co.jp/column/list?category=/soccer&id=/eusoccer;;http://sports.yahoo.co.jp/sports/soccer/eusoccer/column/',
        nextLink: '//a[(text()="次へ") or (text()="次 »")]',
        pageElement: '//*[@class="mod-content" or @class="newsList" or @class="modBody"]',
    },
    {name: 'pururin.us',
        url: '^https?://(?:www\.)?pururin\.us',
        siteExample: 'http://pururin.us/',
        nextLink: '//a[@rel="next"]',
        pageElement: '//*[@class="gallery-listing"]/*[@class="row"]',
    },
    {name: '青空文庫 公開中 作家リスト',
        url: '^https?://www\.aozora\.gr\.jp/index_pages/person',
        siteExample: 'http://www.aozora.gr.jp/index_pages/person_a.html;;http://www.aozora.gr.jp/index_pages/person_ka.html',
        nextLink: '//div[contains(text(),"作家リスト：公開中")]/*[@class="current"]/following-sibling::a[1]',
        pageElement: '//descendant::div[h1]/following-sibling::node()[following-sibling::div[contains(text(),"作家リスト：公開中")]]',
    },
    {name: 'forum - forumdisplay.php',
        url: '^https?://.*((f|hist)or(ums?|o|ex)(display\.php\?)?|worldwide-invest|fiuxy|eq2flames|f319\.com$)',
        siteExample: 'http://www.phoronix.com/forums/forumdisplay.php?6-Site-Discussion;;https://www.akiba-online.com/forums/technology.12/;;http://www.hongfire.com/forum/forumdisplay.php/95-The-Community-Centre;;http://candlepowerforums.com/vb/forumdisplay.php?f=45;;http://www.e-cigarette-forum.com/forum/campaigning-discussions/;;http://forums.civfanatics.com/forumdisplay.php?f=171;;http://www.neogaf.com/forum/forumdisplay.php?f=2;;http://forums.ffshrine.org/forumdisplay.php?f=72;;http://talk.maemo.org/forumdisplay.php?s=ee4ec124091a207f428ee97aaec4c4d0&f=7;;http://slickdeals.net/forums/forumdisplay.php?f=9;;http://bbs.themex.net/forumdisplay.php?f=87;;http://www.sweclockers.com/forum/2-kylning-och-overklockning-av-processorer/;;http://www.studytemple.com/forum/general-discussion/;;http://www.avsforum.com/forum/149-blu-ray-players/;;http://forum.goodservice.su/forum-27-ats-pipsovshiki/index.html;;http://www.radiumforums.com/forumdisplay.php?43-Living-Cookbook-2008-2015-Support;;http://forum.lol.garena.tw/forumdisplay.php?77-%E7%94%A2%E5%93%81%E8%B2%A0%E8%B2%AC%E4%BA%BA%E8%88%87%E5%8F%AC%E5%96%9A%E5%B8%AB%E7%9A%84%E6%84%8F%E8%A6%8B%E4%BA%A4%E6%B5%81%E5%8D%80;;http://www.donationcoder.com/forum/index.php?board=6.40;;http://forum.bongofish.co.uk/index.php?board=8.0;;http://www.thefastlaneforum.com/community/forums/forum-news-updates-faqs.18/;;http://forum.unity3d.com/forums/assets-and-asset-store.32/;;http://www.techpowerup.com/forums/forums/general-hardware.14/;;http://forum.mokkels.nl/5-nederlandse-mokkels/;;http://forum.tradelikeapro.ru/index.php?board=2.20;;http://www.donnaforex.com/index.php?board=22.0;;https://forums.comodo.com/melihs-corner-ceo-talkdiscussionsblog-b36.0/;;http://www.forodeltenis.com/index.php/board,149.0.html;;http://www.tehparadox.com/forum/f51/;;http://www.fanforum.com/f20/;;http://gbatemp.net/index.php?showforum=163;;http://forums.sherdog.com/forums/f83/;;http://www.city-data.com/forum/alabama/;;http://www.tech-forums.net/forums/f33/;;http://www.burningwheel.com/forum/forumdisplay.php?23-First-Reading-%28BW%29;;http://www.macuser.de/forum/f33/;;http://forum.xda-developers.com/htc-desire/development/page2;;http://operafan.net/forum/index.php?board=1.0;;http://www.android-hilfe.de/informationen-fuer-neue-user-vorstellungen/;;http://www.irishwebmasterforum.com/webmaster-discussion/;;http://www.webhosting.uk.com/forums/network-status/;;http://forums.redflagdeals.com/hot-deals-f9/;;http://www.gamekult.com/forum/forum-jeux-video-FO00002.html;;http://www.forex-tsd.com/metatrader-4/;;http://forum.nihonomaru.com/forum-announcements.7/;;http://worldwide-invest.org/mql-programming/;;http://f319.com/;;http://www.reteam.org/board/forumdisplay.php?f=21;;http://www.fiuxy.com/programas-gratis/index3.html;;http://historum.com/general-history/;;http://www.aquariumlife.com.au/forumdisplay.php/67-Shrimp-and-other-non-native-invertebrates?s=358e0101ab2a5a1a9af97ba2aa0581d8;;https://www.bios-mods.com/forum/Forum-Asus--57?order=asc&datecut=9999;;http://community.mybb.com/forum-127.html;;http://xnotifier.tobwithu.com/dp/forum/1;;http://www.rom.by/forum/Ishchu_proshivku;;https://forum-en.msi.com/index.php?board=16.0;;http://myanimelist.net/forum/?board=1&show=50;;http://www.eq2flames.com/general-gameplay/;;http://www.goldderby.com/forum/television/;;https://wordpress.org/support/forum/installation/page/3301/;;http://aow.triumph.net/forums/forum/discussions/balance-suggestions/;;http://forum.gamevn.com/forums/thong-bao.17/',
        nextLink: '(//link[//span/@class="scrollable"]|//a)[@rel="next" or .=">" or .="Next ›" or .="Next >"]|(//td[@class="middletext"]|//div[starts-with(@class,"pagelinks") or contains(@class,"pagesclass")]|//span[@class="di-ib"])/text()[contains(.,"]")]/following-sibling::a[1]|(//span|//a)[contains(@class,"current")]/following-sibling::a[not(@class="go_page")]|//li[starts-with(@class,"pager-next")]/a',
        pageElement: '(//tbody|//div)[starts-with(@id,"threadbit")]/*[*[contains(@id,"td_threadtitle")] or @class!="thead"][not(contains(td/div,"Sticky:") or .//img[contains(@src,"sticky") or contains(@class,"sticky")])]|//table[.//@class="middletext"]/following-sibling::div/table[@class="bordercolor"]//tr[td/@class="windowbg"]|id("topic_container")/div[@class="windowbg"]|//ol[(@id="threads" and @class="threads") or @class="discussionListItems"]/li[@id]|//div[@class="threadbit"][not(.//div[contains(.,"Sticky:")])]|id("messageindex")//tr[td/img]|//table[@class="tborder clear" or @class="table"]//tr[@class="inline_row" or @class="row forumThread"]|//table[starts-with(@id,"forum-topic") or starts-with(@class,"topic-list") or starts-with(@id,"forumTopic")]/tbody/tr[not(.//span[@class="prefix js-prefix"][contains(.,"Sticky:")] or contains(@class,"header"))]|//li[@class="bbp-body"]/*[contains(@class,"hentry")]',
    },
    {name: '楽天市場ショップ検索',
        url: '^https?://esearch\.rakuten\.co\.jp/rms/sd/esearch/',
        siteExample: 'http://esearch.rakuten.co.jp/rms/sd/esearch/vc?sv=1&f=A&g=0&v=2&e=0&p=1&s=1&oid=000&k=0&sf=1&sitem=%A1%DA%C3%E6%B8%C5%A1%DB&x=0&a=0&sf2=0',
        nextLink: '//a[b="次の30件"]',
        pageElement: '//tr[@bgcolor="#ff3300"]/following-sibling::tr',
    },
    {name: '楽天ウェブ検索（20130514頃～）',
        url: '^https?://websearch\.rakuten\.co\.jp/Web',
        siteExample: 'https://websearch.rakuten.co.jp/Web?qt=test&col=OW&svx=101210',
        nextLink: '//a[@class="next-sc-page-serp"]',
        pageElement: '//ul[@class="os-result"]',
    },
    {name: 'サッカーキング　一覧',
        url: '^https?://www\.soccer-king\.jp/.',
        siteExample: 'https://www.soccer-king.jp/news/japan/national',
        nextLink: '//div[contains(@class,"pagenav-next")]/a',
        pageElement: '//div[@class="archives-list"]/*',
    },
    {name: '新着エントリー - はてなブックマーク',
        url: '^http://b\.hatena\.ne\.jp/entrylist',
        siteExample: 'http://b.hatena.ne.jp/entrylist http://b.hatena.ne.jp/entrylist?of=20 http://b.hatena.ne.jp/entrylist/it http://b.hatena.ne.jp/hotentry/daily http://b.hatena.ne.jp/hotentry/20100126 ',
        nextLink: '//link[@rel="next"]',
        pageElement: '//section[@class="entrylist-unit"]',
    },
    {name: 'AFP BBNEWS',
        url: '^https?://(www\.)?afpbb\.com/',
        siteExample: 'http://www.afpbb.com/list/latest http://www.afpbb.com/search?fulltext=a&category[]=AFPBB%3E%E8%A8%98%E4%BA%8B&category[]=%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%82%AB%E3%83%83%E3%83%97&category[]=%E4%BA%94%E8%BC%AA&category[]=%E6%99%82%E4%BA%8B%E9%80%9A%E4%BF%A1',
        nextLink: '//li[@class="next"]/a|//li[a[contains(@class,"current")]]/following-sibling::li[1]/a',
        pageElement: 'id("main-column")/section//li',
    },
    {name: '英辞郎 on the WEB：アルク',
        url: '^https://eow\.alc\.co\.jp/',
        siteExample: 'https://eow.alc.co.jp/search?q=test',
        nextLink: '//link[@rel="next"]',
        pageElement: 'id("resultsList")/ul/li',
    },
    {name: 'ORICON ランキング',
        url: '^http://www\.oricon\.co\.jp/rank/\w{2,3}/[dwy]/',
        siteExample: 'http://www.oricon.co.jp/rank/js/d/2017-04-19/',
        nextLink: 'id("content-main")//article/div/ul/li[a/@class="is-active"]/following-sibling::li/a',
        pageElement: 'id("content-main")//article/section',
    },
    {name: 'Style Cruise',
        url: '^https://baycrews\.jp/item',
        siteExample: 'https://baycrews.jp/item/list?q_mtype=0&q_mshop=0494',
        nextLink: '//li[@class="arrow right"]/a',
        pageElement: '//ul[@class="l-col5 c-itemList"]/li',
    },
    {name: 'Arcadia SS投稿掲示板',
        url: '^http://(www\.)?mai-net\.(net|ath\.cx)/bbs/sst/',
        siteExample: 'http://www.mai-net.net/bbs/sst/sst.php?act=dump&cate={cate}&all=2215;;http://mai-net.ath.cx/bbs/sst/sst.php?act=dump&cate={cate}&all=2215',
        nextLink: '//table[@class="brdr"]//a[contains(., "次を表示する")]',
        pageElement: '//table[@class="brdr"]/tbody/tr',
    },
    {name: 'SitePoint Marketplace',
        url: '^https://flippa\.com/websites/',
        siteExample: 'https://flippa.com/websites/all?page=2',
        nextLink: '//a[contains(@class,"nextLink")]',
        pageElement: '//li[@class="ListingResults___listingResult"]',
    },
    {name: '明和水産',
        url: '^http://[^.]+\.meiwasuisan\.com/',
        siteExample: 'http://bbs68.meiwasuisan.com/news/',
        nextLink: '//span[@class="pagerCurrent"]/following-sibling::a[1]',
        pageElement: 'id("content")/table/tbody/tr[td]',
    },
    {name: 'xvideos.com',
        url: '^http://(www\.|jp\.)?xvideos\.com/',
        siteExample: 'http://www.xvideos.com/?k=beautiful',
        nextLink: '//a[.="Next" or .="次へ"]',
        pageElement: 'id("content")/div[1]',
    },
    {name: 'IMDb - All Photos | Video Gallery',
        url: '^https?://www\.imdb\.com/((name|title)/[^/]+/(?:mediaindex|videogallery)|gallery/rg\d+\?ref)',
        siteExample: 'http://www.imdb.com/name/nm0005261/mediaindex http://www.imdb.com/name/nm1289434/videogallery http://www.imdb.com/gallery/rg1859820288?ref_=nv_ph_ls_1',
        nextLink: '(id("right")|//span[@class="pagination"])/a[last()]',
        pageElement: 'id("media_index_thumbnail_grid")/*[self::a]|//div[@class="search-results"]/ol/li',
    },
    {name: '結婚式場探しウエディングパーク',
        url: '^https?://(www\.)?weddingpark\.net/.',
        siteExample: 'http://www.weddingpark.net/ranking/10-b14/?p=1 http://www.weddingpark.net/00000afb/kuchikomi/ http://www.weddingpark.net/freeword/?keyword=a http://www.weddingpark.net/resort/rs7/',
        nextLink: '//li[@class="ranking-result__pager-item"][not(a)]/following-sibling::li[1]/a|//li[@class="next"]/a',
        pageElement: '//ul[@class="ranking-result__list" or @class="hall-kuchikomi__list"]/li|id("SubMainContent")/*|id("past-left")/div[@class="result_cond clearfix"]/following-sibling::*[following-sibling::div/@class="result_pager clearfix"]',
    },
    {name: 'ナタリー - 画像 ニュース 統合',
        url: '^https?://natalie\.mu/(?:(?:(?:com|mus)ic|eiga|o(?:yatsu|warai)|stage)/)?(?:news|gallery/show/news_id/\d+/image_id)/\d',
        siteExample: 'http://natalie.mu/music/gallery/show/news_id/19812/image_id/18342;;http://natalie.mu/comic/news/18577;;http://natalie.mu/music/news/120722;;http://natalie.mu/eiga/news/156194;;http://natalie.mu/stage/news/212854',
        nextLink: '//div[@class="NA_galleryNav"]/ul/li[last()]/a|//div[@class="NA_articleFigure"]/figure/a|//a[@class="NA_more"]',
        pageElement: '//div[@class="NA_galleryBody" or @class = "NA_articleBanner" or @class="NA_articleFigure" or @class="NA_articleBody" or @class = "NA_articleSup"]',
    },
    {name: 'Mobile01 (all)',
        url: '^https?://(?:m|www)\.(?:mobile01\.com|5i01\.cn)/(?:forumtopic|catlist|mytopics|topiclist|topicdetail|mpsearch)\.php',
        siteExample: 'http://www.mobile01.com/topiclist.php?f=563;;http://www.mobile01.com/topicdetail.php?f=563&t=4240169&p=2',
        nextLink: '//div[@class="pagination"]/a[contains(.,"下一頁 ›")]',
        pageElement: 'id("section")//div[@class="tablelist forumlist"]/table[@summary] | id("section")//div[@class="forum-content"]/main',
    },
    {name: 'ばらサロン',
        url: '^https?://bara\.blue12\.net/',
        siteExample: 'http://bara.blue12.net/baron/',
        nextLink: '//div[@id="dt3"]/a[.="次へ"]',
        pageElement: 'id("m2")',
    },
    {name: 'ITpro',
        url: '^https?://itpro\.nikkeibp\.co\.jp/',
        siteExample: 'http://itpro.nikkeibp.co.jp/free/ITPro/OPINION/20041116/152634/ http://itpro.nikkeibp.co.jp/article/lecture/20070227/263037/ http://itpro.nikkeibp.co.jp/article/OPINION/20080723/311323/ http://itpro.nikkeibp.co.jp/article/COLUMN/20080520/303019/ http://itpro.nikkeibp.co.jp/article/NEWS/20080306/295541/ http://itpro.nikkeibp.co.jp/article/Interview/20090916/337381/ http://itpro.nikkeibp.co.jp/article/COLUMN/20090820/335752/ http://itpro.nikkeibp.co.jp/article/lecture/20061114/253632/ http://itpro.nikkeibp.co.jp/article/COLUMN/20090612/331804/',
        nextLink: '//link[@rel="next"]',
        pageElement: 'id("articleBody")',
    },
    {name: 'Seesaa ブログ (トップページ)',
        url: '^http://[^.]+\.seesaa\.net/',
        siteExample: 'http://obiekt.seesaa.net/ http://blackwatch.seesaa.net/',
        nextLink: 'id("content")/div[@class="navi"][1]/a[last()][not(./following-sibling::text()[string-length(.)>2])]|//li[@class="pager__item is-active"]/following-sibling::li[1]/a',
        pageElement: 'id("content")/div[contains(concat(" ",@class," ")," blog ")]|//article[@class="entry"]',
    },
    {name: 'AMO',
        url: '^https://addons\.mozilla\.org/[^/]+/[^/]+/(browse/type:[124]/cat:|((collect|extens)ions|user|addon/[^/]+/(reviews|versions)|search(-tools)?|(complete-)?t(ag|hemes))/)',
        siteExample: 'https://addons.mozilla.org/search?q=http&status=4;;https://addons.mozilla.org/en-US/firefox/collections/SnowWolfTattoo/2015-1-8/;;https://addons.mozilla.org/En-us/firefox/user/mozilla-labs5133025/;;https://addons.mozilla.org/en-US/firefox/browse/type:1/cat:14?sort=name;;https://addons.mozilla.org/ja/thunderbird/complete-themes/?sort=name;;https://addons.mozilla.org/en-US/seamonkey/search-tools/?sort=name;;https://addons.mozilla.org/ja/firefox/addon/noscript/reviews/;;https://addons.mozilla.org/ja/firefox/tag/tab;;https://addons.mozilla.org/ja/firefox/collections/-Ken-Saunders-/thunderbird/;;https://addons.mozilla.org/ja/thunderbird/themes/;;https://addons.mozilla.org/en-US/firefox/collections/SnowWolfTattoo/2015-1-8/',
        nextLink: '//a[@class="Paginate-item Paginate-next" or @class="button next" or @rel="next"]',
        pageElement: '//div[@class="SearchResults"]//li[@class="SearchResult"]|id("my-addons pjax-results")//div[starts-with(@class,"item addon")]|//ul[@class="listing-grid theme-grid c"]/li|//div[@class="featured listing "]//div[@class="item"]|//section[contains(@class,"ReviewList")]/div[@class="Card-contents"]//li',
    },
    {name: 'アメブロ',
        url: '^https://ameblo\.jp/.',
        siteExample: 'http://ameblo.jp/gsc-mikatan/entry-10759742380.html;;http://ameblo.jp/takashi-uchiyama/;;http://ameblo.jp/hasekura2/entrylist.html;;http://ameblo.jp/toyosakiaki-blog/entry-11022383666.html;;http://ameblo.jp/samurai-do/entry1-10701446172.html;;http://ameblo.jp/shibuya/;;http://ameblo.jp/toratoria/entry-11407052982.html',
        nextLink: '(id("sub_main")|id("sub_main")/*)/div[contains(concat(" ",@class," ")," page ")]//a[@class="nextPage"]|id("keyJumpNav")/li[2]/a[@class="skinBlock" and contains(text(), "次")]',
        pageElement: '(id("sub_main")|id("sub_main")/*)/div[contains(concat(" ",@class," "), " entry ") or @id="comment_module" or @id="recent_entries_list" or @id="trackback" or contains(@class,"trackbackPaging") or contains(@class,"commentPaging")]|//*[article]/*[self::article or self::aside]',
    },
    {name: '北欧女子オーサ オフィシャルブログ',
        url: '^https://ameblo\.jp/hokuoujoshi/(en|themeen)trylist',
        siteExample: 'https://ameblo.jp/hokuoujoshi/entrylist.html https://ameblo.jp/hokuoujoshi/themeentrylist-10084145244.html',
        nextLink: '//a[@class="skinSimpleBtn pagingNext"]',
        autopager:{
            pageElement: '//ul[@class="contentsList skinBorderList"]/li',
            stylish: '@-moz-document url-prefix("https://ameblo.jp/hokuoujoshi/entrylist"), url-prefix("https://ameblo.jp/hokuoujoshi/themeentrylist"){    .autopagerize_page_info{color:#333;}  }',
        },
    },
    {name: 'ドラぷらショッピング',
        url: '^https?://shop\.driveplaza\.com/products/',
        siteExample: 'http://shop.driveplaza.com/products/list.php?category_id=56',
        nextLink: '//a[@class="next"]',
        autopager:{
            pageElement: 'id("productListWrap")',
            stylish: '@-moz-document domain("shop.driveplaza.com") {    .clearfix{display:flex;    flex-wrap:wrap;}    .autopagerize_page_separator{display:none;}  }',
        },
    },
    {name: 'Youtubeアニメ無料動画+',
        url: '^http://tvanimedouga\.blog93\.fc2\.com/(blog|page)?',
        siteExample: 'http://tvanimedouga.blog93.fc2.com/ http://tvanimedouga.blog93.fc2.com/blog-entry-31091.html',
        nextLink: '//link[@rel="next"]',
        autopager:{
            pageElement: '//div[@class="mainEntryBlock" or @class="mainEntryComment"]',
            stylish: '@-moz-document domain("tvanimedouga.blog93.fc2.com") {    .autopagerize_page_separator~.mainEntryComment form{display:none;}  }',
        },
    },
    {name: 'yazawa',
        url: '^http://www\.yazawa\.co\.jp/',
        siteExample: 'http://www.yazawa.co.jp/products/category_products_1/category1_02_01 http://www.yazawa.co.jp/information',
        nextLink: '//a[@rel="next"]',
        autopager:{
            pageElement: '//ol[@class="product-grid"]/li|//li[@class="itemnewslist"]',
            stylish: '@-moz-document url-prefix("http://www.yazawa.co.jp/products/") {    .autopagerize_page_separator,.autopagerize_page_info{display: none;}  }',
        },
    },
    {name: 'MAXBET',
        url: '^http://zero2014\.blog\.fc2\.com/',
        siteExample: 'http://zero2014.blog.fc2.com/ http://zero2014.blog.fc2.com/blog-entry-1113.html',
        nextLink: '//ul[@class="entry_navi"][not(./ancestor::div[@class="commentarea"])]/li[1]/a',
        autopager:{
            pageElement: '//div[@class="entry"]|//div[@class="commentarea"]',
            stylish: '@-moz-document domain("zero2014.blog.fc2.com") {    .autopagerize_page_separator~.commentarea .entry_form{display:none;}  }',
        },
    },
    {name: '雀ゴロKの麻雀日記 個別記事',
        url: '^http://k-majan\.blog\.com/archives/',
        siteExample: 'http://k-majan.blog.jp/archives/1061380730.html http://k-majan-blog.com/archives/1070263472.html',
        nextLink: '//a[@rel="prev"]',
        autopager:{
            pageElement: '//article',
            stylish: '@-moz-document domain("k-majan.blog.jp") {  .autopagerize_page_separator~article footer~div form{display:none;}  }',
        },
    },
    {name: 'bnrq',
        url: '^https?://(www\.)?biqugev\.com/',
        siteExample: 'http://www.biqugev.com/0_964/391497.html',
        nextLink: '//div[@class="bottem2"]/a[4]',
        autopager:{
            pageElement: 'id("content")/node()|//div[@class="bookname"]',
            stylish: '@-moz-document domain("bnrq.com") {    .autopagerize_page_separator~.bookname>:not(h1){display:none}  }',
        },
    },
    {name: 'shopbot.com.au',
        url: '^https://(www\.)?shopbot\.com\.au/',
        siteExample: 'https://www.shopbot.com.au/graphics-card/computer-components/australia/83',
        nextLink: '//li[@class="current"]/following-sibling::li[1]/a',
        autopager:{
            pageElement: 'id("results")/li[not(@class="result next")]',
            stylish: '@-moz-document domain("shopbot.com.au") {  .grid{letter-spacing: normal !important;}  }',
        },
    },
    {name: 'ハーバービジネスオンライン',
        url: '^https?://hbol\.jp/',
        siteExample: 'http://hbol.jp/78425 http://hbol.jp/category/business http://hbol.jp/?s=a',
        nextLink: '//div[@class="post-next-page"]/a|//li[@class="pager-text"][last()]/a',
        autopager:{
            pageElement: '//div[@class="post-next-page"]/preceding-sibling::node()|//div[@class="post-pager-box"][not(//div[@class="post-next-page"])]/preceding-sibling::node()|//div[@class="article-list"]|//div[@class="article-list"]/following-sibling::div[1]',
            stylish: '@-moz-document domain("hbol.jp") {  .autopagerize_page_separator~.article-list{background: none !important;}  }',
        },
    },
    {name: '书迷楼',
        url: '^https?://(www\.)?shumil\.com/.+',
        siteExample: 'http://www.shumil.com/jiandaodushen/934982.html',
        nextLink: '//div[@class="title"]/a[4]',
        autopager:{
            pageElement: 'id("content")/p[b]/preceding-sibling::*[not(self::center or self::div/@style)]',
            stylish: '@-moz-document domain("shumilou.co") {    #content p {font-family: 宋体;}  }',
        },
    },
    {name: 'InfoQ',
        url: '^https?://(www\.)?infoq\.com/',
        siteExample: 'https://www.infoq.com/news/;https://www.infoq.com/presentations/;https://www.infoq.com/articles/;https://www.infoq.com/minibooks/;https://www.infoq.com/jp/news;https://www.infoq.com/jp/presentations;https://www.infoq.com/jp/articles;https://www.infoq.com/jp/minibooks',
        nextLink: '//a[@class="older-articles"]',
        autopager:{
            pageElement: 'id("content")/*[contains(@class,"news_type") and not(//div/@class="clear") or @class="clear"]',
            stylish: '@-moz-document domain("infoq.com") {  .news_type_block p{height: 168px;  overflow: auto;}  }',
        },
    },
    {name: 'AVA NEWS',
        url: '^https://ava\.pmang\.jp/n',
        siteExample: 'https://ava.pmang.jp/notices/ https://ava.pmang.jp/new_notices',
        nextLink: '//li[@class="next"]/a',
        autopager:{
            pageElement: '//table[@class="news_list" or @class="list"]//tr[td]',
            stylish: '@-moz-document url-prefix("http://ava.pmang.jp/n") {  #footer .footer_info{display:none;}  #footer .footer_copyright{display:none;}  .footer_navi01{display:none;}  table.list tr{background-color: #E5E5E5 !important;}  }',
        },
    },
    {name: 'LightInTheBox',
        url: '^https?://(www\.)?lightinthebox\.com/',
        siteExample: 'http://www.lightinthebox.com/s/external_suppliers_shoes_women-s-shoes_6820?sort=4a;http://www.lightinthebox.com/c/women-s-clothing_4704',
        nextLink: '//li[@class="next"]/a',
        autopager:{
            pageElement: '//div[contains(@class,"product-list") and contains(@class,"pagelet")]',
            stylish: '@-moz-document domain("www.lightinthebox.com") {    .litb-span47 .product-list{display:flex; flex-wrap:wrap;}    .prod-item{margin:0 !important;}    .litb-span47 .product-list dl{      margin-left:0px;    border-bottom: 1px dotted #ddd;      padding-top:10px;      padding-bottom:10px;        padding-left:10px;    }    .litb-span47 .product-list dl+div{      display:none;    }    .autopagerize_page_separator{display:none;}    .autopagerize_page_info{clear:both;}  }',
        },
    },
    {name: '将棋ペンクラブログ',
        url: '^https?://shogipenclublog\.com/blog/.',
        siteExample: 'http://shogipenclublog.com/blog/2015/07/07/hashimoto-2/ http://shogipenclublog.com/blog/2015/07/06/ouisen-9/',
        nextLink: '//a[@rel="prev"]',
        autopager:{
            pageElement: '//article[not(contains(@id,"comment"))]|id("comments")',
            stylish: '@-moz-document domain("shogipenclublog.com") {  .autopagerize_page_separator~#comments #respond{display:none;}  }',
        },
    },
    {name: 'クリップアートファクトリー',
        url: '^https?://(?:www\.)?printout\.jp/clipart/clipart_d/',
        siteExample: 'http://www.printout.jp/clipart/clipart_d/01_season/01_haruimage/clipart1.html http://www.printout.jp/clipart/clipart_d/08_nenga/01_eto/08_hitsuji/clipart2.html http://www.printout.jp/clipart/clipart_d/08_nenga/01_eto/10_tori/clipart3.html http://www.printout.jp/clipart/clipart_d/02_saiji/04_hinamaturi/clipart1.html http://www.printout.jp/clipart/clipart_d/08_nenga/01_eto/10_tori/clipart1.html http://www.printout.jp/clipart/clipart_d/08_nenga/01_eto/12_i/clipart1.html http://www.printout.jp/clipart/clipart_d/08_nenga/01_eto/09_saru/clipart5.html http://www.printout.jp/clipart/clipart_d/08_nenga/01_eto/01_ne/clipart1.html',
        nextLink: '//td[.//a[contains(@href,"index.html") or @href="/clipart/"]]/following-sibling::td[last()]/a',
        autopager:{
            pageElement: '//table[@bgcolor="#EFEFEF" or @bgcolor="#efefef" or @class="fontb"]/following-sibling::div[@align="center"]/*[self::table[not(@bgcolor="#EFEFEF")] or self::br]|id("container100x100")',
            stylish: '@-moz-document domain("printout.jp") {    #container100x100~table{margin: 0 auto;}  }',
        },
    },
    {name: 'Coordisnap',
        url: '^https://coordisnap\.com/',
        siteExample: 'https://coordisnap.com/mode/index/keywords;https://coordisnap.com/mode/rank/topvote',
        nextLink: '//li[@class="next"]/a',
        autopager:{
            pageElement: '//*[@class="thumbBlockLink" or @class="listTag cf"]//li',
            stylish: '@-moz-document domain("coordisnap.com") {    .listTag{display:block;}    .listTag > *{float:none;    display:inline-block;}    .autopagerize_page_info{display:block;}    }',
        },
    },
    {name: '楽天woman ニュース',
        url: '^https://woman\.infoseek\.co\.jp/news/',
        siteExample: 'https://woman.infoseek.co.jp/news/entertainment/moviewalker_79513 https://woman.infoseek.co.jp/news/entertainment',
        nextLink: '//li[@class="button active"]/following-sibling::li[1]/a',
        autopager:{
            pageElement: 'id("article_story")/*|//li[@class="news-item"]',
            stylish: '@-moz-document url-prefix("http://woman.infoseek.co.jp/news/") {  .thumbnailBox{visibility:visible !important;}  }',
        },
    },
    {name: 'WISDOM - ヒトをつなぐ。ビジネスがつながる。',
        url: '^https://(www\.)?blwisdom\.com/',
        siteExample: 'https://www.blwisdom.com/strategy/series/china/item/9958-65.html https://www.blwisdom.com/technology/series/itshiba/item/8449-01.html',
        nextLink: 'id("pgnt1")/li/a[@class="g_nextBtn"]|id("g_prevArticle")/a',
        autopager:{
            pageElement: 'id("g_aTtlBox")/following-sibling::*[following-sibling::div/@class="g_pagenate01"]|id("g_aSectionMainCont")/*[not(//div/@class="g_pagenate01")]',
            stylish: '@-moz-document url-prefix("https://www.blwisdom.com/technology/series/itshiba/item/") {  div.g_pagenate01{display:none;}  }    @-moz-document domain("www.blwisdom.com") {  .autopagerize_page_info+h2{margin:0 0 30px 0 !important;}  #g_aSectionMain .g_pagenate01, #g_aSectionMain .g_pagenate02{margin:0 !important;}  #g_aSectionMainCont > p, .g_sec p, #g_aSectionMain .g_sec .g_ulList01, .g_imgfloatTxt p{margin:0 !important;}  }',
        },
    },
    {name: 'CareerPark![キャリアパーク]|みんなのノウハウが集まる場',
        url: '^https?://careerpark\.jp/',
        siteExample: 'https://careerpark.jp/employ/article',
        nextLink: '//a[@class="icon icon--pagerNext"]',
        autopager:{
            pageElement: '//section[@class="u-mB40"][1]/div[@class="c-articleBox c-articleBox--medium c-articleBox__inner"]',
            stylish: '@-moz-document domain("careerpark.jp") {    .autopagerize_page_separator~li img{opacity:1;}  }',
        },
    },
    {name: 'Moebooru:Danbooru clones',
        url: /^https?:\/\/(konachan\.com|yande\.re)\/(post|comment)($|\?|#|\/search\?)/i,
        siteExample: 'https://yande.re/post;https://yande.re/comment;http://konachan.com/post;http://konachan.com/comment',
        nextLink: '//a[@class="next_page"]',
        autopager:{
            pageElement: '//ul[@id="post-list-posts"]|//div[@id="comment-list"]/div[@class="post"]|//table[@class="highlightable"]',
            stylish: '/* konachan.com and yande.re hide images when using AutoPagerize.     To show these images, you need to apply this stylesheet. */  @-moz-document domain("yande.re"), domain("konachan.com") {      span.blacklisted, li.javascript-hide { display: inline-block !important; }      hr.autopagerize_page_separator { clear: both !important; }      .autopagerize_page_separator~div.post+div:not(.post) { display:none !important; }      #post-list .autopagerize_page_separator~div { display:none !important; }  }',
            useiframe: true,
        },
    },
    {name: '@IT, EE Times Japan, Business Media 誠, ITmedia, EDN Japan',
        url: '^https?://.*(bizmakoto|eetimes|(atmarkit|itmedia|ednjapan)\.co)(m|\.jp)/',
        siteExample: 'http://www.atmarkit.co.jp/ait/articles/1210/04/news113.html;http://www.atmarkit.co.jp/fsecurity/special/107bayes/bayes02.html;http://www.atmarkit.co.jp/fserver/articles/vmwaredep/08/01.html;http://www.atmarkit.co.jp/flinux/rensai/mysql02/mysql02.html;http://www.atmarkit.co.jp/fdotnet/chushin/roadtolinq_01/roadtolinq_01_01.html;http://monoist.atmarkit.co.jp/fembedded/symbian/symbian07/symbian01.html;http://monoist.atmarkit.co.jp/mn/articles/1104/20/news004.html;http://monoist.atmarkit.co.jp/mn/articles/1106/22/news005.html;http://eetimes.jp/ee/articles/1104/11/news038.html;http://eetimes.jp/ee/articles/1401/20/news082_2.html;http://bizmakoto.jp/makoto/articles/0805/08/news017.html;http://bizmakoto.jp/makoto/articles/0807/02/news061.html;http://bizmakoto.jp/makoto/articles/0903/03/news010.html;http://bizmakoto.jp/makoto/articles/0903/07/news004.html;http://bizmakoto.jp/makoto/articles/0902/28/news007.html;http://bizmakoto.jp/makoto/articles/0904/03/news036.html;http://bizmakoto.jp/makoto/articles/1309/06/news009.html;http://www.itmedia.co.jp/enterprise/articles/0803/05/news012.html;http://www.itmedia.co.jp/enterprise/articles/0806/24/news007.html;http://www.itmedia.co.jp/enterprise/articles/0607/07/news009.html;http://www.itmedia.co.jp/enterprise/articles/0806/27/news113.html;http://www.itmedia.co.jp/news/articles/0805/23/news051.html;http://www.itmedia.co.jp/news/articles/1009/07/news070.html;http://plusd.itmedia.co.jp/pcuser/articles/0805/06/news001.html;http://camera.itmedia.co.jp/dc/articles/1004/01/news060.html;http://gamez.itmedia.co.jp/games/articles/0906/17/news050.html;http://nlab.itmedia.co.jp/nl/articles/1404/25/news017_4.html;http://mag.executive.itmedia.co.jp/executive/articles/0906/30/news006.html;http://mag.executive.itmedia.co.jp/executive/articles/0805/23/news008.html;http://mag.executive.itmedia.co.jp/executive/articles/0806/25/news004.html;http://www.atmarkit.co.jp/fwcr/design/teamwork/trickster01/01.html;http://www.atmarkit.co.jp/fwcr/design/tag/structure/index.html;http://ednjapan.com/edn/articles/1511/25/news047.html;http://www.atmarkit.co.jp/fcoding/articles/algorithm/01/algorithm01a.html;http://jibun.atmarkit.co.jp/ljibun01/rensai/yaruki02/yaruki01.html;http://jibun.atmarkit.co.jp/ljibun01/rensai/yaruki01/yaruki02.html;http://www.itmedia.co.jp/lifestyle/articles/1701/27/news095.html',
        nextLink: 'id("next")/a|id("centercol")//a[contains(img/@src,"next")]',
        autopager:{
            pageElement: '((//div[@class="inner"]|id("article_body"))//*[@class="ctrl" or @class="endkwd" or @class="ctrl ctrlbottom"][last()]|id("main-contents")/div[@class="nextprev"])/preceding-sibling::*[not(@id="masterSocialbuttonTop" or @class="ctrl" or @class="endkwd" or @id="fb-root" or @id="ITOT1" or @id="TABLETAD" or @id="cmsMark" or name()="script" or name()="link" or @class="shopbtn" or @id="ITR")]|id("centercol")/*[preceding-sibling::table//div/font/b[contains(.,"Page")] or preceding-sibling::font/@size="2"][following-sibling::ul[last()] or following-sibling::table//img[contains(@src,"next")]]|id("centercol")/ul[last()]/*[following-sibling::table//img[contains(@src,"next")]]|//p[@class="bakLink"]/preceding-sibling::*|//div[@class="headset"]/*[not(p/@class="bakLink")]',
            stylish: '@-moz-document domain("itmedia.co.jp") {  .autopagerize_page_separator~#endlinkConnection{display:none;}  }',
        },
    },
    {name: 'ウレぴあ総研',
        url: '^https?://ure\.pia\.co\.jp/',
        siteExample: 'http://ure.pia.co.jp/category/report/%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB http://ure.pia.co.jp/articles/-/9165 http://ure.pia.co.jp/articles/-/28961',
        nextLink: '//a[@class="btn_default btn_next" or ../@class="next"]',
        autopager:{
            pageElement: '//ul[@class="list basic"]/li|id("pagenation")/preceding-sibling::*',
            stylish: '@-moz-document domain("ure.pia.co.jp") {    #next-info{display:none;}  }',
        },
    },
    {name: 'ビジネスジャーナル',
        url: '^https?://biz-journal\.jp/*',
        siteExample: 'http://biz-journal.jp/2012/05/post_126.html;http://biz-journal.jp/2014/04/post_4626.html;http://biz-journal.jp/it/;http://biz-journal.jp/i/2015/06/post_10522_entry.html',
        nextLink: '//link[@rel="next"]',
        autopager:{
            pageElement: 'id("bjLatest")/div[@class="bjCategorySmall" or @class="bjLatestLarge"]|//div[@class="entryBody"]',
            stylish: '@-moz-document regexp("http://biz-journal.jp/\\d+/\\d+/post_\\d+.html") {  .entryBody pre.right {float:none !important;}  }',
        },
    },
    {name: 'ニジエ',
        url: '^(http|https)://nijie\.info/',
        siteExample: 'http://nijie.info/illust_view.php http://nijie.info/search.php?word=%E3%82%AD%E3%82%B9;http://nijie.info/user_search.php;http://nijie.info/view.php?id=15786',
        nextLink: '//div[contains(concat(" ", @class, " "), " motto-r ") or contains(concat(" ", @class, " "), " right ")]/p[contains(concat(" ", @class, " "), " page_button ")]/a|id("backIllust")',
        autopager:{
            pageElement: 'id("main-left-main")/descendant::div[contains(concat(" ", @class, " "), " nijie ") or contains(concat(" ", @class), " nijie-")]|id("kobetu-center")/parent::div/*|id("main-left-none")/*',
            stylish: '@-moz-document domain("nijie.info") {    .autopagerize_page_separator~.nijie .picture img{display:block !important;}  }',
        },
    },
    {name: '高校野球ドットコム',
        url: '^https?://(?:www\.)?hb-nippon\.com/',
        siteExample: 'http://www.hb-nippon.com/interview/785-intvw2012/6461-20120227no92;http://www.hb-nippon.com/column/437-baseballclub/6966-20120117no55bc;http://www.hb-nippon.com/interview/785-intvw2012;http://www.hb-nippon.com/column/626-tokusyu/6741-20110330no01tks;http://www.hb-nippon.com/column/626-tokusyu/7069-20120424no06tks;http://www.hb-nippon.com/column/1036-syakaizin/7639-20130515no01ab?page=3;http://www.hb-nippon.com/news/52-column;http://www.hb-nippon.com/interview/1173-intvw2014/6643-20140225no176;http://www.hb-nippon.com/column/437-baseballclub/8348-20140313no124;http://www.hb-nippon.com/column/437-baseballclub/9571-20150705no250?page=2;http://www.hb-nippon.com/interview/1507-intvw2016/6932-20160409no390?page=2;http://www.hb-nippon.com/bbs/player',
        nextLink: '//li[@class="current"]/following-sibling::li[1]/a[not(@href="/column/437-baseballclub/8348-20140313no124?page=2")]',
        autopager:{
            pageElement: '//div[@class="article_wrap"]/p[1][following-sibling::div[@class="para_title_blue" or @class="device_box"]]/following-sibling::*|//ul[@class="list"]/li|//dl[@class="newslist_sky"]/*|//div[@class="article_wrap"][div[@class="para_title_blue"][not(preceding-sibling::p)]]/*|id("topics")/table//tbody/tr',
            stylish: '@-moz-document domain("hb-nippon.com") {    [src*="banner"]{display:none !important;}  }',
        },
    },
    {name: 'はちま起稿 - 記事',
        url: '^http://blog\.esuteru\.com/archives/\d+\.html',
        siteExample: 'http://blog.esuteru.com/archives/8541816.html',
        nextLink: '//a[contains(concat(" ", @class, " "), " next ")]',
        autopager:{
            pageElement: 'id("entry")/div[contains(concat(" ", @class, " "), " body ")]',
            stylish: '@-moz-document domain("blog.esuteru.com") {    .ad_main_area~br{display:none;}    .ad_main_area{display:none;}    .article_detail_area>div[align]{display:none;}  }',
        },
    },
    {name: '神戸新聞 連載・特集',
        url: '^https://(www\.)?kobe-np\.co\.jp/rentoku/',
        siteExample: 'https://www.kobe-np.co.jp/rentoku/higashinihon/society/201603/0008893713.shtml https://www.kobe-np.co.jp/rentoku/higashinihon/society/201603/0008893717.shtml',
        nextLink: '//ul[contains(@class,"newsDescription_type02")]/li[not(position()=1)][a[contains(.,concat("（",substring-before(substring-after(//title/text(),"（"),"）"),"）"))]]/preceding-sibling::li[1]/a[not(@href="#")]|//ul[contains(@class,"newsDescription_type02")][li[1][a[contains(.,concat("（",substring-before(substring-after(//title/text(),"（"),"）"),"）"))]]]/preceding-sibling::ul[1]/li[last()]/a[not(@href="#")]',
        autopager:{
            pageElement: '//div[@class="genreTitle"][1]/following-sibling::*[following-sibling::div/@class="ad text_l"]',
            stylish: '@-moz-document url-prefix("http://www.kobe-np.co.jp/rentoku/") {    .pdMainPhotoIn_img{display:block;}  }',
        },
    },
    {name: 'HONDA MotoGP 2011 Analysis',
        url: '^https?://(www\.)?honda\.co\.jp/WGP/spcontents2011/analysis/',
        siteExample: 'http://www.honda.co.jp/WGP/spcontents2011/analysis/2-1/',
        nextLink: '//p[@class="genba_arrow2"]/a',
        autopager:{
            pageElement: 'id("miyagi_foot")/preceding-sibling::*[not(@id="miyagi_title")]',
            stylish: '@-moz-document url-prefix("http://www.honda.co.jp/WGP/spcontents2011/analysis/") {    #miyagi_text2 table{display:none;}  }',
        },
    },
    {name: '時事ドットコム 写真特集 d4',
        url: '^http://(?:www\.)?jiji\.com/jc/d4',
        siteExample: 'http://www.jiji.com/jc/d4?p=lby032&d=d4_int&j4 http://www.jiji.com/jc/d4?p=sks517&d=d4_beauty',
        nextLink: '//div[@class="PhotoPaginationNext"]/a',
        autopager:{
            pageElement: '//div[@class="PhotoPagination clearfix"]/following-sibling::*',
            stylish: '@-moz-document domain("www.jiji.com") {    .autopagerize_page_separator~.RelationPhoto{display:none;}  }',
        },
    },
    {name: 'Infotop',
        url: '^https?://(www\.)?infotop\.jp/',
        siteExample: 'http://www.infotop.jp/item.php?com=category&CATEGORY_ID_I=1 http://www.infotop.jp/search',
        nextLink: '//a[@class="next"]',
        autopager:{
            pageElement: '//table[@class="noborder"]/tbody/tr',
            stylish: '@-moz-document domain("www.infotop.jp") {    .autopagerize_page_separator~table tr:first-child{display:none;}  }',
        },
    },
    {name: 'Engadget',
        url: '^https?://(.+\.)?engadget\.com',
        siteExample: 'http://www.engadget.com/;http://www.engadget.com/reviews/;http://www.engadget.com/videos/;http://www.engadget.com/galleries/;http://japanese.engadget.com/page/2;http://chinese.engadget.com/page/6;http://chinese.engadget.com/2008/09/02/google-chrome-press-conference/;http://www.engadget.com/gaming/',
        nextLink: '//div[@class="table-cell" or @class="container@tp-"]/a|//a[@rel="prev" or ../@class="next_pg"]',
        autopager:{
            pageElement: '//div[div/@class="container@m container@tp" or @class="commentlinks"]|id("body")/article',
            stylish: '@-moz-document url-prefix("http://www.engadget.com/galleries/") {  .gallery-listing {margin:20px 0 0 0 !important;}  }    @-moz-document url-prefix("http://www.engadget.com/videos/") {  .videos .video-listing {margin: 20px 0 0 0 !important;}  .autopagerize_page_separator{clear:both;}  }',
        },
    },
    {name: 'Socialite Life',
        url: '^https?://(www\.)?socialitelife\.com/',
        siteExample: 'http://www.socialitelife.com/;http://www.socialitelife.com/photos',
        nextLink: '//a[span/@class="arrow next"]',
        autopager:{
            pageElement: '//div[@class="container main-container"][./following-sibling::div[@class="container main-container"]][//link[@rel="canonical"][@href="http://www.socialitelife.com/"]]|//div[@class="container main-container"][not(//link[@rel="canonical"][@href="http://www.socialitelife.com/" or contains(@href,"/photos")])]|//div[@class="post row"]',
            stylish: '@-moz-document domain("socialitelife.com") {    .autopagerize_page_separator~.autopagerize_page_separator~.main-container .sidebar{display:none;}    .pag{display:none;}  }',
        },
    },
    {name: 'eMAG.pl',
        url: '^https?://(www\.)?emag\.pl/',
        siteExample: 'http://www.emag.pl/telewizory/c',
        nextLink: '//link[@rel="next"]',
        autopager:{
            pageElement: 'id("products-holder")/*',
            stylish: 'Array.prototype.forEach.call(document.querySelectorAll("img"), function(img) { var lazySrc = img.hasAttribute("data-src") ? img.getAttribute("data-src") : img.getAttribute("data-lazy-src"); if (lazySrc) { img.src = lazySrc;} });',
        },
    },
    {name: 'Dreamstime',
        url: '^https://(www\.)?dreamstime\.com/',
        siteExample: 'https://www.dreamstime.com/latest-photos-1',
        nextLink: '//a[@class="dt-results-next"]',
        autopager:{
            pageElement: '//div[@class="thb_cell thb_cell_v1"][./following-sibling::style]',
            stylish: '@-moz-document domain("dreamstime.com") {    .thb-large-box{      display:flex;    flex-wrap:wrap;    }    .thb-large-box .thb_cell_v1{      padding-left: 4px;    }    .showonload {      visibility:visible !important;    }    .thb_cell_v1{height:197px !important;}  }',
        },
    },
    {name: 'uploader',
        url: '^https?://[^.]+\.getuploader\.com/',
        siteExample: 'http://u1.getuploader.com/sample;http://u6.getuploader.com/script/search?q=autopagerize',
        nextLink: '//li[@class="next"][not(./preceding-sibling::li[1][@class="active"])]/a',
        autopager:{
            pageElement: '//div[@class="table-responsive"]/table/tbody/tr|//div[@class="alert alert-info"][count(./p)>1]',
            stylish: '@-moz-document domain("getuploader.com") {  .table-responsive[data-pattern="priority-columns"]>.table>thead>tr>th, .table-responsive[data-pattern="priority-columns"]>.table>tbody>tr>th, .table-responsive[data-pattern="priority-columns"]>.table>tfoot>tr>th, .table-responsive[data-pattern="priority-columns"]>.table>thead>tr>td, .table-responsive[data-pattern="priority-columns"]>.table>tbody>tr>td, .table-responsive[data-pattern="priority-columns"]>.table>tfoot>tr>td{white-space:normal !important;}  .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {line-height:1 !important;}    }',
        },
    },
    {name: '秀丸エディタの強調表示定義ファイルライブラリ ',
        url: '^https?://hide\.maruo\.co\.jp/lib/hilight/',
        siteExample: 'http://hide.maruo.co.jp/lib/hilight/index.html',
        nextLink: '//a[.="『戻る』"]/preceding-sibling::table[position()=1]//td[b]/following-sibling::td[position()=1]/a',
        autopager:{
            pageElement: '//img[contains(@src,"bball.gif")]/ancestor::table[1]|//img[contains(@src,"bball.gif")]/ancestor::table[1]/preceding-sibling::hr[following-sibling::table]|//img[contains(@src,"bball.gif")]/ancestor::table[1]/preceding-sibling::hr',
            stylish: '@-moz-document url-prefix("http://hide.maruo.co.jp/lib/hilight/") {    .autopagerize_page_separator{display:none;}  }',
        },
    },
    {name: 'MOTOR DAYS',
        url: '^https?://(?:www\.)?motordays\.com/',
        siteExample: 'http://www.motordays.com/newcar/articles/toyota/ http://www.motordays.com/news/ http://www.motordays.com/its/articles/articles.php?page=2',
        nextLink: '//a[@class="nextpage"]',
        autopager:{
            pageElement: 'id("articlelist newslist")//li|//div[@class="paginate"]/following-sibling::ul/li|//div[@class="paginate"]/following-sibling::div[@class="clearblock"][./following-sibling::div[@class="paginate"]]',
            stylish: '@-moz-document domain("motordays.com") {    .autopagerize_page_separator~li+div.clearblock{margin:0 0 32px 0 !important;}  }',
        },
    },
    {name: 'goo ニュース',
        url: '^http://news\.goo\.ne\.jp/picture/',
        siteExample: 'http://news.goo.ne.jp/picture/',
        nextLink: '//li[@class="pager-next"]/a',
        autopager:{
            pageElement: '//div[@class="gn-container"]',
            stylish: '@-moz-document url-prefix("http://news.goo.ne.jp/picture/") {    .autopagerize_page_separator~.gn-container .heading-label-large{display:none;}  }',
        },
    },
    {name: 'webCG Impressions, Essays',
        url: '^http://www\.webcg\.net/articles/',
        siteExample: 'http://www.webcg.net/articles/-/7834;http://www.webcg.net/articles/-/36120;http://www.webcg.net/articles/-/36117',
        nextLink: '//a[contains(concat(" ",@class," ")," next ")]',
        autopager:{
            pageElement: '//div[contains(concat(" ",@class," "), " article-inner ")]',
            stylish: '@-moz-document domain("webcg.net") {    .article-body .thumb-outer~div{display:none;}  }',
        },
    },
    {name: '革新的発明と製品情報',
        url: '^http://www\.j-tokkyo\.com/',
        siteExample: 'http://www.j-tokkyo.com/2008/20080626.shtml',
        nextLink: 'id("content")/strong/following-sibling::a[1]',
        autopager:{
            pageElement: '//table[@class="list_table"]//tr[td/a]',
            stylish: '@-moz-document domain("j-tokkyo.com") {    .autopagerize_page_separator~.list_table tr:first-child{display:none;}  }',
        },
    },
    {name: 'SANSPO.COM',
        url: '^https?://www\.sanspo\.com/',
        siteExample: 'http://www.sanspo.com/geino/news/20120306/eco12030623580001-n1.html http://www.sanspo.com/soccer/photos/20120306/jap12030622460020-p1.html;http://www.sanspo.com/flash/photolists/flash-p1.html;http://www.sanspo.com/baseball/newslists/baseball-n1.html;http://www.sanspo.com/baseball/news/20150609/bbo15060905050004-n1.html;http://www.sanspo.com/baseball/news/20150609/bbo15060905040002-n1.html;http://www.sanspo.com/baseball/others/newslists/others-n1.html',
        nextLink: '//a[contains(img/@src,"next.gif")]',
        autopager:{
            pageElement: 'id("Contents")/descendant::*[self::div[contains(concat(" ", @class, " "), " PhotoDetail ")] or self::ul[contains(concat(" ", @class, " "), " PhotoList ")]]|id("NewsListSection01")/ul[@class="NewsList"][not(//div[@class="NewsDetail"])]|//div[@class="NewsDetail"]/p[last()][a]/preceding-sibling::*|//div[@class="NewsDetail"][p[last()][not(a)]]',
            stylish: '@-moz-document url-prefix("http://www.sanspo.com/") {  .autopagerize_page_info+.NewsDetail{padding-top:50px !important;}  }',
        },
    },
    {name: 'Yahoo! ショッピング',
        url: /^https:\/\/shopping\.yahoo\.co\.jp\/search(:?;|\?)/i,
        siteExample: 'https://shopping.yahoo.co.jp/search?p=HDD+1tb;https://shopping.yahoo.co.jp/search?p=HDD&view=grid;https://shopping.yahoo.co.jp/search;_ylt=a?p=HDD',
        nextLink: '//a[@rel="next"]',
        autopager:{
            pageElement: 'id("mIn")//div[@class="elList"]/ul/li',
            stylish: '@-moz-document domain("search.shopping.yahoo.co.jp") {    .autopagerize_page_info{text-align:center;}    .mdSearchList.elGrid .elList > ul{font-size:small;}    .mdSearchList.elGrid .elList > ul > li:nth-child(5n+6) {position:static;}    .mdSearchList.elGrid .elList > ul > li.elItemMatch {position:static;}  }',
        },
    },
    {name: 'Flickr - Tags',
        url: '^https?://www\.flickr\.com/photos/tags/',
        siteExample: 'https://www.flickr.com/photos/tags/wii',
        nextLink: '//a[@rel="next"]',
        autopager:{
            pageElement: '//div[@class="view photo-list-view"]/*',
            stylish: '@-moz-document domain("www.flickr.com") {  .autopagerize_page_separator{clear:both;}  }',
        },
    },
];

function siteinfo_stringify(obj){
  var json = JSON.stringify(obj, function(key, value) {
    if (typeof value === "function") {
      return "/#Function(" + value.toString() + ")/";
    }
    return value;
  },3);
  return json;
}

function siteinfo_parse(jsondata){
  var obj = JSON.parse(jsondata, function(key, value) {
    if (typeof value === "string" &&
      value.startsWith("/#Function(") &&
      value.endsWith(")/")) {
      console.log(value);
      value = value.substring("/#Function(".length, value.length - 2);
      return eval("(" + value + ")");
    }
    return value;
  });
  return obj;
}

var jsonData = siteinfo_stringify(SITEINFO);
var fs = require('fs');
// fs.writeFile("siteinfo.json", jsonData, function(err) {
    // if (err) {
        // console.log(err);
    // }
    // console.log("File has been created");
// });


//read back
var content = fs.readFileSync("siteinfo.json","utf-8");
console.log(content.substring(0,15))
var SITEINFO=siteinfo_parse(content);
console.log(SITEINFO[0]);
console.log(typeof(SITEINFO[0].autopager.documentFilter))