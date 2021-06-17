<h2>Installation</h2>
<hr />
Clone the repo
Copy .env.example to .env

Configure .env

cd to the repo
Run composer install
Run composer require awobaz/compoships
Run composer require doctrine/dbal:2.9

Run php artisan key:generate

Run php artisan migrate --seed. A user will be seeded so that you can login, where:
Run php artisan passport:install
RUn php artisan serve

Run npm install

Run npm run watch

Or npm run dev
