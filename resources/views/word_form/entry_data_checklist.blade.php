<table style="width: 100%;" cellpadding="0" cellspacing="0">
    <tr style="width: 100%">
        <td style="width: 70%; float: left" colspan="7">
            <img src="{{"storage/".$logo_url}}" width="80" height="80"/>
        </td>
        <td style="width: 30%; float: right" colspan="3">
            <img src="{{"storage/".$image_url}}" width="80" height="80"/>
        </td>
    </tr>
    <tr style="border-top: 1px solid black">
        <td style="text-align: center; font-size: 20px; border-top: 1px solid black; font-weight: bold" colspan="10">
            Entry Data Checklist
        </td>
    </tr>
    <tr style="border: 1px solid black; width: 100%">
        <td style="border: 1px solid black; text-align: center; width: 10%; font-size: 14px; font-weight: bold">Reference</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%; font-weight: bold">Function</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%; font-weight: bold">Family name</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%; font-weight: bold">Given name</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%; font-weight: bold">G</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%; font-weight: bold">Date of birth</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%; font-weight: bold">Height</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%; font-weight: bold">Weight</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%; font-weight: bold">Category</td>
        <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%; font-weight: bold">IF Number</td>
    </tr>
    @foreach($participant_list as $participant)
        <tr style="width: 100%">
            <td style="border: 1px solid black; text-align: center; width: 10%; font-size: 14px">{{$participant['accreditation_number']}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">{{$participant['function']['english_name']}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">{{$participant['family_name']}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">{{$participant['given_name']}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">{{$participant['sex'] == 1 ? "W" : "M"}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">{{$participant['dob']}}</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">{{$participant['height']}} cm</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%">{{$participant['weight']}} kg</td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%"></td>
            <td style="border: 1px solid black; text-align: center; font-size: 14px; width: 10%"></td>
        </tr>
    @endforeach
</table>
