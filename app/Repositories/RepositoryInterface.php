<?php namespace App\Repositories;

interface RepositoryInterface
{
    /**
     * Get's all posts.
     *
     * @return mixed
     */
    public function all();

    /**
     * Create a model.
     *
     * @param array
     */
    public function create(array $data);

    /**
     * Updates a model.
     *
     * @param int
     * @param array
     */
    public function update(array $data, $id);

    /**
     * Deletes a model.
     *
     * @param int
     */
    public function delete($id);

    /**
     * Show a item by it id.
     *
     * @param int
     * @param array
     */
    public function show($id);
}
