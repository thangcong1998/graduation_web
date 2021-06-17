<table style="width: 100%;">
    <tr style="width: 100%">
        <td style="width: 70%; float: left">
            <img src="{{"storage/".$logo_url}}" width="80" height="80" />
        </td>
        <td style="width: 30%; float: right; text-align: center">
            <img src="{{"storage/".$image_url}}" width="80" height="80"/>
            {{$sport['english_name']}}
        </td>
    </tr>
</table>
<table style="width: 100%">
    <tr style="border-top: 1px solid black">
        <td style="text-align: center; font-size: 20px; border-top: 1px solid black">
            Daily Schedule
        </td>
    </tr>
</table>
<table style="width: 100%">
    <tr style="width: 100% ;border: 1px solid black">
        <td style="width: 10%; text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>Fight No
            </p>
        </td>
        <td style="width: 15%;text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>Weight Category</p>
        </td>
        <td style="width: 15%;text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>Round</p>
        </td>
        <td style="width: 15%;text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>No</p>
        </td>
        <td style="width: 25%;text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>Name</p>
        </td>
        <td style="width: 10%;text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>NOC Code</p>
        </td>
        <td style="width: 10%;text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>Referee
            </p>
        </td>
    </tr>
    @if(count($event['participant']) > 0)
    @foreach($event['match_individual_lists'] as $index => $match_individual_list)
    @foreach($match_individual_list['match_individual_competitors'] as $indexs => $match_individual_competitor)
    <tr>

        @if($indexs == 0)
        <td style="text-align: center;width: 10%; font-size: 17px; border-left: 1px solid black; border-top:1px solid black">
            {{$index + 1}}
        </td>
        @else
        <td style="text-align: center;width: 10%; font-size: 17px; border-left: 1px solid black">
        </td>
        @endif
        @if($indexs == 0)
        <td style="width: 15%; font-size: 17px; border-right: 1px solid black; border-left: 1px solid black; border-top:1px solid black">
            {{$event['english_name']}}
        </td>
        @else
        <td style="text-align: center;width: 10%; font-size: 17px; border-left: 1px solid black">
        </td>
        @endif
        @if($indexs == 0)
        <td style="width: 15%;font-size: 17px; border-right: 1px solid black; border-left: 1px solid black; border-top:1px solid black">
            {{$match_individual_list['name_stage']}}
        </td>
        @else
        <td style="text-align: center;width: 10%; font-size: 17px; border-left: 1px solid black">
        </td>
        @endif
        <td style="width: 15%; font-size: 17px; border: 1px solid black">
            {{$match_individual_competitor['competitor']['registration_number']}}
        </td>
        <td style="width: 25%; font-size: 17px; border: 1px solid black">
            <p>{{$match_individual_competitor['competitor']['given_name']}} {{$match_individual_competitor['competitor']['family_name']}}
            </p>
        </td>
        <td style="width: 10%; font-size: 17px; border: 1px solid black; text-align: center">
            {{$match_individual_competitor['competitor']['team']['country']['country_code_3_digits']}}
        </td>
        @if($indexs == 0)
        <td style="width: 10%; font-size: 17px; border-right: 1px solid black; border-left: 1px solid black; text-align:center; border-top:1px solid black">
            {{count($match_individual_list['match_referee_relations'])}}
        </td>
        @else
        <td style="text-align: center;width: 10%; font-size: 17px; border-left: 1px solid black; border-right: 1px solid black">
        </td>
        @endif
    </tr>
    @endforeach
    @endforeach
    @else
    @foreach($event['match_team_lists'] as $index => $match_team_list)
    @foreach($match_team_list['match_event_team'] as $indexs => $match_event_team)
    <tr>
        @if($indexs == 0)
        <td style="text-align: center;width: 10%; font-size: 17px; border-right: 1px solid black; border-left: 1px solid black; border-top:1px solid black">
            {{$index + 1}}
        </td>
        @else
        <td style="text-align: center;width: 10%; font-size: 17px; border-left: 1px solid black">
        </td>
        @endif
        @if($indexs == 0)
        <td style="width: 15%; font-size: 17px; border-right: 1px solid black; border-left: 1px solid black; border-top:1px solid black">
            {{$event['english_name']}}
        </td>
        @else
        <td style="text-align: center;width: 10%; font-size: 17px; border-left: 1px solid black ">
        </td>
        @endif
        @if($indexs == 0)
        <td style="width: 15%;font-size: 17px; border-right: 1px solid black; border-left: 1px solid black; border-top:1px solid black">
            {{$match_team_list['name_stage']}}
        </td>
        @else
        <td style="text-align: center;width: 10%; font-size: 17px; border-left: 1px solid black">
        </td>
        @endif
        <td style="width: 15%; font-size: 17px; border: 1px solid black">
            @if(isset($match_event_team['event_team']['uniform']))
            goalkeeper_shirt:{{$match_event_team['event_team']['uniform']['goalkeeper_shirt']}};
            goalkeeper_shorts:{{$match_event_team['event_team']['uniform']['goalkeeper_shorts']}};
            player_shirt:{{$match_event_team['event_team']['uniform']['player_shirt']}};
            player_shorts:{{$match_event_team['event_team']['uniform']['player_shorts']}};
            @endif
        </td>
        <td style="width: 25%; font-size: 17px; border: 1px solid black">
            <p style="text-align: left">
                {{$match_event_team['event_team']['team']['english_name']}}
            </p>
        </td>
        <td style="width: 10%; font-size: 17px; border: 1px solid black; text-align: center">
            {{$match_event_team['event_team']['team']['country']['country_code_3_digits']}}
        </td>
        @if($indexs == 0)
        <td style="width: 10%; font-size: 17px; border-right: 1px solid black; border-left: 1px solid black; text-align:center; border-top:1px solid black">
            {{count($match_team_list['match_referee_relations'])}}
        </td>
        @else
        <td style="text-align: center;width: 10%; font-size: 17px; border-left: 1px solid black; border-right: 1px solid black">
        </td>
        @endif
    </tr>
    @endforeach
    @endforeach
    @endif
</table>
