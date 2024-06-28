# static

```
npm i -D @sveltejs/adapter-static
```

svelte.config.js
```
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		})
	}
};

export default config;
```


src/routes/+layout.js
```
export const ssr = false;
```


site http://abc.com/SUBDIR olarak sunulacak ise
aşağıdaki şekilde build edilmeli
svelte.config.js
```js
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		paths: {
			base: '/SUBDIR',
		},
	}
};

export default config;
```

rust, actix-web tarafında
```
use actix_cors::Cors;
use actix_files::NamedFile;
use actix_identity::{CookieIdentityPolicy, IdentityService};
use actix_web::{web, App, HttpServer};
use rand::Rng;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    log::info!("Starting HTTP server at http://localhost:8080");

    let pool = db::get_pool().await;

    let identity_private_key = rand::thread_rng().gen::<[u8; 32]>();

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(pool.clone()))
            .wrap(IdentityService::new(
                CookieIdentityPolicy::new(&identity_private_key)
                    .name("auth-cookie")
                    .secure(false),
            ))
            // *** sıra önemli ***
            // önce web service
            // sonra svelte
            // en son catch all
            .configure(service::init)
            .service(actix_files::Files::new("/", "static").index_file("index.html"))
            .default_service(web::to(catch_all))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}

async fn catch_all() -> actix_web::Result<NamedFile> {
    Ok(NamedFile::open("static/index.html")?)
}

```

nginx'te sadece site olarak derlendiğinde çalıştı,
subdir'da çalışmadı örneğin 
http://example.com/app
'ta linkler
/app/user'a değil /user'a gidiyor
```nginx
location / {
    index index.html;
    try_files $uri $uri/ /index.html;
}
```
