<?php

namespace App\Helpers;

use GuzzleHttp\Client;
use GuzzleHttp\Promise;

class SyncDatagraduationGms
{
    public function syncdata($method, $api_url, $params)
    {
        $client = new Client();

        $res = $client->request('POST', 'http://dev1.solashi.com:2288/api/login', [
            "json" => [
                'user_name' => 'thanhcong',
                'password' => 'Admin@123',
            ],
        ]);
        $body = $res->getBody();
        $data = json_decode($body);
        $token = $data->token;

        $syncData = $client->request("$method", "$api_url", [
            "headers" => [
                'Authorization' => "Bearer $token",
            ],
            "query" => $params,
        ])->getBody();

        $result = json_decode($syncData);

        return $result;
    }

    public function syncImage($profile_url)
    {
        $client = new Client(['base_uri' => "http://dev1.solashi.com:2288/"]);

        $promises = [
            'image' => $client->getAsync("/storage/" . "$profile_url"),
        ];
        $image = Promise\settle($promises)->wait();

        $images = $image['image']['value']->getBody();

        return $images;
    }
}
