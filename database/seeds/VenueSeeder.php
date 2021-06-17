<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class VenueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('competitor_venues')->insert([
            'name' => 'Sân vận động Mỹ Đình – Sân vận động quốc gia lớn thứ hai Việt Nam',
            'address' => 'đường Lê Đức Thọ - Mỹ Đình 1 – Nam Từ Liêm – Hà Nội',
            'region' => 3945,
            'latitude' => '21.0203036',
            'longtitude' => '105.7652441',
            'html' => '<div class="clearfix">
                        <div class="hometext m-bottom">S&acirc;n vận động Quốc gia Mỹ Đ&igrave;nh l&agrave; s&acirc;n vận động quốc gia Việt Nam lớn thứ hai nh&igrave; Việt Nam (sau s&acirc;n vận động Cần Thơ). Nơi đ&acirc;y diễn ra những trận đấu lớn, thu h&uacute;t h&agrave;ng ngh&igrave;n cổ động vi&ecirc;n nước nh&agrave;.</div>
                        </div>
                        <div id="news-bodyhtml" class="bodytext margin-bottom-lg">
                        <p><strong>S&acirc;n Mỹ Đ&igrave;nh ở đ&acirc;u?</strong></p>
                        <p>Năm 2001, Việt Nam quyết định x&acirc;y dựng s&acirc;n vận động quốc gia Mỹ Đ&igrave;nh với mục đ&iacute;ch phục vụ cho SEA Games 2003. S&acirc;n vận động quốc gia Mỹ Đ&igrave;nh nằm tr&ecirc;n đường L&ecirc; Đức Thọ (Mỹ Đ&igrave;nh 1 &ndash; Nam Từ Li&ecirc;m &ndash; H&agrave; Nội). Đ&acirc;y l&agrave; s&acirc;n vận động lớn thứ hai cả nước với hơn 40.000 chỗ ngồi (chỉ sau s&acirc;n vận động Cần Thơ &ndash; gần 50.000 chỗ ngồi).</p>
                        <div><img src="https://travel360.vn/uploads/chia-se/hanoi/dia-diem-du-lich-ha-noi/san-van-dong-my-dinh.jpg" alt="san van dong my dinh" width="1000" height="606" /></div>
                        <p><em>Cổng s&acirc;n vận động quốc gia Mỹ Đ&igrave;nh</em></p>
                        <p><strong>Thiết kế s&acirc;n vận động quốc gia Mỹ Đ&igrave;nh</strong></p>
                        <p>S&acirc;n vận động Mỹ Đ&igrave;nh được thiết kế gồm 4 kh&aacute;n đ&agrave;i (A, B, C, D) trong đ&oacute; kh&aacute;n đ&agrave;i A v&agrave; B với thiết kế m&aacute;i che gồm 2 tầng. Kh&aacute;n đ&agrave;i C v&agrave; D &nbsp;thiết kế 1 tầng, kh&ocirc;ng c&oacute; m&aacute;i che. Mặt ch&iacute;nh của s&acirc;n rộng 105 m&eacute;t x 68 m&eacute;t.</p>
                        <p>S&acirc;n vận động quốc gia Mỹ Đ&igrave;nh gồm 1 s&acirc;n ch&iacute;nh v&agrave; 2 s&acirc;n tập với diện t&iacute;ch 17.5 ha. Chức năng ch&iacute;nh của s&acirc;n l&agrave; nhằm phục vụ cho m&ocirc;n thể thao Vua v&agrave; m&ocirc;n thi đấu điền kinh (với 8 đường chạy v&ograve;ng 400m v&agrave; 10 đường chạy thẳng 110m). Ngo&agrave;i ra, m&ocirc; h&igrave;nh s&acirc;n vận động quốc gia Mỹ Đ&igrave;nh c&ograve;n c&oacute; 2 s&acirc;n nhảy cao, 2 s&acirc;n cho m&ocirc;n n&eacute;m tạ, n&eacute;m lao, 2 sần nhảy s&agrave;o k&eacute;p v&agrave; 2 khu cho m&ocirc;n nhảy xa k&eacute;p.</p>
                        <p>Với 419 ph&ograve;ng chức năng, 337 đ&egrave;n chiếu s&aacute;ng được bố tr&iacute; ở 4 cột cao 54m kh&aacute;c nhau, s&acirc;n vận động quốc gia Mỹ Đ&igrave;nh đ&aacute;p ứng đủ cho hơn 40.000 chỗ ngồi, trong đ&oacute; c&oacute; 450 ghế VIP v&agrave; 160 ghế d&agrave;nh cho ph&oacute;ng vi&ecirc;n b&aacute;o ch&iacute;.</p>
                        <p><strong>C&aacute;c hoạt động tr&ecirc;n s&acirc;n Mỹ Đ&igrave;nh</strong></p>
                        <div><img src="https://travel360.vn/uploads/chia-se/hanoi/dia-diem-du-lich-ha-noi/san-van-dong-my-dinh-tu-tren-cao.jpg" alt="san van dong my dinh tu tren cao" width="1000" height="563" /></div>
                        <p><em>S&acirc;n vận động Mỹ Đ&igrave;nh nh&igrave;n từ tr&ecirc;n cao</em></p>
                        <p>Ch&iacute;nh thức hoạt động từ ng&agrave;y 2/9/2003, đ&acirc;y l&agrave; s&acirc;n vận động tổ chức Đại hội Thể thao Đ&ocirc;ng Nam &Aacute; năm 2003 với lễ khai mạc, bế mạc v&agrave; c&aacute;c trận đấu m&ocirc;n b&oacute;ng đ&aacute; nam v&agrave; điền kinh. Trận đấu đầu ti&ecirc;n tr&ecirc;n s&acirc;n Mỹ Đ&igrave;nh l&agrave; trận đấu giữa U23 Việt Nam v&agrave; CLB Th&acirc;n Hoa Thượng Hải (Trung Quốc).</p>
                        <p>Ngo&agrave;i ra, đ&acirc;y cũng l&agrave; nơi tổ chức Lễ Khai mạc Đại hội Thể thao Trong nh&agrave; ch&acirc;u &Aacute; lần III diễn ra ng&agrave;y 30/10 &ndash; 8/11/2009. Th&aacute;ng 7/2007, s&acirc;n Mỹ Đ&igrave;nh l&agrave; 1 trong 4 s&acirc;n vận động ở 4 nước kh&aacute;c nhau đăng cai giải C&uacute;p b&oacute;ng đ&aacute; ch&acirc;u &Aacute;.</p>
                        <p>Từ ng&agrave;y th&agrave;nh lập cho đến nay, s&acirc;n vận động quốc gia Mỹ Đ&igrave;nh đ&atilde; diễn ra biết bao trận đấu trong c&aacute;c giải. Mỗi trận đấu lại thu h&uacute;t h&agrave;ng ng&agrave;n người h&acirc;m mộ b&oacute;ng đ&aacute; Việt Nam. C&oacute; thể thấy, h&igrave;nh nhất đẹp nhất đ&oacute; l&agrave; khi Việt Nam v&ocirc; địch AFF CUP năm 2008. V&agrave; mới đ&acirc;y nhất l&agrave; giải U23 ch&acirc;u &Aacute; diễn ra tại Thường Ch&acirc;u Trung Quốc.</p>
                        <div><img src="https://travel360.vn/uploads/chia-se/hanoi/dia-diem-du-lich-ha-noi/san-van-dong-my-dinh5.jpg" alt="san van dong my dinh5" width="1000" height="618" /></div>
                        <p><em>Kh&aacute;n đ&agrave;i c&oacute; m&aacute;i che tại s&acirc;n Mỹ Đ&igrave;nh</em></p>
                        <p>C&oacute; thể thấy, d&ugrave; trận đấu c&oacute; diễn ra trực tiếp tr&ecirc;n s&acirc;n Mỹ Đ&igrave;nh hay kh&ocirc;ng, th&igrave; tinh thần của người Việt Nam vẫn lu&ocirc;n d&acirc;ng cao như vậy. C&oacute; lẽ, mỗi người d&acirc;n Việt Nam sẽ kh&ocirc;ng bao giờ qu&ecirc;n khoảnh khắc cờ đỏ sao v&agrave;ng nhuận đỏ Mỹ Đ&igrave;nh, m&agrave; người ta hay gọi với cụm từ &ldquo;chảo lửa Mỹ Đ&igrave;nh&rdquo;.</p>
                        <p>V&igrave; t&igrave;nh y&ecirc;u b&oacute;ng đ&aacute; v&agrave; niềm tự h&agrave;o d&acirc;n tộc m&agrave; bất cứ trận đấu n&agrave;o c&oacute; đội tuyển Việt Nam tham gia, kh&aacute;n đ&agrave;i của s&acirc;n vận động Mỹ Đ&igrave;nh thường chật k&iacute;n người. Bất chấp gi&aacute; v&eacute; đắt &ndash; rẻ, hay phải mua v&eacute; từ những phe v&eacute;, c&oacute; gi&aacute; l&ecirc;n đến hơn 1 triệu đồng th&igrave; tất cả vẫn kh&ocirc;ng cản bước được tinh thần y&ecirc;u b&oacute;ng đ&aacute; của người Việt ta.</p>
                        <p><strong>Đến s&acirc;n vận động quốc gia Mỹ Đ&igrave;nh bằng phương tiện g&igrave;?</strong></p>
                        <div><img src="https://travel360.vn/uploads/chia-se/hanoi/dia-diem-du-lich-ha-noi/san-van-dong-my-dinh-4.jpg" alt="san van dong my dinh 4" width="1000" height="667" /></div>
                        <p><em>Mỗi trận đấu, s&acirc;n Mỹ &nbsp;Đ&igrave;nh thu h&uacute;t h&agrave;ng ng&agrave;n lượt người xem</em></p>
                        <p>- Xe m&aacute;y/oto (c&oacute; b&atilde;i gửi xe)</p>
                        <p>- Taxi, xe &ocirc;m</p>
                        <p>- Xe bus: Gồm c&aacute;c tuyến 09, 26, 28 v&agrave; 50</p>
                        <p><strong>C&aacute;c hoạt động tại s&acirc;n Mỹ Đ&igrave;nh</strong></p>
                        <p>V&agrave;o những ng&agrave;y thường, nơi đ&acirc;y kh&ocirc;ng n&aacute;o nhiệt nhưng vẫn l&agrave; điểm đến y&ecirc;u th&iacute;ch của nhiều người nhằm dạo chơi, thư gi&atilde;n, h&oacute;ng gi&oacute;. Đơn giản chỉ l&agrave; việc họ đến v&agrave; nằm d&agrave;i tr&ecirc;n b&atilde;i cỏ, hay chạy nhảy, thả diều. Buổi tối đến, rất nhiều qu&aacute;n tr&agrave; đ&aacute; ở cổng Mỹ Đ&igrave;nh mở ra, nhiều bạn trẻ đến đ&acirc;y uống nước, h&oacute;ng gi&oacute;, t&acirc;m sự.</p>
                        <div><img src="https://travel360.vn/uploads/chia-se/hanoi/dia-diem-du-lich-ha-noi/san-van-dong-my-dinh-3.jpg" alt="san van dong my dinh 3" width="1000" height="667" /></div>
                        <p><em>Chảo lửa Mỹ Đ&igrave;nh sau giải U23 ch&acirc;u &Aacute;</em></p>
                        <p>S&acirc;n vận động quốc gia Mỹ Đ&igrave;nh đang dần trở th&agrave;nh một điểm đến y&ecirc;u th&iacute;ch cho giới trẻ v&agrave;o mỗi dịp cuối tuần. Đến đ&acirc;y, rất nhiều b&atilde;i để xe (gi&aacute; hơi mắc, t&ugrave;y từng thời điểm). Hơn nữa, b&ecirc;n cạnh đ&oacute; rất nhiều quan ăn với những m&oacute;n ăn ngon. Bạn sẽ c&oacute; một ng&agrave;y trải nghiệm, vui chơi thoả th&iacute;ch v&agrave; được ăn những m&oacute;n ăn ngon. Chẳng c&ograve;n g&igrave; tuyệt vời hơn thế.</p>
                        <p><strong>C&aacute;c kh&aacute;ch sạn gần s&acirc;n vận động quốc gia Mỹ Đ&igrave;nh</strong></p>
                        <p>- Ping Hotel Mỹ Đ&igrave;nh</p>
                        <p>Địa chỉ: số 26-28 Mễ Tr&igrave; Hạ - Mễ Tr&igrave; - Từ Li&ecirc;m - H&agrave; Nội</p>
                        <p>Điện thoại li&ecirc;n hệ: 024 3785 8408</p>
                        <p>- Crowne Plaza Hotel West Hanoi</p>
                        <p>Địa chỉ: Số 36 L&ecirc; Đức Thọ, Mỹ Đ&igrave;nh - Nam Từ Li&ecirc;m - H&agrave; Nội</p>
                        <p>Điện thoại li&ecirc;n hệ: 024 6270 6688</p>
                        <p>- JW Marriott Hotel Hanoi</p>
                        <p>Địa chỉ: Số 8 Đỗ Đức Dục - Mễ Tr&igrave; - Nam Từ Li&ecirc;m - H&agrave; Nội</p>
                        <p>Điện thoại li&ecirc;n hệ: 024 3833 5588</p>
                        </div>',
        ]);
        DB::table('competitor_venues')->insert([
            'name' => 'Cung Thể Thao Quần Ngựa',
            'region' => 3945,
            'address' => 'Văn Cao, Quận Ba Đình, Hà Nội',
            'latitude' => '21.0203036',
            'longtitude' => '105.7652441',
            'html' => '<p><a href="http://musicshow.vn/user/cungthethaoquanngua_u241"><strong>Cung thể thao Quần Ngựa</strong></a>&nbsp;l&agrave; một cung thể thao tại quận Ba Đ&igrave;nh, H&agrave; Nội.Cung nằm cuối đường Văn Cao, s&aacute;t ng&atilde; ba Văn Cao-Ho&agrave;ng Hoa Th&aacute;m.<br /><br /></p>
                        <div style="text-align: center;"><img style="display: block; margin-left: auto; margin-right: auto;" src="http://musicshow.vn/images/upload/city%20guide/trung%20tam%20van%20hoa/cung%20the%20thao%20quan%20ngua/nha-thi-dau-cung-the-thao-quan-ngua.jpg" alt="cung thể thao quần ngựa musicshow" width="450" height="280" /><br /><br /><em>B&ecirc;n ngo&agrave;i Cung thể thao Quần Ngựa</em></div>
                        <p><br />Cung Thể Thao Quần Ngựa được x&acirc;y dựng tr&ecirc;n phần đất của s&acirc;n vận động Quần Ngựa cũ. Cung thể thao n&agrave;y l&agrave; nơi đ&atilde; diễn ra c&aacute;c sự kiện lớn của Thể Thao Việt Nam như Sea Games 22, lễ bế mạc Asean Para Games, Asian Indoor Games III. Hiện nay cung thể thao n&agrave;y l&agrave; một nơi quan trọng nhằm phục vụ cho nhu cầu tập luyện v&agrave; thi đấu c&aacute;c bộ m&ocirc;n thể thao. nơi đ&acirc;y kh&ocirc;ng chỉ phục vụ cho nhu cầu thể thao m&agrave; c&ograve;n phục vụ cho rất nhiều mục đ&iacute;ch kh&aacute;c như: hội trường, họp, tổ chức biểu diễn,...<br /><br /></p>
                        <div><img style="display: block; margin-left: auto; margin-right: auto;" src="http://musicshow.vn/images/upload/city%20guide/trung%20tam%20van%20hoa/cung%20the%20thao%20quan%20ngua/hoi-truong-cung-the-thao-quan-ngua.jpg" alt="" width="450" height="300" /></div>
                        <div style="text-align: center;"><em><br />Cung thể thao Quần Ngựa c&oacute; sức chứa l&ecirc;n tới 5000 người.</em></div>
                        <p><br />Cung c&oacute; c&aacute;c khu vực ch&iacute;nh sau:<br />Hội trường<br />Ph&ograve;ng tập luyện<br />Nh&agrave; thi đấu</p>',
        ]);

        File::copyDirectory("public/assets/images/venue","storage/app/public/venue");
    }
}
