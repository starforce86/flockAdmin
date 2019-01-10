<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'Maxim',
            'email' => 'maxim@gmail.com',
            'password' => bcrypt('123456'),
            'username' => 'maxim'
        ]);
        DB::table('users')->insert([
            'name' => 'Igor',
            'email' => 'igor@gmail.com',
            'password' => bcrypt('123456'),
            'username' => 'igor'
        ]);
        DB::table('users')->insert([
            'name' => 'Jamal',
            'email' => 'jamal@gmail.com',
            'password' => bcrypt('flocksupport123#'),
            'username' => 'jamal'
        ]);
        DB::table('users')->insert([
            'name' => 'starforce',
            'email' => 'starforce@gmail.com',
            'password' => bcrypt('123456'),
            'username' => 'starforce'
        ]);
    }
}
