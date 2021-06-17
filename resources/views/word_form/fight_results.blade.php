<table style="width: 100%;" cellpadding="0" cellspacing="0">
    <tr style="width: 100%">
        <td style="width: 70%; float: left">
            <img src="{{"storage/".$logo_url}}" width="100" height="100" />
        </td>
        <td style="width: 30%; float: right; text-align: center">
            <img src="{{"storage/".$sport['icon']}}" width="100" height="100" />
            {{$sport['english_name']}} - {{$event['english_name']}}
        </td>
    </tr>
</table>
<p style="text-align: center; font-size: 20px; border-top: 1px solid black">
    Fight Results
</p>
@if(count($event['participant']) > 0)
@foreach($event['match_individual_lists'] as $index => $match_individual_list)
<p style="text-align:center; font-size:17px">
    FIGHT NO. {{$index + 1}}
</p>
<p style="font-size:17px; font-weight:bold">{{$sport['english_name']}} - {{$event['english_name']}} - {{$match_individual_list['name_stage']}}</p>
<table style="width: 100%">
    <tr style="width:100%; border: 1px solid black">
        <td style="width:40%;border-left: 1px solid black;border-top: 1px solid black;border-bottom: 1px solid black; font-size:17px; font-weight:bold; text-align:center">
            Scores
        </td>
        <td style="width: 30%;border-top: 1px solid black;border-bottom: 1px solid black "></td>
        <td style="width:30%;border-right: 1px solid black; border-top: 1px solid black;border-bottom: 1px solid black"></td>
    </tr>
    <tr style="width:100%; border: 1px solid black">
        <td style="width: 40%; border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">
            Name
        </td>
        <td style="width:30%;border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">NOC Code</td>
        <td style="width:30%;border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">Result</td>
    </tr>
    @foreach($match_individual_list['match_individual_competitors'] as $match_individual_competitor)
    <tr style="width:100%; border: 1px solid black">
        <td style="width: 40%; border: 1px solid black; font-size:17px">
            {{$match_individual_competitor['competitor']['given_name']}} {{$match_individual_competitor['competitor']['family_name']}}
        </td>
        <td style="width:30%;border: 1px solid black; font-size:17px; text-align:center">
            {{$match_individual_competitor['competitor']['team']['country']['country_code_3_digits']}}
        </td>
        <td style="width:30%;border: 1px solid black; font-size:17px">{{$match_individual_competitor['final_score']}}
        </td>
    </tr>
    @endforeach
</table>

<p style="font-size:17px; font-weight:bold">Referees</p>
<table style="width: 100%">
    <tr style="width: 100%; border: 1px solid black">
        <td style="width: 40%; border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">Name</td>
        <td style="width:20%;border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">NOC</td>
        <td style="width:40%;border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">Function Referee</td>
    </tr>
    @foreach($match_individual_list['match_referee_relations'] as $referee)
    <tr style="width: 100%; border: 1px solid black">
        <td style="width: 40%; border: 1px solid black; font-size:17px">
            {{$referee['referee']['given_name']}} {{$referee['referee']['family_name']}}
        </td>
        <td style="width:20%;border: 1px solid black; font-size:17px; text-align:center">
            {{$referee['referee']['nationality']['country_code_3_digits']}}
        </td>
        <td style="width:40%;border: 1px solid black; font-size:17px">
            {{$referee['referee_role']['english_name']}}
        </td>
    </tr>
    @endforeach
</table>
<br />
<br />
@endforeach
@else
@foreach($event['match_team_lists'] as $index => $match_team_list)
<p style="text-align:center; font-size:17px">
    FIGHT NO. {{$index + 1}}
</p>
<p style="font-size:17px; font-weight:bold">{{$sport['english_name']}} - {{$event['english_name']}} - {{$match_team_list['name_stage']}}</p>
<table style="width: 100%">
    <tr style="width:100%; border: 1px solid black">
        <td style="width:40%;border-top: 1px solid black;border-left: 1px solid black; border-bottom: 1px solid black; font-size:17px; font-weight:bold; text-align:center">
            Scores
        </td>
        <td style="width: 30%;border-top: 1px solid black; border-bottom: 1px solid black"></td>
        <td style="width:30%;border-top: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black"></td>
    </tr>
    <tr style="width:100%; border: 1px solid black">
        <td style="width: 40%; border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">
            Name
        </td>
        <td style="width:30%;border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">NOC Code</td>
        <td style="width:30%;border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">Result</td>
    </tr>
    @foreach($match_team_list['match_event_team'] as $match_event_team)
    <tr style="width:100%; border: 1px solid black">
        <td style="width: 40%; border: 1px solid black; font-size:17px">
            {{$match_event_team['event_team']['name']}}
        </td>
        <td style="width:30%;border: 1px solid black; font-size:17px; text-align:center">
            {{$match_event_team['event_team']['team']['country']['country_code_3_digits']}}
        </td>
        <td style="width:30%;border: 1px solid black; font-size:17px">{{$match_event_team['final_score']}}</td>
    </tr>
    @endforeach
</table>

<p style="font-size:17px; font-weight:bold">Referees</p>
<table style="width: 100%">
    <tr style="width: 100%; border: 1px solid black">
        <td style="width: 40%; border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">Name</td>
        <td style="width:30%;border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">NOC</td>
        <td style="width:30%;border: 1px solid black; font-size:17px; font-weight:bold; text-align:center">Function Referee</td>
    </tr>
    @foreach($match_team_list['match_referee_relations'] as $referee)
    <tr style="width: 100%; border: 1px solid black">
        <td style="width: 40%; border: 1px solid black; font-size:17px">
            {{$referee['referee']['given_name']}} {{$referee['referee']['family_name']}}
        </td>
        <td style="width:30%;border: 1px solid black; font-size:17px; text-align:center">
            {{$referee['referee']['nationality']['country_code_3_digits']}}
        </td>
        <td style="width:30%;border: 1px solid black; font-size:17px">
            {{$referee['referee_role']['english_name']}}
        </td>
    </tr>
    @endforeach
</table>
<br />
<br />
@endforeach
@endif