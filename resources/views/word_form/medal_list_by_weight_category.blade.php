<table style="width: 100%;">
    <tr style="width: 100%">
        <td style="width: 70%; float: left">
            <img src="{{"storage/".$logo_url}}" width="80" height="80" />
        </td>
        <td style="width: 30%; float: right; text-align: center">
            <img src="{{"storage/".$image_url}}" width="80" height="80" />
            {{$sport['english_name']}}
        </td>
    </tr>
</table>
<table style="width: 100%">
    <tr style="border-top: 1px solid black">
        <td style="text-align: center; font-size: 20px; border-top: 1px solid black">
            Medallists by Weight Category
        </td>
    </tr>
</table>
<table style="width: 100%">
    <tr style="width: 100% ;border: 1px solid black">
        <td style="width: 20%;text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>Weight Category</p>
        </td>
        <td style="width: 20%; text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>Date
            </p>
        </td>
        <td style="width: 15%;text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>Medal
            </p>
        </td>
        <td style="width: 25%;text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>Name
            </p>
        </td>
        <td style="width: 20%;text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">
            <p>NOC Code
            </p>
        </td>
    </tr>
    @foreach($events as $event)
    <?php foreach ($event['stages'] as $stage) : ?>
        @if(isset($event['stages']))
        <?php foreach ($stage['stage_qualification_competitors'] as $index =>  $stage_qualification_competitor) : ?>
            @if(isset($stage_qualification_competitor))
            <tr style="width: 100% ;border: 1px solid black">
                @if($index === 0)
                <td style="width: 20%; font-size: 17px; border-left: 1px solid black; border-top: 1px solid black">
                    {{$event['english_name']}}
                </td>
                @else($index != 0)
                <td style="width: 20%; font-size: 17px; border-left: 1px solid black">
                </td>
                @endif
                @if($index === 0)
                <td style="width: 20%; font-size: 17px; border-left: 1px solid black; border-top: 1px solid black">
                    {{$date}}
                </td>
                @else($index != 0)
                <td style="width: 20%; font-size: 17px; border-left: 1px solid black">
                </td>
                @endif
                <td style="width: 15%; font-size: 17px; border: 1px solid black">
                    @if ($stage_qualification_competitor['qualification_type'] === 2 )
                    Gold
                    @elseif ($stage_qualification_competitor['qualification_type'] == 3 )
                    Silver
                    @else($stage_qualification_competitor['qualification_type'] == 4 )
                    Bronze
                    @endif</td>
                <td style="width: 25%; font-size: 17px; border: 1px solid black">
                    @if($stage_qualification_competitor['participant_id'] == null)
                    {{$stage_qualification_competitor['team']['english_name']}}
                    @else(isset($stage_qualification_competitor)['competitor'])
                    {{$stage_qualification_competitor['competitor']['family_name']}} {{$stage_qualification_competitor['competitor']['given_name']}}
                    @endif
                </td>
                <td style="width: 20%; font-size: 17px; border: 1px solid black">
                    {{$stage_qualification_competitor['team']['country']['country_code_3_digits']}} - {{$stage_qualification_competitor['team']['country']['name']}}
                </td>
            </tr>
            @endif
        <?php endforeach; ?>
        @endif
    <?php endforeach; ?>
    @endforeach
</table>
