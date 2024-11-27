<?php

namespace App\Models;

use App\Observers\UserObserver;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Image\Enums\Fit;
use Spatie\Permission\Traits\HasRoles;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Permission\Models\Role;

// class User extends Authenticatable implements MustVerifyEmail
#[ObservedBy([UserObserver::class])]
class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasRoles;
    use InteractsWithMedia;

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($user) {
            $user->clearMediaCollection();
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $with = [
        'roles'
    ];

    /**
     * Append attributes
     */
    protected $appends = [
        'profile_image_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'media',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    protected function profileImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getFirstMediaUrl('profile_image', 'icon')
        );
    }


    /**
     * Spatie/MediaLibrary files
     */
    protected $associate_files = [
        'profile_image' => [
            'conversion' => [
                'icon' => [Fit::Contain, 300, 300],
            ],
        ]
    ];


    public function uploadMedia(Request $request, $media_name): void
    {
        if ($profile_image = $request->file($media_name)) {
            $this->clearMediaCollection($media_name);
            $newFileName = Str::random(32) . '.' . $request->file($media_name)->extension();
            $this->addMedia($profile_image)->usingFileName($newFileName)->toMediaCollection($media_name);
        }
    }

    public function registerMediaCollections(): void
    {
        foreach (array_keys($this->associate_files) as $media_name) {
            $this->addMediaCollection($media_name);
        }
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        foreach ($this->associate_files as $media_name => $def) {
            if ($media && $media->collection_name === $media_name) {
                if (isset($def['conversion'])) {
                    foreach ($def['conversion'] as $conversion_name => $conversion_prop) {
                        $this->addMediaConversion($conversion_name)
                            ->fit(...$conversion_prop)
                            ->nonQueued();
                    }
                }
            }
        }
    }
}
