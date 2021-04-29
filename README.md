## 起步
##### formVerify.js是原生js编写的表单验证插件，提供了多种的表单验证方式，后续功能及验证方式持续更新中...

--------------------------------

##使用方法



```
# 依赖
npm install

# 打包
npm run build 
```

#### 引入formVerify.js文件
```html
# 
<script src="./formVerify-1.0.5.js"></script>

# production
<script src="./dist/formVerify-1.0.5.min.js"></script>
```
#### 声明根节点及实例
##### ver-id为必要属性，值为自定义集合名

```html
<div id="app">
    <input ver-id="test" />
</div>
```
 
如下可设置`<input>`或`<textarea>`的placeholder属性值

```js
var app = new Ver({
    el: '#app',      // 对应根节点元素  
    data: {          // 自定义验证属性合集
        'test': {    // 自定义验证块名
            placeholder: '请输入XXX（必填）',
        }
    },
    success: function(res) {},  // 成功回调函数
    fail:function (err) {}      // 失败回调函数
});

```

#### data相关属性

```bash
'test': {
    required: true,       // 是否必填，值为false或去掉本属性为选填
    type: 'english',      // 验证类型，该字段必填
    feedback: '报错信息',  // DOM为空时的反馈信息，验证信息需要更换js的文本
    placeholder: '请输入', // 设置input元素的placeholder，其他元素无效
    max: 10,              // 整型number的最大值设置，去掉本属性默认为无限大
    min: -10,             // 整型number的最小值设置，去掉本属性默认为无限小
    maxlength: 10,        // 字符型最大输入字符数，去掉本属性默认为无限大
    minlength: 0          // 字符型最小输入字符数，去掉本属性默认为0
},
```


#### Type相关属性
##### 以下对应相关类型的所有属性，其他属性填写将无效
``` 
整数型:  

integer: 数字(Number)
    required: true,
    type: 'integer',
    feedback: '不能为空！',
    max: 10,
    min: 0,
    placeholder: '请输入整数（必填）'

---------------  
字符型:  

digit: 数字(String)                
    required: true,
    type: 'digit',
    maxlength: 10,
    minlength: 5,
    feedback: '不能为空！',
    placeholder: '请输入数字字符（必填）'
    
english: 纯英文
    required: false,
    type: 'english',
    feedback: '不能为空！',
    placeholder: '请输入英文字符（非必填）',
    maxlength: 10,
    minlength: 0    
    
chinese: 纯中文字母
    required: true,
    type: 'chinese',
    feedback: '不能为空！',
    placeholder: '请输入中文字符（必填）',
    maxlength: 10,
    minlength: 0

chineseChar: 中文及标点    
    required: true,
    type: 'chinese',
    feedback: '不能为空！',
    placeholder: '请输入中文字符（必填）',
    maxlength: 10,
    minlength: 0   
   
stringCheck: 字符验证（中文、英文、数字、"-_"）
    required: true,
    type: 'stringCheck',
    feedback: '不能为空！',
    placeholder: '请输入字符（必填）',
    maxlength: 10,
    minlength: 0

isNotNull: 非空验证
    required: true,
    type: 'notNull',
    feedback: '不能为空！',
    placeholder: '请输入字符（必填）',
    maxlength: 10,
    minlength: 0

-----------------
独立类型

email: 电子邮箱
    required: true,
    type: 'email',
    feedback: '请输入正确邮箱！',
    placeholder: '请输入邮箱（必填）'
    
password: 密码
    required: true,
    type: 'password',
    feedback: '不能为空！',
    placeholder: '请输入密码（必填）',
    maxlength: 16,
    minlength: 6,

select: 下拉菜单
    required: true,
    type: 'select',
    feedback: '必须项，请选择！'

zipCode: 邮政编码
    required: false,
    type: 'zipCode',
    feedback: '不能为空！',
    placeholder: '请输入邮编（非必填）' 
    
idCard: 身份证
    required: false,
    type: 'url',
    feedback: '不能为空',
    placeholder: '请输入URL（非必填）'    
        
url: 网址
    required: true,
    type: 'url',
    feedback: '不能为空！',
    placeholder: '请输入URL（非必填）'
    
phone: 电话（7-8位号码）
    required: true,
    type: 'phone',
    feedback: '不能为空！',
    placeholder: '请输入电话号码（必填）'  
 
mobile: 手机（11位号码）
    required: true,
    type: 'mobile',
    feedback: '不能为空！',
    placeholder: '请输入手机号码（必填）'

telephone: 电话加手机（7,8,11位号码）
    required: true,
    type: 'telephone',
    feedback: '不能为空！',
    placeholder: '请输入电话/手机号码（必填）'
```



