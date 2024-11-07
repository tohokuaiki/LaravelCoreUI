# Laravel with CoreUI REACT JS

Laravel administration panel with CoreUI & React.js.

## The products that were used for
- [Laravel](https://laravel.com/)
- [Laravel Breeze](https://github.com/laravel/breeze)
- [Laravel Permission](https://github.com/spatie/laravel-permission) ... only to install not using .
- [CoreUI with React.js templates](https://coreui.io/react/)
- [Free React Admin Template](https://coreui.io/product/free-react-admin-template/)

## Usage

### startup
1. copy ```.env.example ``` to ```.env ``` and generate Laravel application key with ``` php artisan key:generate ``` command
1. setup database environment.
1. database migrate with artisan command. ``` php artisan migrate ```
1. install libraries using ``` composer install ```  and  ``` npm install ```
1. start servers using ``` php artisan serve ``` and ``` npm run dev ```. You can access http://localhost:8000
1. create admin account and login. You can access administration sample panel at http://localhost:8000/coreuiadmin

### Customize

#### ADMIN_PATH
You can change administration path with changing ``` APP_ADMIN_PATH=/coreuiadmin ``` in .env .

#### Adminstration CSS
Change SASS file ``` resources/css/admin.scss ```.   
By default tailwindcss conflicts CoreUI stylesheet, ``` @tailwindcss ``` lines are commented out.
