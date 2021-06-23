<?php

use Illuminate\Database\Seeder;
use App\Models\DisplayCard;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class CardDisplaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table("m_card_displays")->truncate();
        $user = DisplayCard::create([
            'background_url' => "display_card/background.jpg",
            'front_icon_url' => "display_card/graduation31.png",
            'back_icon_url' => "display_card/mascot.png",
            'sign_icon_url' => "display_card/sign.png",
            'condition_text' => "Condition Text",
            'sign_text' => 'Signature of DABGOC Chairman',
            'description_text' => 'The 31th graduation 2021'
        ]);

        File::copyDirectory("public/assets/images/display_card", "storage/app/public/display_card");
    }
}
