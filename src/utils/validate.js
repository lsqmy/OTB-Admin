export function checkUnusualChar(rule, value, callback) {
    if(value===''){
      callback();
    }
    else if(/[!@#$%^&*~?？！]+/.test(value)){
      callback(new Error('禁止输入特殊字符!'));
    }
    else{
      callback();
    }
}

export function checkMobile(rule, value, callback) {
    if (!value) {
      callback();
    } else if (!(/^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/.test(value))) {
      callback(new Error('手机号码格式不正确'));
    } else {
      callback();
    }
}


