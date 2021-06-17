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
            Entry list by category
        </td>
    </tr>
</table>
<table style="width: 100%" cellspacing="0" cellpadding="0">
    <tr style="border: 1px solid black; width: 100%">
        <td style="border: 1px solid black; text-align: center; width: 25%; font-size: 10px; font-weight: bold">NOC</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 25%; font-weight: bold">Name</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 20%; font-weight: bold">Date of Birth</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 15%; font-weight: bold">Height</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 15%; font-weight: bold">Weight</td>
    </tr>
    @foreach($participant_list as $participant)
        <tr style="width: 100%; border: 1px solid black;">
            <td style=" font-size: 10px; border: 1px solid black; text-align: center; width: 25%">
                {{$participant['team']['country']['country_code_3_digits']}} - {{$participant['team']['country']['name']}}
            </td>
            <td style=" font-size: 10px; border: 1px solid black; text-align: left; width: 25%">
                {{$participant['family_name']}}  {{$participant['given_name']}}
            </td>
            <td style="font-size: 10px; border: 1px solid black; text-align: left; width: 20%">
                {{$participant['dob']}}
            </td>
            <td style="font-size: 10px; border: 1px solid black; text-align: left; width: 15%">
                {{$participant['weight']}} cm
            </td>
            <td style="font-size: 10px; border: 1px solid black; text-align: left; width: 15%">
                {{$participant['height']}} kg
            </td>
        </tr>
    @endforeach
</table>

<p>
    <b style="padding-left: 20px; font-size: 1rem">Total number player : {{count($participant_list)}}</b>
</p>
