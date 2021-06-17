<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <style type="text/css">

        * {
            margin: 0;
            padding: 0;
        }

        @page {
            width: 21cm;
            height: 29.7cm;
        }

        html, body {
            margin: 0;
            height: 29.7cm;
            font-family: DejaVu Sans, sans-serif;
            display: block;
        }

        .float-left {
            float: left;
        }

        .content {
            padding-left: 0.5cm;
            padding-right: 0.2cm;
        }

        .clear {
            clear: both;
        }

        .full-width {
            width: 100%;
        }

        .vertical-row-middle td {
            vertical-align: middle;
        }

        .bold {
            font-weight: bolder;
        }

        .block {
            display: inline-block;
            width: 0.5cm;
            height: 0.5cm;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            border-left: 1px solid #000;
        }

        .block-none-list {
            border: 1px solid #000;
            height: 0.52cm;
        }

        .block-list {
        }

        .block-list li {
            list-style: none;
            /*display: block;*/
            float: left;
        }

        .block-list .first-block {
            list-style: none;
            display: block;
            width: 0.52cm;
            height: 0.52cm;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            border-left: 1px solid #000;
            float: left;
        }

        .block-list .middle-block {
            list-style: none;
            display: block;
            width: 0.52cm;
            height: 0.52cm;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            float: left;
        }

        .block-list .last-block {
            list-style: none;
            display: block;
            width: 0.52cm;
            height: 0.52cm;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            float: left;
        }

        .page {
            padding: 1cm;
        }

        .logo {
            height: 3.5cm;
        }

        .logo img {
            margin-top: 0.5cm;
            height: 3.5cm;
        }

        .empty {
            border-width: 0px;
        }

        .left {
            font-size: 8pt;
            border-right: 1px solid #000;
        }

        .right {
            width: 4cm;
            vertical-align: top;
            padding-left: 0.5cm;
        }

        .right .right-top {
            width: 100%;
        }

        .right .right-top .photo {
            width: 3cm;
            height: 4cm;
            border: 1px solid #000000;
            margin: auto;
        }

        .right .right-top .organization {
            padding-top: 0.5cm;
        }

        .right .organization .organization-name {
            height: 2cm;
            width: 100%;
        }

        .right .right-bottom {
            margin-top: 0.2cm;
        }

        .right .right-bottom .function {
            font-size: 7pt;
            margin-bottom: 0.2cm;
        }

        .declaration {
            font-size: 0.2cm;
        }

        .footer {
            font-size: 8pt;
        }

        .block-first {
            display: inline-block;
            width: 0.52cm;
            height: 0.52cm;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            border-left: 1px solid #000;
            margin: 0.05cm 0;
        }

        .block-after {
            display: inline-block;
            width: 0.52cm;
            height: 0.52cm;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            margin: 0.05cm 0;
        }

        .list-block {
            font-size: 0;
        }

        .inline-block {
            display: inline-block;
            margin-top: 0.05cm;
        }
    </style>
