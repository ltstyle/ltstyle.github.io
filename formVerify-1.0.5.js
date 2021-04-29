/**
 * @file formVerify.js
 * @version 1.0.5
 * @author  Tony_liu
 * @created 2019/11/3 - 2019/12/19
 */


window.Ver = (function (e) {
    /**
     * 绑定的自定义属性名及提交按钮属性名
     * 如需更换，请修改一下变量的值
     * 例：ver-id ---> name   =>  <input ver-id='test'/> ---> <input name='test' />
     */
    var attr = 'ver-id';
    var sbtn = 'ver-submit';

    /**
     * 根节点、自定义属性检测
     */
    var rootNode = e.el ? e.el : '#app';
    var isRoot = document.querySelector(rootNode);
    if (!isRoot) {
        console.error('[VER WARN]: Cannot find element(无法找到元素): ' + rootNode);
        return false
    }

    var DOMs = isRoot.querySelectorAll('['+attr+']');
    var submitBtn = isRoot.querySelectorAll('['+sbtn+']')[0];

    if (!DOMs.length) {
        console.error('[VER WARN]: Cannot find attribute: ' + attr)
        return false
    }

    if (!submitBtn) {
        console.error('[VER WARN]: Cannot find attribute: ' + sbtn)
        return false
    }

    /**
     * DATA及含ver-id的元素的数据集合
     * DOM及DATA自定义ver-id数组
     * success与fail回调数组
     */
    var verid = e.data
    var DOMArray = []
    var VERArray = []

    var SUCCObject = {}
    var SuccAll = {}
    var SuccVal = {}

    var FAILObject = {}
    var FailAll = {}
    var FailVal = {}
    var FailMsg = {}

    var offset_val = [];

    /** 验证提交表单唯一标识，为false时，回调fail函数 **/
    var verifyFlag = true;

    /** 定义Fail, Success对象及回调函数 **/
    var fn = function (fn, data) { fn(data) }

    /**
     * 自定义DOM数据与DATA数据自检
     */
    var verifiy = function () {

        // DOM及DATA数组怼值
        for (let i in verid)
            VERArray.push(i)
        for (let i = 0; i < DOMs.length; i++)
            DOMArray.push(DOMs[i].attributes[attr].nodeValue)

        // 检测是否有重复值
        if(!isRepeat(DOMArray, 'Element') && !isRepeat(VERArray, 'Data')) {
            return false
        }
        function isRepeat(ary, from) {
            let flagArray = new Array()
            for (let i = 0; i < ary.length; i++) {
                if (flagArray[ary[i]]) {
                    console.error('[VER WARN]: Name repeats from ' + from + ': ' + ary[i] )
                    return false
                }
                flagArray[ary[i]] = true
            }
            return true
        }

        // 检测DOM中未在DATA中定义的数据
        for (let key in DOMArray) {
            if (VERArray.indexOf(DOMArray[key])=== -1) {
                console.warn('[VER WARN]: Cannot find AttrValue(未定义的属性值): ' + DOMArray[key])
                // return false
            }

        }

        // 检测DATA中未在DOM中设置的数据并过滤
        let verMoreArr = [];
        for (let key in VERArray) {
            if (DOMArray.indexOf(VERArray[key]) === -1) verMoreArr.push(VERArray[key])
        }
        for(let key of verMoreArr){
            VERArray = VERArray.filter(item => item !== key );
            delete verid[key]
        }
        verMoreArr == '' ? true : console.warn('[VER WARN]: DATA中存在未使用的模块（已忽略）: ' + verMoreArr)

        // 读取及设置DOM中各项自定义属性
        for (let item in verid)
            query(item, verid[item], true, )

    }

    /**
     * 表单验证方法合集
     */
    var query = function (key, obj, isEvn) {

        // this指向window
        let that = this
        let el = DOMs[DOMArray.indexOf(key)]
        let valid_err = 'ver-valid-error'
        let valid_suc = 'ver-valid-success'
        let valid_txt = 'ver-invalid'

        /**
         * 含DOM操作的事件封装 ↓**********************************************************************
         *
        /** Type: email邮箱 **/
        that._email = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            let ver = isEmail(el.value)
            if (ver) {
                that.SuccessSplit(el, key)
            } else {
                let verifyErr = '输入的邮箱格式错误！';
                that.FailSplit(el, ver, key, obj,null, verifyErr);
            }
        }

        /** Type: integer整型 关联属性max、min **/
        that._integer = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()){el.className = ''; return false}

            obj.max || obj.max==0 ? obj.max:obj.max = Infinity
            obj.min || obj.min==0 ? obj.min:obj.min = -Infinity

            let ver = isInteger(el.value)
            let isMax = obj.max >= el.value
            let isMin = obj.min <= el.value

            if (ver && isMax && isMin) {
                that.SuccessSplit(el,key)
            } else {
                let lengthErr = '请输入范围内的整数：';
                let verifyErr = '只能输入整数！';
                that.FailSplit(el, ver, key, obj, lengthErr, verifyErr)
            }

        }

        /** Type: password密码 关联属性maxlength、minlength **/
        that._password = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            obj.maxlength || obj.maxlength==0 ? obj.maxlength : obj.maxlength = Infinity;
            obj.minlength || obj.minlength==0 ? obj.minlength : obj.minlength = 0;

            let val = String(el.value)
            let ver = isPwd(val, obj.minlength, obj.maxlength)
            let isMax = obj.maxlength >= val.length
            let isMin = obj.minlength <= val.length

            if (ver && isMax && isMin) {
                that.SuccessSplit(el,key)
            } else {
                console.log(ver, isMax, isMin)
                let lengthErr = '密码长度个数限制：'
                let verifyErr = '需数字，大写字母，小写字母，特殊字符四选三组成'
                that.FailSplit(el, ver, key, obj, lengthErr, verifyErr, isMin, isMax)
            }


        }

        /** Type: select下拉框 **/
        that._select = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()){el.className = ''; return false}

            let ver = el.value != '' || el.value != 0
            if (ver) {
                that.SuccessSplit(el, key)
            } else {
                let verifyErr = '必选项，请选择！';
                that.FailSplit(el, ver, key, obj,null, verifyErr);
            }
        }

        /** Type: zipCode邮编 **/
        that._zipCode = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            let ver = isZipCode(el.value)
            if (ver) {
                that.SuccessSplit(el, key)
            } else {
                let verifyErr = '非法的邮政编码！';
                that.FailSplit(el, ver, key, obj,null, verifyErr);
            }
        }

        /** Type: phone电话 **/
        that._phone = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            let ver = isPhone(el.value)
            if (ver) {
                that.SuccessSplit(el, key)
            } else {
                let verifyErr = '输入的座机格式错误！';
                that.FailSplit(el, ver, key, obj,null, verifyErr);
            }
        }

        /** Type: mobile手机 **/
        that._mobile = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            let ver = isMobile(el.value)
            if (ver) {
                that.SuccessSplit(el, key)
            } else {
                let verifyErr = '输入的手机格式错误！';
                that.FailSplit(el, ver, key, obj,null, verifyErr);
            }
        }

        /** Type: telephone电话及手机 **/
        that._telephone = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            let ver = isTel(el.value)
            if (ver) {
                that.SuccessSplit(el, key)
            } else {
                let verifyErr = '输入的电话格式错误！';
                that.FailSplit(el, ver, key, obj,null, verifyErr);
            }
        }

        /** Type: digit数字 关联属性maxlength、minlength **/
        that._digit = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            obj.maxlength || obj.maxlength==0 ? obj.maxlength : obj.maxlength = Infinity;
            obj.minlength || obj.minlength==0 ? obj.minlength : obj.minlength = 0;

            let val = String(el.value)
            let ver = isDigits(el.value)
            let isMax = obj.maxlength >= val.length
            let isMin = obj.minlength <= val.length

            if (ver && isMax && isMin) {
                that.SuccessSplit(el,key)
            } else {
                let lengthErr = '数字长度个数限制：'
                let verifyErr = '输入的内容必须为数字！'

                that.FailSplit(el, ver, key, obj, lengthErr, verifyErr)
            }
        }

        /** Type: chinese中文汉字 关联属性maxlength、minlength **/
        that._chinese = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            obj.maxlength || obj.maxlength==0 ? obj.maxlength : obj.maxlength = Infinity;
            obj.minlength || obj.minlength==0 ? obj.minlength : obj.minlength = 0;

            let val = String(el.value)
            let ver = isChinese(el.value)
            let isMax = obj.maxlength >= val.length
            let isMin = obj.minlength <= val.length

            if (ver && isMax && isMin) {
                that.SuccessSplit(el,key)
            } else {
                let lengthErr = '字符长度个数限制：';
                let verifyErr = '内容必须为中文汉字！';
                that.FailSplit(el, ver, key, obj, lengthErr, verifyErr);
            }
        }

        /** Type: chineseChar 中文及字符 关联属性maxlength、maxlength **/
        that._chineseChar = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            obj.maxlength || obj.maxlength==0 ? obj.maxlength : obj.maxlength = Infinity;
            obj.minlength || obj.minlength==0 ? obj.minlength : obj.minlength = 0;

            let val = String(el.value)
            let ver = isChineseChar(el.value)
            let isMax = obj.maxlength >= val.length
            let isMin = obj.minlength <= val.length

            if (ver && isMax && isMin) {
                that.SuccessSplit(el,key)
            } else {
                let lengthErr = '字符长度个数限制：';
                let verifyErr = '只能输入中文及字符！';
                that.FailSplit(el, ver, key, obj, lengthErr, verifyErr);
            }
        }

        /** Type: english 英文字母 关联属性maxlength、minlength **/
        that._english = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            obj.maxlength || obj.maxlength==0 ? obj.maxlength : obj.maxlength = Infinity;
            obj.minlength || obj.minlength==0 ? obj.minlength : obj.minlength = 0;

            let val = String(el.value)
            let ver = isEnglish(el.value)
            let isMax = obj.maxlength >= val.length
            let isMin = obj.minlength <= val.length

            if (ver && isMax && isMin) {
                that.SuccessSplit(el,key)
            } else {
                let lengthErr = '字符长度个数限制：';
                let verifyErr = '内容必须为英文字母！';
                that.FailSplit(el, ver, key, obj, lengthErr, verifyErr);
            }
        }

        /** Type: stringCheck字符验证，只能包含中文、英文、数字、下划线等字符。 关联属性maxlength、minlength **/
        that._stringCheck = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            obj.maxlength || obj.maxlength==0 ? obj.maxlength : obj.maxlength = Infinity;
            obj.minlength || obj.minlength==0 ? obj.minlength : obj.minlength = 0;

            let val = String(el.value)
            let ver = stringCheck(el.value)
            let isMax = obj.maxlength >= val.length
            let isMin = obj.minlength <= val.length

            if (ver && isMax && isMin) {
                that.SuccessSplit(el,key)
            } else {
                let lengthErr = '字符长度个数限制：';
                let verifyErr = '只能包含中文、英文、数字、下划线！';
                that.FailSplit(el, ver, key, obj, lengthErr, verifyErr);
            }
        }

        /** Type: notNull字符非空验证，关联属性maxlength、minlength **/
        that._notNull = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            obj.maxlength || obj.maxlength==0 ? obj.maxlength : obj.maxlength = Infinity;
            obj.minlength || obj.minlength==0 ? obj.minlength : obj.minlength = 0;

            let val = String(el.value)
            let ver = isNotNull(el.value)
            let isMax = obj.maxlength >= val.length
            let isMin = obj.minlength <= val.length

            if (ver && isMax && isMin) {
                that.SuccessSplit(el,key)
            } else {
                let lengthErr = '字符长度个数限制：';
                let verifyErr = '';
                that.FailSplit(el, ver, key, obj, lengthErr, verifyErr);
            }
        }

        /** Type: url 网址**/
        that._url = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            let ver = isUrl(el.value)
            if (ver) {
                that.SuccessSplit(el, key)
            } else {
                let verifyErr = '输入的URL格式错误！';
                that.FailSplit(el, ver, key, obj,null, verifyErr);
            }
        }

        /** Type: idCard 身份证**/
        that._idCard = function () {
            insertAfter(undefined, el, true)
            if (!isRequired()) return false

            let ver = isIdCard(el.value)
            if (ver) {
                that.SuccessSplit(el, key)
            } else {
                let verifyErr = '输入的身份证号格式错误！';
                that.FailSplit(el, ver, key, obj,null, verifyErr);
            }
        }

        /** Success 公共代码  **/
        that.SuccessSplit = function(el, key) {
            el.classList.add(valid_suc);
            el.classList.remove(valid_err);

            obj.value = el.value
            //delete obj.feedback
            delete obj.errMsg

            SuccAll[key] = obj
            SuccVal[key] = el.value
            SUCCObject.all = SuccAll
            SUCCObject.val = SuccVal

            // 清除Fail对象内容
            delete FailAll[key]
            delete FailVal[key]
            delete FailMsg[key]
        }

        /** Fail 公共代码  **/
        that.FailSplit = function(el, ver, key, obj, lengthErr, verifyErr, isMin, isMax) {
            // fail验证 抛出异常
            verifyFlag = false;

            offset_val.push(el.offsetTop)

            let theMax = obj.maxlength
            let theMin = obj.minlength

            if(!theMin && !theMax){
                theMax = obj.max
                theMin = obj.min
            }

            theMax == Infinity ? theMax = '∞' : theMax;

            let cr = document.createElement('div'); cr.className = valid_txt;
            el.classList.add(valid_err);
            el.classList.remove(valid_suc);

            let text = ''
            if (!isMin || !isMax) {
                text = lengthErr + theMin + ' - ' + theMax
            } else {
                theMax == theMin ? text = ver ? lengthErr + theMax : verifyErr : text = ver ? lengthErr + theMin + ' - ' + theMax : verifyErr
            }

            el.value ? cr.innerHTML = text : cr.innerHTML = obj.feedback ? obj.feedback : '不能为空！';

            insertAfter(cr, el)

            obj.value  = el.value
            obj.errMsg = el.value ? text : obj.feedback
            FailAll[key] = obj
            FailVal[key] = el.value
            FailMsg[key] = el.value ? text : obj.feedback
            FAILObject.all = FailAll
            FAILObject.val = FailVal
            FAILObject.msg = FailMsg

            // 清除Success对象内容
            delete SuccAll[key]
            delete SuccVal[key]
        }




        /**
         * 自定义模块内部属性验证***************************************************************
         */
        for (let item in obj) {
            switch (item) {

                case 'required':
                case 'feedback':
                case 'min':
                case 'max':
                case 'minlength':
                case 'maxlength':
                case 'value':
                case 'errMsg':
                    break
                case 'placeholder':
                    setPlaceholder()
                    break
                case 'type':
                    // 判断type属性值:
                    switch (obj[item]) {
                        case 'email':
                            isEvn ? el.onblur = that._email:that._email()
                            break

                        case 'integer':
                            setType('number')
                            isEvn ? el.onchange = that._integer:that._integer()
                            break

                        case 'password':
                            setType(obj[item])
                            isEvn ? el.onblur = that._password:that._password()
                            break

                        case 'select':
                            isEvn ? el.onchange = that._select:that._select()
                            break

                        case 'zipCode':
                            isEvn ? el.onblur = that._zipCode:that._zipCode()
                            break

                        case 'phone':
                            isEvn ? el.onblur = that._phone:that._phone()
                            break

                        case 'mobile':
                            isEvn ? el.onblur = that._mobile:that._mobile()
                            break

                        case 'telephone':
                            isEvn ? el.onblur = that._telephone:that._telephone()
                            break

                        case 'digit':
                            isEvn ? el.onblur = that._digit : that._digit()
                            break

                        case 'chinese':
                            isEvn ? el.onblur = that._chinese : that._chinese()
                            break

                        case 'chineseChar':
                            isEvn ? el.onblur = that._chineseChar:that._chineseChar()
                            break

                        case 'english':
                            isEvn ? el.onblur = that._english:that._english()
                            break

                        case 'stringCheck':
                            isEvn ? el.onblur = that._stringCheck:that._stringCheck()
                            break

                        case 'notNull':
                            isEvn ? el.onblur = that._notNull:that._notNull()
                            break

                        case 'url':
                            isEvn ? el.onblur = that._url:that._url()
                            break

                        case 'idCard':
                            isEvn ? el.onblur = that._idCard:that._idCard()
                            break
                        default:
                            console.error('[VER WARN]: Unknown TypeValue: ' + obj[item])

                    }
                    break

                default:
                    console.error('[VER WARN]: 自定义模块：' + key + ' 属性配置错误：' + item)

            }
        }

        /**
         * 封装正则验证方法 ↓**********************************************************************
         * 指定DOM元素后增加元素
         */
        function insertAfter(newElement, targetElement, remove) {
            let parent = targetElement.parentNode
            let nextEl = targetElement.nextSibling
            if (remove) {
                targetElement.className = targetElement.className.replace(new RegExp('(\\s|^)' + valid_err + '(\\s|$)'), ' ')

                if (nextEl.className=='ver-invalid') {
                    parent.removeChild(nextEl)
                }
                return false
            }
            if (newElement.nodeName!=nextEl.nodeName)
                parent.insertBefore(newElement, nextEl)
        }

        /**
         * 设置Placeholder
         */
        function setPlaceholder() {
            if (el.tagName.toLocaleLowerCase()!='input' && el.tagName.toLocaleLowerCase()!='textarea') {
                console.error('[VER WARN]: placeholder属性只能设置在<input>或<textarea>标签，请检查下面的DOM元素！')
                console.error(el)
            } else {
                el.setAttribute('placeholder', verid[key].placeholder)
            }
        }

        /**
         * 设置Type数值型
         */
        function setType(e) {
            if (el.tagName.toLocaleLowerCase()!='input') {
                console.error('[VER WARN]: type属性只能设置在<input/>标签，请检查下面的DOM元素！')
                console.error(el)
            } else {
                el.setAttribute('type', e)
            }
        }

        /**
         * 检查是否必选项
         */
        function isRequired() {
            if (!obj.required) {
                if (isNull(el.value)) {
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        }

        /**
         * 匹配Email地址
         */
        function isEmail(str) {
            if (str==null || str=='') return false
            var result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
            if (result==null) return false
            return true
        }

        /**
         * 匹配integer
         */
        function isInteger(str) {
            if (str==null || str=='') return false
            var result = str.match(/^[-\+]?\d+$/)
            if (result==null) return false
            return true
        }

        /**
         * 匹配密码，长度在min-max之间， 验证数字，大写字母，小写字母，特殊字符四选三组成的密码强度
         */
        function isPwd(str, min, max) {
            if (str==null || str=='') return false
            let regexStr = '^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{'+min+','+max+'}$'
            let regex = new RegExp(regexStr)
            if ( str.match(regex) == null) return false
            return true
        }

        /**
         * 匹配是否为空
         */
        function isNull(str) {
            if (str)
                return false
            return true
        }

        /**
         * 匹配是否为空
         */
        function isNotNull(str) {
            if (str)
                return true
            return false
        }

        /**
         * 匹配邮政编码
         */
        function isZipCode(str) {
            if (str==null || str=='') return false
            var result = str.match(/^[0-9]{6}$/)
            if (result==null) return false
            return true
        }

        /**
         * 匹配身份证
         */
            function isIdCard(str) {
            if (str==null || str=='') return false
            var result = str.match(/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/)
            if (result==null) return false
            return true
        }

        /**
         * 匹配phone
         */
        function isPhone(str) {
            if (str==null || str=='') return false
            var result = str.match(/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/)
            if (result==null) return false
            return true
        }

        /**
         * 匹配mobile
         */
        function isMobile(str) {
            if (str==null || str=='') return false
            var result = str.match(/^((\(\d{2,3}\))|(\d{3}\-))?((13\d{9})|(15\d{9})|(18\d{9}))$/)
            if (result==null) return false
            return true
        }

        /**
         * 联系电话(手机/电话皆可)验证
         */
        function isTel(text) {
            text = String(text)
            if (isMobile(text) || isPhone(text)) return true
            return false
        }

        /**
         * 匹配汉字
         */
        function isChinese(str){
            if(str==null||str=="") return false;
            var result=str.match(/^[\u4e00-\u9fa5]+$/);
            if(result==null)return false;
            return true;
        }

        /**
         * 匹配中文(包括汉字和字符)
         */
        function isChineseChar(str) {
            if (str==null || str=='') return false
            var result = str.match(/^[\u0391-\uFFE5]+$/)
            if (result==null) return false
            return true
        }

        /**
         * 匹配english
         */
        function isEnglish(str){
            if(str==null||str=="") return false;
            var result=str.match(/^[A-Za-z]+$/);
            if(result==null)return false;
            return true;
        }

        /**
         * 字符验证，只能包含中文、英文、数字、下划线等字符。
         */
        function stringCheck(str){
            if(str==null||str=="") return false;
            var result=str.match(/^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/);
            if(result==null)return false;
            return true;
        }

        /**
         * 只能输入数字[0-9]
         */
        function isDigits(str){
            if(str==null||str=="") return false;
            var result=str.match(/^\d+$/);
            if(result==null)return false;
            return true;
        }

        /**
         * 匹配URL
         */
        function isUrl(str){
            if(str==null||str=="") return false;
            var result=str.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/);
            if(result==null)return false;
            return true;
        }
    }

    /**
     * 表单提交
     */
    var submit = function () {
        verifyFlag = true;

        for (let item in verid)
            query(item, verid[item], false)

        console.log(offset_val)
        console.log(Math.min.apply(null, offset_val))

        window.scrollTo({
            top: Math.min.apply(null, offset_val) - 32,
            behavior: "smooth"
        });
        offset_val = []

        verifyFlag ? fn(e.success, SUCCObject) : fn(e.fail, FAILObject)
    }

    verifiy()

    submitBtn.addEventListener('click', submit)

})
