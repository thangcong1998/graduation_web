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
        .capitalize {
            text-transform: capitalize;
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
            padding-left: 0.1cm;
            font-size: 0.3cm;
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
            height: 3cm;
        }

        .logo img {
            height: 3cm;
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
            {{--background-image: url({{'storage/'.$personal_info->profile_url}});--}}
            background-repeat: no-repeat;
            background-size: 3cm 4cm;
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
            font-size: 7pt;
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
            font-size: 0.3cm;
            text-align: center;
        }

        .block-after {
            display: inline-block;
            width: 0.52cm;
            height: 0.52cm;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            margin: 0.05cm 0;
            font-size: 0.3cm;
            text-align: center;
        }

        .list-block {
            font-size: 0px;
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
        <table class="full-width" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width: 100%">
                    <img src="{{"storage/".$logo_url}}"/>
                </td>
                <td style="text-align: center; width: 100%">
                    {{$name_sport}}
                </td>
                <td style="width: 100%; text-align: right">
                    <img src="{{"storage/".$image_url}}"/>
                </td>
            </tr>
        </table>
    </div>
    <div style="margin-top: 2px">
        <table class="full-width">
            <tr style="border-top: 1px solid black">
                <td style="text-align: center; font-size: 1.5rem; border-top: 1px solid black">
                    Entry list by Weight Category
                </td>
            </tr>
        </table>
        <table class="full-width" cellspacing="0" cellpadding="0">
            <tr style="border: 1px solid black">
                <td style="border: 1px solid black; text-align: center">NOC</td>
                <td style="border: 1px solid black; text-align: center">Name</td>
                <td style="border: 1px solid black; text-align: center">Date of Birth</td>
                <td style="border: 1px solid black; text-align: center">Weight Category</td>
                <td style="border: 1px solid black; text-align: center">Height</td>
            </tr>
            @foreach($participant_list as $participant)
                <tr>
                    <td style="font-size: 0.6rem; padding-left: 5px">
                        {{$participant['team']['country']['country_code_3_digits']}} - {{$participant['team']['country']['name']}}
                    </td>
                    <td style=" font-size: 0.6rem; padding-left: 5px">
                        {{$participant['family_name']}}  {{$participant['given_name']}}
                    </td>
                    <td style="text-align: center; font-size: 0.6rem">
                        {{$participant['dob']}}
                    </td>
                    <td style="text-align: center; font-size: 0.6rem">
                        {{$participant['weight']}} cm
                    </td>
                    <td style="text-align: center; font-size: 0.6rem">
                        {{$participant['height']}} kg
                    </td>
                </tr>
            @endforeach
        </table>
    </div>
    <div>
        <b style="padding-left: 20px; font-size: 1rem">Total number player : {{count($participant_list)}}</b>
    </div>
</div>
</body>
</html>
