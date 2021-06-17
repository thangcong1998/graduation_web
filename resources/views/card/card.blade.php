<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset=utf-8"/>
    <title>Member card</title>
    <style>
        @page {
            size: 7.42cm 10.15cm
        }

        * {
            margin: 0;
            padding: 0;
        }

        html, body {
            margin: 0;
            height: 10.15cm;
            background-image: url({{'storage/'.$card_display->background_url}});
            background-size: 7.42cm 10.15cm;
            font-family: DejaVu Sans, sans-serif;
            position: relative;
        }

        .page_break {
            page-break-after: always;
        }

        .middle {
            margin-left: 0.42cm;
            font-size: 0.75rem;
            margin-bottom: 0.25cm;
        }

        .left {
            width: 3.88cm;
        }

        .avatar {
            width: 3cm;
            height: 4cm;
            margin-left: 0.42cm;
        }

        .right {
            width: 3.54cm;
        }

        .logo {
            height: 3cm;
        }

        .card_name {
            height: 1cm;
            background-color: {{$card_template->background_color}};
            color: {{$card_template->text_color}};
            font-size: 0.8cm;
            line-height: 0.8cm;
            font-weight: bolder;
            text-align: center;
        }

        .bottom {
            float: left;
            font-size: 1rem;
        }

        .bottom .barcode {
            position: absolute;
            bottom: 0px;
            margin-left: 0.2cm;
        }

        .barcode img {
            width: 3cm;
            height: 1cm;
        }

        .list_icon {
            text-align: right;
        }

        .list_icon span {
            padding: 0;
            margin: 0;
        }

        .list_icon img {
            margin-left: 5px;
            margin-bottom: 10px;
            height: 0.4cm;
            border: 1px solid #000;
        }

        /*    */
        .back {
            padding-top: 0.26cm;
            position: relative;
        }

        .back_avatar {
            width: 1.5cm;
            height: 2cm;
        }
        .back-infos hr {
            border-width: 0px;
        }
        .back-info {
            font-size: 16px;
            line-height: 11px;
            margin-top: 0.2cm;
        }

        .back-logo {
            height: 1.7cm;
        }

        .condition {
            height: 0.93cm;
            font-size: 12px;
            border-bottom: 1px solid #CCC;
            border-top: 1px solid #CCC;
            vertical-align: top;
            text-align: left;
            padding: 0.1cm 0.24cm;
            margin: 0.1cm 0cm;;
        }

        .back-note {
            font-size: 16px;
            padding-left: 0.2cm;
            padding-right: 0.2cm;
        }

        .back-note td {
            vertical-align: top;
        }

        .back-note .back_list_icon {
            font-size: 16px;
            padding-left: 0.28cm;
        }

        .back-note .back_list_icon span {
            display: block;
        }

        .back-note img {
            height: 0.2cm;
        }

        .back-note-part td {
            text-align: left;
            vertical-align: top;
        }

        .sign {
            position: absolute;
            text-align: center;
            right: 0.5cm;
            bottom: 0.5cm;
            max-width: 3cm;
            max-height: 2cm;
            margin-bottom: 10px;
        }

        .sign .sign-image {
            max-width: 3cm;
            max-height: 1.65cm;
        }

        .sign .sign-text {
            font-size: 16px;
        }

        .back .back-description {
            position: absolute;
            bottom: 0;
            text-align: center;
            width: 100%;
            font-size: 30px;
            font-weight: bolder;
        }
    </style>
</head>
<body>
<div class="front page_break">
    <table class="table" style="padding-top: 0.43cm; padding-bottom: 0.55cm" cellpadding="0px" cellspacing="0px">
        <tr>
            <td class="left">
                @if($profile_url)
                    <img class="avatar" src={{"storage/".$profile_url}} />
                @else
                    <img class="avatar" src={{"assets/images/noavata.png"}} />
                @endif
            </td>
            <td class="right" align="right">
                <div style="text-align: center">
                    <img class="logo" src={{"storage/".$card_display->front_icon_url}}>
                </div>
                <div class="card_name">
                    {{$card_template->text}}
                </div>
            </td>
        </tr>
    </table>
    <div class="middle">
        <div>{{$card_info['given_name'].' '.$card_info['family_name']}}</div>
        <div>{{$card_function['english_name']}}</div>
        <div>{{$card_info['responsible_organization']}}</div>
        <div>{{$team->english_name}}</div>
    </div>
    <div class="bottom">
        <div class="icons">
            <div class="list_icon">
                @foreach($areas as $ar)
                    <img src="{{'storage/'.$ar->icon_url}}"/>
                @endforeach
            </div>
            <div class="list_icon">
                @foreach($zones as $zo)
                    <img src="{{'storage/'.$zo->icon_url}}"/>
                @endforeach
            </div>
            <div class="list_icon">
                @foreach($vehicles as $ve)
                    <img src="{{'storage/'.$ve->icon_url}}"/>
                @endforeach
            </div>
        </div>
        <div class="barcode">
            @php
                use Milon\Barcode\DNS1D;
                $barcode = new DNS1D();
                echo '<img src="data:image/png;base64,' . $barcode->getBarcodePNG(strval($card_info->card_no), 'C39+',
                3,33,array(1,1,1)) . '"
            alt="barcode"   />';
            @endphp
            <h6>{{ $card_info->card_no }}</h6>
        </div>
    </div>
