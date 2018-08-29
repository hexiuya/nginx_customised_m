$(function(){
	InitLeftMenu();
	tabClose();
	tabCloseEven();

    /*
	$('#tabs').tabs('add',{
		title:'欢迎使用',
		content:createFrame('http://hxling.cnblogs.com')
	}).tabs({
        onSelect: function (title) {
        	//获取当前的title名字的tab
            var currTab = $('#tabs').tabs('getTab', title);
            //获取当前tab里面的content内容(其实是iframe)
            var iframe = $(currTab.panel('options').content);
            //从当前的iframe中获取src属性
			var src = iframe.attr('src');
			//如果src存在,则更新当前的tab
			if(src)
				$('#tabs').tabs('update', { tab: currTab, options: { content: createFrame(src)} });

        }
    });
	*/
});


//初始化左侧
function InitLeftMenu() {
	$("#nav").accordion({animate:false});

	// 循环添加ul li 
    $.each(_menus.menus, function(i, n) {
		var menulist ='';
		menulist +='<ul class="easyui-tree">';
		/*
        $.each(n.menus, function(j, o) {
			menulist += '<li><div><a style="text-decoration:none;" ref="'+o.menuid+'" href="#" rel="' + o.url + '" ><span class="icon '+o.icon+'" >&nbsp;</span><span class="nav">' + o.menuname + '</span></a></div></li> ';
        })
		*/
        $.each(n.menus, function(j, o) {
			menulist += '<li><div><a ref="'+o.menuid+'" href="#" rel="' + o.url + '" ><span class="nav">' + o.menuname + '</span></a></div></li> ';
        })
		menulist += '</ul>';

		$('#nav').accordion('add', {
            title: n.menuname,
            content: menulist,
            iconCls: 'icon ' + n.icon
        });

    });

    // .easyui-accordion li a 添加点击事件
	$('.easyui-accordion li a').click(function(){
		//获取菜单名
		var tabTitle = $(this).children('.nav').text();
		//获取链接地址
		var url = $(this).attr("rel");
		//获取菜单id
		var menuid = $(this).attr("ref");
		//获取图标类型
		var icon = getIcon(menuid,icon);
		//生成tab
		addTab(tabTitle,url,icon);
		$('.easyui-accordion li div').removeClass("selected");
		$(this).parent().addClass("selected");
	}).hover(function(){
		$(this).parent().addClass("hover");
	},function(){
		$(this).parent().removeClass("hover");
	});

	//选中第一个
	var panels = $('#nav').accordion('panels');
	var t = panels[0].panel('options').title;
    $('#nav').accordion('select', t);
}


//获取左侧导航的图标
function getIcon(menuid){
	var icon = 'icon ';
	$.each(_menus.menus, function(i, n) {
		 $.each(n.menus, function(j, o) {
		 	if(o.menuid==menuid){
				icon += o.icon;
			}
		 })
	})

	return icon;
}

//在tabs里生成tab页面
function addTab(subtitle,url,icon){
	if(!$('#tabs').tabs('exists',subtitle)){
		//如果当前tab页面不存在，则生成新的tab页，并生成iframe
		/*$('#tabs').tabs('add',{
			title:subtitle,
			content:createFrame(url),
			closable:true,
			icon:icon
		});*/
		$('#tabs').tabs('add',{
			title:subtitle,
			content:createFrame(url),
			closable:true
		});
	}else{
		//如果当前tab页面存在，则该tab为选中状态
		$('#tabs').tabs('select',subtitle);
		//并刷新该tab页
		$('#rh-menu-tabupdate').click();
	}
	//对当前tab绑定关闭事件
	tabClose();
}

function createFrame(url)
{
	var s = '<iframe scrolling="auto" frameborder="0"  src="'+url+'" style="width:100%;height:100%;overflow:hidden"></iframe>';
	return s;
}

// tab关闭方法
function tabClose()
{
	/*双击关闭TAB选项卡*/
	$(".tabs-inner").dblclick(function(){// 对所有tabs-inner绑定双击函数
		//获取当前的tabs-inner里的tabs-closable的内容，即tab的名字
		var subtitle = $(this).children(".tabs-closable").text();
		//关闭当前的tab
		$('#tabs').tabs('close',subtitle);
	})

	/*为选项卡绑定右键*/
	$(".tabs-inner").bind('contextmenu',function(e){
		//生成右键选项，left为当前鼠标的x坐标,top为当前鼠标的y坐标
		$('#rh-menu').menu('show', {
			left: e.pageX,
			top: e.pageY
		});
		//获取当前的tabs-inner里的tabs-closable的内容，即tab的名字
		var subtitle =$(this).children(".tabs-closable").text();
		//给当前的右键菜单的currtab赋值subtitle
		$('#rh-menu').data("currtab",subtitle);
		//当前tab为选中状态
		$('#tabs').tabs('select',subtitle);

		return false;
	});
}

//绑定右键菜单事件
function tabCloseEven()
{
	//刷新
	$('#rh-menu-tabupdate').click(function(){
		var currTab = $('#tabs').tabs('getSelected');
		var url = $(currTab.panel('options').content).attr('src');
		$('#tabs').tabs('update',{
			tab:currTab,
			options:{
				content:createFrame(url)
			}
		})
	})
	//关闭当前
	$('#rh-menu-tabclose').click(function(){
		var currtab_title = $('#rh-menu').data("currtab");
		$('#tabs').tabs('close',currtab_title);
	})
	//全部关闭
	$('#rh-menu-tabcloseall').click(function(){
		$('.tabs-inner span').each(function(i,n){
			var t = $(n).text();
			$('#tabs').tabs('close',t);
		});
	});
	//关闭除当前之外的TAB
	$('#rh-menu-tabcloseother').click(function(){
		$('#rh-menu-tabcloseright').click();
		$('#rh-menu-tabcloseleft').click();
	});
	//关闭当前右侧的TAB
	$('#rh-menu-tabcloseright').click(function(){
		var nextall = $('.tabs-selected').nextAll();
		if(nextall.length==0){
			//msgShow('系统提示','后边没有啦~~','error');
			alert('后边没有啦~~');
			return false;
		}
		nextall.each(function(i,n){
			var t=$('a:eq(0) span',$(n)).text();
			$('#tabs').tabs('close',t);
		});
		return false;
	});
	//关闭当前左侧的TAB
	$('#rh-menu-tabcloseleft').click(function(){
		var prevall = $('.tabs-selected').prevAll();
		if(prevall.length==0){
			alert('到头了，前边没有啦~~');
			return false;
		}
		prevall.each(function(i,n){
			var t=$('a:eq(0) span',$(n)).text();
			$('#tabs').tabs('close',t);
		});
		return false;
	});

	//退出
	$("#rh-menu-exit").click(function(){
		$('#rh-menu').menu('hide');
	})
}

//弹出信息窗口 title:标题 msgString:提示信息 msgType:信息类型 [error,info,question,warning]
function msgShow(title, msgString, msgType) {
	$.messager.alert(title, msgString, msgType);
}