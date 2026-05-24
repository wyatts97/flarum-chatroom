<?php

declare(strict_types=1);

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->text('content');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index('created_at');
            $table->index(['user_id', 'created_at']);
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('chat_messages');
    },
];
