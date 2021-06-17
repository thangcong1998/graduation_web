<table style="width: 100%;" cellpadding="0" cellspacing="0">
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
<table style="width: 100%" cellspacing="0" cellpadding="0">
    <tr style="border-top: 1px solid black">
        <td style="text-align: center; font-size: 20px; border-top: 1px solid black">
            Medal Standings
        </td>
    </tr>
</table>
<table style="width: 100%">
    <tr style="width: 100% ;border: 1px solid black">
        <td style="width: 5%; text-align: center;  border-top: 1px solid black;border-right: 1px solid black;border-left: 1px solid black; font-weight: bold">
            Rank
        </td>
        <td style="width: 25%;text-align: center;  border-top: 1px solid black;border-right: 1px solid black;border-left: 1px solid black; font-weight: bold">
            <p>NOC Code</p>
        </td>
        <td style="width: 5%;text-align: center;  border-top: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 5%;text-align: center;  border-top: 1px solid black; font-weight: bold">
            Men
        </td>
        <td style="width: 5%;text-align: center;  border-top: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 5%;text-align: center;  border-top: 1px solid black;border-right: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 5%;text-align: center; border-top: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 5%;text-align: center;  border-top: 1px solid black; font-weight: bold">
            WM
        </td>
        <td style="width: 5%;text-align: center;  border-top: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 5%;text-align: center;  border-top: 1px solid black;border-right: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 5%;text-align: center;  border-top: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 5%;text-align: center;  border-top: 1px solid black; font-weight: bold">
            Tot
        </td>
        <td style="width: 5%;text-align: center;  border-top: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 5%;text-align: center; border-top: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 10%;text-align: center;  border-top: 1px solid black;border-right: 1px solid black;border-left: 1px solid black; font-weight: bold">
            Rank by Total
        </td>
    </tr>
    <tr style="width: 100% ;border: 1px solid black">
        <td style="width: 5%; text-align: center; border-bottom: 1px solid black;border-right: 1px solid black;border-left: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 25%;text-align: center;  border-bottom: 1px solid black;border-right: 1px solid black;border-left: 1px solid black; font-weight: bold">

        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            G
        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            S
        </td>
        <td style="width: 5%;text-align: center; border: 1px solid black; font-weight: bold">
            B
        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            Tot
        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            G
        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            S
        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            B
        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            Tot
        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            G
        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            S
        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            B
        </td>
        <td style="width: 5%;text-align: center;  border: 1px solid black; font-weight: bold">
            Tot
        </td>
        <td style="width: 10%;text-align: center;  border-bottom: 1px solid black;border-right: 1px solid black;border-left: 1px solid black; font-weight: bold">
        </td>
    </tr>
    @foreach($teams as $team)
    <tr style="width: 100% ;border: 1px solid black">
        <td style="width: 5%; text-align: center; border: 1px solid black ">
            {{$team['medal']['rank_no']}}
        </td>
        <td class="text-left" style="width: 25%;  border: 1px solid black ">
            {{$team['country']['country_code_3_digits']}}-{{$team['country']['name']}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$team['gold_mens'] + $team['gold_men_totals']}}
        </td>
        <td style="width: 5%; border: 1px solid black; text-align:center">
            {{$team['silver_mens'] + $team['silver_men_totals']}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$team['bronze_mens'] + $team['bronze_men_totals']}}
        </td>
        <td style="width: 5%;  border: 1px solid black;text-align:center">
            {{$team['gold_mens'] + $team['gold_men_totals'] + $team['silver_mens'] + $team['silver_men_totals'] + $team['bronze_mens'] + $team['bronze_men_totals']}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$team['gold_womens'] + $team['gold_women_totals']}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$team['silver_womens'] + $team['silver_women_totals']}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$team['bronze_womens'] + $team['bronze_women_totals']}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$team['gold_womens'] + $team['gold_women_totals'] + $team['silver_womens'] + $team['silver_women_totals'] + $team['bronze_womens'] + $team['bronze_women_totals']}}
        </td>
        <td style="width: 5%; border: 1px solid black; text-align:center">
            {{$team['gold_mix_totals']}}
        </td>
        <td style="width: 5%; border: 1px solid black; text-align:center">
            {{$team['silver_mix_totals']}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$team['bronze_mix_totals']}}
        </td>
        <td style="width: 5%; border: 1px solid black; text-align:center">
            {{$team['gold_mix_totals'] + $team['silver_mix_totals'] + $team['bronze_mix_totals']}}
        </td>
        <td style="width: 10%; border: 1px solid black; text-align:center">
            <span>
                {{($team['medal']['gold_medal'])+($team['medal']['silver_medal'])+($team['medal']['bronze_medal'])}}
            </span>

        </td>
    </tr>
    @endforeach
    <tr style="width: 100% ;border: 1px solid black">
        <td style="width: 5%;  border: 1px solid black ">

        </td>
        <td style="width: 25%;  border: 1px solid black ">
            Total:
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$G_MEN}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$S_MEN}}
        </td>
        <td style="width: 5%; border: 1px solid black; text-align:center">
            {{$B_MEN}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$G_MEN + $S_MEN + $B_MEN}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$G_WOMEN}}
        </td>
        <td style="width: 5%; border: 1px solid black; text-align:center">
            {{$S_WOMEN}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$B_WOMEN}}
        </td>
        <td style="width: 5%; border: 1px solid black; text-align:center">
            {{$G_WOMEN + $S_WOMEN + $B_WOMEN}}
        </td>
        <td style="width: 5%; border: 1px solid black; text-align:center">
            {{$G_MIX}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$S_MIX}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$B_MIX}}
        </td>
        <td style="width: 5%;  border: 1px solid black; text-align:center">
            {{$G_MIX + $S_MIX + $B_MIX}}
        </td>
        <td style="width: 10%; border: 1px solid black">

        </td>
    </tr>
</table>
