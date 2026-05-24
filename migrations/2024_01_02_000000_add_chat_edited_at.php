<?php

declare(strict_types=1);

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('chat_messages', function (Blueprint $table) {
            $table->timestamp('edited_at')->nullable();
            $table->unsignedInteger('edited_user_id')->nullable();
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('chat_messages', function (Blueprint $table) {
            $table->dropColumn('edited_at');
            $table->dropColumn('edited_user_id');
        });
    },
];
