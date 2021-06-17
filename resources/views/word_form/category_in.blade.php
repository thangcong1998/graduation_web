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
            Category Sheet
        </td>
    </tr>
</table>
<table style="width: 100%" cellspacing="0" cellpadding="0">
    <tr style="border: 1px solid black; width: 100%">
        <td style="border: 1px solid black; text-align: center; width: 10%; font-size: 14px">Reference</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 20%">Function</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 20%">Family name</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 20%">Given name</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">G</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">Date of birth</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">Accreditation</td>
    </tr>
    @foreach($referee as $participant)
        <tr style="width: 100%">
            <td style="border: 1px solid black; text-align: center; width: 10%; font-size: 14px">{{$participant['accreditation_number']}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 20%">Referee</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 20%">{{$participant['family_name']}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 20%">{{$participant['given_name']}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">{{$participant['sex'] == 1 ? "W" : "M"}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">{{$participant['dob']}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">{{$participant['accreditation_number']}}</td>
        </tr>
    @endforeach
</table>
