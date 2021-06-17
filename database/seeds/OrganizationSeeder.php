<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::insert('insert into m_organizations (name, english_name, abbreviation, is_holder) values
            ("Hội đồng Olympic Châu Á", "Olympic Council of Asia", "OCA", 1),
            ("Ủy ban Olympic Quốc tế", "International Olympic Committee", "IOC", 1),
            ("Ủy ban Olympic quốc gia", "National Olympic Committee", "NOC", 1),
            ("Liên đoàn Thể thao quốc tế", "IF", "IF", 1),
            ("Liên đoàn Thể thao Châu Á", "AF", "AF", 1),
            ("Ban tổ chức Đại hội thể thao Đông Nam Á tại Việt Nam", "VNSGOC", "VNSGOC", 2),
            ("Ban tổ chức Đại hội thể thao Đông Nam Á tiếp theo", "XSGOC", "XSGOC", 1),
            ("Ban tổ chức Đại hội thể thao Châu Á", "AGOC", "AGOC", 1),
            ("Cơ quan phòng chống Doping thế giới", "WADA", "WADA", 1),
            ("Liên đoàn Thể thao quốc gia", "NF", "NF", 1),
            ("Ban chỉ đạo", "Steering Committee", "SC", 2),
            ("Ban tổ chức chính", "Central Organizing Committee", "COC", 2),
            ("Ban tổ chức địa phương", "Local Organizing Committee", "LOC", 2)
        ');
    }
}
