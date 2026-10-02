<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => ['status' => 'ok']);

Route::get('/orders/{id}', function (int $id) {
    abort_if($id === 0, 404);

    return ['id' => $id, 'status' => 'shipped'];
});

Route::get('/boom', function () {
    throw new RuntimeException('kaboom');
});
