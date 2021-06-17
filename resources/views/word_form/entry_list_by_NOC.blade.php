<table style="width: 100%;">
    <tr style="width: 100%">
        <td style="width: 70%; float: left">
            <img src="{{"storage/".$logo_url}}" width="80" height="80"/>
        </td>
        <td style="width: 30%; float: right">
            <img src="{{"storage/".$image_url}}" width="80" height="80"/>
        </td>
    </tr>
</table>
<table style="width: 100%;">
    <tr style="border-top: 1px solid black">
        <td style="text-align: center; font-size: 20px; border-top: 1px solid black; font-weight: bold">
            Entry list by NOC
        </td>
    </tr>
</table>
<table style="width: 100%">
    <tr style="border: 1px solid black; width: 100%">
        <td style="border: 1px solid black; text-align: center; width: 20%; font-size: 10px; font-weight: bold">NOC</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 25%; font-weight: bold">Name</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 5%; font-weight: bold">G</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 15%; font-weight: bold">Weight</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 20%; font-weight: bold">Date of Birth</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 15%; font-weight: bold">Height</td>
    </tr>
    @foreach($NOC as $participant_list)
        @foreach($participant_list['participant_list'] as $index => $participant)
            <tr style="width: 100%; border: 1px solid black;">
                @if($index === 0)
                    <td style=" font-size: 10px; border: 1px solid black; text-align: center; width: 20%">
                        <p style="margin: 0">{{$participant_list['country']['country_code_3_digits']}} - {{$participant_list['country']['name']}}</p>
                    </td>
                @endif
                @if($index !== 0)
                    <td style=" font-size: 10px; border: 1px solid black; text-align: center; width: 20%">
                        <p style="margin: 0">{{$participant_list['country']['country_code_3_digits']}} - {{$participant_list['country']['name']}}</p>
                    </td>
                @endif
                {{--                    @if($index === (intval($participant['count']) - 1))--}}
                {{--                        <td style=" font-size: 10px; border-left: 1px solid black; border-right: 1px solid black; text-align: center; width: 20%; border-bottom: 1px solid black;">--}}
                {{--                        </td>--}}
                {{--                    @endif--}}
                <td style=" font-size: 10px; border: 1px solid black; text-align: center; width: 25%">
                    <p style="margin: 0">{{$participant['family_name']}}  {{$participant['given_name']}}</p>
                </td>
                <td style="font-size: 10px; border: 1px solid black; text-align: center; width: 5%">
                    <p style="margin: 0">{{$participant['sex'] == 1 ? "W" : "M"}}</p>
                </td>
                <td style="font-size: 10px; border: 1px solid black; text-align: center; width: 15%">
                    <p style="margin: 0">{{$participant['weight']}} kg</p>
                </td>
                <td style="font-size: 10px; border: 1px solid black; text-align: center; width: 20%">
                    <p style="margin: 0">{{$participant['dob']}}</p>
                </td>
                <td style="font-size: 10px; border: 1px solid black; text-align: center; width: 15%">
                    <p style="margin: 0">{{$participant['height']}} cm</p>
                </td>
            </tr>
        @endforeach
    @endforeach
</table>
