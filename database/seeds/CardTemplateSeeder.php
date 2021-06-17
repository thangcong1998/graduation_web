<?php

use Illuminate\Database\Seeder;
use App\Models\CardTemplate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class CardTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = CardTemplate::create([
            'name' => 'OCA(yellow)',
            'background_color' => '#FFFF00',
            'text_color' => "#000000",
            'text' => "OCA",
        ]);
        $user = CardTemplate::create([
            'name' => 'NOC(yellow)',
            'background_color' => '#FFFF00',
            'text_color' => "#000000",
            'text' => "NOC",
        ]);
        $user = CardTemplate::create([
            'name' => 'IOC(yellow)',
            'background_color' => '#FFFF00',
            'text_color' => "#000000",
            'text' => "IOC",
        ]);
        $user = CardTemplate::create([
            'name' => 'A(yellow)',
            'background_color' => '#FFFF00',
            'text_color' => "#000000",
            'text' => "A",
        ]);
        $user = CardTemplate::create([
            'name' => 'OCA(silver)',
            'background_color' => '#C0C0C0',
            'text_color' => "#000000",
            'text' => "OCA",
        ]);
        $user = CardTemplate::create([
            'name' => 'B(silver)',
            'background_color' => '#C0C0C0',
            'text_color' => "#000000",
            'text' => "B",
        ]);
        $user = CardTemplate::create([
            'name' => 'C(blue)',
            'background_color' => '#0000FF',
            'text_color' => "#FFFFFF",
            'text' => "C",
        ]);
        $user = CardTemplate::create([
            'name' => 'D(yellow)',
            'background_color' => '#FFFF00',
            'text_color' => "#000000",
            'text' => "D",
        ]);
        $user = CardTemplate::create([
            'name' => 'E(red)',
            'background_color' => '#FF0000',
            'text_color' => "#FFFFFF",
            'text' => "E",
        ]);
        $user = CardTemplate::create([
            'name' => 'RT(red)',
            'background_color' => '#FF0000',
            'text_color' => "#FFFFFF",
            'text' => "RT",
        ]);
        $user = CardTemplate::create([
            'name' => 'HB(red)',
            'background_color' => '#FF0000',
            'text_color' => "#FFFFFF",
            'text' => "HB",
        ]);
        $user = CardTemplate::create([
            'name' => 'F(green)',
            'background_color' => '#008000',
            'text_color' => "#000000",
            'text' => "F",
        ]);
        $user = CardTemplate::create([
            'name' => 'Fo(green)',
            'background_color' => '#008000',
            'text_color' => "#000000",
            'text' => "Fo",
        ]);
        $user = CardTemplate::create([
            'name' => 'Fx(green)',
            'background_color' => '#008000',
            'text_color' => "#000000",
            'text' => "Fx",
        ]);
        $user = CardTemplate::create([
            'name' => 'G(pink)',
            'background_color' => '#FFC0CB',
            'text_color' => "#000000",
            'text' => "G",
        ]);
        $user = CardTemplate::create([
            'name' => 'G(purple)',
            'background_color' => '#800080',
            'text_color' => "#FFFFFF",
            'text' => "G",
        ]);
        $user = CardTemplate::create([
            'name' => 'VNSGOC(blue)',
            'background_color' => '#0000FF',
            'text_color' => "#FFFFFF",
            'text' => "VNSGOC",
        ]);
        $user = CardTemplate::create([
            'name' => 'V(pink)',
            'background_color' => '#FFC0CB',
            'text_color' => "#000000",
            'text' => "V",
        ]);
        $user = CardTemplate::create([
            'name' => 'X(black)',
            'background_color' => '#000000',
            'text_color' => "#FFFFFF",
            'text' => "X",
        ]);
        $user = CardTemplate::create([
            'name' => 'O(orange)',
            'background_color' => '#FFA500',
            'text_color' => "#000000",
            'text' => "O",
        ]);
        $user = CardTemplate::create([
            'name' => 'S(brown)',
            'background_color' => '#A52A2A',
            'text_color' => "#FFFFFF",
            'text' => "S",
        ]);
        $user = CardTemplate::create([
            'name' => 'S(black)',
            'background_color' => '#000000',
            'text_color' => "#ffffff",
            'text' => "S",
        ]);
        $user = CardTemplate::create([
            'name' => 'V(blue)',
            'background_color' => '#0000ff',
            'text_color' => "#ffffff",
            'text' => "S",
        ]);

        File::copyDirectory("public/assets/pdf/form_registor_member","storage/app/public/TemplatePDF");
    }
}
