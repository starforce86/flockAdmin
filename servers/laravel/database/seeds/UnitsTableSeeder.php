<?php

use Illuminate\Database\Seeder;

class UnitsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('units')->insert([
            'serial' => 'PTH00000001',
            'software_reg_key' => '3318097589'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000002',
            'software_reg_key' => '7139006492'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000003',
            'software_reg_key' => '9391433218'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000004',
            'software_reg_key' => '7082010246'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000005',
            'software_reg_key' => '8816497377'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000006',
            'software_reg_key' => '9340561191'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000007',
            'software_reg_key' => '2264415917'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000008',
            'software_reg_key' => '3703269367'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000009',
            'software_reg_key' => '5184275480'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000010',
            'software_reg_key' => '6999820383'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000011',
            'software_reg_key' => '9291824277'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000012',
            'software_reg_key' => '1762162900'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000013',
            'software_reg_key' => '5844686327'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000014',
            'software_reg_key' => '7710795851'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000015',
            'software_reg_key' => '6333076304'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000016',
            'software_reg_key' => '8381979646'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000017',
            'software_reg_key' => '4210578217'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000018',
            'software_reg_key' => '4650622871'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000019',
            'software_reg_key' => '7441902100'
        ]);
        DB::table('units')->insert([
            'serial' => 'PTH00000020',
            'software_reg_key' => '9368774595'
        ]);
    }
}
