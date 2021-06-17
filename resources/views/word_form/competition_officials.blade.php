<table style="width: 100%;" cellpadding="0" cellspacing="0">
    <tr style="width: 100%">
        <td style="width: 70%; float: left" colspan="4">
            <img src="{{"storage/".$logo_url}}" width="80" height="80"/>
        </td>
        <td style="width: 30%; float: right">
            <img src="{{"storage/".$image_url}}" width="80" height="80"/>
        </td>
    </tr>
    <tr style="border-top: 1px solid black">
        <td style="text-align: center; font-size: 20px; border-top: 1px solid black; font-weight: bold" colspan="5">
            Entry Data Checklist - Competition Officials
        </td>
    </tr>
    <tr>
        <td style="text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">Category</td>
        <td style="text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">Gender</td>
        <td style="text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">Date</td>
        <td style="text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">Number entered</td>
        <td style="text-align: center; font-size: 17px; border: 1px solid black; font-weight: bold">Eligible</td>
    </tr>
    <tr>
        <td style="text-align: center; font-size: 20px; border: 1px solid black; font-weight: bold">
            <p style="margin: 0">
                {{$event['english_name']}}
            </p>
        </td>
        <td style="text-align: center; font-size: 20px; border: 1px solid black; font-weight: bold">
            <p style="margin: 0">
            {{$event['competitor_male'] != 0 && $event['competitor_male'] !== 0 ? "MIX" : $event['competitor_male'] != 0 ? "M" : "W"}}
            </p>
        </td>
        <td style="text-align: center; font-size: 20px; border: 1px solid black; font-weight: bold"></td>
        <td style="text-align: center; font-size: 20px; border: 1px solid black; font-weight: bold">
            <p style="margin: 0">
                {{count($event['participant'])}}
            </p>
        </td>
        <td style="text-align: center; font-size: 20px; border: 1px solid black; font-weight: bold"></td>
    </tr>
</table>
<br />
<table style="width: 100%">
    <tr>
        <td style="text-align: center; font-size: 15px; border: 1px solid black; font-weight: bold; width: 10%">Number</td>
        <td style="text-align: center; font-size: 15px; border: 1px solid black; font-weight: bold; width: 20%">NOC code</td>
        <td style="text-align: center; font-size: 15px; border: 1px solid black; font-weight: bold; width: 50%">Name</td>
        <td style="text-align: center; font-size: 15px; border: 1px solid black; font-weight: bold; width: 20%">Weight(kg)</td>
    </tr>
    @foreach($event['participant'] as $index => $participant)
        <tr>
            <td style="text-align: center; border: 1px solid black; font-size: 15px; width: 10%">
                <p style="margin: 0">
                    {{$index + 1}}
                </p>
            </td>
            <td style="text-align: center; border: 1px solid black; font-size: 15px; width: 20%">
                <p style="margin: 0">
                {{$participant['team']['country']['country_code_3_digits']}}
                </p>
            </td>
            <td style="text-align: center; border: 1px solid black; font-size: 15px; width: 50%">
                <p style="margin: 0">
                {{$participant['family_name']}} {{$participant['given_name']}}
                </p>
            </td>
            <td style="text-align: center; border: 1px solid black; font-size: 15px; width: 20%">
                <p style="margin: 0">
                {{$participant['height']}}
                </p>
            </td>
        </tr>
    @endforeach
</table>