</div>
<div class="back">
    <table style="height: 2.2cm" cellpadding="0px" cellspacing="0px" width="100%">
        <tr>
            <td width="1.786cm" align="right">
                @if($profile_url)
                    <img class="back_avatar" src={{"storage/".$profile_url}} />
                @else
                    <img class="back_avatar" src={{"assets/images/noavata.png"}} />
                @endif
            </td>
            <td class="back-infos" style="padding-left: 0.157cm; vertical-align: top; width: 3.9cm; overflow-wrap:
            anywhere">
                <div style="font-size: 20px; font-weight: bolder">
                    <hr />
                    {{$card_info['given_name'].' '.$card_info['family_name']}}
                </div>
                <div class="back-info">
                    <hr />
                    Nationality: {{$nationality['name']}}
                </div>
                <div class="back-info">
                    <hr />
                    D.O.B: {{date('d/m/Y', strtotime($card_info['dob']))}}
                </div>
                <div class="back-info">
                    <hr />
                    Gender: @if($card_info['sex'] == 1) Female @else Male @endif
                </div>
                <div class="back-info">
                    <hr />
                    @if($card_info['passport_no'])
                        Passport.No/ID.No: {{$card_info['passport_no']}}
                    @else
                        Passport.No/ID.No: {{$card_info['personal_id_card_no']}}
                    @endif
                </div>
            </td>
            <td align="right">
                <hr style="border: 0px"/>
                <img class="back-logo" src={{"storage/".$card_display->back_icon_url}}>
                <hr style="border: 0px"/>
            </td>
        </tr>
    </table>
    <div class="condition">
        <hr style="border: 0px"/>
        <span>
            <?php echo $card_display['condition_text'] ?>
        </span>
        <hr style="border: 0px"/>
    </div>
    <table class="back-note" cellpadding="0px" cellspacing="0px" width="100%">
        <tr>
            <td width="4.3cm">
                <table class="back-note-part">
                    @foreach($all_areas as $key => $ar)
                        <tr>
                            <td>
                                <hr style="border: 0px"/>
                                <img src="{{'storage/'.$ar->icon_url}}"/>
                                <hr style="border: 0px"/>
                            </td>
                            <td>
                                <hr style="border: 0px"/>
                                {{$ar->name}}
                                <hr style="border: 0px"/>
                            </td>
                        </tr>
                    @endforeach
                    @foreach($all_vehicle as $key => $ve)
                        <tr>
                            <td>
                                <hr style="border: 0px"/>
                                <img src="{{'storage/'.$ve->icon_url}}"/>
                                <hr style="border: 0px"/>
                            </td>
                            <td>
                                <hr style="border: 0px"/>
                                {{$ve->name}}
                                <hr style="border: 0px"/>
                            </td>
                        </tr>
                    @endforeach
                </table>
            </td>
            <td>
                <table class="back-note-part">
                    @foreach($all_zones as $key => $zo)
                        <tr>
                            <td>
                                <hr style="border: 0px"/>
                                <img src="{{'storage/'.$zo->icon_url}}"/>
                                <hr style="border: 0px"/>
                            </td>
                            <td>
                                <hr style="border: 0px"/>
                                {{$zo->name}}
                                <hr style="border: 0px"/>
                            </td>
                        </tr>
                    @endforeach
                </table>
            </td>
        </tr>
    </table>
    <div class="sign">
        <hr style="border: 0px"/>
        <img class="sign-image" src="{{'storage/'.$card_display->sign_icon_url}}"/>
        <div class="sign-text">
            <hr style="border: 0px" />
            {{$card_display->sign_text}}
            <hr style="border: 0px" />
        </div>
        <hr style="border: 0px"/>
    </div>
    <div class="back-description">
        <hr style="border: 0px"/>
        <span>
                <?php echo $card_display->description_text ?>
        </span>
        <hr style="border: 0px"/>
    </div>
</div>
</body>
</html>
