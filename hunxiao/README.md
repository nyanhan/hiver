前端解混淆代码

工作方式:
	1. 后台提供混淆过的列表数据。
	2. 通过前端的js代码反解出真实数据。

混淆内容:
	1. 列表排序。
	2. 价格信息。

使用方法:
	1. 引入 mix_up.js 文件。
	2. 确定 mxl 加密算子位置, 有修改可以重写 QNR.mix_up.prototype.mxl 函数。 位置找后台要。
	3. 确定 价格混淆算子， 可以重写 QNR.mix_up.prototype.delta 函数, 算法找后台要。
	4. 确定 价格字段位置。
	4. new QNR.mix_up().unpack( 混淆过的数据列表 );

验证方法:
	1. 把unhunxiao.html 打开修改混淆前和混淆后接口地址， 修改混淆字段名。
	2. 用浏览器打开查看结果。