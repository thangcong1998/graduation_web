<tbody>
<table style="width: 100%;">
    <tr style="width: 100%">
        <td style="width: 70%; float: left" colspan="11">
            <img src="{{"storage/".$logo_url}}" width="80" height="80"/>
        </td>
        <td style="width: 30%; float: right" colspan="5">
            <img src="{{"storage/".$image_url}}" width="80" height="80"/>
        </td>
    </tr>
    <tr style="border-top: 1px solid black; width: 100%">
        <td style="text-align: center; font-size: 20px; border-top: 1px solid black; font-weight: bold" colspan="16">
            Number of Entries by NOC
        </td>
    </tr>
    <tr style="border: 1px solid black">
        <td style="border: 1px solid black; font-size: 14px; width: 2cm; text-align: center; font-weight: bold">
            <p style="margin: 0">Event</p>
        </td>
        @foreach($number_entry as $team)
            <td style="border: 1px solid black; font-size: 14px; width: 30px; text-align: center; font-weight: bold">
                <p style="margin: 0;">{{$team['country']['country_code_3_digits']}}</p>
            </td>
        @endforeach
        <td style="border: 1px solid black; font-size: 14px; width: 30px; text-align: center; font-weight: bold">
            <p style="margin: 0">Total</p>
        </td>
    </tr>
    @foreach($sport_discipline_event as $event)
        <tr style="border: 1px solid black; width: 100%">
            <td style="border: 1px solid black; font-size: 14px; width: 2cm; font-weight: bold">
                <p style="margin: 0;">{{$event['english_name']}}</p>
            </td>
            {{$count = 0}}
            @foreach($number_entry as $team)
                {{$count = $count + intval($event[$team['english_name']])}}
                <td style="border: 1px solid black; font-size: 14px; width: 30px; text-align: center">
                    <p style="margin: 0">{{$event[$team['english_name']]}}</p>
                </td>
            @endforeach
            <td style="border: 1px solid black; font-size: 14px; width: 30px; text-align: center">
                <p style="margin: 0">{{$count}}</p>
            </td>
        </tr>
    @endforeach
    <tr style="border: 1px solid black">
        <td style="border: 1px solid black; font-size: 14px; width: 2cm; text-align: center; font-weight: bold">
            <p style="margin: 0">Total</p>
        </td>
        {{$count_team = 0}}
        @foreach($number_entry as $team)
            {{$count_team = $count_team + intval($team['count'])}}
            <td style="border: 1px solid black; font-size: 14px; width: 30px; text-align: center; font-weight: bold">
                <p style="margin: 0;">{{$team['count']}}</p>
            </td>
        @endforeach
        <td style="border: 1px solid black; font-size: 14px; width: 30px; text-align: center; font-weight: bold">
            <p style="margin: 0">{{$count_team}}</p>
        </td>
    </tr>
</table>
</tbody>
