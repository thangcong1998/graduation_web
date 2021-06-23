<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta charset="utf-8">
</head>

<body>
    <h2 style="text-align: center">Xin chào: {{$email_data['name']}}</h2>
    <br><br>
    <h4>Chúng tôi nhận được yêu cầu lấy lại mật khẩu của bạn trên Hệ thống thể thao.</h4>
    <h4><b>Mật khẩu của bạn được đặt lại là {{$email_data['password']}}</b></h4>
    <a href="{{env('APP_REACT_URL')}}/resetPassword/{{$email_data['password']}}/{{$email_data['user_name']}}">
        <h4>Xác nhận đặt lại mật khẩu</h4>
    </a>
    <br>
    <h4><b>Hãy đặt lại mật khẩu khi đăng nhập lần tiếp theo để bảo mật thông tin của bạn</b></h4>
</body>

</html>