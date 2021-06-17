<table style="width: 100%;" cellpadding="0" cellspacing="0">
    <tr style="width: 100%">
        <td style="width: 70%; float: left">
            <img src="{{"storage/".$logo_url}}" width="80" height="80"/>
        </td>
        <td style="width: 30%; float: right">
            <img src="{{"storage/".$image_url}}" width="80" height="80"/>
        </td>
    </tr>
</table>
<table style="width: 100%;" cellspacing="0" cellpadding="0">
    <tr style="border-top: 1px solid black">
        <td style="text-align: center; font-size: 20px; border-top: 1px solid black; font-weight: bold">
            Referee and judges
        </td>
    </tr>
</table>
<table style="width: 100%" cellspacing="0" cellpadding="0">
    <tr style="border: 1px solid black; width: 100%">
        <td style="border: 1px solid black; text-align: center; width: 10%; font-size: 10px; font-weight: bold">Referees/Judges No</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 30%; font-weight: bold">Name</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 30%; font-weight: bold">NOC</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 30%; font-weight: bold">Qualification Lever</td>
    </tr>
    {{ $index = 1 }}
    @foreach($referee as $participant)
        <tr style="width: 100%; border: 1px solid black;">
            <td style=" font-size: 10px; border: 1px solid black; text-align: center; width: 10%">
                {{$index}}
            </td>
            <td style=" font-size: 10px; border: 1px solid black; text-align: left; width: 30%">
                {{$participant['family_name']}}  {{$participant['given_name']}}
            </td>
            <td style="font-size: 10px; border: 1px solid black; text-align: left; width: 30%">
                {{$participant['nationality']['country_code_3_digits']}} - {{$participant['nationality']['name']}}
            </td>
            <td style="font-size: 10px; border: 1px solid black; text-align: left; width: 30%">
                Referee
            </td>
        </tr>
        {{ $index = $index + 1 }}
    @endforeach
</table>