</head>
<body>
<div class="page">
    <div class="logo">
        <table class="full-width" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #000">
            <tr>
                <td class="left">
                    <div>
                        <img src="{{"storage/".$img->logo_url}}"/>
                        <img src="{{"storage/".$img->image_url}}"/>
                    </div>
                    <div>
                        <span style="padding-right: 0.5cm;text-align: right">
                            <span class="bold" style="margin-right: 2.2cm">
                                Please print clearly in roman / capital letters
                            </span>
                            <div>
                                <span class="list-block">
                                    <span style="display: inline-block; font-size: 8pt; margin-right: 0.1cm">
                                         AD. Card No
                                    </span>
                                    @for($i = 0; $i < 10; $i++)
                                        @if($i == 0)
                                            <span class="block-first">
                                            </span>
                                        @else
                                            <span class="block-after">
                                            </span>
                                        @endif
                                    @endfor
                                </span>
                            </div>
                        </span>
                    </div>
                    <div class="clear"></div>
                    <p>* indicates required field</p>
                    <div>
                        1. Responsible Organization / Tổ chức chịu trách nhiệm *
                        <div class="content">
                            <div class="block-none-list">

                            </div>
                        </div>
                    </div>
                    <div>
                        2. Full name shown in passport / other travel document / Tên ghi trên hộ chiếu
                        <div class="content">
                            Given name / Tên *
                            <div>
                                 <span class="list-block">
                                     <span class="block-first">

                                     </span>
                                     @for($i = 0; $i < 25; $i++)
                                         <span class="block-after">

                                     </span>
                                     @endfor
                                 </span>
                            </div>
                        </div>
                        <div class="content">
                            Family name / Họ *
                            <div>
                                <span class="list-block">
                                    <span class="block-first">

                                    </span>
                                    @for($i = 0; $i < 25; $i++)
                                        <span class="block-after">

                                    </span>
                                    @endfor
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="clear"></div>
                    {{--   passport--}}
                    <div>
                        <div>
                            <span style="margin-right: 4.7cm">
                                3. Passport No. / Số hộ chiếu
                            </span>
                            <span>
                                Expiry Date (DD/MM/YYYY)
                            </span>
                        </div>
                        <div class="content">
                            <span class="list-block">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 13; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                            {{--                            date--}}
                            <span class="list-block" style="padding-left: 1cm">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 1; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                            <span class="list-block" style="padding-left: 0.45cm">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 1; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                            <span class="list-block" style="padding-left: 0.4cm">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 3; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                        </div>
                    </div>
                    <div class="clear"></div>
                    <div>
                        4. Personal Identity Card No. (Vietnam only)
                        <div>
                            <span style="padding-left: 0.52cm; margin-right: 5.6cm">
                                Số chứng minh thư
                            </span>
                            <span>
                                Issue Date / Ngày cấp (DD/MM/YYYY)
                            </span>
                        </div>
                        <div class="content">
                            <span class="list-block">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 13; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                            {{--                            date--}}
                            <span class="list-block" style="padding-left: 1cm">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 1; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                            <span class="list-block" style="padding-left: 0.45cm">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 1; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                            <span class="list-block" style="padding-left: 0.4cm">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 3; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                            <div class="clear"></div>
                            <div>
                                <span>
                                    Issue Organization / Nơi cấp
                                </span>
                            </div>
                            <div class="block-none-list">

                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>
                                 5. Gender *
                            </span>
                            <span style="margin-left: 1.56cm">
                                6. Height *
                            </span>
                            <span style="margin-left: 1.04cm">
                                7. Weight *
                            </span>
                            <span style="margin-left: 1.04cm">
                                8. Country of birth *
                            </span>
                        </div>
                        <div class="content">
                            <div>
                                <span>
                                   Female
                                </span>
                                <span>
                                    Male
                                </span>
                                <span style="margin-left: 0.7cm">
                                     Chiều cao (cm)
                                </span>
                                <span style="margin-left: 0.5cm">
                                    Cân nặng (kg)
                                </span>
                                <span style="margin-left: 0.5cm">
                                    Nơi sinh (ghi tên nước)
                                </span>
                            </div>
                            <div>
                                <span class="list-block">
                                    <span class="block-first">

                                    </span>
                                </span>
                                {{--                                --}}
                                <span class="list-block" style="margin-left: 0.65cm">
                                    <span class="block-first">

                                    </span>
                                </span>
                                {{--                                --}}
                                <span class="list-block" style="margin-left: 1cm">
                                    <span class="block-first">

                                    </span>
                                    @for($i = 0; $i < 2; $i++)
                                        <span class="block-after">

                                    </span>
                                    @endfor
                                </span>
                                {{--                                --}}
                                <span class="list-block" style="margin-left: 1.2cm">
                                    <span class="block-first">

                                    </span>
                                    @for($i = 0; $i < 2; $i++)
                                        <span class="block-after">

                                    </span>
                                    @endfor
                                </span>
                                {{--                                --}}
                                <span class="list-block" style="width: 5.12cm; margin-left: 1.15cm">
                                    <span class="block-none-list inline-block" style="width: 5.12cm">

                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span style="margin-right: 4.9cm">9. Date of birth / Ngày sinh * </span>
                            <span>10. Nationality *</span>
                        </div>
                        <div class="content">
                            <div>
                                <span>D</span>
                                <span style="margin-left: 0.3cm">D</span>
                                <span style="margin-left: 0.8cm">M</span>
                                <span style="margin-left: 0.3cm">M</span>
                                <span style="margin-left: 0.75cm">Y</span>
                                <span style="margin-left: 0.3cm">Y</span>
                                <span style="margin-left: 0.3cm">Y</span>
                                <span style="margin-left: 0.3cm">Y</span>
                                <span style="margin-left: 3.3cm">Quốc tịch</span>
                            </div>
                            <span class="list-block">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 1; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                            {{--                            --}}
                            <span style="margin-left: 0.52cm" class="list-block">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 1; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                            {{--                            --}}
                            <span style="margin-left: 0.52cm" class="list-block">
                                <span class="block-first">

                                </span>
                                @for($i = 0; $i < 3; $i++)
                                    <span class="block-after">

                                </span>
                                @endfor
                            </span>
                            <span class="list-block" style="width: 5.12cm; margin-left: 3.05cm">
                                <span class="block-none-list inline-block" style="width: 5.12cm">

                                </span>
                            </span>
                        </div>
                    </div>
                    <div>
                        11. Permanent Address / Địa chỉ liên hệ
                        <div class="content">
                            <div style="height: 2cm" class="block-none-list">

                            </div>
                        </div>
                    </div>
                    <div>
                        12. Sport/Discipline / Môn thi đấu
                        <div class="content">
                            <div class="block-none-list">

                            </div>
                        </div>
                    </div>
                    <div>
                        13. Responsible organization signature and seal
                        <div class="content">
                            <span class="inline-block" style="width: 7cm; height: 2.2cm; border-bottom: 1px solid #000;">

                            </span>
                            <span>
                                <span>
                                    <span>Date</span>
                                    <span class="list-block">
                                        <span class="block-first">

                                        </span>
                                        @for($i = 0; $i < 1; $i++)
                                         <span class="block-after">

                                        </span>
                                         @endfor
                                    </span>
                                    {{--                            --}}
                                    <span style="margin-left: 0.52cm" class="list-block">
                                        <span class="block-first">

                                        </span>
                                        @for($i = 0; $i < 1; $i++)
                                        <span class="block-after">

                                        </span>
                                        @endfor
                                    </span>
                                    {{--                            --}}
                                    <span style="margin-left: 0.52cm" class="list-block">
                                        <span class="block-first">

                                        </span>
                                        @for($i = 0; $i < 3; $i++)
                                            <span class="block-after">

                                        </span>
                                        @endfor
                                    </span>
                                </span>
                            </span>
                            <div style="line-height: 0.05cm; margin-bottom: 0.1cm">
                                <span>Signature of President or Secretary General</span>
                                <span style="margin-left: 1.85cm">D</span>
                                <span style="margin-left: 0.3cm">D</span>
                                <span style="margin-left: 0.7cm">M</span>
                                <span style="margin-left: 0.3cm">M</span>
                                <span style="margin-left: 0.8cm">Y</span>
                                <span style="margin-left: 0.3cm">Y</span>
                                <span style="margin-left: 0.3cm">Y</span>
                                <span style="margin-left: 0.3cm">Y</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="right">
                    <div class="right-top">
                        <div class="photo">

                        </div>
                        <div class="organization">
                            <div class="organization-name" style="line-height: 35pt; text-align: center; background:
                            {{$back_color_card}};
                                color:
                            {{$text_color}}">
                            <span style="font-size: 20pt; overflow-wrap: anywhere">
                                {{$card_name}}
                            </span>
                            </div>
                            <span style="font-size: 8pt">Function*</span>
                            <hr/>
                            <span style="font-size: 6pt">Indicate one</span>
                        </div>
                    </div>
                    <div class="right-bottom">
                        @php
                            echo $organization;
                        @endphp
                    </div>
                </td>
            </tr>
        </table>
        <div class="declaration">
            <h2>
                APPLICANT DECLARATION
            </h2>
            <p style="text-align: justify">
                1. I understand that the personal data provinded in this form will be used for accreditation purpose and
                to be processed by the
                Danang Asian Beach Games Organizing Committee.
            </p>
            <p style="text-align: justify">
                2. I consent to SEA GAME Organizing Committee making any enquiries needed for processing my
                accreditation application for the Games and for this purpose. I understand that the personal data
                provided in this form may be disclosed to
                Government Security Officials, department and other authorized organizations and persons involved in the
                process. Screen reader
                support enabled.
            </p>
        </div>
        <div class="footer">
            <div class="content">
                <span>
                    Applicant Signature
                </span>
                <span class="inline-block" style="margin-left: 0.1cm; width: 7.28cm; height: 2.4cm; border-bottom: 1px solid #000;">

                </span>
                <span>
                    <span>
                        <span>Date</span>
                        <span class="list-block">
                            <span class="block-first">

                            </span>
                            @for($i = 0; $i < 1; $i++)
                                <span class="block-after">

                            </span>
                            @endfor
                        </span>
                        {{--                            --}}
                        <span style="margin-left: 0.52cm" class="list-block">
                            <span class="block-first">

                            </span>
                            @for($i = 0; $i < 1; $i++)
                                <span class="block-after">

                            </span>
                            @endfor
                        </span>
                        {{--                            --}}
                        <span style="margin-left: 0.52cm" class="list-block">
                            <span class="block-first">

                            </span>
                            @for($i = 0; $i < 3; $i++)
                                <span class="block-after">

                            </span>
                            @endfor
                        </span>
                    </span>
                </span>
                <div style="line-height: 0.05cm; margin-bottom: 0.1cm">
                    <span style="margin-left: 11.5cm">D</span>
                    <span style="margin-left: 0.3cm">D</span>
                    <span style="margin-left: 0.7cm">M</span>
                    <span style="margin-left: 0.3cm">M</span>
                    <span style="margin-left: 0.8cm">Y</span>
                    <span style="margin-left: 0.3cm">Y</span>
                    <span style="margin-left: 0.3cm">Y</span>
                    <span style="margin-left: 0.3cm">Y</span>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
