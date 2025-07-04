<?php

namespace App\Http\Controllers\Auth\Azure;

use App\Constants\RoleConstant;
use App\Events\LoginSuccess;
use App\Models\User as ModelUser;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;
use SocialiteProviders\Azure\User;
use Spatie\Permission\Models\Role;
use stdClass;

class OpenIDController
{
    public function create()
    {
        return Inertia::render('Auth/Azure/Login', [
            'error' => ''
        ]);
    }

    public function loginRedirect()
    {
        return  Socialite::driver('azure')->redirect();
    }

    public function callback(): Response | RedirectResponse
    {
        $errors = new stdClass();
        try {
            // 認証成功時の処理
            $this->processLogin(Socialite::driver('azure')->user());
            return redirect(config('app.admin_path'));
        } catch (ClientException $e) {
            // Guzzleのレスポンス本文を全文取得して表示
            $response = $e->getResponse();
            $body = $response ? $response->getBody()->getContents() : 'No response body';
            Log::error('Azure callback Guzzle error: ' . $body);
            $errors = json_decode($body) ?? ['error' => $body];
        } catch (\Exception $e) {
            // その他のエラー
            $errorMessage = $e->getMessage() ?: "Azureにアクセスしていません。";
            $errors->message = $errorMessage;
            Log::error($errors->message);
        }

        return Inertia::render('Auth/Azure/Login', [
            'errors' => $errors
        ]);
    }


    private function processLogin(User $azureUser)
    {
        try {
            $user = ModelUser::where('email' , $azureUser->getEmail())->firstOrFail();
        }
        catch (ModelNotFoundException $e){
            $user = ModelUser::create([
                'email' => $azureUser->getEmail(),
                'name' => $azureUser->getName(),
                'password' => '',
            ]);
            // もし最初のユーザーなら管理者権限を与える
            if ($user->id === 1){
                $adminRole = Role::where('name',RoleConstant::Admin)->first();
                $user->assignRole($adminRole);
            }
        }            
        Auth::login($user, true);
        LoginSuccess::dispatch($user);
    }
}
