<?php namespace App\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Contracts\CacheableInterface;
use Prettus\Repository\Traits\CacheableRepository;


class UserRepository extends  BaseRepository  implements CacheableInterface
{
    // Setting the lifetime of the cache to a repository specifically
    protected $cacheMinutes = 90;

    use CacheableRepository;
    /**
     * Specify Model class name
     *
     * @return string
     */
    function model()
    {
        return "App\\Models\\User";
    }

}
