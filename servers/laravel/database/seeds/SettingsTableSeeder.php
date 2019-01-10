<?php

use Illuminate\Database\Seeder;

class SettingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('settings')->insert([
            'key' => 'LAST_UPLOADED_SOFTWARE_VERSION',
            'param1' => 'mac',
            'value' => '1.0'
        ]);
        DB::table('settings')->insert([
            'key' => 'LAST_UPLOADED_SOFTWARE_VERSION',
            'param1' => 'win',
            'value' => '1.0'
        ]);
        DB::table('settings')->insert([
            'key' => 'LAST_PUSHED_SOFTWARE_VERSION',
            'param1' => 'mac',
            'value' => '1.0'
        ]);
        DB::table('settings')->insert([
            'key' => 'LAST_PUSHED_SOFTWARE_VERSION',
            'param1' => 'win',
            'value' => '1.0'
        ]);
        DB::table('settings')->insert([
            'key' => 'LAST_UPLOADED_FIRMWARE_VERSION',
            'value' => '1.0'
        ]);
        DB::table('settings')->insert([
            'key' => 'LAST_PUSHED_FIRMWARE_VERSION',
            'value' => '1.0'
        ]);
    }
}
