export default class Validate {
  static validateCompanyName(arg) {
      var patter = /^[A-Za-z0-9\u4e00-\u9fa5()（）]+$/;
      if (Validate.len(arg) <= 100) {
          if (!patter.test(arg)) return '公司名请输入中文、数字、英文或者括号';
      } else return '公司名长度超过100个字符';
      return true
  }

  static validateName(arg) {
      var patter = /^[a-z|A-Z][^@][\u4E00-\u9FA5\uf900-\ufa2d\w\s.]{1,16}$/;
      if (Validate.len(arg) < 5 || Validate.len(arg) > 16) return '用户名长度应为5-16个字符。';
      var patter1 = /^[^?!@#$%\\^&*()=-]+$/;
      if (!patter1.test(arg)) return '用户名不可以使用特殊字符';
      if (!patter.test(arg)) return '用户名应以字母开头';

      return true
  }

  static validatePassword(arg) {
      var patter = /^([a-zA-Z0-9])*$/;
      var patter1 = /^([a-zA-Z])*$/;
      var patter2 = /^([0-9])*$/;
      if (arg.length < 6) return '有效密码为6-16位数字,字母组合！';
      if (arg.length > 16) return '密码长度不得超过16位';
      if (!patter.test(arg) || (patter1.test(arg) || patter2.test(arg))) return '有效密码为6-16位数字，字母组合！';

      return true
  }

  static validateEmail(arg) {
      var patter = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!patter.test(arg)) return '邮箱输入有误，请输入正确的邮箱地址';

      return true
  }

  static validateMobile(arg) {
      var patter = /^0?(13|15|16|14|17|18|19)[0-9]{9}$/;
      if (!patter.test(arg)) return '手机号不正确!';

      return true;
  }

  //固定电话
  static validateHomePhone(arg) {
      var patter = /^((\d{3,4})?(\-)?\d{7,8}|\d{3}\-\d{6}|(\d{3}\-\d{7}-\d{3}))$/;
      if (!patter.test(arg)) return '固定电话格式不正确';

      return true;
  }

  //身份证
  static validateIdentityCard(arg) {
      var patter = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
      if (!patter.test(arg)) return '身份证号格式不正确';

      return true;
  }

  static validatePasswordAddCheck(password, username) {
      if (password.indexOf(username) >= 0) return '密码不得包括用户名';

      return true;

  }

  static len(s) {
      var l = 0;
      var a = s.split("");
      for (var i = 0; i < a.length; i++) {
          if (a[i].charCodeAt(0) < 299) l++;
          else l += 2;
      }
      return l;
  }
}
