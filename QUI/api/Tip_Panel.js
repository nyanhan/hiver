QUI = {}

QUI.Tip = function(){}

dom api:
	data-as = "tip"
	data-as-tip-spliter = "|:" //default |
	data-as-tip-dirction = "" //default  auto
	data-as-tip-text = "hello world|:windowadfasd"
	data-as-tip-template = "<div>{#1}{#2}</div>" // give default templates or text or dom
static:
	QUI.Tip( dom, /*text*/, {
		spliter:
		dirction:
		template:
	})
instance:
	tip.text( text )
	tip.template( template )
	tip.spliter( string )
	
remark:
	引入模块自动初始化， 随鼠标移动动态绑定节点， 不需要脚本触发， 当然也可以脚本触发
	＊＊自动判断是否有箭头 （有没有箭头的定位方式恐怕不一样， 这东西最好不要箭头， 随鼠标移动的话计算量很大）
	没有dirction时自动判断方向


QUI.Float = function(){}

dom api:
	data-as = "float"
	data-as-float-spliter = "|:" //default |
	data-as-float-dirction = "" //default  auto
	data-as-float-text = "hello world|:windowadfasd" // or http://requestAPI
	data-as-float-template = "<div>{#1}{#2}</div>" // give default templates or text or dom
static:
	QUI.Float( dom, /*text*/, {
		spliter:
		dirction:
		text:
		template:
		onmouseover:
		ondataloaded:
		onrendercompleted:
	})
instance:
	